(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-nav-menu]");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        nav.classList.toggle("open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) return;
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === index);
        });
      }

      function restart() {
        if (timer) window.clearInterval(timer);
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          restart();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          restart();
        });
      }

      restart();
    }

    var input = document.querySelector("[data-search-input]");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".catalog-card"));
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter-chip]"));
    var activeFilter = "all";

    function applySearch() {
      if (!cards.length) return;
      var term = input ? input.value.trim().toLowerCase() : "";
      cards.forEach(function (card) {
        var text = card.getAttribute("data-search") || "";
        var filter = card.getAttribute("data-filter") || "";
        var matchedText = !term || text.indexOf(term) !== -1;
        var matchedFilter = activeFilter === "all" || filter === activeFilter;
        card.style.display = matchedText && matchedFilter ? "" : "none";
      });
    }

    if (input) {
      input.addEventListener("input", applySearch);
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeFilter = chip.getAttribute("data-filter-chip") || "all";
        chips.forEach(function (item) {
          item.classList.toggle("active", item === chip);
        });
        applySearch();
      });
    });
  });
})();

function initVideo(source) {
  var video = document.getElementById("mainVideo");
  var cover = document.getElementById("playCover");
  if (!video || !source) return;

  function bindSource() {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      window.__currentHls = hls;
      return;
    }

    video.src = source;
  }

  function play() {
    if (cover) {
      cover.classList.add("hidden");
    }
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  bindSource();

  if (cover) {
    cover.addEventListener("click", play);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    }
  });
}
