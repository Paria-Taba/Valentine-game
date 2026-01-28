'use client';

import {
  Copy,
  FileText,
  Info,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { QuizConnectLogo } from '@/components/icons';
import { useQuiz } from '@/context/quiz-context';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { translations } from '@/lib/translations';

export function QuizSidebar() {
  const { session, userRole, language } = useQuiz();
  const { toast } = useToast();
  const t = translations;

  if (!session || !userRole) {
    return null;
  }
  
  const partnerRole = userRole === 'A' ? 'B' : 'A';
  const myName = userRole === 'A' ? session.userAName : session.userBName;
  const partnerName = userRole === 'A' ? session.userBName : session.userAName;

  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : '';
  
  const myLink = `${baseUrl}/quiz/${session.id}/${userRole}`;
  const partnerLink = `${baseUrl}/quiz/${session.id}/${partnerRole}`;


  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: t.copiedToastTitle[language],
        description: label,
      });
    });
  };

  const shareOnWhatsApp = () => {
    const message = t.whatsAppMessage[language]
      .replace('{partnerName}', partnerName)
      .replace('{userName}', myName)
      .replace('{link}', partnerLink);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <aside className="w-64 bg-card p-4 flex-col justify-between hidden md:flex">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <QuizConnectLogo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold font-headline">QuizConnect</h1>
        </div>
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={shareOnWhatsApp}
          >
            <Share2 className="mr-2 h-4 w-4" />
            {t.invitePartner[language]}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => copyToClipboard(partnerLink, t.copiedPartnerLinkToast[language])}
          >
            <Copy className="mr-2 h-4 w-4" />
            {t.copyPartnerLink[language]}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => copyToClipboard(myLink, t.copiedMyLinkToast[language])}
          >
            <Copy className="mr-2 h-4 w-4" />
            {t.copyMyLink[language]}
          </Button>
        </div>
      </div>
      <div>
        <Separator className="my-4" />
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="#tutorial">
              <Info className="mr-2 h-4 w-4" />
              {t.tutorial[language]}
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="#impressum">
              <FileText className="mr-2 h-4 w-4" />
              {t.imprint[language]}
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
