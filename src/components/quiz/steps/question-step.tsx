'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuiz } from '@/context/quiz-context';
import { apiGet } from '@/lib/couplesQuizApi';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { translations } from '@/lib/translations';
import ValentineBackground from '@/components/ValentineBackground';
import { QuizSidebar } from '../quiz-sidebar';
import './css/setup-step.css';

export function QuestionStep() {
  const {
    session,
    userAnswers,
    partnerAnswers,
    userRole,
    addAnswer,
    language,
  } = useQuiz();

  const t = translations;

  // ✅ ALL hooks first (no conditions)
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const res = await apiGet({
          action: 'getQuestions',
          language,
        });

        if (res.success) {
          setQuestions(res.questions);
        }
      } catch (err) {
        console.error('Failed to fetch questions', err);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [language]);

  // ✅ useMemo MUST be before any return
  const relevantQuestions = useMemo(() => {
    if (session?.questionIds?.length) {
      return session.questionIds
        .map(id => questions.find(q => q.id === id))
        .filter(Boolean);
    }
    return questions.slice(0, 10); // fallback
  }, [session?.questionIds, questions]);

  // ✅ now safe to early-return
  if (!session || !userRole) return null;
  if (loading) return <div>Loading questions...</div>;

  const totalQuestionsPerPart = relevantQuestions.length;
  if (totalQuestionsPerPart === 0) {
    return <div>{t.noQuestionsError[language]}</div>;
  }

  const totalQuestions = totalQuestionsPerPart * 2;
  const currentIndex = userAnswers.length;
  if (currentIndex >= totalQuestions) return null;

  const isSelfPart = currentIndex < totalQuestionsPerPart;
  const questionIndex = isSelfPart
    ? currentIndex
    : currentIndex - totalQuestionsPerPart;

  const question = relevantQuestions[questionIndex];
  if (!question) return <div>Loading question...</div>;

  const partnerName =
    userRole === 'A' ? session.userBName : session.userAName;

  const questionText = isSelfPart
    ? question.selfQuestion
    : question.guessQuestion.replace('{partnerName}', partnerName);

  const questionTitle = isSelfPart
    ? t.selfQuestionTitle[language]
    : t.partnerQuestionTitle[language].replace('{partnerName}', partnerName);

  const options = [
    question.option1,
    question.option2,
    question.option3,
    question.option4,
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnswer) return;

  addAnswer({
  questionId: question.id,
  topic: 'quiz',
  question: questionText,
  questionType: isSelfPart ? 'self' : 'guess',
  answer: selectedAnswer,
});

    setSelectedAnswer(null);
  };

  const userProgress = (userAnswers.length / totalQuestions) * 100;
  const partnerProgress = (partnerAnswers.length / totalQuestions) * 100;

  return (
    <div className="question-row">
      <ValentineBackground />
      <QuizSidebar />

      <div className="question-div">
        <div className="container-cart question-margin">
          <div className="mx-auto w-full max-w-2xl space-y-6">
            <Card>
              <CardHeader>
                <div className="mb-2 flex justify-between">
                  <span>{question.topic}</span>
                  <span>
                    {currentIndex + 1}/{totalQuestions}
                  </span>
                </div>
                <CardTitle>{questionTitle}</CardTitle>
                <CardDescription>{questionText}</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="input-flex">
                    {options.map(option => (
                      <Button
                        key={option}
                        type="button"
                        variant={
                          selectedAnswer === option
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() => setSelectedAnswer(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </form>
              </CardContent>

              <CardFooter>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                >
                  {t.continueButton[language]}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
<div className='process'>
			<Card>
			<CardContent className="space-y-3 p-4">
			<div>
			<div className="mb-1 flex justify-between">
			<label className="text-sm font-medium label">{t.yourProgress[language]}</label>
			<span className="text-sm text-muted-foreground label">
			{userAnswers.length}/{totalQuestions}
			</span>
			</div>
			<Progress value={userProgress} />
			</div>
			<div>
			<div className="mb-1 flex justify-between">
			<label className="text-sm font-medium label">
			{t.partnerProgress[language].replace('{partnerName}', partnerName)}
			</label>
			<span className="text-sm text-muted-foreground label">
			{partnerAnswers.length}/{totalQuestions}
			</span>
			</div>
			<Progress value={partnerProgress} />
			</div>
			{partnerAnswers.length > userAnswers.length && (
				<p className="pt-2 text-center text-xs text-muted-foreground">
				{t.partnerAhead[language].replace('{partnerName}', partnerName)}
				</p>
			)}
			</CardContent>
			</Card></div>
      </div>
    </div>
  );
}
