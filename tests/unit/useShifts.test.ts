import { ref } from 'vue'

const mockGetDocs = jest.fn()
const mockAddDoc = jest.fn()
const mockUpdateDoc = jest.fn()
const mockDeleteDoc = jest.fn()
const mockCollection = jest.fn(() => ({}))
const mockDoc = jest.fn(() => ({}))
const mockQuery = jest.fn((ref, ...args) => ({}))
const mockWhere = jest.fn(() => ({}))
const mockTimestamp = {
  fromDate: jest.fn((d: Date) => d),
  now: jest.fn(() => new Date()),
}

jest.mock('firebase/firestore', () => ({
  collection: (...args: unknown[]) => mockCollection(...args),
  query: (...args: unknown[]) => mockQuery(...args),
  where: (...args: unknown[]) => mockWhere(...args),
  getDocs: (q: unknown) => mockGetDocs(q),
  addDoc: (ref: unknown, data: unknown) => mockAddDoc(ref, data),
  updateDoc: (ref: unknown, data: unknown) => mockUpdateDoc(ref, data),
  deleteDoc: (ref: unknown) => mockDeleteDoc(ref),
  doc: (...args: unknown[]) => mockDoc(...args),
  Timestamp: mockTimestamp,
}))

jest.mock('#app', () => ({
  useNuxtApp: () => ({ $db: {} }),
}))

jest.mock('~/composables/useAuth', () => ({
  useAuth: () => ({ user: ref({ id: 'u1', role: 'employee' }) }),
}))

describe('useShifts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetDocs.mockResolvedValue({
      docs: [
        {
          id: 's1',
          data: () => ({
            employeeId: 'u1',
            employeeName: 'Alice',
            startTime: { toDate: () => new Date('2025-01-15T09:00:00') },
            endTime: { toDate: () => new Date('2025-01-15T17:00:00') },
          }),
        },
      ],
    })
    mockAddDoc.mockResolvedValue({ id: 'new-id' })
    mockUpdateDoc.mockResolvedValue(undefined)
    mockDeleteDoc.mockResolvedValue(undefined)
  })

  it('getShifts returns mapped shifts for current user', async () => {
    const { useShifts } = await import('~/composables/useShifts')
    const { getShifts } = useShifts()
    const result = await getShifts()
    expect(mockGetDocs).toHaveBeenCalled()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(1)
    expect(result[0]).toMatchObject({
      id: 's1',
      employeeId: 'u1',
      employeeName: 'Alice',
    })
    expect(result[0].startTime).toBeInstanceOf(Date)
    expect(result[0].endTime).toBeInstanceOf(Date)
  })

  it('createShift calls addDoc and returns success with id', async () => {
    const { useShifts } = await import('~/composables/useShifts')
    const { createShift } = useShifts()
    const result = await createShift({
      employeeId: 'u1',
      employeeName: 'Bob',
      startTime: new Date('2025-01-20T09:00:00'),
      endTime: new Date('2025-01-20T17:00:00'),
    })
    expect(mockAddDoc).toHaveBeenCalled()
    expect(result).toEqual({ success: true, id: 'new-id' })
  })

  it('updateShift calls updateDoc and returns success', async () => {
    const { useShifts } = await import('~/composables/useShifts')
    const { updateShift } = useShifts()
    const result = await updateShift('s1', {
      startTime: new Date('2025-01-21T10:00:00'),
      endTime: new Date('2025-01-21T18:00:00'),
    })
    expect(mockUpdateDoc).toHaveBeenCalled()
    expect(result).toEqual({ success: true })
  })

  it('deleteShift calls deleteDoc and returns success', async () => {
    const { useShifts } = await import('~/composables/useShifts')
    const { deleteShift } = useShifts()
    const result = await deleteShift('s1')
    expect(mockDeleteDoc).toHaveBeenCalled()
    expect(result).toEqual({ success: true })
  })
})
