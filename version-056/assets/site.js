(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;
  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, itemIndex) {
      slide.classList.toggle('is-active', itemIndex === current);
    });
    dots.forEach(function (dot, itemIndex) {
      dot.classList.toggle('is-active', itemIndex === current);
    });
  }
  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });
  if (slides.length) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('.js-card-search'));
  searchInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      var keyword = input.value.trim().toLowerCase();
      var scope = document.querySelector(input.getAttribute('data-scope')) || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
      cards.forEach(function (card) {
        var haystack = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-tags') || '')).toLowerCase();
        card.style.display = !keyword || haystack.indexOf(keyword) > -1 ? '' : 'none';
      });
    });
  });

  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.getAttribute('data-filter');
      var scope = document.querySelector(button.getAttribute('data-scope') || '#movie-list') || document;
      filterButtons.forEach(function (item) {
        if ((item.getAttribute('data-scope') || '#movie-list') === (button.getAttribute('data-scope') || '#movie-list')) {
          item.classList.remove('is-active');
        }
      });
      button.classList.add('is-active');
      Array.prototype.slice.call(scope.querySelectorAll('.movie-card')).forEach(function (card) {
        var tags = card.getAttribute('data-tags') || '';
        card.style.display = value === 'all' || tags.indexOf(value) > -1 ? '' : 'none';
      });
    });
  });
})();
