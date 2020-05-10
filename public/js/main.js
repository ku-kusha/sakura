/* Utility func*/
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	if (el.classList) return el.classList.contains(className);
	else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	if (el.classList) el.classList.add(classList[0]);
 	else if (!Util.hasClass(el, classList[0])) el.className += " " + classList[0];
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	if (el.classList) el.classList.remove(classList[0]);	
	else if(Util.hasClass(el, classList[0])) {
		var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
		el.className=el.className.replace(reg, ' ');
	}
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < el.children.length; i++) {
    if (Util.hasClass(el.children[i], className)) childrenByClass.push(el.children[i]);
  }
  return childrenByClass;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    var val = parseInt((progress/duration)*change + start);
    element.setAttribute("style", "height:"+val+"px;");
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.setAttribute("style", "height:"+start+"px;");
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb) {
  var start = window.scrollY || document.documentElement.scrollTop,
      currentTime = null;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    window.scrollTo(0, val);
    if(progress < duration) {
        window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

/*SwipeContent Util*/
(function() {
	var SwipeContent = function(element) {
		this.element = element;
		this.delta = [false, false];
		this.dragging = false;
		this.intervalId = false;
		initSwipeContent(this);
	};

	function initSwipeContent(content) {
		content.element.addEventListener('mousedown', handleEvent.bind(content));
		content.element.addEventListener('touchstart', handleEvent.bind(content));
	};

	function initDragging(content) {
		content.element.addEventListener('mousemove', handleEvent.bind(content));
		content.element.addEventListener('touchmove', handleEvent.bind(content));
		content.element.addEventListener('mouseup', handleEvent.bind(content));
		content.element.addEventListener('mouseleave', handleEvent.bind(content));
		content.element.addEventListener('touchend', handleEvent.bind(content));
	};

	function cancelDragging(content) {
		if(content.intervalId) {
			(!window.requestAnimationFrame) ? clearInterval(content.intervalId) : window.cancelAnimationFrame(content.intervalId);
			content.intervalId = false;
		}
		content.element.removeEventListener('mousemove', handleEvent.bind(content));
		content.element.removeEventListener('touchmove', handleEvent.bind(content));
		content.element.removeEventListener('mouseup', handleEvent.bind(content));
		content.element.removeEventListener('mouseleave', handleEvent.bind(content));
		content.element.removeEventListener('touchend', handleEvent.bind(content));
	};

	function handleEvent(event) {
		switch(event.type) {
			case 'mousedown':
			case 'touchstart':
				startDrag(this, event);
				break;
			case 'mousemove':
			case 'touchmove':
				drag(this, event);
				break;
			case 'mouseup':
			case 'mouseleave':
			case 'touchend':
				endDrag(this, event);
				break;
		}
	};

	function startDrag(content, event) {
		content.dragging = true;
		initDragging(content);
		content.delta = [parseInt(unify(event).clientX), parseInt(unify(event).clientY)];
		emitSwipeEvents(content, 'dragStart', content.delta);
	};

	function endDrag(content, event) {
		cancelDragging(content);
		var dx = parseInt(unify(event).clientX), 
	    dy = parseInt(unify(event).clientY);
	  
		if(content.delta && (content.delta[0] || content.delta[0] === 0)) {
	    var s = Math.sign(dx - content.delta[0]);
			
			if(Math.abs(dx - content.delta[0]) > 30) {
				(s < 0) ? emitSwipeEvents(content, 'swipeLeft', [dx, dy]) : emitSwipeEvents(content, 'swipeRight', [dx, dy]);	
			}
	    
	    content.delta[0] = false;
	  }

	  if(content.delta && (content.delta[1] || content.delta[1] === 0)) {
	  	var y = Math.sign(dy - content.delta[1]);

	  	if(Math.abs(dy - content.delta[1]) > 30) {
	    	(y < 0) ? emitSwipeEvents(content, 'swipeUp', [dx, dy]) : emitSwipeEvents(content, 'swipeDown', [dx, dy]);
	    }

	    content.delta[1] = false;
	  }

	  emitSwipeEvents(content, 'dragEnd', [dx, dy]);
	  content.dragging = false;
	};

	function drag(content, event) {
		if(!content.dragging) return;

		(!window.requestAnimationFrame) 
			? content.intervalId = setTimeout(function(){emitDrag.bind(content, event);}, 250) 
			: content.intervalId = window.requestAnimationFrame(emitDrag.bind(content, event));
	};

	function emitDrag(event) {
		emitSwipeEvents(this, 'dragging', [parseInt(unify(event).clientX), parseInt(unify(event).clientY)]);
	};

	function unify(event) { 

		return event.changedTouches ? event.changedTouches[0] : event; 
	};

	function emitSwipeEvents(content, eventName, detail) {

		var event = new CustomEvent(eventName, {detail: {x: detail[0], y: detail[1]}});
		content.element.dispatchEvent(event);
	};

	window.SwipeContent = SwipeContent;
	

	var swipe = document.getElementsByClassName('js-swipe-content');
	if( swipe.length > 0 ) {
		for( var i = 0; i < swipe.length; i++) {
			(function(i){new SwipeContent(swipe[i]);})(i);
		}
	}
}());

/*News Line*/
(function() {
    var HorizontalTimeline = function(element) {
          this.element = element;
          this.datesContainer = this.element.getElementsByClassName('news-line-dates')[0];
          this.line = this.datesContainer.getElementsByClassName('news-line-line')[0];
          this.fillingLine = this.datesContainer.getElementsByClassName('news-line-filling-line')[0];
          this.date = this.line.getElementsByClassName('news-line-date');
          this.selectedDate = this.line.getElementsByClassName('news-line-date--selected')[0];
          this.dateValues = parseDate(this);
          this.minLapse = calcMinLapse(this);
          this.navigation = this.element.getElementsByClassName('news-line-navigation');
          this.contentWrapper = this.element.getElementsByClassName('news-line-events')[0];
          this.content = this.contentWrapper.getElementsByClassName('news-line-event');
          
          this.eventsMinDistance = 210;
          this.eventsMaxDistance = 210;
          this.translate = 0;
          this.lineLength = 0;
          
          this.oldDateIndex = Util.getIndexInArray(this.date, this.selectedDate);
          this.newDateIndex = this.oldDateIndex;
  
          initTimeline(this);
          initEvents(this);
    };
  
    function initTimeline(timeline) {
        var left = 0;
          for (var i = 0; i < timeline.dateValues.length; i++) { 
              var j = (i == 0) ? 0 : i - 1;
          var distance = daydiff(timeline.dateValues[j], timeline.dateValues[i]),
              distanceNorm = (Math.round(distance/timeline.minLapse) + 2)*timeline.eventsMinDistance;
      
          if(distanceNorm < timeline.eventsMinDistance) {
              distanceNorm = timeline.eventsMinDistance;
          } else if(distanceNorm > timeline.eventsMaxDistance) {
              distanceNorm = timeline.eventsMaxDistance;
          }
          left = left + distanceNorm;
          timeline.date[i].setAttribute('style', 'left:' + left+'px');
          }
          
      timeline.line.style.width = (left + timeline.eventsMinDistance)+'px';
          timeline.lineLength = left + timeline.eventsMinDistance;
          Util.addClass(timeline.element, 'news-line--loaded');
          selectNewDate(timeline, timeline.selectedDate);
          resetTimelinePosition(timeline, 'next');
    };
  
    function initEvents(timeline) {
        var self = timeline;
          self.navigation[0].addEventListener('click', function(event){
              event.preventDefault();
              translateTimeline(self, 'prev');
          });
          self.navigation[1].addEventListener('click', function(event){
              event.preventDefault();
              translateTimeline(self, 'next');
          });

          new SwipeContent(self.datesContainer);
          self.datesContainer.addEventListener('swipeLeft', function(event){
              translateTimeline(self, 'next');
          });
          self.datesContainer.addEventListener('swipeRight', function(event){
              translateTimeline(self, 'prev');
          });

          for(var i = 0; i < self.date.length; i++) {
              (function(i){
                  self.date[i].addEventListener('click', function(event){
                      event.preventDefault();
                      selectNewDate(self, event.target);
                  });
  
                  self.content[i].addEventListener('animationend', function(event){
                      if( i == self.newDateIndex && self.newDateIndex != self.oldDateIndex) resetAnimation(self);
                  });
              })(i);
          }
    };
  
    function updateFilling(timeline) {
          var dateStyle = window.getComputedStyle(timeline.selectedDate, null),
              left = dateStyle.getPropertyValue("left"),
              width = dateStyle.getPropertyValue("width");
          
          left = Number(left.replace('px', '')) + Number(width.replace('px', ''))/2;
          timeline.fillingLine.style.transform = 'scaleX('+(left/timeline.lineLength)+')';
      };
  
    function translateTimeline(timeline, direction) {
        var containerWidth = timeline.datesContainer.offsetWidth;
        if(direction) {
            timeline.translate = (direction == 'next') ? timeline.translate - containerWidth + timeline.eventsMinDistance : timeline.translate + containerWidth - timeline.eventsMinDistance;
        }
      if( 0 - timeline.translate > timeline.lineLength - containerWidth ) timeline.translate = containerWidth - timeline.lineLength;
      if( timeline.translate > 0 ) timeline.translate = 0;
  
      timeline.line.style.transform = 'translateX('+timeline.translate+'px)';
          (timeline.translate == 0 ) ? Util.addClass(timeline.navigation[0], 'news-line-navigation--inactive') : Util.removeClass(timeline.navigation[0], 'news-line-navigation--inactive');
          (timeline.translate == containerWidth - timeline.lineLength ) ? Util.addClass(timeline.navigation[1], 'news-line-navigation--inactive') : Util.removeClass(timeline.navigation[1], 'news-line-navigation--inactive');
    };
  
      function selectNewDate(timeline, target) {
          timeline.newDateIndex = Util.getIndexInArray(timeline.date, target);
          timeline.oldDateIndex = Util.getIndexInArray(timeline.date, timeline.selectedDate);
          Util.removeClass(timeline.selectedDate, 'news-line-date--selected');
          Util.addClass(timeline.date[timeline.newDateIndex], 'news-line-date--selected');
          timeline.selectedDate = timeline.date[timeline.newDateIndex];
          updateOlderEvents(timeline);
          updateVisibleContent(timeline);
          updateFilling(timeline);
      };
  
      function updateOlderEvents(timeline) {
          for(var i = 0; i < timeline.date.length; i++) {
              (i < timeline.newDateIndex) ? Util.addClass(timeline.date[i], 'news-line-date--older-event') : Util.removeClass(timeline.date[i], 'news-line-date--older-event');
          }
      };
  
      function updateVisibleContent(timeline) {
          if (timeline.newDateIndex > timeline.oldDateIndex) {
              var classEntering = 'news-line-event--selected news-line-event--enter-right',
                  classLeaving = 'news-line-event--leave-left';
          } else if(timeline.newDateIndex < timeline.oldDateIndex) {
              var classEntering = 'news-line-event--selected news-line-event--enter-left',
                  classLeaving = 'news-line-event--leave-right';
          } else {
              var classEntering = 'news-line-event--selected',
                  classLeaving = '';
          }
  
          Util.addClass(timeline.content[timeline.newDateIndex], classEntering);
          if (timeline.newDateIndex != timeline.oldDateIndex) {
              Util.removeClass(timeline.content[timeline.oldDateIndex], 'news-line-event--selected');
              Util.addClass(timeline.content[timeline.oldDateIndex], classLeaving);
              timeline.contentWrapper.style.height = timeline.content[timeline.newDateIndex].offsetHeight + 'px';
          }
      };
  
      function resetAnimation(timeline) {
          timeline.contentWrapper.style.height = null;
          Util.removeClass(timeline.content[timeline.newDateIndex], 'news-line-event--enter-right news-line-event--enter-left');
          Util.removeClass(timeline.content[timeline.oldDateIndex], 'news-line-event--leave-right news-line-event--leave-left');
      };
  
      function keyNavigateTimeline(timeline, direction) {
          var newIndex = (direction == 'next') ? timeline.newDateIndex + 1 : timeline.newDateIndex - 1;
          if(newIndex < 0 || newIndex >= timeline.date.length) return;
          selectNewDate(timeline, timeline.date[newIndex]);
          resetTimelinePosition(timeline, direction);
      };
      
      function resetTimelinePosition(timeline, direction) {
          var eventStyle = window.getComputedStyle(timeline.selectedDate, null),
              eventLeft = Number(eventStyle.getPropertyValue('left').replace('px', '')),
              timelineWidth = timeline.datesContainer.offsetWidth;
  
      if( (direction == 'next' && eventLeft >= timelineWidth - timeline.translate) || (direction == 'prev' && eventLeft <= - timeline.translate) ) {
          timeline.translate = timelineWidth/2 - eventLeft;
          translateTimeline(timeline, false);
      }
    };
  
    function parseDate(timeline) {
          var dateArrays = [];
          for(var i = 0; i < timeline.date.length; i++) {
              var singleDate = timeline.date[i].getAttribute('data-date'),
                  dateComp = singleDate.split('T');
              
              if( dateComp.length > 1 ) {
                  var dayComp = dateComp[0].split('.'),
                      timeComp = dateComp[1].split(':');
              } else if( dateComp[0].indexOf(':') >=0 ) {
                  var dayComp = ["2000", "0", "0"],
                      timeComp = dateComp[0].split(':');
              } else {
                  var dayComp = dateComp[0].split('.'),
                      timeComp = ["0", "0"];
              }
              var	newDate = new Date(dayComp[2], dayComp[1]-1, dayComp[0], timeComp[0], timeComp[1]);
              dateArrays.push(newDate);
          }
          console.log(dateArrays);
        return dateArrays;
    };
  
    function calcMinLapse(timeline) {
          var dateDistances = [];
          for(var i = 1; i < timeline.dateValues.length; i++) { 
          var distance = daydiff(timeline.dateValues[i-1], timeline.dateValues[i]);
          if(distance > 0) dateDistances.push(distance);
          }
  
          return (dateDistances.length > 0 ) ? Math.min.apply(null, dateDistances) : 86400000;
      };
  
      function daydiff(first, second) {
          return Math.round((second-first));
      };
  
    window.HorizontalTimeline = HorizontalTimeline;
  
    var horizontalTimeline = document.getElementsByClassName('js-news-line'),
        horizontalTimelineTimelineArray = [];
    if(horizontalTimeline.length > 0) {
          for(var i = 0; i < horizontalTimeline.length; i++) {
              horizontalTimelineTimelineArray.push(new HorizontalTimeline(horizontalTimeline[i])); 
          }
          document.addEventListener('keydown', function(event){
              if( (event.keyCode && event.keyCode == 39) || ( event.key && event.key.toLowerCase() == 'arrowright') ) {
                  updateHorizontalTimeline('next');
              } else if((event.keyCode && event.keyCode == 37) || ( event.key && event.key.toLowerCase() == 'arrowleft')) {
                  updateHorizontalTimeline('prev');
              }
          });
    };
  
    function updateHorizontalTimeline(direction) {
          for(var i = 0; i < horizontalTimelineTimelineArray.length; i++) {
              if(elementInViewport(horizontalTimeline[i])) keyNavigateTimeline(horizontalTimelineTimelineArray[i], direction);
          }
    };

      function elementInViewport(el) {
          var top = el.offsetTop;
          var left = el.offsetLeft;
          var width = el.offsetWidth;
          var height = el.offsetHeight;
  
          while(el.offsetParent) {
              el = el.offsetParent;
              top += el.offsetTop;
              left += el.offsetLeft;
          }
  
          return (
              top < (window.pageYOffset + window.innerHeight) &&
              left < (window.pageXOffset + window.innerWidth) &&
              (top + height) > window.pageYOffset &&
              (left + width) > window.pageXOffset
          );
      }
  }());

/*Mobile Menu Scroll*/
var scrollPos = window.scrollY;
var mobileFixed = document.getElementById("mobile-fixed");

document.addEventListener('scroll', function() {

    scrollPos = window.scrollY;

    if(scrollPos > 10){
        mobileFixed.classList.add("bg-s-gray");
        mobileFixed.classList.add("shadow");
    }
    else {
        mobileFixed.classList.remove("bg-s-gray");
        mobileFixed.classList.remove("shadow");
    }

});
/*Mobile Menu*/
function openMobileNav(){
    var el;
    el = document.getElementById("navMobile");
    el.classList.remove('w-0');
    el.classList.add('w-full');
}
function closeMobileNav(){
    var el;
    el = document.getElementById("navMobile");
    el.classList.remove('w-full');
    el.classList.add('w-0');
}
/*Carousels*/
new Glide('.banner-mobile').mount();
new Glide('.manufacturer-slider', {
    type: 'carousel',
    autoplay: 0,
    perView: 1,
    peek: { before: 100, after: 100 },
    gap: 10,            
}).mount();
new Glide('.programs-slider', {
    type: 'carousel',
    autoplay: 0,
    perView: 3,
    gap: 10,
    breakpoints: {1024:{perView: 1}}
}).mount()
new Glide('.news-slider', {
    type: 'slider',
    autoplay: 0,
    perView: 1,
    gap: 10,            
}).mount();



/*Modal*/
var openmodal = document.querySelectorAll('.modal-open')
for (var i = 0; i < openmodal.length; i++) {
openmodal[i].addEventListener('click', function(event){
    event.preventDefault()
    toggleModal()
})
}

const overlay = document.querySelector('.modal-overlay')
overlay.addEventListener('click', toggleModal)

var closemodal = document.querySelectorAll('.modal-close')
for (var i = 0; i < closemodal.length; i++) {
closemodal[i].addEventListener('click', toggleModal)
}

document.onkeydown = function(evt) {
evt = evt || window.event
var isEscape = false
if ("key" in evt) {
    isEscape = (evt.key === "Escape" || evt.key === "Esc")
} else {
    isEscape = (evt.keyCode === 27)
}
if (isEscape && document.body.classList.contains('modal-active')) {
    toggleModal()
}
};


function toggleModal () {
const body = document.querySelector('body')
const modal = document.querySelector('.modal')
modal.classList.toggle('opacity-0')
modal.classList.toggle('pointer-events-none')
body.classList.toggle('modal-active')
}

/*Cartridge Switch*/
function cardSwitch (eId){
    var chkBox, imgHidd, imgDisp;            
    chkBox = document.getElementById(eId);
    if(chkBox.checked){
        imgDisp = document.getElementsByClassName('cartridge');
        Array.prototype.forEach.call(imgDisp, function(el){
            //console.log(el.classList);
            el.classList.remove('hidden');
        });
        imgHidd = document.getElementsByClassName('package');                
        Array.prototype.forEach.call(imgHidd, function(el){
            el.classList.add('hidden');
        });
    }
    else{
        imgDisp = document.getElementsByClassName('package');
        Array.prototype.forEach.call(imgDisp, function(el){
            //console.log(el.classList);
            el.classList.remove('hidden');
        });
        imgHidd = document.getElementsByClassName('cartridge');                
        Array.prototype.forEach.call(imgHidd, function(el){
            el.classList.add('hidden');
        });
    }
};
