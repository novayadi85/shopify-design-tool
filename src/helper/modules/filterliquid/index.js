import { _formatMoney } from '../../price';

const dash = require('lodash');

const options = require('./option');
// The steps we follow are:
// 1. Converts a number(integer) to a string.
// 2. Reverses the string.
// 3. Replace the reversed string to a new string with the Regex
// 4. Reverses the new string to get what we want.

// This method is use to reverse a string.
function reverseString(str) { 
    return str.split("").reverse().join("");  
}

/**
 * @param {string | number} 
 */
function groupDigital(num) {
  const emptyStr = '';
  const group_regex = /\d{3}/g;

  // delete extra comma by regex replace.
  const trimComma = str => str.replace(/^[.]+|[.]+$/g, emptyStr)


  const str = num + emptyStr;
  const [integer, decimal] = str.split('.')

  const conversed = reverseString(integer);

  const grouped = trimComma(reverseString(
    conversed.replace(/\d{3}/g, match => `${match}.`)
  ));

  return !decimal ? grouped : `${grouped},${decimal}`;
}

/*
function formatMoney(value, currency = null, config={}) {
  let withPrefix = dash.get(config, 'withPrefix', true);
  let appendix = dash.get(config, 'appendix', false);
  let withTrailingZeros = dash.get(config, 'withTrailingZeros', true);
  let native = dash.get(config, 'native', false);

  if (!parseFloat(value) && parseFloat(value) !== 0) value = 0;
  let option = null;
  let money_format = '$ {{amount_with_comma_separator}}';

  if (currency) option = options.currencies.filter((option) => option.value === currency)[0];

  if (!option) {
    if (withTrailingZeros) value = parseFloat(value).toFixed(2);
    if (withPrefix) { 
        //${{amount}} USD
        let v = money_format.replace("{{amount_with_comma_separator}}", value);
        v = v.replace("{{amount_no_decimals}}", value);
        v = v.replace("{{amount_no_decimals_with_comma_separator}}", value);
        v = v.replace("{{amount}}", value);
        v = v.replace("{{amount_with_apostrophe_separator}}", value);
      
        v = v.replace("{{ amount_no_decimals }}", value);
        v = v.replace("{{ amount_no_decimals_with_comma_separator }}", value);
        v = v.replace("{{ amount }}", value);
        v = v.replace("{{ amount_with_apostrophe_separator }}", value);

        return v;
    }
    
    return `${value}`;
  }

  let amt = parseFloat(value).toFixed(option.decimal_digits);
  // if no trailing zeros
  if (!withTrailingZeros) {
    let decimalAmt = 0;
    let splitAmt = amt.split(".");
    if (splitAmt.length > 1) decimalAmt = parseInt(splitAmt[1]);
    if (!decimalAmt) amt = splitAmt[0];
  }

  if(option.symbol_native == "kr") appendix = true;

  // amt = amt.toLocaleString();
  amt = numberWithCommas(amt, ',');
  if (!withPrefix) return `${amt}`;
  if(appendix) return `${amt}${option.symbol_native}`;
  if (native) return `${option.symbol_native}${amt}`;
  return `${option.symbol}${amt}`;
}
*/


function numberWithCommas(x, separator) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}


export function moneyFiltersPlugin(Liquid) {
  this.registerFilter('money', (value, currency) => {
    return _formatMoney(value, currency);
  });

  this.registerFilter('money_native', (value, currency) => {
    return _formatMoney(value, currency, {
      native: true
    });
  });

  this.registerFilter('money_without_prefix', (value, currency) => {
    return _formatMoney(value, currency, {
      withPrefix: false
    });
  });

  this.registerFilter('money_tag', (value, currency) => {
    return `<span class="money" data-currency="${currency}">${value}</span>`;
  });
}
