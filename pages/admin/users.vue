<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Manage Users</h1>
        <button
          @click="showCreateModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create User
        </button>
      </div>
      
      <UsersList @edit="handleEdit" />
      
      <UserModal
        v-if="showCreateModal || editingUser"
        :user="editingUser"
        @close="closeModal"
        @save="handleSave"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'

definePageMeta({
  middleware: ['auth', 'admin']
})

const showCreateModal = ref(false)
const editingUser = ref<User | null>(null)

const handleEdit = (user: User) => {
  editingUser.value = user
}

const closeModal = () => {
  showCreateModal.value = false
  editingUser.value = null
}

const handleSave = () => {
  closeModal()
}
</script>
