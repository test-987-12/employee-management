// Script to register seeded users in Firebase Authentication
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrim6xMm1CIxQVZbJJMpbAmPgojwpmR9E",
  authDomain: "emp-mgt-system.firebaseapp.com",
  projectId: "emp-mgt-system",
  storageBucket: "emp-mgt-system.firebasestorage.app",
  messagingSenderId: "878688156762",
  appId: "1:878688156762:web:ed3973a023378918076c63",
  databaseURL: "https://emp-mgt-system-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Function to register a user in Firebase Authentication
const registerUserInAuth = async (email, password) => {
  try {
    // First try to sign in to see if the user already exists
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log(`User ${email} already exists in Firebase Authentication`);
      return true;
    } catch (signInError) {
      // If sign-in fails, create the user
      if (signInError.code === 'auth/user-not-found') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log(`User ${email} created in Firebase Authentication`);
        return true;
      } else if (signInError.code === 'auth/wrong-password') {
        console.log(`User ${email} exists but with a different password`);
        return false;
      } else {
        throw signInError;
      }
    }
  } catch (error) {
    console.error(`Error registering user ${email}:`, error);
    return false;
  }
};

// Function to get all users from Firebase Realtime Database
const getAllUsers = async () => {
  try {
    const snapshot = await get(ref(database, 'users'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data);
    }
    return [];
  } catch (error) {
    console.error('Error getting users from database:', error);
    return [];
  }
};

// Main function to register all users
const registerAllUsers = async () => {
  try {
    console.log('Starting user registration in Firebase Authentication...');
    
    // Get all users from the database
    const users = await getAllUsers();
    console.log(`Found ${users.length} users in the database`);
    
    // Register each user in Firebase Authentication
    const results = [];
    for (const user of users) {
      if (user.email && user.password) {
        const success = await registerUserInAuth(user.email, user.password);
        results.push({ email: user.email, success });
      } else {
        console.log(`Skipping user without email or password:`, user);
      }
    }
    
    // Log results
    console.log('Registration results:');
    results.forEach(result => {
      console.log(`${result.email}: ${result.success ? 'Success' : 'Failed'}`);
    });
    
    console.log('User registration completed');
  } catch (error) {
    console.error('Error registering users:', error);
  }
};

// Run the registration process
registerAllUsers().then(() => {
  console.log('Script execution completed');
  process.exit(0);
}).catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
