'use strict';

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return factory();
        });

    } else if (typeof exports !== 'undefined') {
        exports.ObjectObserver = factory();

    } else {
        root.ObjectObserver = factory();
    }

}(this, function () {
    // Regular expression used to split event strings.
    var eventSplitter = /\s+/;

    /**
     * @param {Base} obj
     * @param {String} eventName
     * @param {Function} callback
     * @param {Object} context
     */
    function removeEventsByEventName(obj, eventName, callback, context) {
        var events;
        var event;
        var j;
        var k;

        events                = obj.events[eventName];
        obj.events[eventName] = [];
        if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
                event = events[j];
                if ((callback && callback !== event.callback && callback !== event.callback._callback) || (context && context !== event.context)) {
                    obj.events[eventName].push(event);
                }
            }
        }

        if (obj.events[eventName].length == 0) {
            delete obj.events[eventName];
        }
    }

    /**
     * base
     *
     * @param {Object} options
     *        every options will be copied to this instance
     *        magic options
     *            - on: bind every defined event to this instance.
     */
    function Base(options) {
        this.events = {};

        options = options || {};

        // bind events
        if (options.on !== undefined) {
            this.on(options.on);
            delete options.on;
        }

        // bind events
        if (options.once !== undefined) {
            this.once(options.once);
            delete options.once;
        }

        // copy options
        for (var optionName in options) {
            if (optionName === 'events') {
                continue;
            }
            this[optionName] = options[optionName];
        }
    }

    // prototyping
    Base.prototype = Object.create(Object.prototype, {
        /**
         * @var {Object}
         */
        events: {
            value: null,
            enumerable: false,
            configurable: false,
            writable: true
        }
    });

    /**
     * destroys the Base
     *
     * @returns {Base}
     */
    Base.prototype.destroy = function () {
        // remove all events
        this.off();

        return this;
    };

    /**
     *
     * @param {String} eventName
     * @param {Function} callback
     * @param {Object} context
     * @returns {Base}
     */
    Base.prototype.off = function (eventName, callback, context) {
        // remove all events
        if (eventName === undefined && callback === undefined && context === undefined) {
            for (key in this.events) {
                delete this.events[key];
            }
        }

        // removes all events by eventName
        else if (eventName !== undefined && callback === undefined && context === undefined) {
            if (this.events[eventName] !== undefined) {
                delete this.events[eventName];
            }
        }

        // loop over all events
        else if (eventName === undefined) {
            for (var key in this.events) {
                removeEventsByEventName(this, key, callback, context);
            }
        }

        // only one specific event with additional informations
        else if (this.events[eventName] !== undefined) {
            removeEventsByEventName(this, eventName, callback, context);
        }

        return this;
    };

    /**
     * creates one or more events
     *
     * @param {String}|{Object} eventName
     * @param {Function} callback
     * @param {Object} context
     * @returns {Base}
     */
    Base.prototype.on = function (eventName, callback, context) {
        // Handle event maps.
        if (typeof eventName === 'object') {
            for (var key in eventName) {
                this.on(key, eventName[key]);
            }

            return this;
        }

        // Handle space separated event names.
        if (eventSplitter.test(eventName) === true) {
            var eventNames = eventName.split(eventSplitter);
            for (var i = 0, l = eventNames.length; i < l; i++) {
                this.on(eventNames[i], callback, context);
            }
            return this;
        }

        // create new event entry
        if (this.events[eventName] === undefined) {
            this.events[eventName] = [];
        }

        // append the event
        this.events[eventName].push({
            callback: callback,
            context: context,
            ctx: context || undefined
        });

        return this;
    };

    /**
     * trigger
     *
     * @param {String} eventName
     * @param {*} ... additional n Parameters
     * @returns {*}
     */
    Base.prototype.trigger = function (eventName, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
        var events = this.events[eventName];
        if (events === undefined) {
            return undefined;
        }

        var i            = undefined;
        var lengthEvents = events.length;
        var result       = undefined;
        var event        = undefined;
        var eventResult  = undefined;

        var lengthParameters = arguments.length - 1;
        var parameters       = undefined;

        if (lengthParameters > 10) {
            parameters = new Array(lengthParameters);
            // this is faster then Array.prototype.slice.call
            for (i = 0; i < lengthParameters; i++) {
                parameters[i] = arguments[i + 1];
            }
        }

        i = -1;
        while (++i < lengthEvents) {
            event = events[i];

            if (lengthParameters === 0) {
                eventResult = event.callback.call(event.ctx);
            }
            else if (lengthParameters === 1) {
                eventResult = event.callback.call(event.ctx, param1);
            }
            else if (lengthParameters === 2) {
                eventResult = event.callback.call(event.ctx, param1, param2);
            }
            else if (lengthParameters === 3) {
                eventResult = event.callback.call(event.ctx, param1, param2, param3);
            }
            else if (lengthParameters === 4) {
                eventResult = event.callback.call(event.ctx, param1, param2, param3, param4);
            }
            else if (lengthParameters === 5) {
                eventResult = event.callback.call(event.ctx, param1, param2, param3, param4, param5);
            }
            else if (lengthParameters === 6) {
                eventResult = event.callback.call(event.ctx, param1, param2, param3, param4, param5, param6);
            }
            else if (lengthParameters === 7) {
                eventResult = event.callback.call(event.ctx, param1, param2, param3, param4, param5, param6, param7);
            }
            else if (lengthParameters === 8) {
                eventResult = event.callback.call(event.ctx, param1, param2, param3, param4, param5, param6, param7, param8);
            }
            else if (lengthParameters === 9) {
                eventResult = event.callback.call(event.ctx, param1, param2, param3, param4, param5, param6, param7, param8, param9);
            }
            else if (lengthParameters === 10) {
                eventResult = event.callback.call(event.ctx, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10);
            }
            else {
                eventResult = event.callback.apply(event.ctx, parameters);
            }

            if (eventResult !== undefined) {
                result = eventResult;
            }
        }

        return result;
    };

    /**
     * object observer for all properties
     *
     * @param {Object} object
     * @param {Object} options
     *
     * @event {void} get({ObjectOfObservation}, {PropertyName}, value) fires if some whants to get the value
     * @event {void} get[:PropertyName]({ObjectOfObservation}, {PropertyName}, value) fires if some whants to get the value
     * @event {*} get:before({ObjectOfObservation}, {PropertyName}) fires before if some wants to get the value. if callback returns a value other then undefined, this value will be retruned from get
     * @event {*} get:before[:PropertyName]({ObjectOfObservation}, {PropertyName}) fires before if some wants to get the value. if callback returns a value other then undefined, this value will be retruned from get
     * @event {void} get:after({ObjectOfObservation}, {PropertyName}, value) fires after if some wants to get the value.
     * @event {void} get:after[:PropertyName]({ObjectOfObservation}, {PropertyName}, value) fires after if some wants to get the value.
     *
     * @event {void} set({ObjectOfObservation}, {PropertyName}, newValue, oldValue) fires if some whants to set the value
     * @event {void} set[:PropertyName]({ObjectOfObservation}, {PropertyName}, newValue, oldValue) fires if some whants to set the value
     * @event {Boolean} set:before({ObjectOfObservation}, {PropertyName}, newValue, oldValue) fires before if some wants to set the value. if callback returns FALSE the value will not be setted
     * @event {Boolean} set:before[:PropertyName]({ObjectOfObservation}, {PropertyName}, newValue, oldValue) fires before if some wants to set the value. if callback returns FALSE the value will not be setted
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
    function ObjectObserver(object, options) {
        this.object = object;

        Base.call(this, options);

        if (this.autoObserve === true) {
            this.observe();
        }
    }

    // prototyping
    ObjectObserver.prototype = Object.create(Base.prototype, {
        /**
         * @var {Boolean}
         */
        autoObserve: {
            value: true,
            enumerable: false,
            configurable: false,
            writable: true
        },

        /**
         * @var {Object}
         */
        object: {
            value: null,
            enumerable: false,
            configurable: false,
            writable: true
        },

        /**
         * properties to observe
         *
         * @var {Object}
         */
        properties: {
            value: null,
            enumerable: false,
            configurable: false,
            writable: true
        },

        /**
         * @var {Boolean}
         */
        started: {
            value: false,
            enumerable: false,
            configurable: false,
            writable: true
        }
    });

    /**
     * creates observation for a property
     *
     * @param {String} propertyName
     * @returns {ObjectObserver}
     */
    ObjectObserver.prototype.createPropertyObservation = function (propertyName) {
        var property = {};

        // ############## creates the informations
        property.name = propertyName;

        // descriptor informations of property
        property.descriptor = Object.getOwnPropertyDescriptor(this.object, propertyName);

        // property has an getter as value handler
        property.hasGetter = property.descriptor !== undefined && property.descriptor.get !== undefined;

        // property has a setter as value handler
        property.hasSetter = property.descriptor !== undefined && property.descriptor.set !== undefined;

        // property has an getter and a setter as value handler
        property.isGetterSetterMode = property.hasGetter === true || property.hasSetter === true;
        // property can be getted
        property.isGetable          = property.hasGetter === true || property.isGetterSetterMode === false;
        // property can be setted
        property.isSetable          = property.hasSetter === true || property.isGetterSetterMode === false;

        // property is a function
        property.isFunction = this.object[propertyName] instanceof Function;

        // property is Enumerable
        property.isEnumerable = property.descriptor !== undefined ? property.descriptor.enumerable : true;

        // init value for property
        property.value = undefined;

        // store value in observer if no getter but is getable
        if (property.hasGetter === false) {
            property.value = this.object[property.name];
        }

        // store the information
        this.properties[propertyName] = property;

        // ############## creates the obsersvation

        // it is a function. observe function
        if (property.isFunction === true) {
            // define new property
            Object.defineProperty(this.object, propertyName, {
                enumerable: property.isEnumerable,
                configurable: true,
                writable: true,
                value: this.getFunction(property)
            });
        }
        // property is a not function. just a simple value
        else {
            // define new property
            Object.defineProperty(this.object, propertyName, {
                enumerable: property.isEnumerable,
                configurable: true,
                get: property.isGetable === true ? this.getGetter(property) : undefined,
                set: property.isSetable === true ? this.getSetter(property) : undefined
            });
        }

        return this;
    };

    /**
     * creates and returns a getter for a property
     *
     * @param {Object} property
     * @returns {Function}
     */
    ObjectObserver.prototype.getGetter = function (property) {
        var self = this;

        // create getter
        return function () {
            var result = self.trigger('get:before:' + property.name, property.name);

            // result from event "get:before::PROPERTY" overrules result from event "get:before"
            if (result === undefined) {
                result = self.trigger('get:before', property.name);
            }

            // a result was found, do not take it from original
            if (result === undefined) {
                // property has a getter use it
                if (property.hasGetter === true) {
                    result = property.descriptor.get.apply(this, arguments);
                }
                // no getter was defined, get value from observer
                else {
                    result = property.value;
                }
            }

            self.trigger('get:' + property.name, property.name, result);
            self.trigger('get', property.name, result);

            self.trigger('get:after:' + property.name, property.name, result);
            self.trigger('get:after', property.name, result);

            return result;
        };
    };

    /**
     * creates and returns a function for function property
     *
     * @param {Object} property
     * @returns {Function}
     */
    ObjectObserver.prototype.getFunction = function (property) {
        var self = this;

        // create getter
        return function () {
            var parametersLength = arguments.length;
            var parameters       = new Array(parametersLength);
            // this is faster then Array.prototype.slice.call
            for (var i = 0; i < parametersLength; i++) {
                parameters[i] = arguments[i];
            }

            var result = self.triggerWithParameters('get:before:' + property.name, property.name, parameters);

            // result from event "get:before::PROPERTY" overrules result from event "get:before"
            if (result === undefined) {
                result = self.triggerWithParameters('get:before', property.name, parameters);
            }

            // a result was found, do not take it from original
            if (result === undefined) {
                result = property.descriptor.value.apply(this, arguments);
            }

            parameters.unshift(result);

            self.triggerWithParameters('get:' + property.name, property.name, parameters);
            self.triggerWithParameters('get', property.name, parameters);

            self.triggerWithParameters('get:after:' + property.name, property.name, parameters);
            self.triggerWithParameters('get:after', property.name, parameters);

            return result;
        };
    };

    /**
     * creates and returns a setter
     *
     * @param {Object} property
     * @returns {Function}
     */
    ObjectObserver.prototype.getSetter = function (property) {
        var self = this;

        // create the setter
        return function (newValue) {
            var oldValue = undefined;
            // property has a getter use it
            if (property.hasGetter === true) {
                oldValue = property.descriptor.get.apply(this);
            }
            // no getter was defined, get value from observer
            else {
                oldValue = property.value;
            }

            // trigger before with Property
            var eventResultProperty = self.trigger('set:before:' + property.name, property.name, newValue, oldValue);
            if (eventResultProperty === false) {
                return;
            }

            // trigger before
            var eventResult = self.trigger('set:before', property.name, newValue, oldValue);
            if (eventResult === false) {
                return;
            }

            // property has a setter use it
            if (property.hasSetter === true) {
                property.descriptor.set.apply(this, arguments);
            }
            // no setter was defined, store value on observer
            else {
                property.value = newValue;
            }

            self.trigger('set:' + property.name, property.name, newValue, oldValue);
            self.trigger('set', property.name, newValue, oldValue);

            self.trigger('set:after:' + property.name, property.name, newValue, oldValue);
            self.trigger('set:after', property.name, newValue, oldValue);
        };
    };

    /**
     * observe the object
     *
     * @returns {ObjectObserver}
     */
    ObjectObserver.prototype.observe = function () {
        if (this.started === true) {
            return this;
        }

        this.started = true;

        var propertyName;

        // convert to Object
        if (this.properties instanceof Array) {
            var properties  = this.properties;
            this.properties = {};
            for (var i = 0, length = properties.length; i < length; i++) {
                this.createPropertyObservation(properties[i]);
            }
        }
        // properties are not an object, create full object observe
        else if ((this.properties instanceof Object) === false) {
            this.properties = {};
            for (propertyName in this.object) {
                this.createPropertyObservation(propertyName);
            }
        }
        // it is an object, create only the informations
        else {
            for (propertyName in this.properties) {
                this.createPropertyObservation(propertyName);
            }
        }

        return this;
    };

    /**
     * trigger
     *
     * @param {String} eventType
     * @param {String} propertyName
     * @param {*} ... additional parameters
     * @returns {*}
     */
    ObjectObserver.prototype.trigger = function (eventType, propertyName) {
        // on not started no event trigger
        if (this.started === false) {
            return;
        }

        var parameters = Array.prototype.slice.call(arguments, 1);
        parameters.unshift(this.object);
        parameters.unshift(eventType);

        return Base.prototype.trigger.apply(this, parameters);
    };

    /**
     * trigger
     *
     * @param {String} eventType
     * @param {String} propertyName
     * @param {Array} parameters
     * @returns {*}
     */
    ObjectObserver.prototype.triggerWithParameters = function (eventType, propertyName, parameters) {
        // on not started no event trigger
        if (this.started === false) {
            return;
        }

        if (parameters === undefined) {
            parameters = [];
        }
        // clone parameters to prevent injection of other values
        else {
            parameters = Array.prototype.slice.call(parameters);
        }

        parameters.unshift(propertyName);
        parameters.unshift(this.object);
        parameters.unshift(eventType);

        return Base.prototype.trigger.apply(this, parameters);
    };

    /**
     * unobserve the object
     *
     * @returns {ObjectObserver}
     */
    ObjectObserver.prototype.unobserve = function () {
        if (this.started === false) {
            return this;
        }

        this.started = false;

        for (var propertyName in this.properties) {
            var property = this.properties[propertyName];

            // save the value
            var value = undefined;

            // get the value if it is possible
            if (property.isGetable === true) {
                value = this.object[property.name];
            }

            // delete property deletes observer getter and setter
            delete this.object[property.name];

            // recreate property with complex descriptor
            // otherwise it will be recreate by simple setting of the property
            if (property.descriptor !== undefined) {
                Object.defineProperty(this.object, property.name, property.descriptor);
            }

            // set the value to the property back
            if (property.isSetable === true) {
                this.object[property.name] = value;
            }
        }

        return this;
    };

    return ObjectObserver;
}));
