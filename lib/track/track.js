'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _slide = require('../slide');

var _slide2 = _interopRequireDefault(_slide);

var _utils = require('../utils');

var _propTypes = require('prop-types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// const tap = (msg) => (thing) => { console.log(msg, thing); return thing }
var wrapAroundValue = function wrapAroundValue(val, max) {
  return (val % max + max) % max;
};
var hardBoundedValue = function hardBoundedValue(val, max) {
  return Math.max(0, Math.min(max, val));
};
var normalizeIndex = function normalizeIndex(idx, len) {
  var wrap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return wrap ? wrapAroundValue(idx, len) : hardBoundedValue(idx, len - 1);
};

var Track = function (_Component) {
  _inherits(Track, _Component);

  function Track(props) {
    _classCallCheck(this, Track);

    var _this = _possibleConstructorReturn(this, (Track.__proto__ || Object.getPrototypeOf(Track)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      activeIndex: props.startAt,
      isAnimating: false,
      visibleSlides: _this.props.visibleSlides || 0,
      slideBy: _this.props.slideBy || _this.props.visibleSlides || 0 };

    // We can't do arrow function properties for these since
    // we are passing them to the consuming component and we
    // require the proper context
    _this.next = _this.next.bind(_this);
    _this.prev = _this.prev.bind(_this);
    _this.slideTo = _this.slideTo.bind(_this);
    return _this;
  }

  _createClass(Track, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.DOMNode = (0, _reactDom.findDOMNode)(this.track);
      this.isInteracting = (0, _utils.hasOngoingInteraction)(this.DOMNode);

      // These are not a part of component state since we don't want
      // incure the overhead of calling setState. They are either cached
      // values or state only the onScrollEnd callback cares about and
      // are not important to the rendering of the component.
      this.childCount = this.track && this.track.children ? this.track.children.length : 0;

      var slideBy = {
        left: function left() {
          return -_this2.state.slideBy;
        },
        right: function right() {
          return _this2.state.slideBy;
        },
        up: function up() {
          return 0;
        },
        down: function down() {
          return 0;
        }
      };

      this.eventListeners = [].concat(_toConsumableArray(this.eventListeners), [(0, _utils.onScrollStart)(function () {
        _this2.isScrolling = true;
      }), (0, _utils.on)('touchstart')(function () {
        _this2.isScrolling = true;
      })(this.track), (0, _utils.onScrollEnd)(function () {
        _this2.isScrolling = false;
        if (_this2.canSelfCorrect()) {
          if (_this2.props.snapToSlide) {
            _this2.slideTo(_this2.getNearestSlideIndex()).catch(_utils.noop);
          } else {
            _this2.props.afterSlide(_this2.getNearestSlideIndex());
          }
        }
      }, { target: this.DOMNode }), (0, _utils.on)('touchend')(function () {
        if (_this2.canSelfCorrect()) {
          _this2.props.snapToSlide ? _this2.slideTo(_this2.getNearestSlideIndex()).catch(_utils.noop) : _this2.props.afterSlide(_this2.getNearestSlideIndex());
        }
      })(this.track), (0, _utils.onSwipe)(function (direction) {
        if (!_this2.props.preventSwipe && _this2.props.snapToSlide) {
          _this2.slideTo(_this2.state.activeIndex + slideBy[direction]()).catch(_utils.noop);
        }
      })(this.track)]);

      this.slideTo(this.props.startAt, { immediate: true }).catch(_utils.noop);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.eventListeners.forEach(function (fn) {
        return fn();
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(_ref) {
      var slideBy = _ref.slideBy,
          visibleSlides = _ref.visibleSlides;

      if (slideBy !== this.props.slideBy || visibleSlides !== this.props.visibleSlides) {
        this.setState({ slideBy: slideBy || visibleSlides || 1 });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      this.childCount = this.track && this.track.children ? this.track.children.length : 0;

      if (this.shouldSelfCorrect()) {
        var nearestSlideIndex = this.getNearestSlideIndex();
        nearestSlideIndex !== this.state.activeIndex && this.slideTo(this.getNearestSlideIndex()).catch(_utils.noop);
      }

      if (prevProps.slideTo !== this.props.slideTo) {
        this.slideTo(this.props.slideTo).catch(_utils.noop);
      }
    }
  }, {
    key: 'shouldComponentUpdate',


    // isAnimating state is the only important state value to the rendering of this component
    value: function shouldComponentUpdate(nextProps, _ref2) {
      var isAnimating = _ref2.isAnimating;

      var propValues = [].concat(_toConsumableArray((0, _utils.values)(this.props)), [this.state.isAnimating]);
      var nextPropValues = [].concat(_toConsumableArray((0, _utils.values)(nextProps)), [isAnimating]);
      return !nextPropValues.every(function (val, i) {
        return val === propValues[i];
      });
    }
  }, {
    key: 'next',
    value: function next() {
      var childCount = this.childCount,
          props = this.props,
          state = this.state;
      var activeIndex = state.activeIndex,
          slideBy = state.slideBy;
      var infinite = props.infinite;

      var firstIndex = 0;
      var lastIndex = childCount - slideBy;

      if (!slideBy) {
        var _getPartiallyObscured = this.getPartiallyObscuredSlides(),
            _getPartiallyObscured2 = _slicedToArray(_getPartiallyObscured, 2),
            _ = _getPartiallyObscured2[0],
            nextSlide = _getPartiallyObscured2[1];

        var nextInfinteSlide = nextSlide === childCount - 1 ? 0 : nextSlide;
        return this.slideTo(infinite ? nextInfinteSlide : nextSlide);
      }

      var nextActiveCandidate = activeIndex + slideBy;
      var nextActive = Math.min(nextActiveCandidate, lastIndex);
      var nextActiveInfinite = activeIndex === lastIndex ? firstIndex : nextActive;
      return this.slideTo(infinite ? nextActiveInfinite : nextActive);
    }
  }, {
    key: 'prev',
    value: function prev() {
      var childCount = this.childCount,
          state = this.state,
          props = this.props;
      var activeIndex = state.activeIndex,
          slideBy = state.slideBy;
      var infinite = props.infinite;

      var firstIndex = 0;
      var lastIndex = childCount - slideBy;

      if (!slideBy) {
        var _getPartiallyObscured3 = this.getPartiallyObscuredSlides(),
            _getPartiallyObscured4 = _slicedToArray(_getPartiallyObscured3, 1),
            prevSlide = _getPartiallyObscured4[0];

        var prevInfinteSlide = prevSlide === firstIndex ? childCount - 1 : prevSlide;
        return this.slideTo(infinite ? prevInfinteSlide : prevSlide);
      }

      var nextActive = Math.max(activeIndex - slideBy, firstIndex);
      var nextActiveInfinite = nextActive === firstIndex ? lastIndex : nextActive;
      return this.slideTo(infinite ? nextActiveInfinite : nextActive);
    }
  }, {
    key: 'slideTo',
    value: function slideTo(index) {
      var _this3 = this;

      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref3$immediate = _ref3.immediate,
          immediate = _ref3$immediate === undefined ? false : _ref3$immediate;

      if (this.childCount === 0) return Promise.reject('No children to slide to');
      if (!this.track) return Promise.reject('The Track is not mounted');
      var _props = this.props,
          afterSlide = _props.afterSlide,
          beforeSlide = _props.beforeSlide,
          easing = _props.easing,
          duration = _props.animationDuration,
          infinite = _props.infinite,
          preventScroll = _props.preventScroll;
      var _track = this.track,
          children = _track.children,
          scrollLeft = _track.scrollLeft;

      var slideIndex = normalizeIndex(index, this.childCount, infinite);
      var startingIndex = this.state.activeIndex;
      var delta = children[slideIndex].offsetLeft - scrollLeft;
      if (startingIndex !== slideIndex) {
        beforeSlide(index);
      }
      this.setState({ isAnimating: true, activeIndex: slideIndex });
      return new Promise(function (res, _) {
        if (immediate) {
          _this3.track.scrollLeft = children[slideIndex].offsetLeft;
          return res();
        } else {
          var originalOverflowX = preventScroll ? 'hidden' : 'auto';
          return res((0, _utils.animate)(_this3.track, { prop: 'scrollLeft', delta: delta, easing: easing, duration: duration, originalOverflowX: originalOverflowX }));
        }
      }).then(function () {
        _this3.setState({ isAnimating: false });
        if (startingIndex !== slideIndex) {
          return afterSlide(slideIndex);
        }
      }).catch(function (_) {
        _this3.setState({ isAnimating: false });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          afterSlide = _props2.afterSlide,
          animationDuration = _props2.animationDuration,
          beforeSlide = _props2.beforeSlide,
          children = _props2.children,
          className = _props2.className,
          easing = _props2.easing,
          infinite = _props2.infinite,
          innerRef = _props2.innerRef,
          gutter = _props2.gutter,
          nextKeys = _props2.nextKeys,
          prevKeys = _props2.prevKeys,
          preventScroll = _props2.preventScroll,
          preventAutoCorrect = _props2.preventAutoCorrect,
          preventSwipe = _props2.preventSwipe,
          snapToSlide = _props2.snapToSlide,
          onSlideClick = _props2.onSlideClick,
          slideClass = _props2.slideClass,
          slideTo = _props2.slideTo,
          slideBy = _props2.slideBy,
          startAt = _props2.startAt,
          style = _props2.style,
          visibleSlides = _props2.visibleSlides,
          props = _objectWithoutProperties(_props2, ['afterSlide', 'animationDuration', 'beforeSlide', 'children', 'className', 'easing', 'infinite', 'innerRef', 'gutter', 'nextKeys', 'prevKeys', 'preventScroll', 'preventAutoCorrect', 'preventSwipe', 'snapToSlide', 'onSlideClick', 'slideClass', 'slideTo', 'slideBy', 'startAt', 'style', 'visibleSlides']);

      var preventScrolling = preventScroll ? 'hidden' : 'auto';
      var styles = {
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'space-between',
        overflowX: preventScrolling,
        msOverflowStyle: '-ms-autohiding-scrollbar', /* chrome like scrollbar experience for IE/Edge */
        position: 'relative', /* makes .track an offset parent */
        transition: 'all .25s ease-in-quint',
        outline: 'none',
        WebkitOverflowScrolling: 'touch'
      };

      return _react2.default.createElement(
        'div',
        _extends({
          className: className,
          style: _extends({}, style, styles),
          ref: this.setRef('track'),
          tabIndex: '0',
          onKeyUp: this.handleKeyUp
        }, props),
        _react.Children.map(typeof children === 'function' ? children(this.next, this.prev) : children, function (child, i) {
          return _react2.default.createElement(
            _slide2.default,
            {
              className: slideClass,
              key: 'slide-' + i,
              basis: visibleSlides ? 'calc((100% - (' + gutter + ' * ' + (visibleSlides - 1) + ')) / ' + visibleSlides + ')' : 'auto',
              gutter: i > 0 ? gutter : '',
              onClick: onSlideClick
            },
            child
          );
        })
      );
    }
  }]);

  return Track;
}(_react.Component);

Track.propTypes = {
  afterSlide: _propTypes.func,
  animationDuration: _propTypes.number,
  beforeSlide: _propTypes.func,
  children: (0, _propTypes.oneOfType)([_propTypes.node, _propTypes.array, _propTypes.string]),
  className: (0, _propTypes.oneOfType)([_propTypes.array, _propTypes.string, _propTypes.object]),
  easing: _propTypes.func,
  infinite: _propTypes.bool,
  innerRef: _propTypes.func,
  nextKeys: _propTypes.array,
  prevKeys: _propTypes.array,
  preventAutoCorrect: _propTypes.bool,
  preventScroll: _propTypes.bool,
  preventSwipe: _propTypes.bool,
  onSlideClick: _propTypes.func,
  snapToSlide: _propTypes.bool,
  slideTo: _propTypes.number,
  slideToCenter: _propTypes.bool,
  slideBy: _propTypes.number,
  slideClass: (0, _propTypes.oneOfType)([_propTypes.array, _propTypes.string, _propTypes.object]),
  startAt: _propTypes.number,
  style: _propTypes.object,
  gutter: function gutter(props, propName, componentName) {
    var prop = props[propName];
    if (typeof parseInt(prop, 10) === 'number' && !isNaN(Number(prop))) {
      return new Error('Invalid value (' + prop + ') of prop \'' + propName + '\' supplied to ' + componentName + '.\n        The value of ' + propName + ' should be a valid css length unit\n        (https://developer.mozilla.org/en-US/docs/Web/CSS/length).');
    }
  },
  visibleSlides: _propTypes.number
};
Track.defaultProps = {
  afterSlide: function afterSlide() {},
  animationDuration: 500,
  beforeSlide: function beforeSlide() {},
  gutter: '1em',
  nextKeys: ['ArrowRight'],
  prevKeys: ['ArrowLeft'],
  preventAutoCorrect: false,
  preventScroll: false,
  preventSwipe: false,
  snapToSlide: false,
  startAt: 0,
  style: {}
};

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.eventListeners = [];
  this.isScrolling = false;

  this.canSelfCorrect = function () {
    return !_this4.props.preventAutoCorrect && !_this4.state.isAnimating && !_this4.isScrolling && !_this4.isInteracting();
  };

  this.shouldSelfCorrect = function () {
    return _this4.props.snapToSlide && _this4.canSelfCorrect();
  };

  this.handleKeyUp = function (nextKeys, prevKeys) {
    return function (_ref4) {
      var key = _ref4.key;

      var isNext = (0, _utils.includes)(key, nextKeys);
      var isPrev = (0, _utils.includes)(key, prevKeys);
      _this4.setState({ isAnimating: true });
      if (isNext) _this4.next().catch(_utils.noop);
      if (isPrev) _this4.prev().catch(_utils.noop);
      return false;
    };
  }(this.props.nextKeys, this.props.prevKeys);

  this.getPartiallyObscuredSlides = function () {
    var track = _this4.track;

    var findFirstObscuredChildIndex = [].concat(_toConsumableArray(track.children)).findIndex(function (child, i, children) {
      return !(0, _utils.isWhollyInView)(track)(child) && (0, _utils.isWhollyInView)(track)(children[i + 1]);
    });

    var firstObscuredChildIndex = Math.max(findFirstObscuredChildIndex, 0);

    var findLastObscuredChildIndex = [].concat(_toConsumableArray(track.children)).findIndex(function (child, i, children) {
      return !(0, _utils.isWhollyInView)(track)(child) && (0, _utils.isWhollyInView)(track)(children[i - 1]);
    });
    var lastObscuredChildIndex = Math.max(findLastObscuredChildIndex, 0) || track.children.length - 1;

    return [firstObscuredChildIndex, lastObscuredChildIndex];
  };

  this.getNearestSlideIndex = function () {
    var _track2 = _this4.track,
        children = _track2.children,
        scrollLeft = _track2.scrollLeft;

    var offsets = [].slice.call(children).map(function (_ref5) {
      var offsetLeft = _ref5.offsetLeft;
      return Math.abs(offsetLeft - scrollLeft);
    });
    return offsets.indexOf(Math.min.apply(Math, _toConsumableArray(offsets)));
  };

  this.setRef = function (name) {
    return function (ref) {
      _this4[name] = ref;
    };
  };
};

exports.default = Track;