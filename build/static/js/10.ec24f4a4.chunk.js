(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[10],{

/***/ 368:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _material_ui_core_NativeSelect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(381);
/* harmony import */ var _material_ui_core_NativeSelect__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_NativeSelect__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(96);
/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__);
var styles=function styles(theme){return{root:{fontSize:'2rem',lineHeight:'initial'}};};/* harmony default export */ __webpack_exports__["a"] = (Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__["withStyles"])(styles)(function(props){var SelectComp=props.component||_material_ui_core_NativeSelect__WEBPACK_IMPORTED_MODULE_1___default.a;return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SelectComp,Object.assign({},props,{value:props.options.findIndex(function(opt){return opt.value===props.value;}),onChange:function onChange(event){var selectedIndex=parseInt(event.target.value);var selectedOption=props.options[selectedIndex];props.onChange(selectedOption.value);}}),props.options.map(function(option,index){return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option",{key:option.value,value:index},option.label);}));}));

/***/ }),

/***/ 384:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return PeriodOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return WeekdayOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DayOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return HourOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DateOptions; });
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(391);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _material_ui_core_Checkbox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(385);
/* harmony import */ var _material_ui_core_Checkbox__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Checkbox__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _Select__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(368);
/* harmony import */ var _core_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(9);
function _templateObject3(){var data=Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(["\n  font-size: 20px;\n"]);_templateObject3=function _templateObject3(){return data;};return data;}function _templateObject2(){var data=Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(["\n  text-align: center;\n"]);_templateObject2=function _templateObject2(){return data;};return data;}function _templateObject(){var data=Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(["\n  display: flex;\n"]);_templateObject=function _templateObject(){return data;};return data;}var PERIOD_TYPES=[{value:'daily',label:'Daily'},{value:'weekly',label:'Weekly'},{value:'monthly',label:'Monthly'},{value:'yearly',label:'Yearly'}];// init <select> dropdown values
var WEEKDAYS=indexLabels(moment__WEBPACK_IMPORTED_MODULE_4___default.a.weekdays());var MONTHS=indexLabels(moment__WEBPACK_IMPORTED_MODULE_4___default.a.monthsShort());var DAYS=indexLabels(ordinalNumbers(31));var HOURS=indexLabels(getHoursInDay(),0.5);var PeriodOptions=function PeriodOptions(props){return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_Select__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"],Object.assign({options:PERIOD_TYPES,autoFocus:true},props));};var WeekdayOptions=function WeekdayOptions(_ref){var value=_ref.value,_onChange=_ref.onChange;return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(Row,null,WEEKDAYS.map(function(weekday,index){return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(WeekdayOption,{key:index},react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(DayName,null,weekday.label[0]),react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core_Checkbox__WEBPACK_IMPORTED_MODULE_5___default.a,{checked:value[index],onChange:function onChange(){var nextValue=Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(value);nextValue[index]=!value[index];_onChange(nextValue);},color:"primary",style:{padding:10// paddingTop: 6,
}}));}));};var DayOptions=function DayOptions(props){return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_Select__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"],Object.assign({options:DAYS},props));};var HourOptions=function HourOptions(props){return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_Select__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"],Object.assign({options:HOURS},props));};var DateOptions=function DateOptions(_ref2){var _ref2$value=_ref2.value,day=_ref2$value.day,month=_ref2$value.month,_onChange2=_ref2.onChange;return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(Row,null,react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_Select__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"],{options:MONTHS,value:month,onChange:function onChange(month){return _onChange2({day:day,month:month});},style:{marginRight:16}}),react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_Select__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"],{options:DAYS,value:day,onChange:function onChange(day){return _onChange2({day:day,month:month});}}));};var Row=styled_components__WEBPACK_IMPORTED_MODULE_3__[/* default */ "d"].div(_templateObject());var WeekdayOption=styled_components__WEBPACK_IMPORTED_MODULE_3__[/* default */ "d"].div(_templateObject2());var DayName=styled_components__WEBPACK_IMPORTED_MODULE_3__[/* default */ "d"].div(_templateObject3());function indexLabels(array){var step=arguments.length>1&&arguments[1]!==undefined?arguments[1]:1;var items=[];for(var i=0;i<array.length;i++){items.push({value:i*step,label:array[i]});}return items;}function getHoursInDay(){var hours=[];for(var i=0;i<24;i++){var AMPM=i>=12?'pm':'am';var hour=i%12;if(hour===0){hour=12;}hours.push("".concat(hour,":00 ").concat(AMPM));hours.push("".concat(hour,":30 ").concat(AMPM));}return hours;}function ordinalNumbers(n){var nums=[];for(var i=1;i<=n;i++){nums.push(Object(_core_utils__WEBPACK_IMPORTED_MODULE_7__[/* ordinalNum */ "q"])(i));}return nums;}

