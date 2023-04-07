import { decodeHTML } from "@helper/html";
import engine from "@helper/template";

const renderTemplate = async (html, params) => {
    let source = decodeHTML(html);
    engine.params = params;
    return engine.parseAndRender(source, params);
}

export function toFixedNumber(num, digits, base) {
    var pow = Math.pow(base||10, digits);
    return Math.round(num*pow) / pow;
}

export const calculate = async ({
    groupType, priceType, quantity, specialPrice, price, compare_at_price = 0
}, format = false) => {
    console.log('CALCULATE', groupType, priceType, quantity, specialPrice, price, compare_at_price);

    let saved = 0;
    let totalOfferSaveInProcent = 0;
    let totalOfferSave = 0;
    let offerPrice = 0;
    let totalOfferPrice = 0;
    let disc = parseFloat(specialPrice);

    if (compare_at_price === 0 || compare_at_price === null) {
        compare_at_price = price * quantity;
    }
    else {
        compare_at_price = compare_at_price * quantity;
    }

    if (['bogoFree', 'upsell', 'bundle'].includes(groupType)) {
        priceType = 'amount';
    }

    if (priceType === 'pct') {
        // Calculate new price after discount as a percentage of the original price
        offerPrice = (price * quantity) * (1 - (disc / 100));
        saved = compare_at_price - offerPrice;
        totalOfferSaveInProcent = (saved / compare_at_price) * 100;
        totalOfferSave = saved;
        totalOfferPrice = offerPrice * quantity;
    } else if (priceType === 'amount_total') {
        // Calculate new price after discount as the original price minus the discount
        offerPrice = (price * quantity) - (disc * 100);
        saved = compare_at_price - offerPrice;
        totalOfferSaveInProcent = (saved / compare_at_price) * 100;
        totalOfferSave = saved;
        totalOfferPrice = offerPrice;
    } else if (priceType === 'amount') {
        if (['bogoFree', 'upsell', 'bundle'].includes(groupType)) {
            // For bundle or upsell group types, specialPrice is the price after discount
            offerPrice = (disc * 100) * quantity;
            // console.log('DISCOUNT', offerPrice)
        } else {
            // Calculate new price after discount as the original price minus the discount per quantity
            offerPrice = (price * quantity) - (disc * quantity * 100);
        }

        saved = compare_at_price - offerPrice;
        totalOfferSaveInProcent = (saved / compare_at_price) * 100;
        totalOfferSave = saved;
        totalOfferPrice = offerPrice * quantity;
    }

    if (offerPrice < 0) {
        // Ensure new price is not negative
        offerPrice = 0;
    }

    if (format) {
        // Format the results as strings with 2 decimal places
        saved = saved.toFixed(2);
        totalOfferSaveInProcent = totalOfferSaveInProcent.toFixed(2);
        totalOfferSave = totalOfferSave.toFixed(2);
        offerPrice = offerPrice.toFixed(2);
        totalOfferPrice = totalOfferPrice.toFixed(2);
    }

    return {
        saved,
        totalOfferSaveInProcent: Math.floor(totalOfferSaveInProcent * 100) / 100,
        totalOfferSave,
        offerPrice,
        totalOfferPrice,
        compare_at_price,
        specialPrice
    };
};


export const getOfferDetails = (calculationResult) => {
    const { saved, totalOfferSaveInProcent, totalOfferSave, offerPrice, totalOfferPrice, compare_at_price } = calculationResult;

    const before_price = compare_at_price;
    const now_price = before_price - saved;
    const save_in_amount = totalOfferSave;
    const save_in_percent = totalOfferSaveInProcent;

    return {
        before_price: before_price,
        now_price: now_price,
        save_in_amount: save_in_amount,
        save_in_procent: save_in_percent
    };
};

