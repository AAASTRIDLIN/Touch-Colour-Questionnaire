// clear space from two sides
String.prototype.Trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};

// combine multiple space into combine
String.prototype.ResetBlank = function () {
    var regEx = /\s+/g;
    return this.replace(regEx, ' ');
};

// keep numbers
String.prototype.GetNum = function () {
    var regEx = /[^\d]/g;
    return this.replace(regEx, '');
};

// 保留中文
String.prototype.GetCN = function () {
    var regEx = /[^\u4e00-\u9fa5\uf900-\ufa2d]/g;
    return this.replace(regEx, '');
};

// String->Number
String.prototype.ToInt = function () {
    return isNaN(parseInt(this)) ? this.toString() : parseInt(this);
};

// return string length
String.prototype.GetLen = function () {
    var regEx = /^[\u4e00-\u9fa5\uf900-\ufa2d]+$/;
    if (regEx.test(this)) {
        return this.length * 2;
    } else {
        var oMatches = this.match(/[\x00-\xff]/g);
        var oLength = this.length * 2 - oMatches.length;
        return oLength;
    }
};
//return file full name
String.prototype.GetFileName = function () {
    var regEx = /^.*\/([^\/\?]*).*$/;
    return this.replace(regEx, '$1');
};

// return file extension name
String.prototype.GetExtensionName = function () {
    var regEx = /^.*\/[^\/]*(\.[^\.\?]*).*$/;
    return this.replace(regEx, '$1');
};

//replace all
String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
};

//格式化字符串
String.Format = function () {
    if (arguments.length == 0) {
        return '';
    }

    if (arguments.length == 1) {
        return arguments[0];
    }

    var reg = /{(\d+)?}/g;
    var args = arguments;
    var result = arguments[0].replace(reg, function ($0, $1) {
        return args[parseInt($1) + 1];
    });
    return result;
};

// add zero to number
Number.prototype.LenWithZero = function (oCount) {
    var strText = this.toString();
    while (strText.length < oCount) {
        strText = '0' + strText;
    }
    return strText;
};

// Unicode recover
Number.prototype.ChrW = function () {
    return String.fromCharCode(this);
};

// number order from small to big
Array.prototype.Min2Max = function () {
    var oValue;
    for (var i = 0; i < this.length; i++) {
        for (var j = 0; j <= i; j++) {
            if (this[i] < this[j]) {
                oValue = this[i];
                this[i] = this[j];
                this[j] = oValue;
            }
        }
    }
    return this;
};

// number order from big to small
Array.prototype.Max2Min = function () {
    var oValue;
    for (var i = 0; i < this.length; i++) {
        for (var j = 0; j <= i; j++) {
            if (this[i] > this[j]) {
                oValue = this[i];
                this[i] = this[j];
                this[j] = oValue;
            }
        }
    }
    return this;
};

// return biggest number
Array.prototype.GetMax = function () {
    var oValue = 0;
    for (var i = 0; i < this.length; i++) {
        if (this[i] > oValue) {
            oValue = this[i];
        }
    }
    return oValue;
};

// return smallest number
Array.prototype.GetMin = function () {
    var oValue = 0;
    for (var i = 0; i < this.length; i++) {
        if (this[i] < oValue) {
            oValue = this[i];
        }
    }
    return oValue;
};

// 获取当前时间的中文形式
Date.prototype.GetCNDate = function () {
    var oDateText = '';
    oDateText += this.getFullYear().LenWithZero(4) + new Number(24180).ChrW();
    oDateText += this.getMonth().LenWithZero(2) + new Number(26376).ChrW();
    oDateText += this.getDate().LenWithZero(2) + new Number(26085).ChrW();
    oDateText += this.getHours().LenWithZero(2) + new Number(26102).ChrW();
    oDateText += this.getMinutes().LenWithZero(2) + new Number(20998).ChrW();
    oDateText += this.getSeconds().LenWithZero(2) + new Number(31186).ChrW();
    oDateText += new Number(32).ChrW() + new Number(32).ChrW() + new Number(26143).ChrW() + new Number(26399).ChrW() + new String('26085199682010819977222352011620845').substr(this.getDay() * 5, 5).ToInt().ChrW();
    return oDateText;
};

