import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Search, AtSign } from "lucide-react";

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

interface TagsInputProps {
  tags: Array<{ id: string; username: string; displayName?: string; avatarUrl?: string }>;
  onAddTag: (tag: { id: string; username: string; displayName?: string; avatarUrl?: string }) => void;
  onRemoveTag: (tagId: string) => void;
  searchUsers: (query: string) => Promise<any[]>;
  placeholder?: string;
}

export function TagsInput({
  tags,
  onAddTag,
  onRemoveTag,
  searchUsers,
  placeholder = "Digite @ para marcar pessoas..."
}: TagsInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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
        const results = await searchUsers(term);
        setSearchResults(results.filter(user => 
          !tags.some(tag => tag.id === user.id)
        ));
      } catch (err) {
        console.error('Erro na busca de tags:', err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearch, tags, searchUsers]);

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
    const value = e.target.value;
    setSearchTerm(value);
    
    // Detecta se está digitando @
    if (value.startsWith('@')) {
      setSearchTerm(value.slice(1)); // Remove o @ para a busca
    } else {
      setSearchTerm("");
      setShowDropdown(false);
    }
  };

  const handleUserSelect = (user: any) => {
    onAddTag({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl
    });
    
    setSearchTerm("");
    setShowDropdown(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    inputRef.current?.focus();
  };

  const handleRemoveTag = (tagId: string) => {
    onRemoveTag(tagId);
  };

  return (
    <div className="ppm:space-y-3">
      {/* Input para tags */}
      <div className="ppm:relative">
        <div className="ppm:relative">
          <AtSign className="ppm:absolute ppm:left-3 ppm:top-1/2 ppm:-translate-y-1/2 ppm:w-4 ppm:h-4 ppm:text-gray-400" />
          <Input
            ref={inputRef}
            placeholder={placeholder}
            onChange={handleInputChange}
            className="ppm:pl-10"
          />
        </div>
        
        {/* Dropdown de busca */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="ppm:absolute ppm:top-full ppm:left-0 ppm:right-0 ppm:z-50 ppm:bg-white ppm:border ppm:border-gray-200 ppm:rounded-md ppm:shadow-lg ppm:max-h-60 ppm:overflow-y-auto ppm:mt-1"
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
      
      {/* Badges das tags */}
      {tags.length > 0 && (
        <div className="ppm:flex ppm:flex-wrap ppm:gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="ppm:flex ppm:items-center ppm:gap-1 ppm:px-2 ppm:py-1"
            >
              <Avatar className="ppm:w-4 ppm:h-4">
                <AvatarImage src={tag.avatarUrl} alt={tag.displayName || tag.username} />
                <AvatarFallback className="ppm:text-xs">
                  {(tag.displayName || tag.username).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="ppm:text-xs">@{tag.username}</span>
              <Button
                variant="ghost"
                size="sm"
                className="ppm:h-4 ppm:w-4 ppm:p-0 ppm:ml-1"
                onClick={() => handleRemoveTag(tag.id)}
              >
                <X className="ppm:w-3 ppm:h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
      
      {/* Dica sobre tags */}
      <div className="ppm:text-xs ppm:text-gray-500">
        Use @ para marcar pessoas na sua publicação
      </div>
    </div>
  );
} 