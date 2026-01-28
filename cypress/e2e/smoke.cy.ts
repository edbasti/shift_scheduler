describe('Smoke / home', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('redirects unauthenticated users to login', () => {
    cy.url().should('include', '/login')
  })

  it('shows Shift Scheduler and login form on login page', () => {
    cy.contains('Shift Scheduler')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Log In')
  })
})
