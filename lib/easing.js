"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// https://gist.github.com/gre/1650294
// no easing, no acceleration
var linear = exports.linear = function linear(t) {
  return t;
};
// accelerating from zero velocity
var easeInQuad = exports.easeInQuad = function easeInQuad(t) {
  return Math.pow(t, 2);
};
// decelerating to zero velocity
var easeOutQuad = exports.easeOutQuad = function easeOutQuad(t) {
  return t * (2 - t);
};
// acceleration until halfway, then deceleration
var easeInOutQuad = exports.easeInOutQuad = function easeInOutQuad(t) {
  return t < .5 ? 2 * Math.pow(t, 2) : -1 + (4 - 2 * t) * t;
};
// accelerating from zero velocity
var easeInCubic = exports.easeInCubic = function easeInCubic(t) {
  return Math.pow(t, 3);
};
// decelerating to zero velocity
var easeOutCubic = exports.easeOutCubic = function easeOutCubic(t) {
  return --t * Math.pow(t, 2) + 1;
};
// acceleration until halfway, then deceleration
var easeInOutCubic = exports.easeInOutCubic = function easeInOutCubic(t) {
  return t < .5 ? 4 * Math.pow(t, 3) : (t - 1) * Math.pow(2 * t - 2, 2) + 1;
};
// accelerating from zero velocity
var easeInQuart = exports.easeInQuart = function easeInQuart(t) {
  return Math.pow(t, 4);
};
// decelerating to zero velocity
var easeOutQuart = exports.easeOutQuart = function easeOutQuart(t) {
  return 1 - --t * Math.pow(t, 3);
};
// acceleration until halfway, then deceleration
var easeInOutQuart = exports.easeInOutQuart = function easeInOutQuart(t) {
  return t < .5 ? 8 * Math.pow(t, 4) : 1 - 8 * --t * Math.pow(t, 3);
};
// accelerating from zero velocity
var easeInQuint = exports.easeInQuint = function easeInQuint(t) {
  return Math.pow(t, 5);
};
// decelerating to zero velocity
var easeOutQuint = exports.easeOutQuint = function easeOutQuint(t) {
  return 1 + --t * Math.pow(t, 4);
};
// acceleration until halfway, then deceleration
var easeInOutQuint = exports.easeInOutQuint = function easeInOutQuint(t) {
  return t < .5 ? 16 * Math.pow(t, 5) : 1 + 16 * --t * Math.pow(t, 4);
};