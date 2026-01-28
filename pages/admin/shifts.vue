<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Manage Shifts</h1>
          <p class="text-sm text-gray-500 mt-1">
            Switch between list and calendar views. In calendar view you can drag shifts to other dates.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              @click="viewMode = 'list'"
              :class="[
                'px-4 py-2 text-sm font-medium border border-gray-300 first:rounded-l-md last:rounded-r-md',
                viewMode === 'list'
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              List view
            </button>
            <button
              type="button"
              @click="viewMode = 'calendar'"
              :class="[
                'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300 last:rounded-r-md',
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              Calendar view
            </button>
          </div>
          <button
            @click="showCreateModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Shift
          </button>
        </div>
      </div>

      <div v-if="viewMode === 'list'">
        <ShiftsList ref="shiftsListRef" :admin-mode="true" @edit="handleEdit" />
      </div>
      <div v-else>
        <AdminShiftsCalendar
          ref="adminCalendarRef"
          @create-for-date="handleCreateForDate"
        />
      </div>

      <ShiftModal
        v-if="showCreateModal || editingShift"
        :shift="editingShift"
        :initial-start="initialStart"
        :initial-end="initialEnd"
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
const adminCalendarRef = ref<any>(null)
const viewMode = ref<'list' | 'calendar'>('list')
const initialStart = ref<Date | null>(null)
const initialEnd = ref<Date | null>(null)

const handleEdit = (shift: Shift) => {
  editingShift.value = shift
}

const closeModal = () => {
  showCreateModal.value = false
  editingShift.value = null
  initialStart.value = null
  initialEnd.value = null
}

const handleSave = async () => {
  closeModal()
  // Force refresh the active view
  if (viewMode.value === 'list' && shiftsListRef.value) {
    await shiftsListRef.value.refresh()
  }
  if (viewMode.value === 'calendar' && adminCalendarRef.value) {
    await adminCalendarRef.value.refresh()
  }
}

const handleCreateForDate = (date: Date) => {
  // Default to 9–17 on that date; admin can adjust in modal
  const start = new Date(date)
  start.setHours(9, 0, 0, 0)
  const end = new Date(date)
  end.setHours(17, 0, 0, 0)

  initialStart.value = start
  initialEnd.value = end
  editingShift.value = null
  showCreateModal.value = true
}
</script>
