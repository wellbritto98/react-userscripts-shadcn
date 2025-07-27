import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { userRepository } from "@/lib/repositories";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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

export function FindScreen() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const navigate = useNavigate();

  // Debounce do termo de busca (300ms)
  const debouncedSearch = useDebounce(search, 300);

  // Busca automática quando o termo debounced muda
  useEffect(() => {
    const performSearch = async () => {
      const term = debouncedSearch.trim();
      
      if (term.length < 2) {
        setResults([]);
        setTouched(false);
        return;
      }

      setTouched(true);
      setLoading(true);
      
      try {
        // Usar a nova busca melhorada
        const searchResults = await userRepository.searchUsersImproved(term, 20);
        setResults(searchResults);
      } catch (err) {
        console.error('Erro na busca:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // A busca já acontece automaticamente via debounce
  };

  return (
    <div className="ppm:p-4 ppm:space-y-6">
      <form onSubmit={handleSubmit} className="ppm:mb-4">
        <Input
          placeholder="Buscar usuário..."
          value={search}
          onChange={handleSearchChange}
          className="ppm:w-full ppm:max-w-md ppm:mx-auto"
        />
      </form>
      
      {loading ? (
        <div className="ppm:space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="ppm:flex ppm:items-center ppm:gap-4 ppm:py-4">
                <Skeleton className="ppm:w-12 ppm:h-12 ppm:rounded-full" />
                <div className="ppm:flex-1">
                  <Skeleton className="ppm:w-32 ppm:h-4 ppm:mb-2" />
                  <Skeleton className="ppm:w-20 ppm:h-3" />
                </div>
                <Skeleton className="ppm:w-20 ppm:h-8 ppm:rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="ppm:space-y-4">
          {results.length > 0 ? (
            results.map(user => (
              <Card key={user.id}>
                <CardContent className="ppm:flex ppm:items-center ppm:gap-4">
                  <Avatar className="ppm:w-12 ppm:h-12">
                    <AvatarImage src={user.avatarUrl || ''} alt={user.displayName || user.username} />
                    <AvatarFallback>{(user.displayName || user.username || "?").slice(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="ppm:flex-1 ppm:min-w-0">
                    <div className="ppm:font-semibold ppm:text-gray-900 ppm:truncate">{user.displayName}</div>
                    <div className="ppm:text-gray-500 ppm:text-sm ppm:truncate">@{user.username}</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/profile/${user.username}`)}
                  >
                    Ver perfil
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : touched && search.trim() !== "" ? (
            <div className="ppm:text-center ppm:text-gray-500 ppm:mt-8">
              Nenhum usuário encontrado.
            </div>
          ) : search.trim() !== "" && search.trim().length < 2 ? (
            <div className="ppm:text-center ppm:text-gray-500 ppm:mt-8">
              Digite pelo menos 2 caracteres para buscar.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
} 