/***/ }),

/***/ 385:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(7);

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return _Checkbox.default;
  }
});

var _Checkbox = _interopRequireDefault(__webpack_require__(386));

/***/ }),

/***/ 386:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(7);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.styles = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(12));

var _defineProperty2 = _interopRequireDefault(__webpack_require__(29));

var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(14));

var _react = _interopRequireDefault(__webpack_require__(0));

var _propTypes = _interopRequireDefault(__webpack_require__(2));

var _classnames = _interopRequireDefault(__webpack_require__(38));

var _SwitchBase = _interopRequireDefault(__webpack_require__(383));

var _CheckBoxOutlineBlank = _interopRequireDefault(__webpack_require__(387));

var _CheckBox = _interopRequireDefault(__webpack_require__(388));

var _IndeterminateCheckBox = _interopRequireDefault(__webpack_require__(389));

var _helpers = __webpack_require__(94);

var _withStyles = _interopRequireDefault(__webpack_require__(39));

var styles = function styles(theme) {
  return {
    /* Styles applied to the root element. */
    root: {
      color: theme.palette.text.secondary
    },

    /* Styles applied to the root element if `checked={true}`. */
    checked: {},

    /* Styles applied to the root element if `disabled={true}`. */
    disabled: {},

    /* Styles applied to the root element if `indeterminate={true}`. */
    indeterminate: {},

    /* Styles applied to the root element if `color="primary"`. */
    colorPrimary: {
      '&$checked': {
        color: theme.palette.primary.main
      },
      '&$disabled': {
        color: theme.palette.action.disabled
      }
    },

    /* Styles applied to the root element if `color="secondary"`. */
    colorSecondary: {
      '&$checked': {
        color: theme.palette.secondary.main
      },
      '&$disabled': {
        color: theme.palette.action.disabled
      }
    }
  };
};

exports.styles = styles;

function Checkbox(props) {
  var checkedIcon = props.checkedIcon,
      classes = props.classes,
      className = props.className,
      color = props.color,
      icon = props.icon,
      indeterminate = props.indeterminate,
      indeterminateIcon = props.indeterminateIcon,
      inputProps = props.inputProps,
      other = (0, _objectWithoutProperties2.default)(props, ["checkedIcon", "classes", "className", "color", "icon", "indeterminate", "indeterminateIcon", "inputProps"]);
  return _react.default.createElement(_SwitchBase.default, (0, _extends2.default)({
    type: "checkbox",
    checkedIcon: indeterminate ? indeterminateIcon : checkedIcon,
    className: (0, _classnames.default)((0, _defineProperty2.default)({}, classes.indeterminate, indeterminate), className),
    classes: {
      root: (0, _classnames.default)(classes.root, classes["color".concat((0, _helpers.capitalize)(color))]),
      checked: classes.checked,
      disabled: classes.disabled
    },
    inputProps: (0, _extends2.default)({
      'data-indeterminate': indeterminate
    }, inputProps),
    icon: indeterminate ? indeterminateIcon : icon
  }, other));
}

 false ? undefined : void 0;
Checkbox.defaultProps = {
  checkedIcon: _react.default.createElement(_CheckBox.default, null),
  color: 'secondary',
  icon: _react.default.createElement(_CheckBoxOutlineBlank.default, null),
  indeterminate: false,
  indeterminateIcon: _react.default.createElement(_IndeterminateCheckBox.default, null)
};

var _default = (0, _withStyles.default)(styles, {
  name: 'MuiCheckbox'
})(Checkbox);

exports.default = _default;

/***/ }),

/***/ 387:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(7);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(0));

var _pure = _interopRequireDefault(__webpack_require__(364));

