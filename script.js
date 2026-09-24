(function () {
  var root = document.documentElement;

  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  // Idioma
  document.getElementById('lang-toggle').addEventListener('click', function () {
    var next = root.lang === 'es' ? 'en' : 'es';
    root.lang = next;
    save('lang', next);
  });

  // Tema
  document.getElementById('theme-toggle').addEventListener('click', function () {
    var current = root.dataset.theme ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    save('theme', next);
  });

  // Borde del nav al hacer scroll
  var nav = document.querySelector('.nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Galerías: la miniatura reemplaza la imagen principal
  document.querySelectorAll('.thumbs').forEach(function (thumbs) {
    var main = thumbs.parentElement.querySelector('.shot img');
    var original = main.getAttribute('src');
    thumbs.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isActive = btn.classList.contains('active');
        thumbs.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
        var src = isActive ? original : btn.dataset.src;
        if (!isActive) btn.classList.add('active');
        main.style.opacity = '0';
        setTimeout(function () {
          main.src = src;
          main.alt = isActive ? main.alt : btn.querySelector('img').alt;
          main.style.opacity = '1';
        }, 150);
      });
    });
  });

  // Lightbox
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  document.querySelectorAll('.shot').forEach(function (fig) {
    fig.addEventListener('click', function () {
      var img = fig.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lb.showModal();
    });
  });
  lb.addEventListener('click', function () { lb.close(); });

  // Aparición al hacer scroll
  var targets = document.querySelectorAll('.section-head, .project, .mini, .timeline li, .stack-col, .contact > *');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
