<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Welcome to Shift Scheduler</h2>
      <p class="text-gray-600">
        Your Nuxt application with Firebase and Tailwind CSS is ready!
      </p>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-2">Firebase Status</h3>
      <p class="text-sm text-gray-600">
        Firebase is configured and ready to use. Make sure to set your Firebase configuration in the environment variables.
      </p>
    </div>
  </div>
</template>

<script setup>
// Example: Access Firebase services
const { $auth, $db, $storage } = useNuxtApp()

// You can use Firebase services here
// Example: const user = await signInWithEmailAndPassword($auth, email, password)
</script>
