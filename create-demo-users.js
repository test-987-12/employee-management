// Simple script to create demo users for Firebase Authentication
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

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

// Demo users
const demoUsers = [
  { email: 'hr@techsolutions.com', password: 'Password123!' },
  { email: 'john.doe@techsolutions.com', password: 'Password123!' }
];

// Create users one by one
async function createUsers() {
  console.log('Creating demo users for Firebase Authentication...');
  
  for (const user of demoUsers) {
    try {
      console.log(`Creating user: ${user.email}`);
      await createUserWithEmailAndPassword(auth, user.email, user.password);
      console.log(`Success: User ${user.email} created`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`Info: User ${user.email} already exists`);
      } else {
        console.error(`Error creating ${user.email}: ${error.code} - ${error.message}`);
      }
    }
  }
  
  console.log('\nDemo users for login:');
  demoUsers.forEach(user => {
    console.log(`- ${user.email} / ${user.password}`);
  });
  
  console.log('\nScript completed');
}

// Run the script
createUsers().catch(error => {
  console.error('Script failed:', error);
});
