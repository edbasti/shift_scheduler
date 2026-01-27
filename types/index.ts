export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'employee'
  createdAt?: Date
}

export interface Shift {
  id: string
  employeeId: string
  employeeName: string
  startTime: Date | string
  endTime: Date | string
  title?: string
  notes?: string
  createdAt?: Date
}