export const calculate3 = async({
    groupType, priceType, quantity, specialPrice, price, compare_at_price = 0
}, format = false ) => {
    
    let totalOfferPrice = 0;
    let totalOfferSaveInProcent = 0;
    let totalOfferSave = 0;
    let offerPrice = 0;
    let saved = 0;
    let totalDiscPercent = 0;
    let currency = 'DKK';
    let OfferSave = 0;
    let totalPrice = 0;
    let totalSaved = 0;
    if(priceType == "pct"){
        var amount = specialPrice;
        totalDiscPercent = amount;
        totalPrice = (price * quantity);
        totalSaved = (totalDiscPercent * totalPrice ) / 100;
        totalOfferPrice = totalPrice - totalSaved;
        saved = totalSaved;

        if(format){
            offerPrice = formatMoney(totalPrice - (totalSaved * 100) , currency);
            OfferSave =  formatMoney(totalSaved / 100 , currency);
            totalOfferSave = await renderTemplate('{{ price }}', {price: OfferSave});
            totalOfferSaveInProcent = await renderTemplate('{{ price | append:"%"}}', {price: amount});
        }
        else {
            offerPrice = (totalPrice - (totalSaved * 100));
            OfferSave =  (totalSaved / 100 );
            totalOfferSave = OfferSave;
            totalOfferSaveInProcent = parseFloat(amount);
            totalOfferPrice = totalPrice - totalSaved
        }

        
        if (groupType == "bundle" || groupType == "upsell") {
            const beforeDiscount = specialPrice;
            const d = price - (Number(specialPrice) * 100)
            const disc = (price - d);
            totalSaved = disc * quantity;
            totalDiscPercent = ( (d / price) * 100 ) * quantity;

            totalSaved = (totalDiscPercent * totalPrice ) / 100;
            totalOfferPrice = totalPrice - totalSaved;
            saved = totalSaved / 100;

            offerPrice = cents(totalPrice - totalSaved) ;
            OfferSave =  (totalSaved);
            totalOfferSave = cents(totalSaved);
            totalOfferSaveInProcent = parseFloat(amount);
           // totalOfferPrice = totalPrice - totalSaved
        }
        
        
    }
    else if (priceType == "amount_total") {
        totalSaved = specialPrice * 100 
        totalPrice = (price * quantity);
        offerPrice = (totalPrice - (totalSaved));
        OfferSave =  (totalSaved / 100 );
        totalOfferSave = OfferSave;
        

        let a = (price * quantity);
        let b = (totalSaved)
        let c = (b / a) * 100;
        
        totalOfferSaveInProcent = parseFloat((Math.round(c * 100) / 100).toFixed(2));
        totalOfferPrice = totalPrice - totalSaved

        saved = totalSaved;
    }
    else {
        saved = ( price - (specialPrice * 100)) * quantity;
        // totalOfferSaveInProcent = (price * quantity ) - (saved * 100);
        let a = (price * quantity);
        let b = (saved)
        let c = (b / a ) * 100;
        totalOfferSaveInProcent = (Math.round(c * 100) / 100).toFixed(2);

        if (groupType == "tier") {
            let sp = (parseFloat(specialPrice) * 100) * parseFloat(quantity);   
            saved = sp ;
            a = (price * quantity);
            b = (saved)
            c = (b / a) * 100;
        }

        if (groupType == "collect_volume_off") {
            let sp = (parseFloat(specialPrice) * 100);   
            saved = sp ;
            a = (price * quantity);
            b = (saved)
            c = (b / a) * 100;
        }
        
        if(format){
            offerPrice = (((price * quantity ) - (saved)) / 100);
            totalOfferPrice = (price * quantity ) - (saved)
            
            offerPrice = formatMoney(((price * quantity ) - (saved )) / 100, currency);
            OfferSave =  formatMoney(saved , currency);
            totalOfferSave = await renderTemplate('{{ price }}', {price: OfferSave});
            totalOfferSaveInProcent = await renderTemplate('{{ price | append:"%"}}', {price: totalOfferSaveInProcent});
        }
        else{
            offerPrice = (((price * quantity ) - (saved)) / 100);
            OfferSave =  saved;
            totalOfferSave = OfferSave / 100;
            totalOfferPrice = (price * quantity) - (saved);
            totalOfferSaveInProcent = c;
        }

        if(groupType == "bundle" || groupType == "upsell"){
            let fixPrice = specialPrice; // price pr. item
            // let finalPrice = ((price * quantity) - fixPrice * 100) / 100;

            let finalPrice = (specialPrice * 100);
            saved = ((price - finalPrice) * quantity) / 100
                
            let a = (price * quantity);
            let b = saved * 100
            let c = (b / a) * 100;
            
            totalOfferSaveInProcent = (Math.round(c * 100) / 100).toFixed(2);

            if(format){
                offerPrice = (((price * quantity ) - (saved * 100)) / 100);
                totalOfferPrice = (price * quantity ) - (saved * 100)
                
                offerPrice = formatMoney(((price * quantity ) - (saved * 100)) / 100, currency);
                OfferSave =  formatMoney(saved , currency);
                totalOfferSave = await renderTemplate('{{ price }}', {price: OfferSave});
                totalOfferSaveInProcent = await renderTemplate('{{ price | append:"%"}}', {price: totalOfferSaveInProcent});
            }
            else{
                offerPrice = (((price * quantity ) - (saved * 100)) / 100);
                OfferSave =  (saved);
                totalOfferSave = OfferSave;
                totalOfferPrice = (price * quantity) - (saved * 100);
                totalOfferSaveInProcent = c;
            }


            //console.warn('priceType', groupType, priceType, quantity, specialPrice, price, compare_at_price)
        }
    }
    
    if(compare_at_price){
        if (groupType == "bundle" || groupType == "upsell") {
            saved = parseFloat(compare_at_price * quantity) - parseFloat(saved * 100);
            totalOfferSave = cents(saved)
        }
        else {
            saved = parseFloat(compare_at_price * quantity) - parseFloat(saved * 100);
            totalOfferSave = cents(saved)
        }
        
    }
    
    return {
        saved, 
        totalOfferSaveInProcent,
        totalOfferSave,
        offerPrice,
        totalOfferPrice: totalOfferPrice
    };
}