//扩展Date格式化
Date.prototype.Format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "\u65e5",
        "1": "\u4e00",
        "2": "\u4e8c",
        "3": "\u4e09",
        "4": "\u56db",
        "5": "\u4e94",
        "6": "\u516d"
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(format)) {
        format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return format;
}

Date.prototype.Diff = function (interval, objDate) {
    //若参数不足或 objDate 不是日期类型則回传 undefined
    if (arguments.length < 2 || objDate.constructor != Date) { return undefined; }
    switch (interval) {
        //计算秒差
        case 's': return parseInt((objDate - this) / 1000);
            //计算分差
        case 'n': return parseInt((objDate - this) / 60000);
            //计算時差
        case 'h': return parseInt((objDate - this) / 3600000);
            //计算日差
        case 'd': return parseInt((objDate - this) / 86400000);
            //计算周差
        case 'w': return parseInt((objDate - this) / (86400000 * 7));
            //计算月差
        case 'm': return (objDate.getMonth() + 1) + ((objDate.getFullYear() - this.getFullYear()) * 12) - (this.getMonth() + 1);
            //计算年差
        case 'y': return objDate.getFullYear() - this.getFullYear();
            //输入有误
        default: return undefined;
    }
};

//conversion of rgb to hsl
function rgbToHsl(r, g, b) {
  var min, max, i, l, s, maxcolor, h, rgb = [];
  rgb[0] = r / 255;
  rgb[1] = g / 255;
  rgb[2] = b / 255;
  min = rgb[0];
  max = rgb[0];
  maxcolor = 0;
  for (i = 0; i < rgb.length - 1; i++) {
    if (rgb[i + 1] <= min) {min = rgb[i + 1];}
    if (rgb[i + 1] >= max) {max = rgb[i + 1];maxcolor = i + 1;}
  }
  if (maxcolor == 0) {
    h = (rgb[1] - rgb[2]) / (max - min);
  }
  if (maxcolor == 1) {
    h = 2 + (rgb[2] - rgb[0]) / (max - min);
  }
  if (maxcolor == 2) {
    h = 4 + (rgb[0] - rgb[1]) / (max - min);
  }
  if (isNaN(h)) {h = 0;}
  h = h * 60;
  if (h < 0) {h = h + 360; }
  l = (min + max) / 2;
  if (min == max) {
    s = 0;
  } else {
    if (l < 0.5) {
      s = (max - min) / (max + min);
    } else {
      s = (max - min) / (2 - max - min);
    }
  }
  s = s;
  return {h : h, s : s, l : l};
}

//convert hsl to rgb
function hslToRgb(hue, sat, light) {
  var t1, t2, r, g, b;
  hue = hue / 60;
  if ( light <= 0.5 ) {
    t2 = light * (sat + 1);
  } else {
    t2 = light + sat - (light * sat);
  }
  t1 = light * 2 - t2;
  r = hueToRgb(t1, t2, hue + 2) * 255;
  g = hueToRgb(t1, t2, hue) * 255;
  b = hueToRgb(t1, t2, hue - 2) * 255;
  return {r : r, g : g, b : b};
}
function hueToRgb(t1, t2, hue) {
  if (hue < 0) hue += 6;
  if (hue >= 6) hue -= 6;
  if (hue < 1) return (t2 - t1) * hue + t1;
  else if(hue < 3) return t2;
  else if(hue < 4) return (t2 - t1) * (4 - hue) + t1;
  else return t1;
}
function hslToHex(hsl,l) {
   var temphsl=hsl.split(",");
   var h=temphsl[0],s=temphsl[1];
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getRGB(str){
  var match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
  return match ? {
    red: match[1],
    green: match[2],
    blue: match[3]
  } : {};
}
function toHslString(hsl,value) {
    return "hsl(" + hsl.h + ", " + Math.round(hsl.s * 100) + "%, " + Math.round(value) + "%)";
}
function toRgbString (rgb) {
  return "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
}
