const { Liquid } = require('liquidjs');
const {moneyFiltersPlugin}  = require('./modules/filterliquid');
const engine = new Liquid({
	cache: true,
	globals: {data: 'global'}
});

const decodeHTML = function (html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};

engine.plugin(moneyFiltersPlugin);

engine.registerTag('products', {
    parse(tagToken, remainTokens) {
      this.tpls = []
      let closed = false
      while(remainTokens.length) {
        let token = remainTokens.shift()
        // we got the end tag! stop taking tokens
        if (token.name === 'endproducts') {
          closed = true
          break
        }
        let tpl = this.liquid.parser.parseToken(token, remainTokens) 
        this.tpls.push(tpl)
      }
      if (!closed) throw new Error(`tag ${tagToken.getText()} not closed`)
    },
    * render(context, emitter) {
      let params = context.getAll();
      emitter.write(`<div class='shopadjust-item--offer' data-offerid='${params.id}'>`)
      yield this.liquid.renderer.renderTemplates(this.tpls, context, emitter)
      emitter.write("</div>")
    }
})

engine.registerTag('item', {
  parse(tagToken, remainTokens) {
    this.tpls = []
    let closed = false
    while(remainTokens.length) {
      let token = remainTokens.shift()
      // we got the end tag! stop taking tokens
      if (token.name === 'enditem') {
        closed = true
        break
      }
      let tpl = this.liquid.parser.parseToken(token, remainTokens)
      this.tpls.push(tpl)
    }
    if (!closed) throw new Error(`tag ${tagToken.getText()} not closed`)
  },
  * render(context, emitter) {
    emitter.write('<div class="shopadjust---item">')
    yield this.liquid.renderer.renderTemplates(this.tpls, context, emitter)
    emitter.write("</div>")
  }
})

engine.registerFilter('class', (initial, arg1, arg2) => {
  var a = initial.replace(/(class="[^"]*)/, `$1 ${arg1} ${arg2}`);
  return a;
})

engine.registerFilter('content', (initial, arg1) => {
  return arg1;
})

engine.registerFilter('fullURL', function (path) {
    const origin = this.context.get(['origin'])
    return new URL(path, origin).toString() 
})

engine.registerFilter('translateLang', async (v, ...args) => {
	let params = engine?.params ? engine.params : {};
	if (args.length) {
		args.forEach(arg => {
			params[arg[0]] = arg[1];
		});
	}

	let initial = v;
	const translations =  {};
	
	if (translations[v]) initial =  decodeHTML(translations[v])
	
	return engine.parseAndRender(initial, params).then(html => html);
})

engine.registerFilter('translate', async (v, ...args) => {
  let params = engine?.params ? engine.params : {};
  console.log('')
	if (args.length) {
		args.forEach(arg => {
			params[arg[0]] = arg[1];
		});
	}

	let initial = v;
	const translations =  {};
	
	if (translations[v]) initial =  decodeHTML(translations[v])
	
	return engine.parseAndRender(initial, params).then(html => html);
})

engine.registerFilter('quantity', (initial, arg1) => {
  //console.log('arg1', arg1)
  var a = initial.replace("$quantity", `${arg1}`);
  return a;
})

engine.registerFilter('save', (initial, arg1) => {
 // console.log(initial)
  return initial;

})

engine.registerFilter('label', (initial, arg1, arg2, arg3) => {
  //let params = liquidEngine?.params ? liquidEngine.params : {};
  console.log('ARGS', [initial, arg1, arg2, arg3])
  
  let html = stringToHTML(initial);
  if (html.querySelector('span.label')) {
      html.querySelector('span.label').innerHTML = arg1;
  }

  let contentHtml = `<div>${html.innerHTML}</div>`;
  contentHtml = contentHtml.replace(/\[/g, "{{");
  contentHtml = contentHtml.replace(/\]/g, "}}");
  return engine.parseAndRenderSync(contentHtml, arg2);
})

var stringToHTML = function (str) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(str, 'text/html');
	return doc.body;
};



export default engine