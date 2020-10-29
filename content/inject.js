/* eslint-disable no-prototype-builtins */

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

// const hasStorageAccess = await document.hasStorageAccess();
// console.log('hasStorageAccess', hasStorageAccess);

// const requestStorageAccess = await document.requestStorageAccess();
// console.log('requestStorageAccess', requestStorageAccess);

const onAClick = (ev) => {
  ev.preventDefault();
  const href = ev.currentTarget.getAttribute('data-href-resolved');
  // this doesn't forward HTTP referer!
  // location.href = href;
  // location.replace(href);
  const newAEl = document.createElement('a');
  newAEl.setAttribute('href', href);
  newAEl.click();
};

const feature1 = (activate) => {
  console.log('feature1', activate);

  const aEls = document.querySelectorAll('a');

  aEls.forEach((aEl) => {
    const dataHref = aEl.getAttribute('data-href');
    if (!dataHref) {
      aEl.setAttribute('data-href', aEl.getAttribute('href'));
      aEl.setAttribute('data-href-resolved', aEl.href);
    }
  });

  if (activate) {
    aEls.forEach((aEl) => {
      aEl.setAttribute('href', '/#');
      aEl.addEventListener('click', onAClick);
    });
  } else {
    aEls.forEach((aEl) => {
      aEl.setAttribute('href', aEl.getAttribute('data-href'));
      aEl.removeEventListener('click', onAClick);
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

  const val = typeof inputs[key] !== 'undefined' ? Boolean(inputs[key]) : false;

  console.log('inputs[key]:', key, inputs[key]);

  if (key === 'checkBox_1') {
    feature1(val);
  }
});

window.addEventListener('message', (evt) => {
  console.log('window message:', evt.data);

  if (typeof evt.data.checkBox_1 !== 'undefined') {
    feature1(evt.data.checkBox_1);
  }
});

// window.addEventListener('selectstart', (evt) => {
//   evt.preventDefault();
// });

// const bodyStyle = document.body.getAttribute('style') || '';
// document.body.setAttribute(
//   'style',
//   bodyStyle +
//     '-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;',
// );

// document.body.addEventListener('copy', (evt) => {
//   evt.preventDefault();
//   const selection = document.getSelection();
//   if (selection) {
//     const str = selection.toString();
//     if (str) {
//       alert(`Clipboard copy PREVENTED: "${str}"`);
//     }
//   }
//   document.getSelection().empty();
// });

// document.body.addEventListener('contextmenu', (evt) => {
//   evt.preventDefault();
// });

// document.body.addEventListener('dragstart', (evt) => {
//   evt.preventDefault();
// });
