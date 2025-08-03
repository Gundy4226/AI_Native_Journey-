describe('generateWeeklySummary', () => {
  it('should correctly calculate the weekly summary', () => {
    const testHistory = [
      {
        id: '1',
        date: '2024-01-01',
        meals: {
          breakfast: { name: 'Oats', time: '08:00' },
          lunch: { name: 'Salad', time: '12:00' },
          dinner: { name: 'Chicken', time: '21:00' },
        },
        snacks: [],
        water: 8,
      },
      {
        id: '2',
        date: '2024-01-02',
        meals: {
          breakfast: { name: 'Eggs', time: '08:30' },
          lunch: { name: 'Sandwich', time: '13:00' },
          dinner: { name: 'Fish', time: '22:30' },
        },
        snacks: [{ name: 'Apple', time: '15:00' }],
        water: 6,
      },
      {
        id: '3',
        date: '2024-01-03',
        meals: {
          breakfast: { name: 'Cereal', time: '07:00' },
          lunch: { name: 'Soup', time: '12:30' },
          dinner: { name: 'Steak', time: '19:00' },
        },
        snacks: [],
        water: 7,
      },
    ];

    const summary = generateWeeklySummary(testHistory);

    expect(summary.lateDinners).to.equal(2);
  });
});
