(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[8],{

/***/ 367:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(7);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloneElementWithClassName = cloneElementWithClassName;
exports.cloneChildrenWithClassName = cloneChildrenWithClassName;
exports.isMuiElement = isMuiElement;
exports.setRef = setRef;

var _react = _interopRequireDefault(__webpack_require__(0));

var _classnames = _interopRequireDefault(__webpack_require__(38));

function cloneElementWithClassName(child, className) {
  return _react.default.cloneElement(child, {
    className: (0, _classnames.default)(child.props.className, className)
  });
}

function cloneChildrenWithClassName(children, className) {
  return _react.default.Children.map(children, function (child) {
    return _react.default.isValidElement(child) && cloneElementWithClassName(child, className);
  });
}

function isMuiElement(element, muiNames) {
  return _react.default.isValidElement(element) && muiNames.indexOf(element.type.muiName) !== -1;
}

function setRef(ref, value) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

/***/ }),

/***/ 369:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TSDialog; });
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15);
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(16);
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(18);
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(17);
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(19);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(3);
/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(365);
/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_helmet__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _material_ui_core_Fade__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(97);
/* harmony import */ var _material_ui_core_Fade__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Fade__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _SnoozePanel_Button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(95);
function _templateObject6(){var data=Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(["\n  margin-top: 20px;\n  color: #999;\n  border-radius: 10px;\n  padding: 8px 12px;\n"]);_templateObject6=function _templateObject6(){return data;};return data;}function _templateObject5(){var data=Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(["\n  font-weight: 400;\n  opacity: 0.7;\n  font-size: 22px;\n  color: #333333;\n  line-height: 33px;\n  margin-bottom: 38px;\n  text-align: center;\n  padding: 0 30px;\n"]);_templateObject5=function _templateObject5(){return data;};return data;}function _templateObject4(){var data=Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(["\n  font-weight: 300;\n  font-size: 42px;\n  color: #1f1f1f;\n  margin-top: 10px;\n  margin-bottom: 20px;\n  text-align: center;\n"]);_templateObject4=function _templateObject4(){return data;};return data;}function _templateObject3(){var data=Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(["\n  position: absolute;\n  top: ","px;\n  left: ","px;\n"]);_templateObject3=function _templateObject3(){return data;};return data;}function _templateObject2(){var data=Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(["\n  padding: ","px;\n  padding-top: 60px;\n\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n"]);_templateObject2=function _templateObject2(){return data;};return data;}function _templateObject(){var data=Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(["\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n\n  height: 100%;\n\n  /* background: #fff url(",")\n    no-repeat bottom right; */\n"]);_templateObject=function _templateObject(){return data;};return data;}var TSDialog=/*#__PURE__*/function(_Component){Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"])(TSDialog,_Component);function TSDialog(){Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(this,TSDialog);return Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])(this,Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(TSDialog).apply(this,arguments));}Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(TSDialog,[{key:"render",value:function render(){var _this$props=this.props,image=_this$props.image,title=_this$props.title,headline=_this$props.headline,subheader=_this$props.subheader,children=_this$props.children,closeBtnText=_this$props.closeBtnText,noPadding=_this$props.noPadding;return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_6__["Fragment"],null,react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react_helmet__WEBPACK_IMPORTED_MODULE_8__["Helmet"],null,react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("title",null,title)),react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_material_ui_core_Fade__WEBPACK_IMPORTED_MODULE_9___default.a,{in:true,timeout:700},react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(Root,null,react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(Logo,null),react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(Content,{noPadding:noPadding},react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("picture",null,react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("source",{srcSet:"".concat(image," 2x")}),react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("img",{src:image,alt:""})),react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(Headline,null,headline),react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(Subheader,null,subheader),children,closeBtnText!==null&&react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(NoThanksButton,null,closeBtnText||'No thanks')))));}}]);return TSDialog;}(react__WEBPACK_IMPORTED_MODULE_6__["Component"]);var PADDING=18;var Root=styled_components__WEBPACK_IMPORTED_MODULE_7__[/* default */ "d"].div(_templateObject(),__webpack_require__(370));var Content=styled_components__WEBPACK_IMPORTED_MODULE_7__[/* default */ "d"].div(_templateObject2(),function(props){return props.noPadding?0:PADDING;});var Logo=styled_components__WEBPACK_IMPORTED_MODULE_7__[/* default */ "d"].img.attrs({src:__webpack_require__(371)})(_templateObject3(),PADDING,PADDING);var Headline=styled_components__WEBPACK_IMPORTED_MODULE_7__[/* default */ "d"].div(_templateObject4());var Subheader=styled_components__WEBPACK_IMPORTED_MODULE_7__[/* default */ "d"].div(_templateObject5());var NoThanksButton=Object(styled_components__WEBPACK_IMPORTED_MODULE_7__[/* default */ "d"])(_SnoozePanel_Button__WEBPACK_IMPORTED_MODULE_10__[/* default */ "a"]).attrs(function(props){return{color:'#fff',onClick:function onClick(){return window.close();}};})(_templateObject6());

/***/ }),

