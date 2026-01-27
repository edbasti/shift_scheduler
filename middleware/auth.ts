export default defineNuxtRouteMiddleware(async (to, from) => {
  const { checkAuth } = useAuth()
  const isAuthenticated = await checkAuth()

  if (!isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})
