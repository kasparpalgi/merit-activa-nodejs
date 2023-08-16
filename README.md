# NodeJS app to fetch offers from Merit Activa API

1. Get from `getoffers` API endpoint price offers. Parse the results and for each offer, extract the "CustomerId". For each "CustomerId", call the `getcustomers` endpoint to get the "Address", "Email", "PhoneNo" and some other customer info to the the offer object in the parsed results. `DocStatus` numeric field is replaced with Estonian text value: "1=created, 2=sent, 3=approved, 4=rejected, 5=comment received, 6=invoice created, 7=canceled" from [docStatus.js](docStatus.js).
2. Get from `getinvoices` API endpoint invoices.
3. Data is saved in the Excel worksheet

* Merit Activa API: https://api.merit.ee/connecting-robots/reference-manual/
* `getoffers` API endpoint: https://api.merit.ee/connecting-robots/reference-manual/sales-offers/get-list-of-sales-offers/
* `getcustomers` API endpoint: https://api.merit.ee/connecting-robots/reference-manual/customers/get-customer-list/
* `getitems` API endpoint: https://api.merit.ee/connecting-robots/reference-manual/items/items-list/
* `purchorders` API endpoint: https://api.merit.ee/connecting-robots/reference-manual/purchase-invoices/get-list-of-purchase-invoices/
* `getinvoices` API endpoint: https://api.merit.ee/connecting-robots/reference-manual/sales-invoices/get-list-of-invoices/

## How to install / setup

1. Rename `env-example.txt` to `.env` and add your data into it
2. `npm i`
3. Define the fields needed / field's width in the Excel worksheet in [createExcelFromData.js](createExcelFromData.js)

## How to use
1. Change the `PeriodStart` and `PeriodEnd` in [offers.js](offers.js) or in [invoices.js](invoices.js)
2. `node index.js offers` or `node index.js invoices`
3. See result in [oakkumised](pakkumised) folder

## TODO

* Item data: https://api.merit.ee/connecting-robots/reference-manual/items/items-list/
* Could potentially optimise: batch fetch multiple customers at once instead of fetching them one by one