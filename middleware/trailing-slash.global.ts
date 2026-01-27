export default defineNuxtRouteMiddleware((to) => {
  // Redirect trailing slashes to non-trailing slashes
  if (to.path !== '/' && to.path.endsWith('/')) {
    return navigateTo(to.path.slice(0, -1), { redirectCode: 301 })
  }
})
