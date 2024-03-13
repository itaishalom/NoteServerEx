const axios = require('axios');
const {NOTE_SERVICE_URL, USER_SERVICE_URL} = require('../config');

class RequestForwarder {
    constructor() {
        this.serviceUrls = {
            'notes': NOTE_SERVICE_URL,
            'users': USER_SERVICE_URL
        };
    }

    extractPhrase(inputString) {
        const index1 = inputString.indexOf('/');
        const index2 = inputString.indexOf('?');

        if (index1 === -1 && index2 === -1) {
            return inputString;
        } else if (index1 === -1) {
            return inputString.slice(0, index2);
        } else if (index2 === -1) {
            return inputString.slice(0, index1);
        } else {
            return inputString.slice(0, Math.min(index1, index2));
        }
    }

    forward(req, res, next) {
        const {method, originalUrl, headers, body} = req;
        const serviceUrl = this.serviceUrls[this.extractPhrase(originalUrl.substring(1, originalUrl.length))];

        if (!serviceUrl) {
            return res.status(404).json({message: 'Service not found'});
        }
        let headersUpdate = {...headers};
        if (req.user !== undefined) {
            headersUpdate = {
                ...headers,
                'User-ID': req.user.userId
            }
        }

        axios({
            method,
            url: `${serviceUrl}${originalUrl}`,
            headers: headersUpdate,
            data: body
        })
            .then(response => {
                res.status(response.status).json(response.data);
            })
            .catch(error => {
                res.status(error.response.status || 500).json({message: error.response.message});
            });
    }
}

module.exports = RequestForwarder;
