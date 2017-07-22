'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Slide = function Slide(_ref) {
  var _ref$basis = _ref.basis,
      basis = _ref$basis === undefined ? '100%' : _ref$basis,
      _ref$gutter = _ref.gutter,
      gutter = _ref$gutter === undefined ? '1em' : _ref$gutter,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? '' : _ref$className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, ['basis', 'gutter', 'className', 'children']);

  return _react2.default.createElement(
    'div',
    _extends({
      className: className,
      style: {
        flex: '0 0 auto',
        width: basis,
        marginLeft: gutter
      }
    }, props),
    children
  );
};

Slide.propTypes = {
  basis: _propTypes.string,
  gutter: _propTypes.string,
  children: _propTypes.node,
  className: (0, _propTypes.oneOfType)([_propTypes.string, _propTypes.array, _propTypes.object])
};

exports.default = Slide;