const axios = require('axios');
const {NOTE_SERVICE_URL, USER_SERVICE_URL} = require('../config');
const RequestForwarder = require("../middleware/requestForwarder");

jest.mock('axios');

describe('Request Forwarder Middleware', () => {
    const requestForwarder = new RequestForwarder();
    const req = {
        method: 'GET',
        originalUrl: '/notes',
        headers: {},
        body: {}
    };
    const res = {
        status: jest.fn(() => res),
        json: jest.fn()
    };
    const next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Forward request to note service', async () => {
        axios.mockResolvedValueOnce({status: 200, data: {message: 'Note created successfully'}});

        requestForwarder.forward(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 500));

        expect(res.status).toHaveBeenCalledWith(200);
        expect(axios).toHaveBeenCalledWith({
            method: 'GET',
            url: `${NOTE_SERVICE_URL}/notes`,
            headers: {},
            data: {}
        });


        expect(res.json).toHaveBeenCalledWith({message: 'Note created successfully'});
    });

    test('Forward request to user service', async () => {
        req.originalUrl = '/users';
        axios.mockResolvedValueOnce({status: 200, data: {message: 'User added successfully'}});

        requestForwarder.forward(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 500));

        expect(res.status).toHaveBeenCalledWith(200);
        expect(axios).toHaveBeenCalledWith({
            method: 'GET',
            url: `${USER_SERVICE_URL}/users`,
            headers: {},
            data: {}
        });

        expect(res.json).toHaveBeenCalledWith({message: 'User added successfully'});
    });

    test('Handle service not found', () => {
        req.originalUrl = '/invalid';

        requestForwarder.forward(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: 'Service not found'});
    });

    test('Handle error from service', async () => {
        req.originalUrl = '/notes';
        axios.mockRejectedValueOnce({response: {status: 500, message: 'Internal server error'}});

        await requestForwarder.forward(req, res, next);
        await new Promise(resolve => setTimeout(resolve, 500));

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: 'Internal server error'});
    });

});
