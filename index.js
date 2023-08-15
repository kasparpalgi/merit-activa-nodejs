require('dotenv').config();

const crypto = require('crypto');
const https = require('https');

const ApiKey = process.env.API_KEY;
const ApiID = process.env.API_ID;
const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);

const fetchCustomerInfo = (customerId, callback) => {
    // Create request for getcustomers endpoint
    const customerRequestBody = JSON.stringify({ Id: customerId });
    const customerSignable = ApiID + timestamp + customerRequestBody;
    const customerSignatureRaw = crypto.createHmac('sha256', ApiKey).update(customerSignable).digest();
    const customerSignatureBase64 = Buffer.from(customerSignatureRaw).toString('base64');

    const customerEndpoint = `https://aktiva.merit.ee/api/v1/getcustomers?ApiId=${ApiID}&timestamp=${timestamp}&signature=${customerSignatureBase64}`;

    const customerReq = https.request(customerEndpoint, options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const customerData = JSON.parse(data);
                if (customerData && customerData[0]) {
                    callback(null, {
                        Address: customerData[0].Address,
                        PhoneNo: customerData[0].PhoneNo
                    });
                } else {
                    callback(new Error('No customer found'), null);
                }
            } catch (e) {
                callback(e, null);
            }
        });
    });

    customerReq.on('error', (error) => {
        callback(error, null);
    });

    customerReq.write(customerRequestBody);
    customerReq.end();
};

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

const req = https.request(endpoint, options, async (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log("Raw Response:", data);
        try {
            const parsedData = JSON.parse(data);
            try {
                const parsedData = JSON.parse(data);

                // New loop to fetch customer information
                for (const offer of parsedData) {
                    await new Promise((resolve, reject) => {
                        fetchCustomerInfo(offer.CustomerId, (err, customerInfo) => {
                            if (err) {
                                console.error('Error fetching customer info:', err);
                                return resolve();
                            }
                            offer.Address = customerInfo.Address;
                            offer.PhoneNo = customerInfo.PhoneNo;
                            resolve();
                        });
                    });
                }
                console.log(parsedData);

            } catch (e) {
                console.error('Error parsing response:', e);
            }
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
