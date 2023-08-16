// Set the start and end date to fetch the offers for
const requestBody = JSON.stringify({
    PeriodStart: "20230815", // YYYYMMDD
    PeriodEnd: "20230815", // YYYYMMDD
    UnPaid: false
});

const { apiRequest } = require('./helpers');
const getDocStatusText = require('./docStatus');

const fetchAndMergeCustomerInfo = async (offer) => {
    return new Promise((resolve, reject) => {
        const customerBody = JSON.stringify({ Id: offer.CustomerId });
        apiRequest('/v1/getcustomers', customerBody, (err, customerData) => {
            if (err) {
                console.error('Error fetching customer info:', err);
                reject(err); 
                return;
            }
            if (customerData && customerData[0]) {
                Object.assign(offer, {
                    Address: customerData[0].Address,
                    PhoneNo: customerData[0].PhoneNo,
                    City: customerData[0].City,
                    CountryName: customerData[0].CountryName,
                    PostalCode: customerData[0].PostalCode,
                    Email: customerData[0].Email
                });
                offer.DocStatus = getDocStatusText(offer.DocStatus);
            }
            resolve();
        });
    });
};

module.exports = {
    fetchAndMergeCustomerInfo,
    requestBody
};
