const xl = require('excel4node');
const fs = require('fs');
const { apiRequest } = require('./helpers');
const { fetchAndMergeCustomerInfo, requestBody: offersRequestBody } = require('./offers');
const { fetchInvoiceDetails, invoicesRequestBody } = require('./invoices');

const action = process.argv[2];

const createExcelFromData = (data, baseFileName) => {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Pakkumised');

    const headers = {
        DocumentDate: { title: 'Tellimuse kuupäev', width: 2 },
        DocStatus: { title: 'Staatus', width: 1.6 },
        CustomerName: { title: 'Nimi', width: 2.5 },
        Address: { title: 'Aadress', width: 1.6 },
        City: { title: 'Linn', width: 3 },
        PhoneNo: { title: 'tel number', width: 1.2 },
        PostalCode: { title: 'Postiindeks', width: 1 },
        CountryName: { title: 'Riik', width: 1 },
        Email: { title: 'E-mail', width: 2.5 },
        UserName: { title: 'Kasutaja', width: 2 }
    };

    const headerStyle = wb.createStyle({
        font: {
            bold: true
        }
    });

    let columnIndex = 1;
    for (const header in headers) {
        ws.cell(1, columnIndex).string(headers[header].title).style(headerStyle);
        ws.column(columnIndex).setWidth(8 * headers[header].width);  // Adjust the width
        columnIndex++;
    }

    // Write data to the worksheet
    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
        let col = 1;
        for (const header in headers) {
            ws.cell(rowIndex + 2, col++).string(data[rowIndex][header] || '');
        }
    }

    if (!fs.existsSync('./pakkumised')) {
        fs.mkdirSync('./pakkumised');
    }

    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`; // DD-MM-YYYY

    wb.write(`./pakkumised/${baseFileName}_${formattedDate}.xlsx`);
};

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
        createExcelFromData(offers, 'pakkumised');
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
