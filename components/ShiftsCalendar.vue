<template>
  <div>
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Loading shifts...</p>
    </div>
    <div v-else class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          {{ currentMonthYear }}
        </h2>
        <div class="flex justify-between items-center">
          <button
            @click="previousMonth"
            class="text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100"
          >
            ← Previous
          </button>
          <button
            @click="currentMonth"
            class="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50 text-sm font-medium"
          >
            Today
          </button>
          <button
            @click="nextMonth"
            class="text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100"
          >
            Next →
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-7 gap-2 mb-2">
        <div v-for="day in weekDays" :key="day" class="text-center text-sm font-semibold text-gray-600 py-2">
          {{ day }}
        </div>
      </div>
      
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="[
            'min-h-24 p-2 border border-gray-200 rounded-md',
            day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
            day.isToday ? 'ring-2 ring-blue-500' : ''
          ]"
        >
          <div class="text-sm font-medium mb-1" :class="day.isToday ? 'text-blue-600' : 'text-gray-900'">
            {{ day.date.getDate() }}
          </div>
          <div class="space-y-1">
            <div
              v-for="shift in day.shifts"
              :key="shift.id"
              class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate"
              :title="shiftTitle(shift)"
            >
              {{ formatTime(shift.startTime) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Shift } from '~/types'

const { getShifts } = useShifts()
const { user } = useAuth()
const shifts = ref<Shift[]>([])
const loading = ref(true)
const currentDate = ref(new Date())

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - startDate.getDay())
  
  const days: Array<{
    date: Date
    isCurrentMonth: boolean
    isToday: boolean
    shifts: Shift[]
  }> = []
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const dateStr = date.toDateString()
    const dateOnly = new Date(date)
    dateOnly.setHours(0, 0, 0, 0)
    
    const dayShifts = shifts.value.filter(shift => {
      const shiftDate = typeof shift.startTime === 'string' ? new Date(shift.startTime) : shift.startTime
      const shiftDateOnly = new Date(shiftDate)
      shiftDateOnly.setHours(0, 0, 0, 0)
      return shiftDateOnly.getTime() === dateOnly.getTime()
    })
    
    days.push({
      date,
      isCurrentMonth: date.getMonth() === month,
      isToday: dateOnly.getTime() === today.getTime(),
      shifts: dayShifts
    })
  }
  
  return days
})

const loadShifts = async () => {
  if (!user.value?.id) {
    // Wait a bit for user to load
    await new Promise(resolve => setTimeout(resolve, 100))
    if (!user.value?.id) {
      console.error('User not loaded')
      loading.value = false
      return
    }
  }
  
  loading.value = true
  try {
    shifts.value = await getShifts(user.value.id)
    console.log('Loaded shifts:', shifts.value.length, 'for user:', user.value.id)
  } catch (error) {
    console.error('Error loading shifts:', error)
  } finally {
    loading.value = false
  }
}

const previousMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
}

const nextMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
}

const currentMonth = () => {
  currentDate.value = new Date()
}

const formatTime = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const shiftTitle = (shift: Shift) => {
  const start = formatTime(shift.startTime)
  const end = formatTime(shift.endTime)
  return `${start} - ${end}${shift.title ? ': ' + shift.title : ''}`
}

const refresh = async () => {
  await loadShifts()
}

onMounted(async () => {
  // Wait for user to be available
  await loadShifts()
})

// Reload shifts when user changes
watch(() => user.value?.id, () => {
  if (user.value?.id) {
    loadShifts()
  }
})

// Expose refresh method
defineExpose({
  refresh
})
</script>
