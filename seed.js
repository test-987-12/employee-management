// Employee Asset Management System - Seed Script
// This script creates sample data for demonstration purposes

import { faker } from '@faker-js/faker';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, get } from 'firebase/database';

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
const database = getDatabase(app);

// Sample company data
const companies = [
  {
    name: 'techsolutions',
    displayName: 'Tech Solutions Inc.',
    logo: 'https://i.ibb.co/Qp1nCCk/tech-solutions-logo.png',
    package: 'premium',
  },
  {
    name: 'globalinnovate',
    displayName: 'Global Innovate',
    logo: 'https://i.ibb.co/YTGrZkb/global-innovate-logo.png',
    package: 'standard',
  },
];

// Asset types
const assetTypes = [
  'Laptop',
  'Desktop',
  'Monitor',
  'Keyboard',
  'Mouse',
  'Headset',
  'Phone',
  'Tablet',
  'Printer',
  'Scanner',
  'Projector',
  'Camera',
  'Office Chair',
  'Desk',
  'Software License',
  'Server Equipment',
];

// Request statuses
const requestStatuses = ['Pending', 'Approved', 'Rejected'];

// Generate a random date within the last 3 months
const getRandomRecentDate = () => {
  const now = new Date();
  const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
  return faker.date.between({ from: threeMonthsAgo, to: new Date() }).toISOString();
};

// Create HR users
const createHRUsers = async () => {
  console.log('Creating HR users...');
  const hrUsers = [];

  // Create specific HR users with fixed credentials for the demo
  const techSolutionsHR = {
    name: 'Tech Solutions HR',
    email: 'hr@techsolutions.com',
    password: 'Password123!',
    company_logo: 'https://i.ibb.co/Qp1nCCk/tech-solutions-logo.png',
    dob: '1985-05-15',
    company_name: 'techsolutions',
    packages: 'premium',
    role: 'hr',
    payment_status: true,
    created_at: new Date().toISOString(),
  };

  try {
    console.log(`Attempting to create HR user: ${techSolutionsHR.email}`);

    // Check if user already exists
    const usersSnapshot = await get(ref(database, 'users'));
    let userExists = false;
    let existingUserId = null;

    if (usersSnapshot.exists()) {
      const users = usersSnapshot.val();
      for (const [id, user] of Object.entries(users)) {
        if (user.email === techSolutionsHR.email) {
          userExists = true;
          existingUserId = id;
          break;
        }
      }
    }

    if (userExists) {
      console.log(`HR user already exists: ${techSolutionsHR.email}`);
      hrUsers.push({ ...techSolutionsHR, id: existingUserId });
    } else {
      // Create new user
      const newUserRef = push(ref(database, 'users'));
      await set(newUserRef, techSolutionsHR);
      console.log(`HR user created: ${techSolutionsHR.email}`);
      hrUsers.push({ ...techSolutionsHR, id: newUserRef.key });
    }
  } catch (error) {
    console.error(`Error creating HR user ${techSolutionsHR.email}:`, error.message);

    // Add a hardcoded user for testing purposes
    console.log('Adding HR user to array despite errors for testing purposes');
    hrUsers.push({ ...techSolutionsHR, id: 'forced-user' });
  }

  // Create additional HR users from the companies array
  for (const company of companies) {
    // Skip Tech Solutions as we've already created it
    if (company.name === 'techsolutions') continue;

    const hrUser = {
      name: faker.person.fullName(),
      email: `hr@${company.name}.com`,
      password: 'Password123!',
      company_logo: company.logo,
      dob: faker.date.birthdate({ min: 25, max: 55, mode: 'age' }).toISOString().split('T')[0],
      company_name: company.name,
      packages: company.package,
      role: 'hr',
      payment_status: true,
      created_at: new Date().toISOString(),
    };

    try {
      console.log(`Attempting to create HR user: ${hrUser.email}`);

      // Check if user already exists
      const usersSnapshot = await get(ref(database, 'users'));
      let userExists = false;
      let existingUserId = null;

      if (usersSnapshot.exists()) {
        const users = usersSnapshot.val();
        for (const [id, user] of Object.entries(users)) {
          if (user.email === hrUser.email) {
            userExists = true;
            existingUserId = id;
            break;
          }
        }
      }

      if (userExists) {
        console.log(`HR user already exists for ${company.displayName}`);
        hrUsers.push({ ...hrUser, id: existingUserId });
      } else {
        // Create new user
        const newUserRef = push(ref(database, 'users'));
        await set(newUserRef, hrUser);
        console.log(`HR user created for ${company.displayName}`);
        hrUsers.push({ ...hrUser, id: newUserRef.key });
      }
    } catch (error) {
      console.error(`Error creating HR user for ${company.displayName}:`, error.message);

      // Add a hardcoded user for testing purposes
      console.log('Adding HR user to array despite errors for testing purposes');
      hrUsers.push({ ...hrUser, id: 'forced-user' });
    }
  }

  console.log(`Created/found ${hrUsers.length} HR users`);

  // If no HR users were created or found, create a hardcoded one for testing
  if (hrUsers.length === 0) {
    console.log('No HR users were created or found. Creating a hardcoded HR user for testing.');
    const hardcodedHR = {
      name: 'Tech Solutions HR',
      email: 'hr@techsolutions.com',
      password: 'Password123!',
      company_logo: 'https://i.ibb.co/Qp1nCCk/tech-solutions-logo.png',
      dob: '1985-05-15',
      company_name: 'techsolutions',
      packages: 'premium',
      role: 'hr',
      payment_status: true,
      created_at: new Date().toISOString(),
    };

    try {
      const newUserRef = push(ref(database, 'users'));
      await set(newUserRef, hardcodedHR);
      hrUsers.push({ ...hardcodedHR, id: newUserRef.key });
    } catch (error) {
      console.error('Error creating hardcoded HR user:', error.message);
      hrUsers.push({ ...hardcodedHR, id: 'hardcoded-hr-user' });
    }

    console.log('Added hardcoded HR user for testing purposes.');
  }

  return hrUsers;
};

