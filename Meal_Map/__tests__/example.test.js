describe('Meal Map', () => {
  it('should be able to create a div', () => {
    const element = document.createElement('div');
    expect(element).not.to.be.null;
  });

  it('should add a snack input to the DOM', () => {
    document.body.innerHTML = '<div id="snacks-container"></div>';
    addSnackInput();
    const snacksContainer = document.getElementById('snacks-container');
    expect(snacksContainer.children.length).to.equal(1);
  });
});
