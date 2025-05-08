// Script to set up Firebase Authentication for seeded users
const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  connectAuthEmulator 
} = require('firebase/auth');
const { getDatabase, ref, get } = require('firebase/database');

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(`User ${email} already exists in Firebase Authentication`);
      return { success: true, user: userCredential.user };
    } catch (signInError) {
      // If sign-in fails with user-not-found, create the user
      if (signInError.code === 'auth/user-not-found') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log(`User ${email} created in Firebase Authentication`);
        return { success: true, user: userCredential.user };
      } else {
        console.error(`Error signing in user ${email}:`, signInError.code, signInError.message);
        return { success: false, error: signInError };
      }
    }
  } catch (error) {
    console.error(`Error registering user ${email}:`, error);
    return { success: false, error };
  }
};

// Function to get all users from Firebase Realtime Database
const getAllUsers = async () => {
  try {
    const snapshot = await get(ref(database, 'users'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.entries(data).map(([id, user]) => ({
        id,
        ...user
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting users from database:', error);
    return [];
  }
};

// Main function to register all users
const setupAuth = async () => {
  try {
    console.log('Starting user registration in Firebase Authentication...');
    
    // Get all users from the database
    const users = await getAllUsers();
    console.log(`Found ${users.length} users in the database`);
    
    // Create a list of predefined users for testing
    const testUsers = [
      { email: 'hr@techsolutions.com', password: 'Password123!' },
      { email: 'john.doe@techsolutions.com', password: 'Password123!' }
    ];
    
    // Register predefined test users first
    console.log('Registering predefined test users...');
    for (const user of testUsers) {
      const result = await registerUserInAuth(user.email, user.password);
      console.log(`${user.email}: ${result.success ? 'Success' : 'Failed'}`);
    }
    
    // Register other users from the database
    console.log('Registering other users from the database...');
    const results = [];
    for (const user of users) {
      // Skip users without email or password
      if (!user.email || !user.password) {
        console.log(`Skipping user without email or password:`, user.email || 'unknown');
        continue;
      }
      
      // Skip users already registered in test users
      if (testUsers.some(testUser => testUser.email === user.email)) {
        console.log(`Skipping already registered test user: ${user.email}`);
        continue;
      }
      
      const result = await registerUserInAuth(user.email, user.password);
      results.push({ email: user.email, success: result.success });
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

// Run the setup process
setupAuth().then(() => {
  console.log('Script execution completed');
  process.exit(0);
}).catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
