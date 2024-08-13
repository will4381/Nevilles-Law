'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { DailyQuote } from "@/components/DailyQuote";
import { ConceptOfTheDay } from "@/components/ConceptOfTheDay";
import { VisualizationGuide, VisualizationGuideProps } from "@/components/VisualizationGuide";
import { TechniqueDatabase } from "@/components/TechniqueDatabase";
import { InteractiveQuiz } from "@/components/InteractiveQuiz";
import { TwitterLink, RedditLink } from "@/components/SocialLink";
import { cn } from "@/lib/utils"

function TiltCard({ children, className }: { children: ReactNode, className?: string }): JSX.Element {
  const focusRingClass = "focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-2 focus-within:ring-offset-zinc-900";
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current && isHovered) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const tiltX = (y - centerY) / 250;
        const tiltY = (centerX - x) / 250;
        
        setTiltStyle({
          transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.001, 1.001, 1.001)`,
          boxShadow: `
            ${-tiltY}px ${-tiltX}px 20px rgba(255, 255, 255, 0.1),
            ${tiltY}px ${tiltX}px 20px rgba(0, 0, 0, 0.2)
          `,
          zIndex: 10
        });
      }
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      setTiltStyle({});
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);

  return (
    <div className="relative overflow-visible h-full">
      <div
        ref={cardRef}
        className={cn(
          "transition-all duration-300 ease-out h-full",
          focusRingClass,
          className
        )}
        style={tiltStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </div>
    </div>
  );
}

function FloatingBlob(): JSX.Element {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (blobRef.current) {
      const blob = blobRef.current;
      const size = Math.random() * 200 + 100;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 20 + 10;

      blob.style.width = `${size}px`;
      blob.style.height = `${size}px`;
      blob.style.left = `${x}%`;
      blob.style.top = `${y}%`;
      blob.style.animation = `float ${duration}s infinite ease-in-out`;
    }
  }, []);

  return (
    <div
      ref={blobRef}
      className="absolute rounded-full bg-gradient-to-r from-primary/20 to-primary/10 blur-3xl opacity-30"
      style={{ filter: 'blur(70px)' }}
    ></div>
  );
}

export default function Home(): JSX.Element {
  const [dailyQuote, setDailyQuote] = useState({ text: "", source: "", year: 0 });
  const [dailyConcept, setDailyConcept] = useState({ 
    name: "", 
    explanation: "", 
    keyPoints: [], 
    applicationTip: "" 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyContent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/daily-content');
        if (!response.ok) {
          throw new Error('Failed to fetch daily content');
        }
        const data = await response.json();
        setDailyQuote({
          text: data.quote.quote,
          source: data.quote.source,
          year: data.quote.year
        });
        setDailyConcept({
          name: data.concept.name,
          explanation: data.concept.description,
          keyPoints: data.concept.key_points,
          applicationTip: data.concept.practical_application
        });
      } catch (err) {
        setError('Error fetching daily content. Please try again later.');
        console.error('Error fetching daily content:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyContent();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const visualizationGuideProps: VisualizationGuideProps = {
    title: "Effective Visualization Technique",
    description: "Visualization is a powerful tool in manifesting your desires. Follow these steps to enhance your practice.",
    keyConcepts: [
      "Vividness: Make your visualization as detailed as possible",
      "Emotion: Feel the joy and gratitude of your desire fulfilled",
      "Persistence: Practice regularly for best results"
    ],
    tip: "For best results, practice visualization right before sleep when your mind is most receptive."
  };

  return (
    <div className="min-h-screen bg-zinc-900 overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => <FloatingBlob key={i} />)}
      </div>
      <main className="relative z-10 min-h-screen p-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full lg:w-3/5 px-2 mb-4">
              <TiltCard className="h-full">
                <DailyQuote
                  text={dailyQuote.text}
                  source={dailyQuote.source}
                  year={dailyQuote.year}
                />
              </TiltCard>
            </div>
            <div className="w-full lg:w-1/5 px-2 mb-4">
              <TiltCard className="h-full">
                <RedditLink />
              </TiltCard>
            </div>
            <div className="w-full lg:w-1/5 px-2 mb-4">
              <TiltCard className="h-full">
                <TwitterLink />
              </TiltCard>
            </div>
            <div className="w-full lg:w-2/3 px-2 mb-4">
              <TiltCard className="h-full">
                <ConceptOfTheDay
                  name={dailyConcept.name}
                  explanation={dailyConcept.explanation}
                  keyPoints={dailyConcept.keyPoints}
                  applicationTip={dailyConcept.applicationTip}
                />
              </TiltCard>
            </div>
            <div className="w-full lg:w-1/3 px-2 mb-4">
              <TiltCard className="h-full">
                <VisualizationGuide {...visualizationGuideProps} />
              </TiltCard>
            </div>
            <div className="w-full lg:w-1/2 px-2 mb-4">
              <TiltCard className="h-full">
                <TechniqueDatabase />
              </TiltCard>
            </div>
            <div className="w-full lg:w-1/2 px-2 mb-4">
              <TiltCard className="h-full">
                <InteractiveQuiz />
              </TiltCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}