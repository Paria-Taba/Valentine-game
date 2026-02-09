'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuiz } from '@/context/quiz-context';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { apiGet } from '@/lib/couplesQuizApi';
import './css/setup-step.css';
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

  // ✅ stateها باید اینجا باشن
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  // ✅ گرفتن سؤال‌ها از Google Apps Script
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
      } catch (e) {
        console.error('Failed to load questions', e);
      } finally {
        setLoadingQuestions(false);
      }
    };

    loadQuestions();
  }, [language]);

  if (!session || !userRole) return null;

  if (loadingQuestions) {
    return <div>Loading questions...</div>;
  }

  // ✅ انتخاب سؤال‌های مربوط به session
  const relevantQuestions = useMemo(() => {
    if (!session?.questionIds) return [];
    return session.questionIds
      .map(id => questions.find(q => q.id === id))
      .filter(Boolean);
  }, [session?.questionIds, questions]);

  const partnerName = userRole === 'A' ? session.userBName : session.userAName;

  const totalQuestionsPerPart = relevantQuestions.length;
  if (totalQuestionsPerPart === 0) {
    return <div>{t.noQuestionsError[language]}</div>;
  }

  const totalQuestions = totalQuestionsPerPart * 2;
  const currentQuestionIndex = userAnswers.length;

  if (currentQuestionIndex >= totalQuestions) {
    return null;
  }

  const isSelfQuestionPart = currentQuestionIndex < totalQuestionsPerPart;
  const questionDataIndex = isSelfQuestionPart
    ? currentQuestionIndex
    : currentQuestionIndex - totalQuestionsPerPart;

  const questionInfo = relevantQuestions[questionDataIndex];
  if (!questionInfo) {
    return <div>Loading question...</div>;
  }

  // ✅ متن سؤال (دیگه language object نیست)
  const questionText = isSelfQuestionPart
    ? questionInfo.selfQuestion
    : questionInfo.guessQuestion.replace('{partnerName}', partnerName);

  const questionTitle = isSelfQuestionPart
    ? t.selfQuestionTitle[language]
    : t.partnerQuestionTitle[language].replace('{partnerName}', partnerName);

  // ✅ گزینه‌ها از API
  const options = [
    questionInfo.option1,
    questionInfo.option2,
    questionInfo.option3,
    questionInfo.option4,
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedAnswers.length > 0) {
      addAnswer({
        questionId: questionInfo.id,
        topic: questionInfo.topic,
        question: questionText,
        questionType: isSelfQuestionPart ? 'self' : 'guess',
        answer: selectedAnswers[0],
      });

      setSelectedAnswers([]);
    }
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
            <Card className="w-full animate-fade-in-up">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-primary span-cart">
                    {questionInfo.topic}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t.questionProgress[language]
                      .replace('{current}', String(currentQuestionIndex + 1))
                      .replace('{total}', String(totalQuestions))}
                  </span>
                </div>

                <CardTitle className="font-headline text-2xl cart-title">
                  {questionTitle}
                </CardTitle>
                <CardDescription className="pt-2 text-lg cart-description">
                  {questionText}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="input-flex">
                    {options.map(option => (
                      <Button
                        key={option}
                        type="button"
                        variant={
                          selectedAnswers.includes(option)
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() => setSelectedAnswers([option])}
                        className="h-auto justify-start whitespace-normal py-3 text-left"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </form>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={handleSubmit}
                  type="submit"
                  className="w-full"
                  disabled={selectedAnswers.length === 0}
                >
                  {t.continueButton[language]}{' '}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="process">
          <Card>
            <CardContent className="space-y-3 p-4">
              <div>
                <div className="mb-1 flex justify-between">
                  <label className="text-sm font-medium label">
                    {t.yourProgress[language]}
                  </label>
                  <span className="text-sm text-muted-foreground label">
                    {userAnswers.length}/{totalQuestions}
                  </span>
                </div>
                <Progress value={userProgress} />
              </div>

              <div>
                <div className="mb-1 flex justify-between">
                  <label className="text-sm font-medium label">
                    {t.partnerProgress[language].replace(
                      '{partnerName}',
                      partnerName
                    )}
                  </label>
                  <span className="text-sm text-muted-foreground label">
                    {partnerAnswers.length}/{totalQuestions}
                  </span>
                </div>
                <Progress value={partnerProgress} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
