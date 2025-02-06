(function () {
  'use strict';

  var menuIconElement = document.querySelector('.header-menu-icon');
  var menuElement = document.querySelector('.menu');
  var menuOverlayElement = document.querySelector('.menu-overlay');
  var shareIcon = document.querySelector('#share');

  //Menu click event
  menuIconElement.addEventListener('click', showMenu, false);
  menuOverlayElement.addEventListener('click', hideMenu, false);
  menuElement.addEventListener('transitionend', onTransitionEnd, false);
  shareIcon.addEventListener('click', shareApp, false);

   //To show menu
  function showMenu() {
    menuElement.style.transform = "translateX(0)";
    menuElement.classList.add('menu-show');
    menuOverlayElement.classList.add('menu-overlay-show');
    if( navigator.share === undefined ){
      document.querySelector('#share').hide();
    }
  }

  //To hide menu
  function hideMenu() {
    menuElement.style.transform = "translateX(-110%)";
    menuElement.classList.remove('menu-show');
    menuOverlayElement.classList.remove('menu-overlay-show');
    menuElement.addEventListener('transitionend', onTransitionEnd, false);
  }

  var touchStartPoint, touchMovePoint;

  /*Swipe from edge to open menu*/

  //`TouchStart` event to find where user start the touch
  document.body.addEventListener('touchstart', function(event) {
    touchStartPoint = event.changedTouches[0].pageX;
    touchMovePoint = touchStartPoint;
  }, false);
  
  //`TouchMove` event to determine user touch movement
  document.body.addEventListener('touchmove', function(event) {
    touchMovePoint = event.touches[0].pageX;
    if (touchStartPoint < 10 && touchMovePoint > 30) {      
      menuElement.style.transform = "translateX(0)";
    }
  }, false);

  function onTransitionEnd() {
    if (touchStartPoint < 10) {
      menuElement.style.transform = "translateX(0)";
      menuOverlayElement.classList.add('menu-overlay-show');
      menuElement.removeEventListener('transitionend', onTransitionEnd, false); 
    }
  }

  function shareApp(){
    if (navigator.share) {
      navigator.share({
        url: "https://stalphonsaleicester.uk/",
      }).then(() => console.log('Successful share'))
      .catch(error => console.log('Error sharing:', error));
      }
  }
})();