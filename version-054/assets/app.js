(function () {
  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, "");
  }

  function setupMobileMenu() {
    var button = $("[data-mobile-toggle]");
    var panel = $("[data-mobile-panel]");
    if (!button || !panel) {
      return;
    }

    button.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function setupHeaderSearch() {
    $all("[data-nav-search]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = $("input", form);
        var query = input ? input.value.trim() : "";
        var url = "search.html";
        if (query) {
          url += "?q=" + encodeURIComponent(query);
        }
        window.location.href = url;
      });
    });
  }

  function setupHero() {
    var hero = $("[data-hero]");
    if (!hero) {
      return;
    }

    var slides = $all("[data-hero-slide]", hero);
    var dots = $all("[data-hero-dot]", hero);
    var prev = $("[data-hero-prev]", hero);
    var next = $("[data-hero-next]", hero);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function move(step) {
      show(index + step);
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        move(1);
      }, 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        move(-1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        move(1);
        startTimer();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        startTimer();
      });
    });

    hero.addEventListener("mouseenter", stopTimer);
    hero.addEventListener("mouseleave", startTimer);
    show(0);
    startTimer();
  }

  function setupFiltering() {
    $all("[data-filter-panel]").forEach(function (panel) {
      var input = $("[data-filter-input]", panel);
      var chips = $all("[data-filter-value]", panel);
      var targetSelector = panel.getAttribute("data-filter-target") || "[data-card]";
      var cards = $all(targetSelector);
      var empty = $(panel.getAttribute("data-empty-target") || "[data-empty-state]");
      var activeValue = "";

      function apply() {
        var query = normalize(input ? input.value : "");
        var chipValue = normalize(activeValue);
        var visible = 0;

        cards.forEach(function (card) {
          var text = normalize(card.getAttribute("data-search") || card.textContent);
          var queryMatch = !query || text.indexOf(query) !== -1;
          var chipMatch = !chipValue || text.indexOf(chipValue) !== -1;
          var shouldShow = queryMatch && chipMatch;

          card.style.display = shouldShow ? "" : "none";
          if (shouldShow) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      if (input) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        if (query) {
          input.value = query;
        }

        input.addEventListener("input", apply);
      }

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          activeValue = chip.getAttribute("data-filter-value") || "";
          chips.forEach(function (item) {
            item.classList.toggle("is-active", item === chip);
          });
          apply();
        });
      });

      apply();
    });
  }

  window.initMoviePlayer = function (videoId, overlayId, sourceUrl) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    var hls = null;
    var loaded = false;

    if (!video || !sourceUrl) {
      return;
    }

    function setOverlayHidden(hidden) {
      if (overlay) {
        overlay.classList.toggle("is-hidden", hidden);
      }
    }

    function attach() {
      if (loaded) {
        return Promise.resolve();
      }

      loaded = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        return new Promise(function (resolve) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(sourceUrl);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            resolve();
          });
          hls.on(window.Hls.Events.ERROR, function () {
            resolve();
          });
        });
      }

      video.src = sourceUrl;
      return Promise.resolve();
    }

    function start() {
      setOverlayHidden(true);
      attach().then(function () {
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            setOverlayHidden(false);
          });
        }
      });
    }

    if (overlay) {
      overlay.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      } else {
        video.pause();
      }
    });

    video.addEventListener("play", function () {
      setOverlayHidden(true);
    });

    video.addEventListener("pause", function () {
      if (!video.ended) {
        setOverlayHidden(false);
      }
    });

    video.addEventListener("ended", function () {
      setOverlayHidden(false);
    });

    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenu();
    setupHeaderSearch();
    setupHero();
    setupFiltering();
  });
})();
