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
