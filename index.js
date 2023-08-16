const { apiRequest } = require('./helpers');
const { fetchAndMergeCustomerInfo, requestBody } = require('./offers');

apiRequest('/v2/getoffers', requestBody, async (error, offers) => {
    if (error) {
        console.error('Viga andmete laadimisel API\'st:', error);
        return;
    }

    if (!offers || offers.length === 0) {
        console.error('Pole ühtegi pakkumist');
        return;
    }

    for (let offer of offers) {
        await fetchAndMergeCustomerInfo(offer);
    }

    console.log(offers);
});