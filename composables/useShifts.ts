import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import type { Shift } from '~/types'

export const useShifts = () => {
  const { $db } = useNuxtApp()
  const { user } = useAuth()

  const getShifts = async (userId?: string) => {
    try {
      const shiftsRef = collection($db, 'shifts')
      let q = query(shiftsRef)
      
      // Determine which user ID to filter by
      let targetUserId: string | undefined
      
      if (userId) {
        // Explicit userId provided (e.g., from calendar component)
        targetUserId = userId
      } else if (user.value?.role === 'employee') {
        // Employee viewing their own shifts
        targetUserId = user.value.id
      }
      // If admin and no userId provided, get all shifts (no filter)
      
      if (targetUserId) {
        console.log('Filtering shifts for employeeId:', targetUserId)
        q = query(shiftsRef, where('employeeId', '==', targetUserId))
      } else {
        console.log('Fetching all shifts (admin view)')
      }
      
      const snapshot = await getDocs(q)
      const shifts = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          startTime: data.startTime?.toDate ? data.startTime.toDate() : data.startTime,
          endTime: data.endTime?.toDate ? data.endTime.toDate() : data.endTime,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
        }
      }) as Shift[]
      
      console.log(`Found ${shifts.length} shifts`)
      return shifts
    } catch (error) {
      console.error('Error fetching shifts:', error)
      return []
    }
  }

  const createShift = async (shiftData: Omit<Shift, 'id'>) => {
    try {
      const shiftsRef = collection($db, 'shifts')
      
      // Filter out undefined values (Firestore doesn't allow undefined)
      const firestoreData: any = {
        employeeId: shiftData.employeeId,
        employeeName: shiftData.employeeName,
        startTime: Timestamp.fromDate(new Date(shiftData.startTime)),
        endTime: Timestamp.fromDate(new Date(shiftData.endTime)),
        createdAt: Timestamp.now()
      }
      
      console.log('Saving shift to Firestore with employeeId:', firestoreData.employeeId)
      
      // Only add optional fields if they are defined
      if (shiftData.title !== undefined && shiftData.title !== null && shiftData.title !== '') {
        firestoreData.title = shiftData.title
      }
      if (shiftData.notes !== undefined && shiftData.notes !== null && shiftData.notes !== '') {
        firestoreData.notes = shiftData.notes
      }
      
      const docRef = await addDoc(shiftsRef, firestoreData)
      console.log('Shift created successfully with ID:', docRef.id, 'employeeId:', firestoreData.employeeId)
      return { success: true, id: docRef.id }
    } catch (error: any) {
      console.error('Error creating shift:', error)
      return { success: false, error: error.message }
    }
  }

  const updateShift = async (shiftId: string, shiftData: Partial<Shift>) => {
    try {
      const shiftRef = doc($db, 'shifts', shiftId)
      const updateData: any = { ...shiftData }
      
      if (shiftData.startTime) {
        updateData.startTime = Timestamp.fromDate(new Date(shiftData.startTime))
      }
      if (shiftData.endTime) {
        updateData.endTime = Timestamp.fromDate(new Date(shiftData.endTime))
      }
      
      await updateDoc(shiftRef, updateData)
      return { success: true }
    } catch (error: any) {
      console.error('Error updating shift:', error)
      return { success: false, error: error.message }
    }
  }

  const deleteShift = async (shiftId: string) => {
    try {
      await deleteDoc(doc($db, 'shifts', shiftId))
      return { success: true }
    } catch (error: any) {
      console.error('Error deleting shift:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    getShifts,
    createShift,
    updateShift,
    deleteShift
  }
}
