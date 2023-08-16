const { apiRequest } = require('./helpers');
const { createExcelFromData } = require('./createExcelFromData');
const { fetchAndMergeCustomerInfo, requestBody: offersRequestBody } = require('./offers');
const { fetchInvoiceDetails, invoicesRequestBody } = require('./invoices');

const action = process.argv[2];

if (action === "offers") {
    apiRequest('/v2/getoffers', offersRequestBody, async (error, offers) => {
        if (error) {
            console.error('Viga APIst info saamisel:', error);
            return;
        }

        if (!offers || offers.length === 0) {
            console.error('Sel ajaperioodil pole pakkumisi');
            return;
        }

        for (let offer of offers) {
            await fetchAndMergeCustomerInfo(offer);
        }

        console.log(offers);
        createExcelFromData(offers, 'pakkumised');
    });
} else if (action === "invoices") {
    apiRequest('/v1/getinvoices', invoicesRequestBody, async (error, invoices) => {
        if (error) {
            console.error('Viga APIst info saamisel:', error);
            return;
        }

        if (!invoices || invoices.length === 0) {
            console.error('Pole ühtegi arvet');
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
    console.error('Tundamuti käsk. Kasuta "offers" või "invoices" käske.');
}
