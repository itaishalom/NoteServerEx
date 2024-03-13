const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { addUser, loginUser } = require('../controllers/userController');
const UserRepository = require('../repositories/userRepository');
const User = require('../models/User');


jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../repositories/userRepository');

describe('userController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('addUser', () => {
    it('should create a new user', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const hashedPassword = 'hashedPassword';
      const newUser = new User( email, hashedPassword);
      const expectedResponse = { message: 'User created successfully', user: newUser };

      bcrypt.hash.mockResolvedValue(hashedPassword);
      UserRepository.prototype.findUserByEmail.mockImplementation((email, callback) => callback(null, null));
      UserRepository.prototype.createUser.mockImplementation((user, callback) => callback(null, newUser));

      req.body = { email, password };

      await addUser(req, res);

      expect(UserRepository.prototype.findUserByEmail).toHaveBeenCalledWith(email, expect.any(Function));
      expect(UserRepository.prototype.createUser).toHaveBeenCalledWith(newUser, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('should handle error when user already exists', async () => {
      const email = 'existing@example.com';
      const password = 'password';

      UserRepository.prototype.findUserByEmail.mockImplementation((email, callback) => callback(null, { email }));

      req.body = { email, password };

      await addUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });

    it('should handle error when createUser fails', async () => {
      const email = 'test@example.com';
      const password = 'password';

      UserRepository.prototype.findUserByEmail.mockImplementation((email, callback) => callback(null, null));
      UserRepository.prototype.createUser.mockImplementation((user, callback) => callback(new Error('Failed to create user')));

      req.body = { email, password };

      await addUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error creating user' });
    });
  });

  describe('loginUser', () => {
    it('should authenticate a user', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const hashedPassword = 'hashedPassword';
      const accessToken = 'accessToken';

      bcrypt.compare.mockResolvedValue(true);
      UserRepository.prototype.findUserByEmail.mockImplementation((email, callback) => callback(null, { email, password: hashedPassword }));
      jwt.sign.mockReturnValue(accessToken);

      req.body = { email, password };

      await loginUser(req, res);

      expect(UserRepository.prototype.findUserByEmail).toHaveBeenCalledWith(email, expect.any(Function));
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(jwt.sign).toHaveBeenCalledWith({ userId: undefined }, expect.any(String), { expiresIn: '1h' });
      expect(res.json).toHaveBeenCalledWith({ accessToken });
    });

    it('should handle error when findUserByEmail fails', async () => {
      const email = 'test@example.com';
      const password = 'password';

      UserRepository.prototype.findUserByEmail.mockImplementation((email, callback) => callback(new Error('Failed to find user')));

      req.body = { email, password };

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error finding user' });
    });

    it('should handle error when password comparison fails', async () => {
      const email = 'test@example.com';
      const password = 'password';

      UserRepository.prototype.findUserByEmail.mockImplementation((email, callback) => callback(null, { email, password: 'hashedPassword' }));
      bcrypt.compare.mockRejectedValue(new Error('Password comparison failed'));

      req.body = { email, password };

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error comparing passwords' });
    });

    it('should handle invalid email or password', async () => {
      const email = 'test@example.com';
      const password = 'password';

      UserRepository.prototype.findUserByEmail.mockImplementation((email, callback) => callback(null, null));

      req.body = { email, password };

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });
  });
});
