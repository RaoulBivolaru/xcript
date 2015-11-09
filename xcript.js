//xcript.js @Raoul Bivolaru
(function(global, $){

    if(!$){
        return false;
    }

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
    };

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

        toggleClassOnHover:function(className){

            var _this = this.selector;

            _this.hover(function(){
                _this.addClass(className);
            }, function(){
                _this.removeClass(className);
            });
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
        scrollToElement: function(difference){

            var
                minus = difference || 0,

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
            this.selector.on('mousewheel DOMMouseScroll', function (e) {
                var x = e.originalEvent,
                    delta = x.wheelDelta || -x.detail;

                this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
                e.preventDefault();
            });
        },

        //Render a string date to local date
        renderDateToLocal: function(){
            var newDate = new Date(this.selector.text());

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
        fileUpload: function(callback, size){

            this.selector.on('change', function(){
                if (this.files && this.files[0]) {

                    var file = this.files[0];

                    if(size && file.size > (1048576 * size)) {
                        return false;
                    }

                    var reader = new FileReader();
                    reader.onload = function (e) {
                        callback(e.target);
                    };
                    reader.readAsDataURL(file);
                }
            });

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

        //Change width or height for an element by passing the width/height or an element
        changeWidthOrHeight: function(width, height, element){

            var
                $width  = width  || '',

                $height = height || '',

                $element = $(element) || '';

            if($width || $element){
                this.selector.width(function(){
                    return $width ? $width : $element.width();
                });
            }

            if($height || $element){
                this.selector.height(function(){
                    return $height ? $height : $element.height();
                });
            }

            return this;

        },

        //Set same size to array of elements(width or height, after the biggest one)
        setSameSize: function(item, height){

            var
                afterHeight = height || false,

                elements = this.selector.find(item),

                max = Math.max.apply(null, elements.map(function(){

                    var _this = $(this);

                    return afterHeight ? _this.height() : _this.width();
                }).get());

            if(afterHeight){
                elements.height(max);
            }else{
                elements.width(max);
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

        //Clear a file input after event
        clearFileInput: function(){
            this.selector.replaceWith(this.selector.val('').clone(true));
        },

        //Get an Image native width and height
        getNativeImage: function(){

            var theImage = new Image();
            theImage.src = this.selector.attr('src');

            return {
                width: theImage.width,
                height: theImage.height
            }
        },

        //Loader toggle
        loader: function(type, settings){

            var
                _this = this.selector,

                $settings = settings || {},

                Loader = function(){
                    this.src          = $settings.hasOwnProperty('src') ? $settings.src : '';
                    this.wrapperClass = $settings.wrapper || 'x-loader-wrapper';
                    this.imageClass   = $settings.image || 'x-loader';
                };

            Loader.prototype = {
                show: function(){
                    _this.append('<div class="'+ this.wrapperClass +'"><img src="'+ this.src +'" alt="" class="'+ this.imageClass +'"></div>')
                },
                hide: function(){
                    _this.find('.' + this.wrapperClass).fadeOut().remove();
                },
                enable: function(){
                    _this.removeAttr('disabled').removeClass('disabled');
                },
                disable: function(){
                    _this.attr('disabled', 'disabled').addClass('disabled');
                },
                hideAll: function(){
                    $('.' + this.wrapperClass).fadeOut().remove();
                }
            };

            var loaderInit =  new Loader();

            return loaderInit[type]();
        },

        //Function to calculate distance between element and mouse
        calculateDistance: function(mouseX, mouseY){

            var _this = this.selector;

            return Math.floor(Math.sqrt(
                Math.pow(mouseX - (_this.offset().left+(_this.width()/2)), 2) +
                Math.pow(mouseY - (_this.offset().top+(_this.height()/2)), 2)
            ));
        }

    };


    //Get event when pressing a keyboard key
    xcript.onKeyPress = function(event, key, callback, prevent){

        if(availableKeys.hasOwnProperty(key)){
            $(global).on(event, function(e){

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
    };

    //Get Internet Explorer version
    xcript.getIEVersion = function(){

        var navigator = global.navigator.userAgent.toLowerCase();

        return (navigator.indexOf('msie') != -1) ? parseInt(navigator.split('msie')[1]) : false;
    };

    //Get sum from array
    xcript.getSum = function(arr){
        return arr.reduce(function(pv, cv) { return pv + cv; }, 0);
    };

    //Set Modernizr's media queries
    xcript.modernizr = function(mobile, tablet, desktop){
        if(global.Modernizr){

            global.screenType = '';

            var modernizrInit = function(){
                if (global.Modernizr.mq(mediaQueries.mobile) && global.screenType != 'mobile') {
                    global.screenType = 'mobile';

                    if(mobile){
                        mobile();
                    }

                } else if (global.Modernizr.mq(mediaQueries.tablet) && global.screenType != 'tablet') {
                    global.screenType = 'tablet';

                    if(tablet){
                        tablet();
                    }

                } else if (!global.Modernizr.mq(mediaQueries.mobile) && !global.Modernizr.mq(mediaQueries.tablet) && global.screenType != 'desktop') {
                    global.screenType = 'desktop';

                    if(desktop){
                        desktop();
                    }
                }
            };

            modernizrInit();

            x.debounce(
                $(global).on('resize', function(){
                    modernizrInit();
                }), 100
            )
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


    //Check that a given task is complete
    xcript.poll = function(fn, timeout, interval) {

        var dfd = new $.Deferred(),

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

    //Remove duplicate values from an array
    xcript.removeDuplicates = function(arr){

        var i = 0,
            arrLength = arr.length;

        while (i < arrLength) {
            var current = arr[i];

            for (k = arrLength; k > i; k--) {
                if (arr[k] === current) {
                    arr.splice(k,1);
                }
            }
            i++;
        }
        return arr;
    };

    //Create html tags like select ul li
    //Usage: x.createMenu([array of items], ['select', 'option'])
    xcript.createMenu = function(items, tags){

        var $tags = tags || ['ul', 'li']; // default tags

        var parent = $tags[0],
            child = $tags[1],
            item, value;

        for (var i = 0, l = items.length; i < l; i++) {
            item = items[i];
            // Separate item and value if value is present
            if (/:/.test(item)) {
                item = items[i].split(':')[0];
                value = items[i].split(':')[1];
            }
            // Wrap the item in tag
            items[i] = '<'+ child +' '+
            (value && 'value="'+value+'"') +'>'+ // add value if present
            item +'</'+ child +'>';
        }

        return '<'+ parent +'>'+ items.join('') +'</'+ parent +'>';
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

    //Save xcript to global object
    global.xcript = global.x = xcript;

}(window, $));