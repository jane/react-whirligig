"use strict";Object.defineProperty(exports,"__esModule",{value:!0});// no easing, no acceleration
var linear=exports.linear=function linear(a){return a};// accelerating from zero velocity
var easeInQuad=exports.easeInQuad=function easeInQuad(a){return Math.pow(a,2)};// decelerating to zero velocity
var easeOutQuad=exports.easeOutQuad=function easeOutQuad(a){return a*(2-a)};// acceleration until halfway, then deceleration
var easeInOutQuad=exports.easeInOutQuad=function easeInOutQuad(a){return .5>a?2*Math.pow(a,2):-1+(4-2*a)*a};// accelerating from zero velocity
var easeInCubic=exports.easeInCubic=function easeInCubic(a){return Math.pow(a,3)};// decelerating to zero velocity
var easeOutCubic=exports.easeOutCubic=function easeOutCubic(a){return--a*Math.pow(a,2)+1};// acceleration until halfway, then deceleration
var easeInOutCubic=exports.easeInOutCubic=function easeInOutCubic(a){return .5>a?4*Math.pow(a,3):(a-1)*Math.pow(2*a-2,2)+1};// accelerating from zero velocity
var easeInQuart=exports.easeInQuart=function easeInQuart(a){return Math.pow(a,4)};// decelerating to zero velocity
var easeOutQuart=exports.easeOutQuart=function easeOutQuart(a){return 1- --a*Math.pow(a,3)};// acceleration until halfway, then deceleration
var easeInOutQuart=exports.easeInOutQuart=function easeInOutQuart(a){return .5>a?8*Math.pow(a,4):1-8*--a*Math.pow(a,3)};// accelerating from zero velocity
var easeInQuint=exports.easeInQuint=function easeInQuint(a){return Math.pow(a,5)};// decelerating to zero velocity
var easeOutQuint=exports.easeOutQuint=function easeOutQuint(a){return 1+--a*Math.pow(a,4)};// acceleration until halfway, then deceleration
var easeInOutQuint=exports.easeInOutQuint=function easeInOutQuint(a){return .5>a?16*Math.pow(a,5):1+16*--a*Math.pow(a,4)};