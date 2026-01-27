<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Manage Shifts</h1>
        <button
          @click="showCreateModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Shift
        </button>
      </div>
      
      <ShiftsList ref="shiftsListRef" :admin-mode="true" @edit="handleEdit" />
      
      <ShiftModal
        v-if="showCreateModal || editingShift"
        :shift="editingShift"
        @close="closeModal"
        @save="handleSave"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Shift } from '~/types'

definePageMeta({
  middleware: ['auth', 'admin']
})

const showCreateModal = ref(false)
const editingShift = ref<Shift | null>(null)
const shiftsListRef = ref<any>(null)

const handleEdit = (shift: Shift) => {
  editingShift.value = shift
}

const closeModal = () => {
  showCreateModal.value = false
  editingShift.value = null
}

const handleSave = async () => {
  closeModal()
  // Force refresh the shifts list
  if (shiftsListRef.value) {
    await shiftsListRef.value.refresh()
  }
}
</script>
