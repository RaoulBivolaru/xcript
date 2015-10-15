f

(function(global, $){

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

            var minus = difference || 50,
                $this = this.selector;

            $this.queue(function(){

                $('html, body').animate({
                    scrollTop: $this.offset().top - minus
                }, 500);

                $(this).dequeue();

            });
        },

        //SlideFadeToggle
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
        // Support >= IE10
        fileUpload: function(input, callback){
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    callback(e.target);
                };
                reader.readAsDataURL(input.files[0]);
            }
        },

        //prepend to input a string
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
        }

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

    //Debounce
    xcript.debounce = function(func, wait, immediate){

        var timeout;

        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    //Filter by Class name
    xcript.pushTo = function(arr, oldArr){
        $.each(oldArr, function(index, value) {
            arr.push(value);
        });

        return arr;
    };

    //Mutate each value from array and push to new array
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
    },

    xcript.init = function(selector){
        this.selector = $(selector);
    };

    xcript.init.prototype = xcript.prototype;


    //Save to global object xcript
    global.xcript = global.x = xcript;

}(window, $));