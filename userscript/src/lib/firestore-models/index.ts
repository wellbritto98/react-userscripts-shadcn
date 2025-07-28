export * from './User';
export * from './Post';
export * from './Comment';
export * from './Like';
export * from './Activity';

// Tipos utilitários
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface PaginationOptions {
  limit: number;
  startAfter?: any;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface QueryOptions {
  where?: Array<{
    field: string;
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in';
    value: any;
  }>;
  orderBy?: Array<{
    field: string;
    direction: 'asc' | 'desc';
  }>;
  limit?: number;
  startAfter?: any;
} 