var _SvgIcon = _interopRequireDefault(__webpack_require__(158));

var _ref = _react.default.createElement("path", {
  d: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
});
/**
 * @ignore - internal component.
 */


var CheckBoxOutlineBlank = function CheckBoxOutlineBlank(props) {
  return _react.default.createElement(_SvgIcon.default, props, _ref);
};

CheckBoxOutlineBlank = (0, _pure.default)(CheckBoxOutlineBlank);
CheckBoxOutlineBlank.muiName = 'SvgIcon';
var _default = CheckBoxOutlineBlank;
exports.default = _default;

/***/ }),

/***/ 388:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(7);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(0));

var _pure = _interopRequireDefault(__webpack_require__(364));

var _SvgIcon = _interopRequireDefault(__webpack_require__(158));

var _ref = _react.default.createElement("path", {
  d: "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
});
/**
 * @ignore - internal component.
 */


var CheckBox = function CheckBox(props) {
  return _react.default.createElement(_SvgIcon.default, props, _ref);
};

CheckBox = (0, _pure.default)(CheckBox);
CheckBox.muiName = 'SvgIcon';
var _default = CheckBox;
exports.default = _default;

/***/ }),

/***/ 389:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(7);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(0));

var _pure = _interopRequireDefault(__webpack_require__(364));

var _SvgIcon = _interopRequireDefault(__webpack_require__(158));

var _ref = _react.default.createElement("path", {
  d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"
});
/**
 * @ignore - internal component.
 */


var IndeterminateCheckBox = function IndeterminateCheckBox(props) {
  return _react.default.createElement(_SvgIcon.default, props, _ref);
};

IndeterminateCheckBox = (0, _pure.default)(IndeterminateCheckBox);
IndeterminateCheckBox.muiName = 'SvgIcon';
var _default = IndeterminateCheckBox;
exports.default = _default;

/***/ }),

/***/ 391:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}
// CONCATENATED MODULE: ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
// CONCATENATED MODULE: ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}
// CONCATENATED MODULE: ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _toConsumableArray; });



function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

/***/ }),

