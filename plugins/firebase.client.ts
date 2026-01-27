import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey || 'your-api-key',
    authDomain: config.public.firebaseAuthDomain || 'your-project.firebaseapp.com',
    projectId: config.public.firebaseProjectId || 'your-project-id',
    storageBucket: config.public.firebaseStorageBucket || 'your-project.appspot.com',
    messagingSenderId: config.public.firebaseMessagingSenderId || 'your-sender-id',
    appId: config.public.firebaseAppId || 'your-app-id'
  }

  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const db = getFirestore(app)
  const storage = getStorage(app)

  return {
    provide: {
      firebase: app,
      auth,
      db,
      storage
    }
  }
})
