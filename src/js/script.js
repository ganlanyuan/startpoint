/* :focus-visible polyfill */
// import '../../node_modules/focus-visible/dist/focus-visible.js'

// tiny-slider
// import {tns} from '../../node_modules/tiny-slider/src/tiny-slider.js'

/** DOMTokenList */
// https://github.com/Alhadis/Fix-IE/edit/master/src/token-list.js
!function(){"use strict";var n,r,t,e,i=window,o=document,u=Object,f=null,a=!0,c=!1,l=" ",s="Element",d="create"+s,h="DOMTokenList",m="__defineGetter__",p="defineProperty",v="class",g="List",y=v+g,w="rel",L=w+g,_="div",b="length",j="contains",S="apply",k="HTML",E=("item "+j+" add remove toggle toString toLocaleString").split(l),A=E[2],C=E[3],M=E[4],N="prototype",O=p in u||m in u[N]||f,T=function(n,r,t,e){u[p]?u[p](n,r,{configurable:c===O?a:!!e,get:t}):n[m](r,t)},x=function(r,t){var e=this,i=[],o={},f=0,s=0,d=function(){if(f>=s)for(;f>s;++s)(function(n){T(e,n,function(){return h(),i[n]},c)})(s)},h=function(){var n,e,u=arguments,c=/\s+/;if(u[b])for(e=0;e<u[b];++e)if(c.test(u[e]))throw n=new SyntaxError('String "'+u[e]+'" '+j+" an invalid character"),n.code=5,n.name="InvalidCharacterError",n;for(i=(""+r[t]).replace(/^\s+|\s+$/g,"").split(c),""===i[0]&&(i=[]),o={},e=0;e<i[b];++e)o[i[e]]=a;f=i[b],d()};return h(),T(e,b,function(){return h(),f}),e[E[6]]=e[E[5]]=function(){return h(),i.join(l)},e.item=function(n){return h(),i[n]},e[j]=function(n){return h(),!!o[n]},e[A]=function(){h[S](e,n=arguments);for(var n,u,c=0,s=n[b];s>c;++c)u=n[c],o[u]||(i.push(u),o[u]=a);f!==i[b]&&(f=i[b]>>>0,r[t]=i.join(l),d())},e[C]=function(){h[S](e,n=arguments);for(var n,u={},c=0,s=[];c<n[b];++c)u[n[c]]=a,delete o[n[c]];for(c=0;c<i[b];++c)u[i[c]]||s.push(i[c]);i=s,f=s[b]>>>0,r[t]=i.join(l),d()},e[M]=function(r,t){return h[S](e,[r]),n!==t?t?(e[A](r),a):(e[C](r),c):o[r]?(e[C](r),c):(e[A](r),a)},function(n,r){if(r)for(var t=0;7>t;++t)r(n,E[t],{enumerable:c})}(e,u[p]),e},D=function(n,r,t){T(n[N],r,function(){var n,e=this,i=m+p+r;if(e[i])return n;if(e[i]=a,c===O){for(var u,f=D.mirror=D.mirror||o[d](_),l=f.childNodes,s=l[b],h=0;s>h;++h)if(l[h]._R===e){u=l[h];break}u||(u=f.appendChild(o[d](_))),n=x.call(u,e,t)}else n=new x(e,t);return T(e,r,function(){return n}),delete e[i],n},a)};if(i[h])r=o[d](_)[y],N=i[h][N],r[A][S](r,E),2>r[b]&&(t=N[A],e=N[C],N[A]=function(){for(var n=0,r=arguments;n<r[b];++n)t.call(this,r[n])},N[C]=function(){for(var n=0,r=arguments;n<r[b];++n)e.call(this,r[n])}),r[M](g,c)&&(N[M]=function(r,t){var e=this;return e[(t=n===t?!e[j](r):t)?A:C](r),!!t});else{if(O)try{T({},"support")}catch(G){O=c}x.polyfill=a,i[h]=x,D(i[s],y,v+"Name"),D(i[k+"Link"+s],L,w),D(i[k+"Anchor"+s],L,w),D(i[k+"Area"+s],L,w)}}();

