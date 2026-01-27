/**
 * Firebase initialization script
 * Run this script to set up initial demo data in Firestore
 * 
 * Usage: node scripts/init-firebase.js
 * 
 * Make sure to set your Firebase Admin SDK credentials or use the Firebase CLI
 */

// This is a reference script - you'll need to set up Firebase Admin SDK
// or manually add the data through Firebase Console

const demoUsers = [
  {
    id: 'admin@example.com',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date()
  },
  {
    id: 'employee@example.com',
    email: 'employee@example.com',
    name: 'Employee User',
    role: 'employee',
    createdAt: new Date()
  }
]

const demoShifts = [
  {
    employeeId: 'employee@example.com',
    employeeName: 'Employee User',
    startTime: new Date('2024-01-15T09:00:00'),
    endTime: new Date('2024-01-15T17:00:00'),
    title: 'Morning Shift',
    notes: 'Regular shift'
  },
  {
    employeeId: 'employee@example.com',
    employeeName: 'Employee User',
    startTime: new Date('2024-01-16T09:00:00'),
    endTime: new Date('2024-01-16T17:00:00'),
    title: 'Morning Shift',
    notes: 'Regular shift'
  }
]

console.log('Demo data structure:')
console.log('\nUsers:', JSON.stringify(demoUsers, null, 2))
console.log('\nShifts:', JSON.stringify(demoShifts, null, 2))
console.log('\nPlease add these manually to Firestore or set up Firebase Admin SDK to run this script.')
