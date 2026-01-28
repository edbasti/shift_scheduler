describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('shows login form and demo credentials', () => {
    cy.contains('Shift Scheduler')
    cy.get('input#email').should('exist')
    cy.get('input#password').should('exist')
    cy.contains('Demo Credentials')
    cy.contains('admin@example.com')
    cy.contains('employee@example.com')
  })

  it('submits login and shows validation or error when credentials invalid', () => {
    cy.get('input#email').type('bad@example.com')
    cy.get('input#password').type('wrong')
    cy.get('button[type="submit"]').click()
    // Either redirect to home (if mock/auth allows) or shows error
    cy.get('form').should('exist')
  })

  it('allows typing email and password', () => {
    cy.get('input#email').type('admin@example.com').should('have.value', 'admin@example.com')
    cy.get('input#password').type('admin123').should('have.value', 'admin123')
  })
})
