(function () {
    var menuToggle = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    document.querySelectorAll("[data-nav-search]").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            var input = form.querySelector("input[name='q']");
            if (input && input.value.trim()) {
                event.preventDefault();
                window.location.href = "./search.html?q=" + encodeURIComponent(input.value.trim());
            }
        });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

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

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                showSlide(current + 1);
                restart();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
                restart();
            });
        });

        showSlide(0);
        restart();
    }

    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
        var input = scope.querySelector("[data-filter-input]");
        var year = scope.querySelector("[data-year-filter]");
        var type = scope.querySelector("[data-type-filter]");
        var category = scope.querySelector("[data-category-filter]");
        var list = scope.parentElement.querySelector("[data-card-list]");
        var cards = list ? Array.prototype.slice.call(list.querySelectorAll("[data-movie-card]")) : [];
        var count = scope.querySelector("[data-filter-count]");
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q") || "";

        if (input && initialQuery) {
            input.value = initialQuery;
        }

        function includesValue(source, target) {
            return !target || String(source || "").toLowerCase().indexOf(target.toLowerCase()) !== -1;
        }

        function applyFilter() {
            var query = input ? input.value.trim().toLowerCase() : "";
            var yearValue = year ? year.value : "";
            var typeValue = type ? type.value : "";
            var categoryValue = category ? category.value : "";
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = [
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.year,
                    card.dataset.type,
                    card.dataset.category,
                    card.dataset.keywords
                ].join(" ").toLowerCase();
                var ok = true;

                ok = ok && (!query || haystack.indexOf(query) !== -1);
                ok = ok && includesValue(card.dataset.year, yearValue);
                ok = ok && includesValue(card.dataset.type, typeValue);
                ok = ok && includesValue(card.dataset.category, categoryValue);

                card.classList.toggle("is-hidden", !ok);
                if (ok) {
                    visible += 1;
                }
            });

            if (count) {
                count.textContent = visible ? "找到 " + visible + " 部" : "暂无匹配";
            }
        }

        [input, year, type, category].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilter);
                control.addEventListener("change", applyFilter);
            }
        });

        applyFilter();
    });
})();
