export default defineNuxtRouteMiddleware(async (to, from) => {
  const { checkAuth, isAdmin } = useAuth()
  const isAuthenticated = await checkAuth()

  if (!isAuthenticated) {
    return navigateTo('/login')
  }

  if (!isAdmin.value) {
    return navigateTo('/')
  }
})
