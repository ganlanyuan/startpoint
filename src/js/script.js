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



function makeEmbedFluid() {
  let embeds = doc.querySelectorAll('.embedded-content'),
      embedsLen = embeds.length,
      player = /www.youtube.com|player.vimeo.com|www.facebook.com\/plugins\/video.php|www.google.com\/maps\/embed/,
      wrapClass = 'fluid-wrapper',
      itemClass = 'fluid-item';

  if (embedsLen) {
    for(let i = embedsLen; i--;) {
      let embed = embeds[i],
          item = embed.querySelector('iframe');

      if (item && !item.classList.contains(itemClass) && item.src.search(player) > 0) {
        let width = item.width,
            height = item.height;

        if (height && width) {
          let ratio = (height / width) * 100,
              wrap = doc.createElement('div');
          wrap.className = wrapClass;

          embed.style.maxWidth = width + 'px';
          wrap.style.paddingTop = ratio + '%';
          item.classList.add(itemClass);

          embed.insertBefore(wrap, item);
          wrap.appendChild(item);
        }
      }
    }
  }
}