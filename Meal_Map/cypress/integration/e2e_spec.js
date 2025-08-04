describe('Meal Map End-to-End Test', () => {
  it('should allow a user to log a meal and see it in the history', () => {
    // Visit the application
    cy.visit('/Meal_Map/index.html');

    // Define the meal
    const breakfast = 'Scrambled eggs with spinach';
    const breakfastTime = '08:30';

    // Find the breakfast input, type the meal, and set the time
    cy.get('#breakfast').type(breakfast);
    cy.get('#breakfast-time').type(breakfastTime);

    // Click the analyze button
    cy.get('#analyze-btn').click();

    // Assert that the new meal appears in the history
    // We'll look for the meal card that contains the text of our breakfast
    cy.get('#history-list')
      .find('.meal-card')
      .should('contain', breakfast);
  });
});
