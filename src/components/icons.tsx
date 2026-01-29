import type { SVGProps } from 'react';

export function QuizConnectLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="3em"
      height="3em"
      {...props}
    >
      <path
        d="M30,15 C45,5 55,5 70,15 C85,25 85,40 70,50 L50,70 L30,50 C15,40 15,25 30,15 Z"
         stroke="#7e6ec5"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30,55 C15,65 15,80 30,90 C45,100 55,100 70,90 C85,80 85,65 70,55 L50,35"
        stroke="#7e6ec5"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
