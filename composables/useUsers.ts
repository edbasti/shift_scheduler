import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore'
import type { User } from '~/types'

export const useUsers = () => {
  const { $db } = useNuxtApp()

  const getUsers = async () => {
    try {
      const usersRef = collection($db, 'users')
      const snapshot = await getDocs(usersRef)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[]
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  }

  const createUser = async (userData: Omit<User, 'id'>) => {
    try {
      const usersRef = collection($db, 'users')
      const docRef = await addDoc(usersRef, {
        ...userData,
        createdAt: new Date()
      })
      return { success: true, id: docRef.id }
    } catch (error: any) {
      console.error('Error creating user:', error)
      return { success: false, error: error.message }
    }
  }

  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      const userRef = doc($db, 'users', userId)
      await updateDoc(userRef, userData)
      return { success: true }
    } catch (error: any) {
      console.error('Error updating user:', error)
      return { success: false, error: error.message }
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc($db, 'users', userId))
      return { success: true }
    } catch (error: any) {
      console.error('Error deleting user:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    getUsers,
    createUser,
    updateUser,
    deleteUser
  }
}
