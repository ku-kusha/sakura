function cardSwitch(e){
    var chkBox, imgHidd, imgDisp;
    chkBox = e;
    console.log(e.id);
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
};

export {cardSwitch};
