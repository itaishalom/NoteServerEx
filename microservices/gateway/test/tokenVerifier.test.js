const TokenVerifier = require('../middleware/TokenVerifier');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('TokenVerifier', () => {
    let tokenVerifier;

    beforeEach(() => {
        tokenVerifier = new TokenVerifier();
    });

    test('Verify token successfully', () => {
        const req = {headers: {authorization: 'Bearer valid_token'}};
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()};
        const next = jest.fn();

        jwt.verify.mockImplementationOnce((token, secret, callback) => {
            callback(null, {userId: 'user_id'});
        });

        tokenVerifier.verify()(req, res, next);

        expect(req.user).toEqual({userId: 'user_id'});
        expect(next).toHaveBeenCalled();
    });

    test('Handle invalid token', () => {
        const req = {headers: {authorization: 'Bearer invalid_token'}};
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();

        jwt.verify.mockImplementationOnce((token, secret, callback) => {
            callback(new Error('Invalid token'));
        });

        tokenVerifier.verify(false)(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({message: 'Invalid token'});
        expect(next).not.toHaveBeenCalled();
    });

    test('Handle token expired', () => {
        const req = {headers: {authorization: 'Bearer expired_token'}};
           res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();

        jwt.verify.mockImplementationOnce((token, secret, callback) => {
            callback({name: 'TokenExpiredError'});
        });

        tokenVerifier.verify(false)(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({message: 'Token expired'});
        expect(next).not.toHaveBeenCalled();
    });

    test('Skip validation', () => {
        const req = {headers: {}};
        const res = {status: jest.fn(), json: jest.fn()};
        const next = jest.fn();

        tokenVerifier.verify(true)(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
