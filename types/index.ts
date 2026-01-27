export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'employee'
  createdAt?: Date
}
