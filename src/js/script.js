let doc = document,
    html = doc.documentElement,
    body = doc.body;

// remove "no-script" class
html.className = html.className.replace('no-script', '');

// skip link
doc.querySelector('.skip-link').addEventListener('click', function(e) {
  e.preventDefault();
  doc.querySelector(e.target.getAttribute('href')).focus();
});