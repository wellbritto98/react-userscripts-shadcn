import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import { userRepository } from "@/lib/repositories";

// Hook para debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mentions: Array<{ id: string; username: string; displayName?: string; avatarUrl?: string }>;
  onAddMention: (mention: { id: string; username: string; displayName?: string; avatarUrl?: string }) => void;
  onRemoveMention: (mentionId: string) => void;
  searchMentions: (query: string) => Promise<any[]>;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Busca usuários quando o termo debounced muda
  useEffect(() => {
    const performSearch = async () => {
      const term = debouncedSearch.trim();
      
      if (term.length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      setShowDropdown(true);
      
      try {
        const results = await searchMentions(term);
        setSearchResults(results.filter(user => 
          !mentions.some(mention => mention.id === user.id)
        ));
      } catch (err) {
        console.error('Erro na busca de menções:', err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearch, mentions, searchMentions]);

  // Fecha dropdown quando clica fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Detecta se está digitando @
    const cursorPos = e.target.selectionStart || 0;
    setCursorPosition(cursorPos);
    
    // Extrai o termo de busca após @
    const beforeCursor = newValue.slice(0, cursorPos);
    const match = beforeCursor.match(/@(\w*)$/);
    
    if (match) {
      setSearchTerm(match[1]);
    } else {
      setSearchTerm("");
      setShowDropdown(false);
    }
  };

  const handleUserSelect = (user: any) => {
    // Substitui o @username pelo @username no texto
    const beforeCursor = value.slice(0, cursorPosition);
    const afterCursor = value.slice(cursorPosition);
    
    const match = beforeCursor.match(/@(\w*)$/);
    if (match) {
      const newValue = beforeCursor.replace(/@(\w*)$/, `@${user.username} `) + afterCursor;
      onChange(newValue);
    }
    
    // Adiciona à lista de menções
    onAddMention({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl
    });
    
    setSearchTerm("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleRemoveMention = (mentionId: string) => {
    onRemoveMention(mentionId);
  };

  return (
    <div className="ppm:relative">
      {/* Input principal */}
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="ppm:w-full"
      />
      
      {/* Badges das menções */}
      {mentions.length > 0 && (
        <div className="ppm:flex ppm:flex-wrap ppm:gap-2 ppm:mt-2">
          {mentions.map((mention) => (
            <Badge
              key={mention.id}
              variant="secondary"
              className="ppm:flex ppm:items-center ppm:gap-1 ppm:px-2 ppm:py-1"
            >
              <Avatar className="ppm:w-4 ppm:h-4">
                <AvatarImage src={mention.avatarUrl} alt={mention.displayName || mention.username} />
                <AvatarFallback className="ppm:text-xs">
                  {(mention.displayName || mention.username).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="ppm:text-xs">@{mention.username}</span>
              <Button
                variant="ghost"
                size="sm"
                className="ppm:h-4 ppm:w-4 ppm:p-0 ppm:ml-1"
                onClick={() => handleRemoveMention(mention.id)}
              >
                <X className="ppm:w-3 ppm:h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
      
      {/* Dropdown de busca */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="ppm:absolute ppm:top-full ppm:left-0 ppm:right-0 ppm:z-50 ppm:bg-white ppm:border ppm:border-gray-200 ppm:rounded-md ppm:shadow-lg ppm:max-h-60 ppm:overflow-y-auto"
        >
          {loading ? (
            <div className="ppm:p-4 ppm:text-center ppm:text-gray-500">
              Buscando...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="ppm:py-2">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="ppm:flex ppm:items-center ppm:gap-3 ppm:px-4 ppm:py-2 ppm:hover:bg-gray-50 ppm:cursor-pointer"
                  onClick={() => handleUserSelect(user)}
                >
                  <Avatar className="ppm:w-8 ppm:h-8">
                    <AvatarImage src={user.avatarUrl} alt={user.displayName || user.username} />
                    <AvatarFallback>
                      {(user.displayName || user.username).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ppm:flex-1 ppm:min-w-0">
                    <div className="ppm:font-medium ppm:text-sm ppm:text-gray-900 ppm:truncate">
                      {user.displayName || user.username}
                    </div>
                    <div className="ppm:text-xs ppm:text-gray-500 ppm:truncate">
                      @{user.username}
                    </div>
                  </div>
                  <Search className="ppm:w-4 ppm:h-4 ppm:text-gray-400" />
                </div>
              ))}
            </div>
          ) : searchTerm.length >= 2 ? (
            <div className="ppm:p-4 ppm:text-center ppm:text-gray-500">
              Nenhum usuário encontrado.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
} 