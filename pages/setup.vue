<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">Initialize Demo Data</h1>
      
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-600">Initializing demo data...</p>
      </div>
      
      <div v-else-if="completed" class="space-y-4">
        <div class="bg-green-50 border border-green-200 rounded-md p-4">
          <h2 class="text-lg font-semibold text-green-800 mb-2">✓ Demo data initialized successfully!</h2>
          <p class="text-sm text-green-700 mb-4">
            You can now log in with the following credentials:
          </p>
          <div class="space-y-2 text-sm">
            <div class="bg-white p-3 rounded border border-green-200">
              <p class="font-semibold text-gray-900">Admin User:</p>
              <p class="text-gray-600">Email: admin@example.com</p>
              <p class="text-gray-600">Password: admin123</p>
            </div>
            <div class="bg-white p-3 rounded border border-green-200">
              <p class="font-semibold text-gray-900">Employee User:</p>
              <p class="text-gray-600">Email: employee@example.com</p>
              <p class="text-gray-600">Password: employee123</p>
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <NuxtLink
            to="/login"
            class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Go to Login
          </NuxtLink>
        </div>
      </div>
      
      <div v-else class="space-y-4">
        <p class="text-gray-700 mb-6">
          This will create demo users and sample shifts in your Firestore database.
        </p>
        
        <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
          <p class="text-blue-800 text-sm font-semibold mb-2">Before initializing:</p>
          <ul class="text-blue-700 text-sm list-disc list-inside space-y-1">
            <li>Ensure you have a <code class="bg-blue-100 px-1 rounded">.env</code> file with your Firebase credentials</li>
            <li>Firestore Database must be enabled in your Firebase Console</li>
            <li>Create a Firestore database if you haven't already (start in test mode for development)</li>
          </ul>
        </div>
        
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <p class="text-red-800 text-sm font-semibold mb-2">Error:</p>
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>
        
        <div v-if="results.length > 0" class="space-y-2">
          <div
            v-for="(result, index) in results"
            :key="index"
            :class="[
              'p-3 rounded-md text-sm',
              result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            ]"
          >
            {{ result.message }}
          </div>
        </div>
        
        <button
          @click="initializeData"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Initializing...' : 'Initialize Demo Data' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { doc, setDoc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore'
import type { User } from '~/types'

const { $db } = useNuxtApp()
const loading = ref(false)
const completed = ref(false)
const error = ref('')
const results = ref<Array<{ success: boolean; message: string }>>([])

const initializeData = async () => {
  loading.value = true
  error.value = ''
  results.value = []

  // Check if Firebase is properly initialized
  if (!$db) {
    error.value = 'Firebase is not initialized. Please check your Firebase configuration in the .env file.'
    loading.value = false
    return
  }

  try {
    // Test Firestore connection first
    results.value.push({
      success: true,
      message: 'Connecting to Firestore...'
    })

    // Create demo users
    const demoUsers: Array<Omit<User, 'id'> & { id: string }> = [
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

    // Check if users already exist and create them
    for (const user of demoUsers) {
      const userRef = doc($db, 'users', user.id)
      const userSnap = await getDoc(userRef)
      
      if (userSnap.exists()) {
        results.value.push({
          success: true,
          message: `User ${user.email} already exists, skipping...`
        })
      } else {
        await setDoc(userRef, user)
        results.value.push({
          success: true,
          message: `Created user: ${user.email} (${user.role})`
        })
      }
    }

    // Create demo shifts
    const now = new Date()
    
    // Tomorrow's shift
    const tomorrowStart = new Date(now)
    tomorrowStart.setDate(tomorrowStart.getDate() + 1)
    tomorrowStart.setHours(9, 0, 0, 0)
    const tomorrowEnd = new Date(tomorrowStart)
    tomorrowEnd.setHours(17, 0, 0, 0)
    
    // Next week's shift
    const nextWeekStart = new Date(now)
    nextWeekStart.setDate(nextWeekStart.getDate() + 7)
    nextWeekStart.setHours(9, 0, 0, 0)
    const nextWeekEnd = new Date(nextWeekStart)
    nextWeekEnd.setHours(17, 0, 0, 0)
    
    // Day after next week's shift
    const nextWeekPlus1Start = new Date(now)
    nextWeekPlus1Start.setDate(nextWeekPlus1Start.getDate() + 8)
    nextWeekPlus1Start.setHours(9, 0, 0, 0)
    const nextWeekPlus1End = new Date(nextWeekPlus1Start)
    nextWeekPlus1End.setHours(17, 0, 0, 0)
    
    const demoShifts = [
      {
        employeeId: 'employee@example.com',
        employeeName: 'Employee User',
        startTime: Timestamp.fromDate(tomorrowStart),
        endTime: Timestamp.fromDate(tomorrowEnd),
        title: 'Morning Shift',
        notes: 'Regular shift',
        createdAt: Timestamp.now()
      },
      {
        employeeId: 'employee@example.com',
        employeeName: 'Employee User',
        startTime: Timestamp.fromDate(nextWeekStart),
        endTime: Timestamp.fromDate(nextWeekEnd),
        title: 'Morning Shift',
        notes: 'Regular shift',
        createdAt: Timestamp.now()
      },
      {
        employeeId: 'employee@example.com',
        employeeName: 'Employee User',
        startTime: Timestamp.fromDate(nextWeekPlus1Start),
        endTime: Timestamp.fromDate(nextWeekPlus1End),
        title: 'Morning Shift',
        notes: 'Regular shift',
        createdAt: Timestamp.now()
      }
    ]

    for (const shift of demoShifts) {
      await addDoc(collection($db, 'shifts'), shift)
      results.value.push({
        success: true,
        message: `Created shift for ${shift.employeeName} on ${shift.startTime.toDate().toLocaleDateString()}`
      })
    }

    completed.value = true
  } catch (err: any) {
    console.error('Initialize data error:', err)
    
    let errorMessage = err.message || 'Failed to initialize demo data'
    
    // Provide more helpful error messages
    if (errorMessage.includes('offline')) {
      errorMessage = 'Firestore is offline. Please check: 1) Your Firebase project has Firestore enabled, 2) Your internet connection, 3) Your Firebase configuration is correct in the .env file'
    } else if (errorMessage.includes('permission-denied')) {
      errorMessage = 'Permission denied. Please check your Firestore security rules allow write access.'
    } else if (errorMessage.includes('not-found')) {
      errorMessage = 'Firestore database not found. Please ensure Firestore is enabled in your Firebase Console.'
    }
    
    error.value = errorMessage
    results.value.push({
      success: false,
      message: `Error: ${errorMessage}`
    })
  } finally {
    loading.value = false
  }
}
</script>
