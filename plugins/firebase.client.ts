import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId
  }

  // Validate Firebase configuration
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('Firebase configuration is missing. Please set your Firebase environment variables.')
    throw new Error('Firebase configuration is incomplete. Please check your .env file.')
  }

  try {
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const db = getFirestore(app)
    const storage = getStorage(app)

    // Enable offline persistence (optional, but helps with offline errors)
    if (process.client) {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Firestore persistence failed: Multiple tabs open')
        } else if (err.code === 'unimplemented') {
          console.warn('Firestore persistence not available in this browser')
        }
      })
    }

    return {
      provide: {
        firebase: app,
        auth,
        db,
        storage
      }
    }
  } catch (error) {
    console.error('Failed to initialize Firebase:', error)
    throw error
  }
})
