console.log('INJECT');
window.addEventListener('load', () => {
  console.log(`window load: ${document.readyState}`);
});
document.addEventListener('readystatechange', () => {
  console.log(`readystatechange: ${document.readyState}`);
});
document.addEventListener('DOMContentLoaded', () => {
  console.log(`DOMContentLoaded: ${document.readyState}`);

  window.addEventListener('selectstart', (evt) => {
    evt.preventDefault();
  });

  const bodyStyle = document.body.getAttribute('style') || '';
  document.body.setAttribute(
    'style',
    bodyStyle +
      '-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;',
  );

  document.body.addEventListener('copy', (evt) => {
    evt.preventDefault();
    const selection = document.getSelection();
    if (selection) {
      const str = selection.toString();
      if (str) {
        alert(`Clipboard copy PREVENTED: "${str}"`);
      }
    }
    document.getSelection().empty();
  });

  document.body.addEventListener('contextmenu', (evt) => {
    evt.preventDefault();
  });
});
