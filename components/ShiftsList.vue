<template>
  <div>
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Loading shifts...</p>
    </div>
    <div v-else-if="shifts.length === 0" class="text-center py-8">
      <p class="text-gray-600">No shifts found.</p>
    </div>
    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="shift in shifts"
        :key="shift.id"
        class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ shift.employeeName }}
            </h3>
            <p v-if="shift.title" class="text-sm text-gray-600 mt-1">
              {{ shift.title }}
            </p>
          </div>
          <div v-if="adminMode" class="flex space-x-2">
            <button
              @click="$emit('edit', shift)"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit
            </button>
            <button
              @click="handleDelete(shift.id)"
              class="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(shift.startTime) }}
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ formatTime(shift.startTime) }} - {{ formatTime(shift.endTime) }}
          </div>
          <div v-if="shift.notes" class="text-sm text-gray-600 mt-2 pt-2 border-t border-gray-200">
            {{ shift.notes }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Shift } from '~/types'

interface Props {
  adminMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  adminMode: false
})

const emit = defineEmits<{
  edit: [shift: Shift]
}>()

const { getShifts, deleteShift } = useShifts()
const { user } = useAuth()
const shifts = ref<Shift[]>([])
const loading = ref(true)

const loadShifts = async () => {
  loading.value = true
  if (props.adminMode) {
    shifts.value = await getShifts()
  } else {
    console.log('Loading shifts for employee:', user.value?.id)
    shifts.value = await getShifts(user.value?.id)
    console.log('Loaded shifts:', shifts.value.length, 'for employee:', user.value?.id)
  }
  loading.value = false
}

const refresh = async () => {
  await loadShifts()
}

const handleDelete = async (shiftId: string) => {
  if (confirm('Are you sure you want to delete this shift?')) {
    const result = await deleteShift(shiftId)
    if (result.success) {
      await loadShifts()
    }
  }
}

const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

const formatTime = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

onMounted(() => {
  loadShifts()
})

watch(() => props.adminMode, () => {
  loadShifts()
})

// Watch for user changes
watch(() => user.value?.id, () => {
  if (user.value?.id && !props.adminMode) {
    loadShifts()
  }
})

// Expose refresh method
defineExpose({
  refresh
})
</script>
