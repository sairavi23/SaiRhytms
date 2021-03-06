(function($) {
    $.fn.jQCloud = function(word_array, options) {
        var $this = this;
        var container_id = $this.attr("id");
        var default_options = {
            width: $this.width(),
            height: $this.height(),
            center: {
                x: $this.width() / 2,
                y: $this.height() / 2
            },
            delayedMode: word_array.length > 50,
            randomClasses: 0
        };
        if (typeof options === "function") {
            options = {
                callback: options
            }
        }
        options = $.extend(default_options, options || {});
        $this.addClass("jqcloud");
        var drawWordCloud = function() {
            var hitTest = function(elem, other_elems) {
                var overlapping = function(a, b) {
                    if (Math.abs(2 * a.offsetLeft + a.offsetWidth - 2 * b.offsetLeft - b.offsetWidth) < a.offsetWidth + b.offsetWidth) {
                        if (Math.abs(2 * a.offsetTop + a.offsetHeight - 2 * b.offsetTop - b.offsetHeight) < a.offsetHeight + b.offsetHeight) {
                            return true
                        }
                    }
                    return false
                };
                var i = 0;
                for (i = 0; i < other_elems.length; i++) {
                    if (overlapping(elem, other_elems[i])) {
                        return true
                    }
                }
                return false
            };
            for (i = 0; i < word_array.length; i++) {
                word_array[i].weight = parseFloat(word_array[i].weight, 10)
            }
            word_array.sort(function(a, b) {
                if (a.weight < b.weight) {
                    return 1
                } else {
                    if (a.weight > b.weight) {
                        return -1
                    } else {
                        return 0
                    }
                }
            });
            var step = 2;
            var already_placed_words = [];
            var aspect_ratio = options.width / options.height;
            var drawOneWord = function(index, word) {
                var word_id = container_id + "_word_" + index;
                var word_selector = "#" + word_id;
                var random_class = (typeof options.randomClasses === "number" && options.randomClasses > 0) ? " r" + Math.ceil(Math.random() * options.randomClasses) : (($.isArray(options.randomClasses) && options.randomClasses.length > 0) ? " " + options.randomClasses[Math.floor(Math.random() * options.randomClasses.length)] : "");
                var angle = 6.28 * Math.random();
                var radius = 0;
                var weight = Math.round((word.weight - word_array[word_array.length - 1].weight) / (word_array[0].weight - word_array[word_array.length - 1].weight) * 9) + 1;
                var inner_html = word.url !== undefined ? "<a href='" + encodeURI(word.url).replace(/'/g, "%27") + "'>" + word.text + "</a>" : word.text;
                $this.append("<span id='" + word_id + "' class='w" + weight + random_class + "' title='" + (word.title || "") + "'>" + inner_html + "</span>");
                var word_span = $(word_selector, $this);
                var width = word_span.width();
                var height = word_span.height();
                var left = options.center.x - width / 2;
                var top = options.center.y - height / 2;
                var word_style = word_span[0].style;
                word_style.position = "absolute";
                word_style.left = left + "px";
                word_style.top = top + "px";
                while (hitTest(document.getElementById(word_id), already_placed_words)) {
                    radius += step;
                    angle += (index % 2 === 0 ? 1 : -1) * step;
                    left = options.center.x - (width / 2) + (radius * Math.cos(angle)) * aspect_ratio;
                    top = options.center.y + radius * Math.sin(angle) - (height / 2);
                    word_style.left = left + "px";
                    word_style.top = top + "px"
                }
                already_placed_words.push(document.getElementById(word_id))
            };
            var drawOneWordDelayed = function(index) {
                index = index || 0;
                if (index < word_array.length) {
                    drawOneWord(index, word_array[index]);
                    setTimeout(function() {
                        drawOneWordDelayed(index + 1)
                    }, 10)
                } else {
                    if (typeof options.callback === "function") {
                        options.callback.call(this)
                    }
                }
            };
            if (options.delayedMode || options.delayed_mode) {
                drawOneWordDelayed()
            } else {
                $.each(word_array, drawOneWord);
                if (typeof options.callback === "function") {
                    options.callback.call(this)
                }
            }
        };
        setTimeout(function() {
            drawWordCloud()
        }, 10);
        return this
    }
})(jQuery);

