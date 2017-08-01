
/**
 * generateVideo v0.0.4
 * (c) 2017 yandeqiang
 * Released under ISC
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.generateVideo = factory());
}(this, (function () { 'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
  
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  return returnValue;
}

function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
});

var _aFunction = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function(fn, that, length){
  _aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

var _isObject = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function(it){
  if(!_isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

var document$1 = _global.document;
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function(it){
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function(){
  return Object.defineProperty(_domCreate('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function(it, S){
  if(!_isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP             = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes){
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if(_ie8DomDefine)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

var _hide = _descriptors ? function(object, key, value){
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

var PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? _core : _core[name] || (_core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])_hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
var _export = $export;

// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
_export(_export.S + _export.F * !_descriptors, 'Object', {defineProperty: _objectDp.f});

var $Object = _core.Object;
var defineProperty$1 = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

var defineProperty = createCommonjsModule(function (module) {
module.exports = { "default": defineProperty$1, __esModule: true };
});

var _Object$defineProperty = unwrapExports(defineProperty);

var toString = {}.toString;

var _cof = function(it){
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings

var _toIobject = function(it){
  return _iobject(_defined(it));
};

var f$2 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$2
};

var hasOwnProperty = {}.hasOwnProperty;
var _has = function(it, key){
  return hasOwnProperty.call(it, key);
};

var gOPD           = Object.getOwnPropertyDescriptor;

var f$1 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = _toIobject(O);
  P = _toPrimitive(P, true);
  if(_ie8DomDefine)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(_has(O, P))return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
};

var _objectGopd = {
	f: f$1
};

// most Object methods by ES6 should accept primitives

var _objectSap = function(KEY, exec){
  var fn  = (_core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  _export(_export.S + _export.F * _fails(function(){ fn(1); }), 'Object', exp);
};

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var $getOwnPropertyDescriptor = _objectGopd.f;

_objectSap('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(_toIobject(it), key);
  };
});

var $Object$1 = _core.Object;
var getOwnPropertyDescriptor$1 = function getOwnPropertyDescriptor(it, key){
  return $Object$1.getOwnPropertyDescriptor(it, key);
};

var getOwnPropertyDescriptor = createCommonjsModule(function (module) {
module.exports = { "default": getOwnPropertyDescriptor$1, __esModule: true };
});

var _Object$getOwnPropertyDescriptor = unwrapExports(getOwnPropertyDescriptor);

// 7.1.13 ToObject(argument)

var _toObject = function(it){
  return Object(_defined(it));
};

var SHARED = '__core-js_shared__';
var store  = _global[SHARED] || (_global[SHARED] = {});
var _shared = function(key){
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');
var _sharedKey = function(key){
  return shared[key] || (shared[key] = _uid(key));
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var IE_PROTO    = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function(O){
  O = _toObject(O);
  if(_has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

// 19.1.2.9 Object.getPrototypeOf(O)


_objectSap('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return _objectGpo(_toObject(it));
  };
});

var getPrototypeOf$1 = _core.Object.getPrototypeOf;

var getPrototypeOf = createCommonjsModule(function (module) {
module.exports = { "default": getPrototypeOf$1, __esModule: true };
});

var _Object$getPrototypeOf = unwrapExports(getPrototypeOf);

var classCallCheck = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck = unwrapExports(classCallCheck);

var createClass = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass = unwrapExports(createClass);

// 7.1.4 ToInteger
var ceil  = Math.ceil;
var floor = Math.floor;
var _toInteger = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function(TO_STRING){
  return function(that, pos){
    var s = String(_defined(that))
      , i = _toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var _library = true;

var _redefine = _hide;

var _iterators = {};

// 7.1.15 ToLength
var min       = Math.min;
var _toLength = function(it){
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max       = Math.max;
var min$1       = Math.min;
var _toIndex = function(index, length){
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes

var _arrayIncludes = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = _toIobject($this)
      , length = _toLength(O.length)
      , index  = _toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO$2     = _sharedKey('IE_PROTO');

var _objectKeysInternal = function(object, names){
  var O      = _toIobject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO$2)_has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(_has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)


var _objectKeys = Object.keys || function keys(O){
  return _objectKeysInternal(O, _enumBugKeys);
};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties){
  _anObject(O);
  var keys   = _objectKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)_objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var _html = _global.document && document.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var IE_PROTO$1    = _sharedKey('IE_PROTO');
var Empty       = function(){ /* empty */ };
var PROTOTYPE$1   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe')
    , i      = _enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty;
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

var _wks = createCommonjsModule(function (module) {
var store      = _shared('wks')
  , Symbol     = _global.Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

var def = _objectDp.f;
var TAG = _wks('toStringTag');

var _setToStringTag = function(it, tag, stat){
  if(it && !_has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function(){ return this; });

var _iterCreate = function(Constructor, NAME, next){
  Constructor.prototype = _objectCreate(IteratorPrototype, {next: _propertyDesc(1, next)});
  _setToStringTag(Constructor, NAME + ' Iterator');
};

var ITERATOR       = _wks('iterator');
var BUGGY          = !([].keys && 'next' in [].keys());
var FF_ITERATOR    = '@@iterator';
var KEYS           = 'keys';
var VALUES         = 'values';

var returnThis = function(){ return this; };

var _iterDefine = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  _iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = _objectGpo($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!_library && !_has(IteratorPrototype, ITERATOR))_hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    _hide(proto, ITERATOR, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))_redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

var $at  = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

var _addToUnscopables = function(){ /* empty */ };

var _iterStep = function(done, value){
  return {value: value, done: !!done};
};

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function(iterated, kind){
  this._t = _toIobject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return _iterStep(1);
  }
  if(kind == 'keys'  )return _iterStep(0, index);
  if(kind == 'values')return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

_addToUnscopables('keys');
_addToUnscopables('values');
_addToUnscopables('entries');

var TO_STRING_TAG = _wks('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = _global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])_hide(proto, TO_STRING_TAG, NAME);
  _iterators[NAME] = _iterators.Array;
}

var f$3 = _wks;

var _wksExt = {
	f: f$3
};

var iterator$2 = _wksExt.f('iterator');

var iterator = createCommonjsModule(function (module) {
module.exports = { "default": iterator$2, __esModule: true };
});

var _meta = createCommonjsModule(function (module) {
var META     = _uid('meta')
  , setDesc  = _objectDp.f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !_fails(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!_isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!_has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!_has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !_has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
});

var defineProperty$3 = _objectDp.f;
var _wksDefine = function(name){
  var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty$3($Symbol, name, {value: _wksExt.f(name)});
};

var _keyof = function(object, el){
  var O      = _toIobject(object)
    , keys   = _objectKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

var f$4 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$4
};

// all enumerable object keys, includes symbols

var _enumKeys = function(it){
  var result     = _objectKeys(it)
    , getSymbols = _objectGops.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = _objectPie.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

// 7.2.2 IsArray(argument)

var _isArray = Array.isArray || function isArray(arg){
  return _cof(arg) == 'Array';
};

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

var f$6 = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return _objectKeysInternal(O, hiddenKeys);
};

var _objectGopn = {
	f: f$6
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var gOPN$1      = _objectGopn.f;
var toString$1  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN$1(it);
  } catch(e){
    return windowNames.slice();
  }
};

var f$5 = function getOwnPropertyNames(it){
  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(_toIobject(it));
};

var _objectGopnExt = {
	f: f$5
};

// ECMAScript 6 symbols shim
var META           = _meta.KEY;
var gOPD$2           = _objectGopd.f;
var dP$1             = _objectDp.f;
var gOPN           = _objectGopnExt.f;
var $Symbol        = _global.Symbol;
var $JSON          = _global.JSON;
var _stringify     = $JSON && $JSON.stringify;
var PROTOTYPE$2      = 'prototype';
var HIDDEN         = _wks('_hidden');
var TO_PRIMITIVE   = _wks('toPrimitive');
var isEnum         = {}.propertyIsEnumerable;
var SymbolRegistry = _shared('symbol-registry');
var AllSymbols     = _shared('symbols');
var OPSymbols      = _shared('op-symbols');
var ObjectProto$1    = Object[PROTOTYPE$2];
var USE_NATIVE     = typeof $Symbol == 'function';
var QObject        = _global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = _descriptors && _fails(function(){
  return _objectCreate(dP$1({}, 'a', {
    get: function(){ return dP$1(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD$2(ObjectProto$1, key);
  if(protoDesc)delete ObjectProto$1[key];
  dP$1(it, key, D);
  if(protoDesc && it !== ObjectProto$1)dP$1(ObjectProto$1, key, protoDesc);
} : dP$1;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto$1)$defineProperty(OPSymbols, key, D);
  _anObject(it);
  key = _toPrimitive(key, true);
  _anObject(D);
  if(_has(AllSymbols, key)){
    if(!D.enumerable){
      if(!_has(it, HIDDEN))dP$1(it, HIDDEN, _propertyDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(_has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _objectCreate(D, {enumerable: _propertyDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP$1(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  _anObject(it);
  var keys = _enumKeys(P = _toIobject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = _toPrimitive(key, true));
  if(this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key))return false;
  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor$1 = function getOwnPropertyDescriptor(it, key){
  it  = _toIobject(it);
  key = _toPrimitive(key, true);
  if(it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key))return;
  var D = gOPD$2(it, key);
  if(D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(_toIobject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto$1
    , names  = gOPN(IS_OP ? OPSymbols : _toIobject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto$1)$set.call(OPSymbols, value);
      if(_has(this, HIDDEN) && _has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, _propertyDesc(1, value));
    };
    if(_descriptors && setter)setSymbolDesc(ObjectProto$1, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString(){
    return this._k;
  });

  _objectGopd.f = $getOwnPropertyDescriptor$1;
  _objectDp.f   = $defineProperty;
  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
  _objectPie.f  = $propertyIsEnumerable;
  _objectGops.f = $getOwnPropertySymbols;

  if(_descriptors && !_library){
    _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  _wksExt.f = function(name){
    return wrap(_wks(name));
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i$1 = 0; symbols.length > i$1; )_wks(symbols[i$1++]);

for(var symbols = _objectKeys(_wks.store), i$1 = 0; symbols.length > i$1; )_wksDefine(symbols[i$1++]);

_export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return _has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return _keyof(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

_export(_export.S + _export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor$1,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !_isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
_setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
_setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
_setToStringTag(_global.JSON, 'JSON', true);

_wksDefine('asyncIterator');

_wksDefine('observable');

var index$1 = _core.Symbol;

var symbol = createCommonjsModule(function (module) {
module.exports = { "default": index$1, __esModule: true };
});

var _typeof_1 = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _iterator2 = _interopRequireDefault(iterator);



var _symbol2 = _interopRequireDefault(symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
});

var _typeof = unwrapExports(_typeof_1);

var possibleConstructorReturn = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _typeof3 = _interopRequireDefault(_typeof_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};
});

var _possibleConstructorReturn = unwrapExports(possibleConstructorReturn);

var get = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _getPrototypeOf2 = _interopRequireDefault(getPrototypeOf);



var _getOwnPropertyDescriptor2 = _interopRequireDefault(getOwnPropertyDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

  if (desc === undefined) {
    var parent = (0, _getPrototypeOf2.default)(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};
});

var _get = unwrapExports(get);

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */

var check = function(O, proto){
  _anObject(O);
  if(!_isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
var _setProto = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

// 19.1.3.19 Object.setPrototypeOf(O, proto)

_export(_export.S, 'Object', {setPrototypeOf: _setProto.set});

var setPrototypeOf$2 = _core.Object.setPrototypeOf;

var setPrototypeOf = createCommonjsModule(function (module) {
module.exports = { "default": setPrototypeOf$2, __esModule: true };
});

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
_export(_export.S, 'Object', {create: _objectCreate});

var $Object$2 = _core.Object;
var create$2 = function create(P, D){
  return $Object$2.create(P, D);
};

var create$1 = createCommonjsModule(function (module) {
module.exports = { "default": create$2, __esModule: true };
});

var _Object$create = unwrapExports(create$1);

var inherits = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _setPrototypeOf2 = _interopRequireDefault(setPrototypeOf);



var _create2 = _interopRequireDefault(create$1);



var _typeof3 = _interopRequireDefault(_typeof_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};
});

var _inherits = unwrapExports(inherits);

// getting tag from 19.1.3.6 Object.prototype.toString()
var TAG$1 = _wks('toStringTag');
var ARG = _cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

var _classof = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var _anInstance = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

// call something on iterator step with safe closing on error

var _iterCall = function(iterator, fn, value, entries){
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)_anObject(ret.call(iterator));
    throw e;
  }
};

// check on default Array iterator
var ITERATOR$1   = _wks('iterator');
var ArrayProto = Array.prototype;

var _isArrayIter = function(it){
  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$1] === it);
};

var ITERATOR$2  = _wks('iterator');
var core_getIteratorMethod = _core.getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR$2]
    || it['@@iterator']
    || _iterators[_classof(it)];
};

var _forOf = createCommonjsModule(function (module) {
var BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : core_getIteratorMethod(iterable)
    , f      = _ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(_isArrayIter(iterFn))for(length = _toLength(iterable.length); length > index; index++){
    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = _iterCall(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;
});

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var SPECIES   = _wks('species');
var _speciesConstructor = function(O, D){
  var C = _anObject(O).constructor, S;
  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
};

// fast apply, http://jsperf.lnkit.com/fast-apply/5
var _invoke = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};

var process$1            = _global.process;
var setTask            = _global.setImmediate;
var clearTask          = _global.clearImmediate;
var MessageChannel     = _global.MessageChannel;
var counter            = 0;
var queue              = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer;
var channel;
var port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(_cof(process$1) == 'process'){
    defer = function(id){
      process$1.nextTick(_ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = _ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts){
    defer = function(id){
      _global.postMessage(id + '', '*');
    };
    _global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in _domCreate('script')){
    defer = function(id){
      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function(){
        _html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(_ctx(run, id, 1), 0);
    };
  }
}
var _task = {
  set:   setTask,
  clear: clearTask
};

var macrotask = _task.set;
var Observer  = _global.MutationObserver || _global.WebKitMutationObserver;
var process$2   = _global.process;
var Promise   = _global.Promise;
var isNode$1    = _cof(process$2) == 'process';

var _microtask = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode$1 && (parent = process$2.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode$1){
    notify = function(){
      process$2.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(_global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};

var _redefineAll = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else _hide(target, key, src[key]);
  } return target;
};

var SPECIES$1     = _wks('species');

var _setSpecies = function(KEY){
  var C = typeof _core[KEY] == 'function' ? _core[KEY] : _global[KEY];
  if(_descriptors && C && !C[SPECIES$1])_objectDp.f(C, SPECIES$1, {
    configurable: true,
    get: function(){ return this; }
  });
};

var ITERATOR$3     = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$3]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

var _iterDetect = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR$3]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR$3] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

var task               = _task.set;
var microtask          = _microtask();
var PROMISE            = 'Promise';
var TypeError$1          = _global.TypeError;
var process            = _global.process;
var $Promise           = _global[PROMISE];
var process            = _global.process;
var isNode             = _classof(process) == 'process';
var empty              = function(){ /* empty */ };
var Internal;
var GenericPromiseCapability;
var Wrapper;

var USE_NATIVE$1 = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[_wks('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError$1('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = _aFunction(resolve);
  this.reject  = _aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError$1('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(_global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = _global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = _global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(_global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = _global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError$1("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE$1){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    _anInstance(this, $Promise, PROMISE, '_h');
    _aFunction(executor);
    Internal.call(this);
    try {
      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = _redefineAll($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(_speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = _ctx($resolve, promise, 1);
    this.reject  = _ctx($reject, promise, 1);
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE$1, {Promise: $Promise});
_setToStringTag($Promise, PROMISE);
_setSpecies(PROMISE);
Wrapper = _core[PROMISE];

// statics
_export(_export.S + _export.F * !USE_NATIVE$1, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
_export(_export.S + _export.F * (_library || !USE_NATIVE$1), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
_export(_export.S + _export.F * !(USE_NATIVE$1 && _iterDetect(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      _forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      _forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});

var promise$1 = _core.Promise;

var promise = createCommonjsModule(function (module) {
module.exports = { "default": promise$1, __esModule: true };
});

var _Promise = unwrapExports(promise);

// 19.1.2.14 Object.keys(O)


_objectSap('keys', function(){
  return function keys(it){
    return _objectKeys(_toObject(it));
  };
});

var keys$1 = _core.Object.keys;

var keys = createCommonjsModule(function (module) {
module.exports = { "default": keys$1, __esModule: true };
});

var _Object$keys = unwrapExports(keys);

// 20.1.2.3 Number.isInteger(number)
var floor$1    = Math.floor;
var _isInteger = function isInteger(it){
  return !_isObject(it) && isFinite(it) && floor$1(it) === it;
};

// 20.1.2.3 Number.isInteger(number)


_export(_export.S, 'Number', {isInteger: _isInteger});

var isInteger$2 = _core.Number.isInteger;

var isInteger$1 = createCommonjsModule(function (module) {
module.exports = { "default": isInteger$2, __esModule: true };
});

var _Number$isInteger = unwrapExports(isInteger$1);

var _stringWs = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var space   = '[' + _stringWs + ']';
var non     = '\u200b\u0085';
var ltrim   = RegExp('^' + space + space + '*');
var rtrim   = RegExp(space + space + '*$');

var exporter = function(KEY, exec, ALIAS){
  var exp   = {};
  var FORCE = _fails(function(){
    return !!_stringWs[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : _stringWs[KEY];
  if(ALIAS)exp[ALIAS] = fn;
  _export(_export.P + _export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function(string, TYPE){
  string = String(_defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

var _stringTrim = exporter;

var $parseFloat = _global.parseFloat;
var $trim       = _stringTrim.trim;

var _parseFloat$3 = 1 / $parseFloat(_stringWs + '-0') !== -Infinity ? function parseFloat(str){
  var string = $trim(String(str), 3)
    , result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

// 20.1.2.12 Number.parseFloat(string)
_export(_export.S + _export.F * (Number.parseFloat != _parseFloat$3), 'Number', {parseFloat: _parseFloat$3});

var _parseFloat$1 = parseFloat;

var _parseFloat = createCommonjsModule(function (module) {
module.exports = { "default": _parseFloat$1, __esModule: true };
});

var _Number$parseFloat = unwrapExports(_parseFloat);

/**
 * toxic-predicate-functions v0.1.2
 * (c) 2017 toxic-johann
 * Released under MIT
 */

/**
 * is void element or not ? Means it will return true when val is undefined or null
 * @param  {Anything}  obj
 * @return {Boolean}   return true when val is undefined or null
 */
function isVoid(obj) {
  return obj === undefined || obj === null;
}
/**
 * to check whether a variable is array
 * @param {Anything} arr
 * @return {Boolean} true when it is a boolean
 */
function isArray$1(arr) {
  return Array.isArray(arr);
}

/**
 * 判断是否为function
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
function isFunction(obj) {
  return typeof obj === 'function';
}

/**
 * 判断是否是对象
 * @param  {Anything}  obj 传入对象
 * @return {Boolean}     [description]
 */
function isObject$1(obj) {
  // incase of arrow function and array
  return Object(obj) === obj && String(obj) === '[object Object]' && !isFunction(obj) && !isArray$1(obj);
}
/**
 * to tell you if it's a real number
 * @param  {Anything}  obj
 * @return {Boolean}   return true when it's a number
 */
function isNumber(obj) {
  return typeof obj === 'number';
}
/**
 * to tell you if the val can be transfer into data
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
function isNumeric(obj) {
  return !isArray$1(obj) && obj - _Number$parseFloat(obj) + 1 >= 0;
}
/**
 * 判断是否为整数
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
function isInteger(num) {
  return _Number$isInteger(num);
}

/**
 * 判断是否为空
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 * @example
 * "", {}, [], 0, null, undefined, false 为空
 */
function isEmpty(obj) {
  if (isArray$1(obj)) {
    return obj.length === 0;
  } else if (isObject$1(obj)) {
    return _Object$keys(obj).length === 0;
  } else {
    return !obj;
  }
}
/**
 * 判断是否为事件
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
function isEvent(obj) {
  return obj instanceof Event || obj.originalEvent instanceof Event;
}
/**
 * 判断是否为blob
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
function isBlob(obj) {
  return obj instanceof Blob;
}
/**
 * 判断是否为file上传的文件
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
function isFile(obj) {
  return isBlob(obj) && isString(obj.name);
}
/**
 * 判断是否为日期对象
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
function isDate(obj) {
  return Object.prototype.toString.call(obj) === '[object Date]';
}
/**
 * 判断是否是string
 * @param  {Anything}  str [description]
 * @return {Boolean}     [description]
 */
function isString(str) {
  return typeof str === 'string' || str instanceof String;
}
/**
 * is Boolean or not
 * @param  {Anything} bool
 * @return {Boolean}
 */
function isBoolean(bool) {
  return typeof bool === 'boolean';
}
/**
 * is a promise or not
 * @param {Anything} obj
 * @return {boolean}
 */
function isPromise(obj) {
  return !!obj && ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
/**
 * is Primitive type or not, whick means it will return true when data is number/string/boolean/undefined/null
 * @param  {Anyting}  val
 * @return {Boolean}  true when type is number/string/boolean/undefined/null
 */
function isPrimitive(val) {
  return isVoid(val) || isBoolean(val) || isString(val) || isNumber(val);
}
/**
 * 判断是否为url且必须要带有协议头
 * @param  {Anything}  str [description]
 * @return {Boolean}     [description]
 */
function isUrl(str) {
  return isString(str) && !!str.match(/^((https?|ftp|rtsp|mms):\/\/)(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6}|localhost)(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/i);
}
/**
 * to test if a HTML node
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
function isNode$2(obj) {
  return !!((typeof Node === 'undefined' ? 'undefined' : _typeof(Node)) === 'object' ? obj instanceof Node : obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && typeof obj.nodeType === 'number' && typeof obj.nodeName === 'string');
}
/**
 * to test if a HTML element
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
function isElement(obj) {
  return !!((typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === 'object' ? obj instanceof HTMLElement : obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string');
}
/**
 * check if node A is node B's parent or not
 * @param  {Node}  parent
 * @param  {Node}  child
 * @return {Boolean}
 */
function isChildNode(parent, child) {
  if (!isNode$2(parent) || !isNode$2(child)) {
    return false;
  }
  return child.parentNode === parent;
}
/**
 * check if node B is node A's posterrity or not
 * @param  {Node}  parent
 * @param  {Node}  child
 * @return {Boolean}
 */
function isPosterityNode(parent, child) {
  if (!isNode$2(parent) || !isNode$2(child)) {
    return false;
  }
  while (child.parentNode) {
    child = child.parentNode;
    if (child === parent) {
      return true;
    }
  }
  return false;
}
/**
 * check if the string is an HTMLString
 * @param  {string}  str only accept string
 * @return {Boolean}
 */
function isHTMLString(str) {
  return (/<[^>]+?>/.test(str)
  );
}
/**
 * check if is an error
 * @param {anything} val
 * @return {boolean}
 */
function isError(val) {
  return val instanceof Error;
}

/**
 * chimee-helper-log v0.1.1
 * (c) 2017 toxic-johann
 * Released under MIT
 */

function formatter(tag, msg) {
  if (!isString(tag)) throw new TypeError("Log's method only acccept string as argument");
  if (!isString(msg)) return '[' + Log.GLOBAL_TAG + '] > ' + tag;
  tag = Log.FORCE_GLOBAL_TAG ? Log.GLOBAL_TAG : tag || Log.GLOBAL_TAG;
  return '[' + tag + '] > ' + msg;
}
/**
 * Log Object
 */

var Log = function () {
  function Log() {
    _classCallCheck(this, Log);
  }

  _createClass(Log, null, [{
    key: 'error',

    /**
     * equal to console.error, output `[${tag}] > {$msg}`
     * @param {string} tag optional, the header of log 
     * @param {string} msg the message
     */

    /**
     * @member {boolean}
     */

    /**
     * @member {boolean}
     */

    /**
     * @member {boolean}
     */
    value: function error(tag, msg) {
      if (!Log.ENABLE_ERROR) {
        return;
      }

      (console.error || console.warn || console.log)(formatter(tag, msg));
    }
    /**
     * equal to console.info, output `[${tag}] > {$msg}`
     * @param {string} tag optional, the header of log 
     * @param {string} msg the message
     */

    /**
     * @member {boolean}
     */

    /**
     * @member {boolean}
     */

    /**
     * @member {boolean}
     */

    /**
     * @member {string}
     */

  }, {
    key: 'info',
    value: function info(tag, msg) {
      if (!Log.ENABLE_INFO) {
        return;
      }
      (console.info || console.log)(formatter(tag, msg));
    }
    /**
     * equal to console.warn, output `[${tag}] > {$msg}`
     * @param {string} tag optional, the header of log 
     * @param {string} msg the message
     */

  }, {
    key: 'warn',
    value: function warn(tag, msg) {
      if (!Log.ENABLE_WARN) {
        return;
      }
      (console.warn || console.log)(formatter(tag, msg));
    }
    /**
     * equal to console.debug, output `[${tag}] > {$msg}`
     * @param {string} tag optional, the header of log 
     * @param {string} msg the message
     */

  }, {
    key: 'debug',
    value: function debug(tag, msg) {
      if (!Log.ENABLE_DEBUG) {
        return;
      }
      (console.debug || console.log)(formatter(tag, msg));
    }
    /**
     * equal to console.verbose, output `[${tag}] > {$msg}`
     * @param {string} tag optional, the header of log 
     * @param {string} msg the message
     */

  }, {
    key: 'verbose',
    value: function verbose(tag, msg) {
      if (!Log.ENABLE_VERBOSE) {
        return;
      }
      console.log(formatter(tag, msg));
    }
  }]);

  return Log;
}();

Log.GLOBAL_TAG = 'chimee';
Log.FORCE_GLOBAL_TAG = false;
Log.ENABLE_ERROR = true;
Log.ENABLE_INFO = true;
Log.ENABLE_WARN = true;
Log.ENABLE_DEBUG = true;
Log.ENABLE_VERBOSE = true;

var _createProperty = function(object, index, value){
  if(index in object)_objectDp.f(object, index, _propertyDesc(0, value));
  else object[index] = value;
};

_export(_export.S + _export.F * !_iterDetect(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = _toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = core_getIteratorMethod(O)
      , length, result, step, iterator;
    if(mapping)mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && _isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = _toLength(O.length);
      for(result = new C(length); length > index; index++){
        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

var from$1 = _core.Array.from;

var from = createCommonjsModule(function (module) {
module.exports = { "default": from$1, __esModule: true };
});

var _Array$from = unwrapExports(from);

var toConsumableArray = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _from2 = _interopRequireDefault(from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};
});

var _toConsumableArray = unwrapExports(toConsumableArray);

/**
 * toxic-utils v0.1.5
 * (c) 2017 toxic-johann
 * Released under MIT
 */

/**
 * the handler to generate an deep traversal handler
 * @param  {Function} fn the function you wanna run when you reach in the deep property
 * @return {Function}    the handler
 */
function genTraversalHandler(fn) {
  function recursiveFn(source, target, key) {
    if (isArray$1(source) || isObject$1(source)) {
      target = target || (isObject$1(source) ? {} : []);
      for (var _key in source) {
        target[_key] = recursiveFn(source[_key], target[_key], _key);
      }
      return target;
    }
    return fn(source, target, key);
  }
  return recursiveFn;
}
var _deepAssign = genTraversalHandler(function (val) {
  return val;
});
/**
 * deeply clone an object
 * @param  {Array|Object} source if you pass in other type, it will throw an error
 * @return {clone-target}        the new Object
 */
function deepClone(source) {
  if (isPrimitive(source)) {
    throw new TypeError('deepClone only accept non primitive type');
  }
  return _deepAssign(source);
}
/**
 * merge multiple objects
 * @param  {...Object} args [description]
 * @return {merge-object}         [description]
 */
function deepAssign() {
  for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
    args[_key2] = arguments[_key2];
  }

  if (args.length < 2) {
    throw new Error('deepAssign accept two and more argument');
  }
  for (var i = args.length - 1; i > -1; i--) {
    if (isPrimitive(args[i])) {
      throw new TypeError('deepAssign only accept non primitive type');
    }
  }
  var target = args.shift();
  args.forEach(function (source) {
    return _deepAssign(source, target);
  });
  return target;
}

/**
 * camelize any string, e.g hello world -> helloWorld
 * @param  {string} str only accept string!
 * @return {string}     camelize string
 */
function camelize(str, isBig) {
  return str.replace(/(^|[^a-zA-Z]+)([a-zA-Z])/g, function (match, spilt, initials, index) {
    return !isBig && index === 0 ? initials.toLowerCase() : initials.toUpperCase();
  });
}
/**
 * hypenate any string e.g hello world -> hello-world
 * @param  {string} str only accept string
 * @return {string}
 */
function hypenate(str) {
  return camelize(str).replace(/([A-Z])/g, function (match) {
    return '-' + match.toLowerCase();
  });
}

/**
 * bind the function with some context. we have some fallback strategy here
 * @param {function} fn the function which we need to bind the context on
 * @param {any} context the context object
 */
function bind(fn, context) {
  if (fn.bind) {
    return fn.bind(context);
  } else if (fn.apply) {
    return function __autobind__() {
      for (var _len2 = arguments.length, args = Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return fn.apply(context, args);
    };
  } else {
    return function __autobind__() {
      for (var _len3 = arguments.length, args = Array(_len3), _key4 = 0; _key4 < _len3; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return fn.call.apply(fn, [context].concat(_toConsumableArray(args)));
    };
  }
}

/**
 * generate an uuid
 */
function uuid() {
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}
/**
 * generate an random number which length is 4
 */
function S4() {
  return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
}

/**
 * generate an random number with specific length
 */
function rand(length) {
  var str = '';
  while (str.length < length) {
    str += S4();
  }
  return str.slice(0, length);
}

/**
 * get an deep property
 */
function getDeepProperty(obj, keys) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$throwError = _ref.throwError,
      throwError = _ref$throwError === undefined ? false : _ref$throwError,
      backup = _ref.backup;

  if (isString(keys)) {
    keys = keys.split('.');
  }
  if (!isArray$1(keys)) {
    throw new TypeError('keys of getDeepProperty must be string or Array<string>');
  }
  var read = [];
  var target = obj;
  for (var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i];
    if (isVoid(target)) {
      if (throwError) {
        throw new Error('obj' + (read.length > 0 ? '.' + read.join('.') : ' itself') + ' is ' + target);
      } else {
        return backup;
      }
    }
    target = target[key];
    read.push(key);
  }
  return target;
}

/**
 * chimee-helper-utils v0.1.3
 * (c) 2017 toxic-johann
 * Released under MIT
 */

// **********************  judgement   ************************
/**
 * check if the code running in browser environment (not include worker env)
 * @returns {Boolean}
 */
var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';

// **********************  对象操作  ************************
/**
 * 转变一个类数组对象为数组
 */
function makeArray(obj) {
  return _Array$from(obj);
}

/**
 * sort Object attributes by function
 * and transfer them into array
 * @param  {Object} obj Object form from numric
 * @param  {Function} fn sort function
 * @return {Array} the sorted attirbutes array
 */
function transObjectAttrIntoArray(obj) {
  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (a, b) {
    return +a - +b;
  };

  return _Object$keys(obj).sort(fn).reduce(function (order, key) {
    return order.concat(obj[key]);
  }, []);
}
/**
 * run a queue one by one.If include function reject or return false it will stop
 * @param  {Array} queue the queue which we want to run one by one
 * @return {Promise}    tell us whether a queue run finished
 */
function runRejectableQueue(queue) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return new _Promise(function (resolve, reject) {
    var step = function step(index) {
      if (index >= queue.length) {
        resolve();
        return;
      }
      var result = isFunction(queue[index]) ? queue[index].apply(queue, _toConsumableArray(args)) : queue[index];
      if (result === false) return reject('stop');
      return _Promise.resolve(result).then(function () {
        return step(index + 1);
      }).catch(function (err) {
        return reject(err || 'stop');
      });
    };
    step(0);
  });
}
/**
 * run a queue one by one.If include function return false it will stop
 * @param  {Array} queue the queue which we want to run one by one
 * @return {boolean} tell the user if the queue run finished
 */
function runStoppableQueue(queue) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  var step = function step(index) {
    if (index >= queue.length) {
      return true;
    }
    var result = isFunction(queue[index]) ? queue[index].apply(queue, _toConsumableArray(args)) : queue[index];
    if (result === false) return false;
    return step(++index);
  };
  return step(0);
}
/**
 * set an attribute to an object which is frozen.
 * Means you can't remove it, iterate it or rewrite it.
 * @param {!primitive} obj
 * @param {string} key
 * @param {Anything} value
 */
function setFrozenAttr(obj, key, value) {
  if (isPrimitive(obj)) throw TypeError('setFrozenAttr obj parameter can not be primitive type');
  if (!isString(key)) throw TypeError('setFrozenAttr key parameter must be String');
  _Object$defineProperty(obj, key, {
    value: value,
    configurable: false,
    enumerable: false,
    writable: false
  });
}
/**
 * set attr on an Object. We will bind getter and setter on it if you provide to us
 * @param {!primitive} obj
 * @param {string} key
 * @param {Function} get
 * @param {Function} set
 * @param {String} prefix the origin data's prefix. We do not plan to save it by closure.
 */
function setAttrGetterAndSetter(obj, key) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      get = _ref.get,
      set = _ref.set;

  var prefix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '__';

  if (isPrimitive(obj)) throw TypeError('setFrozenAttr obj parameter can not be primitive type');
  if (!isString(key)) throw TypeError('setAttrGetterAndSetter key parameter must be String');
  var originalData = obj[key];
  if (!isFunction(get)) {
    _Object$defineProperty(obj, prefix + key, {
      value: originalData,
      configurable: true,
      writable: true,
      enumerable: false
    });
    get = function get() {
      return this[prefix + key];
    };
    if (set && isFunction(set)) {
      var originSetter = set;
      set = function set() {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        this[prefix + key] = originSetter.call.apply(originSetter, [this].concat(args));
      };
    }
  }
  _Object$defineProperty(obj, key, { get: get, set: set });
}

function checkContinuation(uint8array, start, checkLength) {
  var array = uint8array;
  if (start + checkLength < array.length) {
    while (checkLength--) {
      if ((array[++start] & 0xC0) !== 0x80) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

// decodeUTF8
function decodeUTF8(uint8array) {
  var out = [];
  var input = uint8array;
  var i = 0;
  var length = uint8array.length;

  while (i < length) {
    if (input[i] < 0x80) {
      out.push(String.fromCharCode(input[i]));
      ++i;
      continue;
    } else if (input[i] < 0xC0) {
      // fallthrough
    } else if (input[i] < 0xE0) {
      if (checkContinuation(input, i, 1)) {
        var ucs4 = (input[i] & 0x1F) << 6 | input[i + 1] & 0x3F;
        if (ucs4 >= 0x80) {
          out.push(String.fromCharCode(ucs4 & 0xFFFF));
          i += 2;
          continue;
        }
      }
    } else if (input[i] < 0xF0) {
      if (checkContinuation(input, i, 2)) {
        var _ucs = (input[i] & 0xF) << 12 | (input[i + 1] & 0x3F) << 6 | input[i + 2] & 0x3F;
        if (_ucs >= 0x800 && (_ucs & 0xF800) !== 0xD800) {
          out.push(String.fromCharCode(_ucs & 0xFFFF));
          i += 3;
          continue;
        }
      }
    } else if (input[i] < 0xF8) {
      if (checkContinuation(input, i, 3)) {
        var _ucs2 = (input[i] & 0x7) << 18 | (input[i + 1] & 0x3F) << 12 | (input[i + 2] & 0x3F) << 6 | input[i + 3] & 0x3F;
        if (_ucs2 > 0x10000 && _ucs2 < 0x110000) {
          _ucs2 -= 0x10000;
          out.push(String.fromCharCode(_ucs2 >>> 10 | 0xD800));
          out.push(String.fromCharCode(_ucs2 & 0x3FF | 0xDC00));
          i += 4;
          continue;
        }
      }
    }
    out.push(String.fromCharCode(0xFFFD));
    ++i;
  }
  return out.join('');
}

function debounce(func, wait, immediate) {
  // immediate默认为false
  var timeout = void 0,
      args = void 0,
      context = void 0,
      timestamp = void 0,
      result = void 0;

  var later = function later() {
    // 当wait指定的时间间隔期间多次调用_.debounce返回的函数，则会不断更新timestamp的值，导致last < wait && last >= 0一直为true，从而不断启动新的计时器延时执行func
    var last = new Date() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function () {
    context = this;
    args = arguments;
    timestamp = new Date();
    // 第一次调用该方法时，且immediate为true，则调用func函数
    var callNow = immediate && !timeout;
    // 在wait指定的时间间隔内首次调用该方法，则启动计时器定时调用func函数
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * 函数节流（控制函数执行频率）
 * @param  {Function} func 要节流控制的函数，必填
 * @return {Number}   wait 等待时长
 * @return {Object}   options {
 *                      leading<是否首次调用立即执行，否：则按wait设定等待到期后调用才执行>:false,
 *                      trailing<是否在调用并未到期时启用定时器，以保证一定执行>:true
 *                    }
 * @return {Object}   cxt 上下文对象
 * @return {Function}
 */
function throttle(func, wait, options, cxt) {
  /* options的默认值
   *  表示首次调用返回值方法时，会马上调用func；否则仅会记录当前时刻，当第二次调用的时间间隔超过wait时，才调用func。
   *  options.leading = true;
   * 表示当调用方法时，未到达wait指定的时间间隔，则启动计时器延迟调用func函数，若后续在既未达到wait指定的时间间隔和func函数又未被调用的情况下调用返回值方法，则被调用请求将被丢弃。
   *  options.trailing = true;
   * 注意：当options.trailing = false时，效果与上面的简单实现效果相同
   */
  var context = void 0,
      args = void 0,
      result = void 0;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function later() {
    previous = options.leading === false ? 0 : new Date() - 0;
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  wait = wait || 0;
  return function () {
    var now = new Date();
    if (!previous && options.leading === false) previous = now;
    // 计算剩余时间
    var remaining = wait - (now - previous);
    if (cxt) {
      context = cxt;
    } else {
      context = this;
    }

    args = arguments;
    // 当到达wait指定的时间间隔，则调用func函数
    // 精彩之处：按理来说remaining <= 0已经足够证明已经到达wait的时间间隔，但这里还考虑到假如客户端修改了系统时间则马上执行func函数。
    if (remaining <= 0 || remaining > wait) {
      // 由于setTimeout存在最小时间精度问题，因此会存在到达wait的时间间隔，但之前设置的setTimeout操作还没被执行，因此为保险起见，这里先清理setTimeout操作
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      // options.trailing=true时，延时执行func函数
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

// requestAnimationFrame
var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (cb) {
  return setTimeout(cb, 17);
};

// cancelAnimationFrame
var caf = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.msCancelAnimationFrame || window.oCancelAnimationFrame || function (id) {
  clearTimeout(id);
};

// 根据要求的位数，将9格式化为 09\009\0009...
function strRepeat(num, bit) {
  var pBit = bit;
  num = '' + (num || '');
  var numLen = num.length;
  bit = (bit || numLen) - numLen;
  var paddingStr = bit > 0 ? num.repeat ? '0'.repeat(bit) : new Array(bit + 1).join('0') : '';
  return (paddingStr + num).slice(0, pBit);
}

// video 时间格式化
function formatTime(time) {
  var hh = Math.floor(time / 3600);
  time = Math.floor(time % 3600);
  var mm = strRepeat(Math.floor(time / 60), 2);
  time = Math.floor(time % 60);
  var ss = strRepeat(time, 2);
  return hh >= 1 ? hh + ':' + mm + ':' + ss : mm + ':' + ss;
}

/**
 * 给obj对象扩展上trans方法，用以实现methodName对应的属性方法包装为静态函数且保持上下文的功能
 * @param  {Object} obj 目标对象
 */
function addTransMethod(obj) {
  setFrozenAttr(obj, 'trans', function (methodName) {
    if (!obj.__fns) {
      setFrozenAttr(obj, '__fns', {});
    }
    if (!obj.__fns[methodName]) {
      obj.__fns[methodName] = function () {
        if (!isFunction(obj[methodName])) throw TypeError('obj.trans(methodName) parameter must be Function');
        return obj[methodName].apply(obj, arguments);
      };
    }
    return obj.__fns[methodName];
  });
}

/**
 * 追加样式代码到head的style标签，不存在则创建
 * @param {String} cssText 样式文本
 * @return {HTMLElement}
 */
function appendCSS(cssText) {
  var doc = document;
  var styleEl = doc.querySelector('style');
  if (!styleEl) {
    styleEl = doc.createElement('style');
    var header = doc.querySelector('head');
    header && header.appendChild(styleEl);
  }
  styleEl.appendChild(doc.createTextNode(cssText));
  return styleEl;
}

/**
 * 格式化日期对象为：年-月-日 时:分:秒.毫秒
 * @param {Date} date Date日期对象
 * @param {String} pattern 要输出的日期格式，默认：`yyyy-MM-dd hh:mm:ss.i`
 * @return {String}
 */
function formatDate() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  var pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yyyy-MM-dd hh:mm:ss.i';

  var year = date.getFullYear().toString();
  var fields = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    i: date.getMilliseconds()
  };
  pattern = pattern.replace(/(y+)/ig, function (_, yearPattern) {
    return year.substr(4 - Math.min(4, yearPattern.length));
  });

  var _loop = function _loop(i) {
    pattern = pattern.replace(new RegExp('(' + i + '+)', 'g'), function (_, pattStr) {
      return (fields[i] < 10 && pattStr.length > 1 ? '0' : '') + fields[i];
    });
  };

  for (var i in fields) {
    _loop(i);
  }
  return pattern;
}

/**
 * 读取本地存储的值（不支持localStorage则降级到cookie）
 * @param {String} key 目标数据key
 * @return {String}
 */
function getLocalStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    try {
      var regRt = document.cookie.match(new RegExp('(^| )' + key + '=([^;]*)(;|$)'));
      return isArray$1(regRt) ? unescape(regRt[2]) : '';
    } catch (e) {
      return '';
    }
  }
}
/**
 * 将指定key对应值写入本地存储（不支持localStorage则降级到cookie）
 * @param {String} key
 * @param {String} val
 * @return {String}
 */
function setLocalStorage(key, val) {
  try {
    window.localStorage.setItem(key, val);
  } catch (e) {
    var expires = new Date();
    // 默认存储300天
    expires.setTime(expires.getTime() + 24 * 3600 * 1000 * 300);
    try {
      document.cookie = key + '=' + escape(val) + ';expires=' + expires.toUTCString() + ';path=/;';
    } catch (e) {}
  }
}

// 19.1.2.1 Object.assign(target, source, ...)
var $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = _toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = _objectGops.f
    , isEnum     = _objectPie.f;
  while(aLen > index){
    var S      = _iobject(arguments[index++])
      , keys   = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;

// 19.1.3.1 Object.assign(target, source)


_export(_export.S + _export.F, 'Object', {assign: _objectAssign});

var assign$1 = _core.Object.assign;

var assign = createCommonjsModule(function (module) {
module.exports = { "default": assign$1, __esModule: true };
});

var _Object$assign = unwrapExports(assign);

/**
 * chimee-helper-events v0.1.0
 * (c) 2017 toxic-johann
 * Released under MIT
 */

/**
* @module event
* @author huzunjie
* @description 自定义事件基础类
*/

/* 缓存事件监听方法及包装，内部数据格式：
 * targetIndex_<type:'click|mouseup|done'>: [ [
 *   function(){ ... handler ... },
 *   function(){ ... handlerWrap ... handler.apply(target, arguments) ... },
 *   isOnce
 * ]]
 */
var _evtListenerCache = _Object$create(null);
_evtListenerCache.count = 0;

/**
 * 得到某对象的某事件类型对应的监听队列数组
 * @param  {Object}  target 发生事件的对象
 * @param {String} type 事件类型(这里的时间类型不只是名称，还是缓存标识，可以通过添加后缀来区分)
 * @return {Array}
 */
function getEvtTypeCache(target, type) {

  var evtId = target.__evt_id;
  if (!evtId) {

    /* 设置__evt_id不可枚举 */
    Object.defineProperty(target, '__evt_id', {
      writable: true,
      enumerable: false,
      configurable: true
    });

    /* 空对象初始化绑定索引 */
    evtId = target.__evt_id = ++_evtListenerCache.count;
  }

  var typeCacheKey = evtId + '_' + type;
  var evtTypeCache = _evtListenerCache[typeCacheKey];
  if (!evtTypeCache) {
    evtTypeCache = _evtListenerCache[typeCacheKey] = [];
  }

  return evtTypeCache;
}

/**
 * 触发事件监听方法
 * @param  {Object}  target 发生事件的对象
 * @param {String} type 事件类型
 * @param {Object} eventObj 触发事件时要传回的event对象
 * @return {undefined}
 */
function emitEventCache(target, type, eventObj) {
  var evt = _Object$create(null);
  evt.type = type;
  evt.target = target;
  if (eventObj) {
    _Object$assign(evt, isObject$1(eventObj) ? eventObj : { data: eventObj });
  }
  getEvtTypeCache(target, type).forEach(function (item) {
    (item[1] || item[0]).apply(target, [evt]);
  });
}

/**
 * 添加事件监听到缓存
 * @param  {Object}  target 发生事件的对象
 * @param {String} type 事件类型
 * @param {Function} handler 监听函数
 * @param {Boolean} isOnce 是否单次执行
 * @param {Function} handlerWrap
 * @return {undefined}
 */
function addEventCache(target, type, handler) {
  var isOnce = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var handlerWrap = arguments[4];

  if (isFunction(isOnce) && !handlerWrap) {
    handlerWrap = isOnce;
    isOnce = undefined;
  }
  var handlers = [handler, undefined, isOnce];
  if (isOnce && !handlerWrap) {
    handlerWrap = function handlerWrap() {
      removeEventCache(target, type, handler, isOnce);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      handler.apply(target, args);
    };
  }
  if (handlerWrap) {
    handlers[1] = handlerWrap;
  }
  getEvtTypeCache(target, type).push(handlers);
}

/**
 * 移除事件监听
 * @param  {Object}  target 发生事件的对象
 * @param {String} type 事件类型
 * @param {Function} handler 监听函数
 * @return {undefined}
 */
function removeEventCache(target, type, handler) {
  var isOnce = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  var typeCache = getEvtTypeCache(target, type);

  if (handler || isOnce) {
    /* 有指定 handler 则清除对应监听 */
    var handlerId = -1;
    var handlerWrap = void 0;
    typeCache.find(function (item, i) {
      if ((!handler || item[0] === handler) && (!isOnce || item[2])) {
        handlerId = i;
        handlerWrap = item[1];
        return true;
      }
    });
    if (handlerId !== -1) {
      typeCache.splice(handlerId, 1);
    }
    return handlerWrap;
  } else {
    /* 未指定 handler 则清除type对应的所有监听 */
    typeCache.length = 0;
  }
}

/**
 * @class CustEvent
 * @description
 * Event 自定义事件类
 * 1. 可以使用不传参得到的实例作为eventBus使用
 * 2. 可以通过指定target，用多个实例操作同一target对象的事件管理
 * 3. 当设定target时，可以通过设置assign为true，来给target实现"on\once\off\emit"方法
 * @param  {Object}  target 发生事件的对象（空则默认为event实例）
 * @param  {Boolean}  assign 是否将"on\once\off\emit"方法实现到target对象上
 * @return {event}
 */
var CustEvent = function () {
  function CustEvent(target, assign$$1) {
    var _this = this;

    _classCallCheck(this, CustEvent);

    /* 设置__target不可枚举 */
    Object.defineProperty(this, '__target', {
      writable: true,
      enumerable: false,
      configurable: true
    });
    this.__target = this;

    if (target) {

      if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
        throw new Error('CusEvent target are not object');
      }
      this.__target = target;

      /* 为target实现on\once\off\emit */
      if (assign$$1) {
        ['on', 'once', 'off', 'emit'].forEach(function (mth) {
          target[mth] = _this[mth];
        });
      }
    }
  }

  /**
   * 添加事件监听
   * @param {String} type 事件类型
   * @param {Function} handler 监听函数
   * @param {Boolean} isOnce 单次监听类型
   * @return {event}
   */


  _createClass(CustEvent, [{
    key: 'on',
    value: function on(type, handler) {
      var isOnce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      addEventCache(this.__target, type, handler, isOnce);
      return this;
    }

    /**
     * 添加事件监听,并且只执行一次
     * @param {String} type 事件类型
     * @param {Function} handler 监听函数
     * @return {event}
     */

  }, {
    key: 'once',
    value: function once(type, handler) {
      return this.on(type, handler, true);
    }

    /**
     * 移除事件监听
     * @param {String} type 事件类型
     * @param {Function} handler 监听函数(不指定handler则清除type对应的所有事件监听)
     * @param {Boolean} isOnce 单次监听类型
     * @return {event}
     */

  }, {
    key: 'off',
    value: function off(type, handler) {
      var isOnce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      removeEventCache(this.__target, type, handler, isOnce);
      return this;
    }

    /**
     * 触发事件监听函数
     * @param {String} type 事件类型
     * @return {event}
     */

  }, {
    key: 'emit',
    value: function emit(type, data) {
      emitEventCache(this.__target, type, { data: data });
      return this;
    }
  }]);

  return CustEvent;
}();

/**
 * chimee-helper-dom v0.1.2
 * (c) 2017 huzunjie
 * Released under MIT
 */

/**
 * chimee-helper-events v0.1.0
 * (c) 2017 toxic-johann
 * Released under MIT
 */

/**
* @module event
* @author huzunjie
* @description 自定义事件基础类
*/

/* 缓存事件监听方法及包装，内部数据格式：
 * targetIndex_<type:'click|mouseup|done'>: [ [
 *   function(){ ... handler ... },
 *   function(){ ... handlerWrap ... handler.apply(target, arguments) ... },
 *   isOnce
 * ]]
 */
var _evtListenerCache$1 = _Object$create(null);
_evtListenerCache$1.count = 0;

/**
 * 得到某对象的某事件类型对应的监听队列数组
 * @param  {Object}  target 发生事件的对象
 * @param {String} type 事件类型(这里的时间类型不只是名称，还是缓存标识，可以通过添加后缀来区分)
 * @return {Array}
 */
function getEvtTypeCache$1(target, type) {

  var evtId = target.__evt_id;
  if (!evtId) {

    /* 设置__evt_id不可枚举 */
    Object.defineProperty(target, '__evt_id', {
      writable: true,
      enumerable: false,
      configurable: true
    });

    /* 空对象初始化绑定索引 */
    evtId = target.__evt_id = ++_evtListenerCache$1.count;
  }

  var typeCacheKey = evtId + '_' + type;
  var evtTypeCache = _evtListenerCache$1[typeCacheKey];
  if (!evtTypeCache) {
    evtTypeCache = _evtListenerCache$1[typeCacheKey] = [];
  }

  return evtTypeCache;
}

/**
 * 触发事件监听方法
 * @param  {Object}  target 发生事件的对象
 * @param {String} type 事件类型
 * @param {Object} eventObj 触发事件时要传回的event对象
 * @return {undefined}
 */
function emitEventCache$1(target, type, eventObj) {
  var evt = _Object$create(null);
  evt.type = type;
  evt.target = target;
  if (eventObj) {
    _Object$assign(evt, isObject$1(eventObj) ? eventObj : { data: eventObj });
  }
  getEvtTypeCache$1(target, type).forEach(function (item) {
    (item[1] || item[0]).apply(target, [evt]);
  });
}

/**
 * 添加事件监听到缓存
 * @param  {Object}  target 发生事件的对象
 * @param {String} type 事件类型
 * @param {Function} handler 监听函数
 * @param {Boolean} isOnce 是否单次执行
 * @param {Function} handlerWrap
 * @return {undefined}
 */
function addEventCache$1(target, type, handler) {
  var isOnce = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var handlerWrap = arguments[4];

  if (isFunction(isOnce) && !handlerWrap) {
    handlerWrap = isOnce;
    isOnce = undefined;
  }
  var handlers = [handler, undefined, isOnce];
  if (isOnce && !handlerWrap) {
    handlerWrap = function handlerWrap() {
      removeEventCache$1(target, type, handler, isOnce);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      handler.apply(target, args);
    };
  }
  if (handlerWrap) {
    handlers[1] = handlerWrap;
  }
  getEvtTypeCache$1(target, type).push(handlers);
}

/**
 * 移除事件监听
 * @param  {Object}  target 发生事件的对象
 * @param {String} type 事件类型
 * @param {Function} handler 监听函数
 * @return {undefined}
 */
function removeEventCache$1(target, type, handler) {
  var isOnce = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  var typeCache = getEvtTypeCache$1(target, type);

  if (handler || isOnce) {
    /* 有指定 handler 则清除对应监听 */
    var handlerId = -1;
    var handlerWrap = void 0;
    typeCache.find(function (item, i) {
      if ((!handler || item[0] === handler) && (!isOnce || item[2])) {
        handlerId = i;
        handlerWrap = item[1];
        return true;
      }
    });
    if (handlerId !== -1) {
      typeCache.splice(handlerId, 1);
    }
    return handlerWrap;
  } else {
    /* 未指定 handler 则清除type对应的所有监听 */
    typeCache.length = 0;
  }
}

/**
 * @class CustEvent
 * @description
 * Event 自定义事件类
 * 1. 可以使用不传参得到的实例作为eventBus使用
 * 2. 可以通过指定target，用多个实例操作同一target对象的事件管理
 * 3. 当设定target时，可以通过设置assign为true，来给target实现"on\once\off\emit"方法
 * @param  {Object}  target 发生事件的对象（空则默认为event实例）
 * @param  {Boolean}  assign 是否将"on\once\off\emit"方法实现到target对象上
 * @return {event}
 */
var CustEvent$1 = function () {
  function CustEvent(target, assign$$1) {
    var _this = this;

    _classCallCheck(this, CustEvent);

    /* 设置__target不可枚举 */
    Object.defineProperty(this, '__target', {
      writable: true,
      enumerable: false,
      configurable: true
    });
    this.__target = this;

    if (target) {

      if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
        throw new Error('CusEvent target are not object');
      }
      this.__target = target;

      /* 为target实现on\once\off\emit */
      if (assign$$1) {
        ['on', 'once', 'off', 'emit'].forEach(function (mth) {
          target[mth] = _this[mth];
        });
      }
    }
  }

  /**
   * 添加事件监听
   * @param {String} type 事件类型
   * @param {Function} handler 监听函数
   * @param {Boolean} isOnce 单次监听类型
   * @return {event}
   */


  _createClass(CustEvent, [{
    key: 'on',
    value: function on(type, handler) {
      var isOnce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      addEventCache$1(this.__target, type, handler, isOnce);
      return this;
    }

    /**
     * 添加事件监听,并且只执行一次
     * @param {String} type 事件类型
     * @param {Function} handler 监听函数
     * @return {event}
     */

  }, {
    key: 'once',
    value: function once(type, handler) {
      return this.on(type, handler, true);
    }

    /**
     * 移除事件监听
     * @param {String} type 事件类型
     * @param {Function} handler 监听函数(不指定handler则清除type对应的所有事件监听)
     * @param {Boolean} isOnce 单次监听类型
     * @return {event}
     */

  }, {
    key: 'off',
    value: function off(type, handler) {
      var isOnce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      removeEventCache$1(this.__target, type, handler, isOnce);
      return this;
    }

    /**
     * 触发事件监听函数
     * @param {String} type 事件类型
     * @return {event}
     */

  }, {
    key: 'emit',
    value: function emit(type, data) {
      emitEventCache$1(this.__target, type, { data: data });
      return this;
    }
  }]);

  return CustEvent;
}();

/**
 * chimee-helper-utils v0.1.3
 * (c) 2017 toxic-johann
 * Released under MIT
 */

// **********************  judgement   ************************
/**
 * check if the code running in browser environment (not include worker env)
 * @returns {Boolean}
 */
var inBrowser$1 = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';

// **********************  对象操作  ************************
/**
 * 转变一个类数组对象为数组
 */
function makeArray$1(obj) {
  return _Array$from(obj);
}

/**
* @module dom
* @author huzunjie
* @description 一些常用的DOM判断及操作方法，可以使用dom.$('*')包装DOM，实现类jQuery的链式操作；当然这里的静态方法也可以直接使用。
*/

var _divEl = document.createElement('div');
var _textAttrName = 'innerText';
'textContent' in _divEl && (_textAttrName = 'textContent');
var _arrPrototype = Array.prototype;

/**
 * 读取HTML元素属性值
 * @param {HTMLElement} el 目标元素
 * @param {String} attrName 目标属性名称
 * @return {String}
 */
function getAttr(el, attrName) {
  return el.getAttribute(attrName);
}

/**
 * 设置HTML元素属性值
 * @param {HTMLElement} el 目标元素
 * @param {String} attrName 目标属性名称
 * @param {String} attrVal 目标属性值
 */
function setAttr(el, attrName, attrVal) {
  if (attrVal === undefined) {
    el.removeAttribute(attrName);
  } else {
    el.setAttribute(attrName, attrVal);
  }
}

/**
 * 为HTML元素添加className
 * @param {HTMLElement} el 目标元素
 * @param {String} cls 要添加的className（多个以空格分割）
 */
function addClassName(el, cls) {
  if (!cls || !(cls = cls.trim())) {
    return;
  }
  var clsArr = cls.split(/\s+/);
  if (el.classList) {
    clsArr.forEach(function (c) {
      return el.classList.add(c);
    });
  } else {
    var curCls = ' ' + (el.className || '') + ' ';
    clsArr.forEach(function (c) {
      curCls.indexOf(' ' + c + ' ') === -1 && (curCls += ' ' + c);
    });
    el.className = curCls.trim();
  }
}

/**
 * 为HTML元素移除className
 * @param {HTMLElement} el 目标元素
 * @param {String} cls 要移除的className（多个以空格分割）
 */
function removeClassName(el, cls) {
  if (!cls || !(cls = cls.trim())) {
    return;
  }

  var clsArr = cls.split(/\s+/);
  if (el.classList) {
    clsArr.forEach(function (c) {
      return el.classList.remove(c);
    });
  } else {
    var curCls = ' ' + el.className + ' ';
    clsArr.forEach(function (c) {
      var tar = ' ' + c + ' ';
      while (curCls.indexOf(tar) !== -1) {
        curCls = curCls.replace(tar, ' ');
      }
    });
    el.className = curCls.trim();
  }
}

/**
 * 检查HTML元素是否已设置className
 * @param {HTMLElement} el 目标元素
 * @param {String} className 要检查的className
 * @return {Boolean}
 */
function hasClassName(el, className) {
  return new RegExp('(?:^|\\s)' + className + '(?=\\s|$)').test(el.className);
}

/**
 * 为HTML元素移除事件监听
 * @param {HTMLElement} el 目标元素
 * @param {String} type 事件名称
 * @param {Function} handler 处理函数
 * @param {Boolean} once 是否只监听一次
 * @param {Boolean} capture 是否在捕获阶段的监听
 */
function removeEvent(el, type, handler) {
  var once = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var capture = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  if (once) {
    /* 尝试从缓存中读取包装后的方法 */
    var handlerWrap = removeEventCache$1(el, type + '_once', handler);
    if (handlerWrap) {
      handler = handlerWrap;
    }
  }
  el.removeEventListener(type, handler, capture);
}

/**
 * 为HTML元素添加事件监听
 * @param {HTMLElement} el 目标元素
 * @param {String} type 事件名称
 * @param {Function} handler 处理函数
 * @param {Boolean} once 是否只监听一次
 * @param {Boolean} capture 是否在捕获阶段监听
 */
function addEvent(el, type, handler) {
  var once = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var capture = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  if (once) {
    var oldHandler = handler;
    handler = function () {
      return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        oldHandler.apply(this, args);
        removeEvent(el, type, handler, once, capture);
      };
    }();
    /* 将包装后的方法记录到缓存中 */
    addEventCache$1(el, type + '_once', oldHandler, handler);
  }

  el.addEventListener(type, handler, capture);
}

/**
 * 为HTML元素添加事件代理
 * @param {HTMLElement} el 目标元素
 * @param {String} selector 要被代理的元素
 * @param {String} type 事件名称
 * @param {Function} handler 处理函数
 * @param {Boolean} capture 是否在捕获阶段监听
 */
function addDelegate(el, selector, type, handler) {
  var capture = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;


  var handlerWrap = function handlerWrap(e) {
    var targetEls = findParents(e.target || e.srcElement, el, true);
    var targetEl = query(selector, el, true).find(function (seEl) {
      return targetEls.find(function (tgEl) {
        return seEl === tgEl;
      });
    });
    targetEl && handler.apply(targetEl, arguments);
  };
  /* 将包装后的方法记录到缓存中 */
  addEventCache$1(el, type + '_delegate_' + selector, handler, handlerWrap);
  el.addEventListener(type, handlerWrap, capture);
}

/**
 * 为HTML元素移除事件代理
 * @param {HTMLElement} el 目标元素
 * @param {String} selector 要被代理的元素
 * @param {String} type 事件名称
 * @param {Function} handler 处理函数
 * @param {Boolean} capture 是否在捕获阶段监听
 */
function removeDelegate(el, selector, type, handler) {
  var capture = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  /* 尝试从缓存中读取包装后的方法 */
  var handlerWrap = removeEventCache$1(el, type + '_delegate_' + selector, handler);
  handlerWrap && el.removeEventListener(type, handlerWrap, capture);
}

/**
 * 读取HTML元素样式值
 * @param {HTMLElement} el 目标元素
 * @param {String} key 样式key
 * @return {String}
 */
function getStyle(el, key) {
  return (el.currentStyle || document.defaultView.getComputedStyle(el, null))[key] || el.style[key];
}

/**
 * 设置HTML元素样式值
 * @param {HTMLElement} el 目标元素
 * @param {String} key 样式key
 * @param {String} val 样式值
 */
function setStyle(el, key, val) {
  if (isObject$1(key)) {
    for (var k in key) {
      setStyle(el, k, key[k]);
    }
  } else {
    el.style[key] = val;
  }
}

/**
 * 根据选择器查询目标元素
 * @param {String} selector 选择器,用于 querySelectorAll
 * @param {HTMLElement} container 父容器
 * @param {Boolean} toArray 强制输出为数组
 * @return {NodeList|Array}
 */
function query(selector) {
  var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  var toArray = arguments[2];

  var retNodeList = container.querySelectorAll(selector);
  return toArray ? _Array$from(retNodeList) : retNodeList;
}

/**
 * 从DOM树中移除el
 * @param {HTMLElement} el 目标元素
 */
function removeEl(el) {
  el.parentNode.removeChild(el);
}

/**
 * 查找元素的父节点们
 * @param {HTMLElement} el 目标元素
 * @param {HTMLElement} endEl 最大父容器（不指定则找到html）
 * @param {Boolean} haveEl 包含当前元素
 * @param {Boolean} haveEndEl 包含设定的最大父容器
 */
function findParents(el) {
  var endEl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var haveEl = arguments[2];
  var haveEndEl = arguments[3];

  var retEls = [];
  if (haveEl) {
    retEls.push(el);
  }
  while (el && el.parentNode !== endEl) {
    el = el.parentNode;
    el && retEls.push(el);
  }
  if (haveEndEl) {
    retEls.push(endEl);
  }
  return retEls;
}

/**
 * 根据选择器查询并得到目标元素的wrap包装器
 * @param {String} selector 选择器,另外支持 HTMLString||NodeList||NodeArray||HTMLElement
 * @param {HTMLElement} container 父容器
 * @return {Object}
 */
function $(selector, container) {
  return selector.constructor === NodeWrap ? selector : new NodeWrap(selector, container);
}

/**
 * @class NodeWrap
 * @description
 * NodeWrap DOM包装器，用以实现基本的链式操作
 * new dom.NodeWrap('*') 相当于 dom.$('*')
 * 这里面用于DOM操作的属性方法都是基于上面静态方法实现，有需要可以随时修改补充
 * @param {String} selector 选择器(兼容 String||HTMLString||NodeList||NodeArray||HTMLElement)
 * @param {HTMLElement} container 父容器（默认为document）
 */

var NodeWrap = function () {
  function NodeWrap(selector) {
    var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

    _classCallCheck(this, NodeWrap);

    var _this = this;
    _this.selector = selector;

    /* String||NodeList||HTMLElement 识别处理 */
    var elsArr = void 0;
    if (selector && selector.constructor === NodeList) {
      /* 支持直接传入NodeList来构建包装器 */
      elsArr = makeArray$1(selector);
    } else if (isArray$1(selector)) {
      /* 支持直接传入Node数组来构建包装器 */
      elsArr = selector;
    } else if (isString(selector)) {
      if (selector.indexOf('<') === 0) {
        /* 支持直接传入HTML字符串来新建DOM并构建包装器 */
        _divEl.innerHTML = selector;
        elsArr = query('*', _divEl, true);
      } else {
        /* 支持直接传入字符串选择器来查找DOM并构建包装器 */
        elsArr = query(selector, container, true);
      }
    } else {
      /* 其他任意对象直接构建包装器 */
      elsArr = [selector];
    }
    _Object$assign(_this, elsArr);

    /* NodeWrap本意可以 extends Array省略构造方法中下面这部分代码，但目前编译不支持 */
    _this.length = elsArr.length;
  }

  /**
   * 循环遍历DOM集合
   * @param {Function} fn 遍历函数 fn(item, i)
   * @return {Object}
   */


  _createClass(NodeWrap, [{
    key: 'each',
    value: function each() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      _arrPrototype.forEach.apply(this, args);
      return this;
    }
  }, {
    key: 'push',


    /**
     * 添加元素到DOM集合
     * @param {HTMLElement} el 要加入的元素
     * @return {this}
     */
    value: function push() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      _arrPrototype.push.apply(this, args);
      return this;
    }
  }, {
    key: 'splice',


    /**
     * 截取DOM集合片段，并得到新的包装器splice
     * @param {Nubmer} start
     * @param {Nubmer} count
     * @return {NodeWrap} 新的DOM集合包装器
     */
    value: function splice() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return $(_arrPrototype.splice.apply(this, args));
    }
  }, {
    key: 'find',


    /**
     * 查找子元素
     * @param {String} selector 选择器
     * @return {NodeWrap} 新的DOM集合包装器
     */
    value: function find(selector) {
      var childs = [];
      this.each(function (el) {
        childs = childs.concat(query(selector, el, true));
      });
      var childsWrap = $(childs);
      childsWrap.parent = this;
      childsWrap.selector = selector;
      return childsWrap;
    }

    /**
     * 添加子元素
     * @param {HTMLElement} childEls 要添加的HTML元素
     * @return {this}
     */

  }, {
    key: 'append',
    value: function append(childEls) {
      var childsWrap = $(childEls);
      var firstEl = this[0];
      childsWrap.each(function (newEl) {
        return firstEl.appendChild(newEl);
      });
      return this;
    }

    /**
     * 将元素集合添加到指定容器
     * @param {HTMLElement} parentEl 要添加到父容器
     * @return {this}
     */

  }, {
    key: 'appendTo',
    value: function appendTo(parentEl) {
      $(parentEl).append(this);
      return this;
    }

    /**
     * DOM集合text内容读写操作
     * @param {String} val 文本内容（如果有设置该参数则执行写操作，否则执行读操作）
     * @return {this}
     */

  }, {
    key: 'text',
    value: function text(val) {
      if (arguments.length === 0) {
        return this[0][_textAttrName];
      }
      return this.each(function (el) {
        el[_textAttrName] = val;
      });
    }

    /**
     * DOM集合HTML内容读写操作
     * @param {String} html html内容（如果有设置该参数则执行写操作，否则执行读操作）
     * @return {this}
     */

  }, {
    key: 'html',
    value: function html(_html) {
      if (arguments.length === 0) {
        return this[0].innerHTML;
      }
      return this.each(function (el) {
        el.innerHTML = _html;
      });
    }

    /**
     * DOM集合属性读写操作
     * @param {String} name 属性名称
     * @param {String} val 属性值（如果有设置该参数则执行写操作，否则执行读操作）
     * @return {this}
     */

  }, {
    key: 'attr',
    value: function attr(name, val) {
      if (arguments.length === 1) {
        return getAttr(this[0], name);
      }
      return this.each(function (el) {
        return setAttr(el, name, val);
      });
    }

    /**
     * DOM集合dataset读写操作
     * @param {String} key 键名
     * @param {Any} val 键值（如果有设置该参数则执行写操作，否则执行读操作）
     * @return {this}
     */

  }, {
    key: 'data',
    value: function data(key, val) {
      if (arguments.length === 0) {
        return this[0].dataset || {};
      }
      if (arguments.length === 1) {
        return (this[0].dataset || {})[key];
      }
      return this.each(function (el) {
        (el.dataset || (el.dataset = {}))[key] = val;
      });
    }

    /**
     * DOM集合样式读写操作
     * @param {String} key 样式key
     * @param {String} val 样式值（如果有设置该参数则执行写操作，否则执行读操作）
     * @return {this}
     */

  }, {
    key: 'css',
    value: function css(key, val) {
      if (arguments.length === 1 && !isObject$1(key)) {
        return getStyle(this[0], key);
      }
      return this.each(function (el) {
        return setStyle(el, key, val);
      });
    }

    /**
     * 为DOM集合增加className
     * @param {String} cls 要增加的className
     * @return {this}
     */

  }, {
    key: 'addClass',
    value: function addClass(cls) {
      return this.each(function (el) {
        return addClassName(el, cls);
      });
    }

    /**
     * 移除当前DOM集合的className
     * @param {String} cls 要移除的className
     * @return {this}
     */

  }, {
    key: 'removeClass',
    value: function removeClass(cls) {
      return this.each(function (el) {
        return removeClassName(el, cls);
      });
    }

    /**
     * 检查索引0的DOM是否有className
     * @param {String} cls 要检查的className
     * @return {this}
     */

  }, {
    key: 'hasClass',
    value: function hasClass(cls) {
      return hasClassName(this[0], cls);
    }

    /**
     * 为DOM集合添加事件监听
     * @param {String} type 事件名称
     * @param {Function} handler 处理函数
     * @param {Boolean} once 是否只监听一次
     * @param {Boolean} capture 是否在捕获阶段监听
     * @return {this}
     */

  }, {
    key: 'on',
    value: function on(type, handler) {
      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      return this.each(function (el) {
        return addEvent(el, type, handler, once, capture);
      });
    }

    /**
     * 为DOM集合解除事件监听
     * @param {String} type 事件名称
     * @param {Function} handler 处理函数
     * @param {Boolean} once 是否只监听一次
     * @param {Boolean} capture 是否在捕获阶段监听
     * @return {this}
     */

  }, {
    key: 'off',
    value: function off(type, handler) {
      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      return this.each(function (el) {
        return removeEvent(el, type, handler, once, capture);
      });
    }

    /**
     * 为DOM集合绑定事件代理
     * @param {String} selector 目标子元素选择器
     * @param {String} type 事件名称
     * @param {Function} handler 处理函数
     * @param {Boolean} capture 是否在捕获阶段监听
     * @return {this}
     */

  }, {
    key: 'delegate',
    value: function delegate(selector, type, handler) {
      var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      return this.each(function (el) {
        return addDelegate(el, selector, type, handler, capture);
      });
    }

    /**
     * 为DOM集合解绑事件代理
     * @param {String} selector 目标子元素选择器
     * @param {String} type 事件名称
     * @param {Function} handler 处理函数
     * @param {Boolean} capture 是否在捕获阶段监听
     * @return {this}
     */

  }, {
    key: 'undelegate',
    value: function undelegate(selector, type, handler) {
      var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      return this.each(function (el) {
        return removeDelegate(el, selector, type, handler, capture);
      });
    }

    /**
     * 从DOM树中移除
     * @return {this}
     */

  }, {
    key: 'remove',
    value: function remove() {
      return this.each(function (el) {
        return removeEl(el);
      });
    }
  }]);

  return NodeWrap;
}();

/**
 * chimee-helper v0.1.15
 * (c) 2017 toxic-johann
 * Released under MIT
 */




var index$3 = Object.freeze({
	Log: Log,
	genTraversalHandler: genTraversalHandler,
	deepClone: deepClone,
	deepAssign: deepAssign,
	camelize: camelize,
	hypenate: hypenate,
	bind: bind,
	uuid: uuid,
	S4: S4,
	rand: rand,
	getDeepProperty: getDeepProperty,
	isVoid: isVoid,
	isArray: isArray$1,
	isFunction: isFunction,
	isObject: isObject$1,
	isNumber: isNumber,
	isNumeric: isNumeric,
	isInteger: isInteger,
	isEmpty: isEmpty,
	isEvent: isEvent,
	isBlob: isBlob,
	isFile: isFile,
	isDate: isDate,
	isString: isString,
	isBoolean: isBoolean,
	isPromise: isPromise,
	isPrimitive: isPrimitive,
	isUrl: isUrl,
	isNode: isNode$2,
	isElement: isElement,
	isChildNode: isChildNode,
	isPosterityNode: isPosterityNode,
	isHTMLString: isHTMLString,
	isError: isError,
	inBrowser: inBrowser,
	makeArray: makeArray,
	transObjectAttrIntoArray: transObjectAttrIntoArray,
	runRejectableQueue: runRejectableQueue,
	runStoppableQueue: runStoppableQueue,
	setFrozenAttr: setFrozenAttr,
	setAttrGetterAndSetter: setAttrGetterAndSetter,
	decodeUTF8: decodeUTF8,
	debounce: debounce,
	throttle: throttle,
	raf: raf,
	caf: caf,
	strRepeat: strRepeat,
	formatTime: formatTime,
	addTransMethod: addTransMethod,
	appendCSS: appendCSS,
	formatDate: formatDate,
	getLocalStorage: getLocalStorage,
	setLocalStorage: setLocalStorage,
	emitEventCache: emitEventCache,
	addEventCache: addEventCache,
	removeEventCache: removeEventCache,
	CustEvent: CustEvent,
	getAttr: getAttr,
	setAttr: setAttr,
	addClassName: addClassName,
	removeClassName: removeClassName,
	hasClassName: hasClassName,
	removeEvent: removeEvent,
	addEvent: addEvent,
	addDelegate: addDelegate,
	removeDelegate: removeDelegate,
	getStyle: getStyle,
	setStyle: setStyle,
	query: query,
	removeEl: removeEl,
	findParents: findParents,
	$: $,
	NodeWrap: NodeWrap
});

var defaultConfig = {
  type: 'vod',
  autoPlay: false,
  box: 'native',
  lockInternalProperty: false,
  debug: true
};

/**
 * mp4解码器
 *
 * @export
 * @class Native
 */

var Native = function (_CustEvent) {
    _inherits(Native, _CustEvent);

    /**
     * Creates an instance of Native.
     * @param {any} videodom video dom对象
     * @param {any} config 配置
     * @memberof Native
     */
    function Native(videodom, config) {
        _classCallCheck(this, Native);

        var _this2 = _possibleConstructorReturn(this, (Native.__proto__ || _Object$getPrototypeOf(Native)).call(this));

        _this2.video = videodom;
        _this2.box = 'Native';
        _this2.config = defaultConfig;
        deepAssign(_this2.config, config);
        _this2.bindEvents();
        return _this2;
    }

    _createClass(Native, [{
        key: 'internalPropertyHandle',
        value: function internalPropertyHandle() {
            if (!_Object$getOwnPropertyDescriptor) {
                return;
            }
            var _this = this;
            var time = _Object$getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime');

            Object.defineProperty(this.video, 'currentTime', {
                get: function get() {
                    return time.get.call(_this.video);
                },
                set: function set(t) {
                    if (!_this.currentTimeLock) {
                        throw new Error('can not set currentTime by youself');
                    } else {
                        return time.set.call(_this.video, t);
                    }
                }
            });
        }
    }, {
        key: 'bindEvents',
        value: function bindEvents() {
            var _this3 = this;

            if (this.video && this.config.lockInternalProperty) {
                this.video.addEventListener('canplay', function () {
                    _this3.internalPropertyHandle();
                });
            }
        }
    }, {
        key: 'load',
        value: function load(src) {
            this.config.src = src || this.config.src;
            this.video.src = this.config.src;
        }
    }, {
        key: 'unload',
        value: function unload() {
            this.video.src = '';
            this.video.removeAttribute('src');
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            if (this.video) {
                this.unload();
            }
        }
    }, {
        key: 'play',
        value: function play() {
            return this.video.play();
        }
    }, {
        key: 'pause',
        value: function pause() {
            return this.video.pause();
        }
    }, {
        key: 'attachMedia',
        value: function attachMedia() {}
    }, {
        key: 'seek',
        value: function seek(seconds) {
            this.currentTimeLock = true;
            this.video.currentTime = seconds;
            this.currentTimeLock = false;
        }
    }]);

    return Native;
}(CustEvent);

var Kernel = function (_CustEvent) {
	_inherits(Kernel, _CustEvent);

	/**
  * 创建核心解码器
  * @param {any} wrap 父层容器
  * @param {any} option 整合参数
  * @class kernel
  */
	function Kernel(videoElement, config) {
		_classCallCheck(this, Kernel);

		var _this = _possibleConstructorReturn(this, (Kernel.__proto__ || _Object$getPrototypeOf(Kernel)).call(this));

		_this.tag = 'kernel';
		_this.config = config;
		_this.video = videoElement;
		_this.videokernel = _this.selectKernel();
		_this.bindEvents(_this.videokernel, _this.video);
		_this.timer = null;
		return _this;
	}

	/**
  * 绑定事件
  * @memberof kernel
  */


	_createClass(Kernel, [{
		key: 'bindEvents',
		value: function bindEvents(videokernel, video) {
			var _this2 = this;

			if (videokernel) {
				videokernel.on('mediaInfo', function (mediaInfo) {
					_this2.emit('mediaInfo', mediaInfo);
				});

				video.addEventListener('canplay', function () {
					clearTimeout(_this2.timer);
					_this2.timer = null;
				});
			}
		}

		/**
   * 选择解码器
   * @memberof kernel
   */

	}, {
		key: 'selectKernel',
		value: function selectKernel() {
			var config = this.config;

			var box = config.box ? config.box : config.src.indexOf('.flv') !== -1 ? 'flv' : config.src.indexOf('.m3u8') !== -1 ? 'hls' : 'native';

			if (box === 'native') {
				return new Native(this.video, config);
			} else if (box === 'flv') {
				return new config.preset[box](this.video, config);
			} else if (box === 'hls') {
				return new config.preset[box](this.video, config);
			} else {
				Log.error(this.tag, 'not mactch any player, please check your config');
				return null;
			}
		}
	}, {
		key: 'attachMedia',
		value: function attachMedia() {
			if (this.videokernel) {
				this.videokernel.attachMedia();
			} else {
				Log.error(this.tag, 'video player is not already, must init player');
			}
		}

		/**
   * 启动加载
   * @param {string} src 媒体资源地址
   * @memberof kernel
   */

	}, {
		key: 'load',
		value: function load(src) {
			var _this3 = this;

			this.config.src = src || this.config.src;
			if (this.videokernel && this.config.src) {
				this.videokernel.load(src);
				if (!this.timer) {
					this.timer = setTimeout(function () {
						_this3.timer = null;
						_this3.pause();
						_this3.refresh();
					}, 1000);
				}
			} else {
				Log.error(this.tag, 'video player is not already, must init player');
			}
		}
		/**
   * 销毁kernel
   * @memberof kernel
   */

	}, {
		key: 'destroy',
		value: function destroy() {
			if (this.videokernel) {
				this.videokernel.destroy();
			} else {
				Log.error(this.tag, 'player is not exit');
			}
		}
		/**
   * to play
   * @memberof kernel
   */

	}, {
		key: 'play',
		value: function play() {
			if (this.videokernel) {
				this.videokernel.play();
			} else {
				Log.error(this.tag, 'video player is not already, must init player');
			}
		}
		/**
   * pause
   * @memberof kernel
   */

	}, {
		key: 'pause',
		value: function pause() {
			if (this.videokernel && this.config.src) {
				this.videokernel.pause();
			} else {
				Log.error(this.tag, 'video player is not already, must init player');
			}
		}
		/**
   * get video currentTime
   * @memberof kernel
   */

	}, {
		key: 'seek',

		/**
   * seek to a point
   * @memberof kernel
   */
		value: function seek(seconds) {
			if (!isNumber(seconds)) {
				Log.error(this.tag, 'seek params must be a number');
				return;
			}
			return this.videokernel.seek(seconds);
		}
	}, {
		key: 'refresh',
		value: function refresh() {
			this.videokernel.refresh();
		}
		/**
   * get video duration
   * @memberof kernel
   */

	}, {
		key: 'currentTime',
		get: function get() {
			if (this.videokernel) {
				return this.video.currentTime;
			}
			return 0;
		}
	}, {
		key: 'duration',
		get: function get() {
			return this.video.duration;
		}
		/**
   * get video volume
   * @memberof kernel
   */

	}, {
		key: 'volume',
		get: function get() {
			return this.video.volume;
		}
		/**
  * set video volume
  * @memberof kernel
  */
		,
		set: function set(value) {
			this.video.volume = value;
		}
		/**
   * get video muted
   * @memberof kernel
   */

	}, {
		key: 'muted',
		get: function get() {
			return this.video.muted;
		}
		/**
   * set video muted
   * @memberof kernel
   */
		,
		set: function set(muted) {
			this.video.muted = muted;
		}
		/**
  * get video buffer
  * @memberof kernel
  */

	}, {
		key: 'buffered',
		get: function get() {
			return this.video.buffered;
		}
	}]);

	return Kernel;
}(CustEvent);

var dP$2          = _objectDp.f;
var fastKey     = _meta.fastKey;
var SIZE        = _descriptors ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

var _collectionStrong = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      _anInstance(that, C, NAME, '_i');
      that._i = _objectCreate(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if(iterable != undefined)_forOf(iterable, IS_MAP, that[ADDER], that);
    });
    _redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        _anInstance(this, C, 'forEach');
        var f = _ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(_descriptors)dP$2(C.prototype, 'size', {
      get: function(){
        return _defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    _iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return _iterStep(1);
      }
      // return step by kind
      if(kind == 'keys'  )return _iterStep(0, entry.k);
      if(kind == 'values')return _iterStep(0, entry.v);
      return _iterStep(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    _setSpecies(NAME);
  }
};

var SPECIES$2  = _wks('species');

var _arraySpeciesConstructor = function(original){
  var C;
  if(_isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || _isArray(C.prototype)))C = undefined;
    if(_isObject(C)){
      C = C[SPECIES$2];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)


var _arraySpeciesCreate = function(original, length){
  return new (_arraySpeciesConstructor(original))(length);
};

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex

var _arrayMethods = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || _arraySpeciesCreate;
  return function($this, callbackfn, that){
    var O      = _toObject($this)
      , self   = _iobject(O)
      , f      = _ctx(callbackfn, that, 3)
      , length = _toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

var dP$3             = _objectDp.f;
var each           = _arrayMethods(0);

var _collection = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = _global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!_descriptors || typeof C != 'function' || !(IS_WEAK || proto.forEach && !_fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    _redefineAll(C.prototype, methods);
    _meta.NEED = true;
  } else {
    C = wrapper(function(target, iterable){
      _anInstance(target, C, NAME, '_c');
      target._c = new Base;
      if(iterable != undefined)_forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','),function(KEY){
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))_hide(C.prototype, KEY, function(a, b){
        _anInstance(this, C, KEY);
        if(!IS_ADDER && IS_WEAK && !_isObject(a))return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    if('size' in proto)dP$3(C.prototype, 'size', {
      get: function(){
        return this._c.size;
      }
    });
  }

  _setToStringTag(C, NAME);

  O[NAME] = C;
  _export(_export.G + _export.W + _export.F, O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};

// 23.1 Map Objects
var es6_map = _collection('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = _collectionStrong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return _collectionStrong.def(this, key === 0 ? 0 : key, value);
  }
}, _collectionStrong, true);

var _arrayFromIterable = function(iter, ITERATOR){
  var result = [];
  _forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

// https://github.com/DavidBruant/Map-Set.prototype.toJSON

var _collectionToJson = function(NAME){
  return function toJSON(){
    if(_classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return _arrayFromIterable(this);
  };
};

// https://github.com/DavidBruant/Map-Set.prototype.toJSON


_export(_export.P + _export.R, 'Map', {toJSON: _collectionToJson('Map')});

var map$1 = _core.Map;

var map = createCommonjsModule(function (module) {
module.exports = { "default": map$1, __esModule: true };
});

var _Map = unwrapExports(map);

// all object keys, includes non-enumerable and symbols
var Reflect  = _global.Reflect;
var _ownKeys = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = _objectGopn.f(_anObject(it))
    , getSymbols = _objectGops.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

// https://github.com/tc39/proposal-object-getownpropertydescriptors


_export(_export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = _toIobject(object)
      , getDesc = _objectGopd.f
      , keys    = _ownKeys(O)
      , result  = {}
      , i       = 0
      , key;
    while(keys.length > i)_createProperty(result, key = keys[i++], getDesc(O, key));
    return result;
  }
});

var getOwnPropertyDescriptors$2 = _core.Object.getOwnPropertyDescriptors;

var getOwnPropertyDescriptors$1 = createCommonjsModule(function (module) {
module.exports = { "default": getOwnPropertyDescriptors$2, __esModule: true };
});

var _Object$getOwnPropertyDescriptors = unwrapExports(getOwnPropertyDescriptors$1);

var getOwnPropertySymbols$1 = _core.Object.getOwnPropertySymbols;

var getOwnPropertySymbols = createCommonjsModule(function (module) {
module.exports = { "default": getOwnPropertySymbols$1, __esModule: true };
});

var _Object$getOwnPropertySymbols = unwrapExports(getOwnPropertySymbols);

// 19.1.2.7 Object.getOwnPropertyNames(O)
_objectSap('getOwnPropertyNames', function(){
  return _objectGopnExt.f;
});

var $Object$3 = _core.Object;
var getOwnPropertyNames$1 = function getOwnPropertyNames(it){
  return $Object$3.getOwnPropertyNames(it);
};

var getOwnPropertyNames = createCommonjsModule(function (module) {
module.exports = { "default": getOwnPropertyNames$1, __esModule: true };
});

var _Object$getOwnPropertyNames = unwrapExports(getOwnPropertyNames);

var ITERATOR$4  = _wks('iterator');
var core_isIterable = _core.isIterable = function(it){
  var O = Object(it);
  return O[ITERATOR$4] !== undefined
    || '@@iterator' in O
    || _iterators.hasOwnProperty(_classof(O));
};

var isIterable$2 = core_isIterable;

var isIterable = createCommonjsModule(function (module) {
module.exports = { "default": isIterable$2, __esModule: true };
});

var core_getIterator = _core.getIterator = function(it){
  var iterFn = core_getIteratorMethod(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return _anObject(iterFn.call(it));
};

var getIterator$2 = core_getIterator;

var getIterator = createCommonjsModule(function (module) {
module.exports = { "default": getIterator$2, __esModule: true };
});

var slicedToArray = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _isIterable3 = _interopRequireDefault(isIterable);



var _getIterator3 = _interopRequireDefault(getIterator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();
});

var _slicedToArray = unwrapExports(slicedToArray);

var getWeak           = _meta.getWeak;
var arrayFind         = _arrayMethods(5);
var arrayFindIndex    = _arrayMethods(6);
var id$1                = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function(that){
  return that._l || (that._l = new UncaughtFrozenStore);
};
var UncaughtFrozenStore = function(){
  this.a = [];
};
var findUncaughtFrozen = function(store, key){
  return arrayFind(store.a, function(it){
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function(key){
    var entry = findUncaughtFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findUncaughtFrozen(this, key);
  },
  set: function(key, value){
    var entry = findUncaughtFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = arrayFindIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

var _collectionWeak = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      _anInstance(that, C, NAME, '_i');
      that._i = id$1++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if(iterable != undefined)_forOf(iterable, IS_MAP, that[ADDER], that);
    });
    _redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!_isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this)['delete'](key);
        return data && _has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!_isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this).has(key);
        return data && _has(data, this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var data = getWeak(_anObject(key), true);
    if(data === true)uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

var es6_weakMap = createCommonjsModule(function (module) {
'use strict';
var each         = _arrayMethods(0)
  , getWeak      = _meta.getWeak
  , isExtensible = Object.isExtensible
  , uncaughtFrozenStore = _collectionWeak.ufstore
  , tmp          = {}
  , InternalMap;

var wrapper = function(get){
  return function WeakMap(){
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(_isObject(key)){
      var data = getWeak(key);
      if(data === true)return uncaughtFrozenStore(this).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return _collectionWeak.def(this, key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = _collection('WeakMap', wrapper, methods, _collectionWeak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  InternalMap = _collectionWeak.getConstructor(wrapper);
  _objectAssign(InternalMap.prototype, methods);
  _meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    _redefine(proto, key, function(a, b){
      // store frozen objects on internal weakmap shim
      if(_isObject(a) && !isExtensible(a)){
        if(!this._f)this._f = new InternalMap;
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
});

var weakMap$1 = _core.WeakMap;

var weakMap = createCommonjsModule(function (module) {
module.exports = { "default": weakMap$1, __esModule: true };
});

var _WeakMap = unwrapExports(weakMap);

var defineProperty$5$1 = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};
});

var _defineProperty$1 = unwrapExports(defineProperty$5$1);

// 19.1.2.15 Object.preventExtensions(O)
var meta     = _meta.onFreeze;

_objectSap('preventExtensions', function($preventExtensions){
  return function preventExtensions(it){
    return $preventExtensions && _isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

var preventExtensions$2 = _core.Object.preventExtensions;

var preventExtensions$1 = createCommonjsModule(function (module) {
module.exports = { "default": preventExtensions$2, __esModule: true };
});

var _Object$preventExtensions = unwrapExports(preventExtensions$1);

/**
 * toxic-decorators v0.3.6
 * (c) 2017 toxic-johann
 * Released under GPL-3.0
 */

var getOwnPropertyDescriptor$3 = _Object$getOwnPropertyDescriptor;
// **********************  对象操作  ************************
/**
 * sort Object attributes by function
 * and transfer them into array
 * @param  {Object} obj Object form from numric
 * @param  {Function} fn sort function
 * @return {Array} the sorted attirbutes array
 */


/**
 * to check if an descriptor
 * @param {anything} desc
 */
function isDescriptor(desc) {
  if (!desc || !desc.hasOwnProperty) {
    return false;
  }

  var keys$$1 = ['value', 'initializer', 'get', 'set'];

  for (var i = 0, l = keys$$1.length; i < l; i++) {
    if (desc.hasOwnProperty(keys$$1[i])) {
      return true;
    }
  }
  return false;
}
/**
 * to check if the descirptor is an accessor descriptor
 * @param {descriptor} desc it should be a descriptor better
 */
function isAccessorDescriptor(desc) {
  return !!desc && (isFunction(desc.get) || isFunction(desc.set)) && isBoolean(desc.configurable) && isBoolean(desc.enumerable) && desc.writable === undefined;
}
/**
 * to check if the descirptor is an data descriptor
 * @param {descriptor} desc it should be a descriptor better
 */
function isDataDescriptor(desc) {
  return !!desc && desc.hasOwnProperty('value') && isBoolean(desc.configurable) && isBoolean(desc.enumerable) && isBoolean(desc.writable);
}
/**
 * to check if the descirptor is an initiallizer descriptor
 * @param {descriptor} desc it should be a descriptor better
 */
function isInitializerDescriptor(desc) {
  return !!desc && isFunction(desc.initializer) && isBoolean(desc.configurable) && isBoolean(desc.enumerable) && isBoolean(desc.writable);
}
/**
 * set one value on the object
 * @param {string} key
 */
function createDefaultSetter(key) {
  return function set(newValue) {
    _Object$defineProperty(this, key, {
      configurable: true,
      writable: true,
      // IS enumerable when reassigned by the outside word
      enumerable: true,
      value: newValue
    });
    return newValue;
  };
}

/**
 * Compress many function into one function, but this function only accept one arguments;
 * @param {Array<Function>} fns the array of function we need to compress into one function
 * @param {string} errmsg When we check that there is something is not function, we will throw an error, you can set your own error message
 */
function compressOneArgFnArray(fns) {
  var errmsg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'You must pass me an array of function';

  if (!isArray$1(fns) || fns.length < 1) {
    throw new TypeError(errmsg);
  }
  if (fns.length === 1) {
    if (!isFunction(fns[0])) {
      throw new TypeError(errmsg);
    }
    return fns[0];
  }
  return fns.reduce(function (prev, curr) {
    if (!isFunction(curr) || !isFunction(prev)) throw new TypeError(errmsg);
    return function (value) {
      return bind(curr, this)(bind(prev, this)(value));
    };
  });
}
/**
 * just a method to call console.warn, maybe i will add some handler on it someday
 * @param {anything} args
 */
function warn() {
  var _console2, _console3;

  var _console = console,
      warn = _console.warn;

  if (isFunction(warn)) return (_console2 = console).warn.apply(_console2, arguments);
  (_console3 = console).log.apply(_console3, arguments);
}

function getOwnKeysFn() {
  var getOwnPropertyNames$$1 = _Object$getOwnPropertyNames,
      getOwnPropertySymbols$$1 = _Object$getOwnPropertySymbols;

  return isFunction(getOwnPropertySymbols$$1) ? function (obj) {
    // $FlowFixMe: do not support symwbol yet
    return _Array$from(getOwnPropertyNames$$1(obj).concat(getOwnPropertySymbols$$1(obj)));
  } : getOwnPropertyNames$$1;
}

var getOwnKeys = getOwnKeysFn();

function getOwnPropertyDescriptorsFn() {
  // $FlowFixMe: In some environment, Object.getOwnPropertyDescriptors has been implemented;
  return isFunction(_Object$getOwnPropertyDescriptors) ? _Object$getOwnPropertyDescriptors : function (obj) {
    return getOwnKeys(obj).reduce(function (descs, key) {
      descs[key] = getOwnPropertyDescriptor$3(obj, key);
      return descs;
    }, {});
  };
}

var getOwnPropertyDescriptors = getOwnPropertyDescriptorsFn();

function compressMultipleDecorators() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  var fnOnlyErrorMsg = 'compressMultipleDecorators only accept function';
  fns.forEach(function (fn) {
    if (!isFunction(fns[0])) throw new TypeError(fnOnlyErrorMsg);
  });
  if (fns.length === 1) return fns[0];
  return function (obj, prop, descirptor) {
    // $FlowFixMe: the reduce will return a descriptor
    return fns.reduce(function (descirptor, fn) {
      return fn(obj, prop, descirptor);
    }, descirptor);
  };
}

function accessor() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      get = _ref.get,
      set = _ref.set;

  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$preGet = _ref2.preGet,
      preGet = _ref2$preGet === undefined ? false : _ref2$preGet,
      _ref2$preSet = _ref2.preSet,
      preSet = _ref2$preSet === undefined ? true : _ref2$preSet;

  if (!isFunction(get) && !isFunction(set) && !(isArray$1(get) && get.length > 0) && !(isArray$1(set) && set.length > 0)) throw new TypeError("@accessor need a getter or setter. If you don't need to add setter/getter. You should remove @accessor");
  var errmsg = '@accessor only accept function or array of function as getter/setter';
  get = isArray$1(get) ? compressOneArgFnArray(get, errmsg) : get;
  set = isArray$1(set) ? compressOneArgFnArray(set, errmsg) : set;
  return function (obj, prop, descriptor) {
    var _ref3 = descriptor || {},
        _ref3$configurable = _ref3.configurable,
        configurable = _ref3$configurable === undefined ? true : _ref3$configurable,
        _ref3$enumerable = _ref3.enumerable,
        enumerable = _ref3$enumerable === undefined ? true : _ref3$enumerable;
    // const configurable = descriptor ? descriptor.configurable : true;
    // const enumerable = descriptor ? descriptor.enumerable : true;
    // const writable = descriptor ? descriptor.w : true;


    var hasGet = isFunction(get);
    var hasSet = isFunction(set);
    var handleGet = function handleGet(value) {
      // $FlowFixMe: it's really function here
      return hasGet ? bind(get, this)(value) : value;
    };
    var handleSet = function handleSet(value) {
      // $FlowFixMe: it's really function here
      return hasSet ? bind(set, this)(value) : value;
    };
    if (isAccessorDescriptor(descriptor)) {
      var originGet = descriptor.get,
          originSet = descriptor.set;

      var hasOriginGet = isFunction(originGet);
      var hasOriginSet = isFunction(originSet);
      if (!hasOriginGet && hasGet) {
        warn('You are trying to set getter via @accessor on ' + prop + ' without getter. That\'s not a good idea.');
      }
      if (!hasOriginSet && hasSet) {
        warn('You are trying to set setter via @accessor on  ' + prop + ' without setter. That\'s not a good idea.');
      }
      var getter = hasOriginGet || hasGet ? function () {
        var _this = this;

        var boundGetter = bind(handleGet, this);
        var originBoundGetter = function originBoundGetter() {
          return hasOriginGet
          // $FlowFixMe: we have do a check here
          ? bind(originGet, _this)() : undefined;
        };
        var order = preGet ? [boundGetter, originBoundGetter] : [originBoundGetter, boundGetter];
        // $FlowFixMe: it's all function here
        return order.reduce(function (value, fn) {
          return fn(value);
        }, undefined);
      } : undefined;
      var setter = hasOriginSet || hasSet ? function (val) {
        var _this2 = this;

        var boundSetter = bind(handleSet, this);
        var originBoundSetter = function originBoundSetter(value) {
          return hasOriginSet
          // $FlowFixMe: flow act like a retarded child on optional property
          ? bind(originSet, _this2)(value) : value;
        };
        var order = preSet ? [boundSetter, originBoundSetter] : [originBoundSetter, boundSetter];
        return order.reduce(function (value, fn) {
          return fn(value);
        }, val);
      } : undefined;
      return {
        get: getter,
        set: setter,
        configurable: configurable,
        enumerable: enumerable
      };
    } else if (isInitializerDescriptor(descriptor)) {
      // $FlowFixMe: disjoint union is horrible, descriptor is initializerDescriptor now
      var initializer = descriptor.initializer;

      var value = void 0;
      var inited = false;
      return {
        get: function get() {
          var boundFn = bind(handleGet, this);
          if (inited) return boundFn(value);
          value = bind(initializer, this)();
          inited = true;
          return boundFn(value);
        },
        set: function set(val) {
          var boundFn = bind(handleSet, this);
          value = preSet ? boundFn(val) : val;
          inited = true;
          if (!preSet) {
            boundFn(value);
          }
          return value;
        },

        configurable: configurable,
        enumerable: enumerable
      };
    } else {
      // $FlowFixMe: disjoint union is horrible, descriptor is DataDescriptor now
      var _ref4 = descriptor || {},
          _value = _ref4.value;

      return {
        get: function get() {
          return bind(handleGet, this)(_value);
        },
        set: function set(val) {
          var boundFn = bind(handleSet, this);
          _value = preSet ? boundFn(val) : val;
          if (!preSet) {
            boundFn(_value);
          }
          return _value;
        },

        configurable: configurable,
        enumerable: enumerable
      };
    }
  };
}

function before() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  if (fns.length === 0) throw new Error("@before accept at least one parameter. If you don't need to preprocess before your function, do not add @before decorators");
  if (fns.length > 2 && isDescriptor(fns[2])) {
    throw new Error('You may use @before straightly, @before return decorators, you need to call it');
  }
  for (var i = fns.length - 1; i > -1; i--) {
    if (!isFunction(fns[i])) throw new TypeError('@before only accept function parameter');
  }
  return function (obj, prop, descriptor) {
    if (descriptor === undefined) {
      throw new Error('@before must used on descriptor, are you using it on undefined property?');
    }
    var fn = descriptor.value,
        configurable = descriptor.configurable,
        enumerable = descriptor.enumerable,
        writable = descriptor.writable;

    if (!isFunction(fn)) throw new TypeError('@before can only be used on function');
    var handler = function handler() {
      var _this = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var paras = fns.reduce(function (paras, fn) {
        var result = bind(fn, _this).apply(undefined, _toConsumableArray(paras));
        return result === undefined ? paras : isArray$1(result) ? result
        // $FlowFixMe: what the hell, it can be anything
        : [result];
      }, args);
      return bind(fn, this).apply(undefined, _toConsumableArray(paras));
    };
    return {
      value: handler,
      configurable: configurable,
      enumerable: enumerable,
      writable: writable
    };
  };
}

function initialize() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  if (fns.length === 0) throw new Error("@initialize accept at least one parameter. If you don't need to initialize your value, do not add @initialize.");
  if (fns.length > 2 && isDescriptor(fns[2])) {
    throw new Error('You may use @initialize straightly, @initialize return decorators, you need to call it');
  }
  var fn = compressOneArgFnArray(fns, '@initialize only accept function parameter');
  return function (obj, prop, descriptor) {
    if (descriptor === undefined) {
      return {
        value: bind(fn, obj)(),
        configurable: true,
        writable: true,
        enumerable: true
      };
    }
    if (isAccessorDescriptor(descriptor)) {
      var hasBeenReset = false;
      var originSet = descriptor.set;

      return accessor({
        get: function get(value) {
          if (hasBeenReset) return value;
          return bind(fn, this)(value);
        },

        set: originSet ? function (value) {
          hasBeenReset = true;
          return value;
        } : undefined
      })(obj, prop, descriptor);
    }
    /**
     * when we set decorator on propery
     * we will get a descriptor with initializer
     * as they will be attach on the instance later
     * so, we need to substitute the initializer function
     */
    if (isInitializerDescriptor(descriptor)) {
      // $FlowFixMe: useless disjoint union
      var initializer = descriptor.initializer;

      var handler = function handler() {
        return bind(fn, this)(bind(initializer, this)());
      };
      return {
        initializer: handler,
        configurable: descriptor.configurable,
        // $FlowFixMe: useless disjoint union
        writable: descriptor.writable,
        enumerable: descriptor.enumerable
      };
    }
    // $FlowFixMe: useless disjoint union
    var value = bind(fn, this)(descriptor.value);
    return {
      value: value,
      // $FlowFixMe: useless disjoint union
      writable: descriptor.writable,
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable
    };
  };
}

var getOwnPropertyDescriptor$1$1 = _Object$getOwnPropertyDescriptor;
var defineProperty$4 = _Object$defineProperty;

function setAlias(root, prop, _ref, obj, key, _ref2) {
  var configurable = _ref.configurable,
      enumerable = _ref.enumerable;
  var force = _ref2.force,
      omit = _ref2.omit;

  var originDesc = getOwnPropertyDescriptor$1$1(obj, key);
  if (originDesc !== undefined) {
    if (omit) return;
    if (!force) throw new Error("@alias can't set alias on an existing attribute");
    if (!originDesc.configurable) {
      throw new Error("You are tring to set alias on an existing attribute which its configurable is false. That's impossible. Please check if you have set @frozen on it.");
    }
  }
  defineProperty$4(obj, key, {
    get: function get() {
      return root[prop];
    },
    set: function set(value) {
      root[prop] = value;
      return prop;
    },

    configurable: configurable,
    enumerable: enumerable
  });
}
function alias(other, key, option) {
  // set argument into right position
  if (arguments.length === 2) {
    if (isString(other)) {
      // $FlowFixMe: i will check this later
      option = key;
      key = other;
      other = undefined;
    }
  } else if (arguments.length === 1) {
    // $FlowFixMe: i will check this later
    key = other;
    other = undefined;
  }
  // argument validate
  if (!isString(key)) throw new TypeError('@alias need a string as a key to find the porperty to set alias on');
  var illegalObjErrorMsg = 'If you want to use @alias to set alias on other instance, you must pass in a legal instance';
  if (other !== undefined && isPrimitive(other)) throw new TypeError(illegalObjErrorMsg);

  var _ref3 = isObject$1(option) ? option : { force: false, omit: false },
      force = _ref3.force,
      omit = _ref3.omit;

  return function (obj, prop, descriptor) {
    descriptor = descriptor || {
      value: undefined,
      configurable: true,
      writable: true,
      enumerable: true
    };
    function getTargetAndName(other, obj, key) {
      var target = isPrimitive(other) ? obj : other;
      var keys$$1 = key.split('.');

      var _keys$slice = keys$$1.slice(-1),
          _keys$slice2 = _slicedToArray(_keys$slice, 1),
          name = _keys$slice2[0];

      target = getDeepProperty(target, keys$$1.slice(0, -1), { throwError: true });
      if (isPrimitive(target)) {
        throw new TypeError(illegalObjErrorMsg);
      }
      return {
        target: target,
        name: name
      };
    }
    if (isInitializerDescriptor(descriptor)) {
      return initialize(function (value) {
        var _getTargetAndName = getTargetAndName(other, this, key),
            target = _getTargetAndName.target,
            name = _getTargetAndName.name;

        setAlias(this, prop, descriptor, target, name, { force: force, omit: omit });
        return value;
      })(obj, prop, descriptor);
    }
    if (isAccessorDescriptor(descriptor)) {
      var inited = void 0;
      var handler = function handler(value) {
        if (inited) return value;

        var _getTargetAndName2 = getTargetAndName(other, this, key),
            target = _getTargetAndName2.target,
            name = _getTargetAndName2.name;

        setAlias(this, prop, descriptor, target, name, { force: force, omit: omit });
        inited = true;
        return value;
      };
      return accessor({ get: handler, set: handler })(obj, prop, descriptor);
    }

    var _getTargetAndName3 = getTargetAndName(other, obj, key),
        target = _getTargetAndName3.target,
        name = _getTargetAndName3.name;

    setAlias(obj, prop, descriptor, target, name, { force: force, omit: omit });
    return descriptor;
  };
}

var defineProperty$1$1 = _Object$defineProperty;

function classify(decorator) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      requirement = _ref.requirement,
      _ref$customArgs = _ref.customArgs,
      customArgs = _ref$customArgs === undefined ? false : _ref$customArgs;

  return function () {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$exclude = _ref2.exclude,
        exclude = _ref2$exclude === undefined ? [] : _ref2$exclude,
        _ref2$include = _ref2.include,
        include = _ref2$include === undefined ? [] : _ref2$include,
        _ref2$construct = _ref2.construct,
        construct = _ref2$construct === undefined ? false : _ref2$construct,
        _ref2$self = _ref2.self,
        self = _ref2$self === undefined ? false : _ref2$self;

    if (!isArray$1(exclude)) throw new TypeError('options.exclude must be an array');
    if (!isArray$1(include)) throw new TypeError('options.include must be an array');
    return function (Klass) {
      var isClass = isFunction(Klass);
      if (!self && !isClass) throw new TypeError('@' + decorator.name + 'Class can only be used on class');
      if (self && isPrimitive(Klass)) throw new TypeError('@' + decorator.name + 'Class must be used on non-primitive type value in \'self\' mode');
      var prototype = self ? Klass : Klass.prototype;
      if (isVoid(prototype)) throw new Error('The prototype of the ' + Klass.name + ' is empty, please check it');
      var descs = getOwnPropertyDescriptors(prototype);
      getOwnKeys(prototype).concat(include).forEach(function (key) {
        var desc = descs[key];
        if (key === 'constructor' && !construct || self && isClass && ['name', 'length', 'prototype'].indexOf(key) > -1 || exclude.indexOf(key) > -1 || isFunction(requirement) && requirement(prototype, key, desc, { self: self }) === false) return;
        defineProperty$1$1(prototype, key, (customArgs ? decorator.apply(undefined, _toConsumableArray(args)) : decorator)(prototype, key, desc));
      });
    };
  };
}

var autobindClass = classify(autobind, {
  requirement: function requirement(obj, prop, desc) {
    // $FlowFixMe: it's data descriptor now
    return isDataDescriptor(desc) && isFunction(desc.value);
  }
});

var mapStore = void 0;
// save bound function for super
function getBoundSuper(obj, fn) {
  if (typeof _WeakMap === 'undefined') {
    throw new Error('Using @autobind on ' + fn.name + '() requires WeakMap support due to its use of super.' + fn.name + '()');
  }

  if (!mapStore) {
    mapStore = new _WeakMap();
  }

  if (mapStore.has(obj) === false) {
    mapStore.set(obj, new _WeakMap());
  }

  var superStore = mapStore.get(obj);
  // $FlowFixMe: already insure superStore is not undefined
  if (superStore.has(fn) === false) {
    // $FlowFixMe: already insure superStore is not undefined
    superStore.set(fn, bind(fn, obj));
  }
  // $FlowFixMe: already insure superStore is not undefined
  return superStore.get(fn);
}
/**
 * auto bind the function on the class, just support function
 * @param {Object} obj Target Object
 * @param {string} prop prop strong
 * @param {Object} descriptor
 */
function autobind(obj, prop, descriptor) {
  if (arguments.length === 1) return autobindClass()(obj);
  if (!isDescriptor(descriptor)) {
    throw new Error('@autobind must used on descriptor, are you using it on undefined property?');
  }
  var fn = descriptor.value,
      configurable = descriptor.configurable;

  if (!isFunction(fn)) {
    throw new TypeError('@autobind can only be used on functions, not: ' + fn + ')');
  }
  var constructor = obj.constructor;

  return {
    configurable: configurable,
    enumerable: false,
    get: function get() {
      var _this = this;

      var boundFn = function boundFn() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return fn.call.apply(fn, [_this].concat(_toConsumableArray(args)));
      };
      // Someone accesses the property directly on the prototype on which it is
      // actually defined on, i.e. Class.prototype.hasOwnProperty(key)
      if (this === obj) {
        return fn;
      }
      // Someone accesses the property directly on a prototype,
      // but it was found up the chain, not defined directly on it
      // i.e. Class.prototype.hasOwnProperty(key) == false && key in Class.prototype
      if (this.constructor !== constructor && _Object$getPrototypeOf(this).constructor === constructor) {
        return fn;
      }

      // Autobound method calling super.sameMethod() which is also autobound and so on.
      if (this.constructor !== constructor && prop in this.constructor.prototype) {
        return getBoundSuper(this, fn);
      }
      _Object$defineProperty(this, prop, {
        configurable: true,
        writable: true,
        // NOT enumerable when it's a bound method
        enumerable: false,
        value: boundFn
      });

      return boundFn;
    },

    set: createDefaultSetter(prop)
  };
}

var defineProperty$2$1 = _Object$defineProperty;
/**
 * make one attr only can be read, but could not be rewrited/ deleted
 * @param {Object} obj
 * @param {string} prop
 * @param {Object} descriptor
 * @return {descriptor}
 */

function frozen(obj, prop, descriptor) {
  if (descriptor === undefined) {
    warn('You are using @frozen on an undefined property. This property will become a frozen undefined forever, which is meaningless');
    return {
      value: undefined,
      writable: false,
      enumerable: false,
      configurable: false
    };
  }
  descriptor.enumerable = false;
  descriptor.configurable = false;
  if (isAccessorDescriptor(descriptor)) {
    var _get = descriptor.get;

    descriptor.set = undefined;
    if (!isFunction(_get)) {
      warn('You are using @frozen on one accessor descriptor without getter. This property will become a frozen undefined finally.Which maybe meaningless.');
      return;
    }
    return {
      get: function get() {
        var value = bind(_get, this)();
        defineProperty$2$1(this, prop, {
          value: value,
          writable: false,
          configurable: false,
          enumerable: false
        });
        return value;
      },

      set: undefined,
      configurable: false,
      enumerable: false
    };
  }
  // $FlowFixMe: comeon, can disjoint union be reliable?
  descriptor.writable = false;
  return descriptor;
}

var getOwnPropertyDescriptor$2$1 = _Object$getOwnPropertyDescriptor;
var defineProperty$3$1 = _Object$defineProperty;

function waituntil(key) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      other = _ref.other;

  if (!isFunction(key) && !isPromise(key) && !isString(key)) throw new TypeError('@waitUntil only accept Function, Promise or String');
  return function (obj, prop, descriptor) {
    if (descriptor === undefined) {
      throw new Error('@waituntil must used on descriptor, are you using it on undefined property?');
    }
    var _value = descriptor.value,
        configurable = descriptor.configurable;

    if (!isFunction(_value)) throw new TypeError('@waituntil can only be used on function, but not ' + _value);
    var binded = false;
    var waitingQueue = [];
    var canIRun = isPromise(key) ? function () {
      return key;
    } : isFunction(key) ? key : function () {
      // $FlowFixMe: We have use isPromise to exclude
      var keys$$1 = key.split('.');
      var prop = keys$$1.slice(-1);
      var originTarget = isPrimitive(other) ? this : other;
      if (!binded) {
        var target = getDeepProperty(originTarget, keys$$1.slice(0, -1));
        if (isVoid(target)) return target;
        var _descriptor = getOwnPropertyDescriptor$2$1(target, prop);
        /**
         * create a setter hook here
         * when it get ture, it will run all function in waiting queue immediately
         */
        var set = function set(value) {
          if (value === true) {
            while (waitingQueue.length > 0) {
              waitingQueue[0]();
              waitingQueue.shift();
            }
          }
          return value;
        };
        var desc = isDescriptor(_descriptor) ? accessor({ set: set })(target, prop, _descriptor) : accessor({ set: set })(target, prop, {
          value: undefined,
          configurable: true,
          enumerable: true,
          writable: true
        });
        defineProperty$3$1(target, prop, desc);
        binded = true;
      }
      return getDeepProperty(originTarget, keys$$1);
    };
    return {
      value: function value() {
        var _this = this;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var boundFn = bind(_value, this);
        var runnable = bind(canIRun, this).apply(undefined, args);
        if (isPromise(runnable)) {
          return _Promise.resolve(runnable).then(function () {
            return bind(_value, _this).apply(undefined, args);
          });
        } else if (runnable === true) {
          return bind(_value, this).apply(undefined, args);
        } else {
          return new _Promise(function (resolve) {
            var cb = function cb() {
              boundFn.apply(undefined, args);
              resolve();
            };
            waitingQueue.push(cb);
          });
        }
      },

      // function should not be enmuerable
      enumerable: false,
      configurable: configurable,
      // as we have delay this function
      // it's not a good idea to change it
      writable: false
    };
  };
}

var defineProperty$5 = _Object$defineProperty;
/**
 * make one attr only can be read, but could not be rewrited/ deleted
 * @param {Object} obj
 * @param {string} prop
 * @param {Object} descriptor
 * @return {descriptor}
 */

function lock(obj, prop, descriptor) {
  if (descriptor === undefined) {
    warn('You are using @lock on an undefined property. This property will become a lock undefined forever, which is meaningless');
    return {
      value: undefined,
      writable: false,
      enumerable: true,
      configurable: false
    };
  }
  descriptor.configurable = false;
  if (isAccessorDescriptor(descriptor)) {
    var _get = descriptor.get;

    descriptor.set = undefined;
    if (!isFunction(_get)) {
      warn('You are using @lock on one accessor descriptor without getter. This property will become a lock undefined finally.Which maybe meaningless.');
      return;
    }
    return {
      get: function get() {
        var value = bind(_get, this)();
        defineProperty$5(this, prop, {
          value: value,
          writable: false,
          configurable: false,
          enumerable: descriptor.enumerable
        });
        return value;
      },

      set: undefined,
      configurable: false,
      enumerable: descriptor.enumerable
    };
  }
  // $FlowFixMe: comeon, can disjoint union be reliable?
  descriptor.writable = false;
  return descriptor;
}

function nonenumerable(obj, prop, descriptor) {
  if (descriptor === undefined) {
    return {
      value: undefined,
      enumerable: false,
      configurable: true,
      writable: true
    };
  }
  descriptor.enumerable = false;
  return descriptor;
}

var defineProperty$6 = _Object$defineProperty;
var getOwnPropertyDescriptor$3$1 = _Object$getOwnPropertyDescriptor;


function applyDecorators(Class, props) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$self = _ref.self,
      self = _ref$self === undefined ? false : _ref$self,
      _ref$omit = _ref.omit,
      omit = _ref$omit === undefined ? false : _ref$omit;

  var isPropsFunction = isFunction(props);
  if (isPropsFunction || isArray$1(props)) {
    // apply decorators on class
    if (!isFunction(Class)) throw new TypeError('If you want to decorator class, you must pass it a legal class');
    // $FlowFixMe: Terrible union, it's function now
    if (isPropsFunction) props(Class);else {
      // $FlowFixMe: Terrible union, it's array now
      for (var i = 0, len = props.length; i < len; i++) {
        // $FlowFixMe: Terrible union, it's array now
        var fn = props[i];
        if (!isFunction(fn)) throw new TypeError('If you want to decorate an class, you must pass it function or array of function');
        fn(Class);
      }
    }
    return Class;
  }
  if (!self && !isFunction(Class)) throw new TypeError('applyDecorators only accept class as first arguments. If you want to modify instance, you should set options.self true.');
  if (self && isPrimitive(Class)) throw new TypeError("We can't apply docorators on a primitive value, even in self mode");
  if (!isObject$1(props)) throw new TypeError('applyDecorators only accept object as second arguments');
  var prototype = self ? Class : Class.prototype;
  if (isVoid(prototype)) throw new Error('The class muse have a prototype, please take a check');
  for (var key in props) {
    var value = props[key];
    var decorators = isArray$1(value) ? value : [value];
    var handler = void 0;
    try {
      handler = compressMultipleDecorators.apply(undefined, _toConsumableArray(decorators));
    } catch (err) {
      warn(err && err.message);
      throw new Error('The decorators set on props must be Function or Array of Function');
    }
    var descriptor = getOwnPropertyDescriptor$3$1(prototype, key);
    if (descriptor && !descriptor.configurable) {
      if (!omit) throw new Error(key + ' of ' + prototype + ' is unconfigurable');
      continue;
    }
    defineProperty$6(prototype, key, handler(prototype, key, descriptor));
  }
  return Class;
}

var arrayChangeMethod = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse'];

function deepProxy(value, hook, _ref) {
  var _operateProps;

  var diff = _ref.diff,
      operationPrefix = _ref.operationPrefix;

  var mapStore = {};
  var arrayChanging = false;
  var proxyValue = new Proxy(value, {
    get: function get(target, property, receiver) {
      var value = target[property];
      if (isArray$1(target) && arrayChangeMethod.indexOf(property) > -1) {
        return function () {
          arrayChanging = true;
          bind(value, receiver).apply(undefined, arguments);
          arrayChanging = false;
          hook();
        };
      }
      if (mapStore[property] === true) return value;
      if (isObject$1(value) || isArray$1(value)) {
        var _proxyValue = mapStore[property] || deepProxy(value, hook, { diff: diff, operationPrefix: operationPrefix });
        mapStore[property] = _proxyValue;
        return _proxyValue;
      }
      mapStore[property] = true;
      return value;
    },
    set: function set(target, property, value) {
      var oldVal = target[property];
      var newVal = isObject$1(value) || isArray$1(value) ? deepProxy(value, hook, { diff: diff, operationPrefix: operationPrefix }) : value;
      target[property] = newVal;
      mapStore[property] = true;
      if (arrayChanging || diff && oldVal === newVal) return true;
      hook();
      return true;
    },
    deleteProperty: function deleteProperty(target, property) {
      delete target[property];
      delete mapStore[property];
      if (arrayChanging) return true;
      hook();
      return true;
    }
  });
  var operateProps = (_operateProps = {}, _defineProperty$1(_operateProps, operationPrefix + 'set', [initialize(function (method) {
    return function (property, val) {
      // $FlowFixMe: we have check the computed value
      proxyValue[property] = val;
    };
  }), nonenumerable]), _defineProperty$1(_operateProps, operationPrefix + 'del', [initialize(function (method) {
    return function (property) {
      // $FlowFixMe: we have check the computed value
      delete proxyValue[property];
    };
  }), nonenumerable]), _operateProps);
  applyDecorators(proxyValue, operateProps, { self: true });
  return proxyValue;
}

function deepObserve(value, hook, _ref2) {
  var _this = this,
      _operateProps2;

  var operationPrefix = _ref2.operationPrefix,
      diff = _ref2.diff;

  var mapStore = {};
  var arrayChanging = false;
  function getPropertyDecorators(keys$$1) {
    var oldVal = void 0;
    return keys$$1.reduce(function (props, key) {
      props[key] = [accessor({
        set: function set(value) {
          oldVal = this[key];
          return value;
        }
      }), accessor({
        get: function get(val) {
          if (mapStore[key]) return val;
          if (isObject$1(val) || isArray$1(val)) {
            deepObserve(val, hook, { operationPrefix: operationPrefix, diff: diff });
          }
          mapStore[key] = true;
          return val;
        },
        set: function set(val) {
          if (isObject$1(val) || isArray$1(val)) deepObserve(val, hook, { operationPrefix: operationPrefix, diff: diff });
          mapStore[key] = true;
          if (!arrayChanging && (!diff || oldVal !== val)) hook();
          return val;
        }
      }, { preSet: false })];
      return props;
    }, {});
  }
  var props = getPropertyDecorators(getOwnKeys(value));
  applyDecorators(value, props, { self: true, omit: true });
  if (isArray$1(value)) {
    var methodProps = arrayChangeMethod.reduce(function (props, key) {
      props[key] = [initialize(function (method) {
        method = isFunction(method) ? method
        // $FlowFixMe: we have check the key
        : Array.prototype[key];
        return function () {
          var originLength = value.length;
          arrayChanging = true;
          bind(method, value).apply(undefined, arguments);
          arrayChanging = false;
          if (originLength < value.length) {
            var keys$$1 = new Array(value.length - originLength).fill(1).map(function (value, index) {
              return (index + originLength).toString();
            });
            var _props = getPropertyDecorators(keys$$1);
            applyDecorators(value, _props, { self: true, omit: true });
          }
          hook();
        };
      }), nonenumerable];
      return props;
    }, {});
    applyDecorators(value, methodProps, { self: true });
  }
  var operateProps = (_operateProps2 = {}, _defineProperty$1(_operateProps2, operationPrefix + 'set', [initialize(function (method) {
    return function (property, val) {
      var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          disable = _ref3.disable,
          isNewVal = _ref3.isNewVal;

      isNewVal = isNewVal || getOwnKeys(value).indexOf(property) === -1;
      if (isFunction(method)) {
        bind(method, _this)(property, val, { disable: true, isNewVal: isNewVal });
      }
      if (isNewVal) {
        var _props2 = getPropertyDecorators([property]);
        applyDecorators(value, _props2, { self: true, omit: true });
      }
      if (!disable) {
        value[property] = val;
      }
    };
  }), nonenumerable]), _defineProperty$1(_operateProps2, operationPrefix + 'del', [initialize(function (method) {
    return function (property) {
      if (getOwnKeys(value).indexOf(property) === -1) {
        var _props3 = getPropertyDecorators([property]);
        applyDecorators(value, _props3, { self: true, omit: true });
      }
      if (isFunction(method)) {
        bind(method, _this)(property);
      } else {
        delete value[property];
      }
      hook();
    };
  }), nonenumerable]), _operateProps2);
  applyDecorators(value, operateProps, { self: true });
  return value;
}

function watch() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var option = isObject$1(args[args.length - 1]) ? args[args.length - 1] : {};
  // $FlowFixMe: we have check if it's an object
  var deep = option.deep,
      omit = option.omit,
      other = option.other,
      _option$operationPref = option.operationPrefix,
      operationPrefix = _option$operationPref === undefined ? '__' : _option$operationPref,
      _option$diff = option.diff,
      diff = _option$diff === undefined ? true : _option$diff;
  // $FlowFixMe: we have check if it's an object

  var proxy = option.proxy;

  if (!Proxy) {
    proxy = false;
    warn('You browser do not support Proxy, we will change back into observe mode.');
  }
  if (!args.length) throw new TypeError('You must pass a function or a string to find the hanlder function.');
  if (other !== undefined && isPrimitive(other)) throw new TypeError('If you want us to trigger function on the other instance, you must pass in a legal instance');
  if (!isString(operationPrefix)) throw new TypeError('operationPrefix must be an string');
  return function (obj, prop, descriptor) {
    var fns = args.reduce(function (fns, keyOrFn, index) {
      if (!isString(keyOrFn) && !isFunction(keyOrFn)) {
        if (!index || index !== args.length - 1) throw new TypeError('You can only pass function or string as handler');
        return fns;
      }
      fns.push(isString(keyOrFn) ? function (newVal, oldVal) {
        var target = other || obj;
        // $FlowFixMe: we have ensure it must be a string
        var fn = getDeepProperty(target, keyOrFn);
        if (!isFunction(fn)) {
          if (!omit) throw new Error('You pass in a function for us to trigger, please ensure the property to be a function or set omit flag true');
          return;
        }
        return bind(fn, this)(newVal, oldVal);
      } : keyOrFn);
      return fns;
    }, []);
    var handler = function handler(newVal, oldVal) {
      var _this2 = this;

      fns.forEach(function (fn) {
        return bind(fn, _this2)(newVal, oldVal);
      });
    };
    var inited = false;
    var oldVal = void 0;
    var newVal = void 0;
    var proxyValue = void 0;
    return compressMultipleDecorators(accessor({
      set: function set(value) {
        var _this3 = this;

        oldVal = this[prop];
        proxyValue = undefined;
        var hook = function hook() {
          return bind(handler, _this3)(newVal, oldVal);
        };
        return deep && (isObject$1(value) || isArray$1(value)) ? proxy ? deepProxy(value, hook, { diff: diff, operationPrefix: operationPrefix }) : deepObserve(value, hook, { operationPrefix: operationPrefix, diff: diff }) : value;
      },
      get: function get(value) {
        var _this4 = this;

        if (proxyValue) return proxyValue;
        if (!inited) {
          inited = true;
          var hook = function hook() {
            return bind(handler, _this4)(newVal, oldVal);
          };
          if (deep && (isObject$1(value) || isArray$1(value))) {
            if (proxy) {
              proxyValue = deepProxy(value, hook, { diff: diff, operationPrefix: operationPrefix });
              oldVal = proxyValue;
              newVal = proxyValue;
              return proxyValue;
            }
            deepObserve(value, hook, { operationPrefix: operationPrefix, diff: diff });
          }
          oldVal = value;
          newVal = value;
        }
        return value;
      }
    }, { preSet: true }), accessor({
      set: function set(value) {
        newVal = value;
        if (!diff || oldVal !== value) bind(handler, this)(newVal, oldVal);
        oldVal = value;
        return value;
      }
    }, { preSet: false }))(obj, prop, descriptor);
  };
}

var preventExtensions = _Object$preventExtensions;

function nonextendable(obj, prop, descriptor) {
  if (descriptor === undefined) throw new Error('@nonextendable could not handle undefined');
  return initialize(function (value) {
    preventExtensions(value);
    return value;
  })(obj, prop, descriptor);
}

function nonconfigurable(obj, prop, descriptor) {
  if (descriptor === undefined) {
    return {
      value: undefined,
      enumerable: true,
      configurable: true,
      writable: true
    };
  }
  descriptor.configurable = true;
  return descriptor;
}

function string() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = isString(args[0]) ? args.shift() : '';
  args.unshift(function (value) {
    return isString(value) ? value : defaultValue;
  });
  return initialize.apply(undefined, args);
}

function boolean() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = isBoolean(args[0]) ? args.shift() : false;
  args.unshift(function (value) {
    return isBoolean(value) ? value : defaultValue;
  });
  return initialize.apply(undefined, args);
}

function string$1() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = isString(args[0]) ? args.shift() : '';
  args.unshift(function (value) {
    return isString(value) ? value : defaultValue;
  });
  return accessor({ set: args, get: args });
}

function boolean$1() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = isBoolean(args[0]) ? args.shift() : false;
  args.unshift(function (value) {
    return isBoolean(value) ? value : defaultValue;
  });
  return accessor({ set: args, get: args });
}

function number$1() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = isNumber(args[0]) ? args.shift() : 0;
  args.unshift(function (value) {
    return isNumber(value) ? value : defaultValue;
  });
  return accessor({ set: args, get: args });
}

var $JSON$1 = _core.JSON || (_core.JSON = {stringify: JSON.stringify});
var stringify$1 = function stringify(it){ // eslint-disable-line no-unused-vars
  return $JSON$1.stringify.apply($JSON$1, arguments);
};

var stringify = createCommonjsModule(function (module) {
module.exports = { "default": stringify$1, __esModule: true };
});

var _JSON$stringify = unwrapExports(stringify);

// 20.1.2.4 Number.isNaN(number)


_export(_export.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});

var isNan$1 = _core.Number.isNaN;

var isNan = createCommonjsModule(function (module) {
module.exports = { "default": isNan$1, __esModule: true };
});

var _Number$isNaN = unwrapExports(isNan);

/**
 * chimee v0.2.2
 * (c) 2017 toxic-johann
 * Released under MIT
 */

var videoEvents = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'encrypted', 'ended', 'error', 'interruptbegin', 'interruptend', 'loadeddata', 'loadedmetadata', 'loadstart', 'mozaudioavailable', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting'];
var videoReadOnlyProperties = ['buffered', 'currentSrc', 'duration', 'error', 'ended', 'networkState', 'paused', 'readyState', 'seekable', 'sinkId', 'controlsList', 'tabIndex', 'dataset', 'offsetHeight', 'offsetLeft', 'offsetParent', 'offsetTop', 'offsetWidth'];
var domEvents = ['beforeinput', 'blur', 'click', 'compositionend', 'compositionstart', 'compositionupdate', 'dblclick', 'focus', 'focusin', 'focusout', 'input', 'keydown', 'keypress', 'keyup', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'wheel', 'fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange', 'contextmenu'];
var selfProcessorEvents = ['silentLoad', 'fullScreen'];
var kernelMethods = ['play', 'pause', 'seek'];
var dispatcherMethods = ['load'];

var domMethods = ['focus', 'fullScreen', 'requestFullScreen', 'exitFullScreen'];
var videoMethods = ['canPlayType', 'captureStream', 'setSinkId'];

var secondaryReg = /^(before|after|_)/;
/**
 * <pre>
 * event Bus class. Bus take charge of commuication between plugins and user.
 * Some of the event may trigger the kernel to do some task.
 * An event will run in four lifecycle
 * before -> processor -> main -> after -> side effect(_)
 * -------------------- emit period ----------------
 * before: once an event emit, it will run through plugins in bubble to know is it possible to run.
 * processor: if sth need to be done on kernel. It will tell kernel. If kernel will trigger event later, it will break down here. Else will run into trigger period
 * -------------------- trigger period -----------------
 * main: this procedure will trigger the main event in bubble, which means it can be stop in one plugin.
 * after: once event run through all events. It will trigger after event. This event will be trigger in broadcast way.
 * side effect(_): This events will always trigger once we bump into trigger period. So that you can know if the events been blocked. But it's not advice to listen on this effect.
 * </pre>
 */

var Bus = function () {
  /**
   * @param {Dispatcheer} dispatcher bus rely on dispatcher, so you mush pass dispatcher at first when you generate Bus.
   * @return {Bus}
   */

  /**
   * the handler set of all events
   * @type {Object}
   * @member events
   */
  function Bus(dispatcher) {
    _classCallCheck(this, Bus);

    this.events = {};
    this.onceMap = {};

    /**
     * the referrence to dispatcher
     * @type {Dispatcher}
     */
    this.__dispatcher = dispatcher;
  }
  /**
   * [Can only be called in dispatcher]bind event on bus.
   * @param  {string} id plugin's id
   * @param  {string} key event's name
   * @param  {fn} handler function
   */


  _createClass(Bus, [{
    key: 'on',
    value: function on(id, key, fn) {
      var _getEventStage2 = this._getEventStage(key),
          stage = _getEventStage2.stage,
          eventName = _getEventStage2.key;

      this._addEvent([eventName, stage, id], fn);
    }
    /**
     * [Can only be called in dispatcher]remove event off bus. Only suggest one by one.
     * @param  {string} id plugin's id
     * @param  {string} key event's name
     * @param  {fn} handler function
     */

  }, {
    key: 'off',
    value: function off(id, key, fn) {
      var _getEventStage3 = this._getEventStage(key),
          stage = _getEventStage3.stage,
          eventName = _getEventStage3.key;

      var keys$$1 = [eventName, stage, id];
      var deleted = this._removeEvent(keys$$1, fn);
      if (deleted) return;
      var handler = this._getHandlerFromOnceMap(keys$$1, fn);
      if (isFunction(handler)) {
        this._removeEvent(keys$$1, handler) && this._removeFromOnceMap(keys$$1, fn, handler);
      }
    }
    /**
     * [Can only be called in dispatcher]bind event on bus and remove it once event is triggered.
     * @param  {string} id plugin's id
     * @param  {string} key event's name
     * @param  {Function} fn handler function
     */

  }, {
    key: 'once',
    value: function once(id, key, fn) {
      var _getEventStage4 = this._getEventStage(key),
          stage = _getEventStage4.stage,
          eventName = _getEventStage4.key;

      var bus = this;
      var keys$$1 = [eventName, stage, id];
      var handler = function handler() {
        // keep the this so that it can run
        bind(fn, this).apply(undefined, arguments);
        bus._removeEvent(keys$$1, handler);
        bus._removeFromOnceMap(keys$$1, fn, handler);
      };
      this._addEvent(keys$$1, handler);
      this._addToOnceMap(keys$$1, fn, handler);
    }
    /**
     * [Can only be called in dispatcher]emit an event, which will run before -> processor period.
     * It may stop in before period.
     * @param  {string}    key event's name
     * @param  {anything} args other argument will be passed into handler
     * @return {Promise}  this promise maybe useful if the event would not trigger kernel event. In that will you can know if it runs successful. But you can know if the event been stopped by the promise.
     */

  }, {
    key: 'emit',
    value: function emit(key) {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (key.match(secondaryReg)) {
        Log.warn('bus', 'Secondary Event could not be emit');
        return;
      }
      var event = this.events[key];
      if (isEmpty(event)) {
        if (selfProcessorEvents.indexOf(key) > -1) return _Promise.resolve();
        return this._eventProcessor.apply(this, [key, { sync: false }].concat(_toConsumableArray(args)));
      }
      var beforeQueue = this._getEventQueue(event.before, this.__dispatcher.order);
      return runRejectableQueue.apply(undefined, [beforeQueue].concat(_toConsumableArray(args))).then(function () {
        if (selfProcessorEvents.indexOf(key) > -1) return;
        return _this._eventProcessor.apply(_this, [key, { sync: false }].concat(_toConsumableArray(args)));
      }).catch(function (error) {
        if (isError(error)) _this.__dispatcher.throwError(error);
        return _Promise.reject(error);
      });
    }
    /**
     * [Can only be called in dispatcher]emit an event, which will run before -> processor period synchronize.
     * It may stop in before period.
     * @param  {string}    key event's name
     * @param  {anything} args other argument will be passed into handler
     * @return {Promise}  this promise maybe useful if the event would not trigger kernel event. In that will you can know if it runs successful. But you can know if the event been stopped by the promise.
     */

  }, {
    key: 'emitSync',
    value: function emitSync(key) {
      if (key.match(secondaryReg)) {
        Log.warn('bus', 'Secondary Event could not be emit');
        return false;
      }
      var event = this.events[key];

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if (isEmpty(event)) {
        if (selfProcessorEvents.indexOf(key) > -1) return true;
        return this._eventProcessor.apply(this, [key, { sync: true }].concat(_toConsumableArray(args)));
      }
      var beforeQueue = this._getEventQueue(event.before, this.__dispatcher.order);
      return runStoppableQueue.apply(undefined, [beforeQueue].concat(_toConsumableArray(args))) && (selfProcessorEvents.indexOf(key) > -1 || this._eventProcessor.apply(this, [key, { sync: true }].concat(_toConsumableArray(args))));
    }
    /**
     * [Can only be called in dispatcher]trigger an event, which will run main -> after -> side effect period
     * @param  {string}    key event's name
     * @param  {anything} args
     * @return {Promise|undefined}    you can know if event trigger finished~ However, if it's unlegal
     */

  }, {
    key: 'trigger',
    value: function trigger(key) {
      var _this2 = this;

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      if (key.match(secondaryReg)) {
        Log.warn('bus', 'Secondary Event could not be emit');
        return;
      }
      var event = this.events[key];
      if (isEmpty(event)) {
        return _Promise.resolve(true);
      }
      var mainQueue = this._getEventQueue(event.main, this.__dispatcher.order);
      return runRejectableQueue.apply(undefined, [mainQueue].concat(_toConsumableArray(args))).then(function () {
        var afterQueue = _this2._getEventQueue(event.after, _this2.__dispatcher.order);
        return runRejectableQueue.apply(undefined, [afterQueue].concat(_toConsumableArray(args)));
      }).then(function () {
        return _this2._runSideEffectEvent.apply(_this2, [key, _this2.__dispatcher.order].concat(_toConsumableArray(args)));
      }).catch(function (error) {
        if (isError(error)) _this2.__dispatcher.throwError(error);
        return _this2._runSideEffectEvent.apply(_this2, [key, _this2.__dispatcher.order].concat(_toConsumableArray(args)));
      });
    }
    /**
    * [Can only be called in dispatcher]trigger an event, which will run main -> after -> side effect period in synchronize
    * @param  {string}    key event's name
    * @param  {anything} args
    * @return {boolean}    you can know if event trigger finished~ However, if it's unlegal
    */

  }, {
    key: 'triggerSync',
    value: function triggerSync(key) {
      if (key.match(secondaryReg)) {
        Log.warn('bus', 'Secondary Event could not be emit');
        return false;
      }
      var event = this.events[key];
      if (isEmpty(event)) {
        return true;
      }
      var mainQueue = this._getEventQueue(event.main, this.__dispatcher.order);
      var afterQueue = this._getEventQueue(event.after, this.__dispatcher.order);

      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      var result = runStoppableQueue.apply(undefined, [mainQueue].concat(_toConsumableArray(args))) && runStoppableQueue.apply(undefined, [afterQueue].concat(_toConsumableArray(args)));
      this._runSideEffectEvent.apply(this, [key, this.__dispatcher.order].concat(_toConsumableArray(args)));
      return result;
    }
    /**
     * destroy hook which will be called when object destroy
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      delete this.events;
      delete this.__dispatcher;
    }
    /**
     * add event into bus
     * @private
     * @param {Array} keys keys map pointing to position to put event handler
     * @param {function} fn handler to put
     */

  }, {
    key: '_addEvent',
    value: function _addEvent(keys$$1, fn) {
      keys$$1 = deepClone(keys$$1);
      var id = keys$$1.pop();
      var target = keys$$1.reduce(function (target, key) {
        target[key] = target[key] || {};
        return target[key];
      }, this.events);
      // events will store like {play: {main: {plugin: []}}}
      target[id] = target[id] || [];
      target[id].push(fn);
    }
    /**
     * remove event from bus
     * @private
     * @param {Array} keys keys map pointing to position to get event handler
     * @param {function} fn handler to put
     */

  }, {
    key: '_removeEvent',
    value: function _removeEvent(keys$$1, fn) {
      keys$$1 = deepClone(keys$$1);
      var id = keys$$1.pop();
      var target = this.events;
      for (var i = 0, len = keys$$1.length; i < len; i++) {
        var son = target[keys$$1[i]];
        // if we can't find the event binder, just return
        if (isEmpty(son)) return;
        target = son;
      }
      var queue = target[id] || [];
      var index = queue.indexOf(fn);
      var hasFn = index > -1;
      // if we found handler remove it
      if (hasFn) {
        queue.splice(index, 1);
      }
      // if this plugin has no event binding, we remove this event session, which make us perform faster in emit & trigger period.
      if (queue.length < 1) {
        delete target[id];
      }
      return hasFn;
    }
  }, {
    key: '_addToOnceMap',
    value: function _addToOnceMap(keys$$1, fn, handler) {
      var key = keys$$1.join('-');
      var map$$1 = this.onceMap[key] = this.onceMap[key] || new _Map();
      if (!map$$1.has(fn)) map$$1.set(fn, []);
      var handlers = map$$1.get(fn);
      // $FlowFixMe: flow do not understand map yet
      handlers.push(handler);
    }
  }, {
    key: '_removeFromOnceMap',
    value: function _removeFromOnceMap(keys$$1, fn, handler) {
      var key = keys$$1.join('-');
      var map$$1 = this.onceMap[key];
      // do not need to check now
      // if(isVoid(map) || !map.has(fn)) return;
      var handlers = map$$1.get(fn);
      var index = handlers.indexOf(handler);
      handlers.splice(index, 1);
      if (isEmpty(handlers)) map$$1.delete(fn);
    }
  }, {
    key: '_getHandlerFromOnceMap',
    value: function _getHandlerFromOnceMap(keys$$1, fn) {
      var key = keys$$1.join('-');
      var map$$1 = this.onceMap[key];
      if (isVoid(map$$1) || !map$$1.has(fn)) return;
      var handlers = map$$1.get(fn);
      return handlers[0];
    }
    /**
     * get event stage by evnet key name
     * @private
     * @param  {key} key event's name
     * @return {stage}  event stage
     */

  }, {
    key: '_getEventStage',
    value: function _getEventStage(key) {
      var secondaryCheck = key.match(secondaryReg);
      var stage = secondaryCheck && secondaryCheck[0] || 'main';
      if (secondaryCheck) {
        key = camelize(key.replace(secondaryReg, ''));
      }
      return { stage: stage, key: key };
    }
    /**
     * get event handlers queue to run
     * @private
     * @param  {Object} handlerSet the object include all handler
     * @param  {Array} Array form of plugin id
     * @return {Array<Function>} event handler in queue to run
     */

  }, {
    key: '_getEventQueue',
    value: function _getEventQueue(handlerSet, order) {
      var _this3 = this;

      order = isArray$1(order) ? order.concat(['_vm']) : ['_vm'];
      return isEmpty(handlerSet) ? [] : order.reduce(function (queue, id) {
        if (isEmpty(handlerSet[id]) || !isArray$1(handlerSet[id]) ||
        // in case plugins is missed
        // _vm indicate the user. This is the function for user
        !_this3.__dispatcher.plugins[id] && id !== '_vm') {
          return queue;
        }
        return queue.concat(handlerSet[id].map(function (fn) {
          // bind context for plugin instance
          return bind(fn, _this3.__dispatcher.plugins[id] || _this3.__dispatcher.vm);
        }));
      }, []);
    }
    /**
     * event processor period. If event needs call kernel function.
     * I will called here.
     * If kernel will reponse. I will stop here.
     * Else I will trigger next period.
     * @param  {string}    key event's name
     * @param  {boolean}  options.sync we will take triggerSync if true, otherwise we will run trigger. default is false
     * @param  {anything} args
     * @return {Promise|undefined}
     */

  }, {
    key: '_eventProcessor',
    value: function _eventProcessor(key, _ref) {
      var sync = _ref.sync;

      var isKernelMethod = kernelMethods.indexOf(key) > -1;
      var isDomMethod = domMethods.indexOf(key) > -1;
      var isDispatcherMethod = dispatcherMethods.indexOf(key) > -1;

      for (var _len5 = arguments.length, args = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        args[_key5 - 2] = arguments[_key5];
      }

      if (isKernelMethod || isDomMethod || isDispatcherMethod) {
        if (isDispatcherMethod) {
          var _dispatcher;

          (_dispatcher = this.__dispatcher)[key].apply(_dispatcher, _toConsumableArray(args));
        } else {
          var _dispatcher2;

          (_dispatcher2 = this.__dispatcher[isKernelMethod ? 'kernel' : 'dom'])[key].apply(_dispatcher2, _toConsumableArray(args));
        }
        if (videoEvents.indexOf(key) > -1 || domEvents.indexOf(key) > -1) return true;
      }
      // $FlowFixMe: flow do not support computed sytax on classs, but it's ok here
      return this[sync ? 'triggerSync' : 'trigger'].apply(this, [key].concat(_toConsumableArray(args)));
    }
    /**
     * run side effect period
     * @param  {string}    key event's name
     * @param  {args} args
     */

  }, {
    key: '_runSideEffectEvent',
    value: function _runSideEffectEvent(key, order) {
      for (var _len6 = arguments.length, args = Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
        args[_key6 - 2] = arguments[_key6];
      }

      var event = this.events[key];
      if (isEmpty(event)) {
        return;
      }
      var queue = this._getEventQueue(event['_'], order);
      queue.forEach(function (run) {
        return run.apply(undefined, _toConsumableArray(args));
      });
      return true;
    }
  }]);

  return Bus;
}();

/**
 * checker for on, off, once function
 * @param {string} key
 * @param {Function} fn
 */
function eventBinderCheck(key, fn) {
  if (!isString(key)) throw new TypeError('key parameter must be String');
  if (!isFunction(fn)) throw new TypeError('fn parameter must be Function');
}
/**
 * checker for attr or css function
 */
function attrAndStyleCheck() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length > 2) {
    return ['set'].concat(args);
  }
  if (args.length === 2) {
    if (['video', 'container', 'wrapper', 'videoElement'].indexOf(args[0]) > -1) {
      return ['get'].concat(args);
    }
    return ['set', 'container'].concat(args);
  }
  return ['get', 'container'].concat(args);
}

var _dec$4;
var _dec2$2;
var _class$4;
var _descriptor$1;
var _descriptor2$1;
var _descriptor3$1;
var _descriptor4;
var _descriptor5;
var _descriptor6;
var _descriptor7;

function _initDefineProp$1(target, property, descriptor, context) {
  if (!descriptor) return;

  _Object$defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor$3(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function stringOrVoid(value) {
  return isString(value) ? value : undefined;
}

function accessorVideoProperty(property) {
  return accessor({
    get: function get$$1(value) {
      return this.dispatcher.videoConfigReady && this.inited ? this.dom.videoElement[property] : value;
    },
    set: function set(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      this.dom.videoElement[property] = value;
      return value;
    }
  });
}

function accessorVideoAttribute(attribute) {
  var _ref = isObject$1(attribute) ? attribute : {
    set: attribute,
    get: attribute,
    isBoolean: false
  },
      _set = _ref.set,
      _get$$1 = _ref.get,
      isBoolean$$1 = _ref.isBoolean;

  return accessor({
    get: function get$$1(value) {
      return this.dispatcher.videoConfigReady && this.inited ? this.dom.videoElement[_get$$1] : value;
    },
    set: function set(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      var val = isBoolean$$1 ? value ? '' : undefined : value === null ? undefined : value;
      this.dom.setAttr('video', _set, val);
      return value;
    }
  });
}

function accessorCustomAttribute(attribute, isBoolean$$1) {
  return accessor({
    get: function get$$1(value) {
      var attrValue = this.dom.getAttr('video', attribute);
      return this.dispatcher.videoConfigReady && this.inited ? isBoolean$$1 ? !!attrValue : attrValue : value;
    },
    set: function set(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      var val = isBoolean$$1 ? value || undefined : value === null ? undefined : value;
      this.dom.setAttr('video', attribute, val);
      return value;
    }
  });
}

function accessorWidthAndHeight(property) {
  return accessor({
    get: function get$$1(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      var attr = this.dom.getAttr('video', property);
      var prop = this.dom.videoElement[property];
      if (isNumeric(attr) && isNumber(prop)) return prop;
      return attr || undefined;
    },
    set: function set(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      var val = void 0;
      if (value === undefined || isNumber(value)) {
        val = value;
      } else if (isString(value) && !_Number$isNaN(parseFloat(value))) {
        val = value;
      }
      this.dom.setAttr('video', property, val);
      return val;
    }
  });
}

var accessorMap = {
  src: [string$1(), accessor({
    set: function set(val) {
      // must check val !== this.src here
      // as we will set config.src in the video
      // the may cause dead lock
      if (this.dispatcher.readySync && this.autoload && val !== this.src) this.needToLoadSrc = true;
      return val;
    }
  }), accessor({
    set: function set(val) {
      if (this.needToLoadSrc) {
        // unlock it at first, to avoid deadlock
        this.needToLoadSrc = false;
        this.dispatcher.bus.emit('load', val);
      }
      return val;
    }
  }, { preSet: false })],
  autoload: boolean$1(),
  autoplay: [boolean$1(), accessorVideoProperty('autoplay')],
  controls: [boolean$1(), accessorVideoProperty('controls')],
  width: [accessorWidthAndHeight('width')],
  height: [accessorWidthAndHeight('height')],
  crossOrigin: [accessor({ set: stringOrVoid }), accessorVideoAttribute({ set: 'crossorigin', get: 'crossOrigin' })],
  loop: [boolean$1(), accessorVideoProperty('loop')],
  defaultMuted: [boolean$1(), accessorVideoAttribute({ get: 'defaultMuted', set: 'muted', isBoolean: true })],
  muted: [boolean$1(), accessorVideoProperty('muted')],
  preload: [accessor({ set: stringOrVoid }), accessorVideoAttribute('preload')],
  poster: [accessor({ set: stringOrVoid }), accessorVideoAttribute('poster')],
  playsInline: [accessor({
    get: function get$$1(value) {
      var playsInline = this.dom.videoElement.playsInline;
      return this.dispatcher.videoConfigReady && this.inited ? playsInline === undefined ? value : playsInline : value;
    },
    set: function set(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      this.dom.videoElement.playsInline = value;
      var val = value ? '' : undefined;
      this.dom.setAttr('video', 'playsinline', val);
      this.dom.setAttr('video', 'webkit-playsinline', val);
      this.dom.setAttr('video', 'x5-video-player-type', value ? 'h5' : undefined);
      return value;
    }
  }), boolean$1()],
  x5VideoPlayerFullScreen: [accessor({
    set: function set(value) {
      return !!value;
    },
    get: function get$$1(value) {
      return !!value;
    }
  }), accessorCustomAttribute('x5-video-player-fullscreen', true)],
  x5VideoOrientation: [accessor({ set: stringOrVoid }), accessorCustomAttribute('x5-video-orientation')],
  xWebkitAirplay: [accessor({
    set: function set(value) {
      return !!value;
    },
    get: function get$$1(value) {
      return !!value;
    }
  }), accessorCustomAttribute('x-webkit-airplay', true)],
  playbackRate: [number$1(1), accessorVideoProperty('playbackRate')],
  defaultPlaybackRate: [accessorVideoProperty('defaultPlaybackRate'), number$1(1)],
  disableRemotePlayback: [boolean$1(), accessorVideoProperty('disableRemotePlayback')],
  volume: [number$1(1), accessorVideoProperty('volume')]
};

var VideoConfig = (_dec$4 = boolean(), _dec2$2 = string(function (str) {
  return str.toLocaleLowerCase();
}), (_class$4 = function () {
  _createClass(VideoConfig, [{
    key: 'lockKernelProperty',
    value: function lockKernelProperty() {
      applyDecorators(this, {
        isLive: lock,
        box: lock,
        preset: lock
      }, { self: true });
    }
  }]);

  function VideoConfig(dispatcher, config) {
    _classCallCheck(this, VideoConfig);

    _initDefineProp$1(this, 'needToLoadSrc', _descriptor$1, this);

    _initDefineProp$1(this, 'changeWatchable', _descriptor2$1, this);

    _initDefineProp$1(this, 'inited', _descriptor3$1, this);

    this.src = '';

    _initDefineProp$1(this, 'isLive', _descriptor4, this);

    _initDefineProp$1(this, 'box', _descriptor5, this);

    this.preset = {};
    this.autoload = true;
    this.autoplay = false;
    this.controls = false;
    this.width = undefined;
    this.height = undefined;
    this.crossOrigin = undefined;
    this.loop = false;
    this.defaultMuted = false;
    this.muted = false;
    this.preload = 'auto';
    this.poster = undefined;
    this.playsInline = false;
    this.x5VideoPlayerFullScreen = false;
    this.x5VideoOrientation = undefined;
    this.xWebkitAirplay = false;
    this.playbackRate = 1;
    this.defaultPlaybackRate = 1;
    this.disableRemotePlayback = false;
    this.volume = 1;

    _initDefineProp$1(this, '_kernelProperty', _descriptor6, this);

    _initDefineProp$1(this, '_realDomAttr', _descriptor7, this);

    applyDecorators(this, accessorMap, { self: true });
    Object.defineProperty(this, 'dispatcher', {
      value: dispatcher,
      enumerable: false,
      writable: false,
      configurable: false
    });
    Object.defineProperty(this, 'dom', {
      value: dispatcher.dom,
      enumerable: false,
      writable: false,
      configurable: false
    });
    deepAssign(this, config);
  }

  _createClass(VideoConfig, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this._realDomAttr.forEach(function (key) {
        // $FlowFixMe: we have check the computed here
        _this[key] = _this[key];
      });
      this.inited = true;
    }
  }]);

  return VideoConfig;
}(), (_descriptor$1 = _applyDecoratedDescriptor$3(_class$4.prototype, 'needToLoadSrc', [nonenumerable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor2$1 = _applyDecoratedDescriptor$3(_class$4.prototype, 'changeWatchable', [nonenumerable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor3$1 = _applyDecoratedDescriptor$3(_class$4.prototype, 'inited', [nonenumerable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor4 = _applyDecoratedDescriptor$3(_class$4.prototype, 'isLive', [_dec$4, nonconfigurable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor5 = _applyDecoratedDescriptor$3(_class$4.prototype, 'box', [_dec2$2, nonconfigurable], {
  enumerable: true,
  initializer: function initializer() {
    return '';
  }
}), _descriptor6 = _applyDecoratedDescriptor$3(_class$4.prototype, '_kernelProperty', [frozen], {
  enumerable: true,
  initializer: function initializer() {
    return ['isLive', 'box', 'preset'];
  }
}), _descriptor7 = _applyDecoratedDescriptor$3(_class$4.prototype, '_realDomAttr', [frozen], {
  enumerable: true,
  initializer: function initializer() {
    return ['src', 'controls', 'width', 'height', 'crossOrigin', 'loop', 'muted', 'preload', 'poster', 'autoplay', 'playsInline', 'x5VideoPlayerFullScreen', 'x5VideoOrientation', 'xWebkitAirplay', 'playbackRate', 'defaultPlaybackRate', 'autoload', 'disableRemotePlayback', 'defaultMuted', 'volume'];
  }
})), _class$4));

var _dec$3;
var _dec2$1;
var _dec3$1;
var _dec4$1;
var _dec5$1;
var _dec6;
var _dec7;
var _dec8;
var _dec9;
var _dec10;
var _dec11;
var _dec12;
var _dec13;
var _dec14;
var _dec15;
var _dec16;
var _dec17;
var _class$3;
var _class2$1;

function _applyDecoratedDescriptor$2(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function propertyAccessibilityWarn(property) {
  Log.warn('chimee', 'You are trying to obtain ' + property + ', we will return you the DOM node. It\'s not a good idea to handle this by yourself. If you have some requirement, you can tell use by https://github.com/Chimeejs/chimee/issues');
}
var VideoWrapper = (_dec$3 = autobindClass(), _dec2$1 = alias('silentLoad'), _dec3$1 = alias('fullScreen'), _dec4$1 = alias('emit'), _dec5$1 = alias('emitSync'), _dec6 = alias('on'), _dec7 = alias('addEventListener'), _dec8 = before(eventBinderCheck), _dec9 = alias('off'), _dec10 = alias('removeEventListener'), _dec11 = before(eventBinderCheck), _dec12 = alias('once'), _dec13 = before(eventBinderCheck), _dec14 = alias('css'), _dec15 = before(attrAndStyleCheck), _dec16 = alias('attr'), _dec17 = before(attrAndStyleCheck), _dec$3(_class$3 = (_class2$1 = function () {
  function VideoWrapper() {
    _classCallCheck(this, VideoWrapper);

    this.__events = {};
    this.__unwatchHandlers = [];
  }

  _createClass(VideoWrapper, [{
    key: '__wrapAsVideo',
    value: function __wrapAsVideo(videoConfig) {
      var _this = this;

      // bind video read only properties on instance, so that you can get info like buffered
      videoReadOnlyProperties.forEach(function (key) {
        _Object$defineProperty(_this, key, {
          get: function get$$1() {
            return this.__dispatcher.dom.videoElement[key];
          },

          set: undefined,
          configurable: false,
          enumerable: false
        });
      });
      // bind videoMethods like canplaytype on instance
      videoMethods.forEach(function (key) {
        _Object$defineProperty(_this, key, {
          get: function get$$1() {
            var video = this.__dispatcher.dom.videoElement;
            return bind(video[key], video);
          },

          set: undefined,
          configurable: false,
          enumerable: false
        });
      });
      // bind video config properties on instance, so that you can just set src by this
      var props = videoConfig._realDomAttr.concat(videoConfig._kernelProperty).reduce(function (props, key) {
        props[key] = [accessor({
          get: function get$$1() {
            // $FlowFixMe: support computed key here
            return videoConfig[key];
          },
          set: function set(value) {
            // $FlowFixMe: support computed key here
            videoConfig[key] = value;
            return value;
          }
        }), nonenumerable];
        return props;
      }, {});
      applyDecorators(this, props, { self: true });
      kernelMethods.forEach(function (key) {
        _Object$defineProperty(_this, key, {
          value: function value() {
            var _this2 = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return new _Promise(function (resolve, reject) {
              var _dispatcher$bus;

              _this2.__dispatcher.bus.once(_this2.__id, '_' + key, resolve);
              (_dispatcher$bus = _this2.__dispatcher.bus)[/^(seek)$/.test(key) ? 'emitSync' : 'emit'].apply(_dispatcher$bus, [key].concat(_toConsumableArray(args)));
            });
          },

          configurable: true,
          enumerable: false,
          writable: true
        });
      });
      domMethods.forEach(function (key) {
        if (key === 'fullScreen') return;
        _Object$defineProperty(_this, key, {
          value: function value() {
            var _dispatcher$dom;

            return (_dispatcher$dom = this.__dispatcher.dom)[key].apply(_dispatcher$dom, arguments);
          },

          configurable: true,
          enumerable: false,
          writable: true
        });
      });
    }
  }, {
    key: '$watch',
    value: function $watch(key, handler) {
      var _this3 = this;

      var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          deep = _ref.deep,
          _ref$diff = _ref.diff,
          diff = _ref$diff === undefined ? true : _ref$diff,
          other = _ref.other,
          _ref$proxy = _ref.proxy,
          proxy = _ref$proxy === undefined ? false : _ref$proxy;

      if (!isString(key) && !isArray$1(key)) throw new TypeError('$watch only accept string and Array<string> as key to find the target to spy on, but not ' + key + ', whose type is ' + (typeof key === 'undefined' ? 'undefined' : _typeof(key)));
      var watching = true;
      var watcher = function watcher() {
        if (watching && (!(this instanceof VideoConfig) || this.dispatcher.changeWatchable)) bind(handler, this).apply(undefined, arguments);
      };
      var unwatcher = function unwatcher() {
        watching = false;
        var index = _this3.__unwatchHandlers.indexOf(unwatcher);
        if (index > -1) _this3.__unwatchHandlers.splice(index, 1);
      };
      var keys$$1 = isString(key) ? key.split('.') : key;
      var property = keys$$1.pop();
      var videoConfig = this.__dispatcher.videoConfig;
      var target = keys$$1.length === 0 && !other && videoConfig._realDomAttr.indexOf(property) > -1 ? videoConfig : ['isFullScreen', 'fullScreenElement'].indexOf(property) > -1 ? this.__dispatcher.dom : getDeepProperty(other || this, keys$$1, { throwError: true });
      applyDecorators(target, _defineProperty$1({}, property, watch(watcher, { deep: deep, diff: diff, proxy: proxy })), { self: true });
      this.__unwatchHandlers.push(unwatcher);
      return unwatcher;
    }
  }, {
    key: '$set',
    value: function $set(obj, property, value) {
      if (!isObject$1(obj) && !isArray$1(obj)) throw new TypeError('$set only support Array or Object, but not ' + obj + ', whose type is ' + (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)));
      // $FlowFixMe: we have custom this function
      if (!isFunction(obj.__set)) {
        Log.warn('chimee', _JSON$stringify(obj) + ' has not been deep watch. There is no need to use $set.');
        // $FlowFixMe: we support computed string on array here
        obj[property] = value;
        return;
      }
      obj.__set(property, value);
    }
  }, {
    key: '$del',
    value: function $del(obj, property) {
      if (!isObject$1(obj) && !isArray$1(obj)) throw new TypeError('$del only support Array or Object, but not ' + obj + ', whose type is ' + (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)));
      // $FlowFixMe: we have custom this function
      if (!isFunction(obj.__del)) {
        Log.warn('chimee', _JSON$stringify(obj) + ' has not been deep watch. There is no need to use $del.');
        // $FlowFixMe: we support computed string on array here
        delete obj[property];
        return;
      }
      obj.__del(property);
    }
  }, {
    key: 'load',
    value: function load() {
      var _this4 = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return new _Promise(function (resolve, reject) {
        var _dispatcher$bus2;

        _this4.__dispatcher.bus.once(_this4.__id, '_load', resolve);
        (_dispatcher$bus2 = _this4.__dispatcher.bus).emit.apply(_dispatcher$bus2, ['load'].concat(args));
      });
    }
  }, {
    key: '$silentLoad',
    value: function $silentLoad() {
      var _this5 = this;

      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return this.__dispatcher.bus.emit('silentLoad').then(function () {
        var _dispatcher;

        return (_dispatcher = _this5.__dispatcher).silentLoad.apply(_dispatcher, args);
      }).then(function (result) {
        _this5.__dispatcher.bus.trigger('silentLoad', result);
      });
    }

    /**
     * call fullscreen api on some specific element
     * @param {boolean} flag true means fullscreen and means exit fullscreen
     * @param {string} element the element you want to fullscreen, default it's container, you can choose from video | container | wrapper
     */

  }, {
    key: '$fullScreen',
    value: function $fullScreen() {
      var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'container';

      if (!this.__dispatcher.bus.emitSync('fullScreen', flag, element)) return false;
      var result = this.__dispatcher.dom.fullScreen(flag, element);
      this.__dispatcher.bus.triggerSync('fullScreen', flag, element);
      return result;
    }

    /**
     * emit an event
     * @param  {string}    key event's name
     * @param  {...args} args
     */

  }, {
    key: '$emit',
    value: function $emit(key) {
      var _dispatcher$bus3;

      if (!isString(key)) throw new TypeError('emit key parameter must be String');
      if (domEvents.indexOf(key.replace(/^\w_/, '')) > -1) {
        Log.warn('plugin', 'You are try to emit ' + key + ' event. As emit is wrapped in Promise. It make you can\'t use event.preventDefault and event.stopPropagation. So we advice you to use emitSync');
      }

      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      (_dispatcher$bus3 = this.__dispatcher.bus).emit.apply(_dispatcher$bus3, [key].concat(_toConsumableArray(args)));
    }

    /**
     * emit a sync event
     * @param  {string}    key event's name
     * @param  {...args} args
     */

  }, {
    key: '$emitSync',
    value: function $emitSync(key) {
      var _dispatcher$bus4;

      if (!isString(key)) throw new TypeError('emitSync key parameter must be String');

      for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }

      return (_dispatcher$bus4 = this.__dispatcher.bus).emitSync.apply(_dispatcher$bus4, [key].concat(_toConsumableArray(args)));
    }

    /**
     * bind event handler through this function
     * @param  {string} key event's name
     * @param  {Function} fn event's handler
     */

  }, {
    key: '$on',
    value: function $on(key, fn) {
      this.__dispatcher.bus.on(this.__id, key, fn);
      // set on __events as mark so that i can destroy it when i destroy
      this.__addEvents(key, fn);
    }
    /**
     * remove event handler through this function
     * @param  {string} key event's name
     * @param  {Function} fn event's handler
     */

  }, {
    key: '$off',
    value: function $off(key, fn) {
      this.__dispatcher.bus.off(this.__id, key, fn);
      this.__removeEvents(key, fn);
    }
    /**
     * bind one time event handler
     * @param {string} key event's name
     * @param {Function} fn event's handler
     */

  }, {
    key: '$once',
    value: function $once(key, fn) {
      var self = this;
      var boundFn = function boundFn() {
        bind(fn, this).apply(undefined, arguments);
        self.__removeEvents(key, boundFn);
      };
      self.__addEvents(key, boundFn);
      this.__dispatcher.bus.once(this.__id, key, boundFn);
    }

    /**
     * set style
     * @param {string} element optional, default to be video, you can choose from video | container | wrapper
     * @param {string} attribute the atrribue name
     * @param {any} value optional, when it's no offer, we consider you want to get the attribute's value. When it's offered, we consider you to set the attribute's value, if the value you passed is undefined, that means you want to remove the value;
     */

  }, {
    key: '$css',
    value: function $css(method) {
      var _dispatcher$dom2;

      for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        args[_key6 - 1] = arguments[_key6];
      }

      return (_dispatcher$dom2 = this.__dispatcher.dom)[method + 'Style'].apply(_dispatcher$dom2, args);
    }

    /**
     * set attr
     * @param {string} element optional, default to be video, you can choose from video | container | wrapper
     * @param {string} attribute the atrribue nameß
     * @param {any} value optional, when it's no offer, we consider you want to get the attribute's value. When it's offered, we consider you to set the attribute's value, if the value you passed is undefined, that means you want to remove the value;
     */

  }, {
    key: '$attr',
    value: function $attr(method) {
      var _dispatcher$dom3;

      for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
        args[_key7 - 1] = arguments[_key7];
      }

      if (method === 'set' && /video/.test(args[0])) {
        if (!this.__dispatcher.videoConfigReady) {
          Log.warn('chimee', this.__id + ' is tring to set attribute on video before video inited. Please wait until the inited event has benn trigger');
          return args[2];
        }
        if (this.__dispatcher.videoConfig._realDomAttr.indexOf(args[1]) > -1) {
          var key = args[1],
              val = args[2];

          this.__dispatcher.videoConfig[key] = val;
          return val;
        }
      }
      return (_dispatcher$dom3 = this.__dispatcher.dom)[method + 'Attr'].apply(_dispatcher$dom3, args);
    }
  }, {
    key: '__addEvents',
    value: function __addEvents(key, fn) {
      this.__events[key] = this.__events[key] || [];
      this.__events[key].push(fn);
    }
  }, {
    key: '__removeEvents',
    value: function __removeEvents(key, fn) {
      if (isEmpty(this.__events[key])) return;
      var index = this.__events[key].indexOf(fn);
      if (index < 0) return;
      this.__events[key].splice(index, 1);
      if (isEmpty(this.__events[key])) delete this.__events[key];
    }
  }, {
    key: '__destroy',
    value: function __destroy() {
      var _this6 = this;

      this.__unwatchHandlers.forEach(function (unwatcher) {
        return unwatcher();
      });
      _Object$keys(this.__events).forEach(function (key) {
        if (!isArray$1(_this6.__events[key])) return;
        _this6.__events[key].forEach(function (fn) {
          return _this6.$off(key, fn);
        });
      });
      delete this.__events;
    }
  }, {
    key: 'currentTime',
    get: function get$$1() {
      return this.__dispatcher.kernel.currentTime;
    },
    set: function set(second) {
      this.__dispatcher.bus.emitSync('seek', second);
    }
  }, {
    key: '$plugins',
    get: function get$$1() {
      return this.__dispatcher.plugins;
    }
  }, {
    key: '$pluginOrder',
    get: function get$$1() {
      return this.__dispatcher.order;
    }
  }, {
    key: '$wrapper',
    get: function get$$1() {
      propertyAccessibilityWarn('wrapper');
      return this.__dispatcher.dom.wrapper;
    }
  }, {
    key: '$container',
    get: function get$$1() {
      propertyAccessibilityWarn('container');
      return this.__dispatcher.dom.container;
    }
  }, {
    key: '$video',
    get: function get$$1() {
      propertyAccessibilityWarn('video');
      return this.__dispatcher.dom.videoElement;
    }
  }, {
    key: 'isFullScreen',
    get: function get$$1() {
      return this.__dispatcher.dom.isFullScreen;
    }
  }, {
    key: 'fullScreenElement',
    get: function get$$1() {
      return this.__dispatcher.dom.fullScreenElement;
    }
  }]);

  return VideoWrapper;
}(), (_applyDecoratedDescriptor$2(_class2$1.prototype, '$silentLoad', [_dec2$1], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$silentLoad'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$fullScreen', [_dec3$1], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$fullScreen'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$emit', [_dec4$1], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$emit'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$emitSync', [_dec5$1], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$emitSync'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$on', [_dec6, _dec7, _dec8], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$on'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$off', [_dec9, _dec10, _dec11], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$off'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$once', [_dec12, _dec13], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$once'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$css', [_dec14, _dec15], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$css'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$attr', [_dec16, _dec17], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$attr'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$plugins', [nonenumerable, nonextendable], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$plugins'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$pluginOrder', [nonenumerable, nonextendable], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$pluginOrder'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$wrapper', [nonenumerable], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$wrapper'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$container', [nonenumerable], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$container'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$video', [nonenumerable], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$video'), _class2$1.prototype)), _class2$1)) || _class$3);

var _dec$2;
var _class$2;

/**
 * <pre>
 * Plugin is the class for plugin developer.
 * When we use a plugin, we will generate an instance of plugin.
 * Developer can do most of things base on this plugin
 * </pre>
 */
var Plugin = (_dec$2 = autobindClass(), _dec$2(_class$2 = function (_VideoWrapper) {
  _inherits(Plugin, _VideoWrapper);

  /**
   * <pre>
   * to create a plugin, we need three parameter
   * 1. the config of a plugin
   * 2. the dispatcher
   * 3. this option for plugin to read
   * this is the plugin base class, which you can get on Chimee
   * You can just extends it and then install
   * But in that way you must remember to pass the arguments to super()
   * </pre>
   * @param  {string}  PluginConfig.id        camelize from plugin's name or class name.
   * @param  {string}  PluginConfig.name      plugin's name or class name
   * @param  {Number}  PluginConfig.level     the level of z-index
   * @param  {Boolean} PluginConfig.operable  to tell if the plugin can be operable, if not, we will add pointer-events: none on it.
   * @param  {Function}  PluginConfig.create  the create function which we will called when plugin is used. sth like constructor in object style.
   * @param  {Function}  PluginConfig.destroy   function to be called when we destroy a plugin
   * @param  {Object}  PluginConfig.events    You can set some events handler in this object, we will bind it once you use the plugin.
   * @param  {Object}  PluginConfig.data      dataset we will bind on data in object style
   * @param  {Object<{get: Function, set: Function}}  PluginConfig.computed  dataset we will handle by getter and setter
   * @param  {Object<Function>}  PluginConfig.methods   some function we will bind on plugin
   * @param  {string|HTMLElment}  PluginConfig.el  can be string or HTMLElement, we will use this to create the dom for plugin
   * @param  {boolean} PluginConfig.penetrate boolean to let us do we need to forward the dom events for this plugin.
   * @param  {Dispatcher}  dispatcher referrence of dispatcher
   * @param  {Object}  option  PluginOption that will pass to the plugin
   * @return {Plugin}  plugin instance
   */
  function Plugin() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        id = _ref.id,
        name = _ref.name,
        _ref$level = _ref.level,
        level = _ref$level === undefined ? 0 : _ref$level,
        _ref$operable = _ref.operable,
        operable = _ref$operable === undefined ? true : _ref$operable,
        beforeCreate = _ref.beforeCreate,
        create = _ref.create,
        init = _ref.init,
        inited = _ref.inited,
        destroy = _ref.destroy,
        _ref$events = _ref.events,
        events = _ref$events === undefined ? {} : _ref$events,
        _ref$data = _ref.data,
        data = _ref$data === undefined ? {} : _ref$data,
        _ref$computed = _ref.computed,
        computed = _ref$computed === undefined ? {} : _ref$computed,
        _ref$methods = _ref.methods,
        methods = _ref$methods === undefined ? {} : _ref$methods,
        el = _ref.el,
        _ref$penetrate = _ref.penetrate,
        penetrate = _ref$penetrate === undefined ? false : _ref$penetrate,
        _ref$inner = _ref.inner,
        inner = _ref$inner === undefined ? true : _ref$inner,
        autoFocus = _ref.autoFocus,
        className = _ref.className;

    var dispatcher = arguments[1];
    var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { name: name };

    _classCallCheck(this, Plugin);

    var _this = _possibleConstructorReturn(this, (Plugin.__proto__ || _Object$getPrototypeOf(Plugin)).call(this));

    _this.destroyed = false;
    _this.VERSION = '0.2.2';
    _this.__operable = true;
    _this.__level = 0;

    if (isEmpty(dispatcher)) {
      Log.error('Dispatcher.plugin', 'lack of dispatcher. Do you forget to pass arguments to super in plugin?');
      throw new TypeError('lack of dispatcher');
    }
    if (!isString(id)) {
      throw new TypeError('id of PluginConfig must be string');
    }
    _this.__id = id;
    _this.__dispatcher = dispatcher;
    _this.$videoConfig = _this.__dispatcher.videoConfig;
    _this.__wrapAsVideo(_this.$videoConfig);
    _this.beforeCreate = _this.beforeCreate || beforeCreate;
    try {
      isFunction(_this.beforeCreate) && _this.beforeCreate({
        events: events,
        data: data,
        computed: computed,
        methods: methods
      }, option);
    } catch (error) {
      _this.$throwError(error);
    }
    // bind plugin methods into instance
    if (!isEmpty(methods) && isObject$1(methods)) {
      _Object$keys(methods).forEach(function (key) {
        var fn = methods[key];
        if (!isFunction(fn)) throw new TypeError('plugins methods must be Function');
        _Object$defineProperty(_this, key, {
          value: bind(fn, _this),
          writable: true,
          enumerable: false,
          configurable: true
        });
      });
    }
    // hook plugin events on bus
    if (!isEmpty(events) && isObject$1(events)) {
      _Object$keys(events).forEach(function (key) {
        if (!isFunction(events[key])) throw new TypeError('plugins events hook must bind with Function');
        _this.$on(key, events[key]);
      });
    }
    // bind data into plugin instance
    if (!isEmpty(data) && isObject$1(data)) {
      deepAssign(_this, data);
    }
    // set the computed member by getter and setter
    if (!isEmpty(computed) && isObject$1(computed)) {
      var props = _Object$keys(computed).reduce(function (props, key) {
        var val = computed[key];
        if (isFunction(val)) {
          props[key] = accessor({ get: val });
          return props;
        }
        if (isObject$1(val) && (isFunction(val.get) || isFunction(val.set))) {
          props[key] = accessor(val);
          return props;
        }
        Log.warn('Dispatcher.plugin', 'Wrong computed member \'' + key + '\' defination in Plugin ' + name);
        return props;
      }, {});
      applyDecorators(_this, props, { self: true });
    }
    /**
     * the create Function of plugin
     * @type {Function}
     */
    _this.create = _this.create || create;
    /**
     * this init Function of plugin
     * which will be called when we start to create the video player
     * the plugin can handle some config here
     * @type {Function}
     */
    _this.init = _this.init || init;
    /**
     * this inited Function of plugin
     * which will be called when we have created the video player
     * @type {Function}
     */
    _this.inited = _this.inited || inited;
    /**
     * the destroy Function of plugin
     * @type {Function}
     */
    _this.destroy = _this.destroy || destroy;
    /**
     * the dom node of whole plugin
     * @type {HTMLElement}
     */
    _this.$dom = _this.__dispatcher.dom.insertPlugin(_this.__id, el, { penetrate: penetrate, inner: inner, autoFocus: autoFocus, className: className });
    // now we can frozen inner, autoFocus and penetrate
    _this.$inner = inner;
    _this.$autoFocus = autoFocus;
    _this.$penetrate = penetrate;
    applyDecorators(_this, {
      $inner: frozen,
      $autoFocus: frozen,
      $penetrate: frozen
    }, { self: true });
    /**
     * to tell us if the plugin can be operable, can be dynamic change
     * @type {boolean}
     */
    _this.$operable = isBoolean(option.operable) ? option.operable : operable;
    _this.__level = isInteger(option.level) ? option.level : level;
    /**
     * pluginOption, so it's easy for plugin developer to check the config
     * @type {Object}
     */
    _this.$config = option;
    try {
      isFunction(_this.create) && _this.create();
    } catch (error) {
      _this.$throwError(error);
    }
    return _this;
  }
  /**
   * call for init lifecycle hook, which mainly handle the original config of video and kernel.
   * @param {VideoConfig} videoConfig the original config of the videoElement or Kernel
   */


  _createClass(Plugin, [{
    key: '__init',
    value: function __init(videoConfig) {
      try {
        isFunction(this.init) && this.init(videoConfig);
      } catch (error) {
        this.$throwError(error);
      }
    }
    /**
     * call for inited lifecycle hook, which just to tell the plugin we have inited.
     */

  }, {
    key: '__inited',
    value: function __inited() {
      var _this2 = this;

      var result = void 0;
      try {
        result = isFunction(this.inited) && this.inited();
      } catch (error) {
        this.$throwError(error);
      }
      this.readySync = !isPromise(result);
      this.ready = this.readySync ? _Promise.resolve()
      // $FlowFixMe: it's promise now
      : result.then(function (ret) {
        _this2.readySync = true;
        return ret;
      }).catch(function (error) {
        if (isError(error)) return _this2.$throwError(error);
        return _Promise.reject(error);
      });
      return this.readySync || this.ready;
    }

    /**
     * set the plugin to be the top of all plugins
     */

  }, {
    key: '$bumpToTop',
    value: function $bumpToTop() {
      var topLevel = this.__dispatcher._getTopLevel(this.$inner);
      this.$level = topLevel + 1;
    }
  }, {
    key: '$throwError',
    value: function $throwError(error) {
      this.__dispatcher.throwError(error);
    }
    /**
     * officail destroy function for plugin
     * we will call user destory function in this method
     */

  }, {
    key: '$destroy',
    value: function $destroy() {
      isFunction(this.destroy) && this.destroy();
      _get(Plugin.prototype.__proto__ || _Object$getPrototypeOf(Plugin.prototype), '__destroy', this).call(this);
      this.__dispatcher.dom.removePlugin(this.__id);
      delete this.__dispatcher;
      delete this.$dom;
      this.destroyed = true;
    }
    /**
     * to tell us if the plugin can be operable, can be dynamic change
     * @type {boolean}
     */

  }, {
    key: '$operable',
    set: function set(val) {
      if (!isBoolean(val)) return;
      this.$dom.style.pointerEvents = val ? 'auto' : 'none';
      this.__operable = val;
    },
    get: function get$$1() {
      return this.__operable;
    }
    /**
     * the z-index level, higher when you set higher
     * @type {boolean}
     */

  }, {
    key: '$level',
    set: function set(val) {
      if (!isInteger(val)) return;
      this.__level = val;
      this.__dispatcher._sortZIndex();
    },
    get: function get$$1() {
      return this.__level;
    }
  }]);

  return Plugin;
}(VideoWrapper)) || _class$2);

var _dec$5;
var _dec2$3;
var _dec3$2;
var _dec4$2;
var _dec5$2;
var _dec6$1;
var _class$5;

function _applyDecoratedDescriptor$4(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function targetCheck(target) {
  if (target === 'video') target = 'videoElement';
  if (!isElement(this[target])) throw new TypeError('Your target ' + target + ' is not a legal HTMLElement');

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return [target].concat(args);
}
function attrOperationCheck(target, attr, val) {
  if (!isString(attr)) throw new TypeError("to handle dom's attribute or style, your attr parameter must be string");
  if (!isString(target)) throw new TypeError("to handle dom's attribute or style, your target parameter must be string");
  return [target, attr, val];
}
/**
 * <pre>
 * Dom work for Dispatcher.
 * It take charge of dom management of Dispatcher.
 * </pre>
 */
var Dom = (_dec$5 = waituntil('__dispatcher.videoConfigReady'), _dec2$3 = before(attrOperationCheck, targetCheck), _dec3$2 = before(attrOperationCheck, targetCheck), _dec4$2 = before(attrOperationCheck, targetCheck), _dec5$2 = before(attrOperationCheck, targetCheck), _dec6$1 = before(targetCheck), (_class$5 = function () {
  /**
   * to mark is the mouse in the video area
   * @type {boolean}
   * @member __mouseInVideo
   */

  /**
   * Array to store all video dom event handler
   * @type {Array}
   * @member wrapperDomEventHandlerList
   */

  /**
   * Array to store all video dom event handler
   * @type {Array}
   * @member videoDomEventHandlerList
   */

  /**
   * the html to restore when we are destroyed
   * @type {HTMLString}
   */
  function Dom(wrapper, dispatcher) {
    var _this = this;

    _classCallCheck(this, Dom);

    this.plugins = {};
    this.originHTML = '';
    this.videoEventHandlerList = [];
    this.videoDomEventHandlerList = [];
    this.containerDomEventHandlerList = [];
    this.wrapperDomEventHandlerList = [];
    this.__domEventHandlerList = {};
    this.__mouseInVideo = false;
    this.__videoExtendedNodes = [];
    this.isFullScreen = false;
    this.fullScreenElement = undefined;

    this.__dispatcher = dispatcher;
    if (!isElement(wrapper) && !isString(wrapper)) throw new TypeError('Illegal wrapper');
    var $wrapper = $(wrapper);
    if ($wrapper.length === 0) {
      throw new TypeError('Can not get dom node accroding wrapper. Please check your wrapper');
    }
    /**
     * the referrence of the dom wrapper of whole Chimee
     * @type {Element}
     */
    this.wrapper = $wrapper[0];
    this.originHTML = this.wrapper.innerHTML;
    // if we find video element inside wrapper
    // we use it
    // or we create a video element by ourself.
    var videoElement = $wrapper.find('video')[0];
    if (!videoElement) {
      videoElement = document.createElement('video');
    }
    /**
     * referrence of video's dom element
     * @type {Element}
     */
    this.installVideo(videoElement);
    domEvents.forEach(function (key) {
      var cfn = function cfn() {
        var _dispatcher$bus;

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return (_dispatcher$bus = _this.__dispatcher.bus).triggerSync.apply(_dispatcher$bus, ['c_' + key].concat(args));
      };
      _this.containerDomEventHandlerList.push(cfn);
      addEvent(_this.container, key, cfn);
      var wfn = function wfn() {
        var _dispatcher$bus2;

        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return (_dispatcher$bus2 = _this.__dispatcher.bus).triggerSync.apply(_dispatcher$bus2, ['w_' + key].concat(args));
      };
      _this.wrapperDomEventHandlerList.push(wfn);
      addEvent(_this.wrapper, key, wfn);
    });
    this._bindFullScreen();
  }
  /**
   * Object to store different plugin's dom event handlers
   * @type {Object}
   * @member __domEventHandlerList
   */

  /**
   * Array to store all container dom event handler
   * @type {Array}
   * @member containerDomEventHandlerList
   */

  /**
   * Array to store all video event handler
   * @type {Array}
   * @member videoEventHandlerList
   */

  /**
   * @param  {string|Element} wrapper the wrapper of Chimee. All dom including videoElement will build in it.
   * @return {Dom}
   */
  /**
   * all plugin's dom element set
   * @type {Object}
   * @member plugins
   */


  _createClass(Dom, [{
    key: 'installVideo',
    value: function installVideo(videoElement) {
      var _this2 = this;

      this.__videoExtendedNodes.push(videoElement);
      setAttr(videoElement, 'tabindex', -1);
      this._autoFocusToVideo(videoElement);
      if (!isElement(this.container)) {
        // create container
        if (videoElement.parentElement && isElement(videoElement.parentElement) && videoElement.parentElement !== this.wrapper) {
          this.container = videoElement.parentElement;
        } else {
          this.container = document.createElement('container');
          $(this.container).append(videoElement);
        }
      } else {
        var container = this.container;
        if (container.childNodes.length === 0) {
          container.appendChild(videoElement);
        } else {
          container.insertBefore(videoElement, container.childNodes[0]);
        }
      }
      // check container.position
      if (this.container.parentElement !== this.wrapper) {
        $(this.wrapper).append(this.container);
      }
      videoEvents.forEach(function (key) {
        var fn = function fn() {
          var _dispatcher$bus3;

          for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          return (_dispatcher$bus3 = _this2.__dispatcher.bus).trigger.apply(_dispatcher$bus3, [key].concat(args));
        };
        _this2.videoEventHandlerList.push(fn);
        addEvent(videoElement, key, fn);
      });
      domEvents.forEach(function (key) {
        var fn = _this2._getEventHandler(key, { penetrate: true });
        _this2.videoDomEventHandlerList.push(fn);
        addEvent(videoElement, key, fn);
      });
      this.videoElement = videoElement;
      return videoElement;
    }
  }, {
    key: 'removeVideo',
    value: function removeVideo() {
      var _this3 = this;

      var videoElement = this.videoElement;
      this._autoFocusToVideo(this.videoElement, false);
      videoEvents.forEach(function (key, index) {
        removeEvent(_this3.videoElement, key, _this3.videoEventHandlerList[index]);
      });
      domEvents.forEach(function (key, index) {
        removeEvent(_this3.videoElement, key, _this3.videoDomEventHandlerList[index]);
      });
      $(videoElement).remove();
      delete this.videoElement;
      return videoElement;
    }
    /**
     * <pre>
     * each plugin has its own dom node, this function will create one or them.
     * we support multiple kind of el
     * 1. Element, we will append this dom node on wrapper straight
     * 2. HTMLString, we will create dom based on this HTMLString and append it on wrapper
     * 3. string, we will transfer this string into hypen string, then we create a custom elment called by this and bind it on wrapper
     * 4. nothing, we will create a div and bind it on the wrapper
     * </pre>
     * @param  {string} id plugin's id
     * @param  {string|Element} el(optional) the el can be custom dom element or html string to insert
     * @param  {boolean} inner if it's true, we will put it into conatiner, else we would put it into outer
     * @return {Node}
     */

  }, {
    key: 'insertPlugin',
    value: function insertPlugin(id, el) {
      var _this4 = this;

      var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!isString(id)) throw new TypeError('insertPlugin id parameter must be string');
      if (isElement(this.plugins[id])) {
        Log.warn('Dispatcher.dom', 'Plugin ' + id + ' have already had a dom node. Now it will be replaced');
        this.removePlugin(id);
      }
      if (isString(el)) {
        if (isHTMLString(el)) {
          var outer = document.createElement('div');
          outer.innerHTML = el;
          el = outer.children[0];
        } else {
          el = document.createElement(hypenate(el));
        }
      } else if (isObject$1(el)) {
        option = el;
      }
      var _option = option,
          inner = _option.inner,
          penetrate = _option.penetrate,
          autoFocus = _option.autoFocus;
      var _option2 = option,
          className = _option2.className;

      var node = el && isElement(el) ? el : document.createElement('div');
      if (isArray$1(className)) {
        className = className.join(' ');
      }
      if (isString(className)) {
        addClassName(node, className);
      }
      this.plugins[id] = node;
      var outerElement = inner ? this.container : this.wrapper;
      var originElement = inner ? this.videoElement : this.container;
      if (isBoolean(autoFocus) ? autoFocus : inner) this._autoFocusToVideo(node);
      // auto forward the event if this plugin can be penetrate
      if (penetrate) {
        this.__domEventHandlerList[id] = this.__domEventHandlerList[id] || [];
        domEvents.forEach(function (key) {
          var fn = _this4._getEventHandler(key, { penetrate: penetrate });
          addEvent(node, key, fn);
          _this4.__domEventHandlerList[id].push(fn);
        });
        this.__videoExtendedNodes.push(node);
      }
      if (outerElement.lastChild === originElement) {
        outerElement.appendChild(node);
        return node;
      }
      outerElement.insertBefore(node, originElement.nextSibling);
      return node;
    }
    /**
     * remove plugin's dom
     * @param  {string} id
     */

  }, {
    key: 'removePlugin',
    value: function removePlugin(id) {
      var _this5 = this;

      if (!isString(id)) return;
      var dom = this.plugins[id];
      if (isElement(dom)) {
        dom.parentNode && dom.parentNode.removeChild(dom);
        this._autoFocusToVideo(dom, true);
      }
      if (!isEmpty(this.__domEventHandlerList[id])) {
        domEvents.forEach(function (key, index) {
          removeEvent(_this5.plugins[id], key, _this5.__domEventHandlerList[id][index]);
        });
        delete this.__domEventHandlerList[id];
      }
      delete this.plugins[id];
    }
    /**
     * Set zIndex for a plugins list
     * @param {Array<string>} plugins
     */

  }, {
    key: 'setPluginsZIndex',
    value: function setPluginsZIndex(plugins) {
      var _this6 = this;

      // $FlowFixMe: there are videoElment and container here
      plugins.forEach(function (key, index) {
        return setStyle(key.match(/^(videoElement|container)$/) ? _this6[key] : _this6.plugins[key], 'z-index', ++index);
      });
    }
    /**
     * set attribute on our dom
     * @param {string} attr attribute's name
     * @param {anything} val attribute's value
     * @param {string} target the HTMLElemnt string name, only support video/wrapper/container now
     */

  }, {
    key: 'setAttr',
    value: function setAttr$$1(target, attr, val) {
      // $FlowFixMe: flow do not support computed property/element on class, which is silly here.
      setAttr(this[target], attr, val);
    }
  }, {
    key: 'getAttr',
    value: function getAttr$$1(target, attr) {
      // $FlowFixMe: flow do not support computed property/element on class, which is silly here.
      return getAttr(this[target], attr);
    }
  }, {
    key: 'setStyle',
    value: function setStyle$$1(target, attr, val) {
      // $FlowFixMe: flow do not support computed property/element on class, which is silly here.
      setStyle(this[target], attr, val);
    }
  }, {
    key: 'getStyle',
    value: function getStyle$$1(target, attr) {
      // $FlowFixMe: flow do not support computed property/element on class, which is silly here.
      return getStyle(this[target], attr);
    }
  }, {
    key: 'requestFullScreen',
    value: function requestFullScreen(target) {
      var methods = ['requestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen', 'msRequestFullscreen'];
      for (var i = 0, len = methods.length; i < len; i++) {
        // $FlowFixMe: flow do not support computed property/element on document, which is silly here.
        if (isFunction(this[target][methods[i]])) {
          // $FlowFixMe: flow do not support computed property/element on document, which is silly here.
          this[target][methods[i]]();
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'exitFullScreen',
    value: function exitFullScreen() {
      var methods = ['exitFullscreen', 'msExitFullscreen', 'mozCancelFullScreen', 'webkitExitFullscreen'];
      for (var i = 0, len = methods.length; i < len; i++) {
        // $FlowFixMe: flow do not support computed property/element on document, which is silly here.
        if (isFunction(document[methods[i]])) {
          // $FlowFixMe: flow do not support computed property/element on document, which is silly here.
          document[methods[i]]();
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'fullScreen',
    value: function fullScreen() {
      var request = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'container';

      for (var _len5 = arguments.length, args = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        args[_key5 - 2] = arguments[_key5];
      }

      return request ? this.requestFullScreen.apply(this, [target].concat(_toConsumableArray(args))) : this.exitFullScreen.apply(this, _toConsumableArray(args));
    }
  }, {
    key: 'focus',
    value: function focus() {
      this.videoElement.focus();
    }
    /**
     * function called when we distory
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      var _this7 = this;

      this.removeVideo();
      domEvents.forEach(function (key, index) {
        removeEvent(_this7.container, key, _this7.containerDomEventHandlerList[index]);
        removeEvent(_this7.wrapper, key, _this7.wrapperDomEventHandlerList[index]);
      });
      this._bindFullScreen(true);
      this.wrapper.innerHTML = this.originHTML;
      delete this.wrapper;
      delete this.plugins;
    }
  }, {
    key: '_autoFocusToVideo',
    value: function _autoFocusToVideo(element) {
      var remove = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      (remove ? removeEvent : addEvent)(element, 'mouseup', this._focusToVideo, false, true);
      (remove ? removeEvent : addEvent)(element, 'touchend', this._focusToVideo, false, true);
    }
  }, {
    key: '_focusToVideo',
    value: function _focusToVideo(evt) {
      var x = window.scrollX;
      var y = window.scrollY;
      isFunction(this.videoElement.focus) && this.videoElement.focus();
      window.scrollTo(x, y);
    }
  }, {
    key: '_fullScreenMonitor',
    value: function _fullScreenMonitor() {
      var element = ['fullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'msFullscreenElement'].reduce(function (element, key) {
        // $FlowFixMe: support computed element on document
        return element || document[key];
      }, null);
      if (!element || !isPosterityNode(this.wrapper, element) && element !== this.wrapper) {
        this.isFullScreen = false;
        this.fullScreenElement = undefined;
        return;
      }
      this.isFullScreen = true;
      this.fullScreenElement = this.wrapper === element ? 'wrapper' : this.container === element ? 'container' : this.videoElement === element ? 'video' : element;
    }
  }, {
    key: '_bindFullScreen',
    value: function _bindFullScreen(remove) {
      var _this8 = this;

      if (!remove) this._fullScreenMonitor();
      ['webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange', 'fullscreenchange'].forEach(function (key) {
        // $FlowFixMe: support computed element on document
        document[(remove ? 'remove' : 'add') + 'EventListener'](key, _this8._fullScreenMonitor);
      });
    }
    /**
     * get the event handler for dom to bind
     */

  }, {
    key: '_getEventHandler',
    value: function _getEventHandler(key, _ref) {
      var _this9 = this;

      var penetrate = _ref.penetrate;

      if (!penetrate || ['mouseenter', 'mouseleave'].indexOf(key) < 0) {
        return function () {
          var _dispatcher$bus4;

          for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            args[_key6] = arguments[_key6];
          }

          (_dispatcher$bus4 = _this9.__dispatcher.bus).triggerSync.apply(_dispatcher$bus4, [key].concat(args));
        };
      }
      var insideVideo = function insideVideo(node) {
        return _this9.__videoExtendedNodes.indexOf(node) > -1 || _this9.__videoExtendedNodes.reduce(function (flag, video) {
          if (flag) return flag;
          return isPosterityNode(video, node);
        }, false);
      };
      return function () {
        for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          args[_key7] = arguments[_key7];
        }

        var _args$ = args[0],
            toElement = _args$.toElement,
            currentTarget = _args$.currentTarget,
            relatedTarget = _args$.relatedTarget,
            type = _args$.type;

        var to = toElement || relatedTarget;
        if (_this9.__mouseInVideo && type === 'mouseleave' && !insideVideo(to)) {
          var _dispatcher$bus5;

          _this9.__mouseInVideo = false;
          return (_dispatcher$bus5 = _this9.__dispatcher.bus).triggerSync.apply(_dispatcher$bus5, ['mouseleave'].concat(args));
        }
        if (!_this9.__mouseInVideo && type === 'mouseenter' && insideVideo(currentTarget)) {
          var _dispatcher$bus6;

          _this9.__mouseInVideo = true;
          return (_dispatcher$bus6 = _this9.__dispatcher.bus).triggerSync.apply(_dispatcher$bus6, ['mouseenter'].concat(args));
        }
      };
    }
  }]);

  return Dom;
}(), (_applyDecoratedDescriptor$4(_class$5.prototype, 'setAttr', [_dec$5, _dec2$3], _Object$getOwnPropertyDescriptor(_class$5.prototype, 'setAttr'), _class$5.prototype), _applyDecoratedDescriptor$4(_class$5.prototype, 'getAttr', [_dec3$2], _Object$getOwnPropertyDescriptor(_class$5.prototype, 'getAttr'), _class$5.prototype), _applyDecoratedDescriptor$4(_class$5.prototype, 'setStyle', [_dec4$2], _Object$getOwnPropertyDescriptor(_class$5.prototype, 'setStyle'), _class$5.prototype), _applyDecoratedDescriptor$4(_class$5.prototype, 'getStyle', [_dec5$2], _Object$getOwnPropertyDescriptor(_class$5.prototype, 'getStyle'), _class$5.prototype), _applyDecoratedDescriptor$4(_class$5.prototype, 'requestFullScreen', [_dec6$1], _Object$getOwnPropertyDescriptor(_class$5.prototype, 'requestFullScreen'), _class$5.prototype), _applyDecoratedDescriptor$4(_class$5.prototype, '_focusToVideo', [autobind], _Object$getOwnPropertyDescriptor(_class$5.prototype, '_focusToVideo'), _class$5.prototype), _applyDecoratedDescriptor$4(_class$5.prototype, '_fullScreenMonitor', [autobind], _Object$getOwnPropertyDescriptor(_class$5.prototype, '_fullScreenMonitor'), _class$5.prototype)), _class$5));

var _dec$1;
var _dec2;
var _dec3;
var _dec4;
var _dec5;
var _class$1;

function _applyDecoratedDescriptor$1(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var pluginConfigSet = {};
function convertNameIntoId(name) {
  if (!isString(name)) throw new Error("Plugin's name must be a string");
  return camelize(name);
}
function checkPluginConfig(config) {
  if (isFunction(config)) {
    if (!(config.prototype instanceof Plugin)) {
      throw new TypeError('If you pass a function as plugin config, this class must extends from Chimee.plugin');
    }
    return;
  }
  if (!isObject$1(config) || isEmpty(config)) throw new TypeError("plugin's config must be an Object");
  var name = config.name;

  if (!isString(name) || name.length < 1) throw new TypeError('plugin must have a legal name');
}
/**
 * <pre>
 * Dispatcher is the hub of plugins, user, and video kernel.
 * It take charge of plugins install, use and remove
 * It also offer a bridge to let user handle video kernel.
 * </pre>
 */
var Dispatcher = (_dec$1 = before(convertNameIntoId), _dec2 = before(checkPluginConfig), _dec3 = before(convertNameIntoId), _dec4 = before(convertNameIntoId), _dec5 = before(convertNameIntoId), (_class$1 = function () {
  /**
   * @param  {UserConfig} config UserConfig for whole Chimee player
   * @param  {Chimee} vm referrence of outer class
   * @return {Dispatcher}
   */

  /**
   * the z-index map of the dom, it contain some important infomation
   * @type {Object}
   * @member zIndexMap
   */

  /**
   * plugin's order
   * @type {Array<string>}
   * @member order
   */
  function Dispatcher(config, vm) {
    var _this = this;

    _classCallCheck(this, Dispatcher);

    this.plugins = {};
    this.order = [];
    this.readySync = false;
    this.zIndexMap = {
      inner: [],
      outer: []
    };
    this.changeWatchable = true;

    if (!isObject$1(config)) throw new TypeError('UserConfig must be an Object');
    /**
     * dom Manager
     * @type {Dom}
     */
    this.dom = new Dom(config.wrapper, this);
    /**
     * eventBus
     * @type {Bus}
     */
    this.bus = new Bus(this);
    /**
     * Chimee's referrence
     * @type {[type]}
     */
    this.vm = vm;
    /**
     * tell user have Chimee installed finished
     * @type {Promises}
     */
    this.videoConfigReady = false;
    // create the videoconfig
    this.videoConfig = new VideoConfig(this, config);
    this._initUserPlugin(config.plugin);
    this.order.forEach(function (key) {
      return _this.plugins[key].__init(_this.videoConfig);
    });
    this.videoConfig.lockKernelProperty();
    this.videoConfigReady = true;
    this.videoConfig.init();
    /**
     * video kernel
     * @type {Kernel}
     */
    this.kernel = new Kernel(this.dom.videoElement, this.videoConfig);
    // trigger auto load event
    var asyncInitedTasks = [];
    this.order.forEach(function (key) {
      var ready = _this.plugins[key].__inited();
      if (isPromise(ready)) {
        asyncInitedTasks.push(ready);
      }
    });
    this.readySync = asyncInitedTasks.length === 0;
    // tell them we have inited the whold player
    this.ready = this.readySync ? _Promise.resolve() : _Promise.all(asyncInitedTasks).then(function () {
      _this.readySync = true;
      _this.bus.trigger('ready');
      _this._autoloadVideoSrcAtFirst();
    });
    if (this.readySync) this._autoloadVideoSrcAtFirst();
  }
  /**
   * use a plugin, which means we will new a plugin instance and include int this Chimee instance
   * @param  {Object|string} option you can just set a plugin name or plugin config
   * @return {Promise}
   */

  /**
   * the synchronous ready flag
   * @type {boolean}
   * @member readySync
   */

  /**
   * all plugins instance set
   * @type {Object}
   * @member plugins
   */


  _createClass(Dispatcher, [{
    key: 'use',
    value: function use(option) {
      if (isString(option)) option = { name: option, alias: undefined };
      if (!isObject$1(option) || isObject$1(option) && !isString(option.name)) {
        throw new TypeError('pluginConfig do not match requirement');
      }
      if (!isString(option.alias)) option.alias = undefined;
      var _option = option,
          name = _option.name,
          alias$$1 = _option.alias;

      option.name = alias$$1 || name;
      delete option.alias;
      var key = camelize(name);
      var id = camelize(alias$$1 || name);
      var pluginOption = option;
      var pluginConfig = Dispatcher.getPluginConfig(key);
      if (isEmpty(pluginConfig)) throw new TypeError('You have not installed plugin ' + key);
      if (isObject$1(pluginConfig)) {
        pluginConfig.id = id;
      }
      var plugin = isFunction(pluginConfig) ? new pluginConfig({ id: id }, this, pluginOption) // eslint-disable-line 
      : new Plugin(pluginConfig, this, pluginOption);
      this.plugins[id] = plugin;
      _Object$defineProperty(this.vm, id, {
        value: plugin,
        configurable: true,
        enumerable: false,
        writable: false
      });
      this.order.push(id);
      this._sortZIndex();
      if (this.videoConfigReady) plugin.__inited();
      return plugin.ready;
    }
    /**
     * unuse an plugin, we will destroy the plugin instance and exlude it
     * @param  {string} name plugin's name
     */

  }, {
    key: 'unuse',
    value: function unuse(id) {
      var plugin = this.plugins[id];
      if (!isObject$1(plugin) || !isFunction(plugin.$destroy)) {
        delete this.plugins[id];
        return;
      }
      plugin.$destroy();
      var orderIndex = this.order.indexOf(id);
      if (orderIndex > -1) {
        this.order.splice(orderIndex, 1);
      }
      delete this.plugins[id];
      delete this.vm[id];
    }
  }, {
    key: 'throwError',
    value: function throwError(error) {
      this.vm.__throwError(error);
    }
  }, {
    key: 'silentLoad',
    value: function silentLoad(src) {
      var _this2 = this;

      var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _option$duration = option.duration,
          duration = _option$duration === undefined ? 3 : _option$duration,
          _option$bias = option.bias,
          bias = _option$bias === undefined ? 0 : _option$bias,
          _option$repeatTimes = option.repeatTimes,
          repeatTimes = _option$repeatTimes === undefined ? 0 : _option$repeatTimes,
          _option$increment = option.increment,
          increment = _option$increment === undefined ? 0 : _option$increment,
          _option$isLive = option.isLive,
          isLive = _option$isLive === undefined ? this.videoConfig.isLive : _option$isLive,
          _option$box = option.box,
          box = _option$box === undefined ? this.videoConfig.box : _option$box,
          _option$preset = option.preset,
          preset = _option$preset === undefined ? this.videoConfig.preset : _option$preset;
      // form the base config for kernel
      // it should be the same as the config now

      var config = { isLive: isLive, box: box, src: src, preset: preset };
      // build tasks accroding repeat times
      var tasks = new Array(repeatTimes + 1).fill(1).map(function (value, index) {
        return function () {
          return new _Promise(function (resolve, reject) {
            // if abort, give up and reject
            if (option.abort) reject({ error: true, message: 'user abort the mission' });
            var video = document.createElement('video');
            var idealTime = _this2.kernel.currentTime + duration + increment * index;
            video.muted = true;
            var newVideoReady = false;
            // bind time update on old video
            // when we bump into the switch point and ready
            // we switch
            var oldVideoTimeupdate = function oldVideoTimeupdate(evt) {
              var currentTime = _this2.kernel.currentTime;
              if (bias <= 0 && currentTime >= idealTime || bias > 0 && (Math.abs(idealTime - currentTime) <= bias && newVideoReady || currentTime - idealTime > bias)) {
                removeEvent(_this2.dom.videoElement, 'timeupdate', oldVideoTimeupdate);
                removeEvent(video, 'error', videoError, true);
                if (!newVideoReady) {
                  removeEvent(video, 'canplay', videoCanplay, true);
                  removeEvent(video, 'loadedmetadata', videoLoadedmetadata, true);
                  kernel.destroy();
                  return resolve();
                }
                return reject({
                  error: false,
                  video: video,
                  kernel: kernel
                });
              }
            };
            var videoCanplay = function videoCanplay(evt) {
              newVideoReady = true;
              // you can set it immediately run by yourself
              if (option.immediate) {
                removeEvent(_this2.dom.videoElement, 'timeupdate', oldVideoTimeupdate);
                removeEvent(video, 'error', videoError, true);
                return reject({
                  error: false,
                  video: video,
                  kernel: kernel
                });
              }
            };
            var videoLoadedmetadata = function videoLoadedmetadata(evt) {
              kernel.seek(idealTime);
            };
            var videoError = function videoError(evt) {
              removeEvent(video, 'canplay', videoCanplay, true);
              removeEvent(video, 'loadedmetadata', videoLoadedmetadata, true);
              removeEvent(_this2.dom.videoElement, 'timeupdate', oldVideoTimeupdate);
              var error = !isEmpty(video.error) ? new Error(video.error.message) : new Error('unknow video error');
              Log.error("chimee's silentload", error.message);
              kernel.destroy();
              return index === repeatTimes ? reject(error) : resolve(error);
            };
            addEvent(video, 'canplay', videoCanplay, true);
            addEvent(video, 'loadedmetadata', videoLoadedmetadata, true);
            addEvent(video, 'error', videoError, true);
            addEvent(_this2.dom.videoElement, 'timeupdate', oldVideoTimeupdate);
            var kernel = new Kernel(video, config);
            kernel.load();
          });
        };
      });
      return runRejectableQueue(tasks).then(function () {
        var message = 'The silentLoad for ' + src + ' timed out. Please set a longer duration or check your network';
        Log.warn("chimee's silentLoad", message);
        return _Promise.reject(new Error(message));
      }).catch(function (data) {
        if (isError(data)) {
          return _Promise.reject(data);
        }
        if (data.error) {
          Log.warn("chimee's silentLoad", data.message);
          return _Promise.reject(new Error(data.message));
        }
        var video = data.video,
            kernel = data.kernel;

        if (option.abort) {
          kernel.destroy();
          return _Promise.reject(new Error('user abort the mission'));
        }
        var paused = _this2.dom.videoElement.paused;
        _this2.switchKernel({ video: video, kernel: kernel, config: config });
        if (!paused) _this2.dom.videoElement.play();
        return _Promise.resolve();
      });
    }
  }, {
    key: 'load',
    value: function load(src) {
      var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!isEmpty(option)) {
        var videoConfig = this.videoConfig;

        var _option$isLive2 = option.isLive,
            _isLive = _option$isLive2 === undefined ? videoConfig.isLive : _option$isLive2,
            _option$box2 = option.box,
            _box = _option$box2 === undefined ? videoConfig.box : _option$box2,
            _option$preset2 = option.preset,
            _preset = _option$preset2 === undefined ? videoConfig.preset : _option$preset2;

        var video = document.createElement('video');
        var config = { isLive: _isLive, box: _box, preset: _preset, src: src };
        var _kernel = new Kernel(video, config);
        this.switchKernel({ video: video, kernel: _kernel, config: config });
      }
      this.kernel.load(src);
    }
  }, {
    key: 'switchKernel',
    value: function switchKernel(_ref) {
      var _this3 = this;

      var video = _ref.video,
          kernel = _ref.kernel,
          config = _ref.config;

      var oldKernel = this.kernel;
      var originVideoConfig = deepClone(this.videoConfig);
      this.dom.removeVideo();
      this.dom.installVideo(video);
      // as we will reset the currentVideoConfig on the new video
      // it will trigger the watch function as they maybe differnet
      // so we need to stop them
      this.videoConfig.changeWatchable = false;
      this.videoConfig.autoload = false;
      this.videoConfig.src = config.src;
      this.videoConfig._realDomAttr.forEach(function (key) {
        // $FlowFixMe: support computed key here
        if (key !== 'src') _this3.videoConfig[key] = originVideoConfig[key];
      });
      this.videoConfig.changeWatchable = true;
      // bind the new config in new kernel to the videoConfig
      applyDecorators(config, {
        src: accessor({
          get: function get$$1(value) {
            return _this3.videoConfig.src;
          },
          set: function set(value) {
            _this3.videoConfig.src = value;
            return value;
          }
        })
      }, { self: true });
      // the kernel's inner config would not be change according what we do
      // so we have to load that
      // applyDecorators(kernel.__proto__, {
      //   load: before(src => {
      //     return [src || this.videoConfig.src];
      //   })
      // }, {self: true});
      this.kernel = kernel;
      oldKernel.destroy();
    }
    /**
     * destroy function called when dispatcher destroyed
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      for (var key in this.plugins) {
        this.unuse(key);
      }
      this.bus.destroy();
      delete this.bus;
      this.dom.destroy();
      delete this.dom;
      this.kernel.destroy();
      delete this.kernel;
      delete this.vm;
      delete this.plugins;
      delete this.order;
    }
    /**
     * use a set of plugin
     * @param  {Array<UserPluginConfig>}  configs  a set of plugin config
     * @return {Array<Promise>}   a set of Promise indicate the plugin install stage
     */

  }, {
    key: '_initUserPlugin',
    value: function _initUserPlugin() {
      var _this4 = this;

      var configs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (!isArray$1(configs)) {
        Log.warn('Dispatcher', 'UserConfig.plugin can only by an Array');
        configs = [];
      }
      return configs.map(function (config) {
        return _this4.use(config);
      });
    }
    /**
     * sort zIndex of plugins to make plugin display in order
     */

  }, {
    key: '_sortZIndex',
    value: function _sortZIndex() {
      var _this5 = this;

      var _order$reduce = this.order.reduce(function (levelSet, key) {
        var plugin = _this5.plugins[key];
        if (isEmpty(plugin)) return levelSet;
        var set = levelSet[plugin.$inner ? 'inner' : 'outer'];
        var level = plugin.$level;
        set[level] = set[level] || [];
        set[level].push(key);
        return levelSet;
      }, { inner: {}, outer: {} }),
          inner = _order$reduce.inner,
          outer = _order$reduce.outer;

      inner[0] = inner[0] || [];
      inner[0].unshift('videoElement');
      outer[0] = outer[0] || [];
      outer[0].unshift('container');
      var innerOrderArr = transObjectAttrIntoArray(inner);
      var outerOrderArr = transObjectAttrIntoArray(outer);
      this.dom.setPluginsZIndex(innerOrderArr);
      this.dom.setPluginsZIndex(outerOrderArr);
      this.zIndexMap.inner = innerOrderArr;
      this.zIndexMap.outer = outerOrderArr;
    }
    /**
     * get the top element's level
     * @param {boolean} inner get the inner array or the outer array
     */

  }, {
    key: '_getTopLevel',
    value: function _getTopLevel(inner) {
      var arr = this.zIndexMap[inner ? 'inner' : 'outer'];
      var plugin = this.plugins[arr[arr.length - 1]];
      return isEmpty(plugin) ? 0 : plugin.$level;
    }
  }, {
    key: '_autoloadVideoSrcAtFirst',
    value: function _autoloadVideoSrcAtFirst() {
      if (this.videoConfig.autoload) this.bus.emit('load', this.videoConfig.src);
    }
    /**
     * static method to install plugin
     * we will store the plugin config
     * @type {string} plugin's id
     */

  }], [{
    key: 'install',
    value: function install(config) {
      var name = config.name;

      var id = camelize(name);
      if (!isEmpty(pluginConfigSet[id])) {
        Log.warn('Dispatcher', 'You have installed ' + name + ' again. And the older one will be replaced');
      }
      var pluginConfig = isFunction(config) ? config : deepAssign({ id: id }, config);
      pluginConfigSet[id] = pluginConfig;
      return id;
    }
  }, {
    key: 'hasInstalled',
    value: function hasInstalled(id) {
      return !isEmpty(pluginConfigSet[id]);
    }
  }, {
    key: 'uninstall',
    value: function uninstall(id) {
      delete pluginConfigSet[id];
    }
    /**
     * get Plugin config based on plugin's id
     * @type {[type]}
     */

  }, {
    key: 'getPluginConfig',
    value: function getPluginConfig(id) {
      return pluginConfigSet[id];
    }
  }]);

  return Dispatcher;
}(), (_applyDecoratedDescriptor$1(_class$1.prototype, 'unuse', [_dec$1], _Object$getOwnPropertyDescriptor(_class$1.prototype, 'unuse'), _class$1.prototype), _applyDecoratedDescriptor$1(_class$1, 'install', [_dec2], _Object$getOwnPropertyDescriptor(_class$1, 'install'), _class$1), _applyDecoratedDescriptor$1(_class$1, 'hasInstalled', [_dec3], _Object$getOwnPropertyDescriptor(_class$1, 'hasInstalled'), _class$1), _applyDecoratedDescriptor$1(_class$1, 'uninstall', [_dec4], _Object$getOwnPropertyDescriptor(_class$1, 'uninstall'), _class$1), _applyDecoratedDescriptor$1(_class$1, 'getPluginConfig', [_dec5], _Object$getOwnPropertyDescriptor(_class$1, 'getPluginConfig'), _class$1)), _class$1));

var _class$6;
var _descriptor$2;

function _initDefineProp$2(target, property, descriptor, context) {
  if (!descriptor) return;

  _Object$defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor$5(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var GlobalConfig = (_class$6 = function () {
  _createClass(GlobalConfig, [{
    key: 'silent',
    get: function get$$1() {
      return this._silent;
    },
    set: function set(val) {
      var _this = this;

      val = !!val;
      this._silent = val;
      _Object$keys(this.log).forEach(function (key) {
        _this.log[key] = !val;
      });
    }
  }]);

  function GlobalConfig() {
    _classCallCheck(this, GlobalConfig);

    this.log = {
      error: true,
      info: true,
      warn: true,
      debug: true,
      verbose: true
    };

    _initDefineProp$2(this, '_silent', _descriptor$2, this);

    this.errorHandler = undefined;

    var props = _Object$keys(this.log).reduce(function (props, key) {
      props[key] = accessor({
        get: function get$$1() {
          // $FlowFixMe: we have check the keys
          return Log['ENABLE_' + key.toUpperCase()];
        },
        set: function set(val) {
          // $FlowFixMe: we have check the keys
          Log['ENABLE_' + key.toUpperCase()] = val;
          if (val === true) this.silent = false;
          return val;
        }
      });
      return props;
    }, {});
    applyDecorators(this.log, props, { self: true });
  }

  return GlobalConfig;
}(), (_descriptor$2 = _applyDecoratedDescriptor$5(_class$6.prototype, '_silent', [nonenumerable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
})), _class$6);

var _dec;
var _class;
var _class2;
var _descriptor;
var _descriptor2;
var _descriptor3;
var _init;
var _init2;
var _init3;
var _init4;
var _init5;
var _init6;
var _class3;
var _temp;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;

  _Object$defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var Chimee = (_dec = autobindClass(), _dec(_class = (_class2 = (_temp = _class3 = function (_VideoWrapper) {
  _inherits(Chimee, _VideoWrapper);

  function Chimee(config) {
    _classCallCheck(this, Chimee);

    var _this = _possibleConstructorReturn(this, (Chimee.__proto__ || _Object$getPrototypeOf(Chimee)).call(this));

    _this.destroyed = false;

    _initDefineProp(_this, '__id', _descriptor, _this);

    _initDefineProp(_this, 'version', _descriptor2, _this);

    _initDefineProp(_this, 'config', _descriptor3, _this);

    if (isString(config) || isElement(config)) {
      config = {
        wrapper: config,
        controls: true
      };
    } else if (isObject$1(config)) {
      if (!config.wrapper) throw new Error('You must pass in an legal object');
    } else {
      throw new Error('You must pass in an Object containing wrapper or string or element to new a Chimee');
    }
    _this.__dispatcher = new Dispatcher(config, _this);
    _this.__dispatcher.kernel.on('error', _this.__throwError);
    _this.ready = _this.__dispatcher.ready;
    _this.readySync = _this.__dispatcher.readySync;
    _this.__wrapAsVideo(_this.__dispatcher.videoConfig);
    return _this;
  }

  _createClass(Chimee, [{
    key: 'destroy',
    value: function destroy() {
      _get(Chimee.prototype.__proto__ || _Object$getPrototypeOf(Chimee.prototype), '__destroy', this).call(this);
      this.__dispatcher.destroy();
      this.destroyed = true;
    }
  }, {
    key: 'use',
    value: function use(option) {
      this.__dispatcher.use(option);
    }
  }, {
    key: 'unuse',
    value: function unuse(name) {
      this.__dispatcher.unuse(name);
    }
  }, {
    key: '__throwError',
    value: function __throwError(error) {
      if (isString(error)) error = new Error(error);
      var errorHandler = this.config.errorHandler || Chimee.config.errorHandler;
      if (isFunction(errorHandler)) return errorHandler(error);
      if (Chimee.config.silent) return;
      throw error;
    }
  }]);

  return Chimee;
}(VideoWrapper), _class3.plugin = Plugin, _class3.config = new GlobalConfig(), _class3.install = Dispatcher.install, _class3.uninstall = Dispatcher.uninstall, _class3.hasInstalled = Dispatcher.hasInstalled, _class3.getPluginConfig = Dispatcher.getPluginConfig, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, '__id', [frozen], {
  enumerable: true,
  initializer: function initializer() {
    return '_vm';
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'version', [frozen], {
  enumerable: true,
  initializer: function initializer() {
    return '0.2.2';
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'config', [frozen], {
  enumerable: true,
  initializer: function initializer() {
    return {
      errorHandler: undefined
    };
  }
}), _applyDecoratedDescriptor(_class2, 'plugin', [frozen], (_init = _Object$getOwnPropertyDescriptor(_class2, 'plugin'), _init = _init ? _init.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'config', [frozen], (_init2 = _Object$getOwnPropertyDescriptor(_class2, 'config'), _init2 = _init2 ? _init2.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init2;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'install', [frozen], (_init3 = _Object$getOwnPropertyDescriptor(_class2, 'install'), _init3 = _init3 ? _init3.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init3;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'uninstall', [frozen], (_init4 = _Object$getOwnPropertyDescriptor(_class2, 'uninstall'), _init4 = _init4 ? _init4.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init4;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'hasInstalled', [frozen], (_init5 = _Object$getOwnPropertyDescriptor(_class2, 'hasInstalled'), _init5 = _init5 ? _init5.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init5;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'getPluginConfig', [frozen], (_init6 = _Object$getOwnPropertyDescriptor(_class2, 'getPluginConfig'), _init6 = _init6 ? _init6.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init6;
  }
}), _class2)), _class2)) || _class);

/**
 * chimee-plugin-controlbar v0.1.3
 * (c) 2017 yandeqiang
 * Released under ISC
 */

function __$styleInject$1(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
  
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  return returnValue;
}

__$styleInject$1("chimee-clarity-list,chimee-progressbar-tip,chimee-screen-full,chimee-screen-small{display:none}chimee-control.full chimee-screen-full,chimee-control.small chimee-screen-small{display:inline-block;width:2em;height:100%}chimee-control{display:block;height:100%;line-height:2em;font-size:14px;user-select:none;overflow:hidden;font-family:Roboto,Arial,Helvetica,sans-serif;transition:visibility .5s ease}chimee-control,chimee-control-wrap{position:absolute;bottom:0;left:0;width:100%}chimee-control-wrap{height:2em;display:table;background:rgba(0,0,0,.5);transition:bottom .5s ease;pointer-events:auto}.chimee-component{display:table-cell;height:2em;padding:.3em .3em .2em;box-sizing:border-box;vertical-align:top;cursor:pointer;width:1%;line-height:1em;white-space:nowrap}chimee-control-state.chimee-component{width:3em;text-align:right}chimee-control-state .left,chimee-control-state .right{transition:all .2s ease-in-out}chimee-control-state svg{width:2em;height:1.4em}chimee-progressbar.chimee-component{width:auto;position:relative}chimee-progressbar.two-line chimee-progressbar-wrap{top:-1.6em;height:1.6em}chimee-progressbar-wrap{display:inline-block;height:100%;position:absolute;left:1em;right:1em;top:0}chimee-progressbar.two-line .chimee-progressbar-line{top:.8em}.chimee-progressbar-line{position:absolute;top:.9em;left:0;display:inline-block;height:3px}chimee-progressbar-bg{width:100%;background:#4c4c4c}chimee-progressbar-buffer{width:0;background:#6f6f6f}chimee-progressbar-all{background:#de698c}chimee-progressbar-ball{content:\"\";position:absolute;right:-.8em;top:-.3em;display:inline-block;width:.8em;height:.8em;border-radius:.8em;background:#fff;pointer-events:none}chimee-progressbar-tip{position:absolute;bottom:.5em;top:-1.5em;left:0;z-index:1;padding:0 .5em;height:1.5em;background:#fff;line-height:1.5em;border-radius:4px;color:#000;text-align:center}chimee-progresstime.chimee-component{color:#fff;font-weight:400;text-align:center;white-space:nowrap;padding:.5em}chimee-progresstime-pass,chimee-progresstime-total{display:inline}chimee-volume.chimee-component{cursor:pointer;padding:0;line-height:2em}chimee-volume-state{width:3em;vertical-align:6px}chimee-volume-state svg{width:2em;height:1.4em}chimee-volume .line,chimee-volume .ring1,chimee-volume .ring2{stroke-dasharray:150;stroke-dashoffset:150;transition:stroke-dashoffset .7s ease-in-out}chimee-volume.high .ring1,chimee-volume.high .ring2,chimee-volume.low .ring2,chimee-volume.mute .line,chimee-volume.mute .ring1,chimee-volume.mute .ring2{stroke-dashoffset:0}chimee-volume-bar{position:relative;display:inline-block;width:4em;height:100%;margin:0 .5em}chimee-volume-bar-all,chimee-volume-bar-bg{position:absolute;top:.9em;left:0;display:inline-block;height:3px}chimee-volume-bar-bg{width:100%;background:#4c4c4c}chimee-volume-bar-all{background:#de698c}chimee-volume-bar-all:after{content:\"\";position:absolute;right:-.2em;top:-.3em;display:inline-block;width:.8em;height:.8em;border-radius:.8em;background:#fff}chimee-screen.chimee-component{width:3em;text-align:left}chimee-screen-small{background:url(data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjYxcHgiIGhlaWdodD0iNjJweCIgdmlld0JveD0iMCAwIDYxIDYyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0My4xICgzOTAxMikgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAuNzU2MzA4LCAzMC42MjE4NjcpIHJvdGF0ZSg0NS4wMDAwMDApIHRyYW5zbGF0ZSgtMzAuNzU2MzA4LCAtMzAuNjIxODY3KSB0cmFuc2xhdGUoMTUuNzU2MzA4LCAtMTIuMzc4MTMzKSIgZmlsbD0iI0ZGRkZGRiI+CiAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJQYXRoIiBwb2ludHM9IjExLjUxOTA3ODYgNDYuOTQzMTc3OCAxMS43MjEwMDkzIDcwLjc5MTM3NzMgMC41NjUxODA1MjcgNzAuNzkxMzc3MyAxNS40Njc0NDU1IDg1LjgzNTMxMjUgMjkuMzcwMjA5NiA3MC43OTEzNzczIDE4LjU1NzMyNDcgNzAuNzcwMjE1NiAxOC41NTczMjQ3IDQ2Ljk0MzE3NzgiPjwvcG9seWdvbj4KICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlBhdGgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0Ljk2NzY5NSwgMTkuNzIwMTk4KSByb3RhdGUoMTgwLjAwMDAwMCkgdHJhbnNsYXRlKC0xNC45Njc2OTUsIC0xOS43MjAxOTgpICIgcG9pbnRzPSIxMS41MTkwNzg2IDAuMjc0MTMwMjc4IDExLjcyMTAwOTMgMjQuMTIyMzI5OCAwLjU2NTE4MDUyNyAyNC4xMjIzMjk4IDE1LjQ2NzQ0NTUgMzkuMTY2MjY0OSAyOS4zNzAyMDk2IDI0LjEyMjMyOTggMTguNTU3MzI0NyAyNC4xMDExNjgxIDE4LjU1NzMyNDcgMC4yNzQxMzAyNzgiPjwvcG9seWdvbj4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==);background-repeat:no-repeat;background-size:contain;background-position:50%}chimee-screen-full{background:url(data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjY3cHgiIGhlaWdodD0iNjZweCIgdmlld0JveD0iMCAwIDY3IDY2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0My4xICgzOTAxMikgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJzY3JlZW4tc21hbGwiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMzLjc1NjMwOCwgMzIuNjIxODY3KSByb3RhdGUoNDUuMDAwMDAwKSB0cmFuc2xhdGUoLTMzLjc1NjMwOCwgLTMyLjYyMTg2NykgdHJhbnNsYXRlKDE4Ljc1NjMwOCwgLTEwLjM3ODEzMykiIGZpbGw9IiNGRkZGRkYiPgogICAgICAgICAgICA8cG9seWdvbiBpZD0iUGF0aCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQuOTY3Njk1LCA2Ni4zODkyNDUpIHJvdGF0ZSgxODAuMDAwMDAwKSB0cmFuc2xhdGUoLTE0Ljk2NzY5NSwgLTY2LjM4OTI0NSkgIiBwb2ludHM9IjExLjUxOTA3ODYgNDYuOTQzMTc3OCAxMS43MjEwMDkzIDcwLjc5MTM3NzMgMC41NjUxODA1MjcgNzAuNzkxMzc3MyAxNS40Njc0NDU1IDg1LjgzNTMxMjUgMjkuMzcwMjA5NiA3MC43OTEzNzczIDE4LjU1NzMyNDcgNzAuNzcwMjE1NiAxOC41NTczMjQ3IDQ2Ljk0MzE3NzgiPjwvcG9seWdvbj4KICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlBhdGgiIHBvaW50cz0iMTEuNTE5MDc4NiAwLjI3NDEzMDI3OCAxMS43MjEwMDkzIDI0LjEyMjMyOTggMC41NjUxODA1MjcgMjQuMTIyMzI5OCAxNS40Njc0NDU1IDM5LjE2NjI2NDkgMjkuMzcwMjA5NiAyNC4xMjIzMjk4IDE4LjU1NzMyNDcgMjQuMTAxMTY4MSAxOC41NTczMjQ3IDAuMjc0MTMwMjc4Ij48L3BvbHlnb24+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=);background-repeat:no-repeat;background-size:contain;background-position:50%}chimee-clarity.chimee-component{position:relative;color:#fff;padding:0;padding-right:1em;padding-left:1em;text-align:center;vertical-align:middle;font-size:16px}chimee-clarity-list{position:absolute;left:-1em;line-height:2em;width:6em;padding-bottom:1.5em;opacity:.8;box-sizing:content-box}chimee-clarity-list ul{margin:0;padding:1em 0;background:#292929}chimee-clarity-list li{list-style-type:none}chimee-clarity-list li.active,chimee-clarity-list li:hover{color:#57b0f6}", undefined);

/**
 * bind the function with some context. we have some fallback strategy here
 * @param {function} fn the function which we need to bind the context on
 * @param {any} context the context object
 */
function bind$1(fn, context) {
  if (fn.bind) {
    return fn.bind(context);
  } else if (fn.apply) {
    return function __autobind__() {
      for (var _len2 = arguments.length, args = Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return fn.apply(context, args);
    };
  } else {
    return function __autobind__() {
      for (var _len3 = arguments.length, args = Array(_len3), _key4 = 0; _key4 < _len3; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return fn.call.apply(fn, [context].concat(_toConsumableArray(args)));
    };
  }
}

var Base = function () {
  function Base(parent) {
    _classCallCheck(this, Base);

    this.parent = parent;
  }

  _createClass(Base, [{
    key: 'create',
    value: function create() {
      this.createEl();
      this.addAllEvent();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.removeAllEvent();
      this.parent.$wrap.removeChild(this.$dom);
    }
  }, {
    key: 'createEl',
    value: function createEl() {
      this.$dom = document.createElement(this.option.tag);
      this.$dom.innerHTML = this.option.defaultHtml || this.option.html;
      this.parent.$wrap.appendChild(this.$dom);
    }
  }, {
    key: 'addAllEvent',
    value: function addAllEvent() {
      var _this = this;

      this.option.defaultEvent && _Object$keys(this.option.defaultEvent).forEach(function (item) {
        var key = _this.option.defaultEvent[item];
        _this[key] = bind$1(_this[key], _this);
        addEvent(_this.$dom, item, _this[key], false, false);
      });
      this.option.event && _Object$keys(this.option.event).forEach(function (item) {
        var key = '__' + item;
        _this[key] = _this.option.event[item];
        addEvent(_this.$dom, item, _this[key], false, false);
      });
    }
  }, {
    key: 'removeAllEvent',
    value: function removeAllEvent() {
      var _this2 = this;

      this.option.defaultEvent && _Object$keys(this.option.defaultEvent).forEach(function (item) {
        removeEvent(_this2.$dom, item, _this2[_this2.option.defaultEvent[item]], false, false);
      });
      this.option.event && _Object$keys(this.option.event).forEach(function (item) {
        var key = '__' + item;
        // this[key] = this.option.event[item];
        removeEvent(_this2.$dom, item, _this2[key], false, false);
      });
    }
  }]);

  return Base;
}();

/**
 * 自定义组件配置
 */

var Component = function (_Base) {
  _inherits(Component, _Base);

  function Component(parent, option) {
    _classCallCheck(this, Component);

    var _this = _possibleConstructorReturn(this, (Component.__proto__ || _Object$getPrototypeOf(Component)).call(this, parent));

    _this.option = option;
    _this.init();
    return _this;
  }

  _createClass(Component, [{
    key: 'init',
    value: function init() {
      _get(Component.prototype.__proto__ || _Object$getPrototypeOf(Component.prototype), 'create', this).call(this);
      addClassName(this.$dom, 'chimee-component');
      // 用户自定义配置
      var width = this.option.width || '2em';
      setStyle(this.$dom, 'width', width);
    }
  }]);

  return Component;
}(Base);

/**
 * play 配置
 */

var defaultOption = {
  tag: 'chimee-control-state',
  defaultHtml: '\n    <svg viewBox="0 0 206 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n      <g fill="#ffffff" stroke="#ffffff">\n        <path class="left"></path>\n        <path class="right"></path>\n      </g>\n    </svg>\n  ',
  defaultEvent: {
    click: 'click'
  }
};

var Play = function (_Base) {
  _inherits(Play, _Base);

  function Play(parent, option) {
    _classCallCheck(this, Play);

    var _this = _possibleConstructorReturn(this, (Play.__proto__ || _Object$getPrototypeOf(Play)).call(this, parent));

    _this.option = deepAssign(defaultOption, isObject$1(option) ? option : {});
    _this.init();
    return _this;
  }

  _createClass(Play, [{
    key: 'init',
    value: function init() {
      _get(Play.prototype.__proto__ || _Object$getPrototypeOf(Play.prototype), 'create', this).call(this);
      if (this.option.icon) {
        this.$dom.innerHTML = '';
        setStyle(this.$dom, {
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: this.option.width + ' ' + this.option.height
        });
      }
      addClassName(this.$dom, 'chimee-component');
      this.$left = $(this.$dom).find('.left');
      this.$right = $(this.$dom).find('.right');
      // 用户自定义配置
      this.option.width && setStyle(this.$dom, 'width', this.option.width);
      this.changeState('pause');
    }
  }, {
    key: 'changeState',
    value: function changeState(state) {
      var nextState = state === 'play' ? 'pause' : 'play';
      this.state = state;
      addClassName(this.parent.$dom, nextState);
      removeClassName(this.parent.$dom, state);
      if (this.option.icon) {
        setStyle(this.$dom, {
          backgroundImage: 'url(' + this.option.icon[nextState] + ')'
        });
      } else {
        this.setPath(nextState);
      }
    }
  }, {
    key: 'click',
    value: function click(e) {
      console.log(e);
      var nextState = this.state === 'play' ? 'pause' : 'play';
      this.changeState(nextState);
      this.parent.$emit(nextState);
    }
  }, {
    key: 'setPath',
    value: function setPath(state) {
      var _this2 = this;

      this.$left.attr('d', 'M0.921875,0.265625L0.921875,197.074852L79.3611755,172.829747L79.3611755,26.9775543Z');
      this.$right.attr('d', 'M126.921875,22.56643L126.921875,182.056305L205.361168,144.776862L205.361168,56.6476783Z');
      setTimeout(function () {
        if (state === 'play') {
          _this2.$left.attr('d', 'M0.921875,0.265625L0.921875,197.074852L95.7890625,149L96.2929688,49Z');
          _this2.$right.attr('d', 'M90.3142151,45.9315226L90.3142151,151.774115L201.600944,99.9938782L201.600944,98.0237571Z');
        } else {
          _this2.$left.attr('d', 'M0.921875,1.265625L0.921875,198.074852L79.3611677,198.074852L79.3611677,0.258923126Z');
          _this2.$right.attr('d', 'M126.921875,1.265625L126.921875,198.074852L205.361168,198.074852L205.361168,0.258923126Z');
        }
      }, 140);
    }
  }]);

  return Play;
}(Base);

var _class$1$1;

function _applyDecoratedDescriptor$1$1(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

/**
 * Volume 配置
 */

var defaultOption$1 = {
  tag: 'chimee-volume',
  defaultHtml: '\n    <chimee-volume-state>\n      <svg viewBox="0 0 107 101" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n        <g class="volume" stroke="#ffffff">\n          <polygon class="horn" fill="#ffffff" points="0.403399942 30 27.3842118 30 56.8220589 2.84217094e-14 57.9139815 100 27.3842118 70 0.403399942 70"></polygon>\n          <path class="ring1" d="M63,5.00975239 C69.037659,4.78612057 75.9178585,8.40856146 83.6405984,15.877075 C95.2247083,27.0798454 100,34.7975125 100,50.9608558 C100,67.1241991 95.3628694,73.7907482 83.6405984,83.8306724 C75.8257511,90.5239552 68.9455516,94.0320644 63,94.355" stroke-width="10"></path>\n          <path class="ring2" d="M65.2173913,29.4929195 C67.8779343,29.3931169 70.9097496,31.0097416 74.3128371,34.3427934 C79.4174684,39.3423712 81.5217391,42.7866154 81.5217391,50 C81.5217391,57.2133846 79.4783502,60.1885354 74.3128371,64.6691576 C70.8691617,67.656239 67.8373465,69.2218397 65.2173913,69.3659595" stroke-width="10"></path>\n          <path class="line" d="M4.19119202,3.65220497 L102,96" stroke-width="10"></path>\n        </g>\n    </svg>\n    </chimee-volume-state>\n    <chimee-volume-bar>\n      <chimee-volume-bar-bg></chimee-volume-bar-bg>\n      <chimee-volume-bar-all></chimee-volume-bar-all>\n      <chimee-volume-bar-track></chimee-volume-bar-track>\n    </chimee-volume-bar>\n  ',
  defaultEvent: {
    mousedown: 'mousedown'
  }
};

var getElementPath = function getElementPath(elem) {
  var path = [];
  if (elem === null) return path;
  path.push(elem);
  while (elem.parentNode !== null) {
    elem = elem.parentNode;
    path.push(elem);
  }
  return path;
};

var Volume = (_class$1$1 = function (_Base) {
  _inherits(Volume, _Base);

  function Volume(parent, option) {
    _classCallCheck(this, Volume);

    var _this = _possibleConstructorReturn(this, (Volume.__proto__ || _Object$getPrototypeOf(Volume)).call(this, parent));

    _this.parent.preVolume = 0;
    _this.option = deepAssign(defaultOption$1, isObject$1(option) ? option : {});
    _this.init();
    return _this;
  }

  _createClass(Volume, [{
    key: 'inited',
    value: function inited() {
      this.update();
    }
  }, {
    key: 'init',
    value: function init() {
      _get(Volume.prototype.__proto__ || _Object$getPrototypeOf(Volume.prototype), 'create', this).call(this);
      this.$state = $('chimee-volume-state', this.$dom);
      if (this.option.icon) {
        this.$state.html('');
        this.$state.css({
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: this.option.width + ' ' + this.option.height
        });
      }
      this.$bar = $('chimee-volume-bar', this.$dom);
      this.$all = $('chimee-volume-bar-all', this.$dom);
      this.$bg = $('chimee-volume-bar-bg', this.$dom);
      addClassName(this.$dom, 'chimee-component');
      this.changeState();
      // 用户自定义配置
      this.option.width && setStyle(this.$dom, 'width', this.option.width);
    }
  }, {
    key: 'changeState',
    value: function changeState() {
      if (this.parent.volume === 0) {
        this.state = 'mute';
      } else if (this.parent.volume > 0 && this.parent.volume <= 0.5) {
        this.state = 'low';
      } else if (this.parent.volume > 0.5 && this.parent.volume <= 1) {
        this.state = 'high';
      }
      removeClassName(this.$dom, 'mute low high');
      addClassName(this.$dom, this.state);
      if (this.option.icon) {
        this.$state.css({
          backgroundImage: 'url(' + this.option.icon[this.state] + ')'
        });
      }
    }
  }, {
    key: 'click',
    value: function click(e) {
      var path = e.path || getElementPath(e.target);
      if (path.indexOf(this.$state[0]) !== -1) {
        this.stateClick(e);
      } else if (path.indexOf(this.$bar[0]) !== -1) {
        this.barClick(e);
      }
    }
  }, {
    key: 'stateClick',
    value: function stateClick() {
      var currentVolume = this.parent.volume;
      this.parent.volume = currentVolume === 0 ? this.parent.preVolume : 0;
      this.parent.preVolume = currentVolume;
      this.changeState();
    }
  }, {
    key: 'barClick',
    value: function barClick(e) {
      var volume = e.layerX / this.$bg[0].offsetWidth;
      this.parent.volume = volume < 0 ? 0 : volume > 1 ? 1 : volume;
      this.update();
    }
  }, {
    key: 'mousedown',
    value: function mousedown(e) {
      this.click(e);
      this.startX = e.clientX;
      this.startVolume = this.parent.volume;
      addEvent(window, 'mousemove', this.draging);
      addEvent(window, 'mouseup', this.dragEnd);
      addEvent(window, 'contextmenu', this.dragEnd);
    }

    /**
     * 更新声音条
     */

  }, {
    key: 'update',
    value: function update() {
      this.changeState();
      this.$all.css('width', this.parent.volume * 100 + '%');
    }

    /**
     * 开始拖拽
     * @param {EventObject} e 鼠标事件
     */

  }, {
    key: 'draging',
    value: function draging(e) {
      this.endX = e.clientX;
      var dragVolume = (this.endX - this.startX) / this.$bg[0].offsetWidth;
      var dragAfterVolume = +(this.startVolume + dragVolume).toFixed(2);
      this.parent.volume = dragAfterVolume < 0 ? 0 : dragAfterVolume > 1 ? 1 : dragAfterVolume;
    }

    /**
     * 结束拖拽
     */

  }, {
    key: 'dragEnd',
    value: function dragEnd() {
      this.startX = 0;
      this.startVolume = 0;
      removeEvent(window, 'mousemove', this.draging);
      removeEvent(window, 'mouseup', this.dragEnd);
      removeEvent(window, 'contextmenu', this.dragEnd);
    }
  }]);

  return Volume;
}(Base), (_applyDecoratedDescriptor$1$1(_class$1$1.prototype, 'draging', [autobind], _Object$getOwnPropertyDescriptor(_class$1$1.prototype, 'draging'), _class$1$1.prototype), _applyDecoratedDescriptor$1$1(_class$1$1.prototype, 'dragEnd', [autobind], _Object$getOwnPropertyDescriptor(_class$1$1.prototype, 'dragEnd'), _class$1$1.prototype)), _class$1$1);

var _class$1$2;

function _applyDecoratedDescriptor$1$2(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var defaultOption$2 = {
  tag: 'chimee-progressbar',
  defaultHtml: '\n    <chimee-progressbar-wrap>\n      <chimee-progressbar-bg class="chimee-progressbar-line"></chimee-progressbar-bg>\n      <chimee-progressbar-buffer class="chimee-progressbar-line"></chimee-progressbar-buffer>\n      <chimee-progressbar-all class="chimee-progressbar-line">\n        <chimee-progressbar-ball></chimee-progressbar-ball>\n      </chimee-progressbar-all>\n      <chimee-progressbar-tip></chimee-progressbar-tip>\n    </chimee-progressbar-wrap>\n  ',
  defaultEvent: {}
};

var ProgressBar = (_class$1$2 = function (_Base) {
  _inherits(ProgressBar, _Base);

  function ProgressBar(parent, option) {
    _classCallCheck(this, ProgressBar);

    var _this = _possibleConstructorReturn(this, (ProgressBar.__proto__ || _Object$getPrototypeOf(ProgressBar)).call(this, parent));

    _this.option = deepAssign(defaultOption$2, isObject$1(option) ? option : {});
    _this.visiable = option !== false;
    _this.init();
    return _this;
  }

  _createClass(ProgressBar, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      _get(ProgressBar.prototype.__proto__ || _Object$getPrototypeOf(ProgressBar.prototype), 'create', this).call(this);
      this.$wrap = $('chimee-progressbar-wrap', this.$dom);
      this.$buffer = $('chimee-progressbar-buffer', this.$dom);
      this.$all = $('chimee-progressbar-all', this.$dom);
      this.$tip = $('chimee-progressbar-tip', this.$dom);
      this.$track = $('chimee-progressbar-track', this.$dom);
      this.$line = $('.chimee-progressbar-line', this.$dom);
      this.$ball = $('chimee-progressbar-ball', this.$dom);
      addClassName(this.$dom, 'chimee-component');

      // css 配置
      !this.visiable && setStyle(this.$dom, 'visibility', 'hidden');
      // this.$line.css({
      //   top: this.$wrap.
      // });
      // 进度条居中布局，还是在上方
      if (this.option.layout === 'two-line') {
        addClassName(this.$dom, 'two-line');
        this.$wrap.css({
          left: -this.$dom.offsetLeft + 'px',
          // top: -this.$ball[0].offsetHeight * 2 + 'px',
          width: this.parent.$dom.offsetWidth + 'px'
          // height: this.$ball[0].offsetHeight * 2 + 'px'
        });
        // this.$line.css({
        //   top: this.$ball[0].offsetHeight + 'px'
        // }) 
        setStyle(this.parent.$wrap, 'paddingTop', this.$ball[0].offsetHeight + 'px');
        this.watch_screen = this.parent.$watch('isFullScreen', function () {
          _this2.$wrap.css({
            width: _this2.parent.$dom.offsetWidth + 'px'
          });
        });
      } else {
        // this.$line.css({
        //   top: this.$wrap[0].offsetHeight / 2 + 'px'
        // }) 
      }
      this.addWrapEvent();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.removeWrapEvent();
      _get(ProgressBar.prototype.__proto__ || _Object$getPrototypeOf(ProgressBar.prototype), 'destroy', this).call(this);
      this.watch_screen();
    }
  }, {
    key: 'addWrapEvent',
    value: function addWrapEvent() {
      this.$wrap.on('mousedown', this.mousedown);
      this.$wrap.on('mouseenter', this.mouseenter);
    }
  }, {
    key: 'removeWrapEvent',
    value: function removeWrapEvent() {
      this.$wrap.off('mousedown', this.mousedown);
      this.$wrap.off('mouseenter', this.mouseenter);
    }

    /**
     * 缓存进度条更新 progress 事件
     */

  }, {
    key: 'progress',
    value: function progress() {
      var buffer = 0;
      try {
        buffer = this.parent.buffered.end(0);
      } catch (e) {}
      var bufferWidth = buffer / this.parent.duration * 100 + '%';
      this.$buffer.css('width', bufferWidth);
    }

    /**
     * requestAnimationFrame 来更新进度条, timeupdate 事件
     */

  }, {
    key: 'update',
    value: function update() {
      var allWidth = this.$wrap[0].offsetWidth - this.$ball[0].offsetWidth;
      var time = this._currentTime !== undefined ? this._currentTime : this.parent.currentTime;
      var timePer = time ? time / this.parent.duration : 0;
      var timeWidth = timePer * allWidth;
      this.$all.css('width', timeWidth);
    }
  }, {
    key: 'mousedown',
    value: function mousedown(e) {
      if (e.target === this.$tip[0]) return;
      this._currentTime = this.parent.currentTime = e.layerX / this.$wrap[0].offsetWidth * this.parent.duration;
      this.update();
      this.startX = e.clientX;
      this.startTime = this.parent.currentTime;
      addEvent(window, 'mousemove', this.draging);
      addEvent(window, 'mouseup', this.dragEnd);
      addEvent(window, 'contextmenu', this.dragEnd);
    }

    /**
     * 开始拖拽
     * @param {EventObject} e 鼠标事件
     */

  }, {
    key: 'draging',
    value: function draging(e) {
      this.endX = e.clientX;
      var dragTime = (this.endX - this.startX) / this.$wrap[0].offsetWidth * this.parent.duration;
      var dragAfterTime = +(this.startTime + dragTime).toFixed(2);
      this._currentTime = dragAfterTime < 0 ? 0 : dragAfterTime > this.parent.duration ? this.parent.duration : dragAfterTime;
      this.update();
    }

    /**
     * 结束拖拽
     */

  }, {
    key: 'dragEnd',
    value: function dragEnd() {
      this.startX = 0;
      this.startTime = 0;
      this.parent.currentTime = this._currentTime;
      this._currentTime = undefined;
      removeEvent(window, 'mousemove', this.draging);
      removeEvent(window, 'mouseup', this.dragEnd);
      removeEvent(window, 'contextmenu', this.dragEnd);
    }
  }, {
    key: 'mouseenter',
    value: function mouseenter() {
      this.$wrap.on('mousemove', this.tipShow);
      this.$wrap.on('mouseleave', this.tipEnd);
    }
  }, {
    key: 'tipShow',
    value: function tipShow(e) {
      if (e.target === this.$tip[0]) return;
      var time = e.layerX / this.$wrap[0].offsetWidth * this.parent.duration;
      time = time < 0 ? 0 : time > this.parent.duration ? this.parent.duration : time;
      var tipContent = formatTime(time);
      var left = e.layerX - this.$tip[0].offsetWidth / 2;
      var leftBound = this.$wrap[0].offsetWidth - this.$tip[0].offsetWidth;
      left = left < 0 ? 0 : left > leftBound ? leftBound : left;
      this.$tip.text(tipContent);
      this.$tip.css('display', 'inline-block');
      this.$tip.css('left', left + 'px');
    }
  }, {
    key: 'tipEnd',
    value: function tipEnd() {
      this.$wrap.off('mousemove', this.tipShow);
      this.$wrap.off('mouseleave', this.tipEnd);
      this.$tip.css('display', 'none');
    }
  }]);

  return ProgressBar;
}(Base), (_applyDecoratedDescriptor$1$2(_class$1$2.prototype, 'mousedown', [autobind], _Object$getOwnPropertyDescriptor(_class$1$2.prototype, 'mousedown'), _class$1$2.prototype), _applyDecoratedDescriptor$1$2(_class$1$2.prototype, 'draging', [autobind], _Object$getOwnPropertyDescriptor(_class$1$2.prototype, 'draging'), _class$1$2.prototype), _applyDecoratedDescriptor$1$2(_class$1$2.prototype, 'dragEnd', [autobind], _Object$getOwnPropertyDescriptor(_class$1$2.prototype, 'dragEnd'), _class$1$2.prototype), _applyDecoratedDescriptor$1$2(_class$1$2.prototype, 'mouseenter', [autobind], _Object$getOwnPropertyDescriptor(_class$1$2.prototype, 'mouseenter'), _class$1$2.prototype), _applyDecoratedDescriptor$1$2(_class$1$2.prototype, 'tipShow', [autobind], _Object$getOwnPropertyDescriptor(_class$1$2.prototype, 'tipShow'), _class$1$2.prototype), _applyDecoratedDescriptor$1$2(_class$1$2.prototype, 'tipEnd', [autobind], _Object$getOwnPropertyDescriptor(_class$1$2.prototype, 'tipEnd'), _class$1$2.prototype)), _class$1$2);

/**
 * progressTime 配置
 */

var defaultOption$3 = {
  tag: 'chimee-progresstime',
  defaultHtml: '\n    <chimee-progresstime-pass>00:00</chimee-progresstime-pass\n    ><chimee-progresstime-total\n      ><span>/</span\n      ><chimee-progresstime-total-value>00:00</chimee-progresstime-total-value>\n    </chimee-progresstime-total>\n  ',
  defaultEvent: {}
};

var ProgressTime = function (_Base) {
  _inherits(ProgressTime, _Base);

  function ProgressTime(parent, option) {
    _classCallCheck(this, ProgressTime);

    var _this = _possibleConstructorReturn(this, (ProgressTime.__proto__ || _Object$getPrototypeOf(ProgressTime)).call(this, parent));

    _this.option = deepAssign(defaultOption$3, isObject$1(option) ? option : {});
    _this.init();
    return _this;
  }

  _createClass(ProgressTime, [{
    key: 'init',
    value: function init() {
      _get(ProgressTime.prototype.__proto__ || _Object$getPrototypeOf(ProgressTime.prototype), 'create', this).call(this);
      this.$total = $('chimee-progresstime-total-value', this.$dom);
      this.$pass = $('chimee-progresstime-pass', this.$dom);
      addClassName(this.$dom, 'chimee-component');

      // 用户自定义配置
      // this.option.width && setStyle(this.$dom, 'width', this.option.width);
    }
  }, {
    key: 'updatePass',
    value: function updatePass() {
      this.$pass.text(formatTime(this.parent.currentTime));
    }
  }, {
    key: 'updateTotal',
    value: function updateTotal() {
      this.$total.text(formatTime(this.parent.duration));
    }
  }]);

  return ProgressTime;
}(Base);

var _class$2$1;

function _applyDecoratedDescriptor$2$1(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var screenEvent = '';
var currentScreenElement = '';

if (document.webkitCancelFullScreen) {
  screenEvent = 'webkitfullscreenchange';
  currentScreenElement = 'webkitFullscreenElement';
} else if (document.mozCancelFullScreen) {
  screenEvent = 'mozfullscreenchange';
  currentScreenElement = 'mozFullScreenElement';
} else if (document.msExitFullscreen) {
  screenEvent = 'msfullscreenchange';
  currentScreenElement = 'msFullscreenElement';
} else if (document.exitFullscreen) {
  screenEvent = 'fullscreenchange';
  currentScreenElement = 'fullscreenElement';
}

/**
 * Screen 配置
 */

var defaultOption$4 = {
  tag: 'chimee-screen',
  defaultHtml: '\n    <chimee-screen-full></chimee-screen-full>\n    <chimee-screen-small></chimee-screen-small>\n  ',
  defaultEvent: {
    click: 'click'
  }
};

var Screen = (_class$2$1 = function (_Base) {
  _inherits(Screen, _Base);

  function Screen(parent, option) {
    _classCallCheck(this, Screen);

    var _this = _possibleConstructorReturn(this, (Screen.__proto__ || _Object$getPrototypeOf(Screen)).call(this, parent));

    _this.state = 'small';
    _this.option = deepAssign(defaultOption$4, isObject$1(option) ? option : {});
    _this.init();
    return _this;
  }

  _createClass(Screen, [{
    key: 'init',
    value: function init() {
      _get(Screen.prototype.__proto__ || _Object$getPrototypeOf(Screen.prototype), 'create', this).call(this);
      if (this.option.icon) {
        this.$dom.innerHTML = '';
        setStyle(this.$dom, {
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: this.option.width + ' ' + this.option.height
        });
      }
      this.changeState(this.state);
      // addClassName(this.$dom, 'flex-item');
      addClassName(this.$dom, 'chimee-component');
      // 用户自定义配置
      this.option.width && setStyle(this.$dom, 'width', this.option.width);
    }
  }, {
    key: 'changeState',
    value: function changeState(state) {
      var removeState = state === 'small' ? 'full' : 'small';
      addClassName(this.parent.$dom, state);
      removeClassName(this.parent.$dom, removeState);
      if (this.option.icon) {
        setStyle(this.$dom, {
          backgroundImage: 'url(' + this.option.icon[state] + ')'
        });
      }
    }
  }, {
    key: 'click',
    value: function click() {
      var full = false;
      if (this.state === 'small') {
        this.state = 'full';
        full = true;
      } else {
        this.state = 'small';
        full = false;
      }
      this.changeState(this.state);
      this.parent.$fullScreen(full, 'container');
      if (full) {
        addEvent(document, screenEvent, this.screenChange);
      } else {
        removeEvent(document, screenEvent, this.screenChange);
      }
    }
  }, {
    key: 'screenChange',
    value: function screenChange() {
      if (document[currentScreenElement]) return;
      this.state = 'small';
      this.changeState('small');
      this.parent.$fullScreen(false, 'container');
    }
  }]);

  return Screen;
}(Base), (_applyDecoratedDescriptor$2$1(_class$2$1.prototype, 'screenChange', [autobind], _Object$getOwnPropertyDescriptor(_class$2$1.prototype, 'screenChange'), _class$2$1.prototype)), _class$2$1);

function getComputedStyleNum(elem, prop) {
  return parseInt(getComputedStyle(elem)[prop]);
}

/**
 * play 配置
 */

var defaultOption$5 = {
  tag: 'chimee-clarity',
  width: '2em',
  defaultHtml: '\n    <chimee-clarity-text></chimee-clarity-text>\n    <chimee-clarity-list>\n      <ul></ul>\n      <i class="chimee-clarity-list-arrow">\n        <svg viewBox="0 0 115 6"  version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n          <g id="Group-3-Copy" fill="#57B0F6">\n            <polygon id="Path-2" points="0.0205224145 0.0374249581 0.0205224145 2.12677903 53.9230712 2.12677903 57.1127727 5.3468462 60.2283558 2.12677903 113.820935 2.12677903 113.820935 0.0374249581"></polygon>\n          </g>\n        </svg>\n      </i>\n    </chimee-clarity-list>\n  ',
  defaultEvent: {
    mouseenter: 'mouseenter',
    mouseleave: 'mouseleave',
    click: 'click'
  }
};

var Clarity = function (_Base) {
  _inherits(Clarity, _Base);

  function Clarity(parent, option) {
    _classCallCheck(this, Clarity);

    var _this = _possibleConstructorReturn(this, (Clarity.__proto__ || _Object$getPrototypeOf(Clarity)).call(this, parent));

    _this.option = deepAssign(defaultOption$5, isObject$1(option) ? option : {});
    _this.init();
    return _this;
  }

  _createClass(Clarity, [{
    key: 'init',
    value: function init() {
      _get(Clarity.prototype.__proto__ || _Object$getPrototypeOf(Clarity.prototype), 'create', this).call(this);
      addClassName(this.$dom, 'chimee-component');

      this.$text = $(this.$dom).find('chimee-clarity-text');
      this.$list = $(this.$dom).find('chimee-clarity-list');
      this.$listUl = this.$list.find('ul');

      // 用户自定义配置
      this.option.width && setStyle(this.$dom, 'width', this.option.width);

      this.initTextList();
      // 读当前 css 设置去配置
      var lineHeight = getComputedStyleNum(this.$listUl.find('li')[0], 'lineHeight');
      var listPaddingBottom = getComputedStyleNum(this.$list[0], 'paddingBottom');
      var listFontSize = getComputedStyleNum(this.$list[0], 'fontSize');
      var ulPaddingTop = getComputedStyleNum(this.$listUl[0], 'paddingTop');
      var ulPaddingBottom = getComputedStyleNum(this.$listUl[0], 'paddingBottom');
      // css
      this.$list.css({
        top: listFontSize / 2 - listPaddingBottom - ulPaddingTop - ulPaddingBottom - this.option.list.length * lineHeight + 'px'
      });
    }
  }, {
    key: 'initTextList',
    value: function initTextList() {
      var _this2 = this;

      this.option.list.forEach(function (item) {
        var li = $(document.createElement('li'));
        li.attr('data-url', item.src);
        li.text(item.name);
        if (item.src === _this2.parent.$videoConfig.src) {
          _this2.$text.text(item.name);
          li.addClass('active');
        }
        _this2.$listUl.append(li);
      });
    }
  }, {
    key: 'mouseenter',
    value: function mouseenter(e) {
      this.$list.css('display', 'inline-block');
    }
  }, {
    key: 'mouseleave',
    value: function mouseleave(e) {
      this.$list.css('display', 'none');
    }
  }, {
    key: 'click',
    value: function click(e) {
      var elem = e.target;
      if (elem.tagName === 'LI') {
        _Array$from(elem.parentElement.children).map(function (item) {
          removeClassName(item, 'active');
        });
        var url = elem.getAttribute('data-url') || '';
        addClassName(e.target, 'active');
        this.$text.text(e.target.textContent);
        this.switchClarity(url);
      }
    }
  }, {
    key: 'switchClarity',
    value: function switchClarity(url) {
      var _this3 = this;

      if (this.loadOption) {
        this.loadOption.abort = true;
      }
      this.loadOption = {
        abort: false,
        repeatTimes: 3,
        increment: 1
      };
      var currentTime = this.parent.currentTime;
      this.parent.$silentLoad(url, this.loadOption).then(function () {
        _this3.parent.currentTime = currentTime;
        _this3.loadOption = undefined;
      }).catch(function (e) {});
      this.mouseleave();
    }
  }]);

  return Clarity;
}(Base);

function hundleChildren(plugin) {
  var childConfig = {};
  if (!plugin.$config.children) {
    childConfig = plugin.isLive ? {
      play: true, // 底部播放暂停按钮
      progressTime: false, // 播放时间
      progressBar: false, // 播放进度控制条
      volume: true, // 声音控制
      screen: true // 全屏控制
    } : {
      play: true, // 底部播放暂停按钮
      progressTime: true, // 播放时间
      progressBar: true, // 播放进度控制条
      volume: true, // 声音控制
      screen: true // 全屏控制
    };
  } else {
    childConfig = plugin.$config.children;
  }

  return childConfig;
}

/**
 * 1. 将所有的 ui component 输出到 html 结构中
 * 2. 为这些 component 绑定响应的事件
 * @param {*} dom 所有 ui 节点的子容器
 * @param {*} config 关于 ui 的一些列设置
 * @return {Array} 所有子节点
 */

function createChild(plugin) {
  var childConfig = plugin.config.children = hundleChildren(plugin);
  var children = {};
  if (!childConfig) {
    children.play = new Play(plugin);
    children.progressTime = new ProgressTime(plugin);
    children.progressBar = new ProgressBar(plugin);
    children.volume = new Volume(plugin);
    children.screen = new Screen(plugin);
  } else {
    _Object$keys(childConfig).forEach(function (item) {
      switch (item) {
        case 'play':
          if (childConfig.play) {
            children.play = new Play(plugin, childConfig.play);
          }
          break;
        case 'progressTime':
          if (childConfig.progressTime) {
            children.progressTime = new ProgressTime(plugin, childConfig.progressTime);
          }
          break;
        case 'progressBar':
          children.progressBar = new ProgressBar(plugin, childConfig.progressBar);
          break;
        case 'volume':
          if (childConfig.volume) {
            children.volume = new Volume(plugin, childConfig.volume);
          }
          break;
        case 'screen':
          if (childConfig.screen) {
            children.screen = new Screen(plugin, childConfig.screen);
          }
          break;
        case 'clarity':
          if (childConfig.clarity && Array.isArray(childConfig.clarity.list)) {
            children.screen = new Clarity(plugin, childConfig.clarity);
          }
          break;
        default:
          children[item] = new Component(plugin, childConfig[item]);
          break;
      }
    });
  }

  return children;
}

/**
 * 插件默认配置
 */
var defaultConfig$1 = {};

var chimeeControl = {
  name: 'chimeeControl',
  el: 'chimee-control',
  data: {
    children: {}
  },
  level: 99,
  operable: false,
  penetrate: false,
  create: function create() {},
  init: function init(videoConfig) {
    if (videoConfig.controls === false) return;
    this.show = true;
    videoConfig.controls = false;
    var _this = this;
    applyDecorators(videoConfig, {
      controls: accessor({
        get: function get$$1() {
          return _this.show;
        },
        set: function set(value) {
          _this.show = Boolean(value);
          _this._display();
          return false;
        }
      }, { preSet: true })
    }, { self: true });
    this.config = isObject$1(this.$config) ? deepAssign(defaultConfig$1, this.$config) : defaultConfig$1;
    this.$dom.innerHTML = '<chimee-control-wrap></chimee-control-wrap>';
    this.$wrap = this.$dom.querySelector('chimee-control-wrap');
    this.children = createChild(this);
  },
  destroy: function destroy() {
    for (var i in this.children) {
      this.children[i].destroy();
    }
    this.$dom.parentNode.removeChild(this.$dom);
    window.clearTimeout(this.timeId);
  },
  inited: function inited() {
    for (var i in this.children) {
      this.children[i].inited && this.children[i].inited();
    }
  },

  events: {
    play: function play() {
      this.children.play && this.children.play.changeState('play');
      this._hideItself();
    },
    pause: function pause() {
      this.children.play && this.children.play.changeState('pause');
      this._showItself();
    },
    load: function load() {},
    c_mousemove: function c_mousemove() {
      this._mousemove();
    },
    durationchange: function durationchange() {
      this.children.progressTime && this.children.progressTime.updateTotal();
    },
    timeupdate: function timeupdate() {
      this._progressUpdate();
    },
    progress: function progress() {
      this.children.progressBar && this.children.progressBar.progress();
    },
    volumechange: function volumechange() {
      this.children.volume && this.children.volume.update();
    },
    keydown: function keydown(e) {
      e.stopPropagation();
      switch (e.keyCode) {
        case 32:
          {
            e.preventDefault();
            this.children.play && this.children.play.click(e);
            break;
          }
        case 37:
          {
            e.preventDefault();
            var reduceTime = this.currentTime - 10;
            this.currentTime = reduceTime < 0 ? 0 : reduceTime;
            this._mousemove();
            break;
          }
        case 39:
          {
            e.preventDefault();
            var raiseTime = this.currentTime + 10;
            this.currentTime = raiseTime > this.duration ? this.duration : raiseTime;
            this._mousemove();
            break;
          }
        case 38:
          {
            e.preventDefault();
            var raiseVolume = this.volume + 0.1;
            this.volume = raiseVolume > 1 ? 1 : raiseVolume;
            this._mousemove();
            break;
          }
        case 40:
          {
            e.preventDefault();
            var reduceVolume = this.volume - 0.1;
            this.volume = reduceVolume < 0 ? 0 : reduceVolume;
            this._mousemove();
            break;
          }
      }
    },
    click: function click(e) {
      this.children.play && this.children.play.click(e);
    },
    dblclick: function dblclick(e) {
      this.dblclick = true;
      this.children.screen && this.children.screen.click();
    }
  },
  methods: {
    _progressUpdate: function _progressUpdate() {
      this.children.progressBar && this.children.progressBar.update();
      this.children.progressTime && this.children.progressTime.updatePass();
    },
    _hideItself: function _hideItself() {
      var _this2 = this;

      window.clearTimeout(this.timeId);
      this.timeId = setTimeout(function () {
        var bottom = _this2.$wrap.offsetHeight;
        bottom = _this2.children.progressBar ? _this2.children.progressBar.$wrap[0].offsetTop - bottom : -bottom;
        setStyle(_this2.$wrap, {
          bottom: bottom
        });
        setStyle(_this2.$dom, {
          visibility: 'hidden'
        });
      }, 2000);
    },
    _showItself: function _showItself() {
      window.clearTimeout(this.timeId);
      setStyle(this.$wrap, {
        bottom: '0'
      });
      setStyle(this.$dom, {
        visibility: 'visible'
      });
    },
    _display: function _display() {
      var display = this.show ? 'table' : 'none';
      setStyle(this.$dom, {
        display: display
      });
    },
    _mousemove: function _mousemove(e) {
      if (this.paused) return;
      this._showItself();
      this._hideItself();
    }
  }
};

var chimeeHelper = ( index$3 && undefined ) || index$3;

function __$styleInject$2(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
  return returnValue;
}

function _interopDefault$1 (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _slicedToArray$1 = _interopDefault$1(slicedToArray);


__$styleInject$2("chimee-popup{position:absolute;color:#fff;background-color:rgba(88,88,88,.5);font-size:13px;font-family:sans-serif;border:1px solid hsla(0,0%,100%,.08);padding:3px}chimee-popup cm-pp-close{float:right;color:#fff;text-decoration:none;opacity:.8;line-height:14px;text-shadow:0 0 1px #000;font-size:15px;padding:0 3px;cursor:pointer}chimee-popup cm-pp-close:hover{opacity:1}chimee-popup cm-pp-body,chimee-popup cm-pp-head{display:block;padding:3px 3px 6px}chimee-popup cm-pp-head{font-weight:700;border-bottom:1px solid hsla(0,0%,100%,.18);padding:0 5px 4px;margin-bottom:5px}chimee-popup cm-pp-body{font-size:12px}", undefined);

/**
 * 生产一个popup插件配置
 * @param {Object} optons 针对popup扩展了定制化参数，另外也用来重写部分PluginConfig配置
 * @param {String} optons.name 插件名
 * @param {String} optons.tagName Popup DOM容器的tagName
 * @param {String} optons.className Popup DOM容器的className
 * @param {String} optons.title Popup 标题，当设置值为 false 则不渲染title对应DOM
 * @param {String} optons.body Popup 内容，当设置值为 false 则不渲染body对应DOM
 * @param {String} optons.html html 用于构架popup的模板，重写后上面的title、body无效
 * @param {String} optons.offset 设定相对播放器要展示的坐标位置，空格分割的坐标值：'X:left Y:top'||'top right bottom left', 具体的像素百分比值或者auto；实例化后可重写 popupplugin.offset('0 0 0 0')
 * @param {String} optons.offsetAttr offset对应的CSS属性key，默认'left top'、'top right bottom left'-当offset空格分割的参数值多余2个时，便于只设定个别或特定方向边距
 * @param {String} optons.translate 在offset基础上的偏移量，格式如："leftVal topVal"，当offset为50%这里没设定值，则默认偏移-50%；实例化后可重写 popupplugin.translate('0 0')
 * @param {String} optons.width 宽度值（需要带单位）；实例化后可重写 popupplugin.width('100px')
 * @param {String} optons.height 高度值（需要带单位）；实例化后可重写 popupplugin.height('100px')
 * @param {Boolean} optons.hide 初始状态是否设置为关闭，默认值 false
 * @param {Function} optons.opened 开启时执行
 * @param {Function} optons.closed 关闭时执行
 * @param {Boolean} optons.penetrate 是否将交互事件同步到video元素(点击当前popup同样实现video的暂停播放)，默认值 false
 * @param {Boolean} optons.operable 是否启用事件交互（false则设置CSS事件穿透），默认值 true
 * @return {PluginConfig}
 */
function popupFactory() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$tagName = _ref.tagName,
      tagName = _ref$tagName === undefined ? 'chimee-popup' : _ref$tagName,
      className = _ref.className,
      _ref$name = _ref.name,
      name = _ref$name === undefined ? 'popup' : _ref$name,
      html = _ref.html,
      _ref$title = _ref.title,
      title = _ref$title === undefined ? '这是一个信息框' : _ref$title,
      _ref$body = _ref.body,
      body = _ref$body === undefined ? '这里是信息内容' : _ref$body,
      _ref$offsetAttr = _ref.offsetAttr,
      offsetAttr = _ref$offsetAttr === undefined ? 'left top' : _ref$offsetAttr,
      _ref$offset = _ref.offset,
      offset = _ref$offset === undefined ? '50% 50%' : _ref$offset,
      _ref$translate = _ref.translate,
      translate = _ref$translate === undefined ? '' : _ref$translate,
      width = _ref.width,
      height = _ref.height,
      level = _ref.level,
      init = _ref.init,
      inited = _ref.inited,
      data = _ref.data,
      _create = _ref.create,
      _beforeCreate = _ref.beforeCreate,
      _destroy = _ref.destroy,
      events = _ref.events,
      computed = _ref.computed,
      _ref$methods = _ref.methods,
      methods = _ref$methods === undefined ? {} : _ref$methods,
      _ref$penetrate = _ref.penetrate,
      penetrate = _ref$penetrate === undefined ? false : _ref$penetrate,
      _ref$operable = _ref.operable,
      operable = _ref$operable === undefined ? true : _ref$operable,
      _ref$hide = _ref.hide,
      hide = _ref$hide === undefined ? false : _ref$hide,
      opened = _ref.opened,
      closed = _ref.closed,
      autoFocus = _ref.autoFocus;

  var defaultConfig = {
    html: html || '\n      <cm-pp-close>\xD7</cm-pp-close>\n      ' + (title !== false ? '<cm-pp-head>' + title + '</cm-pp-head>' : '') + '\n      ' + (body !== false ? '<cm-pp-body>' + body + '</cm-pp-body>' : '') + '\n    ',
    closeSelector: '._close'
  };

  return {
    name: name,
    el: tagName,
    className: className,
    beforeCreate: function beforeCreate() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          events = _ref2.events,
          methods = _ref2.methods;

      var option = arguments[1];

      if (chimeeHelper.isObject(option)) {
        chimeeHelper.isObject(option.events) && chimeeHelper.deepAssign(events, option.events);
        chimeeHelper.isObject(option.methods) && chimeeHelper.deepAssign(methods, option.methods);
      }
      _beforeCreate && _beforeCreate.apply(this, arguments);
    },
    create: function create() {

      var config = chimeeHelper.isObject(this.$config) ? chimeeHelper.deepAssign(defaultConfig, this.$config) : defaultConfig;
      var $dom = this.$domWrap = chimeeHelper.$(this.$dom).css('display', 'none');

      $dom.html(config.html).delegate('cm-pp-close, ' + config.closeSelector, 'click', this.close);

      this.width(width).height(height).offset(offset).translate(translate);

      this._hide = hide;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _create && _create.apply(this, args);
      !this._hide && this.open();
    },
    destroy: function destroy() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      _destroy && _destroy.apply(this, args);
      this.$domWrap.undelegate(this.$config.closeSelector, 'click', this.close).remove();
    },

    level: level,
    init: init,
    inited: inited,
    data: data,
    events: events,
    computed: computed,
    penetrate: penetrate,
    operable: operable,
    autoFocus: autoFocus,
    methods: chimeeHelper.deepAssign({
      open: function open() {
        if (this.destroyed) return this;
        this.$domWrap.css('display', 'block');
        this._hide = false;

        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        this.$emit('popupOpen', args, this);
        chimeeHelper.isFunction(opened) && opened.apply(this, args);
        return this;
      },
      close: function close() {
        if (this.destroyed) return this;
        this.$domWrap.css('display', 'none');
        this._hide = true;

        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        this.$emit('popupClose', args, this);
        chimeeHelper.isFunction(closed) && closed.apply(this, args);
        return this;
      },
      width: function width(_width) {
        _width && this.$domWrap.css('width', _width);
        return this;
      },
      height: function height(_height) {
        _height && this.$domWrap.css('height', _height);
        return this;
      },
      offset: function offset(vals) {
        var trblArr = ('' + (vals || '')).split(' ');
        var cssObj = {};
        if (trblArr.length > 2) {
          ['top', 'right', 'bottom', 'left'].forEach(function (dir, i) {
            if (trblArr[i] && trblArr[i] !== 'auto') {
              cssObj[dir] = trblArr[i];
            }
          });
          this.$domWrap.css(cssObj);
          return this;
        }

        var _trblArr = _slicedToArray$1(trblArr, 2),
            left = _trblArr[0],
            _top = _trblArr[1];

        if (left === '') {
          return this;
        }
        var top = _top || left;
        var xyAttr = offsetAttr.split(' ');
        cssObj[xyAttr[0]] = left;
        cssObj[xyAttr[1]] = top;
        this.$domWrap.css(cssObj);

        var translateXY = [];
        if (left === '50%') {
          translateXY.push('-50%');
        }
        if (top === '50%') {
          translateXY.push('-50%');
        }
        translateXY.length > 0 && this.translate(translateXY.join(' '));
        return this;
      },
      translate: function translate(xy) {
        var _$split = ('' + (xy || '')).split(' '),
            _$split2 = _slicedToArray$1(_$split, 2),
            x = _$split2[0],
            y = _$split2[1];

        x && this.$domWrap.css('transform', 'translate(' + x + ', ' + (y || x) + ')');
        return this;
      }
    }, methods)
  };
}

var index$4 = popupFactory;

__$styleInject("#wrapper{width:768px;height:432px}container,video{display:block;width:100%;height:100%;background:#000}container{position:relative}chimee-center-state{position:absolute}chimee-center-state-correct,chimee-center-state-error,chimee-center-state-loading,chimee-center-state-tip{display:none}chimee-center-state.correct chimee-center-state-correct,chimee-center-state.error chimee-center-state-error,chimee-center-state.loading chimee-center-state-loading,chimee-center-state.tip chimee-center-state-tip{display:inline-block}chimee-center-state-correct{width:56px;height:56px}chimee-center-state-tip{position:absolute;left:0;bottom:0;width:56px;height:56px;border-radius:28px;background:rgba(0,0,0,.5)}chimee-center-state.play span{background-image:url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzNXB4IiB2aWV3Qm94PSIwIDAgMzIgMzUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ1LjIgKDQzNTE0KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuaSreaUvm5vcm1hbCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQuMDAwMDAwLCAtMy4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPHBhdGggZD0iTTM1LDE3IEwxMyw0IEwxMyw0IEMxMi42MDMxMjczLDMuNzAxNzMxMjUgMTAuOTE0NzQ0NiwzIDksMyBDNi4wMTA5MjE3NiwzIDQsNS4wODAwOTE3MiA0LDggTDQsMzQgTDQsMzQgQzQuNjA0MzgzMzQsMzUuNjQ4NzM4OCA2LjE4MDYzMjA3LDM4IDksMzggQzEwLjAxMjk3NjksMzggMTAuOTY5NzQ5NSwzNy43NDg3NTQ1IDEyLDM3IEwzNCwyNSBMMzQsMjUgQzM1LjM0Njk5MTIsMjMuNjY2NTE0NCAzNi45NTU2NjE2LDIxLjAwMDUyMSAzNSwxOCBMMzUsMTciPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==\")}chimee-center-state.pause span{background-image:url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjhweCIgaGVpZ2h0PSIzNHB4IiB2aWV3Qm94PSIwIDAgMjggMzQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ1LjIgKDQzNTE0KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuaaguWBnG5vcm1hbCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTYuMDAwMDAwLCAtMy4wMDAwMDApIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLTQiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PC9yZWN0PgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTYsNy4wMDAyMTIzNiBDNiw0Ljc5MDk1NjA4IDcuNzk1MzU2MTUsMyAxMCwzIEMxMi4yMDkxMzksMyAxNCw0Ljc5MjAzMTkzIDE0LDcuMDAwMjEyMzYgTDE0LDMyLjk5OTc4NzYgQzE0LDM1LjIwOTA0MzkgMTIuMjA0NjQzOCwzNyAxMCwzNyBDNy43OTA4NjEsMzcgNiwzNS4yMDc5NjgxIDYsMzIuOTk5Nzg3NiBMNiw3LjAwMDIxMjM2IFogTTI2LDcuMDAwMjEyMzYgQzI2LDQuNzkwOTU2MDggMjcuNzk1MzU2MiwzIDMwLDMgQzMyLjIwOTEzOSwzIDM0LDQuNzkyMDMxOTMgMzQsNy4wMDAyMTIzNiBMMzQsMzIuOTk5Nzg3NiBDMzQsMzUuMjA5MDQzOSAzMi4yMDQ2NDM4LDM3IDMwLDM3IEMyNy43OTA4NjEsMzcgMjYsMzUuMjA3OTY4MSAyNiwzMi45OTk3ODc2IEwyNiw3LjAwMDIxMjM2IFoiIGlkPSLmmoLlgZwiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+\")}chimee-center-state-tip span{display:inline-block;width:24px;height:24px;margin:16px}chimee-center-state-loading,chimee-center-state-tip span{background-origin:content-box;background-size:auto 100%;background-repeat:no-repeat;background-position:50%}chimee-center-state-loading{width:52px;height:52px;background-image:url(\"data:image/gif;base64,R0lGODlhPAA8APcAAAAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTlhYWGpqaoeHh56enra2tsjIyNbW1t7e3uPj4+Xl5ebm5ufn5+fn5+fn5+fn5+jo6Ojo6Ojo6Ojo6Ojo6Ojo6Onp6enp6enp6erq6urq6uvr6+vr6+zs7Ozs7Ozs7O3t7e3t7e7u7u7u7u/v7/Dw8PDw8PHx8fHx8fHx8fHx8fLy8vLy8vLy8vPz8/Pz8/Pz8/T09PT09PX19fb29vb29vf39/j4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fn5+fn5+fr6+vr6+vr6+vr6+vr6+vv7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJAwDBACwAAAAAPAA8AAAI7gCDCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDVmzlkijDTiyRNlSqkunCSUZRtrr0sJBKqw8TRS3ZylFEQijBRkzktaSjRBP5OAXZKU/FOiThVmwrMs9aiY7cfswzKeMkOVsxdoLTV+Pgwhgnwbl7sRWcPIEjtsoDGKSgNH8o/kkjaGQrPmnyoG2YKE8aPic7/VnjBc4fQYkutWo1KZGgP3C8rPnDmOSlP27OeBlO/IybP1Rldpo0qbfQ59B3BgQAIfkECQMA4AAsAAAAADwAPACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoaWlpampqa2trbGxsbW1tbm5ub29vfn5+kZGRrq6uw8PD0tLS29vb4ODg5OTk5eXl5ubm5+fn5+fn5+fn5+fn6Ojo6Ojo6Ojo6Ojo6enp6enp6enp6urq6urq6urq6+vr6+vr7Ozs7e3t7e3t7u7u7u7u7+/v7+/v7+/v7+/v8PDw8PDw8PDw8fHx8vLy8vLy8/Pz8/Pz9PT09PT09PT09fX19fX19fX19vb29/f39/f39/f39/f3+Pj4+Pj4+Pj4+Pj4+fn5+fn5+fn5+fn5+vr6+vr6+vr6+vr6+vr6+/v7+/v7+/v7+/v7+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/f39/f39/f39/f39/f39/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////COUAwQkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+ociWunq52zgO7sqTOoTlVDf+00tXSnKqU6PakkBtEU0ZNUIWZCCRViKKYliWWNOOmqSKQTiTUaCzKURVePRLq9uGkS242bulrMpEgvRmKWzF4UhehnxlmX7mJ0VWiS34jENkn9SCyToK0SIz8yGvLXI0GTwDI0NWkR2pK4NinyMykU54G4SCO6ZFjlL0+PEPnZvVuQIkunY+JyJXin8ePILQYEACH5BAkDAM4ALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqanp6eo6Ojp6enrOzs8LCwszMzNXV1dvb2+Dg4OPj4+Xl5efn5+jo6Ojo6Onp6enp6erq6urq6urq6urq6urq6urq6uvr6+vr6+vr6+zs7Ozs7Ozs7O3t7e3t7e7u7u7u7u7u7u7u7u/v7+/v7/Dw8PDw8PHx8fHx8fLy8vLy8vLy8vPz8/Pz8/Pz8/Pz8/T09PT09PT09PX19fX19fb29vb29vb29vf39/f39/j4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fn5+fn5+fn5+fr6+vr6+vr6+vv7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wjoAJ0JHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmz5sNeNgvSyklwJ0+BuH4CFerM589VREklXSq0E1FNRFchFWqJaCSin5QKTUTU0tSTxCASI4QybERNV4Ue0jrSaMRee3CK/DrxEyG5H3GZrTgpUFCPey9qyuM241+Nn+5AzUiscMZYgQLRnYgLr8dJdxodhig18EfIdwhpspxwlaZOnudGyhM6UqdVf3Gt+mQpUaNOpE+SsvToUKA7d/YcemSJVGqiyJMrX94wIAAh+QQJAwDfACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqamp6enqIiIiVlZWgoKCurq68vLzGxsbS0tLZ2dnf39/i4uLk5OTm5ubn5+fo6Ojo6Ojp6enp6enp6enq6urq6urq6urr6+vr6+vr6+vr6+vs7Ozs7Ozt7e3t7e3t7e3t7e3u7u7u7u7v7+/v7+/v7+/v7+/w8PDw8PDw8PDx8fHx8fHx8fHy8vLy8vLy8vLz8/Pz8/P09PT09PT09PT09PT09PT19fX19fX19fX19fX29vb29vb29vb29vb39/f39/f39/f4+Pj4+Pj4+Pj5+fn5+fn6+vr6+vr6+vr6+vr7+/v7+/v7+/v7+/v7+/v8/Pz8/Pz8/Pz9/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v79/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I5AC/CRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlxR/wVwoc6ZNiTVvGuylc2fOngJrAS0odOjAV0YHpkoqsBTTX0uT/nIqlRPTb5GuNrpKiWfSUlGN1qJ01c/VSFTFBrq6CGnSV4W0anrqx63RV35+AqVUSG/PRoG8Gm3kR1dHwRkj7Ql78ZfhjpzyLHpcMRblw43yWJ3IqhTij6z87InEyiHUUJ9FvqLkR/KlUrH0xkqVyq7KWKEoHQq0JxClUKFSpb5KvLjx4w4DAgAh+QQJAwDcACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhxcXGAgICOjo6fn5+tra24uLjCwsLLy8vV1dXe3t7j4+Pm5ubn5+fo6Ojp6enq6urq6urq6urr6+vr6+vr6+vr6+vs7Ozs7Ozs7Ozs7Ozt7e3t7e3t7e3u7u7u7u7u7u7u7u7v7+/v7+/v7+/w8PDw8PDw8PDx8fHx8fHx8fHy8vLy8vLy8vLy8vLz8/Pz8/Pz8/Pz8/P09PT09PT09PT19fX19fX19fX29vb29vb29vb39/f39/f39/f4+Pj4+Pj5+fn5+fn5+fn6+vr6+vr6+vr6+vr7+/v7+/v7+/v8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I8AC5CRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhB/koZERZLiKxWvmz4y+XMhqxuNoQlU6fCVD4X6rIZFCGpogqPIj3IatbSg56eHtwk1eClqgR/XcUqEBZVrtxYfeXKahJYbrAgndWl6Cy3PW7x6DrbSClXT2rBzrLTE6uhsVhP4YlrF+smuGB/7cnLFZYdoGA3yT1raM9csIos08XjFGyjO6HOksIzqDPWX5PsXLocsW/IWZPuKDr1UJdrkqQG4YEUiujAWalSNb35i1WoS40ubSLFPKfb59CjS6cYEAAh+QQJAwDmACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb293d3d/f3+NjY2enp6wsLC+vr7IyMjS0tLa2trg4ODk5OTm5ubo6Ojo6Ojp6enp6enq6urq6urr6+vr6+vs7Ozt7e3t7e3t7e3t7e3t7e3u7u7u7u7u7u7u7u7u7u7u7u7v7+/v7+/v7+/w8PDw8PDx8fHx8fHy8vLy8vLy8vLy8vLz8/Pz8/Pz8/Pz8/P09PT09PT19fX19fX19fX29vb29vb29vb29vb39/f39/f39/f39/f39/f39/f39/f4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj5+fn5+fn5+fn5+fn5+fn6+vr5+fn5+fn6+vr6+vr6+vr7+/v7+/v7+/v8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f39/f39/f38/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz9/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////8I7gDNCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJMiG3kihTDlSmUuKwlhF1wYQIjOXMhtxk3myIamfDWjZ9KiQldOGwV0UVfkpqchNThKiQPjVY6eTUgpCuFlSWVevAWpO8Dnx1SaxAVE7NkiqrNqzZWoTMmuPGR645QDrFKiJq9pIiubr4BPUqKK1YUoDs+umpFpBVvW7FKvMj9bAfYHIv+XnZFxBnsZs8y0XMV7IiRYO1ogJ0KfVUbqQITcLskJvrkbomQdr06rYyYLpo3xyG9hOpV7VqBX9st7nz59AjBgQAIfkECQMA3wAsAAAAADwAPACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoaWlpampqa2trbGxsbW1tfX19i4uLmJiYp6entLS0wcHBy8vL0tLS2dnZ4ODg5eXl5+fn6Ojo6enp6urq6urq6urq6+vr6+vr6+vr6+vr6+vr7Ozs7Ozs7Ozs7Ozs7Ozs7e3t7e3t7e3t7u7u7+/v7+/v8PDw8PDw8fHx8fHx8vLy8vLy8vLy8/Pz8/Pz8/Pz8/Pz9PT09PT09PT09fX19fX19fX19fX19fX19vb29vb29vb29/f39/f39/f3+Pj4+Pj4+Pj4+fn5+fn5+fn5+fn5+fn5+vr6+vr6+vr6+vr6+vr6+/v7+/v7+/v7+/v7/Pz8/Pz8/Pz8/Pz8/f39/f39/f39/f39/f39/f39/f39/f39/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CO4AvwkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48EixUDibFXL5IlUV48qdJirZYWV8GsiGomRVE2J6LKlTNiLU09IRZjFBSiplJFHxJK6rATUKYM/4yEqnBVI6oLLXXCqjARLK4J94BFCCvR2IOiHp01qCnS2oKWJr0laEntXIGdiN79JsrsXlhi9xbTw3PvH5x7I+m9C4vw3m9/LD3uxOfxYMR3Le2ZepeQ27259HzdW0rqY1GEOM/t+5jv4rurGL0UPEnuY1iRMN/tJaqU6rmwasEaffB30mKrVrE03rq58+fQIwYEACH5BAkDANkALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWWNjY2xsbHx8fIuLi5eXl6KiorCwsL6+vsnJydLS0tnZ2d7e3uLi4uTk5Obm5ufn5+jo6Onp6enp6erq6urq6urq6urq6urq6uvr6+vr6+vr6+zs7Ozs7Ozs7Ozs7Ozs7O3t7e3t7e3t7e3t7e7u7u7u7u/v7+/v7/Dw8PDw8PDw8PDw8PHx8fHx8fHx8fLy8vLy8vPz8/Pz8/Pz8/T09PT09PT09PT09PT09PX19fX19fX19fb29vb29vf39/f39/f39/f39/j4+Pj4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fr6+vr6+vr6+vr6+vr6+vr6+vv7+/v7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wjxALMJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mix40Fir4h5zKgq5EiMpEKdxPgKk62VFzmphGnRkSqaFW0Zeolz4itBIntKJKYnqNCIgEgdlThp0dKItto8jZho0tSHxKRedVh1a8OsXhti8hOWoSFHZRe2UZoW4Ss1RtsW5FRHLkJMeuwenERWb0FHgPwWTCRIMEFHfQ1nw6RVsSo1PA0TU3NTcTY5Vi0bymv5cWTDejIrxmtZYB22juWUzpYIrWVicj4LVpVYManApUMVzp1ota1Er1Zb4uSbU+XXoY5bfmVLtuTV0KNLn94xIAAh+QQJAwDVACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlycnJ6enqJiYmbm5upqam2trbAwMDKysrS0tLX19fd3d3i4uLk5OTm5ubn5+fo6Ojo6Ojp6enq6urq6urq6urq6urr6+vr6+vs7Ozs7Ozs7Ozt7e3t7e3u7u7u7u7v7+/v7+/v7+/v7+/v7+/v7+/w8PDw8PDw8PDw8PDx8fHx8fHy8vLy8vLz8/Pz8/Pz8/Pz8/Pz8/P09PT09PT09PT19fX19fX19fX29vb29vb29vb29vb29vb39/f39/f39/f39/f4+Pj4+Pj4+Pj4+Pj5+fn5+fn5+fn5+fn6+vr6+vr6+vr6+vr7+/v7+/v7+/v8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gCrCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatyo8NYpTqdmAeNIEdktXciQkbyI7NWtkSsxfhIVM6OoSTBrVkR26JTOi7oEzfppcZUgXUQrvuKTM2lEXXuGOpWIDJDPqRITTcIq8dUelVwhCvoUFuKqr2UfAuKU1uGsPE3bJuQkSG7DQ5fsLkSWR6pehF7/KjwFSHBCUXUNH+R0SPHBS48cG+SUSHLBU4ktC5zFR/NAvmA970HquVqiVaWrrYqcunPqSahL62Jd+hJpz8hoez51tfSk0J4rpa6GjG1qYDSPx069Kq7lWX5xnxxebfpwYCmpa9/Ovbt3igEBACH5BAkDAMAALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1lZWWNjY21tbXZ2doWFhZiYmKenp7S0tMHBwcrKytLS0tra2t/f3+Pj4+Xl5efn5+jo6Ojo6Onp6enp6enp6erq6urq6urq6uvr6+vr6+vr6+zs7Ozs7O3t7e7u7u/v7+/v7/Dw8PDw8PHx8fHx8fHx8fLy8vLy8vLy8vLy8vLy8vPz8/Pz8/Pz8/Pz8/T09PT09PT09PT09PT09PX19fX19fX19fX19fX19fb29vb29vb29vb29vf39/f39/f39/f39/f39/f39/j4+Pj4+Pj4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fn5+fr6+vr6+vr6+vv7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wjsAIEJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3KgQVCJCnThaVDUpk6paBmvVOimyoao9hDK1xKjKzhxVMy/WsvOGVM6LoMok+nkxU5mQRCsmWoMzKUWjKJ1OJCUGlNSJtco0ujoxjh2uEoOCldiG0FiIk8SchYjmz1qHpMA0fbuQ0Bq6Dd3swbuwFhikfBF2AhNYYdrCCZciRkjozeKDf74+LthozuSCnRxfHqjq7uaBZT4PbCNaYMzSqiyXdlMa2GnRO1snslpatehOk2TP/Ty09dbStWijbg0sKvHjyJMrX868uXPmAQEAIfkECQMA7gAsAAAAADwAPACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoaWlpampqa2trbGxsbW1tbm5ub29vcHBwcXFxeXl5gYGBiIiIj4+Pm5ubpqamsrKyvb29x8fH0NDQ1tbW29vb39/f4uLi5OTk5ubm5+fn5+fn5+fn6Ojo6Ojo6Ojo6Ojo6enp6enp6urq6urq6+vr6+vr6+vr7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7e3t7e3t7e3t7e3t7u7u7u7u7u7u7+/v7+/v7+/v7+/v8PDw8PDw8fHx8fHx8vLy8vLy8/Pz8/Pz9PT09PT09PT09PT09fX19fX19fX19fX19fX19vb29vb29vb29/f39/f39/f39/f39/f39/f3+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+vr6+vr6+vr6+vr6+vr6+vr6+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/f39/f39/f39/f39/f39/f39/f39/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////CP4A3QkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rciFBbMFmpZO2CxrFisFataimDBu6cO3DKdinTpq1kQ2WhUilzqA0aSZsGg1nqBG4iuKJA3Wmz1CjYRZc2gyUKlRTjqUKtql4clWin1oqtCv38OnFXoV1kKULDmpbi0LZlCyGFC7HRKboRZSWCitchpKx9HZ4rxDfwwlqaDDsMBVjxwkQ1HSs8t0jyQmWWLCvcRVUzwlqlPCPcdVe0QWWlTRPUFlp1wc6uB8KO7a41bXcybwtMpdsdb9215tKW1XtX4dhodWsTHnvs7ci6mbs+d7y39evYs2vfzr279++3AwECACH5BAkDAO0ALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubnZ2dn5+foaGhpOTk5+fn62trbi4uMLCwszMzNTU1Nvb2+Dg4OPj4+Xl5efn5+jo6Ojo6Ojo6Onp6enp6enp6enp6enp6enp6erq6urq6uvr6+vr6+zs7O3t7e3t7e7u7u7u7u/v7+/v7+/v7/Dw8PDw8PDw8PHx8fHx8fHx8fLy8vLy8vLy8vPz8/Pz8/Pz8/T09PT09PX19fX19fX19fX19fX19fX19fX19fb29vb29vb29vf39/f39/f39/f39/j4+Pj4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fn5+fr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vv7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////wjyANsJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3GhwGq1VqD5x+rQKGMeJ41ZZSpRoUqhVuKa1G6eMFi5l08adXDjuU6BJq2QypKlsZ8dMP4uiNCqQVlKmF0MFogX1oqVDJqtWzJRIqNaJqAIp/SrxVaCsZCOOC/Qq7cRMmdxKVBZIp1yIkD7dhYjr0F6ImUL9fXjI7uCFuBwdbsgJ1WKGjgw/Rghp8sLKlhNOyoxQGSfOB6cJBm1wNGmCpk8LTK2a9WnXpIGhVd2uLe2mtwUqk6x6tuqcuduNpc37d/CZx5MrX868ufPn0KNLn059Z0AAIfkECQMA6gAsAAAAADwAPACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoaWlpeXl5h4eHlJSUn5+fqampsrKyurq6w8PDzMzM09PT2dnZ39/f4+Pj5eXl5+fn5+fn6Ojo6Ojo6enp6enp6enp6urq6urq6urq6+vr6+vr7Ozs7Ozs7e3t7e3t7u7u7u7u7+/v7+/v7+/v8PDw8PDw8PDw8PDw8PDw8PDw8fHx8fHx8fHx8fHx8fHx8fHx8vLy8vLy8vLy8vLy8/Pz8/Pz8/Pz8/Pz9PT09PT09PT09PT09PT09fX19fX19fX19vb29vb29vb29vb29vb29/f39/f3+Pj4+Pj4+Pj4+Pj4+fn5+fn5+fn5+fn5+fn5+fn5+vr6+vr6+vr6+/v7+/v7+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/f39/f39/f39/f39/f39/f39/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////CPEA1QkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcaBCYq06TFCFqlCmUq14cIy4zhYiPHkGZUtEqpq5YL1ihSMJKubBYJ5eKXNFcqCtUqqE8By7L9NLUMom6dCUV2EsQIVoXez1NmUpPJo3LtmoMxWfn1Iuu+AA7e5EWH5RTxU7sxUcqW7kRr7K9aOrr3orLBOH9CzGTK8IUlxlCTFEm44mKHkssNklyRMeWH/rN7LAT54ehPjtMJboh6dILzaJOqHr1QbuuD8KN3ZH2QaS2leY2ONh2b9q/dwsfTry48ePIkytfzry58+fQo0ufzjEgACH5BAkDAOEALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e4KCgomJiZCQkJycnKamprKysr+/v8nJydLS0tjY2N3d3eDg4OTk5OXl5efn5+fn5+jo6Ojo6Ojo6Onp6enp6enp6enp6erq6urq6urq6urq6urq6uvr6+vr6+vr6+vr6+zs7Ozs7Ozs7O3t7e3t7e3t7e3t7e7u7u7u7u7u7u7u7u7u7u/v7+/v7+/v7/Dw8PDw8PDw8PHx8fHx8fHx8fLy8vLy8vPz8/Pz8/Pz8/Pz8/T09PT09PT09PT09PT09PX19fX19fX19fX19fX19fb29vb29vf39/f39/f39/j4+Pj4+Pj4+Pn5+fn5+fn5+fr6+vr6+vr6+vr6+vr6+vv7+/v7+/v7+/z8/Pz8/Pz8/Pz8/P39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v////////////////////7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////wj+AMMJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3FgQGy9UnDA9YoRp1Cxj2DhG3MYLEyNGo27xGmYsWbJhs1CNcmVM5UJssx49msWMIctPror6LHiL0SRe2yIyW7Uq6lJsnx4Fs0gN1TCfxh5VzRjsFsdgk5JxpMZLozFMKVV6xMgM7tJw27ZWjIaJ2t2BSidiCvx3W9yIwVz9LehXIieriwc2fsirZ2SC2yA3VHy548NoljtPNCuaYtvSEqNNRv2QMGuHrl8zjC1bIe3aCKPhdnh4t0LNvhECD25wOHHMxxMaT868ufPn0KNLn069uvXr2LNr3869u/fv4MMDUw8IACH5BAkDAPMALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiZWVlaCgoKmpqbGxsb6+vsjIyNDQ0NbW1tzc3ODg4OPj4+Xl5ebm5ufn5+jo6Onp6enp6enp6enp6enp6erq6urq6urq6urq6uvr6+vr6+vr6+zs7Ozs7Ozs7O3t7e3t7e3t7e3t7e7u7u7u7u7u7u/v7+/v7+/v7+/v7/Dw8PDw8PHx8fHx8fHx8fLy8vLy8vPz8/Pz8/Pz8/Pz8/Pz8/T09PT09PT09PX19fX19fX19fb29vb29vb29vf39/f39/j4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fn5+fr6+vr6+vr6+vv7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////wj+AOcJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3GhQGzJcqERhyuSp1Ktf0dBxhBhtFsmT0WJGQyZMF6tMmF5FW6kQnTBRoop9Y4hNlydRv1TyJIgsUylkEpGxEoVt6Tx0szwps1itVDGe1TzNUnrx1yyO0bRy1IZLIzZRQ1ei04VRWyltVtH9uogKr9WrOynqqvpXILq4EbXRLTyQcMSzjAkGfhitWmSC3xA3hHqZoN+G6Cx3Hqh54dbRmB1ORj2vNMJvZFlfZegadezXsiPWzp3wNu+evx36Dk68uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fvxAMBAgAh+QQJAwDmACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enqBgYGOjo6jo6O0tLTAwMDKysrR0dHZ2dnh4eHk5OTm5ubo6Ojo6Ojp6enp6enp6enp6enq6urq6urq6urq6urq6urq6urr6+vr6+vr6+vr6+vs7Ozs7Ozt7e3t7e3t7e3u7u7u7u7u7u7u7u7v7+/w8PDw8PDw8PDx8fHx8fHx8fHx8fHy8vLz8/Pz8/P09PT09PT09PT19fX29vb29vb39/f39/f39/f4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj5+fn5+fn5+fn5+fn5+fn5+fn6+vr6+vr6+vr7+/v7+/v7+/v8/Pz8/Pz8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////8I/gDNCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatxYEJsuVZ8sMUJkSBKmU7CMcYyo65MhRJtQtYKlq+bHTyNBAVupEJsqSYxQDWO4rBUjSa2w8Sw4TNKmWRJhWUIEa6nAVpZ2VpzFCJTSlaBUZcQGipFWjadUbuSqSyOqrxyNSRp6URXclXKXWZx1l6cxTBWN9V0KTOxEulYJolILsW1ig6MiLtP7uCCwsw0ZVyZY9SHlzQR1DUb4GTRBqA1LmxboeOFo09hUH3xtWvZqh7ZvE9UtkTZvhL5/GwwuvLjx48iTK1/OvLnz59CjS59Ovbr169iza9/Ovbv37+CbAgcEACH5BAkDAOsALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e4KCgo+Pj5+fn62trbe3t8PDw8vLy9PT09ra2t/f3+Li4uXl5ebm5ufn5+jo6Ojo6Ojo6Ojo6Ojo6Onp6enp6enp6enp6erq6urq6urq6urq6uvr6+vr6+zs7O3t7e3t7e7u7u7u7u7u7u/v7+/v7+/v7/Dw8PDw8PDw8PHx8fHx8fLy8vLy8vPz8/Pz8/Pz8/Pz8/T09PT09PX19fX19fX19fb29vb29vb29vf39/f39/f39/f39/f39/j4+Pj4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fn5+fn5+fn5+fr6+vr6+vr6+vr6+vr6+vv7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////wj+ANcJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Hhwmq5UnC4penQp06dX0zhG1FWK06dUtX790lXrFUhFii69CqdSYbFSmnYyLJbq0aNUKXsSDCeqVLGI4V5NUtRKqcBan5pZlPVIU1KOrWRlZPpIF0eUHH9NEptRqMppl8xelMVTKdynFfFaXdfskjKK0+ruXVfsEuDBBEvVkqgV8cBwmSIGdkywJsSvlAWWgig48zpdfz1PrCpa4qvSjBujfqh3dcPWrhfCjp1wNu2DoW8rVK0bYefeBn8DXzrcd/GDwo8nH778uPPn0KNLn069uvXr2LNr3869u/fv4LsCBwQAIfkECQMA+wAsAAAAADwAPACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoaWlpampqa2trbGxsbW1tbm5ub29vcHBwcXFxcnJyc3NzdHR0dXV1dnZ2d3d3eHh4eXl5enp6e3t7fHx8fX19fn5+f39/gICAgYGBgoKCg4ODhISEhYWFhoaGh4eHiIiIjo6OlZWVm5ubpaWltbW1wcHBysrK0dHR1tbW2tra3d3d4eHh4+Pj5eXl5ubm5+fn6Ojo6Ojo6Ojo6enp6enp6enp6enp6enp6urq6urq6urq6+vr6+vr7Ozs7e3t7u7u7u7u7+/v7+/v8PDw8PDw8fHx8vLy8vLy8vLy8/Pz8/Pz8/Pz9PT09PT09PT09fX19fX19fX19vb29vb29vb29vb29vb29vb29/f39/f39/f3+Pj4+Pj4+Pj4+Pj4+Pj4+fn5+fn5+fn5+fn5+fn5+fn5+vr6+vr6+vr6+vr6+vr6+/v7+/v7+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/f39/f39/f39/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////////////CPAA9wkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rceJBasFqvWKFS5UpWsGscJRILWYsYtW77uiXb9YpUJk6ocIFLqbDbLlzPGPpUdVMWTJ4FnwWNCA6XzVc7kXajdjGZKVJUU4KLivFVpl1INxLjVCusRmqcgmHkyvMZp6UU2SJ9FgqlWYxW72Z8hUvvRXCk5PqNGOzVYIunDlckplbxRFWOJ7oSHHnhzMoRDWN+KGvzw7KeG4INzXA0aYWNTydMploh3NYGs8I2aHd2waO2CVKGvZt37oK9fwsfTry48ePIkytfzry58+fQo0v/HRAAIfkECQMA+gAsAAAAADwAPACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoaWlpampqa2trbGxsbW1tbm5ub29vcHBwcXFxcnJyc3NzdHR0dXV1dnZ2d3d3eHh4eXl5enp6e3t7fHx8fX19fn5+f39/gICAgYGBgoKCg4ODhISEhYWFhoaGh4eHiIiIiYmJj4+PlpaWnJycoaGhp6ens7Ozvb29yMjI0dHR2NjY3d3d4uLi5eXl5ubm5+fn6Ojo6Ojo6Ojo6enp6enp6enp6enp6enp6enp6urq6urq6+vr6+vr7Ozs7e3t7u7u7u7u7u7u7u7u7u7u7+/v7+/v8PDw8PDw8fHx8fHx8vLy8vLy8/Pz8/Pz8/Pz9PT09PT09PT09PT09PT09PT09fX19fX19fX19vb29vb29vb29vb29/f39/f39/f3+Pj4+Pj4+Pj4+Pj4+fn5+fn5+fn5+vr6+vr6+/v7+/v7/Pz8/Pz8/Pz8/Pz8/f39/f39/f39/f39/f39/f39/f39/f39/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////////////////CPMA9QkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcmDBaMVy1cAUrxuwaR4nfrk17xmyawGvPivl6RYpUrGLfTi6cNi0nw2vFWnHC5VMnwaIRo73iVMuk0YxKOTF7qpEZJ19UoYqKlRXjNVKzul6cximYWIvRpJ6tiIwT0rUQY4WFK/EaJ6d0IeJqlVeiqGd9IfqaG7jhNVGFH56Klrihr1qNf6KKzJAvZYWWLyN8pTlh084HfeEFPRAXaYNYTxNMrVog69avT0dj3FpfsdoCp9b+5rI27dYpcfcG/pb0cNWjcStfzry58+fQo0ufTr36w4AAIfkECQMA9QAsAAAAADwAPACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoaWlpampqa2trbGxsbW1tbm5ub29vcHBwcXFxcnJyc3NzdHR0dXV1dnZ2d3d3eHh4eXl5enp6e3t7fHx8fX19fn5+f39/gICAgYGBgoKCg4ODhISEi4uLkZGRl5eXnZ2do6OjqKiosbGxuLi4wcHBycnJ0NDQ1tbW29vb39/f4uLi5OTk5ubm5+fn5+fn5+fn6Ojo6Ojo6Ojo6enp6enp6urq6urq6+vr7Ozs7Ozs7e3t7u7u7+/v7+/v7+/v7+/v8PDw8PDw8PDw8fHx8fHx8fHx8vLy8vLy8/Pz8/Pz8/Pz9PT09PT09PT09PT09PT09fX19fX19vb29vb29vb29vb29/f39/f39/f39/f3+Pj4+Pj4+Pj4+Pj4+Pj4+fn5+fn5+fn5+fn5+fn5+vr6+vr6+vr6+vr6+/v7+/v7+/v7+/v7+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/f39/f39/f39/f39/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////////////////////////////////////CP4A6wkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcmDDasF20diGzxrGiNWvNhjXjVg8ct2jNfuXKhaxkw2jRSDZsRitVNJsHuemMyK0UqZpABYK7iAzUqKFJL5bihDTqxVyZaFnFiIzTq60Xo2XaBdbisExVy0qkxemn2omlRr2dyC3TsLkSX4HCGxEcp198IeaSG9ghuExLCzckBVgxw1ypHDO05kkyQ06JLSMc5VbzwVRpPRNkdVe0wVilTROM1Ux1wVdQXUd2TXA2bYFfb9dLqbue1t6/b3NLTZusbnDEXTcW3pl2c9fPVbM83rt65urYs2vfzr279++KAwECACH5BAkDAOMALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+foWFhZKSkp2dnaioqLS0tL6+vsnJydPT09vb2+Hh4eTk5Obm5ufn5+jo6Ojo6Onp6enp6enp6enp6erq6urq6urq6urq6urq6urq6uvr6+vr6+zs7Ozs7O3t7e7u7u7u7u/v7+/v7+/v7/Dw8PDw8PHx8fHx8fHx8fHx8fLy8vLy8vPz8/Pz8/Pz8/T09PT09PX19fX19fX19fb29vb29vb29vb29vb29vf39/f39/f39/f39/j4+Pj4+Pj4+Pn5+fn5+fn5+fr6+vr6+vr6+vr6+vv7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////wjuAMcJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Kgw2CtZxTherAatWjWDJH3tgiaypa9Xqli23AiNFCqZMzMi+6TqZM6MsiSF/IkxmCRfRDEi0yQr6UhMSJ1WLOYImdSKtzD5vCoRFSmuFIWClfiq01iJjnadhahK09qH0BhZfdtQ0yu6DVWZxbswGKOtfA9WYxQssEJHUQ0f1HRLMcJOdx0bJNVK8uTGlgl+Kpx5oCacnSV1Jrh3tK+mo8eRApz5U+pxL1+jYi25GOrRX1Pv4twZ2u3OvzNjHj10NO3XyJMrX868ufPn0NcGBAAh+QQJAwDkACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXmAgICIiIiPj4+VlZWgoKCqqqq2tra/v7/JycnR0dHZ2dng4ODj4+Pl5eXm5ubn5+fo6Ojo6Ojp6enp6enp6enq6urq6urr6+vr6+vs7Ozs7Ozt7e3t7e3t7e3u7u7u7u7v7+/v7+/v7+/w8PDw8PDw8PDx8fHx8fHy8vLy8vLy8vLz8/Pz8/P09PT09PT09PT19fX19fX19fX19fX19fX29vb29vb29vb29vb39/f39/f39/f39/f4+Pj4+Pj4+Pj5+fn5+fn5+fn5+fn6+vr6+vr6+vr6+vr6+vr7+/v7+/v7+/v7+/v8/Pz8/Pz8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////8I+QDJCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatyI8JivWadmHeNIkmC1aseGVStJktkwXytZbnz1SuZGZqBq2sw4C1PMnRZ9TRoJ1OKxSbqKWmTGyJfSir4YMXtKUVWkn1QhgtKUVWI1Rkm7QjxVSSzEr7fMPjw1Sa1DZoqGuW046dRchqUw3V2oSxHWvQYVOQWMMNIswggn6URcEJMqxgY1lYJcUJNdygMnHcYskJFczuT8gj7GCDS5W1xBd0oL+pHpWaBMdyKK+dhk1a9ZY64WG7Qo06f+Mn41lfOs4pSZ6abs6zNlj8IBp9x90rT169iza58YEAAh+QQJAwDeACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGIiIiPj4+WlpacnJynp6ewsLC3t7fDw8POzs7W1tbd3d3i4uLl5eXn5+fo6Ojp6enp6enq6urq6urr6+vr6+vr6+vr6+vs7Ozs7Ozs7Ozt7e3t7e3u7u7u7u7v7+/w8PDw8PDx8fHx8fHx8fHx8fHy8vLy8vLy8vLz8/Pz8/Pz8/Pz8/P09PT09PT19fX19fX19fX29vb29vb39/f39/f4+Pj4+Pj4+Pj5+fn5+fn5+fn5+fn6+vr6+vr6+vr7+/v7+/v7+/v7+/v8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I9gC9CRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsSPFacumeew4rVixkR11BUO5cVmtkywz3roVM6MvVzUxLhslMmfFaaFg+pw4jVPPoRJ1gUJKURUsphMnHYXqENYpqhGlYn3oStVWh9O0fmXoqdZYhq5GnV3oq9LahZCEvjVYSddchJnM3jXoadZeg6Bw/iUYyuvggZwEH/Y2iebiZZBWLvYFaepfV24Xe8t09XFcza44ad6s97CuTKMrST7sqvPhZZkPF1092BPtv6F8aT5l93CxU8sW3/J72Net4IN96bL8dtkyuXenMR9Nvbr16xMDAgAh+QQJAwDgACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISLi4uSkpKenp6srKy7u7vGxsbOzs7X19fe3t7j4+Pl5eXn5+fo6Ojp6enp6enq6urr6+vs7Ozs7Ozt7e3t7e3t7e3u7u7u7u7u7u7u7u7u7u7u7u7v7+/v7+/v7+/w8PDw8PDw8PDx8fHx8fHy8vLy8vLz8/P09PT09PT09PT19fX19fX19fX29vb29vb29vb29vb29vb39/f39/f39/f39/f4+Pj4+Pj5+fn5+fn5+fn6+vr6+vr6+vr6+vr7+/v7+/v7+/v8/Pz8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I7QDBCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjxapUQPJcdkykhtHotR4ciVGYi4x9op5cRdNi7duUjyWU6dEVjB9RtykUqjDW6yMQqyk9CGrV00bUmMalWGomVUVslqVVSGwTV0VSgqbEBMwsgdDyUJr8FRStgRPcYU7kNRcuuA2QcULDlNPvJLO4iUWiS84WVTxbjrFd1kkwXRXWTJMaS9dWZGKsqUm6S3dU5j4ApPUEu7Uv5straVLDdNquq4HX2WdKhVeWacgk6V2S1bpsMCAEdNtVKXKZb16aTbMvLnz5xUDAgAh+QQJAwDfACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISFhYWGhoaMjIydnZ2rq6u2trbExMTNzc3W1tbc3Nzh4eHk5OTm5ubo6Ojo6Ojp6enp6enq6urq6urq6urr6+vr6+vs7Ozt7e3t7e3u7u7u7u7v7+/v7+/w8PDw8PDx8fHx8fHy8vLy8vLz8/Pz8/P09PT09PT19fX19fX29vb29vb29vb29vb29vb29vb29vb39/f39/f39/f39/f4+Pj4+Pj5+fn5+fn5+fn5+fn5+fn5+fn6+vr6+vr6+vr6+vr6+vr6+vr6+vr7+/v7+/v7+/v7+/v8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I8gC/CRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqRJjNVOVnymkiKzlhODwYz4DNlMiLtS3nToaqfDZzJ9MuwpdGGul0UVqkqqEJVOpgZz1YJ6sBopqgdBYTXo6enWb6KCfv1GKtdYgaamnjVFdKwotWMzif0qySvWYJbOfmOl9awnVGefSZqLFdUmvZTgbq1F6Ww1Sm23ivJ0Nhclll+RQR7LjJIpzp45W1r61ZWlyFCfeQKFmeozU5YUh6xmVyEyUJtQk0QWDFlrgs9yoQIV1mc13rt25XKlClUtpHqjS59O3WJAACH5BAkDAPMALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi5ycnLKyssTExM/Pz9jY2N7e3uLi4uXl5efn5+jo6Ojo6Ojo6Onp6erq6urq6urq6uvr6+vr6+zs7Ozs7O3t7e7u7u/v7+/v7/Dw8PDw8PDw8PHx8fHx8fLy8vLy8vLy8vLy8vPz8/Pz8/Pz8/T09PT09PT09PX19fX19fb29vb29vb29vb29vf39/f39/f39/f39/j4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fr6+vr6+vr6+vr6+vr6+vr6+vr6+vv7+/v7+/v7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////wjwAOcJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXClwGcuH21y+bLhs28yGxG4yjKlzYbCeCpdlA5owF1GERo8ajJZTacFZTgvCikqwFdWBrWxehRXt6jxYTammChuVlEyqoYZezeQ1GievuUh5JVXr6rZKaqPCEuU100+qudhS3ZYJKtVTb6n2qnRWaTZMhp1m48Q36uTKTqNlkhu1FqZTUaOBypT04zatEbOlqpQKdchteRn2CoUpVdeTTIMFu01wWa1TmUCVZkksl3FYrUi1qkXMtdfn0KNLnxgQACH5BAkDAMoALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaHBwcICAgJKSkqqqqr6+vs/Pz9nZ2eDg4OXl5efn5+jo6Onp6enp6enp6erq6urq6urq6urq6urq6uvr6+vr6+zs7Ozs7O3t7e3t7e7u7u7u7u/v7+/v7+/v7/Dw8PDw8PDw8PDw8PDw8PHx8fLy8vPz8/Pz8/T09PT09PX19fX19fX19fX19fb29vb29vb29vb29vf39/f39/f39/f39/j4+Pj4+Pj4+Pn5+fn5+fr6+vr6+vr6+vv7+/v7+/v7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wjkAJUJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnOlSF82Dsm4a1JVTJ0FTPn8GHRhqqEBNRpUhNWopqSSbQx1BDXooqSCjshgZ1dR0KCOgQ+8wrTqUD6uhnq4O9VM0aCNCQ0PdmXpTF522OnX5aRRUFh+4GelmZHUHsEZWgitqokOWI6tRF1kJmgMJpCxLnihCmkOoZ0hZkjQlRujpEB0+mU3qCqVJE2SCukZZajT5DiO8Ki9bgsSIz2lBjCS9Tkq8uPHjEAMCACH5BAkDAM0ALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra4GBgZmZma+vr8TExNLS0tra2t/f3+Pj4+Xl5ebm5ufn5+jo6Ojo6Ojo6Onp6enp6enp6enp6erq6urq6uvr6+vr6+vr6+vr6+vr6+zs7Ozs7Ozs7O3t7e3t7e3t7e7u7u/v7/Dw8PDw8PDw8PHx8fHx8fHx8fLy8vLy8vLy8vPz8/Pz8/Pz8/Pz8/Pz8/T09PT09PT09PT09PT09PX19fX19fb29vb29vf39/f39/f39/f39/j4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fr6+vv7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wjlAJsJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzpk2EvW4ShKVzIM+ezXIBDTr0Z89XQ1ElXQoU1NBNQFkh7WlpKCSgqEQBXYQVqs5hgIb1bOQ14tSRqBBRHMZqZC8/OdcKBdmrEKmLw8R6zAVoksa5G2HpKZsRll6Mlu5o7ZgLMEVWgACd7ci2rcRcjO74HTkM1CbLC3ttKnRH8sleoBYtsiSK1dxcrEBBIq0HEuiUw1BZaoTIz53SiBpZUjq0uPHjyCMGBAAh+QQJAwDGACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NsbGx7e3ufn5+3t7fJycnV1dXc3Nzh4eHk5OTl5eXn5+fn5+fo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojp6enp6enp6enp6enq6urq6urq6urr6+vs7Ozt7e3u7u7u7u7v7+/v7+/v7+/w8PDw8PDx8fHx8fHy8vLy8vLz8/Pz8/P09PT09PT09PT19fX19fX29vb29vb29vb39/f39/f39/f39/f39/f4+Pj4+Pj4+Pj4+Pj4+Pj5+fn5+fn5+fn5+fn6+vr6+vr6+vr6+vr7+/v7+/v7+/v7+/v7+/v8/Pz8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I5gCNCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tx5EdbOUz+D6mQlNOcnnbCI5tS0k2lOWKMe5lIJCeJUlKycPvR5cpFEWFdJapI0UatIVoUqkhWZC1DYiZVEFopqEVajj7kE3cXI6tBbjLD8eNWYK5FSjKP0xO3YCNLfiLAK6aHr8ZSgqhJzLbKz6HHHT38KmVWoqZAdQVxLjkrUR/ThgaMkFYLzp9FrlJ8O+bEDp3fvPpdTx2Q16jbP48iTRwwIACH5BAkDAMEALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTlhYWGpqaoeHh56enra2tsjIyNbW1t7e3uPj4+Xl5ebm5ufn5+fn5+fn5+fn5+jo6Ojo6Ojo6Ojo6Ojo6Ojo6Onp6enp6enp6erq6urq6uvr6+vr6+zs7Ozs7Ozs7O3t7e3t7e7u7u7u7u/v7/Dw8PDw8PHx8fHx8fHx8fHx8fLy8vLy8vLy8vPz8/Pz8/Pz8/T09PT09PX19fb29vb29vf39/j4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fn5+fn5+fr6+vr6+vr6+vr6+vr6+vv7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wjuAIMJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQINWbOWSKMNOLJE2VKqS6cJJRlG2uvSwkEqrDxNFLdnKUURCKMFGTOS1pKNEE/k4BdkpT8U6JOFWbCsyz1qJjtx+zDMp4yQ5WzF2gtNX4+DCGCfBuXuxFZw8gSO2ygMYpKA0fyj+SSNoZCs+afKgbZgoTxo+Jzv9WeMFzh9BiS61ajUpkaA/cLys+cOY5KU/bs54GU78jJs/VGV2mjSpt9Dn0HcGBAA7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=\")}chimee-center-state-error{display:none;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:180px;font-size:16px;z-index:1;color:#ffcf00;text-shadow:0 0 3px red;font-weight:100}chimee-control-wrap{background:linear-gradient(0deg,#000,transparent)}.chimee-component{height:3.2em}chimee-control-state.chimee-component{padding-left:2.4em;padding-right:2.4em}chimee-progressbar.chimee-component{position:relative;width:auto}chimee-progressbar-ball{content:\"\";position:absolute;right:-2em;top:-1em;display:inline-block;width:2em;height:2em;border-radius:1em;background:#fff;pointer-events:none}chimee-progresstime.chimee-component{height:100%;color:#fff;font-weight:400;text-align:center;white-space:nowrap;padding:0;line-height:2.75em;vertical-align:bottom;font-size:16px}chimee-progresstime-pass,chimee-progresstime-total{display:inline}chimee-volume.chimee-component{line-height:3.2em;vertical-align:middle}chimee-volume-state{display:inline-block;width:2em;height:1.6em;margin-right:1em}chimee-volume-bar{margin-right:1em}chimee-volume-bar-all,chimee-volume-bar-bg{top:2em}chimee-volume-bar-bg{background:#d8d8d8}chimee-volume-bar-all{background:#57b0f6}chimee-screen.chimee-component{padding-right:2em;padding-left:2em}chimee-clarity.chimee-component{height:100%;line-height:2.75em}chimee-clarity-list{left:-2em;width:8em;padding-bottom:2em}", undefined);

Chimee.install(chimeeControl);

Chimee.install(index$4({
  name: 'chimeeCenterState',
  tagName: 'chimee-center-state',
  html: '\n    <chimee-center-state-correct>\n      <chimee-center-state-loading></chimee-center-state-loading>\n      <chimee-center-state-tip>\n        <span></span>\n      </chimee-center-state-tip>\n    </chimee-center-state-correct>\n    <chimee-center-state-error>\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u91CD\u8BD5</chimee-center-state-error>\n  ',
  offset: '50%',
  hide: false,
  create: function create() {},

  penetrate: true,
  operable: false,
  destroy: function destroy() {
    this.clearTimeout();
  },

  events: {
    pause: function pause() {
      this.showTip('play');
      this.showLoading(false);
    },
    play: function play() {
      this.showTip('pause');
    },
    canplay: function canplay() {
      this.playing();
    },
    playing: function playing() {
      this.playing();
    },
    waiting: function waiting() {
      this.waiting();
    },

    // 卡顿(FLV|HLS加载异常待内部特供事件)
    // stalled () {
    //   this.showLoading();
    // },
    timeupdate: function timeupdate() {
      this.clearTimeout();
    },
    c_mousemove: function c_mousemove() {
      !this.paused && this.showTip('pause');
    }
  },
  methods: {
    playing: function playing() {
      this.clearTimeout();
      this.showLoading(false);
      this.showError(false);
    },
    waiting: function waiting() {
      var _this = this;

      this.clearTimeout();
      // 加载超过20秒则超时显示异常
      this._timeout = setTimeout(function () {
        return _this.showError();
      }, 3e4);
      !this.paused && this.showLoading();
    },
    clearTimeout: function (_clearTimeout) {
      function clearTimeout() {
        return _clearTimeout.apply(this, arguments);
      }

      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };

      return clearTimeout;
    }(function () {
      if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
    }),
    showTip: function showTip(cls) {
      var _this2 = this;

      var clss = 'correct tip play pause';
      this.$domWrap.removeClass(clss).addClass('correct tip ' + cls);
      clearTimeout(this.tipId);
      if (cls === 'pause') {
        this.tipId = setTimeout(function () {
          _this2.$domWrap.removeClass('correct tip ' + cls);
        }, 2000);
      }
    },
    showLoading: function showLoading(status) {
      if (status === false) {
        this.$domWrap.removeClass('loading');
      } else {
        this.$domWrap.addClass('correct loading');
      }
    },
    showError: function showError(status) {
      if (status === false) {
        this.$domWrap.removeClass('error');
      } else {
        this.$domWrap[0].className = '';
        this.$domWrap.addClass('error');
      }
    }
  }
}));

function generateVideo(config) {
  return new Chimee(config);
}

return generateVideo;

})));
