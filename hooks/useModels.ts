import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Model = {
  id: string;
  sellerEmail: string;
  modelUrl: string;
  fileName: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: any;
};

export function useModels(userEmail?: string) {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    let modelsQuery;
    
    if (userEmail) {
      // Get only models for a specific user
      modelsQuery = query(
        collection(db, 'models'),
        where('sellerEmail', '==', userEmail),
        orderBy('uploadDate', 'desc')
      );
    } else {
      // Get all models
      modelsQuery = query(
        collection(db, 'models'),
        orderBy('uploadDate', 'desc')
      );
    }

    const unsubscribe = onSnapshot(
      modelsQuery,
      (snapshot) => {
        const modelsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Model[];
        
        setModels(modelsList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching models:', err);
        setError('Failed to fetch models');
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userEmail]);

  return { models, loading, error };
} 