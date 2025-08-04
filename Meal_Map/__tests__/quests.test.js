describe('checkQuestProgress', () => {
  const quests = {
    hydrate: { goal: 3 },
    earlyBird: { goal: 3 },
    rainbow: { goal: 4 }
  };

  it('should correctly calculate progress for the Hydration Hero quest', () => {
    const history = [
      { waterIntake: 8 },
      { waterIntake: 9 },
      { waterIntake: 7 }, // Streak broken
      { waterIntake: 10 },
      { waterIntake: 12 }
    ];
    const progress = checkQuestProgress(history, quests);
    expect(progress.hydrate).to.equal(2);
  });

  it('should correctly calculate progress for the Early Bird quest', () => {
    const history = [
      { breakfast: { time: '08:30' } },
      { breakfast: { time: '10:00' } },
      { breakfast: { time: '07:59' } }
    ];
    const progress = checkQuestProgress(history, quests);
    expect(progress.earlyBird).to.equal(2);
  });

  it('should correctly calculate progress for the Eat the Rainbow quest', () => {
    const history = [
      { breakfast: { food: 'salad with carrots' }, lunch: { food: 'spinach smoothie' }, dinner: {}, snacks: [] },
      { breakfast: { food: 'broccoli and eggs' }, lunch: {}, dinner: { food: 'peppers' }, snacks: [] }
    ];
    const progress = checkQuestProgress(history, quests);
    expect(progress.rainbow).to.equal(4); // carrots, spinach, broccoli, peppers
  });

  it('should handle an empty history', () => {
    const history = [];
    const progress = checkQuestProgress(history, quests);
    expect(progress.hydrate).to.equal(0);
    expect(progress.earlyBird).to.equal(0);
    expect(progress.rainbow).to.equal(0);
  });
});