export const discounts1 = async ({ groupType, priceType, quantity, specialPrice, price }) => {
    let totalOfferPrice = 0;
    let totalOfferSaveInProcent = 0;
    let totalOfferSave = 0;
    let offerPrice = 0;
    let saved = 0;
    let totalDiscPercent = 0;
    let OfferSave = 0;
    let totalPrice = 0;
    let totalSaved = 0;

    if(priceType == "pct"){
        var amount = specialPrice;
        totalDiscPercent = amount;
        totalPrice = (price * quantity);
        totalSaved = (totalDiscPercent * totalPrice ) / 100;
        totalOfferPrice = totalPrice - totalSaved;
        saved = totalSaved;

        offerPrice = (totalPrice - (totalSaved * 100));
        OfferSave =  (totalSaved / 100 );
        totalOfferSave = OfferSave;
        totalOfferSaveInProcent = parseFloat(amount);
        totalOfferPrice = totalPrice - totalSaved
        
        if (groupType == "bundle" || groupType == "upsell") {
            const beforeDiscount = specialPrice;
            const d = price - (Number(specialPrice) * 100)
            const disc = (price - d);
            totalSaved = disc * quantity;
            totalDiscPercent = ( (d / price) * 100 ) * quantity;

            totalSaved = (totalDiscPercent * totalPrice ) / 100;
            totalOfferPrice = totalPrice - totalSaved;
            saved = totalSaved / 100;

            offerPrice = cents(totalPrice - totalSaved) ;
            OfferSave =  (totalSaved);
            totalOfferSave = cents(totalSaved);
            totalOfferSaveInProcent = parseFloat(amount);
           // totalOfferPrice = totalPrice - totalSaved
        }
        
        
    }
    else if (priceType == "amount_total") {
        totalSaved = specialPrice * 100 
        totalPrice = (price * quantity);
        offerPrice = (totalPrice - (totalSaved));
        OfferSave =  (totalSaved / 100 );
        totalOfferSave = OfferSave;
        

        let a = (price * quantity);
        let b = (totalSaved)
        let c = (b / a) * 100;
        
        totalOfferSaveInProcent = parseFloat((Math.round(c * 100) / 100).toFixed(2));
        totalOfferPrice = totalPrice - totalSaved

        saved = totalSaved;
    }
    else {
        saved = ( price - (specialPrice * 100)) * quantity;
        // totalOfferSaveInProcent = (price * quantity ) - (saved * 100);
        let a = (price * quantity);
        let b = (saved)
        let c = (b / a ) * 100;
        totalOfferSaveInProcent = (Math.round(c * 100) / 100).toFixed(2);

        if (groupType == "tier") {
            let sp = (parseFloat(specialPrice) * 100) * parseFloat(quantity);   
            saved = sp ;
            a = (price * quantity);
            b = (saved)
            c = (b / a) * 100;
        }

        if (groupType == "collect_volume_off") {
            let sp = (parseFloat(specialPrice) * 100);   
            saved = sp ;
            a = (price * quantity);
            b = (saved)
            c = (b / a) * 100;
        }
        
        offerPrice = (((price * quantity ) - (saved)) / 100);
        OfferSave =  saved;
        totalOfferSave = OfferSave / 100;
        
        totalOfferPrice = (price * quantity) - (saved);
        totalOfferSaveInProcent = c;

        if(groupType == "bundle" || groupType == "upsell"){
            let fixPrice = specialPrice; // price pr. item
            // let finalPrice = ((price * quantity) - fixPrice * 100) / 100;

            let finalPrice = (specialPrice * 100);
            saved = ((price - finalPrice) * quantity) / 100
                
            let a = (price * quantity);
            let b = saved * 100
            let c = (b / a) * 100;
            
            totalOfferSaveInProcent = (Math.round(c * 100) / 100).toFixed(2);

            offerPrice = (((price * quantity ) - (saved * 100)) / 100);
            OfferSave =  (saved);
            totalOfferSave = OfferSave;
            totalOfferPrice = (price * quantity) - (saved);
            totalOfferSaveInProcent = c;
        }
    }
    
    offerPrice = offerPrice <= 0 ? price * quantity : offerPrice
    return {
        saved, 
        totalOfferSaveInProcent,
        totalOfferSave,
        offerPrice,
        totalOfferPrice: totalOfferPrice
    };
}

