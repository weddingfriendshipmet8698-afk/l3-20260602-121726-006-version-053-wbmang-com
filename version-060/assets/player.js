(function () {
    function mountMoviePlayer(options) {
        var video = document.querySelector(options.videoSelector);
        var cover = document.querySelector(options.coverSelector);
        var button = document.querySelector(options.buttonSelector);
        var source = options.source;
        var hls = null;
        var attached = false;

        if (!video || !source) {
            return;
        }

        function attachSource() {
            if (attached) {
                return;
            }

            attached = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                return;
            }

            if (window.Hls && window.Hls.isSupported && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 60
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                return;
            }

            video.src = source;
        }

        function hideCover() {
            if (cover) {
                cover.classList.add("is-hidden");
            }
            video.setAttribute("controls", "controls");
        }

        function startPlayback() {
            attachSource();
            hideCover();

            var playAttempt = video.play();
            if (playAttempt && playAttempt.catch) {
                playAttempt.catch(function () {
                    video.muted = true;
                    video.play().catch(function () {});
                });
            }
        }

        if (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                startPlayback();
            });
        }

        if (cover) {
            cover.addEventListener("click", function (event) {
                event.preventDefault();
                startPlayback();
            });
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                startPlayback();
            }
        });

        video.addEventListener("play", hideCover);

        window.addEventListener("pagehide", function () {
            if (hls && hls.destroy) {
                hls.destroy();
            }
        });
    }

    window.mountMoviePlayer = mountMoviePlayer;
})();
