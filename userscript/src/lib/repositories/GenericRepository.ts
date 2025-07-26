import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
  writeBatch,
  runTransaction,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../firebase';
import { QueryOptions, PaginationOptions } from '../firestore-models';

export class GenericRepository<T extends DocumentData> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // CRUD básico
  async create(data: Omit<T, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  }

  async getById(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as unknown as T;
    }
    return null;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  // Consultas avançadas
  async find(options: QueryOptions = {}): Promise<T[]> {
    const constraints: QueryConstraint[] = [];

    // Adiciona filtros where
    if (options.where) {
      options.where.forEach(condition => {
        constraints.push(where(condition.field, condition.operator, condition.value));
      });
    }

    // Adiciona ordenação
    if (options.orderBy) {
      options.orderBy.forEach(order => {
        constraints.push(orderBy(order.field, order.direction));
      });
    }

    // Adiciona limite
    if (options.limit) {
      constraints.push(limit(options.limit));
    }

    // Adiciona startAfter para paginação
    if (options.startAfter) {
      constraints.push(startAfter(options.startAfter));
    }

    const q = query(collection(db, this.collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as T[];
  }

  async findOne(options: QueryOptions = {}): Promise<T | null> {
    const results = await this.find({ ...options, limit: 1 });
    return results.length > 0 ? results[0] : null;
  }

  // Paginação
  async findWithPagination(options: PaginationOptions): Promise<{
    data: T[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    const constraints: QueryConstraint[] = [];

    if (options.orderBy) {
      constraints.push(orderBy(options.orderBy, options.orderDirection || 'desc'));
    }

    if (options.startAfter) {
      constraints.push(startAfter(options.startAfter));
    }

    constraints.push(limit(options.limit + 1)); // +1 para verificar se há mais dados

    const q = query(collection(db, this.collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const docs = querySnapshot.docs;
    const hasMore = docs.length > options.limit;
    const data = docs.slice(0, options.limit).map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as T[];

    return {
      data,
      lastDoc: hasMore ? docs[docs.length - 2] : null,
      hasMore
    };
  }

  // Operações em lote
  async createBatch(dataArray: Omit<T, 'id'>[]): Promise<string[]> {
    const batch = writeBatch(db);
    const docRefs: any[] = [];

    dataArray.forEach(data => {
      const docRef = doc(collection(db, this.collectionName));
      batch.set(docRef, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      docRefs.push(docRef);
    });

    await batch.commit();
    return docRefs.map(ref => ref.id);
  }

  async updateBatch(updates: Array<{ id: string; data: Partial<T> }>): Promise<void> {
    const batch = writeBatch(db);

    updates.forEach(({ id, data }) => {
      const docRef = doc(db, this.collectionName, id);
      batch.update(docRef, {
        ...data,
        updatedAt: new Date()
      });
    });

    await batch.commit();
  }

  async deleteBatch(ids: string[]): Promise<void> {
    const batch = writeBatch(db);

    ids.forEach(id => {
      const docRef = doc(db, this.collectionName, id);
      batch.delete(docRef);
    });

    await batch.commit();
  }

  // Transações
  async runTransaction<R>(
    updateFunction: (transaction: any) => Promise<R>
  ): Promise<R> {
    return runTransaction(db, updateFunction);
  }

  // Listeners em tempo real
  onSnapshot(
    callback: (data: T[]) => void,
    options: QueryOptions = {}
  ): Unsubscribe {
    const constraints: QueryConstraint[] = [];

    if (options.where) {
      options.where.forEach(condition => {
        constraints.push(where(condition.field, condition.operator, condition.value));
      });
    }

    if (options.orderBy) {
      options.orderBy.forEach(order => {
        constraints.push(orderBy(order.field, order.direction));
      });
    }

    if (options.limit) {
      constraints.push(limit(options.limit));
    }

    const q = query(collection(db, this.collectionName), ...constraints);
    
    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as unknown as T[];
      callback(data);
    });
  }

  onSnapshotById(
    id: string,
    callback: (data: T | null) => void
  ): Unsubscribe {
    const docRef = doc(db, this.collectionName, id);
    
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as unknown as T;
        callback(data);
      } else {
        callback(null);
      }
    });
  }
}
