# object-observer
## General
This class provides an easy and simple way to get event handling for property changes of any object.
For a given object will be following events fired

- {void} get({ObjectOfObservation}, {PropertyName}, value) fires if some whants to get the value
- {void} get[:PropertyName]({ObjectOfObservation}, {PropertyName}, value) fires if some whants to get the value
- {*} get:before({ObjectOfObservation}, {PropertyName}) fires before if some wants to get the value. if callback returns a value other then undefined, this value will be retruned from get. only for ASYNC = FALSE
- {*} get:before[:PropertyName]({ObjectOfObservation}, {PropertyName}) fires before if some wants to get the value. if callback returns a value other then undefined, this value will be retruned from get only for ASYNC = FALSE
- {void} get:after({ObjectOfObservation}, {PropertyName}, value) fires after if some wants to get the value.
- {void} get:after[:PropertyName]({ObjectOfObservation}, {PropertyName}, value) fires after if some wants to get the value.
- {void} set({ObjectOfObservation}, {PropertyName}, newValue, oldValue) fires if some whants to set the value
- {void} set[:PropertyName]({ObjectOfObservation}, {PropertyName}, newValue, oldValue) fires if some whants to set the value
- {boolean} set:before({ObjectOfObservation}, {PropertyName}, newValue, oldValue) fires before if some wants to set the value. if callback returns FALSE the value will not be setted only for ASYNC = FALSE
- {boolean} set:before[:PropertyName]({ObjectOfObservation}, {PropertyName}, newValue, oldValue) fires before if some wants to set the value. if callback returns FALSE the value will not be setted only for ASYNC = FALSE
- {void} set:after({ObjectOfObservation}, {PropertyName}, newValue, oldValue) fires after if some wants to set the value.
- {void} set:after[:PropertyName]({ObjectOfObservation}, {PropertyName}, newValue, oldValue) fires after if some wants to set the value.

**Note:** Only the properties at then moment of creation the observer can be observed. If you add new properties after creation, no observation for these properties are available.

## Install
```
bower install object-observer --save
npm install js-object-observer --save
```

## Options
The ObjectObserver has some options in the seconds argument:
- on: defines a object with listeners. The key is the event and the value is the listener function
- once: defines a object with listeners which will be only fired once. The key is the event and the value is the listener function
- async: defines the event handling as async or sync, if the the event occurs. Default: TRUE
- properties: defines a object of the properties in the object of observation, which should be observed. The key is the property name and the value is TRUE or FALSE. Is this property is not defined, every property will be observed. 
- autoObserve: If true, observe will be starts on construct. dwefault true

## Usage
```js
const subject = {
    x: 10,
    y: function (a, b, c) {
        console.log('nuff', a, b, c);
    }
};

var observer = new ObjectObserver(subject,
    {
        on: {
            'get': function (event, object, propertyName, value, a, b, c) {
                console.log('object: get', event, object, propertyName, value, a, b, c);
            },
            'get:x': function (event, object, propertyName, value) {
                console.log('object: get', event, object, propertyName, value);
            },
            'get:y': function (event, object, propertyName, value, a, b, c) {
                console.log('object: get', event, object, propertyName, value, a, b, c);
            },
            'get:before': function (event, object, propertyName, a, b, c) {
                console.log('object: get:before', event, object, propertyName, a, b, c);
            },
            'get:before:x': function (event, object, propertyName) {
                console.log('object: get:before', event, object, propertyName);
            },
            'get:before:y': function (event, object, propertyName, a, b, c) {
                console.log('object: get:before', event, object, propertyName, a, b, c);
            },
            'get:after': function (event, object, propertyName, value, a, b, c) {
                console.log('object: get:after', event, object, propertyName, value, a, b, c);
            },
            'get:after:x': function (event, object, propertyName, value) {
                console.log('object: get:after', event, object, propertyName, value);
            },
            'get:after:y': function (event, object, propertyName, value, a, b, c) {
                console.log('object: get:after', event, object, propertyName, value, a, b, c);
            },
            'set': function (event, object, propertyName, newValue) {
                console.log('object: set', event, object, propertyName, newValue);
            },
            'set:x': function (event, object, propertyName, newValue) {
                console.log('object: set', event, object, propertyName, newValue);
            },
            'set:before': function (event, object, propertyName, newValue) {
                console.log('object: set:before', event, object, propertyName, newValue);
            },
            'set:before:x': function (event, object, propertyName, newValue) {
                console.log('object: set:before', event, object, propertyName, newValue);
            },
            'set:after': function (event, object, propertyName, newValue) {
                console.log('object: set:after', event, object, propertyName, newValue);
            },
            'set:after:x': function (event, object, propertyName, newValue) {
                console.log('object: set:after', event, object, propertyName, newValue);
            }
        }
    });

subject.x = 10;
var x     = subject.x;
subject.y('a', 'b', 'c');

observer.unobserve();
subject.x = 51;

// outputs on console
//
// object: set:before Object {x: (...), y: function} x 10
// object: set:before Object {x: (...), y: function} x 10
// object: set Object {x: (...), y: function} x 10
// object: set Object {x: (...), y: function} x 10
// object: set:after Object {x: (...), y: function} x 10
// object: set:after Object {x: (...), y: function} x 10
// object: get:before Object {x: (...), y: function} x
// object: get:before Object {x: (...), y: function} x undefined undefined undefined
// object: get Object {x: (...), y: function} x 10
// object: get Object {x: (...), y: function} x 10 undefined undefined undefined
// object: get:after Object {x: (...), y: function} x 10
// object: get:after Object {x: (...), y: function} x 10 undefined undefined undefined
// object: get:before Object {x: (...), y: function} y a b c
// object: get:before Object {x: (...), y: function} y a b c
// nuff a b c
// object: get Object {x: (...), y: function} y undefined a b c
// object: get Object {x: (...), y: function} y undefined a b c
// object: get:after Object {x: (...), y: function} y undefined a b c
// object: get:after Object {x: (...), y: function} y undefined a b c
```
