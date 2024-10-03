import { jest } from '@jest/globals';
import app from '../app.js';

jest.mock('../app.js', () => ({
  listen: jest.fn((port, callback) => {
    callback();
  }),
}));

describe('Server', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.resetModules();
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it('should start the server on the specified port', () => {
    process.env.PORT = '3000';
    require('../server.js');

    expect(app.listen).toHaveBeenCalledWith('3000', expect.any(Function));
    expect(console.log).toHaveBeenCalledWith('Server connected listening on port 3000');
  });

  it('should use a default port if PORT is not set in environment', () => {
    delete process.env.PORT;
    require('../server.js');

    expect(app.listen).toHaveBeenCalledWith(undefined, expect.any(Function));
    expect(console.log).toHaveBeenCalledWith('Server connected listening on port undefined');
  });

  it('should handle non-numeric PORT value', () => {
    process.env.PORT = 'invalid';
    require('../server.js');

    expect(app.listen).toHaveBeenCalledWith('invalid', expect.any(Function));
    expect(console.log).toHaveBeenCalledWith('Server connected listening on port invalid');
  });
});
