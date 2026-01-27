import { doc, getDoc } from 'firebase/firestore'
import type { User } from '~/types'

export const useAuth = () => {
  const { $auth, $db } = useNuxtApp()
  const user = useState<User | null>('user', () => null)
  const token = useCookie<string | null>('auth_token', { default: () => null })

  const login = async (email: string, password: string) => {
    try {
      // Simple token-based auth - in production, use Firebase Auth properly
      // For demo purposes, we'll use a simple token system
      const tokenValue = btoa(`${email}:${password}`)
      token.value = tokenValue
      
      // Get user from Firestore
      const userDoc = await getDoc(doc($db, 'users', email))
      if (userDoc.exists()) {
        user.value = { id: userDoc.id, ...userDoc.data() } as User
        return { success: true, user: user.value }
      } else {
        throw new Error('User not found')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    token.value = null
    user.value = null
    await navigateTo('/login')
  }

  const checkAuth = async () => {
    if (!token.value) {
      return false
    }

    try {
      // Decode token to get email
      const decoded = atob(token.value)
      const [email] = decoded.split(':')
      
      const userDoc = await getDoc(doc($db, 'users', email))
      if (userDoc.exists()) {
        user.value = { id: userDoc.id, ...userDoc.data() } as User
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  const isAdmin = computed(() => user.value?.role === 'admin')
  const isEmployee = computed(() => user.value?.role === 'employee')

  return {
    user: readonly(user),
    token: readonly(token),
    login,
    logout,
    checkAuth,
    isAdmin,
    isEmployee
  }
}
