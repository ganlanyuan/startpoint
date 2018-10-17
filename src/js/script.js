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


// print
function beforeprint () {
  let mainStr = 'main',
      printStr = 'printlinks',
      printlinks = doc.querySelector(mainStr+' .'+printStr),
      baseurl = 'https://www.site.com';
  if (!printlinks) {
    let printlinks = doc.createElement('ul'),
        printlinksStr = '',
        article = doc.querySelector(mainStr);
    if (article) {
      printlinks.className = printStr;
      let links = doc.querySelectorAll(mainStr+' a:not([href^="mailto:"])'),
          linkorder = 1;

      for (var i = 0; i < links.length; i++) {
        let link = links[i],
            href = link.getAttribute('href');

        // if (href !== link.textContent && href !== baseurl && href !== baseurl+'/') {
        if (href !== link.textContent) {
          if (href.indexOf('http') < 0) {
            let connectStr = href.charAt(0) === '/' ? '':'/';
            href = baseurl + connectStr + href;
          }

          printlinksStr += '<li>'+linkorder+'. '+href+'</li>';
          link.insertAdjacentHTML('afterend', '<sup class="link-order"> ('+linkorder+')</sup>');

          linkorder++;
        }
      }

      printlinks.innerHTML = printlinksStr;
      article.appendChild(printlinks);
    }
  }
}

window.onbeforeprint = beforeprint;