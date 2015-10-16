
(function(global, $){

    var availableKeys = {

        enter:       13,

        ctrl:        17,

        alt:         18,

        shift:       16,

        tab:         9,

        escape:      27,

        caps_lock:   20,

        left_arrow:  37,

        up_arrow:    38,

        right_arrow: 39,

        down_arrow:  40
    };

    var mediaQueries = {
        mobile: '(max-width : 479px)',
        tablet: '(min-width : 480px) and (max-width : 1023px)',
        desktop:'(min-width : 1024px)'
    }


    var xcript = function(selector){
        return new xcript.init(selector);
    };

    xcript.prototype = {

        //Add a class if doesn't exist
        addClassIfNot: function(className){
            if(!this.selector.hasClass(className)){
                this.selector.addClass(className);
            }

            return this;
        },

        //Remove a class if exist
        removeClassIfExist: function(className){
            if(this.selector.hasClass(className)){
                this.selector.removeClass(className);
            }

            return this;
        },

        //Remove a class and add a new one
        removeClassAddClass: function(first, second){
            this.selector.removeClass(first).addClass(second);

            return this;
        },

        //Check if element exist in the page
        ifExist: function(){
            return this.selector.length !== 0;
        },

        //Do event with prevent default action
        onPrevent: function(event, callback){
            this.selector.on(event, function(e){

                e.preventDefault();
                e.stopImmediatePropagation();

                if(callback){
                    return callback();
                }
            });
        },

        //Scroll to element
        scrollTo: function(difference){

            var minus = difference || 0,
                $this = this.selector;

            $this.queue(function(){

                $('html, body').animate({
                    scrollTop: $this.offset().top - minus
                }, 500);

                $(this).dequeue();

            });
        },

        //Slide fade toggle
        slideFadeToggle: function(speed, easing, callback) {

            $this = this.selector;

            $this.queue(function() {

                $this.animate({
                    opacity: 'toggle',
                    height: 'toggle'
                }, speed, easing, callback);

                $(this).dequeue();
            });

        },

        //Disable scroll outside the hover element
        disableScrollOutside: function(){
            this.selector.on( 'mousewheel DOMMouseScroll', function (e) {
                var x = e.originalEvent,
                    delta = x.wheelDelta || -x.detail;

                this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
                e.preventDefault();
            });
        },

        //Render a string date to local date
        renderDateToLocal: function(date){
            var newDate = new Date(date);

            var offset = new Date().getTimezoneOffset(),
                minutes = Math.abs(offset),
                hours = Math.floor(minutes / 60),
                prefix = offset < 0 ? "-" : "+";

            // Check if timezone offset is -/+
            prefix === "-" ? newDate.setHours(newDate.getHours() + hours) : newDate.setHours(newDate.getHours() - hours);

            var dates = {
                month:   newDate.getMonth()   < 10 ? '0'+ (newDate.getMonth() + 1) : newDate.getMonth() + 1,
                day:     newDate.getDate()    < 10 ? '0'+ newDate.getDate()        : newDate.getDate(),
                hours:   newDate.getHours()   < 10 ? '0'+ newDate.getHours()       : newDate.getHours(),
                minutes: newDate.getMinutes() < 10 ? '0'+ newDate.getMinutes()     : newDate.getMinutes(),
                seconds: newDate.getSeconds() < 10 ? '0'+ newDate.getSeconds()     : newDate.getSeconds()
            };

            return this.selector.html(dates.month + "/" + dates.day + "/" + newDate.getFullYear() + ' ' + dates.hours + ':' + dates.minutes + ':' + dates.seconds);
        },

        //Read a file upload and return file data
        //Support >= IE10
        fileUpload: function(input, callback, size){
            if (input.files && input.files[0]) {

                var file = input.files[0];

                if(size && file > (1048576 * size)) {
                    return false;
                }

                var reader = new FileReader();
                reader.onload = function (e) {
                    callback(e.target);
                };
                reader.readAsDataURL(file);
            }
        },

        //Prepend to input a string
        prependToInput: function(stringValue){
            $('body').on({
                'focus input': function(){
                    var _this = $(this);
                    if(_this.val().indexOf(stringValue) == -1){
                        _this.val(function(index, val){
                            return val == stringValue ? stringValue + val : stringValue;
                        })
                    }
                },
                'blur': function(){
                    var _this = $(this);
                    if(_this.val() === stringValue){
                        _this.val("");
                    }
                }
            }, this.selector);
        },

        //Make element square
        //If width is pass, the element will get the height equals with the width and vice versa
        //If element is pass, the element will take from that the proper width or height (in this situation the width and height can be true or false)
        makeSquareElement: function(width, height, element){

            var $width  = width  || '',
                $height = height || '';

            if($width){
                this.selector.height(function(){
                    return element ? element.width() : $width;
                });
            }

            if($height){
                this.selector.width(function(){
                    return element ? element.height() : $height;
                });
            }

            return this;

        },

        //Get event when pressing a keyboard key
        onKeyPress: function(event, key, callback, prevent){

            if(availableKeys.hasOwnProperty(key)){
                this.selector.on(event, function(e){

                    if(prevent){
                        e.preventDefault();
                    }

                    if(e.keyCode === availableKeys[key]){
                        if(callback){
                            callback();
                        }
                    }
                });
            }
        },

        //Limit a string to given chars limit
        limitChars: function(limit, start){
            var text = this.selector.text();

            if(text.length > limit){
                this.selector.html(text.substring((start ? start : 0), limit));
            }

            return this;
        },

        //Loader toggle
        //x(loader selector) - (this can be cached inside a variable and call loaderToggle on that variable).loaderToggle(type)
        loaderToggle: function(type){

            if(type === 'show'){
                this.selector.show();
            }

            if(type === 'hide'){
                this.selector.hide();
            }

            if(type === 'remove'){
                this.selector.remove();
            }
        }

    };

    //Set Modernizr's media queries
    xcript.modernizr = function(mobile, tablet, desktop){
        if(Modernizr){

            global.screenType = '';

            if (Modernizr.mq(mediaQueries.mobile) && global.screenType != 'mobile') {
                global.screenType = 'mobile';

                if(mobile){
                    mobile();
                }

            } else if (Modernizr.mq(mediaQueries.tablet) && global.screenType != 'tablet') {
                global.screenType = 'tablet';

                if(tablet){
                    tablet();
                }

            } else if (!Modernizr.mq(mediaQueries.mobile) && !Modernizr.mq(mediaQueries.tablet) && global.screenType != 'desktop') {
                global.screenType = 'desktop';

                if(desktop){
                    desktop();
                }
            }
        }
    };

    //Format a given number or string in a correct number(with optional prefix)
    xcript.formatNumber = function(num, prefix){

        num += '';

        var $prefix = prefix || '',

            splitStr = num.split('.'),

            splitLeft = splitStr[0],

            splitRight = splitStr.length > 1 ? '.' + splitStr[1] : '',

            regx = /(\d+)(\d{3})/;

        while (regx.test(splitLeft)) {
            splitLeft = splitLeft.replace(regx, '$1' + ',' + '$2');
        }

        return $prefix + splitLeft + splitRight;
    };


    //Ensure element is visible / Check that a given task is complete
    xcript.poll = function(fn, timeout, interval) {

        var dfd = new Deferred(),

            endTime = Number(new Date()) + (timeout || 2000),

            $interval = interval || 100;

        (function p() {
            // If the condition is met, we're done!
            if(fn()) {
                dfd.resolve();
            }
            // If the condition isn't met but the timeout hasn't elapsed, go again
            else if (Number(new Date()) < endTime) {
                setTimeout(p, $interval);
            }
            // Didn't match and too much time, reject!
            else {
                dfd.reject(new Error('timed out for ' + fn + ': ' + arguments));
            }
        })();

        return dfd.promise;
    };

    //Get absolute URL
    xcript.getAbsoluteUrl = (function(){

        var a;

        return function(url) {
            if(!a) a = document.createElement('a');
            a.href = url;

            return a.href;
        };
    }());

    //Return a random float or integer number between given values
    xcript.rand = function(min, max, integer){

        var r = Math.random() * (max - min) + min;

        return integer ? r|0 : r;
    };

    //Fire a function once
    xcript.once = function(fn, context){

        var result;

        return function() {
            if(fn) {
                result = fn.apply(context || this, arguments);
                fn = null;
            }

            return result;
        };
    };

    //Get a parameter from url
    xcript.getURLParameter = function(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');

        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    };

    //Debounce an event with a specific time set in milliseconds
    xcript.debounce = function(func, wait){

        var timeout, args, context, timestamp;

        return function() {

            // save details of latest call
            context = this;
            args = [].slice.call(arguments, 0);
            timestamp = new Date();

            // this is where the magic happens
            var later = function() {

                // how long ago was the last call
                var last = (new Date()) - timestamp;

                // if the latest call was less that the wait period ago
                // then we reset the timeout to wait for the difference
                if (last < wait) {
                    timeout = setTimeout(later, wait - last);
                } else { // or if not we can null out the timer and run the latest
                    timeout = null;
                    func.apply(context, args);
                }
            };

            // we only need to set the timer now if one isn't already running
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
        }
    };

    //Push to array
    xcript.pushTo = function(oldArr){
        var arr = [];

        $.each(oldArr, function(index, value) {
            arr.push(value);
        });

        return arr;
    };

    //Mutate each value from array(optional) and push to new array
    xcript.mapToArray = function(arr, fn){

        var newArr = [];

        for(var i = 0; i < arr.length; i++){
            newArr.push(
                fn(arr[i])
            )
        }

        return newArr;
    };

    //Normal ajax call
    xcript.ajax = function(url, method, type, data){
        return $.ajax({
            url: url,
            method: method,
            type: type,
            data: data
        });
    };

    xcript.init = function(selector){
        this.selector = $(selector);
    };

    xcript.init.prototype = xcript.prototype;

    //Save to global object xcript
    global.xcript = global.x = xcript;

}(window, $));