/* eslint-disable no-prototype-builtins */

console.log('INDEX');

window.onCheckBoxClick = (id, reload) => {
  const checked = document.getElementById(id).checked;
  localStorage.setItem(
    'checkBoxes',
    JSON.stringify(
      Object.assign(JSON.parse(localStorage.getItem('checkBoxes') || '{}'), {
        [id]: checked,
      }),
    ),
  );
  if (reload) {
    // console.log(document.getElementById('frame').src);
    // console.log(document.getElementById('frame').getAttribute('src'));
    console.log(document.getElementById('frame').contentWindow.document.URL);
    const url = new URL(
      document.getElementById('frame').contentWindow.document.URL,
    );
    url.searchParams.set('checkBoxes', localStorage.getItem('checkBoxes'));
    console.log(url.toString());
    document.getElementById('frame').setAttribute('src', url.toString());
    // console.log(
    //   document.getElementById('frame').contentWindow.document.documentURI,
    // );
    // console.log(document.getElementById('frame').contentWindow.document.baseURI);
  } else {
    document
      .getElementById('frame')
      .contentWindow.postMessage({ [id]: checked }, '*');
  }
};

document.addEventListener('DOMContentLoaded', () => {
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
    const el = document.getElementById(key);
    if (el) {
      el.checked = val;
    }
  });

  document
    .getElementById('frame')
    .setAttribute(
      'src',
      `/protect-root?checkBoxes=${localStorage.getItem('checkBoxes')}`,
    );

  // setTimeout(() => {
  //   document.querySelectorAll('input[type=checkbox][id]').forEach((inputEl) => {
  //     window.onCheckBoxClick(inputEl.id);
  //   });
  // }, 500);
});
