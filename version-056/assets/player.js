(function () {
  function initializePlayer(box) {
    var video = box.querySelector('video');
    var cover = box.querySelector('.player-cover');
    var source = box.getAttribute('data-video') || '';
    var ready = false;

    function attach() {
      if (ready || !video || !source) {
        return;
      }
      ready = true;
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function play() {
      attach();
      if (cover) {
        cover.classList.add('is-hidden');
      }
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {
          video.controls = true;
        });
      }
    }

    if (cover) {
      cover.addEventListener('click', play);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        if (cover) {
          cover.classList.add('is-hidden');
        }
      });
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('.player-box')).forEach(initializePlayer);
})();
