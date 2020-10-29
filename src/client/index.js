/* eslint-disable no-prototype-builtins */

console.log('INDEX');

window.onCheckBoxClick = (id) => {
  const checked = document.getElementById(id).checked;
  localStorage.setItem(
    'checkBoxes',
    JSON.stringify(
      Object.assign(JSON.parse(localStorage.getItem('checkBoxes') || '{}'), {
        [id]: checked,
      }),
    ),
  );
  document
    .getElementById('frame')
    .contentWindow.postMessage({ [id]: checked }, '*');
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
  // setTimeout(() => {
  //   document.querySelectorAll('input[type=checkbox][id]').forEach((inputEl) => {
  //     window.onCheckBoxClick(inputEl.id);
  //   });
  // }, 500);
});
