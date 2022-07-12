export function toFixedNumber(num, digits, base){
    var pow = Math.pow(base||10, digits);
    return Math.round(num*pow) / pow;
}

export const discounts = async ({ groupType, priceType, quantity, specialPrice, price }) => {
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