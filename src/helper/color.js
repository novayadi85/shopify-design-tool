const RGBToHSB = (r, g, b, a) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const v = Math.max(r, g, b),
      n = v - Math.min(r, g, b);
    const h =
      n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
    // return [60 * (h < 0 ? h + 6 : h), v && (n / v), v ];
    return {
        alpha: a,
        brightness: v,
        hue: 60 * (h < 0 ? h + 6 : h),
        saturation: v && (n / v),
    }
};
  
export const RGBAToHSB = (rgba) => {

    let sep = rgba.indexOf(",") > -1 ? "," : " ";
    rgba = rgba.substr(5).split(")")[0].split(sep);
    /*
    // Strip the slash if using space-separated syntax
    if (rgba.indexOf("/") > -1) 
      rgba.splice(3,1);
  
    for (let R in rgba) {
      let r = rgba[R];
      if (r.indexOf("%") > -1) {
        let p = r.substr(0,r.length - 1) / 100;
  
        if (R < 3) { 
          rgba[R] = Math.round(p * 255);
        } else {
          rgba[R] = p;
        }
      }
    }
  
    // Make r, g, and b fractions of 1
    let r = Number(rgba[0]) / 255,
        g = Number(rgba[1]) / 255,
        b = Number(rgba[2]) / 255,
        a = Number(rgba[3]);
  
    // Rest of RGB-to-HSL logic
    */
    
    // const _rgba = rgba.map(t => Number(t));
    return RGBToHSB(Number(rgba[0]), Number(rgba[1]), Number(rgba[2]), Number(rgba[3]));
    /*
    return makeHSL({
        alpha: _rgba[3],
        red: _rgba[0],
        b: _rgba[2],
        green: _rgba[1],
    })
    */
    

};


const rgbToLightness = (r,g,b) => {
	const max = Math.max(r,g,b);
	const min = Math.min(r,g,b);
	return 1/2 * (max + min);
}

const rgbToSaturation = (r,g,b) => {
	const max = Math.max(r,g,b);
	const min = Math.min(r,g,b);
	const l = rgbToLightness(r,g,b);

	return (l === 0 || l === 1) ? 0 : (max - min)/(1 - Math.abs(2 * l - 1));	
}

const rgbToHue = (r,g,b) => {
  let hue = Math.round(
    Math.atan2(
      Math.sqrt(3) * (g - b),
      2 * r - g - b,
    ) * 180 / Math.PI
  );
  
  while (hue < 0) {
    hue = hue + 360;
  }
  
  return hue;
}

const rgbToHsl = (r,g,b) => {
  const hue = rgbToHue(r,g,b);
  const saturation = rgbToSaturation(r,g,b);
  const lightness = rgbToLightness(r,g,b);
  
  return [hue, saturation, lightness];
}

const hslToRgb = (h,s,l) => {
	const C = (1 - Math.abs(2 * l - 1)) * s;
	const hPrime = h / 60;
	const X = C * (1 - Math.abs(hPrime % 2 - 1));
	const m = l - C/2;
	const withLight = (r,g,b) => [r+m, g+m, b+m];

	if (hPrime <= 1) { return withLight(C,X,0); } else
	if (hPrime <= 2) { return withLight(X,C,0); } else
	if (hPrime <= 3) { return withLight(0,C,X); } else
	if (hPrime <= 4) { return withLight(0,X,C); } else
	if (hPrime <= 5) { return withLight(X,0,C); } else
	if (hPrime <= 6) { return withLight(C,0,X); }
}


  const makeHSL = attributes => {
      const [h, s, l] = rgbToHsl(attributes.red / 255, attributes.green / 255, attributes.blue / 255);
      console.log(attributes)
    return {
        saturation: Math.round(s * 100),
        brightness: Math.round(l * 100),
        hue: Math.round(h || 0)
    }
  };