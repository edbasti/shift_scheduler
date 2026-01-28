import type { Shift, User } from '~/types'

describe('types', () => {
  it('Shift shape allows required and optional fields', () => {
    const shift: Shift = {
      id: '1',
      employeeId: 'u1',
      employeeName: 'Alice',
      startTime: new Date(),
      endTime: new Date(),
    }
    expect(shift.id).toBe('1')
    expect(shift.employeeId).toBe('u1')
    expect(shift.employeeName).toBe('Alice')
    const withOptionals: Shift = {
      ...shift,
      title: 'Morning',
      notes: 'Back office',
    }
    expect(withOptionals.title).toBe('Morning')
    expect(withOptionals.notes).toBe('Back office')
  })

  it('User shape allows admin and employee roles', () => {
    const admin: User = {
      id: 'a1',
      email: 'admin@example.com',
      name: 'Admin',
      role: 'admin',
    }
    const employee: User = {
      id: 'e1',
      email: 'emp@example.com',
      name: 'Employee',
      role: 'employee',
    }
    expect(admin.role).toBe('admin')
    expect(employee.role).toBe('employee')
  })
})
