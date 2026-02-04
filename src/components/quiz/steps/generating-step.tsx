'use client';

import { useEffect, useState } from 'react';
import { useQuiz } from '@/context/quiz-context';
import { generateSharedImage } from '@/ai/flows/generate-shared-image';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { translations } from '@/lib/translations';

import "./css/setup-step.css"
import ValentineBackground from '@/components/ValentineBackground';

export function GeneratingStep() {
	const { session, userAnswers, partnerAnswers, userRole, setGeneratedImage, generatedImageUrl, language } = useQuiz();
	const [error, setError] = useState<string | null>(null);
	const t = translations;
	
	useEffect(() => {
		// Only user A should generate the image to avoid duplicate calls.
		// Also check the local generatedImageUrl state to prevent re-generation.
		if (userRole !== 'A' || !session || !userAnswers || !partnerAnswers || session.generatedImageUrl || generatedImageUrl) return;
		
		const generate = async () => {
			try {
				const userAAnswersText = (userRole === 'A' ? userAnswers : partnerAnswers).map(ans => ans.answer);
				const userBAnswersText = (userRole === 'A' ? partnerAnswers : userAnswers).map(ans => ans.answer);
				
				const result = await generateSharedImage({
					userAName: session.userAName,
					userBName: session.userBName,
					userAAnswers: userAAnswersText,
					userBAnswers: userBAnswersText,
				});
				
				if (result.imageUrl) {
					setGeneratedImage(result.imageUrl); // This now updates the local context state
				} else {
					throw new Error('AI did not return an image URL.');
				}
			} catch (e) {
				console.error('Image generation failed:', e);
				setError(t.generationError[language]);
			}
		};
		
		generate();
	}, [session, userAnswers, partnerAnswers, userRole, setGeneratedImage, generatedImageUrl, language, t.generationError]);
	
	return (<div >
		<ValentineBackground />
		<div className='container-cart generating-div'>
		
		<Card className="w-full max-w-md mx-auto animate-fade-in">
		<CardHeader>
		<CardTitle className="text-center">{t.generatingTitle[language]}</CardTitle>
		</CardHeader>
		<CardContent className="flex flex-col items-center justify-center space-y-6 p-10">
		<Loader2 className="h-16 w-16 animate-spin text-primary" />
		<p className="text-center text-muted-foreground">
		{t.generatingDescription[language]}
		</p>
		{error && (
			<Alert variant="destructive">
			<Terminal className="h-4 w-4 " />
			<AlertTitle>{t.errorTitle[language]}</AlertTitle>
			<AlertDescription>{error}</AlertDescription>
			</Alert>
		)}
		</CardContent>
		</Card>
		</div>
		</div>
		
		
	);
}
