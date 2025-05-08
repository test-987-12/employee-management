// Script to create just the test users for Firebase Authentication
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

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

// Function to create a user in Firebase Authentication
const createUser = async (email, password) => {
  try {
    // Directly attempt to create the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log(`✅ User ${email} created successfully`);

    // Sign out after creating the user
    await signOut(auth);

    return { success: true };
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`ℹ️ User ${email} already exists`);
      return { success: true, message: 'User already exists' };
    } else {
      console.error(`❌ Error creating user ${email}: ${error.code} - ${error.message}`);
      return { success: false, error: error };
    }
  }
};

// Main function
const createTestUsers = async () => {
  console.log('🔐 Creating test users for Firebase Authentication...\n');

  // Define test users
  const testUsers = [
    { email: 'hr@techsolutions.com', password: 'Password123!' },
    { email: 'john.doe@techsolutions.com', password: 'Password123!' }
  ];

  // Create each test user
  for (const user of testUsers) {
    console.log(`Creating user: ${user.email}`);
    const result = await createUser(user.email, user.password);

    if (!result.success) {
      console.log(`Failed to create user: ${user.email}\n`);
    } else {
      console.log(`User processed: ${user.email}\n`);
    }
  }

  console.log('✨ Test user creation completed');
  console.log('\n📝 Test User Credentials:');
  testUsers.forEach(user => {
    console.log(`Email: ${user.email} | Password: ${user.password}`);
  });
};

// Run the script
createTestUsers().then(() => {
  console.log('\n🏁 Script execution completed');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Script execution failed:', error);
  process.exit(1);
});
