describe('Live Tracking Page', () => {
  beforeEach(() => {
    cy.visit('/live-tracking');
  });

  it('loads the page successfully', () => {
    cy.contains('Live Meteor & NEO Tracker').should('be.visible');
  });

  it('shows the globe canvas', () => {
    cy.get('#canvas').should('exist');
  });

  it('has a control panel with search', () => {
    cy.get('input[placeholder*="Search"]').should('exist');
  });

  it('has layer toggle buttons', () => {
    cy.contains('button', 'Meteors').should('exist');
    cy.contains('button', 'NEOs').should('exist');
    cy.contains('button', 'GMN Cameras').should('exist');
  });

  it('can scroll to globe', () => {
    cy.contains('View Live Globe').click();
    cy.get('#globe-root').should('be.visible');
  });

  it('shows recent events info card', () => {
    cy.contains('Recent Events').should('be.visible');
  });
});
