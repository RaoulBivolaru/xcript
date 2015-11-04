## Synopsis

Set of common javascript functions

## Change classes for an element

- Example

```
x('element').addClassIfNot('className');
```

You can also use: removeClassIfExist, removeClassAddClass, toggleClassOnHover

## Check if element exist

```
x('element').ifExist();
```

## Prevent default action on event

```
x('element').onPrevent('click', function(){
    //do stuff
});
```

##Scroll to an element

```
x('element').scrollToElement(difference);
```

You can set an optional parameter(difference) that can set the new position of scroll - difference

##Slide fade toggle

```
x('element').slideFadeToggle(speed, easing, callback);
```

You can user the custom parameters to set the speed of the animation, the animation type(default is swing or you can set it to linear)
and callback if you want to do something after the animation is finished

## Disable scroll outside the mouse position

```
x('element').disableScrollOutside();
```

Using this you can disable the scroll outside a scrolling element

## Render a string date to local your local time

```
<p class="date">12/23/2015 05:24 AM</p>

x('.date').disableScrollOutside();
```

This will replace the current date with the new local one

## File upload

```
x('element').fileUpload(function(file){
    //file object
},size);
```

You can set the size limit for the file(optional)
**This is not supported for Internet Explorer < 10**

## Prepend to an input a default value

```
$('element').prependToInput(string);
```

On blur the string is going to be removed if the input only have that string value

## Change width or height

```
x('element').changeWidthOrHeight(width, height, otherElement);
```

Set an element's width/height by passing the values or use otherElement parameter to get from that element the width/height
Also you can combine the parameters like this:

```
x('element').changeWidthOrHeight(null, height, otherElement);
```

In this way, the height is going to be set and the width is going to be set by the otherElement

## Set same size (make square elements)

```
<div class="parent">
    <div class="item">1</div>
    <div class="item">2</div>
</div>

x('.parent').setSameSize('.item', height);
```

If the 2 items from parent class have different dimensions(width, height), you can use this function to set the same size for all elements by using the biggest
width/height from elements.

If height is set to true, the biggest height is going to be use. If not, the width is going to be use.

## Limit characters in string

```
x('element').limitChars(limit, start);
```

limit - set the max characters that should be visible
start - set the start(from where the split should start). This is optional

## Loader

```
x('element').loader('show',{src:'image.jpg'});
```

The above code will append an image with the given src to the element(src option is mandatory when using show).
Also, the image will be wrapped inside a div with the class 'x-loader-wrapper' and the image will have a class 'x-image'
You can overwrite this classes by changing the wrapperClass and imageClass options

Beside this you can also use hide, disable, enable, hideAll (those functions don't need any options);

## On key press event

```
x.onKeyPress('event', 'enter', callback, preventDefault);
```

This can be use when you want to get the event when pressing a keyboard key.

For example:

```
x.onKeyPress('keyup', 'tab', function(){

    //do stuff when tab key is pressed

}, true);
```

You can set preventDefault to true or false if you want to prevent the default value when the key is pressed.

## Get Internet Explorer version

```
x.getIEVersion();
```

This will return the internet explorer version or false if the browser is not IE.

## Get sum from all value from an array

```
x.getSum(array);
```

## Calculate the distance from the mouse cursor and element

```
$(document).on('mousemove', function(e){
    var position = x('element').calculateDistance(e.pageX, e.pageY);
});
```

## Set modernizr for desktop/table/mobile

```
x.modernizr(
    function(){
        //do stuff on mobile
    },
    function(){
        //do stuff on tablet
    },
    function(){
        //do stuff on desktop
    }
);
```

Is not mandatory to set all the breakpoints. You can also have something like this:

```
x.modernizr(null,
    function(){
        //do stuff on tablet
    }, null);
}
```

## Format a given number

```
x.formatNumber(2841294124, '$')
```

This will return $2,841,294,124;

## Get absolute url from a relative one

```
x.getAbsoluteUrl('url');
```

## Get a random number from an interval

```
x.rand(min, max, integer)
```

If integer is set to true, the return number will be an integer. If not, the number can be float or integer

## Call a function only once

```
x.once(function(){
   //do stuff once
}, context);
```

You can also change the context by setting it to a different this(optional);

## Get a parameter from url

```
x.getURLParameter(param);
```

## Debounce

```
x.debounce(function(){
    //do stuff
}, wait);
```

## Map to array

```
x.mapToArray([2,4,5,7,5,3], function(item){
    return item * 2;
});
```

This will return a new array and each value will be multiplied by 2.

## Remove duplicates from array

```
x.removeDuplicates(arr);
```

## Ajax call object

```
x.ajax(url, method, type, data)
.done(function(response){
    //do stuff
})
.error(function(error){
    //do stuff
})
```

## License

A short snippet describing the license (MIT, Apache, etc.)