/* eslint-disable no-prototype-builtins */

// NOTE: document mutations / DOM access, check for DOMContentLoaded or window.load
// document.addEventListener('DOMContentLoaded', () => { });
// window.addEventListener('load', () => { });

console.log(`INJECT: ${document.readyState}`);

window.addEventListener('load', () => {
  console.log(`INJECT window load: ${document.readyState}`);
});
document.addEventListener('readystatechange', () => {
  console.log(`INJECT readystatechange: ${document.readyState}`);
});
document.addEventListener('DOMContentLoaded', async () => {
  console.log(`INJECT DOMContentLoaded: ${document.readyState}`);
});

const go = () => {
  const allNumbers = (str) => /^\\d+$/.test(str);
  console.log(document.cookie);
  const cookieObj2 = document.cookie
    .split(/\s*;\s*/)
    .reduce((obj, keyValuePair) => {
      let [key, val] = keyValuePair.split(/\s*=\s*/);
      key = decodeURIComponent(key);
      val = decodeURIComponent(val);
      if (/^[sj]:/.test(val)) {
        val = val.substr(2, val.lastIndexOf('.') - 2);
      }
      try {
        obj[key] = allNumbers(val) ? val : JSON.parse(val);
      } catch (_err) {
        obj[key] = val;
      }
      return obj;
    }, {});
  console.log(cookieObj2);
  const allow = window.top !== window && cookieObj2.access_token;
  if (allow) {
    // const toHex = (n) => {
    //   return '0123456789ABCDEF'.charAt(n);
    // };
    // const encodePercents = (txt) => {
    //   if (txt === '') {
    //     return '';
    //   }
    //   let str = '';
    //   for (var i = 0; i < txt.length; i++) {
    //     let c = txt.charCodeAt(i);
    //     let bs = new Array();
    //     if (c > 0x10000) {
    //       // 4 bytes
    //       bs[0] = 0xf0 | ((c & 0x1c0000) >>> 18);
    //       bs[1] = 0x80 | ((c & 0x3f000) >>> 12);
    //       bs[2] = 0x80 | ((c & 0xfc0) >>> 6);
    //       bs[3] = 0x80 | (c & 0x3f);
    //     } else if (c > 0x800) {
    //       // 3 bytes
    //       bs[0] = 0xe0 | ((c & 0xf000) >>> 12);
    //       bs[1] = 0x80 | ((c & 0xfc0) >>> 6);
    //       bs[2] = 0x80 | (c & 0x3f);
    //     } else if (c > 0x80) {
    //       // 2 bytes
    //       bs[0] = 0xc0 | ((c & 0x7c0) >>> 6);
    //       bs[1] = 0x80 | (c & 0x3f);
    //     } else {
    //       // 1 byte
    //       bs[0] = c;
    //     }
    //     for (var j = 0; j < bs.length; j++) {
    //       var b = bs[j];
    //       var hex = toHex((b & 0xf0) >>> 4) + toHex(b & 0x0f);
    //       str += '%' + hex;
    //     }
    //   }
    //   return str;
    // };
    // const encodePercents_ = (txt) => {
    //   return txt.split('').reduce((str, c) => {
    //     return str + `%${parseInt(c.charCodeAt(0)).toString(16)}`;
    //   }, '');
    // };

    // // %C2%B1
    // console.log(encodePercents_('±')); // fail!
    // console.log(encodePercents('±'));
    // console.log(encodeURI('±'));
    // console.log(encodeURIComponent('±'));

    const el = document.getElementById(
      decodeURI('%5f%5f%63%6f%6e%74%65%6e%74%2d%73%74%79%6c%65'), // '__content-style'
    );
    el.parentNode.removeChild(el);
  } else {
    document.body.style.display = 'none';
    document.title = 'about:blank';
  }

  // document.getElementById('location').textContent = location.href;

  // const hasStorageAccess = await document.hasStorageAccess();
  // console.log('hasStorageAccess', hasStorageAccess);

  // const requestStorageAccess = await document.requestStorageAccess();
  // console.log('requestStorageAccess', requestStorageAccess);

  const onImageLoad = (evt_) => {
    const img_ = evt_.currentTarget;
    const srcUrlPath = new URL(img_.src).pathname;
    const isPNG = srcUrlPath.endsWith('.png');
    const isGIF = srcUrlPath.endsWith('.gif');
    const isWEBP = srcUrlPath.endsWith('.webp');
    const canHaveAlpha = isWEBP || isGIF || isPNG;
    setTimeout(() => {
      const img = new Image();
      img.onload = () => {
        // https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas#Browser_compatibility
        // const canvas = new OffscreenCanvas();
        const canvas = document.createElement('CANVAS');
        // canvas.setAttribute('width', img.offsetWidth); // width
        // canvas.setAttribute('height', img.offsetHeight); // height
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        // ctx.rotate((90 * Math.PI) / 180); // 90 degrees
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          0,
          0,
          img.width,
          img.height,
        );
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        window.image_obfuscation.deobfuscate(
          imageData.data,
          imageData.width,
          imageData.height,
        );
        ctx.putImageData(imageData, 0, 0);
        const url = canvas.toDataURL(canHaveAlpha ? 'image/png' : 'image/jpeg');
        img_.removeEventListener('load', onImageLoad);
        console.log(
          img.width,
          img.height,
          img_.width,
          img_.height,
          img_.style.width,
          img_.style.height,
          img_.offsetWidth,
          img_.offsetHeight,
        );
        // console.log(url);
        console.log('IMAGE MOD: ', img_.src);
        img_.src = url;
      };
      img.src = img_.src;
    }, 1000); // delay is to visualize changes in the demo, this can be removed in production
  };
  const feature11 = (activate) => {
    const images = document.querySelectorAll('img[src]');
    images.forEach((img) => {
      let dataSrc = img.getAttribute('data-src');
      if (!dataSrc) {
        const src = img.getAttribute('src');
        img.setAttribute('data-src', src);
        dataSrc = src;
      }

      // const style = window.getComputedStyle(img);
      // if (!img.getAttribute('data-width')) {
      //   console.log(style.width);
      //   if (style.width) {
      //     img.setAttribute('data-width', style.width);
      //   }
      // }
      // if (!img.getAttribute('data-height')) {
      //   console.log(style.width);
      //   if (style.height) {
      //     img.setAttribute('data-height', style.height);
      //   }
      // }

      if (activate) {
        console.log('IMAGE ON dataSrc: ', dataSrc);
        img.removeAttribute('src');
        // img.style.width = 'auto !important'; // doesn't work!
        // img.style.setProperty('width', 'auto', 'important');
        // img.style.setProperty('height', 'auto', 'important');
        img.addEventListener('load', onImageLoad);
        setTimeout(() => {
          img.setAttribute('src', dataSrc);
        }, 0);
      } else {
        console.log('IMAGE OFF dataSrc: ', dataSrc);
        img.removeEventListener('load', onImageLoad);
        img.removeAttribute('src');
        setTimeout(() => {
          img.setAttribute('src', dataSrc);
        }, 0);
      }
    });
  };

  const onContextmenu = (evt) => {
    evt.preventDefault();
  };
  const feature8 = (activate) => {
    if (activate) {
      document.body.addEventListener('contextmenu', onContextmenu);
    } else {
      document.body.removeEventListener('contextmenu', onContextmenu);
    }
  };

  const dragStyle =
    '-webkit-user-drag: none; -khtml-user-drag: none; -moz-user-drag: none; -ms-user-drag: none; user-drag: none; -webkit-pointer-events: none; -khtml-pointer-events: none; -moz-pointer-events: none; -ms-pointer-events: none; pointer-events: none;';
  const onDragstart = (evt) => {
    evt.preventDefault();
  };
  const feature7 = (activate) => {
    const bodyStyle = document.body.getAttribute('style') || '';

    if (activate) {
      document.body.addEventListener('dragstart', onDragstart);
      document.body.setAttribute('style', bodyStyle + dragStyle);
    } else {
      document.body.removeEventListener('dragstart', onDragstart);
      document.body.setAttribute('style', bodyStyle.replace(dragStyle, ''));
    }
  };

  const onCopy = (evt) => {
    evt.preventDefault();
    const selection = document.getSelection();
    if (selection) {
      const str = selection.toString();
      console.log(str);
      document.getSelection().empty();
      if (str) {
        alert(`Clipboard copy PREVENTED: "${str}"`);
      }
    }
  };
  const feature6 = (activate) => {
    if (activate) {
      document.body.addEventListener('copy', onCopy);
    } else {
      document.body.removeEventListener('copy', onCopy);
    }
  };

  const onSelectstart = (evt) => {
    evt.preventDefault();
  };
  const selectStyle =
    '-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;';
  const feature5 = (activate) => {
    const bodyStyle = document.body.getAttribute('style') || '';

    document.getSelection().empty();

    if (activate) {
      window.addEventListener('selectstart', onSelectstart);
      document.body.setAttribute('style', bodyStyle + selectStyle);
    } else {
      window.removeEventListener('selectstart', onSelectstart);
      document.body.setAttribute('style', bodyStyle.replace(selectStyle, ''));
    }
  };

  const onAElementClick = (ev) => {
    ev.preventDefault();

    const href = ev.currentTarget.getAttribute('data-href-resolved');

    // doesn't forward HTTP referer :(
    // location.href = href;
    // location.replace(href);

    // this forwards HTTP referer :)
    const aElement = document.createElement('a');
    aElement.setAttribute('href', href);
    aElement.click();
  };

  const feature1 = (activate) => {
    const aElements = document.querySelectorAll('a');

    aElements.forEach((aElement) => {
      const dataHref = aElement.getAttribute('data-href');
      if (!dataHref) {
        aElement.setAttribute('data-href', aElement.getAttribute('href'));
        aElement.setAttribute('data-href-resolved', aElement.href);
      }
    });

    if (activate) {
      aElements.forEach((aElement) => {
        aElement.setAttribute('href', '/#');
        aElement.addEventListener('click', onAElementClick);
      });
    } else {
      aElements.forEach((aElement) => {
        aElement.setAttribute('href', aElement.getAttribute('data-href'));
        aElement.removeEventListener('click', onAElementClick);
      });
    }
  };

  let inputs = localStorage.getItem('checkBoxes');
  if (!inputs) {
    inputs = {};
    localStorage.setItem('checkBoxes', JSON.stringify(inputs));
  } else {
    inputs = JSON.parse(inputs);
  }
  Object.keys(inputs).forEach((key) => {
    if (!inputs.hasOwnProperty(key)) {
      return;
    }

    const val =
      typeof inputs[key] !== 'undefined' ? Boolean(inputs[key]) : false;

    console.log('inputs[key]:', key, inputs[key]);

    if (key === 'checkBox_1') {
      feature1(val);
    } else if (key === 'checkBox_5') {
      feature5(val);
    } else if (key === 'checkBox_6') {
      feature6(val);
    } else if (key === 'checkBox_7') {
      feature7(val);
    } else if (key === 'checkBox_8') {
      feature8(val);
    } else if (key === 'checkBox_11') {
      feature11(val);
    }
  });

  window.addEventListener('message', (evt) => {
    console.log('window message:', evt.data);

    if (typeof evt.data.checkBox_1 !== 'undefined') {
      feature1(evt.data.checkBox_1);
    } else if (typeof evt.data.checkBox_5 !== 'undefined') {
      feature5(evt.data.checkBox_5);
    } else if (typeof evt.data.checkBox_6 !== 'undefined') {
      feature6(evt.data.checkBox_6);
    } else if (typeof evt.data.checkBox_7 !== 'undefined') {
      feature7(evt.data.checkBox_7);
    } else if (typeof evt.data.checkBox_8 !== 'undefined') {
      feature8(evt.data.checkBox_8);
    } else if (typeof evt.data.checkBox_11 !== 'undefined') {
      feature11(evt.data.checkBox_11);
    }
  });
};

console.log('INJECT GO NOW');
go();

// // works fine in Chrome and Firefox, fails in Safari
// // (because events not triggered with script element at end of body)
// if (document.readyState === 'complete') {
//   console.log('INJECT GO NOW');
//   go();
// } else {
//   window.addEventListener('load', async () => {
//     console.log('INJECT GO DEFERRED');
//     go();
//   });
// }
