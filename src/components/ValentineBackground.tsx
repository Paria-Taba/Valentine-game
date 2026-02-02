'use client';

import React, { useEffect, useState } from 'react';
import '@/components/quiz/steps/css/valentine.css';

type HeartStyle = {
  left: string;
  top: string;
  transform: string;
  animationDuration: string;
};

const HEART_COUNT = 20;

export default function ValentineBackground() {
  const [hearts, setHearts] = useState<HeartStyle[]>([]);

  useEffect(() => {
    const generatedHearts: HeartStyle[] = Array.from({
      length: HEART_COUNT,
    }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      // ❤️ بزرگ‌تر شدن قلب‌ها
      transform: `scale(${Math.random() * 0.7 + 1.1}) rotate(45deg)`,
      animationDuration: `${Math.random() * 6 + 8}s`,
    }));

    setHearts(generatedHearts);
  }, []);

  return (
    <div className="valentine-bg">
      {hearts.map((style, i) => (
        <span key={i} className="heart" style={style} />
      ))}
    </div>
  );
}
