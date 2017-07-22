'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animate = exports.isWhollyInView = exports.hasOngoingInteraction = exports.trackOngoingMouseInteraction = exports.trackTouchesForElement = exports.onSwipe = exports.onScrollStart = exports.onScrollEnd = exports.onScroll = exports.onWindowScroll = exports.on = exports.noop = exports.maxMap = exports.minMap = exports.compose = exports.values = exports.includes = undefined;

var _easing = require('./easing');

var includes = exports.includes = function includes(val, arr) {
  return arr.includes ? arr.includes(val) : !!arr.filter(function (item) {
    return item === val;
  }).length;
};
var values = exports.values = Object.values || function (obj) {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
};
var compose = exports.compose = function compose() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (val) {
    return fns.reduceRight(function (currVal, fn) {
      return fn(currVal);
    }, val);
  };
};
var minMap = exports.minMap = function minMap() {
  for (var _len2 = arguments.length, vals = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    vals[_key2] = arguments[_key2];
  }

  return function (val) {
    return Math.min.apply(Math, vals.concat([val]));
  };
};
var maxMap = exports.maxMap = function maxMap() {
  for (var _len3 = arguments.length, vals = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    vals[_key3] = arguments[_key3];
  }

  return function (val) {
    return Math.max.apply(Math, vals.concat([val]));
  };
};
var noop = exports.noop = function noop() {};
var on = exports.on = function on(evt) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return function (cb) {
    return function (el) {
      el.addEventListener(evt, cb, opts);
      return function () {
        return el.removeEventListener(evt, cb);
      };
    };
  };
};

var onWindowScroll = exports.onWindowScroll = function onWindowScroll(cb) {
  return on('scroll', true)(cb)(window);
};

var onScroll = exports.onScroll = function onScroll(cb) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$target = _ref.target,
      target = _ref$target === undefined ? window : _ref$target;

  return onWindowScroll(function (e) {
    return (target === window || target === e.target) && cb(e);
  });
};

var onScrollEnd = exports.onScrollEnd = function onScrollEnd(cb) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$wait = _ref2.wait,
      wait = _ref2$wait === undefined ? 100 : _ref2$wait,
      _ref2$target = _ref2.target,
      target = _ref2$target === undefined ? window : _ref2$target;

  return function (timeoutID) {
    return onScroll(function (evt) {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(function () {
        return evt.target === target ? cb() : undefined;
      }, wait);
    });
  }(0);
};

var onScrollStart = exports.onScrollStart = function onScrollStart(cb) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref3$target = _ref3.target,
      target = _ref3$target === undefined ? window : _ref3$target;

  var started = false;
  var offScrollEnd = onScrollEnd(function () {
    started = false;
  }, { target: target });
  var offScroll = onScroll(function (e) {
    if (!started) {
      started = true;
      cb(e);
    }
  }, { target: target });

  return function () {
    offScroll();
    offScrollEnd();
  };
};

var onSwipe = exports.onSwipe = function onSwipe(cb) {
  return function (target) {
    var offTouchStart = on('touchstart')(function (_ref4) {
      var targetTouches = _ref4.targetTouches;
      var _targetTouches$ = targetTouches[0],
          startX = _targetTouches$.pageX,
          startY = _targetTouches$.pageY;

      var offTouchEnd = on('touchend')(function (_ref5) {
        var changedTouches = _ref5.changedTouches;
        var _changedTouches$ = changedTouches[0],
            endX = _changedTouches$.pageX,
            endY = _changedTouches$.pageY;

        var xDiff = endX - startX;
        var absXDiff = Math.abs(xDiff);
        var yDiff = endY - startY;
        var absYDiff = Math.abs(yDiff);
        if (Math.max(absXDiff, absYDiff) > 20) {
          var dir = absXDiff > absYDiff ? /* h */xDiff < 0 ? 'right' : 'left' : /* v */yDiff < 0 ? 'down' : 'up';
          cb(dir);
        }
        offTouchEnd();
      })(target);
    })(target);

    return offTouchStart;
  };
};

var trackTouchesForElement = exports.trackTouchesForElement = function trackTouchesForElement(el) {
  var touchIds = [];
  on('touchend')(function (_ref6) {
    var targetTouches = _ref6.targetTouches;
    touchIds = targetTouches;
  })(el);
  return function () {
    return touchIds.length;
  };
};

var trackOngoingMouseInteraction = exports.trackOngoingMouseInteraction = function trackOngoingMouseInteraction(el) {
  var isInteracting = false;
  on('mousedown')(function () {
    isInteracting = true;
  })(el);
  on('mouseup')(function () {
    isInteracting = false;
  })(document.body);
  return function () {
    return isInteracting;
  };
};

var hasOngoingInteraction = exports.hasOngoingInteraction = function hasOngoingInteraction(el) {
  var getOngoingTouchCount = trackTouchesForElement(el);
  var getOngoingMouseClick = trackOngoingMouseInteraction(el);
  return function () {
    return getOngoingTouchCount() || getOngoingMouseClick();
  };
};

var isWhollyInView = exports.isWhollyInView = function isWhollyInView(parent) {
  return function () {
    var child = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { getBoundingClientRect: function getBoundingClientRect() {
        return {};
      } };

    var _child$getBoundingCli = child.getBoundingClientRect(),
        cLeft = _child$getBoundingCli.left,
        cRight = _child$getBoundingCli.right;

    var _parent$getBoundingCl = parent.getBoundingClientRect(),
        pLeft = _parent$getBoundingCl.left,
        pRight = _parent$getBoundingCl.right;

    return cLeft >= pLeft && cRight <= pRight;
  };
};

var animate = exports.animate = function animate(el) {
  var _ref7 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref7$delta = _ref7.delta,
      delta = _ref7$delta === undefined ? 0 : _ref7$delta,
      _ref7$immediate = _ref7.immediate,
      immediate = _ref7$immediate === undefined ? false : _ref7$immediate,
      _ref7$duration = _ref7.duration,
      duration = _ref7$duration === undefined ? 500 : _ref7$duration,
      _ref7$easing = _ref7.easing,
      easing = _ref7$easing === undefined ? _easing.easeOutQuint : _ref7$easing,
      _ref7$prop = _ref7.prop,
      prop = _ref7$prop === undefined ? 'scrollTop' : _ref7$prop;

  return new Promise(function (res, rej) {
    if (!delta) return res();
    var initialVal = el[prop];
    if (immediate) {
      el[prop] = initialVal + delta;
      return res();
    }
    var hasBailed = false;
    var bail = function bail() {
      hasBailed = true;
      var pos = el[prop];
      el.removeEventListener('touchstart', bail);
      el[prop] = pos;
      return rej('Animation interupted by interaction');
    };
    el.addEventListener('touchstart', bail);
    var startTime = null;
    var step = function step(timestamp) {
      if (hasBailed) return;
      if (!startTime) startTime = timestamp;
      var progressTime = timestamp - startTime;
      var progressRatio = easing(progressTime / duration);
      el[prop] = initialVal + delta * progressRatio;
      if (progressTime < duration) {
        window.requestAnimationFrame(step);
      } else {
        el[prop] = initialVal + delta; // jump to end when animation is complete. necessary at least for immediate scroll
        res();
      }
    };
    window.requestAnimationFrame(step);
  });
};