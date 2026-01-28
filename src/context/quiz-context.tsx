'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';
import {
  doc,
  collection,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import {
  useFirestore,
  useAuth,
  useUser,
  useDoc,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import type { QuizSession, Answer } from '@/lib/types';
import { QUIZ_QUESTIONS } from '@/lib/quiz-data';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface QuizContextType {
  session: QuizSession | null;
  isLoadingSession: boolean;
  isJoining: boolean;
  userRole: 'A' | 'B' | null;
  userAnswers: Answer[];
  partnerAnswers: Answer[];
  language: 'de' | 'en';
  setLanguage: (language: 'de' | 'en') => void;
  generatedImageUrl: string | null;
  createSession: (userAName: string, userBName: string) => Promise<string>;
  joinSession: (sessionId: string, role: 'A' | 'B') => void;
  setRelationship: (relationship: string) => void;
  addAnswer: (answer: Omit<Answer, 'userId' | 'sessionId' | 'id'>) => void;
  setGeneratedImage: (imageUrl: string) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'A' | 'B' | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isReadyForReads, setIsReadyForReads] = useState(false);
  const [localLanguage, setLocalLanguage] = useState<'de' | 'en'>('de');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const firestore = useFirestore();
  const auth = useAuth();
  const { user: authUser, isUserLoading } = useUser();

  const joinSession = useCallback((sid: string, role: 'A' | 'B') => {
    setSessionId(sid);
    setUserRole(role);
  }, []);

  useEffect(() => {
    const prepareSession = async () => {
      if (!sessionId || !userRole || !auth || !firestore) return;

      let user = auth.currentUser;
      if (!user) {
        try {
          setIsJoining(true);
          const userCredential = await signInAnonymously(auth);
          user = userCredential.user;
        } catch (error) {
          console.error("Anonymous sign-in failed:", error);
          setIsJoining(false);
          return;
        }
      }

      if (userRole === 'B') {
        setIsJoining(true);
        try {
          const sessionDocRef = doc(firestore, 'sessions', sessionId);
          await updateDoc(sessionDocRef, { userBId: user.uid });
        } catch (error) {
          console.warn("Attempt to join as User B failed (maybe already joined):", error);
        }
      }
      
      setIsReadyForReads(true);
      setIsJoining(false);
    };

    prepareSession();
  }, [sessionId, userRole, auth, firestore]);

  const sessionRef = useMemoFirebase(() => (isReadyForReads && sessionId) ? doc(firestore, 'sessions', sessionId) : null, [firestore, sessionId, isReadyForReads]);
  const answersRef = useMemoFirebase(() => (isReadyForReads && sessionId) ? collection(firestore, 'sessions', sessionId, 'answers') : null, [firestore, sessionId, isReadyForReads]);

  const { data: session, isLoading: isLoadingSession, error: sessionError } = useDoc<QuizSession>(sessionRef);
  const { data: answers, error: answersError } = useCollection<Answer>(answersRef);

  const [userAnswers, partnerAnswers] = useMemo(() => {
    if (!answers || !userRole || !session) return [[], []];
    const myId = userRole === 'A' ? session.userAId : session.userBId;
    const partnerId = userRole === 'A' ? session.userBId : session.userAId;
    
    const uAnswers = answers.filter(a => a.userId === myId);
    const pAnswers = answers.filter(a => a.userId === partnerId);
    
    return [uAnswers, pAnswers];
  }, [answers, userRole, session]);

  const language = session?.language || localLanguage;

  const setLanguage = useCallback((lang: 'de' | 'en') => {
    setLocalLanguage(lang);
    if (sessionRef) {
      updateDoc(sessionRef, { language: lang });
    }
  }, [sessionRef]);

  const createSession = useCallback(async (userAName: string, userBName: string): Promise<string> => {
    try {
      let user = auth.currentUser;
      if (!user) {
          const userCredential = await signInAnonymously(auth);
          user = userCredential.user;
      }

      const newSession: Omit<QuizSession, 'id'> = {
        userAName,
        userBName,
        userAId: user.uid,
        userBId: null,
        relationship: '',
        questionIds: [],
        generatedImageUrl: null,
        createdAt: Date.now(),
        language: localLanguage,
      };
      
      const sessionCollection = collection(firestore, 'sessions');
      const docRef = await addDoc(sessionCollection, newSession);
      
      return docRef.id;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  }, [auth, firestore, localLanguage]);
  
  const setRelationship = useCallback(async (relationship: string) => {
    if (!sessionRef) return;
    
    const relationshipFilter = relationship === 'Frisch verliebt' ? 'Dating' : relationship;
    const allRelevantQuestions = QUIZ_QUESTIONS.filter(
      (q) =>
        q.relationships.includes(relationshipFilter) ||
        q.relationships.includes('Anderes')
    );
    const shuffled = shuffleArray(allRelevantQuestions);
    const questionCount = Math.min(10, shuffled.length);
    const selectedQuestions = shuffled.slice(0, questionCount);
    const questionIds = selectedQuestions.map(q => q.id);

    await updateDoc(sessionRef, { relationship, questionIds });
  }, [sessionRef]);

  const addAnswer = useCallback(async (answer: Omit<Answer, 'userId' | 'sessionId' | 'id'>) => {
    if (!answersRef || !authUser) return;
    const finalAnswer: Omit<Answer, 'id'> = {
      ...answer,
      userId: authUser.uid,
      sessionId: answersRef.parent.id,
    };
    await addDoc(answersRef, finalAnswer);
  }, [answersRef, authUser]);

  useEffect(() => {
    if (sessionError) console.error("Session fetch error:", sessionError);
    if (answersError) console.error("Answers fetch error:", answersError);
  }, [sessionError, answersError]);

  return (
    <QuizContext.Provider
      value={{
        session,
        isLoadingSession: isLoadingSession || isUserLoading || isJoining,
        isJoining,
        userRole,
        userAnswers,
        partnerAnswers,
        language,
        setLanguage,
        generatedImageUrl,
        createSession,
        joinSession,
        setRelationship,
        addAnswer,
        setGeneratedImage: setGeneratedImageUrl,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz(): QuizContextType {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
