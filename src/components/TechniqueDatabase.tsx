'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from 'lucide-react';

interface RawTechnique {
  description: string;
  level: string;
  tags: string[];
}

interface Technique {
  name: string;
  description: string;
  level: string;
  tags: string[];
}

const formatTechniqueName = (description: string) => {
  const words = description.split(' ').slice(0, 3);
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatDescription = (description: string) => {
  return description.charAt(0).toUpperCase() + description.slice(1);
};

const formatLevel = (level: string) => {
  return level.charAt(0).toUpperCase() + level.slice(1);
};

const formatTag = (tag: string) => {
  return tag.replace(/_/g, ' ');
};

export function TechniqueDatabase() {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Fetching techniques...');
    setIsLoading(true);
    fetch('/api/techniques')
      .then(response => {
        console.log('Raw response:', response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Received data:', data);
        if (!data || !data.concepts_techniques) {
          throw new Error('Data format is incorrect');
        }
        const formattedTechniques = data.concepts_techniques.map((technique: RawTechnique) => ({
          name: formatTechniqueName(technique.description),
          description: formatDescription(technique.description),
          level: formatLevel(technique.level),
          tags: technique.tags.map(formatTag)
        }));
        console.log('Formatted techniques:', formattedTechniques);
        setTechniques(formattedTechniques);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching techniques:', error);
        setIsLoading(false);
      });
  }, []);

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

  const filteredTechniques = techniques.filter(technique =>
    technique.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    technique.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    technique.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        <CardTitle className="text-2xl font-serif font-bold text-primary">Technique / Concept Database</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-primary" />
          <Input
            type="search"
            placeholder="Search techniques..."
            className="pl-8 bg-black bg-opacity-20 text-white placeholder-gray-400 border-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {isLoading ? (
            <p>Loading techniques...</p>
          ) : filteredTechniques.length > 0 ? (
            filteredTechniques.map((technique, index) => (
              <div 
                key={index} 
                className="bg-black bg-opacity-20 p-4 rounded-md transition-all duration-300 hover:bg-opacity-30"
              >
                <h3 className="font-serif font-semibold text-white mb-1">{technique.name}</h3>
                <p className="text-sm text-gray-300 mb-2">{technique.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/20 text-primary">{technique.level}</Badge>
                  {technique.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-gray-300 border-gray-500">{tag}</Badge>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No techniques found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}