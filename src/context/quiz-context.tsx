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

/* ------------------ helpers ------------------ */
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/* ------------------ types ------------------ */
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

/* ------------------ provider ------------------ */
export function QuizProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'A' | 'B' | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isReadyForReads, setIsReadyForReads] = useState(false);

  // 🌍 default language = English
  const [localLanguage, setLocalLanguage] = useState<'de' | 'en'>('en');

  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const firestore = useFirestore();
  const auth = useAuth();
  const { user: authUser, isUserLoading } = useUser();

  /* -------- join session -------- */
  const joinSession = useCallback((sid: string, role: 'A' | 'B') => {
    setSessionId(sid);
    setUserRole(role);
  }, []);

  /* -------- auth + session prep -------- */
  useEffect(() => {
    const prepareSession = async () => {
      if (!sessionId || !userRole || !auth || !firestore) return;

      let user = auth.currentUser;
      if (!user) {
        setIsJoining(true);
        const cred = await signInAnonymously(auth);
        user = cred.user;
      }

      if (userRole === 'B') {
        try {
          await updateDoc(doc(firestore, 'sessions', sessionId), {
            userBId: user.uid,
          });
        } catch {
          /* ignore if already joined */
        }
      }

      setIsReadyForReads(true);
      setIsJoining(false);
    };

    prepareSession();
  }, [sessionId, userRole, auth, firestore]);

  /* -------- firestore refs -------- */
  const sessionRef = useMemoFirebase(
    () => (isReadyForReads && sessionId ? doc(firestore, 'sessions', sessionId) : null),
    [firestore, sessionId, isReadyForReads]
  );

  const answersRef = useMemoFirebase(
    () =>
      isReadyForReads && sessionId
        ? collection(firestore, 'sessions', sessionId, 'answers')
        : null,
    [firestore, sessionId, isReadyForReads]
  );

  const { data: session, isLoading: isLoadingSession } =
    useDoc<QuizSession>(sessionRef);

  const { data: answers } = useCollection<Answer>(answersRef);

  /* -------- answers split -------- */
  const [userAnswers, partnerAnswers] = useMemo(() => {
    if (!answers || !userRole || !session) return [[], []];

    const myId = userRole === 'A' ? session.userAId : session.userBId;
    const partnerId = userRole === 'A' ? session.userBId : session.userAId;

    return [
      answers.filter(a => a.userId === myId),
      answers.filter(a => a.userId === partnerId),
    ];
  }, [answers, userRole, session]);

  /* -------- language -------- */
  const language = session?.language || localLanguage;

  const setLanguage = useCallback(
    (lang: 'de' | 'en') => {
      setLocalLanguage(lang);
      if (sessionRef) updateDoc(sessionRef, { language: lang });
    },
    [sessionRef]
  );

  /* -------- create session -------- */
  const createSession = useCallback(
    async (userAName: string, userBName: string) => {
      let user = auth.currentUser;
      if (!user) {
        const cred = await signInAnonymously(auth);
        user = cred.user;
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

      const ref = await addDoc(collection(firestore, 'sessions'), newSession);
      return ref.id;
    },
    [auth, firestore, localLanguage]
  );

  /* -------- relationship -------- */
  const setRelationship = useCallback(
    async (relationship: string) => {
      if (!sessionRef) return;

      const normalized =
        relationship === 'Frisch verliebt' ? 'Dating' : relationship;

      const questions = QUIZ_QUESTIONS.filter(q =>
        q.relationships.includes(normalized) ||
        q.relationships.includes('Anderes')
      );

      const selected = shuffleArray(questions).slice(0, 10);
      await updateDoc(sessionRef, {
        relationship,
        questionIds: selected.map(q => q.id),
      });
    },
    [sessionRef]
  );

  /* -------- add answer (FIXED) -------- */
  const addAnswer = useCallback(
    async (answer: Omit<Answer, 'userId' | 'sessionId' | 'id'>) => {
      if (!answersRef || !authUser || !sessionId) return;

      await addDoc(answersRef, {
        ...answer,
        userId: authUser.uid,
        sessionId,
      });
    },
    [answersRef, authUser, sessionId]
  );

  /* -------- provider -------- */
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

/* ------------------ hook ------------------ */
export function useQuiz(): QuizContextType {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used inside QuizProvider');
  return ctx;
}