/***/ 370:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/bg_decoration.77b5866e.svg";

/***/ }),

/***/ 371:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/logo.c04c672a.svg";

/***/ }),

/***/ 487:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(35);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(0));

var _createSvgIcon = _interopRequireDefault(__webpack_require__(93));

var _default = (0, _createSvgIcon.default)(_react.default.createElement(_react.default.Fragment, null, _react.default.createElement("path", {
  fill: "none",
  d: "M0 0h24v24H0z"
}), _react.default.createElement("path", {
  d: "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"
})), 'School');

exports.default = _default;

/***/ }),

/***/ 488:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(35);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(0));

var _createSvgIcon = _interopRequireDefault(__webpack_require__(93));

var _default = (0, _createSvgIcon.default)(_react.default.createElement(_react.default.Fragment, null, _react.default.createElement("path", {
  fill: "none",
  d: "M0 0h24v24H0z"
}), _react.default.createElement("path", {
  d: "M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"
})), 'BugReport');

exports.default = _default;

/***/ }),

/***/ 489:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(35);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(0));

var _createSvgIcon = _interopRequireDefault(__webpack_require__(93));

var _default = (0, _createSvgIcon.default)(_react.default.createElement(_react.default.Fragment, null, _react.default.createElement("defs", null, _react.default.createElement("path", {
  id: "a",
  d: "M0 0h24v24H0V0z"
})), _react.default.createElement("path", {
  d: "M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"
})), 'ImportContacts');

exports.default = _default;

/***/ }),

/***/ 490:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(35);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(0));

var _createSvgIcon = _interopRequireDefault(__webpack_require__(93));

var _default = (0, _createSvgIcon.default)(_react.default.createElement(_react.default.Fragment, null, _react.default.createElement("path", {
  d: "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"
}), _react.default.createElement("path", {
  fill: "none",
  d: "M0 0h24v24H0z"
})), 'Textsms');

exports.default = _default;

/***/ }),

