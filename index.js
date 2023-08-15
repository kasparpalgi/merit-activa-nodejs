require('dotenv').config();

const crypto = require('crypto');
const https = require('https');

const ApiKey = process.env.API_KEY;
const ApiID = process.env.API_ID;

const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);

const requestBody = JSON.stringify({
    PeriodStart: "20230810",
    PeriodEnd: "20230815",
    UnPaid: false
});

const signable = ApiID + timestamp + requestBody;
const signatureRaw = crypto.createHmac('sha256', ApiKey).update(signable).digest();
const signatureBase64 = Buffer.from(signatureRaw).toString('base64');

console.log("String to hash:", signable);
console.log("Computed HMAC (HEX):", signatureRaw.toString('hex'));
console.log("Computed HMAC (Base64):", signatureBase64);

const endpoint = `https://aktiva.merit.ee/api/v2/getoffers?ApiId=${ApiID}&timestamp=${timestamp}&signature=${signatureBase64}`;

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

const req = https.request(endpoint, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log("Raw Response:", data);
        try {
            const parsedData = JSON.parse(data);
            console.log(parsedData);
        } catch (e) {
            console.error('Error parsing response:', e);
        }
    });
});

req.on('error', (error) => {
    console.error('Error fetching data:', error);
});

req.write(requestBody);
req.end();
