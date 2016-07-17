describe('activities', function() {
  it('should load the page', function() {
    browser.url('http://localhost:3000');
    expect(browser.getTitle()).toBe('123');
  });
});
