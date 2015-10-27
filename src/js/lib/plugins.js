// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
	log.history = log.history || [];   // store logs to an array for reference
	log.history.push(arguments);
	if(this.console) {
		arguments.callee = arguments.callee.caller;
		var newarr = [].slice.call(arguments);
		(typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
	}
};

// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());

// Use toggle in jquery1.9
$.fn.toggleClick=function(){var e=arguments,t=e.length;return this.each(function(i,s){var a=0;$(s).click(function(){return e[a++%t].apply(this,arguments)})})},window.log=function(){if(log.history=log.history||[],log.history.push(arguments),this.console){var e,t=arguments;t.callee=t.callee.caller,e=[].slice.call(t),"object"==typeof console.log?log.apply.call(console.log,console,e):console.log.apply(console,e)}},function(e){function t(){}for(var i,s="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(",");i=s.pop();)e[i]=e[i]||t}(function(){try{return console.log(),window.console}catch(e){return window.console={}}}());

// jquery.hoverdir.js v1.1.0
(function(e,t,n){"use strict";e.HoverDir=function(t,n){this.$el=e(n);this._init(t)};e.HoverDir.defaults={speed:300,easing:"ease",hoverDelay:0,inverse:false};e.HoverDir.prototype={_init:function(t){this.options=e.extend(true,{},e.HoverDir.defaults,t);this.transitionProp="all "+this.options.speed+"ms "+this.options.easing;this.support=Modernizr.csstransitions;this._loadEvents()},_loadEvents:function(){var t=this;this.$el.on("mouseenter.hoverdir, mouseleave.hoverdir",function(n){var r=e(this),i=r.find("div"),s=t._getDir(r,{x:n.pageX,y:n.pageY}),o=t._getStyle(s);if(n.type==="mouseenter"){i.hide().css(o.from);clearTimeout(t.tmhover);t.tmhover=setTimeout(function(){i.show(0,function(){var n=e(this);if(t.support){n.css("transition",t.transitionProp)}t._applyAnimation(n,o.to,t.options.speed)})},t.options.hoverDelay)}else{if(t.support){i.css("transition",t.transitionProp)}clearTimeout(t.tmhover);t._applyAnimation(i,o.from,t.options.speed)}})},_getDir:function(e,t){var n=e.width(),r=e.height(),i=(t.x-e.offset().left-n/2)*(n>r?r/n:1),s=(t.y-e.offset().top-r/2)*(r>n?n/r:1),o=Math.round((Math.atan2(s,i)*(180/Math.PI)+180)/90+3)%4;return o},_getStyle:function(e){var t,n,r={left:"0px",top:"-100%"},i={left:"0px",top:"100%"},s={left:"-100%",top:"0px"},o={left:"100%",top:"0px"},u={top:"0px"},a={left:"0px"};switch(e){case 0:t=!this.options.inverse?r:i;n=u;break;case 1:t=!this.options.inverse?o:s;n=a;break;case 2:t=!this.options.inverse?i:r;n=u;break;case 3:t=!this.options.inverse?s:o;n=a;break}return{from:t,to:n}},_applyAnimation:function(t,n,r){e.fn.applyStyle=this.support?e.fn.css:e.fn.animate;t.stop().applyStyle(n,e.extend(true,[],{duration:r+"ms"}))}};var r=function(e){if(t.console){t.console.error(e)}};e.fn.hoverdir=function(t){var n=e.data(this,"hoverdir");if(typeof t==="string"){var i=Array.prototype.slice.call(arguments,1);this.each(function(){if(!n){r("cannot call methods on hoverdir prior to initialization; "+"attempted to call method '"+t+"'");return}if(!e.isFunction(n[t])||t.charAt(0)==="_"){r("no such method '"+t+"' for hoverdir instance");return}n[t].apply(n,i)})}else{this.each(function(){if(n){n._init()}else{n=e.data(this,"hoverdir",new e.HoverDir(t,this))}})}return n}})(jQuery,window)


// Scroll To
// by zhangxinxu http://www.zhangxinxu.com/wordpress/2010/07/%E9%94%9A%E7%82%B9%E8%B7%B3%E8%BD%AC%E5%8F%8Ajquery%E4%B8%8B%E7%9B%B8%E5%85%B3%E6%93%8D%E4%BD%9C%E4%B8%8E%E6%8F%92%E4%BB%B6/
// 2010-07-15 v1.0
(function($){
	$.fn.zxxAnchor = function(options){
		var defaults = {
			ieFreshFix: true,
			anchorSmooth: true,
			anchortag: "anchor",
			animateTime: 1000
		};
		var sets = $.extend({}, defaults, options || {});
		if(sets.ieFreshFix){
			var url = window.location.toString();
			var id = url.split("#")[1];
			if(id){
				var t = $("#"+id).offset().top;
				$(window).scrollTop(t);
			} 
		}
		$(this).each(function(){
			$(this).click(function(){
				var aim = $(this).attr(sets.anchortag).replace(/#/g,""); 
				var pos = $("#"+aim).offset().top;
				if(sets.anchorSmooth){
					$("html,body").animate({scrollTop: pos}, sets.animateTime); 
				}else{
					$(window).scrollTop(pos);
				}
				return false;          
			}); 
		});
	};
})(jQuery);
// <a href="#bottom" class="smooth">滑到底部</a>
// $(".smooth").zxxAnchor({
//     anchortag: "href"					   
// });

// Author's script
// for page

/* make iframe responsible 
 * change .video to your iframe container class
 */
function fluidVideo () {
	var container = document.querySelectorAll('.fluid-video');
	for (var q = 0; q < container.length; q++) {
		var newW = container[q].offsetWidth;
		var ifr = container[q].childNodes;
		for (var i = 0; i < ifr.length; i++) {
			if ( ifr[i].nodeType == '1' ){
				var ratio = ifr[i].height / ifr[i].width;
				// ifr[i].width = '';
				// ifr[i].height = '';

				ifr[i].width = newW;
				ifr[i].height = newW * ratio;
			}
		}
	}
}
window.onload = fluidVideo;
window.onresize = fluidVideo;

// scroll
document.ready(function () {
  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;

  window.onscroll = function(event){
      didScroll = true;
  };

  setInterval(function() {
      if (didScroll) {
          hasScrolled();
          didScroll = false;
      }
  }, 250);

  function hasScrolled() {
    var st = wl.winST(), winW = wl.winW(), articleST;
    if (winW > 1220) {
      var articleST = wl.get('.article-header').getTop() - 80;
    } else{
      var articleST = wl.get('.article-header').getTop() - 60;
    }
    // scroll down
    if (st > lastScrollTop && st > articleST) {
      wl.get('.article-slide-container').addClass('hide');
    } else{
      // scroll up
      wl.get('.article-slide-container').removeClass('hide');
    }     
    lastScrollTop = st;
  }
});
