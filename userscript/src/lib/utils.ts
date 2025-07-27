import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Função utilitária para combinar classes CSS com Tailwind CSS
 * Combina clsx e tailwind-merge para resolver conflitos de classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Remove acentos de uma string
 */
export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normaliza texto para busca (minúsculas, sem acentos, sem espaços extras)
 */
export function normalizeSearchText(text: string): string {
  return removeAccents(text.toLowerCase().trim());
}

/**
 * Gera n-grams de uma string
 */
export function generateNGrams(text: string, n: number): string[] {
  const grams: string[] = [];
  const normalized = normalizeSearchText(text);
  
  for (let i = 0; i <= normalized.length - n; i++) {
    grams.push(normalized.substring(i, i + n));
  }
  
  return grams;
}

/**
 * Gera todos os n-grams para busca de usuário
 */
export function generateUserSearchGrams(username: string, displayName?: string): {
  searchText: string;
  searchGrams2: string[];
  searchGrams3: string[];
} {
  const normalizedUsername = normalizeSearchText(username);
  const normalizedDisplayName = displayName ? normalizeSearchText(displayName) : '';
  
  // Texto unificado para busca
  const searchText = normalizedDisplayName 
    ? `${normalizedUsername} ${normalizedDisplayName}`
    : normalizedUsername;
  
  // Gerar n-grams do texto unificado
  const searchGrams2 = generateNGrams(searchText, 2);
  const searchGrams3 = generateNGrams(searchText, 3);
  
  return {
    searchText,
    searchGrams2,
    searchGrams3
  };
}

/**
 * Calcula score de relevância para ordenação dos resultados
 */
export function calculateSearchScore(
  user: any, 
  searchTerm: string, 
  userGrams: { searchGrams2: string[], searchGrams3: string[] }
): number {
  const normalizedTerm = normalizeSearchText(searchTerm);
  const normalizedUsername = normalizeSearchText(user.username);
  const normalizedDisplayName = user.displayName ? normalizeSearchText(user.displayName) : '';
  
  let score = 0;
  
  // Bonus para startsWith
  if (normalizedUsername.startsWith(normalizedTerm)) {
    score += 100;
  }
  if (normalizedDisplayName.startsWith(normalizedTerm)) {
    score += 80;
  }
  
  // Bonus para contains
  if (normalizedUsername.includes(normalizedTerm)) {
    score += 50;
  }
  if (normalizedDisplayName.includes(normalizedTerm)) {
    score += 40;
  }
  
  // Bonus para número de seguidores (tie-break)
  score += (user.followersCount || 0) * 0.01;
  
  return score;
}