/***/ 514:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PeriodSelector; });
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(22);
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(15);
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(16);
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(18);
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(17);
/* harmony import */ var _Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(19);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(3);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(10);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _SnoozeModal__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(103);
/* harmony import */ var _material_ui_core_Collapse__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(120);
/* harmony import */ var _material_ui_core_Collapse__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_Collapse__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _periodOptions__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(384);
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(95);
function _templateObject4(){var data=Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(["\n  width: 100%;\n  margin-top: 10px;\n"]);_templateObject4=function _templateObject4(){return data;};return data;}function _templateObject3(){var data=Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(["\n  flex: 1;\n"]);_templateObject3=function _templateObject3(){return data;};return data;}function _templateObject2(){var data=Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(["\n  font-size: 20px;\n  margin-top: 24px;\n  margin-bottom: 6px;\n  text-align: center;\n  /* color: #999; */\n  color: ",";\n"]);_templateObject2=function _templateObject2(){return data;};return data;}function _templateObject(){var data=Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(["\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  /* justify-content: center; */\n  padding-top: 14px;\n"]);_templateObject=function _templateObject(){return data;};return data;}var PeriodSelector=/*#__PURE__*/function(_Component){Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"])(PeriodSelector,_Component);function PeriodSelector(props){var _this;Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(this,PeriodSelector);_this=Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(this,Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"])(PeriodSelector).call(this,props));// init with some values
_this.state={// init with some values
periodType:'weekly',selectedHour:9,// TODO: change this
selectedMonth:moment__WEBPACK_IMPORTED_MODULE_9___default()().month(),selectedDay:moment__WEBPACK_IMPORTED_MODULE_9___default()().date()-1,// date() counts from 1, 2 ...
selectedWeekdays:[false,false,false,false,false,false,false]};// auto select current day in the week
_this.state.selectedWeekdays[moment__WEBPACK_IMPORTED_MODULE_9___default()().weekday()]=true;return _this;}Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])(PeriodSelector,[{key:"onSnoozeClicked",value:function onSnoozeClicked(){var _this$state=this.state,periodType=_this$state.periodType,selectedHour=_this$state.selectedHour,selectedDay=_this$state.selectedDay,selectedMonth=_this$state.selectedMonth,selectedWeekdays=_this$state.selectedWeekdays;var snoozePeriod;if(periodType==='daily'){snoozePeriod={type:'daily',hour:selectedHour};}if(periodType==='weekly'){var daysIndexes=getSelectedWeekdaysIndexes(selectedWeekdays);// Must select at least one day
if(daysIndexes.length===0){return;}snoozePeriod={type:'weekly',hour:selectedHour,days:daysIndexes};}if(periodType==='monthly'){snoozePeriod={type:'monthly',hour:selectedHour,day:selectedDay};}if(periodType==='yearly'){snoozePeriod={type:'yearly',hour:selectedHour,date:[selectedMonth,selectedDay]};}if(!snoozePeriod){throw new Error('unrecognized periodType');}this.props.onPeriodSelected(snoozePeriod);}},{key:"render",value:function render(){var _this2=this;var visible=this.props.visible;var periodType=this.state.periodType;var bindField=function bindField(stateKey){return{value:_this2.state[stateKey],onChange:function onChange(eventOrValue){return _this2.setState(Object(_Users_work_Desktop_Extension_Projects_Work_tabsnooze_working_tab_snooze_extension_continued_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])({},stateKey,eventOrValue.target?eventOrValue.target.value:eventOrValue));}};};return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_SnoozeModal__WEBPACK_IMPORTED_MODULE_10__[/* default */ "a"],{visible:visible},react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(Root,null,react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(Title,null,"Wake up this tab"),react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_periodOptions__WEBPACK_IMPORTED_MODULE_12__[/* PeriodOptions */ "d"],bindField('periodType')),react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_core_Collapse__WEBPACK_IMPORTED_MODULE_11___default.a,{in:periodType==='weekly'},react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_7__["Fragment"],null,react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(Title,null,"on these days"),react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_periodOptions__WEBPACK_IMPORTED_MODULE_12__[/* WeekdayOptions */ "e"],bindField('selectedWeekdays')))),react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_core_Collapse__WEBPACK_IMPORTED_MODULE_11___default.a,{in:periodType==='monthly'},react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_7__["Fragment"],null,react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(Title,null,"on this day"),react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_periodOptions__WEBPACK_IMPORTED_MODULE_12__[/* DayOptions */ "b"],bindField('selectedDay')))),react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_material_ui_core_Collapse__WEBPACK_IMPORTED_MODULE_11___default.a,{in:periodType==='yearly'},react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_7__["Fragment"],null,react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(Title,null,"on this date"),react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_periodOptions__WEBPACK_IMPORTED_MODULE_12__[/* DateOptions */ "a"],{value:{day:this.state.selectedDay,month:this.state.selectedMonth},onChange:function onChange(_ref){var day=_ref.day,month=_ref.month;return _this2.setState({selectedDay:day,selectedMonth:month});}}))),react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(Title,null,"at this hour"),react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_periodOptions__WEBPACK_IMPORTED_MODULE_12__[/* HourOptions */ "c"],bindField('selectedHour')),react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(Spacer,null),react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(SaveButton,{onMouseDown:this.onSnoozeClicked.bind(this)},"SNOOZE")));}}]);return PeriodSelector;}(react__WEBPACK_IMPORTED_MODULE_7__["Component"]);function getSelectedWeekdaysIndexes(selectedWeekdays){return selectedWeekdays.map(function(y,i){return y?i:-1;}).filter(function(y){return y>=0;});}var Root=styled_components__WEBPACK_IMPORTED_MODULE_8__[/* default */ "d"].div(_templateObject());var Title=styled_components__WEBPACK_IMPORTED_MODULE_8__[/* default */ "d"].div(_templateObject2(),function(props){return props.theme.snoozePanel.footerTextColor;});var Spacer=styled_components__WEBPACK_IMPORTED_MODULE_8__[/* default */ "d"].div(_templateObject3());var SaveButton=Object(styled_components__WEBPACK_IMPORTED_MODULE_8__[/* default */ "d"])(_Button__WEBPACK_IMPORTED_MODULE_13__[/* default */ "a"])(_templateObject4());

/***/ })

}]);
//# sourceMappingURL=10.ec24f4a4.chunk.js.map