import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from "firebase/auth";

import { createContext, useEffect, useState } from "react";
import { app, auth } from "../firebase/firebase.config";

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    // Clear token on logout
    localStorage.removeItem('access-token');
    return signOut(auth);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {  // renamed for consistency
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo
    });
  };

  // Function to refresh token
  const refreshToken = async () => {
    if (user) {
      try {
        const token = await user.getIdToken(true); // Force refresh
        localStorage.setItem('access-token', token);
        console.log('Token refreshed');
        return token;
      } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    setLoading(true);

    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('User in the onAuthStateChanged:', currentUser);

      if (currentUser) {
        try {
          // Get token when user is authenticated
          const token = await currentUser.getIdToken();
          localStorage.setItem('access-token', token);
          console.log('Token stored in localStorage from AuthProvider');

          // Set up token refresh interval (every 55 minutes)
          // Firebase tokens typically expire after 1 hour
          const refreshInterval = setInterval(() => {
            refreshToken();
          }, 55 * 60 * 1000); // 55 minutes

          setUser(currentUser);
          setLoading(false);

          // Return cleanup function for the interval
          return () => {
            console.log('Clearing token refresh interval');
            clearInterval(refreshInterval);
          };
        } catch (error) {
          console.error('Error getting token:', error);
          setLoading(false);
        }
      } else {
        // Clear token when user is logged out
        console.log('No user in auth state change, clearing token');
        localStorage.removeItem('access-token');
        setUser(null);
        setLoading(false);
      }
    });

    // Check for existing token on mount
    const existingToken = localStorage.getItem('access-token');
    if (existingToken) {
      console.log('Found existing token in localStorage');
    }

    return () => {
      console.log('Unsubscribing from auth state listener');
      unSubscribe();
    };
  }, []);

  const authInfo = {
    user,
    createUser,
    signInUser,
    signInWithGoogle,  // exposed with the updated name
    logOut,
    setUser,
    loading,
    updateUserProfile,
    refreshToken
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
