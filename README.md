# object-observer
## Install
```
bower install object-observer --save
```
## How To
```
    /**
     * object observer for all properties
     *
     * @param {Object} object
     * @param {Object} options ... can have async = true || async = false. If true, response values of event callbacks will be ignored
     *
     * @event {void} get({ObjectOfObservation}, {PropertyName}, value) fires if some whants to get the value
     * @event {void} get[:PropertyName]({ObjectOfObservation}, {PropertyName}, value) fires if some whants to get the value
     * @event {*} get:before({ObjectOfObservation}, {PropertyName}) fires before if some wants to get the value. if callback returns a value other then undefined, this value will be retruned from get. only for ASYNC = FALSE
     * @event {*} get:before[:PropertyName]({ObjectOfObservation}, {PropertyName}) fires before if some wants to get the value. if callback returns a value other then undefined, this value will be retruned from get only for ASYNC = FALSE
     * @event {void} get:after({ObjectOfObservation}, {PropertyName}, value) fires after if some wants to get the value.
     * @event {void} get:after[:PropertyName]({ObjectOfObservation}, {PropertyName}, value) fires after if some wants to get the value.
     *
     * @event {void} set({ObjectOfObservation}, {PropertyName}, newValue, oldValue) fires if some whants to set the value
     * @event {void} set[:PropertyName]({ObjectOfObservation}, {PropertyName}, newValue, oldValue) fires if some whants to set the value
     * @event {boolean} set:before({ObjectOfObservation}, {PropertyName}, newValue, oldValue) fires before if some wants to set the value. if callback returns FALSE the value will not be setted only for ASYNC = FALSE
     * @event {boolean} set:before[:PropertyName]({ObjectOfObservation}, {PropertyName}, newValue, oldValue) fires before if some wants to set the value. if callback returns FALSE the value will not be setted only for ASYNC = FALSE
     * @event {void} set:after({ObjectOfObservation}, {PropertyName}, newValue, oldValue) fires after if some wants to set the value.
     * @event {void} set:after[:PropertyName]({ObjectOfObservation}, {PropertyName}, newValue, oldValue) fires after if some wants to set the value.
     *
     * @example
     * <code>
     *        var subject =
     *        {
	 * 			x: 10,
	 * 			y: function(a, b, c)
	 * 			{
	 * 				console.log('nuff', a, b, c);
	 * 			}
	 * 		};
     *
     *        var observer = new ObjectObserver(subject,
     *        {
	 * 			on:
	 * 			{
	 * 				'get': function(event, object, propertyName, value, a, b, c)
	 * 				{
	 * 					console.log('object: get', event, object, propertyName, value, a, b, c);
	 * 				},
	 * 				'get:x': function(event, object, propertyName, value)
	 * 				{
	 * 					console.log('object: get', event, object, propertyName, value);
	 * 				},
	 * 				'get:y': function(event, object, propertyName, value, a, b, c)
	 * 				{
	 * 					console.log('object: get', event, object, propertyName, value, a, b, c);
	 * 				},
	 * 				'get:before': function(event, object, propertyName, a, b, c)
	 * 				{
	 * 					console.log('object: get:before', event, object, propertyName, a, b, c);
	 * 				},
	 * 				'get:before:x': function(event, object, propertyName)
	 * 				{
	 * 					console.log('object: get:before', event, object, propertyName);
	 * 				},
	 * 				'get:before:y': function(event, object, propertyName, a, b, c)
	 * 				{
	 * 					console.log('object: get:before', event, object, propertyName, a, b, c);
	 * 				},
	 * 				'get:after': function(event, object, propertyName, value, a, b, c)
	 * 				{
	 * 					console.log('object: get:after', event, object, propertyName, value, a, b, c);
	 * 				},
	 * 				'get:after:x': function(event, object, propertyName, value)
	 * 				{
	 * 					console.log('object: get:after', event, object, propertyName, value);
	 * 				},
	 * 				'get:after:y': function(event, object, propertyName, value, a, b, c)
	 * 				{
	 * 					console.log('object: get:after', event, object, propertyName, value, a, b, c);
	 * 				},
	 * 				'set': function(event, object, propertyName, newValue)
	 * 				{
	 * 					console.log('object: set', event, object, propertyName, newValue);
	 * 				},
	 * 				'set:x': function(event, object, propertyName, newValue)
	 * 				{
	 * 					console.log('object: set', event, object, propertyName, newValue);
	 * 				},
	 * 				'set:before': function(event, object, propertyName, newValue)
	 * 				{
	 * 					console.log('object: set:before', event, object, propertyName, newValue);
	 * 				},
	 * 				'set:before:x': function(event, object, propertyName, newValue)
	 * 				{
	 * 					console.log('object: set:before', event, object, propertyName, newValue);
	 * 				},
	 * 				'set:after': function(event, object, propertyName, newValue)
	 * 				{
	 * 					console.log('object: set:after', event, object, propertyName, newValue);
	 * 				},
	 * 				'set:after:x': function(event, object, propertyName, newValue)
	 * 				{
	 * 					console.log('object: set:after', event, object, propertyName, newValue);
	 * 				}
	 * 			}
	 * 		});
     *
     *        subject.x = 10;
     *        var x = subject.x;
     *        subject.y('a', 'b', 'c');
     *
     *        observer.unobserve();
     *        subject.x = 51;
     *
     *        // outputs on console
     *        //
     *        // object: set:before Object {x: (...), y: function} x 10
     *        // object: set:before Object {x: (...), y: function} x 10
     *        // object: set Object {x: (...), y: function} x 10
     *        // object: set Object {x: (...), y: function} x 10
     *        // object: set:after Object {x: (...), y: function} x 10
     *        // object: set:after Object {x: (...), y: function} x 10
     *        // object: get:before Object {x: (...), y: function} x
     *        // object: get:before Object {x: (...), y: function} x undefined undefined undefined
     *        // object: get Object {x: (...), y: function} x 10
     *        // object: get Object {x: (...), y: function} x 10 undefined undefined undefined
     *        // object: get:after Object {x: (...), y: function} x 10
     *        // object: get:after Object {x: (...), y: function} x 10 undefined undefined undefined
     *        // object: get:before Object {x: (...), y: function} y a b c
     *        // object: get:before Object {x: (...), y: function} y a b c
     *        // nuff a b c
     *        // object: get Object {x: (...), y: function} y undefined a b c
     *        // object: get Object {x: (...), y: function} y undefined a b c
     *        // object: get:after Object {x: (...), y: function} y undefined a b c
     *        // object: get:after Object {x: (...), y: function} y undefined a b c
     * </code>
     */
```
