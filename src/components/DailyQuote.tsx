'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Copy } from 'lucide-react';

interface QuoteProps {
  text: string;
  source: string;
  year: number;
}

export function DailyQuote({ text, source, year }: QuoteProps) {
  const [copied, setCopied] = useState(false);
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <h2 className="text-2xl font-serif font-bold text-primary mb-4">Daily Quote</h2>
        <p className="text-lg text-gray-300 mb-4 font-serif italic">{`"${text}"`}</p>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{`${source}, ${year}`}</p>
          <button 
            onClick={copyToClipboard} 
            className="text-primary hover:text-primary/80 transition-colors"
            aria-label="Copy quote"
          >
            <Copy size={20} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}