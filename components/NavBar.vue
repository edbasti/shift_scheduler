<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-8">
          <NuxtLink to="/" class="text-xl font-bold text-gray-900">
            Shift Scheduler
          </NuxtLink>
          <div v-if="user" class="flex space-x-4">
            <template v-if="isAdmin">
              <NuxtLink
                to="/admin/shifts"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Manage Shifts
              </NuxtLink>
              <NuxtLink
                to="/admin/users"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Manage Users
              </NuxtLink>
            </template>
          </div>
        </div>
        <div v-if="user" class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">
            {{ user.name }} ({{ user.role }})
          </span>
          <button
            @click="handleLogout"
            class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
const { user, logout, isAdmin } = useAuth()

const handleLogout = async () => {
  await logout()
}
</script>
