<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">My Shifts</h1>
      <div v-if="!user" class="text-center py-8">
        <p class="text-gray-600">Loading...</p>
      </div>
      <ShiftsCalendar v-else-if="isEmployee" />
      <ShiftsList v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { isEmployee, user } = useAuth()

// Ensure user is loaded
onMounted(async () => {
  const { checkAuth } = useAuth()
  if (!user.value) {
    await checkAuth()
  }
})
</script>
