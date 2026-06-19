(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");
    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", function () {
        mobilePanel.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var prev = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    if (slides.length) {
      if (prev) {
        prev.addEventListener("click", function () {
          showSlide(current - 1);
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          showSlide(current + 1);
        });
      }
      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        });
      });
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));

    searchInputs.forEach(function (input) {
      input.addEventListener("input", function () {
        var query = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
          card.classList.toggle("is-hidden-by-search", query.length > 0 && text.indexOf(query) === -1);
        });
      });
    });

    var chipWrap = document.querySelector("[data-filter-chips]");
    if (chipWrap) {
      var chips = Array.prototype.slice.call(chipWrap.querySelectorAll("[data-filter-chip]"));
      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          var value = chip.getAttribute("data-filter-chip") || "全部";
          chips.forEach(function (item) {
            item.classList.toggle("is-active", item === chip);
          });
          cards.forEach(function (card) {
            var text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
            var matched = value === "全部" || text.indexOf(value.toLowerCase()) !== -1;
            card.classList.toggle("is-hidden-by-filter", !matched);
          });
        });
      });
      if (chips[0]) {
        chips[0].classList.add("is-active");
      }
    }
  });
})();

function setupMoviePlayer(url) {
  var video = document.querySelector("[data-player-video]");
  var cover = document.querySelector("[data-player-cover]");
  if (!video || !cover || !url) {
    return;
  }

  var attached = false;
  var hlsInstance = null;

  function attachMedia() {
    if (attached) {
      return;
    }
    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hlsInstance.loadSource(url);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = url;
  }

  function startPlay() {
    attachMedia();
    cover.classList.add("is-hidden");
    video.setAttribute("controls", "controls");
    var playAction = video.play();
    if (playAction && typeof playAction.catch === "function") {
      playAction.catch(function () {
        cover.classList.remove("is-hidden");
      });
    }
  }

  cover.addEventListener("click", startPlay);
  video.addEventListener("click", function () {
    if (video.paused) {
      startPlay();
    }
  });

  window.addEventListener("pagehide", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