export const __discounts = async ({ groupType, priceType, quantity, specialPrice, price }) => {
    let totalOfferSaveInProcent = 0,
        totalOfferSave = 0,
        offerPrice = 0,
        totalOfferPrice = 0,
        OfferSave = 0,
        saved = 0;
    
    if(priceType === "pct"){
        var amount = specialPrice;
        let totalDiscPercent = amount;
        let totalPrice = (price * quantity);
        let totalSaved = (totalDiscPercent * totalPrice ) / 100;
        totalOfferPrice = totalPrice - totalSaved
        offerPrice = (totalPrice - (totalSaved * 100));
        OfferSave =  (totalSaved / 100 );
        totalOfferSave = OfferSave;
        totalOfferSaveInProcent = amount;
        totalOfferPrice = totalPrice - totalSaved
    }
    else {
        saved = ( price - (specialPrice * 100)) * quantity;
        // totalOfferSaveInProcent = (price * quantity ) - (saved * 100);
        let a = (price * quantity);
        let b = (saved)
        let c = (b / a ) * 100;
        totalOfferSaveInProcent = (Math.round(c * 100) / 100).toFixed(2);

        if (groupType === "tier") {
            let sp = (parseFloat(specialPrice) * 100) * parseFloat(quantity);   
            saved = sp ;
            a = (price * quantity);
            b = (saved)
            c = (b / a) * 100;

        }

        if (groupType === "collect_volume_off") {
            let sp = (parseFloat(specialPrice) * 100);   
            saved = sp ;
            a = (price * quantity);
            b = (saved)
            c = (b / a) * 100;
        }
        
        offerPrice = (((price * quantity ) - (saved)) / 100);
        OfferSave =  saved;
        totalOfferSave = OfferSave / 100;
        totalOfferPrice = (price * quantity) - (saved);
        totalOfferSaveInProcent = c;

        if(groupType === "bundle" || groupType === "upsell"){
            let fixPrice = specialPrice;
            saved = ((price * quantity) -  fixPrice * 100) / 100;
            a = (price * quantity);
            b = (saved * 100 )
            c = (b / a ) * 100;
            totalOfferSaveInProcent = (Math.round(c * 100) / 100).toFixed(2);

            offerPrice = (((price * quantity ) - (saved * 100)) / 100);
            OfferSave =  (saved);
            totalOfferSave = OfferSave;
            totalOfferPrice = (price * quantity) - (saved);
            totalOfferSaveInProcent = c;
        }
    }
    
    return {
        saved, 
        totalOfferSaveInProcent,
        totalOfferSave,
        offerPrice,
        totalOfferPrice: totalOfferPrice
    };
}


export function cents(num) {
    if (num <= 0) return num;
    return num / 100;
}

export function _formatMoney(decimal, currency) {
    const store = localStorage.getItem('store')
    console.log(store)
    const _currency = store?.money_with_currency_format || currency
    
    if (Number(decimal) <= 0 || !decimal || decimal === null || typeof decimal === 'undefined') return "";
    //return formatMoney(cents(decimal));
    alert(_currency)
    return formatMoney(decimal, _currency);
}

// eslint-disable-next-line no-template-curly-in-string
export function formatMoney(cents, format = '{{amount_with_space_separator}}') {
  
    if (typeof cents === 'string') {
        cents = cents.replace('.', '')
    }
  
    let value = ''
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/
  
    function formatWithDelimiters(number, precision, thousands, decimal) {
        if( typeof precision == 'undefined' ){
            precision = 2
        }
  
        thousands = ".";
        
        decimal = (thousands == ',') ? '.' : ','
  
        if (isNaN(number) || number == null) {
            return 0
        }
  
        number = (number / 100).toFixed(precision)
  
        const parts = number.split('.')
        const dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands)
        const centsAmount = parts[1] ? decimal + parts[1] : ''
  
        return dollarsAmount + centsAmount
    }
  
    // eslint-disable-next-line default-case
    switch (format.match(placeholderRegex)[1]) {
        case 'amount':
            value = formatWithDelimiters(cents, 2)
            break
        case 'amount_with_comma_separator':
            value = formatWithDelimiters(cents, 2)
            break
        case 'amount_no_decimals':
            value = formatWithDelimiters(cents, 0)
            break
        case 'amount_with_space_separator':
            value = formatWithDelimiters(cents, 2)
            break
        case 'amount_no_decimals_with_comma_separator':
            value = formatWithDelimiters(cents, 0)
            break
        case 'amount_no_decimals_with_space_separator':
            value = formatWithDelimiters(cents, 0)
            break
    }

  return format.replace(placeholderRegex, value)
}