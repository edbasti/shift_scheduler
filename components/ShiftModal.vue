<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ shift ? 'Edit Shift' : 'Create Shift' }}
          </h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="employeeId" class="block text-sm font-medium text-gray-700 mb-1">
              Employee
            </label>
            <select
              id="employeeId"
              v-model="formData.employeeId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an employee</option>
              <option v-for="user in employees" :key="user.id" :value="user.id">
                {{ user.name }} ({{ user.email }})
              </option>
            </select>
          </div>
          
          <div>
            <label for="startTime" class="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              id="startTime"
              v-model="formData.startTime"
              type="datetime-local"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label for="endTime" class="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              id="endTime"
              v-model="formData.endTime"
              type="datetime-local"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
              Title (optional)
            </label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              v-model="formData.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ loading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Shift, User } from '~/types'

interface Props {
  shift?: Shift | null
  initialStart?: Date | null
  initialEnd?: Date | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: []
}>()

const { getUsers } = useUsers()
const { createShift, updateShift } = useShifts()
const employees = ref<User[]>([])
const loading = ref(false)
const error = ref('')

const formData = ref({
  employeeId: '',
  startTime: '',
  endTime: '',
  title: '',
  notes: ''
})

const loadEmployees = async () => {
  const allUsers = await getUsers()
  employees.value = allUsers.filter(u => u.role === 'employee')
}

const initializeForm = () => {
  if (props.shift) {
    const startTime = typeof props.shift.startTime === 'string' 
      ? new Date(props.shift.startTime) 
      : props.shift.startTime
    const endTime = typeof props.shift.endTime === 'string' 
      ? new Date(props.shift.endTime) 
      : props.shift.endTime
    
    formData.value = {
      employeeId: props.shift.employeeId,
      startTime: formatDateTimeLocal(startTime),
      endTime: formatDateTimeLocal(endTime),
      title: props.shift.title || '',
      notes: props.shift.notes || ''
    }
  } else {
    // New shift: optionally prefill from initialStart/initialEnd if provided
    const start = props.initialStart ?? null
    const end = props.initialEnd ?? null

    formData.value = {
      employeeId: '',
      startTime: start ? formatDateTimeLocal(start) : '',
      endTime: end ? formatDateTimeLocal(end) : '',
      title: '',
      notes: ''
    }
  }
}

const formatDateTimeLocal = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  const selectedEmployee = employees.value.find(e => e.id === formData.value.employeeId)
  if (!selectedEmployee) {
    error.value = 'Please select an employee'
    loading.value = false
    return
  }
  
  const shiftData: any = {
    employeeId: formData.value.employeeId,
    employeeName: selectedEmployee.name,
    startTime: new Date(formData.value.startTime),
    endTime: new Date(formData.value.endTime)
  }
  
  console.log('Creating shift with employeeId:', shiftData.employeeId, 'for employee:', selectedEmployee.name)
  
  // Only add optional fields if they have values
  if (formData.value.title && formData.value.title.trim() !== '') {
    shiftData.title = formData.value.title.trim()
  }
  if (formData.value.notes && formData.value.notes.trim() !== '') {
    shiftData.notes = formData.value.notes.trim()
  }
  
  let result
  if (props.shift) {
    result = await updateShift(props.shift.id, shiftData)
  } else {
    result = await createShift(shiftData)
  }
  
  if (result.success) {
    console.log('Shift saved successfully with employeeId:', shiftData.employeeId)
    emit('save')
    emit('close')
  } else {
    error.value = result.error || 'Failed to save shift'
  }
  
  loading.value = false
}

onMounted(async () => {
  await loadEmployees()
  initializeForm()
})

watch(
  () => [props.shift, props.initialStart, props.initialEnd],
  () => {
    initializeForm()
  }
)
</script>
