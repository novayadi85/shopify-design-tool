export const decodeHTML = function (html) {
	var txt = document.createElement('textarea');
    txt.innerHTML = html;
    
    let val = txt.value;
    val = val.replace("<p><br></p>", "");
	return val;
};