let doc = document,
    html = doc.documentElement,
    body = doc.body,
    win = window,
    active_cl = 'open';

// remove "no-js" class
html.className = html.className.replace('no-js', 'js');

// skip link
let skiplink = doc.querySelector('.skip-link');
skiplink && skiplink.addEventListener('click', function(e) {
  e.preventDefault();
  doc.querySelector(e.target.getAttribute('href')).focus();
});

// button functions
function btn_fns (str) {
  var attr = 'data-' + str,
      btns = doc.querySelectorAll('[' + attr + ']');
  if (btns.length) {
    forEach(btns, function (btn) {
      var target = doc.querySelector(btn.getAttribute(attr));
      if (target) {
        btn.addEventListener('click', function(e) {
          if (btn.hasAttribute('href')) { e.preventDefault(); }
          let cl = btn.getAttribute('data-toggle-class');
          btn_core(btn, str, target, cl ? cl : active_cl);
        });
      }
    });
  }
}
function btn_core (btn, str, target, cl) {
  switch(str) {
    case 'toggle':
      target.classList.toggle(cl);
      btn.classList.toggle('expanded');
      break;
    case 'add':
      target.classList.add(cl);
      break;
    case 'remove':
      target.classList.remove(cl);
      break;
  }
}
btn_fns('toggle');
btn_fns('add');
btn_fns('remove');


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
        let width = Number(item.width),
            height = Number(item.height);

        if (height && width) {
          let ratio = (height / width) * 100,
              wrap = doc.createElement('div');
          wrap.className = wrapClass;

          embed.classList.remove('flex-video');
          embed.style.maxWidth = width + 'px';
          wrap.style.paddingBottom = ratio + '%';
          item.classList.add(itemClass);

          embed.insertBefore(wrap, item);
          wrap.appendChild(item);
        }
      }
    }
  }
}
makeEmbedFluid();



function forEach (arr, callback, scope) {
  for (var i = 0, l = arr.length; i < l; i++) {
    callback.call(scope, arr[i], i);
  }
}

function lookupByClass (el, cla) {
  if (el === body) { return null; }
  return el.classList && el.classList.contains(cla) ? el : lookupByClass(el.parentNode, cla);
}

function lookupByType (el, target_name, arr) {
  if (!arr.length) { arr.push('body'); }
  var name = el.nodeName.toLowerCase();
  if (arr.indexOf(name) >= 0) { return null; }
  return name !== target_name ? lookupByType(el.parentNode, target_name, arr) : el;
}

function getOffsetTop (el) {
  return el.getBoundingClientRect().top + document.documentElement.scrollTop;
}

// print
function beforeprint () {
  if (body.classList.contains('article-page') ||
      body.classList.contains('static-page') ||
      body.classList.contains('search-results-page')) {

    let mainClass = doc.querySelector('.full-article') ? '.full-article' : 'main',
        printStr = 'printlinks',
        printlinks = doc.querySelector(mainClass+' .'+printStr),
        baseurl = 'https://www.christianpost.com';
    if (!printlinks) {
      let printlinks = doc.createElement('ul'),
          printlinksStr = '',
          article = doc.querySelector(mainClass);
      if (article) {
        printlinks.className = printStr;
        let links = doc.querySelectorAll(mainClass+' a:not([href^="mailto:"])'),
            linkorder = 1;

        for (var i = 0; i < links.length; i++) {
          let link = links[i],
              href = link.getAttribute('href');

          // if (href !== link.textContent && href !== baseurl && href !== baseurl+'/') {
          if (href !== link.textContent && !lookupByClass(link, 'pagination')) {
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
}

window.onbeforeprint = beforeprint;