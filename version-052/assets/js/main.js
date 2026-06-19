
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-button]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    setInterval(function () {
      slides[index].classList.remove("active");
      index = (index + 1) % slides.length;
      slides[index].classList.add("active");
    }, 5200);
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function initFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
    panels.forEach(function (panel) {
      var input = panel.querySelector("[data-search-input]");
      var category = panel.querySelector("[data-category-filter]");
      var year = panel.querySelector("[data-year-filter]");
      var scope = panel.parentElement || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-search]"));
      var empty = scope.querySelector("[data-empty-state]");

      if (input && !input.value) {
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q");
        if (initialQuery) {
          input.value = initialQuery;
        }
      }

      function apply() {
        var term = normalize(input && input.value);
        var cat = normalize(category && category.value);
        var yr = normalize(year && year.value);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize(card.getAttribute("data-search"));
          var cardCat = normalize(card.getAttribute("data-category"));
          var cardYear = Number(card.getAttribute("data-year") || 0);
          var yearMatch = true;

          if (yr === "older") {
            yearMatch = cardYear < 2022;
          } else if (yr) {
            yearMatch = String(cardYear) === yr;
          }

          var matched = (!term || haystack.indexOf(term) !== -1) &&
            (!cat || cardCat === cat) &&
            yearMatch;

          card.style.display = matched ? "" : "none";
          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("visible", visible === 0);
        }
      }

      if (input) {
        input.addEventListener("input", apply);
      }
      if (category) {
        category.addEventListener("change", apply);
      }
      if (year) {
        year.addEventListener("change", apply);
      }
      apply();
    });
  }

  window.initVideoPlayer = function (videoId, buttonId, streamUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    if (!video || !streamUrl) {
      return;
    }

    function attach() {
      if (video.getAttribute("data-ready") === "1") {
        return;
      }
      video.setAttribute("data-ready", "1");

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }

    function play() {
      attach();
      if (button) {
        button.classList.add("hidden");
      }
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", play);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener("play", function () {
      if (button) {
        button.classList.add("hidden");
      }
    });
  };

  ready(function () {
    initMenu();
    initHero();
    initFilters();
  });
})();
