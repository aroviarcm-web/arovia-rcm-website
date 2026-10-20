(function(){
  var btn=document.querySelector('.menu-btn'),ul=document.getElementById('navlist');
  if(btn&&ul){
    btn.addEventListener('click',function(){var o=ul.classList.toggle('open');btn.setAttribute('aria-expanded',String(o))});
    ul.addEventListener('click',function(e){if(e.target.closest('a')){ul.classList.remove('open');btn.setAttribute('aria-expanded','false')}});
  }
  var y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();
})();
