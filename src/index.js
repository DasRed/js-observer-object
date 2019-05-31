// Regular expression used to split event strings.
const eventSplitter = /\s+/;

/**
 * @param {ObjectObserver} obj
 * @param {String} eventName
 * @param {Function} callback
 * @param {Object} context
 */
function removeEventsByEventName(obj, eventName, callback, context) {
    const events          = obj.events[eventName];
    obj.events[eventName] = [];
    if (callback || context) {
        for (let j = 0, k = events.length; j < k; j++) {
            const event = events[j];
            if ((callback && callback !== event.callback && callback !== event.callback._callback) || (context && context !== event.context)) {
                obj.events[eventName].push(event);
            }
        }
    }

    if (obj.events[eventName].length === 0) {
        delete obj.events[eventName];
    }
}

/**
 *
 * @param {Array} events
 * @param {*} parameters
 * @return {*}
 */
function callEventCallback(events, ...parameters) {
    return events.reduce((result, event) => event.callback.call(event.ctx, ...parameters) || result, undefined);
}

/**
 * object observer for all properties
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
 * @fires ObjectObserver-get:before:NAME
 * @fires ObjectObserver-get:before
 * @fires ObjectObserver-get:NAME
 * @fires ObjectObserver-get
 * @fires ObjectObserver-get:after:NAME
 * @fires ObjectObserver-get:after
 * @fires ObjectObserver-set:before:NAME
 * @fires ObjectObserver-set:before
 * @fires ObjectObserver-set:NAME
 * @fires ObjectObserver-set
 * @fires ObjectObserver-set:after:NAME
 * @fires ObjectObserver-set:after
 */
export default class ObjectObserver {
    /**
     * some stats
     * @type {{triggers: number, triggersByEventName: {}, triggersByPropertyName: {}}}
     */
    static eventStatistics = {
        triggers:               0,
        triggersByEventName:    {},
        triggersByPropertyName: {}
    };

    /**
     * enables or disables global event handling
     * @type {boolean}
     */
    static globalEventHandlingEnabled = true;

    /**
     *
     * @param {Object} object
     * @param {boolean} [async = true] If true, response values of event callbacks will be ignored. default true
     * @param {boolean} [autoObserve = true] If true, observe will be starts on construct. default true
     * @param {Object} [properties = {}]
     * @param {Object} [on = {}] on events
     *
     */
    constructor(object, {async = true, autoObserve = true, properties = {}, on = {}} = {}) {
        this.object  = object;
        this.events  = {};
        this.started = false;

        if (on !== undefined) {
            this.on(on);
        }

        this.async      = async !== undefined ? async : true;
        this.properties = properties !== undefined ? properties : {};

        if (autoObserve === true) {
            this.observe();
        }
    }

    /**
     * creates observation for a property
     *
     * @param {string} propertyName
     * @returns {ObjectObserver}
     */
    createPropertyObservation(propertyName) {
        const property = {};

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

        // ############## creates the observation

        // it is a function. observe function
        if (property.isFunction === true) {
            // define new property
            Object.defineProperty(this.object, propertyName, {
                enumerable:   property.isEnumerable,
                configurable: true,
                writable:     true,
                value:        this.getFunction(property)
            });
        }
        // property is a not function. just a simple value
        else {
            // define new property
            Object.defineProperty(this.object, propertyName, {
                enumerable:   property.isEnumerable,
                configurable: true,
                get:          property.isGetable === true ? this.getGetter(property) : undefined,
                set:          property.isSetable === true ? this.getSetter(property) : undefined
            });
        }

        return this;
    }

    /**
     * destroys the ObjectObserver
     *
     * @returns {ObjectObserver}
     */
    destroy() {
        // remove all events
        this.off();

        return this;
    }

    /**
     * creates and returns a function for function property
     *
     * @param {Object} property
     * @returns {Function}
     */
    getFunction(property) {
        const self = this;

        // create getter
        return function (...parameters) {
            // quick access
            if (ObjectObserver.globalEventHandlingEnabled !== true) {
                return property.descriptor.value.apply(this, arguments);
            }

            /**
             * @event ObjectObserver-get:before:NAME
             * @param {Object} objectOfObservation
             * @param {string} name
             * @param {...*} parameters
             */
            let result = self.trigger('get:before:' + property.name, property.name, ...parameters);

            // result from event "get:before::PROPERTY" overrules result from event "get:before"

            /**
             * @event ObjectObserver-get:before
             * @param {Object} objectOfObservation
             * @param {string} name
             * @param {...*} parameters
             */
            if (result === undefined) {
                result = self.trigger('get:before', property.name, ...parameters);
            }

            // a result was found, do not take it from original
            if (result === undefined) {
                result = property.descriptor.value.apply(this, arguments);
            }


            /**
             * @event ObjectObserver-get:NAME
             * @param {Object} objectOfObservation
             * @param {string} name
             * @param {*} value
             * @param {...*} parameters
             */
            self.trigger('get:' + property.name, property.name, result, ...parameters);
            /**
             * @event ObjectObserver-get
             * @param {Object} objectOfObservation
             * @param {string} name
             * @param {*} value
             * @param {...*} parameters
             */
            self.trigger('get', property.name, result, ...parameters);

            /**
             * @event ObjectObserver-get:after:NAME
             * @param {Object} objectOfObservation
             * @param {string} name
             * @param {*} value
             * @param {...*} parameters
             */
            self.trigger('get:after:' + property.name, property.name, result, ...parameters);
            /**
             * @event ObjectObserver-get:after
             * @param {Object} objectOfObservation
             * @param {string} name
             * @param {*} value
             * @param {...*} parameters
             */
            self.trigger('get:after', property.name, result, ...parameters);

            return result;
        };
    }

