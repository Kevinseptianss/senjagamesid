import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const DebugFirestore = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testFirestoreConnection = async () => {
    setLoading(true);
    setStatus('Testing Firestore connection...');
    
    try {
      // Test writing to Firestore
      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        message: 'Firestore connection test'
      };
      
      await setDoc(doc(db, 'test', 'connection'), testData);
      setStatus('✅ Firestore write test successful');
      
      // Test reading from Firestore
      const testDoc = await getDoc(doc(db, 'test', 'connection'));
      if (testDoc.exists()) {
        setStatus('✅ Firestore read/write test successful');
      } else {
        setStatus('❌ Firestore read test failed');
      }
    } catch (error) {
      setStatus(`❌ Firestore test failed: ${error.message}`);
      console.error('Firestore test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserDocument = async () => {
    if (!user) {
      setStatus('❌ No user logged in');
      return;
    }
    
    setLoading(true);
    setStatus('Checking user document...');
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setStatus(`✅ User document exists. Full name: ${userData.fullName || 'Not set'}`);
        console.log('User document data:', userData);
      } else {
        setStatus('❌ User document does not exist');
      }
    } catch (error) {
      setStatus(`❌ Error checking user document: ${error.message}`);
      console.error('User document check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async () => {
    if (!user) {
      setStatus('❌ No user logged in');
      return;
    }
    
    setLoading(true);
    setStatus('Creating user profile...');
    
    try {
      const profileData = {
        fullName: user.fullName || '',
        email: user.email,
        uid: user.uid,
        displayName: user.displayName || user.fullName || '',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isEmailVerified: user.emailVerified,
        accountStatus: 'active',
        purchasedAccounts: [],
        ongoingTransactions: [],
        preferences: { language: 'id', currency: 'IDR', theme: 'dark' },
        stats: { totalPurchases: 0, totalSpent: 0, accountsPurchased: 0 }
      };
      
      await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });
      setStatus('✅ User profile created/updated successfully');
    } catch (error) {
      setStatus(`❌ Error creating user profile: ${error.message}`);
      console.error('User profile creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const listUsersCollection = async () => {
    setLoading(true);
    setStatus('Listing users collection...');
    
    try {
      const usersCollection = await getDocs(collection(db, 'users'));
      const usersList = [];
      usersCollection.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      
      setStatus(`✅ Found ${usersList.length} users in collection`);
      console.log('Users in collection:', usersList);
      
      if (usersList.length > 0) {
        usersList.forEach((user, index) => {
          console.log(`User ${index + 1}:`, {
            uid: user.id,
            email: user.email,
            fullName: user.fullName,
            createdAt: user.createdAt
          });
        });
      }
    } catch (error) {
      setStatus(`❌ Error listing users: ${error.message}`);
      console.error('Users listing error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        Please log in to use Firestore debugging tools.
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">🔧 Firestore Debug Tools</h3>
      
      <div className="space-y-3 mb-4">
        <button
          onClick={testFirestoreConnection}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Firestore Connection
        </button>
        
        <button
          onClick={checkUserDocument}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Check My User Document
        </button>
        
        <button
          onClick={createUserProfile}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Create/Update My Profile
        </button>
        
        <button
          onClick={listUsersCollection}
          disabled={loading}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          List All Users in Collection
        </button>
      </div>
      
      {status && (
        <div className={`p-3 rounded ${status.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {status}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Current User:</strong> {user.email}</p>
        <p><strong>UID:</strong> {user.uid}</p>
        <p><strong>Full Name:</strong> {user.fullName || 'Not set'}</p>
      </div>
    </div>
  );
};

export default DebugFirestore;
