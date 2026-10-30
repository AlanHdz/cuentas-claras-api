describe('CI protection', () => {
  it('fails on purpose to prove main is protected', () => {
    expect(1).toBe(2);
  });
});