    /**
     * creates and returns a getter for a property
     *
     * @param {Object} property
     * @returns {Function}
     */
    getGetter(property) {
        const self = this;

        // create getter
        return function () {
            // quick access
            if (ObjectObserver.globalEventHandlingEnabled !== true) {
                // property has a getter use it
                if (property.hasGetter === true) {
                    return property.descriptor.get.apply(this, arguments);
                }

                // no getter was defined, get value from observer
                return property.value;
            }

            /**
             * @event ObjectObserver-get:before:NAME
             * @param {Object} objectOfObservation
             * @param {string} name
             */
            let result = self.trigger('get:before:' + property.name, property.name);

            // result from event "get:before::PROPERTY" overrules result from event "get:before"
            if (result === undefined) {
                /**
                 * @event ObjectObserver-get:before
                 * @param {Object} objectOfObservation
                 * @param {string} name
                 */
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

            /**
             * @event ObjectObserver-get:NAME
             * @param {Object} objectOfObservation
             * @param {string} name
             * @param {*} value
             */
            self.trigger('get:' + property.name, property.name, result);
            /**
             * @event ObjectObserver-get
             * @param {Object} objectOfObservation
             * @param {string} name
             * @param {*} value
             */
            self.trigger('get', property.name, result);

            /**
             * @event ObjectObserver-get:after:NAME
             * @param {Object} objectOfObservation
             * @param {string} name
             * @param {*} value
             */
            self.trigger('get:after:' + property.name, property.name, result);
            /**
             * @event ObjectObserver-get:after
             * @param {Object} objectOfObservation
             * @param {string} name
             * @param {*} value
             */
            self.trigger('get:after', property.name, result);

            return result;
        };
    }

    /**
     * creates and returns a setter
     *
     * @param {Object} property
     * @param {Boolean} property.hasGetter
     * @param {Boolean} property.hasSetter
     * @param {Object} [property.descriptor]
     * @param {Function} [property.descriptor.get]
     * @param {Function} [property.descriptor.set]
     * @param {*} property.value
     * @param {String} property.name
     * @returns {Function}
     */
    getSetter(property) {
        const self = this;

        // create the setter
        return function (newValue) {
            // quick access
            if (ObjectObserver.globalEventHandlingEnabled !== true) {
                // property has a setter use it
                if (property.hasSetter === true) {
                    property.descriptor.set.apply(this, arguments);
                }
                // no setter was defined, store value on observer
                else {
                    property.value = newValue;
                }

                return;
            }

            let oldValue = undefined;
            // property has a getter use it
            if (property.hasGetter === true) {
                oldValue = property.descriptor.get.apply(this);
            }
            // no getter was defined, get value from observer
            else {
                oldValue = property.value;
            }

            // trigger before with Property
            /**
             * @event ObjectObserver-set:before:NAME
             * @param {Object} objectOfObservation
             * @param {string} name
             * @param {*} newValue
             * @param {*} oldValue
             */
            const eventResultProperty = self.trigger('set:before:' + property.name, property.name, newValue, oldValue);
            if (eventResultProperty === false) {
                return;
            }

            // trigger before
            /**
             * @event ObjectObserver-set:before
             * @param {Object} objectOfObservation
             * @param {string} name
             * @param {*} newValue
             * @param {*} oldValue
             */
            const eventResult = self.trigger('set:before', property.name, newValue, oldValue);
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

            /**
             * @event ObjectObserver-set:NAME
             * @param {Object} objectOfObservation
             * @param {string} name
             * @param {*} newValue
             * @param {*} oldValue
             */
            self.trigger('set:' + property.name, property.name, newValue, oldValue);
            /**
             * @event ObjectObserver-set
             * @param {Object} objectOfObservation
             * @param {string} name
             * @param {*} newValue
             * @param {*} oldValue
             */
            self.trigger('set', property.name, newValue, oldValue);

            /**
             * @event ObjectObserver-set:after:NAME
             * @param {Object} objectOfObservation
             * @param {string} name
             * @param {*} newValue
             * @param {*} oldValue
             */
            self.trigger('set:after:' + property.name, property.name, newValue, oldValue);
            /**
             * @event ObjectObserver-set:after
             * @param {Object} objectOfObservation
             * @param {string} name
             * @param {*} newValue
             * @param {*} oldValue
             */
            self.trigger('set:after', property.name, newValue, oldValue);
        };
    }

    /**
     * observe the object
     *
     * @returns {ObjectObserver}
     */
    observe() {
        if (this.started === true) {
            return this;
        }

        this.started = true;

        // convert to Object
        if (this.properties instanceof Array) {
            const properties = this.properties;
            this.properties  = {};
            properties.forEach((propertyName) => this.createPropertyObservation(propertyName));
        }
        // properties are not an object, create full object observe
        else if ((this.properties instanceof Object) === false) {
            this.properties = {};
            Object.keys(this.object).forEach((propertyName) => this.createPropertyObservation(propertyName));
        }
        // it is an object, create only the informations
        else {
            Object.keys(this.properties).forEach((propertyName) => this.createPropertyObservation(propertyName));
        }

        return this;
    }

    /**
     *
     * @param {String} [eventName]
     * @param {Function} [callback]
     * @param {Object} [context]
     * @returns {ObjectObserver}
     */
    off(eventName, callback, context) {
        const eventNameIsDefined = eventName !== undefined && eventName !== null;
        const callbackIsDefined  = callback !== undefined && callback !== null;
        const contextIsDefined   = context !== undefined && context !== null;
        const eventIsDefined     = this.events[eventName] !== undefined && this.events[eventName] !== null;

        // remove all events
        if (eventNameIsDefined === false && callbackIsDefined === false && contextIsDefined === false) {
            Object.keys(this.events).forEach((key) => delete this.events[key]);
        }

        // removes all events by eventName
        else if (eventNameIsDefined === true && callbackIsDefined === false && contextIsDefined === false) {
            if (eventIsDefined === true) {
                delete this.events[eventName];
            }
        }

        // loop over all events
        else if (eventNameIsDefined === false) {
            Object.keys(this.events).forEach((key) => removeEventsByEventName(this, key, callback, context));
        }

        // only one specific event with additional informations
        else if (eventIsDefined === true) {
            removeEventsByEventName(this, eventName, callback, context);
        }

        return this;
    }

    /**
     * creates one or more events
     *
     * @param {String|Object} eventName
     * @param {Function} [callback]
     * @param {Object} [context]
     * @returns {ObjectObserver}
     */
    on(eventName, callback, context) {
        // Handle event maps.
        if (typeof eventName === 'object') {
            Object.keys(eventName).forEach((key) => this.on(key, eventName[key]));

            return this;
        }

        // Handle space separated event names.
        if (eventSplitter.test(eventName) === true) {
            eventName.split(eventSplitter).forEach((eventName) => this.on(eventName, callback, context));
            return this;
        }

        // create new event entry
        if (this.events[eventName] === undefined) {
            this.events[eventName] = [];
        }

        // append the event
        this.events[eventName].push({
            callback: callback,
            context:  context,
            ctx:      context || undefined
        });

        return this;
    }

    /**
     * trigger
     *
     * @param {String} eventName
     * @param {String} propertyName
     * @param {...*} [args] additional n Parameters
     * @returns {*}
     */
    trigger(eventName, propertyName, ...args) {
        // on not started no event trigger
        if (ObjectObserver.globalEventHandlingEnabled !== true || this.started === false || this.events[eventName] === undefined) {
            return;
        }

        ObjectObserver.eventStatistics.triggers++;
        ObjectObserver.eventStatistics.triggersByEventName[eventName]       = (ObjectObserver.eventStatistics.triggersByEventName[eventName] || 0) + 1;
        ObjectObserver.eventStatistics.triggersByPropertyName[propertyName] = (ObjectObserver.eventStatistics.triggersByPropertyName[propertyName] || 0) + 1;

        if (this.async === true) {
            setTimeout(() => callEventCallback(this.events[eventName], this.object, propertyName, ...args), 0);
        }
        else {
            callEventCallback(this.events[eventName], this.object, propertyName, ...args)
        }

        return undefined;
    }

    /**
     * unobserve the object
     *
     * @returns {ObjectObserver}
     */
    unobserve() {
        if (this.started === false) {
            return this;
        }

        this.started = false;

        Object.keys(this.properties).forEach((propertyName) => {
            const property = this.properties[propertyName];

            // save the value
            let value = undefined;

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
        });

        return this;
    }
}
