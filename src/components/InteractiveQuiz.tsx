'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Question {
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    text: "What is your primary goal for using Neville Goddard's teachings?",
    options: ["Manifesting material desires", "Spiritual growth", "Improving relationships", "Career advancement"]
  },
  {
    text: "How comfortable are you with visualization?",
    options: ["Very comfortable", "Somewhat comfortable", "Not very comfortable", "I struggle with visualization"]
  },
  {
    text: "Which aspect of life do you most want to improve?",
    options: ["Finances", "Health", "Relationships", "Personal growth"]
  },
  {
    text: "How do you prefer to practice manifestation techniques?",
    options: ["Before sleep", "Throughout the day", "During meditation", "Whenever I feel inspired"]
  },
  {
    text: "What's your current level of familiarity with Neville Goddard's work?",
    options: ["Complete beginner", "Some knowledge", "Intermediate", "Advanced practitioner"]
  }
];

interface Result {
  technique: string;
  concepts: string[];
}

const getResult = (answers: string[]): Result => {
  const technique = answers[1] === "Very comfortable" || answers[1] === "Somewhat comfortable"
    ? "Visualization Technique"
    : "SATS (State Akin to Sleep) Technique";

  const concepts = [
    answers[0] === "Spiritual growth" ? "Living in the End" : "Law of Assumption",
    answers[3] === "Before sleep" ? "Revision Technique" : "I AM Meditation"
  ];

  return { technique, concepts };
};

export function InteractiveQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [result, setResult] = useState<Result | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    if (isHovered) {
      window.addEventListener('mousemove', updateMousePosition);
    }

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [isHovered]);

  const getGradient = () => {
    if (!isHovered) return 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)';
    const x = (mousePosition.x / cardRef.current!.offsetWidth) * 100;
    const y = (mousePosition.y / cardRef.current!.offsetHeight) * 100;
    return `radial-gradient(circle at ${x}% ${y}%, #2a2a2a 0%, #1a1a1a 50%)`;
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setResult(getResult(newAnswers));
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card
      ref={cardRef}
      className="text-white shadow-lg overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        background: getGradient(),
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-6">
        <CardTitle className="text-2xl font-serif font-bold text-primary">Neville Goddard Technique Finder</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Progress value={progress} className="mb-5 bg-black bg-opacity-20" style={{ height: '4px' }} />
        {!result ? (
          <div className="bg-black bg-opacity-20 p-5 rounded-md mb-4 transition-all duration-300 hover:transform hover:scale-105 hover:bg-opacity-30 hover:shadow-[0_0_3px_1px_rgba(255,255,255,0.3)]">
            <h3 className="font-serif font-semibold text-white text-xl mb-4">{questions[currentQuestion].text}</h3>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left text-gray-300 font-sans text-base bg-black bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-[0_0_3px_1px_rgba(255,255,255,0.3)]"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-black bg-opacity-20 p-5 rounded-md transition-all duration-300 hover:transform hover:scale-105 hover:bg-opacity-30 hover:shadow-[0_0_3px_1px_rgba(255,255,255,0.3)]">
            <h3 className="font-serif font-semibold text-white text-xl mb-4">Your Personalized Results</h3>
            <p className="text-gray-300 font-sans text-base mb-2">Recommended Technique:</p>
            <p className="text-white font-semibold text-lg mb-4">{result.technique}</p>
            <p className="text-gray-300 font-sans text-base mb-2">Key Concepts to Explore:</p>
            <ul className="list-disc list-inside text-white mb-4">
              {result.concepts.map((concept, index) => (
                <li key={index} className="text-base">{concept}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}