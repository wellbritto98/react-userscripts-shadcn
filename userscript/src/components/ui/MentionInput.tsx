import React, { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Badge } from './badge';
import { X } from 'lucide-react';
import { MentionUser } from '@/hooks/usePostForm';

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mentions: MentionUser[];
  onAddMention: (user: MentionUser) => void;
  onRemoveMention: (userId: string) => void;
  searchMentions: (term: string) => Promise<MentionUser[]>;
}

export function MentionInput({
  value,
  onChange,
  placeholder = "Escreva uma descrição...",
  mentions,
  onAddMention,
  onRemoveMention,
  searchMentions
}: MentionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionUser[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionTerm, setMentionTerm] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Detectar mentions no texto
  useEffect(() => {
    const cursorPos = inputRef.current?.selectionStart || 0;
    setCursorPosition(cursorPos);
    
    const textBeforeCursor = value.slice(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      const term = mentionMatch[1];
      setMentionTerm(term);
      setShowSuggestions(true);
      setSelectedIndex(0);
      
      // Buscar sugestões
      const searchSuggestions = async () => {
        const results = await searchMentions(term);
        setSuggestions(results);
      };
      
      searchSuggestions();
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [value, searchMentions]);

  // Navegar pelas sugestões com teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          selectMention(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  // Selecionar mention
  const selectMention = (user: MentionUser) => {
    const cursorPos = inputRef.current?.selectionStart || 0;
    const textBeforeCursor = value.slice(0, cursorPos);
    const textAfterCursor = value.slice(cursorPos);
    
    // Encontrar onde começa o @
    const atIndex = textBeforeCursor.lastIndexOf('@');
    const newText = textBeforeCursor.slice(0, atIndex) + `@${user.username} ` + textAfterCursor;
    
    onChange(newText);
    onAddMention(user);
    setShowSuggestions(false);
    
    // Focar no input após a menção
    setTimeout(() => {
      if (inputRef.current) {
        const newCursorPos = atIndex + user.username.length + 2; // +2 para @ e espaço
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        inputRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className="ppm:space-y-3">
      {/* Input principal */}
      <div className="ppm:relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="ppm:w-full"
        />
        
        {/* Sugestões de mentions */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="ppm:absolute ppm:top-full ppm:left-0 ppm:right-0 ppm:bg-white ppm:border ppm:border-gray-200 ppm:rounded-md ppm:shadow-lg ppm:z-50 ppm:max-h-48 ppm:overflow-y-auto"
          >
            {suggestions.map((user, index) => (
              <button
                key={user.id}
                type="button"
                onClick={() => selectMention(user)}
                className={`ppm:w-full ppm:flex ppm:items-center ppm:gap-3 ppm:px-3 ppm:py-2 ppm:text-left ppm:hover:bg-gray-50 ppm:transition-colors ${
                  index === selectedIndex ? 'ppm:bg-blue-50' : ''
                }`}
              >
                <Avatar className="ppm:w-8 ppm:h-8">
                  <AvatarImage src={user.avatarUrl || ''} alt={user.displayName || user.username} />
                  <AvatarFallback className="ppm:text-xs">
                    {(user.displayName || user.username).slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ppm:flex-1 ppm:min-w-0">
                  <div className="ppm:font-medium ppm:text-sm ppm:truncate">
                    {user.displayName || user.username}
                  </div>
                  <div className="ppm:text-xs ppm:text-gray-500 ppm:truncate">
                    @{user.username}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mentions selecionadas */}
      {mentions.length > 0 && (
        <div className="ppm:flex ppm:flex-wrap ppm:gap-2">
          {mentions.map(user => (
            <Badge
              key={user.id}
              variant="secondary"
              className="ppm:flex ppm:items-center ppm:gap-1 ppm:px-2 ppm:py-1"
            >
              <span className="ppm:text-xs">@{user.username}</span>
              <button
                type="button"
                onClick={() => onRemoveMention(user.id)}
                className="ppm:ml-1 ppm:hover:text-red-500 ppm:transition-colors"
              >
                <X className="ppm:w-3 ppm:h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Dica sobre mentions */}
      <div className="ppm:text-xs ppm:text-gray-500">
        Use @ para marcar pessoas na sua publicação
      </div>
    </div>
  );
} 