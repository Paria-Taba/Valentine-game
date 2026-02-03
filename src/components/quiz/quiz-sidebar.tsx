'use client';

import { useState } from 'react';
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
import Link from 'next/link';
import { translations } from '@/lib/translations';
import "./steps/css/setup-step.css";

export function QuizSidebar() {
  const { session, userRole, language } = useQuiz();
  const t = translations;

  const [copied, setCopied] = useState<null | 'partner' | 'mine'>(null);

  if (!session || !userRole) return null;

  const partnerRole = userRole === 'A' ? 'B' : 'A';
  const myName = userRole === 'A' ? session.userAName : session.userBName;
  const partnerName = userRole === 'A' ? session.userBName : session.userAName;

  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : '';

  const myLink = `${baseUrl}/quiz/${session.id}/${userRole}`;
  const partnerLink = `${baseUrl}/quiz/${session.id}/${partnerRole}`;

  const copyToClipboard = (text: string, type: 'partner' | 'mine') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const shareOnWhatsApp = () => {
    const message = t.whatsAppMessage[language]
      .replace('{partnerName}', partnerName)
      .replace('{userName}', myName)
      .replace('{link}', partnerLink);

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <aside className="aside">
      <div>
        <div className="flex items-left mb-6 icon-row">
          <h1 className="text-xl font-bold font-headline">QuizConnect</h1>
          <QuizConnectLogo className="h-8 w-8 text-primary" />
        </div>

        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" onClick={shareOnWhatsApp}>
            <Share2 className="mr-2 h-4 w-4" />
            {t.invitePartner[language]}
          </Button>

          <div>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => copyToClipboard(partnerLink, 'partner')}
            >
              <Copy className="mr-2 h-4 w-4" />
              {t.copyPartnerLink[language]}
            </Button>
            {copied === 'partner' && (
              <p className="text-xs text-green-600 ml-8 mt-1 copy-link">
                {t.linkCopiedInline[language]}
              </p>
            )}
          </div>

          <div>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => copyToClipboard(myLink, 'mine')}
            >
              <Copy className="mr-2 h-4 w-4" />
              {t.copyMyLink[language]}
            </Button>
            {copied === 'mine' && (
              <p className="text-xs text-green-600 ml-8 mt-1 copy-link">
                {t.linkCopiedInline[language]}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <Separator className="my-4 seperate" />
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
