const main = require('./main.js');

describe('main', function() {
  it('should have a gridMetadata', function() {
    expect(main.gridMetadata.length).toEqual(4);
  });
});
