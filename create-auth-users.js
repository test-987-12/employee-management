// Script to create Firebase Authentication users directly
// This script bypasses the sign-in check and directly creates users
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

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

// Function to create a user in Firebase Authentication
const createUserInAuth = async (email, password) => {
  try {
    // Directly attempt to create the user without checking if it exists
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log(`User ${email} created in Firebase Authentication`);

    // Sign out after creating the user to avoid auth state conflicts
    await signOut(auth);

    return { success: true, user: userCredential.user };
  } catch (error) {
    // Handle specific error codes
    if (error.code === 'auth/email-already-in-use') {
      console.log(`User ${email} already exists in Firebase Authentication`);
      return { success: true, message: 'User already exists' };
    } else {
      console.error(`Error creating user ${email}:`, error.code, error.message);
      return { success: false, error: error };
    }
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

// Main function to create all users
const createAllUsers = async () => {
  try {
    console.log('Starting user creation in Firebase Authentication...');

    // Define key test users with known credentials
    const testUsers = [
      { email: 'hr@techsolutions.com', password: 'Password123!' },
      { email: 'john.doe@techsolutions.com', password: 'Password123!' }
    ];

    // Create test users first
    console.log('Creating test users...');
    for (const user of testUsers) {
      const result = await createUserInAuth(user.email, user.password);
      console.log(`${user.email}: ${result.success ? 'Success' : 'Failed'} - ${result.message || ''}`);
    }

    // Get all users from the database
    const dbUsers = await getAllUsers();
    console.log(`Found ${dbUsers.length} users in the database`);

    // Create users from the database
    console.log('Creating users from database...');
    const results = [];

    for (const user of dbUsers) {
      // Skip users without email or password
      if (!user.email || !user.password) {
        console.log(`Skipping user without email or password:`, user.email || 'unknown');
        continue;
      }

      // Skip users already in test users
      if (testUsers.some(testUser => testUser.email === user.email)) {
        console.log(`Skipping already processed test user: ${user.email}`);
        continue;
      }

      const result = await createUserInAuth(user.email, user.password);
      results.push({
        email: user.email,
        success: result.success,
        message: result.message || '',
        error: result.error ? result.error.code : null
      });
    }

    // Log results
    console.log('\nCreation results:');
    results.forEach(result => {
      console.log(`${result.email}: ${result.success ? 'Success' : 'Failed'} ${result.message ? '- ' + result.message : ''} ${result.error ? '(Error: ' + result.error + ')' : ''}`);
    });

    console.log('\nUser creation completed');

    // Print summary
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    console.log(`Summary: ${successCount} succeeded, ${failCount} failed`);

    // Print test user credentials for reference
    console.log('\nTest User Credentials:');
    testUsers.forEach(user => {
      console.log(`Email: ${user.email} | Password: ${user.password}`);
    });
  } catch (error) {
    console.error('Error creating users:', error);
  }
};

// Run the creation process
createAllUsers().then(() => {
  console.log('Script execution completed');
  process.exit(0);
}).catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
