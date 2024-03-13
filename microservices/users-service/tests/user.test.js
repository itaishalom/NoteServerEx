const User = require('../models/user');

describe('User Model', () => {
  describe('constructor', () => {
    it('should create a new User object with provided properties', () => {
      const email = 'test@example.com';
      const password = 'password';

      const user = new User(email, password);

      expect(user).toBeInstanceOf(User);
      expect(user.email).toBe(email);
      expect(user.password).toBe(password);
    });
  });
});