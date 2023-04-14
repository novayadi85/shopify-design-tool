const { htmlToText: convertToString } = require('html-to-text');

export const decodeHTML = function (html) {
	var txt = document.createElement('textarea');
    txt.innerHTML = html;
    
    let val = txt.value;
    val = val.replace("<p><br></p>", "");
	return val;
};

export function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}
  
export function stringToHTML(str) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(str, 'text/html');
	return doc.body;
};

export function htmlToText(input, args = {}) {
    return convertToString(input, args);
}

export function convertToPlain(html) {
    return html.documentElement.innerHTML;
}


export const dropdownHTML = `{% assign hidden = '' %}
{% assign firstOption = '' %}
{% if product.variants.size == 1 %} 
    {% assign hidden = 'style= display:none;' %}
    {% assign firstOption = '' %}
{% endif %}
{% if toggle == "true" %}
    <div class="product-{{type}}">
        <div class="shopadjust-product-offer-display product-variants" style="display:none;">
            <div class="shopadjust-product-offer-qty-variant">
                <div class="product-{{type}}">
                    <input name="quantity" class="shopadjust-product-offer-qty" value="{{quantity}}" readonly="readonly" type="hidden">
                    <select name="{{name}}" class="shopadjust-product-offer-variant" {{hidden}}>
                        {{firstOption}}
                        {% for item in product.variants %}
                            <option data-price="{{item.price}}" value="{{item.id}}" data-src="" 
                            data-image="{{item.featured_image}}" data-product="{{item.id}}">{{item.title}}</option>
                        {% endfor %}
                    </select>
                </div>
            </div>
        </div>

        {% if product.variants.size > 1 and product.options.size > 1 %} 
        <div class="block-variant-customize">
            <div class="toggle-variants">
                <span data-component="toggle"> Change variants... </span>
                <div class="tier-show-variants-option" style="display: none;">
                    {% for i in (1..quantity) %}
                    <div class="flex-box">
                    <div class="tier-show-variants">
                        {% for item in product.options %}
                            
                            <div class="variant-grid">
                                <label><strong>{{item.name}}</strong></label>
                                <select data-component="variantPicker" name="options[]" data-option="{{item.name}}" class="shopadjust-product-offer-Option Options--{{item.name}}">
                                    {% for value in item.values %}
                                        <option value="{{value}}">{{value}}</option>
                                    {% endfor %}
                                </select>
                            </div>
                              
                        {% endfor %}
                        </div> 
                    </div>
                        {% comment %}
                        {% for item in product.options %}
                            <div class="tier-show-variants">
                                <div class="variant-grid">
                                    <label>{{item.name}}</label>
                                    <select data-component="variantPicker" name="options[]" data-option="{{item.id}}" class="shopadjust-product-offer-Option Options--{{item.id}}">
                                        {% for value in item.values %}
                                            {% assign selected = '' %}
                                            <option value="{{value}}">{{value}}</option>
                                        {% endfor %}
                                    </select>
                                </div>
                            </div>
                        {% endfor %}
                        {% endcomment %}
                    {% endfor %}
                    <script type="application/json">
                        {{product.variants | json}}
                    </script>
                    <a data-id="{{offer.id}}" data-component="multiVariantSubmit" class="shopadjust-product-offer-addMulti-cart-tier"> Buy it now </a>
                </div>
            </div>
        </div>
        {% endif %}
    </div>
{% else %}
    <div class="product-{{type}}">
        <div class="shopadjust-product-offer-display product-variants">
            <div class="shopadjust-product-offer-qty-variant">
                <div class="product-{{type}}">
                    <input name="quantity" class="shopadjust-product-offer-qty" value="{{quantity}}" readonly="readonly" type="hidden">
                    <select data-component="variantPicker" name="{{name}}" class="shopadjust-product-offer-variant" {{hidden}}>
                        {{firstOption}}
                        {% for item in product.variants %}
                            <option data-price="{{item.price}}" value="{{item.id}}" data-src="" 
                            data-image="{{item.featured_image}}" data-product="{{item.id}}">{{item.title}}</option>
                        {% endfor %}
                    </select>
                </div>
            </div>
        </div>
    </div>
{% endif %}`


