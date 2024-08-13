'use client';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';

interface ConceptProps {
  name: string;
  explanation: string;
  keyPoints: string[];
  applicationTip: string;
}

export function ConceptOfTheDay({ name, explanation, keyPoints, applicationTip }: ConceptProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
      <CardContent className="p-6">
        <h2 className="text-2xl font-serif font-bold text-primary mb-6">Random Concept</h2>
        <h3 className="text-xl font-serif font-semibold text-white mb-6">{name}</h3>
        <div className="bg-black bg-opacity-20 p-4 rounded-md mb-4 transition-all duration-300 hover:transform hover:scale-105 hover:bg-opacity-30 hover:shadow-[0_0_3px_1px_rgba(255,255,255,0.3)]">
          <h4 className="font-serif font-semibold text-white mb-2">Explanation:</h4>
          <p className="text-gray-300 font-sans text-sm mb-2">{explanation}</p>
          <p className="text-gray-500 font-sans text-sm mt-2">
          </p>
        </div>
        <div className="bg-black bg-opacity-20 p-4 rounded-md mb-4 transition-all duration-300 hover:transform hover:scale-105 hover:bg-opacity-30 hover:shadow-[0_0_3px_1px_rgba(255,255,255,0.3)]">
          <h4 className="font-serif font-semibold text-white mb-2">Key Points:</h4>
          <ul className="list-none space-y-2">
            {keyPoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-gray-300 font-sans text-sm">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-black bg-opacity-20 p-4 rounded-md transition-all duration-300 hover:transform hover:scale-105 hover:bg-opacity-30 hover:shadow-[0_0_3px_1px_rgba(255,255,255,0.3)]">
          <h4 className="font-serif font-semibold text-white mb-2">Practical Application:</h4>
          <p className="text-gray-300 font-sans text-sm">{applicationTip}</p>
        </div>
      </CardContent>
    </Card>
  );
}