/***/ 512:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BetaDialog; });
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15);
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(16);
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(18);
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(17);
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(19);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(3);
/* harmony import */ var _paths__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(8);
/* harmony import */ var _core_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(9);
/* harmony import */ var _TSDialog__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(369);
/* harmony import */ var _material_ui_icons_BugReport__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(488);
/* harmony import */ var _material_ui_icons_BugReport__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_BugReport__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _material_ui_icons_School__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(487);
/* harmony import */ var _material_ui_icons_School__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_School__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _material_ui_icons_Star__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(402);
/* harmony import */ var _material_ui_icons_Star__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_Star__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _material_ui_icons_Textsms__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(490);
/* harmony import */ var _material_ui_icons_Textsms__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_Textsms__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _material_ui_icons_ImportContacts__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(489);
/* harmony import */ var _material_ui_icons_ImportContacts__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_ImportContacts__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _material_ui_core_List__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(380);
/* harmony import */ var _material_ui_core_List__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_List__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _material_ui_core_ListItem__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(377);
/* harmony import */ var _material_ui_core_ListItem__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_ListItem__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var _material_ui_core_ListItemText__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(379);
/* harmony import */ var _material_ui_core_ListItemText__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_ListItemText__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var _material_ui_core_ListItemIcon__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(401);
/* harmony import */ var _material_ui_core_ListItemIcon__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_ListItemIcon__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(365);
/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(react_helmet__WEBPACK_IMPORTED_MODULE_20__);
function _templateObject(){var data=Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(["\n  margin-bottom: 100px;\n"]);_templateObject=function _templateObject(){return data;};return data;}var BetaDialog=/*#__PURE__*/function(_Component){Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"])(BetaDialog,_Component);function BetaDialog(){Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(this,BetaDialog);return Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])(this,Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(BetaDialog).apply(this,arguments));}Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(BetaDialog,[{key:"render",value:function render(){var ITEMS=[{primary:'Beta instructions & FAQ',secondary:'What you should know about Tab Snooze Beta',icon:react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_material_ui_icons_School__WEBPACK_IMPORTED_MODULE_12___default.a,null),href:_paths__WEBPACK_IMPORTED_MODULE_8__[/* BETA_INSTRUCTIONS_URL */ "c"]},{primary:'Report a bug',secondary:'Something not working? not looking right? Please tell us!',icon:react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_material_ui_icons_BugReport__WEBPACK_IMPORTED_MODULE_11___default.a,null),href:_paths__WEBPACK_IMPORTED_MODULE_8__[/* MESSENGER_PROFILE_URL */ "i"]},{primary:'View Changelog',secondary:"See what we've been working on",icon:react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_material_ui_icons_ImportContacts__WEBPACK_IMPORTED_MODULE_15___default.a,null),href:_paths__WEBPACK_IMPORTED_MODULE_8__[/* CHANGELOG_URL */ "e"]},{primary:'Suggest & vote on new features',secondary:'Tell us about your ideas for Tab Snooze',icon:react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_material_ui_icons_Star__WEBPACK_IMPORTED_MODULE_13___default.a,null),href:_paths__WEBPACK_IMPORTED_MODULE_8__[/* TAB_SNOOZE_FEATURE_VOTE_URL */ "p"]},{primary:'Talk to us',secondary:'Message us on Facebook Messenger about anything',icon:react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_material_ui_icons_Textsms__WEBPACK_IMPORTED_MODULE_14___default.a,null),href:_paths__WEBPACK_IMPORTED_MODULE_8__[/* MESSENGER_PROFILE_URL */ "i"]}];return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_TSDialog__WEBPACK_IMPORTED_MODULE_10__[/* default */ "a"],{title:"Tab Snooze Beta",image:'/images/beta_extension_icon_128.png'// require('./images/beta.png')}
,headline:"Tab Snooze Beta (v".concat(_core_utils__WEBPACK_IMPORTED_MODULE_9__[/* APP_VERSION */ "a"],")"),subheader:"Thank you for helping us test Tab Snooze, you're awesome!",closeBtnText:null},react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(Root,null,react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react_helmet__WEBPACK_IMPORTED_MODULE_20__["Helmet"],null,react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("link",{rel:"icon",href:"/images/beta_extension_icon_128.png"})),react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_material_ui_core_List__WEBPACK_IMPORTED_MODULE_16___default.a,null,ITEMS.map(function(item,index){return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_material_ui_core_ListItem__WEBPACK_IMPORTED_MODULE_17___default.a,{key:index,component:"a",button:true,href:item.href,target:"_blank"},react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_material_ui_core_ListItemIcon__WEBPACK_IMPORTED_MODULE_19___default.a,null,item.icon),react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_material_ui_core_ListItemText__WEBPACK_IMPORTED_MODULE_18___default.a,{primary:item.primary,secondary:item.secondary}));}))));}}],[{key:"open",value:function open(){Object(_core_utils__WEBPACK_IMPORTED_MODULE_9__[/* createTab */ "i"])(_paths__WEBPACK_IMPORTED_MODULE_8__[/* BETA_PATH */ "d"]);}}]);return BetaDialog;}(react__WEBPACK_IMPORTED_MODULE_6__["Component"]);var Root=styled_components__WEBPACK_IMPORTED_MODULE_7__[/* default */ "d"].div(_templateObject());

/***/ })

}]);
//# sourceMappingURL=8.461cf370.chunk.js.map