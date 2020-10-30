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

document.getElementById('location').textContent = location.href;

// const hasStorageAccess = await document.hasStorageAccess();
// console.log('hasStorageAccess', hasStorageAccess);

// const requestStorageAccess = await document.requestStorageAccess();
// console.log('requestStorageAccess', requestStorageAccess);

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

const onDragstart = (evt) => {
  evt.preventDefault();
};
const feature7 = (activate) => {
  if (activate) {
    document.body.addEventListener('dragstart', onDragstart);
  } else {
    document.body.removeEventListener('dragstart', onDragstart);
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
const selectStyle = `
-webkit-touch-callout: none;
-webkit-user-select: none;
-khtml-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
`;
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

  const val = typeof inputs[key] !== 'undefined' ? Boolean(inputs[key]) : false;

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
  }
});
