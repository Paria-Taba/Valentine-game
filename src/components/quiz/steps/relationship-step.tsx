'use client';

import { useQuiz } from '@/context/quiz-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { translations } from '@/lib/translations';
import "./css/setup-step.css"
import "./../../ValentineBackground"
import ValentineBackground from './../../ValentineBackground';

const relationshipOptions = [
  'Liebespaar',
  'Verheiratet',
  'Frisch verliebt',
  'Beste Freunde',
  'Arbeitskollegen',
  'Anderes',
];

export function RelationshipStep() {
  const { setRelationship, session, language } = useQuiz();
  const [selectedValue, setSelectedValue] = useState('');
  const t = translations;

  if (!session) return null;

  const handleSubmit = () => {
    if (selectedValue) {
      setRelationship(selectedValue);
    }
  };

  return (
	<div className='relation-center'>
		 <ValentineBackground />
	<div className='container-cart relation-margin'>
		<Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-center font-headline text-2xl cart-title">
          {t.relationshipTitle[language]}
        </CardTitle>
        <CardDescription className="text-center cart-description">
          {t.relationshipDescription[language]
            .replace('{currentUser}', session.userAName)
            .replace('{partnerUser}', session.userBName)}
        </CardDescription>
      </CardHeader>
      <CardContent>
		
			<RadioGroup
          value={selectedValue}
          onValueChange={setSelectedValue}
          className="space-y-4 radio-div"
        >
          {relationshipOptions.map((option) => (
            <div key={option} className="flex items-center space-x-3 bg-secondary p-3 rounded-md">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className="text-base cursor-pointer flex-1">
                {t.relationshipOptions[option as keyof typeof t.relationshipOptions][language]}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full" disabled={!selectedValue}>
          {t.startQuizButton[language]}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
	</div></div>
    
  );
}
