'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuiz } from '@/context/quiz-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Copy, Eye, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { translations } from '@/lib/translations';
import ValentineBackground from '@/components/ValentineBackground';
import { apiGet } from '@/lib/couplesQuizApi';
import { AnalysisStep } from './analysis-step';

export function ResultsStep() {
  const { session, sessionId, language } = useQuiz();
  const { toast } = useToast();
  const t = translations;

  const [imageData, setImageData] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const loadImage = async () => {
      try {
        const res = await apiGet({
          action: 'getImage',
          sessionId,
        });

        if (res.success) {
          setImageData(res.imageData);
        }
      } catch (e) {
        console.error('Image load failed', e);
      }
    };

    loadImage();
  }, [sessionId]);

  if (!session) return null;

  const resultLink =
    typeof window !== 'undefined' ? window.location.href : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultLink).then(() => {
      toast({
        title: t.copiedToastTitle[language],
        description: t.copiedToastDescription[language],
      });
    });
  };

  const shareOnWhatsApp = () => {
    const message = t.shareMessage[language].replace('{link}', resultLink);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div>
      <ValentineBackground />

      <div className="container-cart result-div">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <Card className="overflow-hidden animate-fade-in">
            <CardHeader className="text-center margin">
              <CardTitle className="font-headline text-3xl">
                {t.resultsTitle[language]}
              </CardTitle>
              <CardDescription>
                {t.resultsScore[language]
                  .replace('{score}', String(session.matchCount ?? 0))
                  .replace('{total}', '20')}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {session.generatedStory && (
                <p className="text-center text-muted-foreground story-margin">
                  {session.generatedStory}
                </p>
              )}

              {imageData && (
                <div className="mt-6">
                  <img
                    src={imageData}
                    alt="Result"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              )}
            </CardContent>

            <CardFooter className="flex-col sm:flex-row gap-2">
              <Button onClick={shareOnWhatsApp} className="w-full sm:flex-1">
                <Share2 className="mr-2 h-4 w-4" />
                {t.share[language]}
              </Button>

              <Button
                onClick={copyToClipboard}
                variant="secondary"
                className="w-full sm:flex-1"
              >
                <Copy className="mr-2 h-4 w-4" />
                {t.copyLink[language]}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:flex-1">
                    <Eye className="mr-2 h-4 w-4" />
                    {t.viewAnalysis[language]}
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-3xl h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>
                      {t.analysisTitle[language]}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="overflow-y-auto pr-4 -mr-4">
                    <AnalysisStep />
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
