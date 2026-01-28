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
        <p class="mt-3 text-sm text-gray-500">
          Drag a shift to another day to move it. Time of day is preserved.
        </p>
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
            day.isToday ? 'ring-2 ring-blue-500' : '',
            day.isDropTarget ? 'border-2 border-blue-400 bg-blue-50' : ''
          ]"
          @click="handleDayClick(day)"
          @dragover.prevent="handleDragOver(day)"
          @dragleave="handleDragLeave(day)"
          @drop="handleDrop(day)"
        >
          <div class="flex justify-between items-center mb-1">
            <div class="text-sm font-medium" :class="day.isToday ? 'text-blue-600' : 'text-gray-900'">
              {{ day.date.getDate() }}
            </div>
            <span v-if="day.shifts.length" class="text-xs text-gray-400">
              {{ day.shifts.length }} shift{{ day.shifts.length === 1 ? '' : 's' }}
            </span>
          </div>
          <div class="space-y-1">
            <div
              v-for="shift in day.shifts"
              :key="shift.id"
              class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate cursor-move"
              :title="shiftTitle(shift)"
              draggable="true"
              @dragstart="handleDragStart(shift)"
            >
              {{ formatTime(shift.startTime) }} – {{ shift.employeeName || 'Unnamed' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Shift } from '~/types'

const { getShifts, updateShift } = useShifts()

const emit = defineEmits<{
  'create-for-date': [date: Date]
}>()

const shifts = ref<Shift[]>([])
const loading = ref(true)
const currentDate = ref(new Date())
const draggingShift = ref<Shift | null>(null)

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type CalendarDay = {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  shifts: Shift[]
  isDropTarget?: boolean
}

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - startDate.getDay())

  const days: CalendarDay[] = []

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

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
      shifts: dayShifts,
      isDropTarget: false
    })
  }

  return days
})

const loadShifts = async () => {
  loading.value = true
  try {
    // Admin view: load all shifts
    shifts.value = await getShifts()
  } catch (error) {
    console.error('Error loading admin shifts:', error)
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
  return `${start} - ${end}${shift.title ? ': ' + shift.title : ''} (${shift.employeeName || ''})`
}

const handleDayClick = (day: CalendarDay) => {
  // Only allow clicks on current-month days to create shifts
  emit('create-for-date', day.date)
}

const handleDragStart = (shift: Shift) => {
  draggingShift.value = shift
}

const clearDropTargets = () => {
  calendarDays.value.forEach(day => {
    day.isDropTarget = false
  })
}

const handleDragOver = (day: CalendarDay) => {
  if (!draggingShift.value) return
  clearDropTargets()
  day.isDropTarget = true
}

const handleDragLeave = (day: CalendarDay) => {
  day.isDropTarget = false
}

const handleDrop = async (day: CalendarDay) => {
  const shift = draggingShift.value
  draggingShift.value = null
  clearDropTargets()

  if (!shift) return

  const originalStart = typeof shift.startTime === 'string' ? new Date(shift.startTime) : shift.startTime
  const originalEnd = typeof shift.endTime === 'string' ? new Date(shift.endTime) : shift.endTime

  // If dropped on same calendar day, do nothing
  const originalDateOnly = new Date(originalStart)
  originalDateOnly.setHours(0, 0, 0, 0)

  const targetDateOnly = new Date(day.date)
  targetDateOnly.setHours(0, 0, 0, 0)

  if (originalDateOnly.getTime() === targetDateOnly.getTime()) {
    return
  }

  const durationMs = originalEnd.getTime() - originalStart.getTime()

  const newStart = new Date(day.date)
  newStart.setHours(originalStart.getHours(), originalStart.getMinutes(), originalStart.getSeconds(), 0)
  const newEnd = new Date(newStart.getTime() + durationMs)

  if (!shift.id) {
    console.error('Cannot update shift without id')
    return
  }

  const confirmed = confirm(
    `Move shift for ${shift.employeeName || 'employee'} from ${originalStart.toLocaleDateString()} to ${newStart.toLocaleDateString()}?`
  )
  if (!confirmed) return

  const result = await updateShift(shift.id, {
    startTime: newStart,
    endTime: newEnd
  })

  if (result.success) {
    await loadShifts()
  } else {
    alert('Failed to move shift. Please try again.')
  }
}

const refresh = async () => {
  await loadShifts()
}

onMounted(async () => {
  await loadShifts()
})

defineExpose({
  refresh
})
</script>

