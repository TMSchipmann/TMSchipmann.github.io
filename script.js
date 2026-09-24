(function () {
  var root = document.documentElement;
  var toast = document.getElementById('toast');
  var toastTimer;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }

  // Idioma
  document.getElementById('lang-toggle').addEventListener('click', function () {
    root.lang = root.lang === 'es' ? 'en' : 'es';
    try { localStorage.setItem('lang', root.lang); } catch (e) {}
  });

  // Stickers arrastrables
  document.querySelectorAll('.sticker').forEach(function (el) {
    var zone = el.parentElement;
    el.addEventListener('pointerdown', function (e) {
      var zr = zone.getBoundingClientRect();
      var er = el.getBoundingClientRect();
      var dx = e.clientX - er.left;
      var dy = e.clientY - er.top;
      el.setPointerCapture(e.pointerId);
      el.classList.add('dragging');
      zone.appendChild(el); // queda encima de los demás

      function move(ev) {
        var x = Math.max(-20, Math.min(ev.clientX - zr.left - dx, zr.width - er.width + 20));
        var y = Math.max(-20, Math.min(ev.clientY - zr.top - dy, zr.height - er.height + 20));
        el.style.left = x + 'px';
        el.style.top = y + 'px';
      }
      function up() {
        el.classList.remove('dragging');
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
      }
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
  });

  // Carrusel de capturas en cada navegador
  document.querySelectorAll('.browser').forEach(function (b) {
    var img = b.querySelector('img');
    var set = img.dataset.set.split(',');
    var i = 0;
    b.querySelector('.next').addEventListener('click', function () {
      i = (i + 1) % set.length;
      img.style.opacity = '0';
      setTimeout(function () {
        img.src = 'assets/' + set[i] + '.jpg';
        img.onload = function () { img.style.opacity = '1'; };
      }, 180);
    });
  });

  // Copiar correo
  var copyBtn = document.getElementById('copy-email');
  copyBtn.addEventListener('click', function () {
    var email = copyBtn.dataset.email;
    var done = function () { showToast(root.lang === 'es' ? '¡Copiado! 📋' : 'Copied! 📋'); };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(done, function () { location.href = 'mailto:' + email; });
    } else {
      location.href = 'mailto:' + email;
    }
  });

  // Contadores
  function count(el) {
    var target = +el.dataset.count;
    var start = performance.now();
    var dur = 1100;
    (function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  // Aparición al hacer scroll
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('[data-count]').forEach(count);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.num, .card, .big-title, .ticket, .stops li').forEach(function (el) {
      el.classList.add('pop');
      io.observe(el);
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
