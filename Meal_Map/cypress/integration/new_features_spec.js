describe('Meal Map New Features Test', () => {
    beforeEach(() => {
        // Clear all meals before each test to ensure a clean state
        cy.request('GET', 'http://localhost:3000/api/meals').then(response => {
            if (response.body.length) {
                response.body.forEach(meal => {
                    cy.request('DELETE', `http://localhost:3000/api/meals/${meal.id}`);
                });
            }
        });

        // Visit the application
        cy.visit('/Meal_Map/index.html');
    });

    it('should generate and display a workout routine', () => {
        // Click the button to generate a workout routine
        cy.get('#generate-routine-btn').click();

        // Assert that the routine output is visible and contains expected text
        cy.get('#routine-output').should('be.visible');
        cy.get('#routine-output').should('contain', '3-Day Muscle-Building Split');
    });

    it('should generate a meal plan after logging three days of meals', () => {
        // Mock three days of meal history by calling the API directly
        for (let i = 0; i < 3; i++) {
            cy.request('POST', 'http://localhost:3000/api/meals', {
                date: `2024-01-0${i + 1}`,
                breakfast: { food: 'Cereal', time: '08:00', mood: 'energized', nutrition: {} },
                lunch: { food: 'Salad', time: '12:00', mood: 'satisfied', nutrition: {} },
                dinner: { food: 'Chicken', time: '18:00', mood: 'satisfied', nutrition: {} },
                snacks: []
            });
        }

        // Reload the page to ensure the history is loaded
        cy.visit('/Meal_Map/index.html');
        
        // It can take a moment for the history to load and the button to become effective
        cy.wait(500);

        // Click the generate meal plan button
        cy.get('#generate-plan-btn').click();

        // Assert that the meal plan output is visible and contains expected text
        cy.get('#meal-plan-output').should('be.visible');
        cy.get('#meal-plan-output').should('contain', 'Your 3-Day Plan');
    });

    it('should display the wellness quests section on page load', () => {
        // Assert that the quests container is visible
        cy.get('#quests-container').should('be.visible');

        // Assert that it contains at least one quest
        cy.get('.quest-card').should('exist');
    });

    it('should have a clickable export button', () => {
        // Assert that the export button exists and is not disabled
        cy.get('#export-btn').should('be.visible').and('not.be.disabled');
    });
});