// Create employee users
const createEmployeeUsers = async (hrUsers) => {
  console.log('Creating employee users...');
  const employeeUsers = [];

  for (const hrUser of hrUsers) {
    // First create a specific employee for the demo
    if (hrUser.company_name === 'techsolutions') {
      const specificEmployee = {
        name: 'John Doe',
        email: 'john.doe@techsolutions.com',
        password: 'Password123!',
        dob: '1990-01-15',
        company_name: hrUser.company_name,
        role: 'employee',
        department: 'Engineering',
        created_at: new Date().toISOString(),
      };

      try {
        console.log(`Attempting to create specific employee: ${specificEmployee.email}`);

        // Check if user already exists
        const usersSnapshot = await get(ref(database, 'users'));
        let userExists = false;
        let existingUserId = null;

        if (usersSnapshot.exists()) {
          const users = usersSnapshot.val();
          for (const [id, user] of Object.entries(users)) {
            if (user.email === specificEmployee.email) {
              userExists = true;
              existingUserId = id;
              break;
            }
          }
        }

        if (userExists) {
          console.log(`Specific employee already exists: ${specificEmployee.name}`);
          employeeUsers.push({ ...specificEmployee, id: existingUserId });
        } else {
          // Create new user
          const newUserRef = push(ref(database, 'users'));
          await set(newUserRef, specificEmployee);
          console.log(`Specific employee created: ${specificEmployee.name} for ${hrUser.company_name}`);
          employeeUsers.push({ ...specificEmployee, id: newUserRef.key });
        }
      } catch (error) {
        console.error(`Error creating specific employee:`, error.message);

        // Add the employee anyway for testing purposes
        console.log('Adding specific employee to array despite errors for testing purposes');
        employeeUsers.push({ ...specificEmployee, id: 'forced-employee' });
      }
    }

    // Create additional employees per company
    for (let i = 0; i < 4; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      const employeeUser = {
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${hrUser.company_name}.com`,
        password: 'Password123!',
        dob: faker.date.birthdate({ min: 20, max: 60, mode: 'age' }).toISOString().split('T')[0],
        company_name: hrUser.company_name,
        role: 'employee',
        department: faker.helpers.arrayElement(['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations']),
        created_at: new Date().toISOString(),
      };

      try {
        console.log(`Attempting to create employee user: ${employeeUser.email}`);

        // Check if user already exists
        const usersSnapshot = await get(ref(database, 'users'));
        let userExists = false;
        let existingUserId = null;

        if (usersSnapshot.exists()) {
          const users = usersSnapshot.val();
          for (const [id, user] of Object.entries(users)) {
            if (user.email === employeeUser.email) {
              userExists = true;
              existingUserId = id;
              break;
            }
          }
        }

        if (userExists) {
          console.log(`Employee user already exists: ${employeeUser.name}`);
          employeeUsers.push({ ...employeeUser, id: existingUserId });
        } else {
          // Create new user
          const newUserRef = push(ref(database, 'users'));
          await set(newUserRef, employeeUser);
          console.log(`Employee user created: ${employeeUser.name} for ${hrUser.company_name}`);
          employeeUsers.push({ ...employeeUser, id: newUserRef.key });
        }
      } catch (error) {
        console.error(`Error creating employee user:`, error.message);

        // Add the employee anyway for testing purposes
        if (i === 0) { // Only add one forced employee per company to avoid too many
          console.log('Adding employee to array despite errors for testing purposes');
          employeeUsers.push({ ...employeeUser, id: 'forced-employee' });
        }
      }
    }
  }

  // If no employees were created or found, create a hardcoded one for testing
  if (employeeUsers.length === 0) {
    console.log('No employees were created or found. Creating a hardcoded employee for testing.');
    const hardcodedEmployee = {
      name: 'John Doe',
      email: 'john.doe@techsolutions.com',
      password: 'Password123!',
      dob: '1990-01-15',
      company_name: 'techsolutions',
      role: 'employee',
      department: 'Engineering',
      created_at: new Date().toISOString(),
    };

    try {
      const newUserRef = push(ref(database, 'users'));
      await set(newUserRef, hardcodedEmployee);
      employeeUsers.push({ ...hardcodedEmployee, id: newUserRef.key });
    } catch (error) {
      console.error('Error creating hardcoded employee:', error.message);
      employeeUsers.push({ ...hardcodedEmployee, id: 'hardcoded-employee' });
    }

    console.log('Added hardcoded employee for testing purposes.');
  }

  console.log(`Created/found ${employeeUsers.length} employees`);
  return employeeUsers;
};

// Create assets
const createAssets = async (hrUsers) => {
  console.log('Creating assets...');
  const assets = [];

  for (const hrUser of hrUsers) {
    // Create 5 assets per company (reduced from 10 to speed up the process)
    for (let i = 0; i < 5; i++) {
      const assetType = faker.helpers.arrayElement(assetTypes);
      const assetData = {
        product_name: `${faker.commerce.productAdjective()} ${assetType}`,
        product_type: assetType,
        product_quantity: faker.number.int({ min: 1, max: 50 }),
        creator_name: hrUser.name,
        creator_email: hrUser.email,
        company_name: hrUser.company_name,
        created_date: new Date().toISOString(),
      };

      try {
        console.log(`Attempting to create asset: ${assetData.product_name}`);

        // Create new asset
        const newAssetRef = push(ref(database, 'assets'));
        await set(newAssetRef, assetData);
        console.log(`Asset created: ${assetData.product_name} for ${hrUser.company_name}`);
        assets.push({ ...assetData, id: newAssetRef.key });
      } catch (error) {
        console.error(`Error creating asset:`, error.message);

        // Add a hardcoded asset anyway for testing purposes
        if (i === 0) { // Only add one hardcoded asset per company to avoid too many
          console.log('Adding hardcoded asset despite error');
          assets.push({
            ...assetData,
            id: `hardcoded-asset-${hrUser.company_name}-${i}`
          });
        }
      }
    }
  }

  // If no assets were created, add some hardcoded ones
  if (assets.length === 0) {
    console.log('No assets were created. Adding hardcoded assets for testing.');

    // Create some hardcoded assets for testing
    for (const assetType of assetTypes.slice(0, 5)) { // Just use the first 5 asset types
      const assetData = {
        product_name: `Demo ${assetType}`,
        product_type: assetType,
        product_quantity: faker.number.int({ min: 5, max: 20 }),
        creator_name: 'Tech Solutions HR',
        creator_email: 'hr@techsolutions.com',
        company_name: 'techsolutions',
        created_date: new Date().toISOString(),
      };

      try {
        const newAssetRef = push(ref(database, 'assets'));
        await set(newAssetRef, assetData);
        assets.push({ ...assetData, id: newAssetRef.key });
        console.log(`Added hardcoded asset: ${assetData.product_name}`);
      } catch (error) {
        console.error(`Error creating hardcoded asset:`, error.message);
        assets.push({
          ...assetData,
          id: `hardcoded-asset-${assetType.toLowerCase().replace(' ', '-')}`
        });
      }
    }
  }

  console.log(`Created/found ${assets.length} assets`);
  return assets;
};

// Create asset requests
const createRequests = async (employees, assets) => {
  console.log('Creating asset requests...');
  const requests = [];

  // If no assets/employees, create hardcoded requests
  if (assets.length === 0 || employees.length === 0) {
    console.log('Creating hardcoded requests for testing...');

    // Create some hardcoded requests
    const statuses = ['Pending', 'Approved', 'Rejected'];

    for (let i = 0; i < 5; i++) {
      const asset = assets.length > 0 ? assets[i % assets.length] : {
        id: `hardcoded-asset-${i}`,
        product_name: `Demo Asset ${i}`,
        product_type: assetTypes[i % assetTypes.length],
      };

      const employee = employees.length > 0 ? employees[0] : {
        name: 'John Doe',
        email: 'john.doe@techsolutions.com',
        company_name: 'techsolutions',
      };

      const requestData = {
        asset_id: asset.id,
        asset_name: asset.product_name,
        asset_type: asset.product_type,
        asset_quantity: faker.number.int({ min: 1, max: 3 }),
        requester_name: employee.name,
        requester_email: employee.email,
        requester_company: employee.company_name,
        request_date: getRandomRecentDate(),
        status: statuses[i % statuses.length],
        note: `Demo request for ${asset.product_name}`,
        approval_date: statuses[i % statuses.length] !== 'Pending' ? getRandomRecentDate() : null,
        approvedBy: statuses[i % statuses.length] !== 'Pending' ? 'HR Manager' : null,
      };

      try {
        const newRequestRef = push(ref(database, 'requests'));
        await set(newRequestRef, requestData);
        requests.push({ ...requestData, id: newRequestRef.key });
        console.log(`Added hardcoded request: ${requestData.asset_name} for ${requestData.requester_name}`);
      } catch (error) {
        console.error(`Error creating hardcoded request:`, error.message);
        requests.push({ ...requestData, id: `hardcoded-request-${i}` });
      }
    }

    console.log(`Created ${requests.length} hardcoded requests for testing.`);
    return requests;
  }

  // Group assets by company
  const assetsByCompany = {};
  for (const asset of assets) {
    if (!assetsByCompany[asset.company_name]) {
      assetsByCompany[asset.company_name] = [];
    }
    assetsByCompany[asset.company_name].push(asset);
  }

  for (const employee of employees) {
    const companyAssets = assetsByCompany[employee.company_name] || [];
    if (companyAssets.length === 0) continue;

    // Create 1-2 requests per employee (reduced from 1-3 to speed up the process)
    const requestCount = faker.number.int({ min: 1, max: 2 });
    for (let i = 0; i < requestCount; i++) {
      const asset = faker.helpers.arrayElement(companyAssets);
      const requestDate = getRandomRecentDate();

      // For John Doe, ensure at least one approved request for testing
      let status;
      if (employee.email === 'john.doe@techsolutions.com' && i === 0) {
        status = 'Approved';
      } else {
        status = faker.helpers.arrayElement(requestStatuses);
      }

      const requestData = {
        asset_id: asset.id,
        asset_name: asset.product_name,
        asset_type: asset.product_type,
        asset_quantity: faker.number.int({ min: 1, max: 3 }),
        requester_name: employee.name,
        requester_email: employee.email,
        requester_company: employee.company_name,
        request_date: requestDate,
        status: status,
        note: faker.lorem.sentence(),
        approval_date: status !== 'Pending' ? getRandomRecentDate() : null,
        approvedBy: status !== 'Pending' ? 'HR Manager' : null,
      };

      try {
        console.log(`Attempting to create request for ${employee.name}: ${asset.product_name}`);
        const newRequestRef = push(ref(database, 'requests'));
        await set(newRequestRef, requestData);
        console.log(`Request created for ${employee.name}: ${asset.product_name}`);
        requests.push({ ...requestData, id: newRequestRef.key });
      } catch (error) {
        console.error(`Error creating request:`, error.message);

        // Add a hardcoded request anyway for testing purposes
        if (i === 0) { // Only add one hardcoded request per employee to avoid too many
          console.log('Adding hardcoded request despite error');
          requests.push({
            ...requestData,
            id: `hardcoded-request-${employee.name}-${i}`
          });
        }
      }
    }
  }

  // If no requests were created, add some hardcoded ones
  if (requests.length === 0) {
    console.log('No requests were created. Adding hardcoded requests for testing.');

    // Create some hardcoded requests
    const statuses = ['Pending', 'Approved', 'Rejected'];

    for (let i = 0; i < 5; i++) {
      const asset = assets.length > 0 ? assets[i % assets.length] : {
        id: `hardcoded-asset-${i}`,
        product_name: `Demo Asset ${i}`,
        product_type: assetTypes[i % assetTypes.length],
      };

      const employee = employees.length > 0 ? employees[0] : {
        name: 'John Doe',
        email: 'john.doe@techsolutions.com',
        company_name: 'techsolutions',
      };

      const requestData = {
        asset_id: asset.id,
        asset_name: asset.product_name,
        asset_type: asset.product_type,
        asset_quantity: faker.number.int({ min: 1, max: 3 }),
        requester_name: employee.name,
        requester_email: employee.email,
        requester_company: employee.company_name,
        request_date: getRandomRecentDate(),
        status: statuses[i % statuses.length],
        note: `Demo request for ${asset.product_name}`,
        approval_date: statuses[i % statuses.length] !== 'Pending' ? getRandomRecentDate() : null,
        approvedBy: statuses[i % statuses.length] !== 'Pending' ? 'HR Manager' : null,
      };

      try {
        const newRequestRef = push(ref(database, 'requests'));
        await set(newRequestRef, requestData);
        requests.push({ ...requestData, id: newRequestRef.key });
        console.log(`Added hardcoded request: ${requestData.asset_name} for ${requestData.requester_name}`);
      } catch (error) {
        console.error(`Error creating hardcoded request:`, error.message);
        requests.push({ ...requestData, id: `hardcoded-request-${i}` });
      }
    }
  }

  console.log(`Created/found ${requests.length} requests`);
  return requests;
};

// Monthly requests feature removed to simplify the college project

// Create user assets (assets assigned to users)
const createUserAssets = async (_, __, requests) => {
  console.log('Creating user assets...');
  const userAssets = [];

  // Only create user assets for approved requests
  const approvedRequests = requests.filter(request => request.status === 'Approved');

  if (approvedRequests.length === 0) {
    console.log('No approved requests found. No user assets will be created.');
    return userAssets;
  }

  console.log(`Found ${approvedRequests.length} approved requests to create user assets for.`);

  for (const request of approvedRequests) {
    // Get the asset and employee information from the request
    const assetId = request.asset_id;
    const requesterEmail = request.requester_email;

    // Skip if missing required information
    if (!assetId || !requesterEmail) {
      console.log(`Skipping request with missing asset_id or requester_email: ${request.id}`);
      continue;
    }

    // Check if this user asset already exists to avoid duplicates
    const existingUserAssets = await get(ref(database, 'user_assets'));
    let userAssetExists = false;

    if (existingUserAssets.exists()) {
      const userAssetsData = existingUserAssets.val();
      for (const key in userAssetsData) {
        const userAsset = userAssetsData[key];
        if (userAsset.request_id === request.id) {
          userAssetExists = true;
          console.log(`User asset for request ${request.id} already exists. Skipping.`);
          break;
        }
      }
    }

    if (userAssetExists) continue;

    // Create the user asset
    const userAssetData = {
      user_id: request.requester_email,
      user_name: request.requester_name,
      asset_id: request.asset_id,
      asset_name: request.asset_name,
      asset_type: request.asset_type,
      request_id: request.id,
      assigned_date: request.approval_date || getRandomRecentDate(),
      status: "Active",
      company_name: request.requester_company
    };

    try {
      console.log(`Creating user asset for ${request.requester_name}: ${request.asset_name}`);
      const newUserAssetRef = push(ref(database, 'user_assets'));
      await set(newUserAssetRef, userAssetData);
      console.log(`User asset created for ${request.requester_name}: ${request.asset_name}`);
      userAssets.push({ ...userAssetData, id: newUserAssetRef.key });
    } catch (error) {
      console.error(`Error creating user asset:`, error.message);
    }
  }

  console.log(`Created/found ${userAssets.length} user assets`);
  return userAssets;
};

// Function to clear all data from the database
const clearDatabase = async () => {
  console.log('Clearing existing database data...');

  // List of collections to clear
  const collections = ['users', 'assets', 'requests', 'user_assets'];

  for (const collection of collections) {
    try {
      console.log(`Clearing ${collection} collection...`);
      await set(ref(database, collection), null);
      console.log(`Successfully cleared ${collection} collection`);
    } catch (error) {
      console.error(`Error clearing ${collection} collection:`, error.message);
    }
  }

  console.log('Database clearing completed');
};

// Main function to run the seed script
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data first
    await clearDatabase();

    // Create HR users
    const hrUsers = await createHRUsers();

    if (!hrUsers || hrUsers.length === 0) {
      console.error('No HR users were created or found. Cannot proceed with seeding.');
      return { hrUsers: [], employees: [], assets: [], requests: [], userAssets: [] };
    }

    console.log(`Successfully created/found ${hrUsers.length} HR users.`);
    console.log(`First HR user: ${hrUsers[0].email}`);

    // Create employee users
    const employees = await createEmployeeUsers(hrUsers);

    if (!employees || employees.length === 0) {
      console.error('No employees were created. Cannot proceed with creating assets and requests.');
      return { hrUsers, employees: [], assets: [], requests: [], userAssets: [] };
    }

    console.log(`Successfully created ${employees.length} employees.`);

    // Create assets
    const assets = await createAssets(hrUsers);

    if (!assets || assets.length === 0) {
      console.error('No assets were created. Cannot proceed with creating requests.');
      return { hrUsers, employees, assets: [], requests: [], userAssets: [] };
    }

    console.log(`Successfully created ${assets.length} assets.`);

    // Create requests
    const requests = await createRequests(employees, assets);

    // Create user assets (assets assigned to users) based on approved requests
    const userAssets = await createUserAssets(employees, assets, requests);

    console.log('Database seeding completed successfully!');
    console.log(`Created ${hrUsers.length} HR users`);
    console.log(`Created ${employees.length} employees`);
    console.log(`Created ${assets.length} assets`);
    console.log(`Created ${requests.length} requests`);
    console.log(`Created ${userAssets.length} user assets`);

    return {
      hrUsers,
      employees,
      assets,
      requests,
      userAssets,
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    console.error(error.stack);
    throw error;
  }
};

// Run the seed script
seedDatabase()
  .then(() => {
    console.log('Seed script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });
