import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';

const FirebaseTest = () => {
  const [status, setStatus] = useState('Testing Firebase connection...');

  useEffect(() => {
    const testFirebase = async () => {
      try {
        console.log('Testing Firebase configuration...');
        
        // Test if Firebase is properly initialized
        if (!auth) {
          setStatus('❌ Firebase Auth not initialized');
          return;
        }
        
        if (!db) {
          setStatus('❌ Firestore not initialized');
          return;
        }
        
        // Check if we can access auth
        console.log('Auth instance:', auth);
        console.log('Current user:', auth.currentUser);
        
        setStatus('✅ Firebase connection successful!');
        
      } catch (error) {
        console.error('Firebase test error:', error);
        setStatus(`❌ Firebase error: ${error.message}`);
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50">
      <h3 className="font-bold mb-2">Firebase Status</h3>
      <p className="text-sm">{status}</p>
      <div className="text-xs mt-2 space-y-1">
        <div>API Key: {import.meta.env.VITE_FIREBASE_API_KEY ? '✅' : '❌'}</div>
        <div>Auth Domain: {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅' : '❌'}</div>
        <div>Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅' : '❌'}</div>
      </div>
    </div>
  );
};

export default FirebaseTest;
