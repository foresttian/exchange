const axios = require('axios');
axios.defaults.baseURL = 'https://exchangeratesapi.io/api/';

module.exports = {
    async exchangeCurrency(date, baseCurrency, baseAmount, conversionCurrency) {
        var formatedDate = formatDate(date);
        if(!formatedDate){
            console.error('invalid date string, try YYYY-MM-DD');
            return null;
        }   
        
        // check amount is number and do not accept money less than one cent
        if(baseAmount < 0 || !Number.isInteger(baseAmount * 100)) { 
            console.error('invalid currency amount, please use number and do not input smaller digits than cent');
            return null;
        }   
        
        var regEx = /^[A-Z]{3}$/;
        if(!baseCurrency.match(regEx)) {
            console.error('invalid base currency abbr');
            return null;
        }
        
        if(!conversionCurrency.match(regEx)) {
            console.error('invlid conversion currency abbr');
            return null;
        }
        
        try {
            const rawExchangeData = await axios.get(formatedDate + '?base=' + baseCurrency);
            var exchangeRate = rawExchangeData.data;
            
            var rate = 0;
            if(baseCurrency == conversionCurrency) {
                rate = 1;
            } else if(!exchangeRate.rates[conversionCurrency]) {
                console.error('invalid conversion currency abbr');
                return null;
            } else {
                rate = exchangeRate.rates[conversionCurrency];
            }
            
            var result = {
                'date': exchangeRate.date,
                'base_currency': baseCurrency,
                'base_amount': baseAmount,
                'conversion_currency': conversionCurrency,
                'conversion_amount': Math.round(baseAmount * rate * 10000) / 10000
            };
            console.log(result);
            
            return result;
        } catch(e) {
            if (e && e.response) {          
                console.error('. server error message : ', e.response.data);
                console.error('server error status : ' + e.response.status);
            }       
            console.error('Please contact server developer if previous messages cannot solve your problem');
        }
        return null;
    }
};
// only accepted date that can be transformed into format YYYY-MM-DD which is from 0 - 10
function formatDate(date) {
    if(Date.parse(date)) {  
        var formattedDate = new Date(date);
        var isoString = formattedDate.toISOString();        
        var regEx = /^\d{4}-\d{2}-\d{2}/;
        if(isoString.match(regEx)) {
            return isoString.slice(0, 10);
        }
    }
    return null;
}