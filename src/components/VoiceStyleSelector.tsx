
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Headphones } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from '@/hooks/use-mobile';
import VoiceCard from '@/components/VoiceCard';
import { Button } from '@/components/ui/button';
import { VoiceOption } from '@/utils/audioUtils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VoiceStyleSelectorProps {
  options: VoiceOption[];
  selected: string;
  onSelect: (id: string) => void;
}

const VoiceStyleSelector: React.FC<VoiceStyleSelectorProps> = ({ 
  options, 
  selected, 
  onSelect 
}) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [category, setCategory] = useState('all');
  
  const currentVoice = options.find(voice => voice.id === selected) || options[0];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Filter voices based on category
  const displayedVoices = category === 'all' ? 
    options : 
    options.slice(0, 8); // Show only the first 8 voices for "popular" category

  return (
    <div className="space-y-3">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center">
            <Headphones className="w-4 h-4 mr-2 text-primary" />
            Select Voice Style
          </h3>
          {isMobile && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleToggle} 
              className="flex items-center text-xs h-8 bg-muted/30 hover:bg-muted/50"
            >
              {currentVoice.name}
              {isOpen ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>
          )}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400">Each style has its unique tone and expressiveness.</p>
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[120px] h-8 text-xs bg-muted/30 hover:bg-muted/50">
              <SelectValue placeholder="Show" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Voices</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isMobile ? (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <CollapsibleContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
              {displayedVoices.map((voice) => (
                <VoiceCard
                  key={voice.id}
                  id={voice.id}
                  name={voice.name}
                  description={voice.description}
                  color={voice.color}
                  isSelected={selected === voice.id}
                  onClick={() => onSelect(voice.id)}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {displayedVoices.map((voice) => (
            <VoiceCard
              key={voice.id}
              id={voice.id}
              name={voice.name}
              description={voice.description}
              color={voice.color}
              isSelected={selected === voice.id}
              onClick={() => onSelect(voice.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceStyleSelector;
