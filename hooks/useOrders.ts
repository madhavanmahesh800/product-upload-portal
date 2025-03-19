import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Order = {
  id: string;
  token: string;
  productName: string;
  category: string;
  sellerName: string;
  sellerContact: string;
  sellerEmail: string;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
};

export function useOrders(userEmail?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    let ordersQuery;
    
    if (userEmail) {
      // Get only orders for a specific user
      ordersQuery = query(
        collection(db, 'products'),
        where('sellerEmail', '==', userEmail),
        orderBy('createdAt', 'desc')
      );
    } else {
      // Get all orders
      ordersQuery = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const ordersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        
        setOrders(ordersList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders');
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userEmail]);

  return { orders, loading, error };
} 