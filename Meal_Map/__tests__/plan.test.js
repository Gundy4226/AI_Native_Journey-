describe('createMealPlan', () => {
  it('should return null if history is too short', () => {
    const shortHistory = [{}, {}];
    expect(createMealPlan(shortHistory)).to.be.null;
  });

  it('should generate a meal plan based on energized meals', () => {
    const testHistory = [
      { 
        breakfast: { food: 'Energizing Oatmeal', mood: 'energized' },
        lunch: { food: 'Leftover Pizza', mood: 'sluggish' },
        dinner: { food: 'Super Salad', mood: 'energized' }
      },
      { 
        breakfast: { food: 'Energizing Oatmeal', mood: 'energized' },
        lunch: { food: 'Healthy Wrap', mood: 'energized' },
        dinner: { food: 'Super Salad', mood: 'energized' }
      },
      { 
        breakfast: { food: 'Cereal', mood: 'none' },
        lunch: { food: 'Healthy Wrap', mood: 'energized' },
        dinner: { food: 'Super Salad', mood: 'energized' }
      }
    ];

    const plan = createMealPlan(testHistory);

    expect(plan).to.not.be.null;
    expect(plan.day1.breakfast).to.equal('energizing oatmeal');
    expect(plan.day1.lunch).to.equal('healthy wrap');
    expect(plan.day1.dinner).to.equal('super salad');
    expect(plan.day2.breakfast).to.equal('Oatmeal with Berries'); // Placeholder
  });

  it('should use fallbacks for meal types with no energized history', () => {
    const testHistory = [
      { breakfast: { food: 'Toast', mood: 'sluggish' }, lunch: {}, dinner: {} },
      { breakfast: { food: 'Muffin', mood: 'sluggish' }, lunch: {}, dinner: {} },
      { breakfast: { food: 'Bagel', mood: 'sluggish' }, lunch: {}, dinner: {} }
    ];

    const plan = createMealPlan(testHistory);
    expect(plan.day1.breakfast).to.equal('new idea: oatmeal');
  });
});
