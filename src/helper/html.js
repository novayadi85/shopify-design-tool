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