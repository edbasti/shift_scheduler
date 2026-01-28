/**
 * Integration tests that hit the running Nuxt app.
 * Run the dev server (npm run dev) on port 3000 before running Cypress.
 *
 * These tests assume Firebase (or your auth backend) is configured.
 * For CI without Firebase, you may stub network or use env-based auth.
 */
describe('App flow', () => {
  it('loads login and can navigate from root', () => {
    cy.visit('/')
    cy.url().should('match', /\/(login)?$/)
  })

  it('login page has accessible form fields', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').focus().blur()
    cy.get('input[type="password"]').focus().blur()
    cy.get('button[type="submit"]').should('be.visible')
  })
})
