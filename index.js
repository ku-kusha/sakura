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
var navToggler = document.getElementById("nav-toggle");
var navMobile = document.getElementById("nav-mobile");
var navClose = document.getElementById("nav-close");

navToggler.addEventListener('click', function(){
    navMobile.classList.remove('w-0');
    navMobile.classList.add('w-full');
});

navClose.addEventListener('click', function(){
    navMobile.classList.remove('w-full');
    navMobile.classList.add('w-0');
});

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
    console.log('working fine');
};

/*Cartridge Switch*/
var cartridgeSwitch = document.getElementById("card-switch");

cartridgeSwitch.addEventListener('change', function(){
    var chkBox, imgHidd, imgDisp;
    chkBox = this;
    console.log(chkBox);
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
            el.classList.remove('hidden');
        });
        imgHidd = document.getElementsByClassName('cartridge');                
        Array.prototype.forEach.call(imgHidd, function(el){
            el.classList.add('hidden');
        });
    }
});

/*Carousels*/
import Glide from './node_modules/@glidejs/glide'
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
