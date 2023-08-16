// Set the start and end date to fetch the invoices for
const invoicesRequestBody = JSON.stringify({
    PeriodStart: "20230810", // YYYYMMDD
    PeriodEnd: "20230815", // YYYYMMDD
    UnPaid: false // 'true' or 'false'
});

const { apiRequest } = require('./helpers');

const fetchInvoiceDetails = async (invoiceId) => {
    const invoiceDetailsRequestBody = JSON.stringify({
        Id: invoiceId,
        AddAttachment: false  // Set to true if you want to add attachments
    });

    return new Promise((resolve, reject) => {
        apiRequest('/v2/getinvoice', invoiceDetailsRequestBody, (err, invoiceDetails) => {
            if (err) {
                console.error('Error fetching invoice details:', err);
                reject(err);
                return;
            }
            resolve(invoiceDetails);
        });
    });
};

module.exports = {
    fetchInvoiceDetails,
    invoicesRequestBody
};
