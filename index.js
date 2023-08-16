const { apiRequest } = require('./helpers');
const { fetchAndMergeCustomerInfo, requestBody: offersRequestBody } = require('./offers');
const { fetchInvoiceDetails, invoicesRequestBody } = require('./invoices');

const action = process.argv[2];

if (action === "offers") {
    apiRequest('/v2/getoffers', offersRequestBody, async (error, offers) => {
        if (error) {
            console.error('Error fetching data from API:', error);
            return;
        }

        if (!offers || offers.length === 0) {
            console.error('No offers available');
            return;
        }

        for (let offer of offers) {
            await fetchAndMergeCustomerInfo(offer);
        }

        console.log(offers);
    });
} else if (action === "invoices") {
    apiRequest('/v1/getinvoices', invoicesRequestBody, async (error, invoices) => {
        if (error) {
            console.error('Error fetching data from API:', error);
            return;
        }

        if (!invoices || invoices.length === 0) {
            console.error('No invoices available');
            return;
        }

        const detailedInvoices = [];

        for (let invoice of invoices) {
            const details = await fetchInvoiceDetails(invoice.Id);
            detailedInvoices.push(details);
        }

        console.log(detailedInvoices);
    });
} else {
    console.error('Unknown action. Use "offers" or "invoices" as the command argument.');
}