export function removeEmptyElements(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const elementsToRemove = [];
    const elements = doc.querySelectorAll("*");
    elements.forEach((el) => {
      if (!el.hasChildNodes() && !el.textContent.trim()) {
        elementsToRemove.push(el);
      }
    });
    elementsToRemove.forEach((el) => el.remove());

    return doc.body.innerHTML;
}


export  const getCssString = (string) => {
    let newObject = {};
    let skip = ['background-type', 'box-shadow-x', 'box-shadow-y', 'box-shadow-blur', 'box-shadow-width', 'box-shadow-color', 'border-type', 'background-opacity'];
    if (string) {
        
        let shadow = '{box-shadow-x} {box-shadow-y} {box-shadow-blur} {box-shadow-width} {box-shadow-color}';
        let replaceShadow = false;
        Object.keys(string).forEach(key => {
            if (!skip.includes(key)) {
                newObject[key] = string[key];
            }
            if (['box-shadow-x', 'box-shadow-y','box-shadow-blur', 'box-shadow-width', 'box-shadow-color'].includes(key)) {
                shadow = shadow.replace(`{${key}}`, string[key])
                replaceShadow = true;
            }

            if ('border-type' === key) {
                switch (string[key]) {
                    case 'left':
                        newObject['border-right'] = 'none !important';
                        newObject['border-bottom'] = 'none !important';
                        newObject['border-top'] = 'none !important';
                        break;
                    case 'bottom':
                        newObject['border-right'] = 'none !important';
                        newObject['border-left'] = 'none !important';
                        newObject['border-top'] = 'none !important';
                        break;
                    
                    case 'right':
                        newObject['border-left'] = 'none !important';
                        newObject['border-bottom'] = 'none !important';
                        newObject['border-top'] = 'none !important';
                        break;
                    
                    case 'top':
                        newObject['border-right'] = 'none !important';
                        newObject['border-left'] = 'none !important';
                        newObject['border-bottom'] = 'none !important';
                        break;
                    case 'none':
                        newObject['border-right'] = 'none !important';
                        newObject['border-left'] = 'none !important';
                        newObject['border-bottom'] = 'none !important';
                        newObject['border-top'] = 'none !important';
                        break;
                    default:
                        break;
                }
            }

            if ('background-type' === key && string[key] === 'none') {
                newObject['background-color'] = 'none !important';
                newObject['background'] = 'none !important';
            }

        });

        if(replaceShadow)
        newObject['box-shadow'] = shadow;

    }

    return newObject;
}


export  const cssCustoms = (string) => {
    return `.row---offer {
        width: 100%;
        display: flex;
        gap: 2px;
        margin: 5px 0;
        position: relative;
    }

    .col-md-12---offer {
        width: 100%;
        position: relative;
    }

    .col-md-6---offer {
        width: 50%;
        position: relative;
    }

    .sa-section-sa-product-block-offer.flex {
        display: flex;
        justify-content: center;
        gap: 20px;
    }

    .sa-section-sa-product-block-offer aside {
        text-align: center;
        margin: 0 auto;
    }

    .sa-section-sa-product-block-offer aside img{
        max-height: 190px;
        margin: 20px;
    }
    .flex-box img{
        width: 100%;
        height: auto;
    }
    `
}

export const htmlDecodeParser = (input) => {
    const doc = new DOMParser().parseFromString(input, "text/html");
    // return doc.documentElement.innerHTML;

    return doc.body.innerHTML;
}


export const replaceBrace = (input) => {
    if (!input) return input;

    const prefix = '$';

    // Define a regular expression pattern with placeholders to match
    const pattern = /\{\{([\w\s]+)\}\}/g;
    
    // Replace the placeholders with the prefix
    const outputText = input.replace(pattern, (match, placeholder) => {
        return prefix + placeholder.trim();
    });
    
    return outputText;
}

