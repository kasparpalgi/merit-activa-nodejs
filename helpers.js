require('dotenv').config();
const crypto = require('crypto');
const https = require('https');

const ApiKey = process.env.API_KEY;
const ApiID = process.env.API_ID;
const BASE_API_URL = 'https://aktiva.merit.ee/api';

function generateSignature(timestamp, body) {
    const signable = ApiID + timestamp + body;
    const signatureRaw = crypto.createHmac('sha256', ApiKey).update(signable).digest();
    return Buffer.from(signatureRaw).toString('base64');
}

function apiRequest(endpoint, body, callback) {
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const signature = generateSignature(timestamp, body); // fixed call
    const url = `${BASE_API_URL}${endpoint}?ApiId=${ApiID}&timestamp=${timestamp}&signature=${signature}`;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    const req = https.request(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            try {
                callback(null, JSON.parse(data));
            } catch (e) {
                callback(e, null);
            }
        });
    });

    req.on('error', (error) => callback(error, null));
    req.write(body);
    req.end();
}

module.exports = {
    apiRequest
};
