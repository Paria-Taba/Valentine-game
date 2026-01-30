'use client';

import { useState, useMemo } from 'react';
import { useQuiz } from '@/context/quiz-context';
import { QUIZ_QUESTIONS } from '@/lib/quiz-data';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import "./css/setup-step.css"
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

export function QuestionStep() {
	const {
		session,
		userAnswers,
		partnerAnswers,
		userRole,
		addAnswer,
		language,
	} = useQuiz();
	const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
	const t = translations;
	
	const relevantQuestions = useMemo(() => {
		if (!session?.questionIds) return [];
		return session.questionIds
		.map(id => QUIZ_QUESTIONS.find(q => q.id === id))
		.filter(Boolean);
	}, [session?.questionIds]);
	
	if (!session || !userRole) return null;
	
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
		// This can happen briefly while questions are being selected
		return <div>Loading question...</div>;
	}
	
	const questionText = isSelfQuestionPart
	? questionInfo.selfQuestion[language]
	: questionInfo.guessQuestion[language].replace('{partnerName}', partnerName);
	
	const questionTitle = isSelfQuestionPart
	? t.selfQuestionTitle[language]
	: t.partnerQuestionTitle[language].replace('{partnerName}', partnerName);
	
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (selectedAnswers.length > 0) {
			addAnswer({
				questionId: questionInfo.id,
				topic: questionInfo.topic,
				question: isSelfQuestionPart ? questionInfo.selfQuestion[language] : questionInfo.guessQuestion[language],
				questionType: isSelfQuestionPart ? 'self' : 'guess',
				answer: selectedAnswers.join(', '),
			});
			setSelectedAnswers([]);
		}
	};
	
	const userProgress = (userAnswers.length / totalQuestions) * 100;
	const partnerProgress = (partnerAnswers.length / totalQuestions) * 100;
	
	return (
		<div className='question-div'>
		<div className='container-cart question-margin'>
		<div className="mx-auto w-full max-w-2xl space-y-6 ">
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
			{questionInfo.options.map((option) => (
				<Button
				key={option.de}
				type="button"
				variant={
					selectedAnswers.includes(option[language]) ? 'default' : 'outline'
				}
				onClick={() => setSelectedAnswers([option[language]])} // Single choice
				className="h-auto justify-start whitespace-normal py-3 text-left"
				>
				{option[language]}
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
			{t.continueButton[language]} <ArrowRight className="ml-2 h-4 w-4" />
			</Button>
			</CardFooter>
			</Card>
			
			</div></div><div className='process'>
			<Card>
			<CardContent className="space-y-3 p-4">
			<div>
			<div className="mb-1 flex justify-between">
			<label className="text-sm font-medium">{t.yourProgress[language]}</label>
			<span className="text-sm text-muted-foreground">
			{userAnswers.length}/{totalQuestions}
			</span>
			</div>
			<Progress value={userProgress} />
			</div>
			<div>
			<div className="mb-1 flex justify-between">
			<label className="text-sm font-medium">
			{t.partnerProgress[language].replace('{partnerName}', partnerName)}
			</label>
			<span className="text-sm text-muted-foreground">
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
			
		);
	}
	