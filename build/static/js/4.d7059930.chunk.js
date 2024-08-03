(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4],{

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

/***/ 476:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/navbar_logo.d40b66c3.svg";

/***/ }),

/***/ 516:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js
var taggedTemplateLiteral = __webpack_require__(5);

// EXTERNAL MODULE: ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__(22);

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(0);
var react_default = /*#__PURE__*/__webpack_require__.n(react);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/styles/index.js
var core_styles = __webpack_require__(96);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/AppBar/index.js
var AppBar = __webpack_require__(472);
var AppBar_default = /*#__PURE__*/__webpack_require__.n(AppBar);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/Button/index.js
var Button = __webpack_require__(482);
var Button_default = /*#__PURE__*/__webpack_require__.n(Button);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/IconButton/index.js
var IconButton = __webpack_require__(98);
var IconButton_default = /*#__PURE__*/__webpack_require__.n(IconButton);

// EXTERNAL MODULE: ./node_modules/styled-components/dist/styled-components.browser.esm.js
var styled_components_browser_esm = __webpack_require__(3);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/Toolbar/index.js
var Toolbar = __webpack_require__(474);
var Toolbar_default = /*#__PURE__*/__webpack_require__.n(Toolbar);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/Settings.js
var Settings = __webpack_require__(127);
var Settings_default = /*#__PURE__*/__webpack_require__.n(Settings);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/OpenInNew.js
var OpenInNew = __webpack_require__(481);
var OpenInNew_default = /*#__PURE__*/__webpack_require__.n(OpenInNew);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/Hotel.js
var Hotel = __webpack_require__(372);
var Hotel_default = /*#__PURE__*/__webpack_require__.n(Hotel);

// EXTERNAL MODULE: ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(1);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
var asyncToGenerator = __webpack_require__(4);

// EXTERNAL MODULE: ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/classCallCheck.js
var classCallCheck = __webpack_require__(15);

// EXTERNAL MODULE: ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/createClass.js
var createClass = __webpack_require__(16);

// EXTERNAL MODULE: ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js + 1 modules
var possibleConstructorReturn = __webpack_require__(18);

// EXTERNAL MODULE: ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
var getPrototypeOf = __webpack_require__(17);

// EXTERNAL MODULE: ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/inherits.js + 1 modules
var inherits = __webpack_require__(19);

// EXTERNAL MODULE: ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
var assertThisInitialized = __webpack_require__(100);

// EXTERNAL MODULE: ./node_modules/react-helmet/lib/Helmet.js
var Helmet = __webpack_require__(365);

// EXTERNAL MODULE: ./src/core/wakeup.js
var wakeup = __webpack_require__(45);

// EXTERNAL MODULE: ./src/core/storage.js + 1 modules
var storage = __webpack_require__(13);

// EXTERNAL MODULE: ./node_modules/moment/moment.js
var moment = __webpack_require__(10);
var moment_default = /*#__PURE__*/__webpack_require__.n(moment);

// EXTERNAL MODULE: ./src/core/settings.js
var core_settings = __webpack_require__(20);

// CONCATENATED MODULE: ./src/components/OptionsPage/wakeupTimeRanges.js
function getWakeupTimeRanges(){return _getWakeupTimeRanges.apply(this,arguments);}function _getWakeupTimeRanges(){_getWakeupTimeRanges=Object(asyncToGenerator["a" /* default */])(/*#__PURE__*/regenerator_default.a.mark(function _callee(){var settings;return regenerator_default.a.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.next=2;return Object(core_settings["b" /* getSettings */])();case 2:settings=_context.sent;return _context.abrupt("return",[{title:'Today',maxDate:moment_default()().endOf('day'),dateFormat:'h:mm A'},{title:'Tomorrow',maxDate:moment_default()().add(1,'d').endOf('day')// dateFormat: 'h:mm a [tomorrow]',
},{title:'Later This Week',// TODO: Not sure what is it doing, but it uses weekday
// Which should be locale aware but is not.
maxDate:moment_default()().day(settings.weekEndDay).startOf('day')// before weekend
// dateFormat: 'dddd',
},{title:'This Weekend',maxDate:futureDay(settings.weekStartDay).startOf('day')// dateFormat: 'dddd',
},{title:'Next Week',maxDate:moment_default()().add(1,'week').endOf('week'),dateFormat:'dddd [at] h:mm A'},{title:'In Two Weeks',maxDate:moment_default()().add(2,'weeks').endOf('week'),dateFormat:'LL [at] h:mm A'},{title:'In Three Weeks',maxDate:moment_default()().add(3,'weeks').endOf('week'),dateFormat:'LL [at] h:mm A'},{title:'In One Month',maxDate:moment_default()().add(6,'weeks').endOf('week'),dateFormat:'LL [at] h:mm A'},{title:'In Two Months',maxDate:moment_default()().add(10,'weeks').endOf('week'),dateFormat:'LL [at] h:mm A'},{title:'In Three Months',maxDate:moment_default()().add(14,'weeks').endOf('week'),dateFormat:'LL [at] h:mm A'},{title:'In The Future',maxDate:moment_default()(9999999999999),// year 2286 .....
dateFormat:'LL'}]);case 4:case"end":return _context.stop();}}},_callee,this);}));return _getWakeupTimeRanges.apply(this,arguments);}function futureDay(day){var thisWeekDay=moment_default()().day(day);var now=moment_default()();return now.isBefore(thisWeekDay)?thisWeekDay:moment_default()().day(7+day);}
// EXTERNAL MODULE: ./src/core/utils.js
var utils = __webpack_require__(9);

// CONCATENATED MODULE: ./src/components/OptionsPage/groupSleepingTabs.js
// A tab group represents a collection of tabs that are in the same
// wakeup time range
function getSleepingTabByWakeupGroups(_x){return _getSleepingTabByWakeupGroups.apply(this,arguments);}function _getSleepingTabByWakeupGroups(){_getSleepingTabByWakeupGroups=Object(asyncToGenerator["a" /* default */])(/*#__PURE__*/regenerator_default.a.mark(function _callee(hidePeriodic){var snoozedTabs,timeRanges,visibleTabGroups;return regenerator_default.a.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.next=2;return Object(storage["b" /* getSnoozedTabs */])();case 2:snoozedTabs=_context.sent;_context.next=5;return getWakeupTimeRanges();case 5:timeRanges=_context.sent;visibleTabGroups=[];timeRanges.forEach(function(timeRange){var tabsInRange=[];for(var k=0;k<snoozedTabs.length;k++){var tab=snoozedTabs[k];if(moment_default()(tab.when).isBefore(timeRange.maxDate)){if(!tab.period||!hidePeriodic){tabsInRange.push(tab);}snoozedTabs.splice(snoozedTabs.indexOf(tab),1);k=k-1;}}// Don't show group if its empty
if(!tabsInRange.length){return;}// sort tabs in group by date
tabsInRange.sort(utils["f" /* compareTabs */]);// create s
var tabGroup={timeRange:timeRange,tabs:tabsInRange};visibleTabGroups.push(tabGroup);});return _context.abrupt("return",visibleTabGroups);case 9:case"end":return _context.stop();}}},_callee,this);}));return _getSleepingTabByWakeupGroups.apply(this,arguments);}
// EXTERNAL MODULE: ./node_modules/@material-ui/icons/Refresh.js
var Refresh = __webpack_require__(412);
var Refresh_default = /*#__PURE__*/__webpack_require__.n(Refresh);

// CONCATENATED MODULE: ./src/components/OptionsPage/formatWakeupDescription.js
function formatWakeupDescription(timeRange,tab){var wakeupDateText=formatWakeupTime(timeRange,tab);return tab.period?react_default.a.createElement(react["Fragment"],null,react_default.a.createElement(Refresh_default.a,{style:{marginRight:4}}),"".concat(formatWakeupPeriod(tab)," (Next: ").concat(wakeupDateText,")")):wakeupDateText;}function formatWakeupTime(timeRange,tab){var date=moment_default()(tab.when);var dateFormat=timeRange.dateFormat;if(dateFormat){return date.format(dateFormat);}return date.calendar();// return date.format('MMM D');
}function formatWakeupPeriod(tab){if(!tab.period){throw new Error('formatWakeupPeriod was called with a non-periodic tab');}var period=tab.period;var hourText=moment_default()(tab.when).format('h:mm a');if(period.type==='daily'){return'Every day at '+hourText;}if(period.type==='weekly'){var weekdayNames=moment_default.a.weekdaysShort();var weekdaysText=period.days.map(function(dayIndex){return weekdayNames[dayIndex];}).join(', ');return'Every '+weekdaysText+' at '+hourText;}if(period.type==='monthly'){return'Every month on the '+Object(utils["q" /* ordinalNum */])(period.day+1);}if(period.type==='yearly'){return'Every year on '+moment_default.a.monthsShort()[period.date[0]]+' '+Object(utils["q" /* ordinalNum */])(period.date[1]+1)+' at '+hourText;}// should never happen
throw new Error('formatWakeupPeriod did not recognize a period type');}
// EXTERNAL MODULE: ./node_modules/@material-ui/core/List/index.js
var List = __webpack_require__(380);
var List_default = /*#__PURE__*/__webpack_require__.n(List);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/ListItem/index.js
var ListItem = __webpack_require__(377);
var ListItem_default = /*#__PURE__*/__webpack_require__.n(ListItem);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/ListItemText/index.js
var ListItemText = __webpack_require__(379);
var ListItemText_default = /*#__PURE__*/__webpack_require__.n(ListItemText);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/ListSubheader/index.js
var ListSubheader = __webpack_require__(393);
var ListSubheader_default = /*#__PURE__*/__webpack_require__.n(ListSubheader);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/ListItemSecondaryAction/index.js
var ListItemSecondaryAction = __webpack_require__(395);
var ListItemSecondaryAction_default = /*#__PURE__*/__webpack_require__.n(ListItemSecondaryAction);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/Zoom/index.js
var Zoom = __webpack_require__(104);
var Zoom_default = /*#__PURE__*/__webpack_require__.n(Zoom);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/Fab/index.js
var Fab = __webpack_require__(422);
var Fab_default = /*#__PURE__*/__webpack_require__.n(Fab);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/Add.js
var Add = __webpack_require__(424);
var Add_default = /*#__PURE__*/__webpack_require__.n(Add);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/Delete.js
var Delete = __webpack_require__(420);
var Delete_default = /*#__PURE__*/__webpack_require__.n(Delete);

// EXTERNAL MODULE: ./node_modules/react-router-dom/es/Link.js
var Link = __webpack_require__(270);

// EXTERNAL MODULE: ./src/paths.js
var paths = __webpack_require__(8);

// EXTERNAL MODULE: ./src/core/analytics.js
var analytics = __webpack_require__(23);

// CONCATENATED MODULE: ./src/components/OptionsPage/SleepingTabsPage.js
function _templateObject3(){var data=Object(taggedTemplateLiteral["a" /* default */])(["\n  width: 32px;\n  height: 32px;\n  min-width: 32px;\n  align-self: flex-start;\n  margin-top: 8px;\n  border-radius: 3px;\n"]);_templateObject3=function _templateObject3(){return data;};return data;}function _templateObject2(){var data=Object(taggedTemplateLiteral["a" /* default */])(["\n  display: flex;\n  height: 100%;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  margin-top: 130px;\n\n  span {\n    font-size: 20px;\n    color: #bbb;\n  }\n  svg {\n    color: #e6e6e6;\n    width: 140px;\n    height: 140px;\n  }\n"]);_templateObject2=function _templateObject2(){return data;};return data;}function _templateObject(){var data=Object(taggedTemplateLiteral["a" /* default */])(["\n  padding-bottom: 50px;\n"]);_templateObject=function _templateObject(){return data;};return data;}// Adding chrome manually to global scope, for ESLint
var chrome=window.chrome;// A tab group represents a collection of tabs that are in the same
// wakeup time range
var SleepingTabsPage_styles=function styles(theme){return{list:{marginBottom:theme.spacing.unit*2},subHeader:{backgroundColor:theme.palette.background.paper,paddingLeft:theme.spacing.unit*3},listItemRoot:{paddingLeft:theme.spacing.unit*3},listItemContainer:{'&:hover $deleteBtn':{opacity:1}},deleteBtn:{transition:'opacity 0.2s',opacity:0,marginRight:theme.spacing.unit*2},fabButton:{zIndex:100,position:'fixed',bottom:theme.spacing.unit*3,right:theme.spacing.unit*3}};};var SleepingTabsPage_SleepingTabsPage=/*#__PURE__*/function(_Component){Object(inherits["a" /* default */])(SleepingTabsPage,_Component);function SleepingTabsPage(props){var _this;Object(classCallCheck["a" /* default */])(this,SleepingTabsPage);_this=Object(possibleConstructorReturn["a" /* default */])(this,Object(getPrototypeOf["a" /* default */])(SleepingTabsPage).call(this,props));_this.state={visibleTabGroups:null,hidePeriodic:false};_this.storageListener=_this.refreshSnoozedTabs.bind(Object(assertThisInitialized["a" /* default */])(Object(assertThisInitialized["a" /* default */])(_this)));// init
_this.refreshSnoozedTabs();// listen to storage changes
chrome.storage.onChanged.addListener(_this.storageListener);return _this;}Object(createClass["a" /* default */])(SleepingTabsPage,[{key:"componentDidMount",value:function componentDidMount(){Object(analytics["c" /* track */])(analytics["a" /* EVENTS */].SLEEPING_TABS_VIEW);}},{key:"componentWillUnmount",value:function componentWillUnmount(){chrome.storage.onChanged.removeListener(this.storageListener);}},{key:"refreshSnoozedTabs",value:function(){var _refreshSnoozedTabs=Object(asyncToGenerator["a" /* default */])(/*#__PURE__*/regenerator_default.a.mark(function _callee(){var hidePeriodic,visibleTabGroups;return regenerator_default.a.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:hidePeriodic=this.state.hidePeriodic;_context.next=3;return getSleepingTabByWakeupGroups(hidePeriodic);case 3:visibleTabGroups=_context.sent;this.setState({visibleTabGroups:visibleTabGroups});case 5:case"end":return _context.stop();}}},_callee,this);}));function refreshSnoozedTabs(){return _refreshSnoozedTabs.apply(this,arguments);}return refreshSnoozedTabs;}()},{key:"deleteTab",value:function deleteTab(tab,event){// so that openTab() won't be called
event.stopPropagation();setTimeout(function(){return Object(wakeup["a" /* deleteSnoozedTabs */])([tab]);},150);}},{key:"wakeupTab",value:function wakeupTab(tab,event){// animate tab out
var makeTabActive=!(event.which===2||event.button===4||event.metaKey);// delay wakeup for click ripple animation to finish
setTimeout(function(){return Object(wakeup["d" /* wakeupTabs */])([tab],makeTabActive);},300);}},{key:"renderTabGroup",value:function renderTabGroup(tabGroup,index){var _this2=this;var classes=this.props.classes;return react_default.a.createElement(react["Fragment"],{key:index},react_default.a.createElement(ListSubheader_default.a,{disableSticky:true,className:classes.subHeader},tabGroup.timeRange.title),tabGroup.tabs.map(function(tab,index2){return react_default.a.createElement(ListItem_default.a,{key:index2,button:true,classes:{root:classes.listItemRoot,container:classes.listItemContainer},onClick:function onClick(event){_this2.wakeupTab(tab,event);}},react_default.a.createElement(Icon,{src:tab.favicon,alt:""}),react_default.a.createElement(ListItemText_default.a,{primary:tab.title,secondary:formatWakeupDescription(tabGroup.timeRange,tab),primaryTypographyProps:{style:{lineHeight:1.5,marginBottom:3}}}),react_default.a.createElement(ListItemSecondaryAction_default.a,{className:classes.deleteBtn},react_default.a.createElement(IconButton_default.a,{onClick:function onClick(event){return _this2.deleteTab(tab,event);},"aria-label":"Delete"},react_default.a.createElement(Delete_default.a,null))));}));}},{key:"render",value:function render(){var visibleTabGroups=this.state.visibleTabGroups;var classes=this.props.classes;if(!visibleTabGroups){// avoid showing placeholder while loading, because
// it causes placeholder to flicker before the list renders on screen
return null;}return react_default.a.createElement(Root,null,react_default.a.createElement(Helmet["Helmet"],null,react_default.a.createElement("title",null,"Sleeping Tabs - Tab Snooze")),visibleTabGroups.length>0?react_default.a.createElement(List_default.a,{className:classes.list},visibleTabGroups.map(this.renderTabGroup.bind(this))):react_default.a.createElement(SleepingTabsPage_NoTabsPlaceholder,null),react_default.a.createElement(NewTodoBtn,null));}}]);return SleepingTabsPage;}(react["Component"]);var NewTodoBtn=Object(core_styles["withStyles"])(SleepingTabsPage_styles)(function(_ref){var classes=_ref.classes;return react_default.a.createElement(Zoom_default.a,{in:true,style:{transitionDelay:"500ms"}},react_default.a.createElement(Fab_default.a,{component:Link["a" /* default */],to:paths["q" /* TODO_PATH */],target:"_blank",color:"secondary","aria-label":"Add",className:classes.fabButton},react_default.a.createElement(Add_default.a,null)));});var SleepingTabsPage_NoTabsPlaceholder=function NoTabsPlaceholder(){return react_default.a.createElement(Placeholder,null,react_default.a.createElement(Hotel_default.a,null),react_default.a.createElement("span",null,"No tabs are sleeping"));};var Root=styled_components_browser_esm["d" /* default */].div(_templateObject());var Placeholder=styled_components_browser_esm["d" /* default */].div(_templateObject2());var Icon=styled_components_browser_esm["d" /* default */].img(_templateObject3());/* harmony default export */ var OptionsPage_SleepingTabsPage = (Object(core_styles["withStyles"])(SleepingTabsPage_styles)(SleepingTabsPage_SleepingTabsPage));
// EXTERNAL MODULE: ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread.js
var objectSpread = __webpack_require__(36);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/Audiotrack.js
var Audiotrack = __webpack_require__(455);
var Audiotrack_default = /*#__PURE__*/__webpack_require__.n(Audiotrack);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/WbSunny.js
var WbSunny = __webpack_require__(461);
var WbSunny_default = /*#__PURE__*/__webpack_require__.n(WbSunny);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/Weekend.js
var Weekend = __webpack_require__(464);
var Weekend_default = /*#__PURE__*/__webpack_require__.n(Weekend);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/Work.js
var Work = __webpack_require__(463);
var Work_default = /*#__PURE__*/__webpack_require__.n(Work);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/BeachAccess.js
var BeachAccess = __webpack_require__(466);
var BeachAccess_default = /*#__PURE__*/__webpack_require__.n(BeachAccess);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/Edit.js
var Edit = __webpack_require__(467);
var Edit_default = /*#__PURE__*/__webpack_require__.n(Edit);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/Keyboard.js
var Keyboard = __webpack_require__(468);
var Keyboard_default = /*#__PURE__*/__webpack_require__.n(Keyboard);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/Favorite.js
var Favorite = __webpack_require__(469);
var Favorite_default = /*#__PURE__*/__webpack_require__.n(Favorite);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/Star.js
var Star = __webpack_require__(402);
var Star_default = /*#__PURE__*/__webpack_require__.n(Star);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/RateReview.js
var RateReview = __webpack_require__(470);
var RateReview_default = /*#__PURE__*/__webpack_require__.n(RateReview);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/ContactSupport.js
var ContactSupport = __webpack_require__(471);
var ContactSupport_default = /*#__PURE__*/__webpack_require__.n(ContactSupport);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/Brightness2.js
var Brightness2 = __webpack_require__(462);
var Brightness2_default = /*#__PURE__*/__webpack_require__.n(Brightness2);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/Cloud.js
var Cloud = __webpack_require__(454);
var Cloud_default = /*#__PURE__*/__webpack_require__.n(Cloud);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/Looks5.js
var Looks5 = __webpack_require__(457);
var Looks5_default = /*#__PURE__*/__webpack_require__.n(Looks5);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/Alarm.js
var Alarm = __webpack_require__(458);
var Alarm_default = /*#__PURE__*/__webpack_require__.n(Alarm);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/InvertColors.js
var InvertColors = __webpack_require__(459);
var InvertColors_default = /*#__PURE__*/__webpack_require__.n(InvertColors);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/LocationOn.js
var LocationOn = __webpack_require__(460);
var LocationOn_default = /*#__PURE__*/__webpack_require__.n(LocationOn);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/LocalCafe.js
var LocalCafe = __webpack_require__(465);
var LocalCafe_default = /*#__PURE__*/__webpack_require__.n(LocalCafe);

// EXTERNAL MODULE: ./node_modules/@material-ui/icons/Notifications.js
var Notifications = __webpack_require__(456);
var Notifications_default = /*#__PURE__*/__webpack_require__.n(Notifications);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/ListItemIcon/index.js
var ListItemIcon = __webpack_require__(401);
var ListItemIcon_default = /*#__PURE__*/__webpack_require__.n(ListItemIcon);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/Switch/index.js
var Switch = __webpack_require__(452);
var Switch_default = /*#__PURE__*/__webpack_require__.n(Switch);

// EXTERNAL MODULE: ./src/components/SnoozePanel/Select.js
var Select = __webpack_require__(368);

// EXTERNAL MODULE: ./node_modules/chrome-promise/index.js
var chrome_promise = __webpack_require__(6);
var chrome_promise_default = /*#__PURE__*/__webpack_require__.n(chrome_promise);

// EXTERNAL MODULE: ./src/components/SnoozePanel/Button.js
var SnoozePanel_Button = __webpack_require__(95);

// CONCATENATED MODULE: ./src/components/OptionsPage/KeyCombo.js
function KeyCombo_templateObject3(){var data=Object(taggedTemplateLiteral["a" /* default */])(["\n  :after {\n    content: '+';\n  }\n  display: inline-block;\n  margin: 0 4px;\n"]);KeyCombo_templateObject3=function _templateObject3(){return data;};return data;}function KeyCombo_templateObject2(){var data=Object(taggedTemplateLiteral["a" /* default */])(["\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  color: #333;\n  padding: 4px 10px;\n"]);KeyCombo_templateObject2=function _templateObject2(){return data;};return data;}function KeyCombo_templateObject(){var data=Object(taggedTemplateLiteral["a" /* default */])(["\n  display: flex;\n  align-items: center;\n  color: #999;\n\n  background-color: #f1f3f4;\n  border: none;\n  border-radius: 4px;\n  padding: 6px;\n  margin-right: 12px;\n"]);KeyCombo_templateObject=function _templateObject(){return data;};return data;}/* harmony default export */ var KeyCombo = (function(props){return react_default.a.createElement(KeyCombo_Root,{onClick:props.onClick},props.combo?splitKeys(props.combo).map(function(key,index){return react_default.a.createElement(react["Fragment"],{key:key},index>0?react_default.a.createElement(Plus,null):'',react_default.a.createElement(Key,null,key));}):'Not Defined');});function splitKeys(keyCombo){// Windows and Mac Chrome act differently
// Windows retuns - 'Alt+S'
// Mac return - '⌥S'
var splitDelimiter=keyCombo.includes('+')?'+':'';return keyCombo.split(splitDelimiter);}var KeyCombo_Root=Object(styled_components_browser_esm["d" /* default */])(SnoozePanel_Button["a" /* default */]).attrs({color:'#F1F3F4'})(KeyCombo_templateObject());var Key=styled_components_browser_esm["d" /* default */].div(KeyCombo_templateObject2());var Plus=styled_components_browser_esm["d" /* default */].div(KeyCombo_templateObject3());
// EXTERNAL MODULE: ./src/core/badge.js
var badge = __webpack_require__(53);

// EXTERNAL MODULE: ./src/components/OptionsPage/ProBadge.js
var ProBadge = __webpack_require__(124);

// EXTERNAL MODULE: ./src/core/license.js
var license = __webpack_require__(40);

// CONCATENATED MODULE: ./src/components/OptionsPage/SettingsPage.js
function _templateObject6(){var data=Object(taggedTemplateLiteral["a" /* default */])(["\n  background-color: #f1f3f4;\n  border: none;\n  border-radius: 4px;\n  color: #333;\n  cursor: pointer;\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit;\n  outline: none;\n  padding-left: 5px;\n  width: ","px;\n  height: 40px;\n  margin-right: 12px;\n  :hover {\n    background-color: #e7e7e7;\n  }\n  :active {\n    background-color: #d0d0d0;\n  }\n"]);_templateObject6=function _templateObject6(){return data;};return data;}function _templateObject5(){var data=Object(taggedTemplateLiteral["a" /* default */])(["\n      pointer-events: none;\n      opacity: 0.5;\n      user-select: none;\n    "]);_templateObject5=function _templateObject5(){return data;};return data;}function _templateObject4(){var data=Object(taggedTemplateLiteral["a" /* default */])(["\n  ","\n"]);_templateObject4=function _templateObject4(){return data;};return data;}function SettingsPage_templateObject3(){var data=Object(taggedTemplateLiteral["a" /* default */])(["\n  padding: 8px 18px;\n  color: #555;\n  margin-right: 13px;\n"]);SettingsPage_templateObject3=function _templateObject3(){return data;};return data;}function SettingsPage_templateObject2(){var data=Object(taggedTemplateLiteral["a" /* default */])(["\n  /* display: flex; */\n  /* align-items: center; */\n  margin-top: 10px;\n"]);SettingsPage_templateObject2=function _templateObject2(){return data;};return data;}function SettingsPage_templateObject(){var data=Object(taggedTemplateLiteral["a" /* default */])([""]);SettingsPage_templateObject=function _templateObject(){return data;};return data;}// import UserIcon from '@material-ui/icons/AccountCircle';
var SettingsPage_styles=function styles(theme){return{list:{marginBottom:theme.spacing.unit*2}};};var SettingsPage_SettingsPage=/*#__PURE__*/function(_Component){Object(inherits["a" /* default */])(SettingsPage,_Component);function SettingsPage(props){var _this;Object(classCallCheck["a" /* default */])(this,SettingsPage);_this=Object(possibleConstructorReturn["a" /* default */])(this,Object(getPrototypeOf["a" /* default */])(SettingsPage).call(this,props));// init cache of settings in state
_this.state={};_this.loadSettings();// when user comes back from Shortcuts screen,
// we want the shortcuts to show fresh values
window.onfocus=_this.loadSettings.bind(Object(assertThisInitialized["a" /* default */])(Object(assertThisInitialized["a" /* default */])(_this)));return _this;}Object(createClass["a" /* default */])(SettingsPage,[{key:"componentDidMount",value:function componentDidMount(){Object(analytics["c" /* track */])(analytics["a" /* EVENTS */].SETTINGS_VIEW);}},{key:"componentWillUnmount",value:function componentWillUnmount(){window.onfocus=undefined;}},{key:"loadSettings",value:function(){var _loadSettings=Object(asyncToGenerator["a" /* default */])(/*#__PURE__*/regenerator_default.a.mark(function _callee(){var settings,commands,isPro;return regenerator_default.a.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.next=2;return Object(core_settings["b" /* getSettings */])();case 2:settings=_context.sent;_context.next=5;return chrome_promise_default.a.commands.getAll();case 5:commands=_context.sent;_context.next=8;return Object(license["e" /* isProUser */])();case 8:isPro=_context.sent;this.setState({settings:settings,commands:commands,isPro:isPro});case 10:case"end":return _context.stop();}}},_callee,this);}));function loadSettings(){return _loadSettings.apply(this,arguments);}return loadSettings;}()},{key:"bindSettings",value:function bindSettings(stateKey){var _this2=this,_ref;var valueProp=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'value';var currentSettings=this.state.settings;var value=currentSettings[stateKey];if(value===undefined){throw new Error("Tried to read a unknown settings key '".concat(stateKey,"'"));}return _ref={},Object(defineProperty["a" /* default */])(_ref,valueProp,value),Object(defineProperty["a" /* default */])(_ref,"onChange",function onChange(eventOrValue){var nextSettings=Object(objectSpread["a" /* default */])({},currentSettings,Object(defineProperty["a" /* default */])({},stateKey,eventOrValue.target?eventOrValue.target[valueProp]:eventOrValue));Object(core_settings["c" /* saveSettings */])(nextSettings);_this2.setState({settings:nextSettings});}),_ref;}},{key:"renderGeneralSetting",value:function renderGeneralSetting(options){return react_default.a.createElement(ListItem_default.a,{key:options.key,button:options.href!=null,component:options.href&&'a',href:options.href,target:options.href&&'_blank'},options.icon&&react_default.a.createElement(ListItemIcon_default.a,null,options.icon),react_default.a.createElement(ListItemText_default.a,{primary:options.title,secondary:options.description,inset:options.icon===undefined}),react_default.a.createElement(ListItemSecondaryAction_default.a,null,react_default.a.createElement(LockedContent,{locked:options.locked},options.component)));}},{key:"renderCheckboxSetting",value:function renderCheckboxSetting(options){return this.renderGeneralSetting(Object(objectSpread["a" /* default */])({},options,{component:react_default.a.createElement(Switch_default.a,this.bindSettings(options.stateKey,'checked'))}));}},{key:"renderDropdownSetting",value:function renderDropdownSetting(options){return this.renderGeneralSetting(Object(objectSpread["a" /* default */])({},options,{component:react_default.a.createElement(SettingsSelect,Object.assign({options:options.options},this.bindSettings(options.stateKey)))}));}},{key:"renderShortcutSetting",value:function renderShortcutSetting(options){return this.renderGeneralSetting(Object(objectSpread["a" /* default */])({},options,{key:options.key,component:react_default.a.createElement(KeyCombo,{combo:options.shortcut,onClick:function onClick(){return chrome_promise_default.a.tabs.create({url:paths["f" /* CHROME_SETTINGS_SHORTCUTS */]});}})}));}},{key:"renderButtonSetting",value:function renderButtonSetting(options){return this.renderGeneralSetting(Object(objectSpread["a" /* default */])({},options,{component:react_default.a.createElement("div",null)}));}},{key:"render",value:function render(){var _this3=this;var _this$state=this.state,settings=_this$state.settings,commands=_this$state.commands,isPro=_this$state.isPro;var classes=this.props.classes;if(!settings){return null;}var weekdayOptions=moment_default.a.weekdays().map(function(dayName,dayIndex){return{label:dayName,value:dayIndex};});return react_default.a.createElement(SettingsPage_Root,null,react_default.a.createElement(Helmet["Helmet"],null,react_default.a.createElement("title",null,"Settings - Tab Snooze")),react_default.a.createElement(List_default.a,{className:classes.list},!isPro&&react_default.a.createElement(react["Fragment"],null,react_default.a.createElement(Header,null,"Cloud Sync"),react_default.a.createElement(ListItem_default.a,null,react_default.a.createElement(ListItemIcon_default.a,null,react_default.a.createElement(Cloud_default.a,null)),react_default.a.createElement(ListItemText_default.a,{primary:react_default.a.createElement(react["Fragment"],null,"Tabs Sync & Backup ",react_default.a.createElement(ProBadge["a" /* default */],null)),secondary:"Disabled"}),react_default.a.createElement(ListItemSecondaryAction_default.a,null,react_default.a.createElement(LogInButton,{as:"a",href:Object(paths["u" /* getUpgradeUrl */])(),target:"_blank"},"Signup / Login")))),react_default.a.createElement(Header,null,"General"),this.renderCheckboxSetting({icon:react_default.a.createElement(Audiotrack_default.a,null),title:'Sound effects',description:'Play sounds with app interactions',stateKey:'playSoundEffects'}),this.renderCheckboxSetting({icon:react_default.a.createElement(Audiotrack_default.a,null),title:'Wake up sound',description:'Play a sound when tabs wake up',stateKey:'playNotificationSound'}),this.renderCheckboxSetting({icon:react_default.a.createElement(Notifications_default.a,null),title:'Wake up notification',description:'Show a desktop notification (top-right corner) when tabs wake up',stateKey:'showNotifications'}),this.renderDropdownSetting({icon:react_default.a.createElement(Looks5_default.a,null),title:'Toolbar badge',description:'Display a tab count on the toolbar moon icon',stateKey:'badge',options:[{label:'Hidden',value:badge["b" /* BADGE_HIDDEN */]},{label:'Tabs due today',value:badge["a" /* BADGE_DUE_TODAY */]},{label:'Total sleeping tabs',value:badge["c" /* BADGE_TOTAL_SNOOZED */]}]}),!isPro&&this.renderDropdownSetting({icon:react_default.a.createElement(Alarm_default.a,null),title:react_default.a.createElement(react["Fragment"],null,"Smart wakeup ",react_default.a.createElement(ProBadge["a" /* default */],null)),description:'Ask before waking up too many tabs',stateKey:'badge',// TODO: MUST CHANGE THIS
locked:!isPro,options:[4,5,6,7].map(function(num){return{label:'Disabled',// `${num} tabs`,
value:num};})}),!isPro&&this.renderGeneralSetting({icon:react_default.a.createElement(InvertColors_default.a,null),title:react_default.a.createElement(react["Fragment"],null,"Dark Mode ",react_default.a.createElement(ProBadge["a" /* default */],null)),locked:!isPro,description:'Switch on the elegant Tab Snooze dark theme',component:react_default.a.createElement(Switch_default.a,{checked:false})}),react_default.a.createElement(Header,null,"Preset Snooze Options"),!isPro&&this.renderGeneralSetting({icon:react_default.a.createElement(LocationOn_default.a,null),title:react_default.a.createElement(react["Fragment"],null,"Location Snooze ",react_default.a.createElement(ProBadge["a" /* default */],null)),locked:!isPro,description:'Snooze tabs to open when you get on your Home/Work device',component:react_default.a.createElement(Switch_default.a,{checked:false})}),this.renderDropdownSetting({icon:react_default.a.createElement(WbSunny_default.a,null),title:'Tomorrow starts at',stateKey:'workdayStart',options:[6,7,8,9,10,11].map(function(hour){return{label:"".concat(hour,":00 AM"),value:hour};})}),this.renderDropdownSetting({icon:react_default.a.createElement(Brightness2_default.a,null),title:'Evening starts at',stateKey:'workdayEnd',options:[15,16,17,18,19,20,21,22].map(function(hour){return{label:"".concat(hour-12,":00 PM"),value:hour};})}),this.renderDropdownSetting({icon:react_default.a.createElement(Work_default.a,null),title:'Week starts on',stateKey:'weekStartDay',options:weekdayOptions}),this.renderDropdownSetting({icon:react_default.a.createElement(Weekend_default.a,null),title:'Weekend starts on',stateKey:'weekEndDay',options:weekdayOptions}),this.renderDropdownSetting({icon:react_default.a.createElement(LocalCafe_default.a,null),title:'Later Today is',stateKey:'laterTodayHoursDelta',options:[1,2,3,4,5].map(function(hours){return{label:"in ".concat(hours," hours"),value:hours};})}),this.renderDropdownSetting({icon:react_default.a.createElement(BeachAccess_default.a,null),title:'Someday is',stateKey:'somedayMonthsDelta',options:[1,2,3,4,5].map(function(months){return{label:"in ".concat(months," months"),value:months};})}),!isPro&&react_default.a.createElement(react["Fragment"],null,react_default.a.createElement(Header,null,"Custom Snooze Options ",react_default.a.createElement(ProBadge["a" /* default */],null)),['Hours','Days','Weeks'].map(function(period,index){return _this3.renderGeneralSetting({key:String(index),icon:react_default.a.createElement(Edit_default.a,null),title:"Custom Snooze Option ".concat(index+1),stateKey:'somedayMonthsDelta',locked:true,component:react_default.a.createElement(react["Fragment"],null,react_default.a.createElement("span",{style:{marginRight:10}},"in"),react_default.a.createElement(SettingsSelect,{small:"true",options:[{value:2,label:'2'}]// {...this.bindSettings(options.stateKey)}
}),react_default.a.createElement(SettingsSelect,{small:"true",options:[{value:'days',label:period}]// {...this.bindSettings(options.stateKey)}
}))});})),react_default.a.createElement(Header,null,"Keyboard Shortcuts ",!isPro&&react_default.a.createElement(ProBadge["a" /* default */],null)),commands.map(function(command,index){return _this3.renderShortcutSetting({key:''+index,icon:react_default.a.createElement(Keyboard_default.a,null),// Hack! for some reason the main command (open popup)
// gets an empty description... so we add it here
title:command.description||'Snooze active tab',shortcut:isPro?command.shortcut:'',locked:!isPro});}),react_default.a.createElement(SettingsPage_EditShortcutsInstructions,null),react_default.a.createElement(Header,null,"Miscellaneous"),this.renderButtonSetting({icon:react_default.a.createElement(Star_default.a,null),title:'Loving Tab Snooze?',description:'Rate Tab Snooze the Chrome Web Store!',href:paths["g" /* CHROME_WEB_STORE_REVIEW */]}),this.renderButtonSetting({icon:react_default.a.createElement(Favorite_default.a,null),title:'Donate to support this free tool',description:'Support Tab Snooze single developer',href:paths["k" /* PAYPAL_DONATE_URL */]}),this.renderButtonSetting({icon:react_default.a.createElement(RateReview_default.a,null),title:'Suggest & vote on new features',description:'Tell us about your ideas for Tab Snooze',href:paths["p" /* TAB_SNOOZE_FEATURE_VOTE_URL */]}),this.renderButtonSetting({icon:react_default.a.createElement(ContactSupport_default.a,null),title:'Support',description:'Contact us for help, questions, or any feature requests',href:'mailto:tabsnoozeapp@gmail.com'})));}}]);return SettingsPage;}(react["Component"]);// const EditShortcutsInstructions = () => (
//   <ListItem>
//     <ListItemText
//       secondary={
//         <Fragment>
//           To edit the shortcuts{' '}
//           <MyLink
//             onClick={() =>
//               chromep.tabs.create({ url: CHROME_SETTINGS_SHORTCUTS })
//             }
//           >
//             please click here
//           </MyLink>
//         </Fragment>
//       }
//     />
//   </ListItem>
// );
var SettingsPage_EditShortcutsInstructions=function EditShortcutsInstructions(){return react_default.a.createElement(ListItem_default.a,null,react_default.a.createElement(ListItemText_default.a,{secondary:"Additionally, you can use Arrow keys, Numpad, and Capital letters (L-Later Today, etc.) in the Snooze Popup"}));};var SettingsPage_Root=styled_components_browser_esm["d" /* default */].div(SettingsPage_templateObject());// const MyLink = styled.a`
//   text-decoration: underline;
// `;
var Header=Object(styled_components_browser_esm["d" /* default */])(ListSubheader_default.a).attrs({disableSticky:true})(SettingsPage_templateObject2());var LogInButton=Object(styled_components_browser_esm["d" /* default */])(SnoozePanel_Button["a" /* default */]).attrs({color:'#eee'// raised: true,
})(SettingsPage_templateObject3());var LockedContent=styled_components_browser_esm["d" /* default */].div(_templateObject4(),function(props){return props.locked&&Object(styled_components_browser_esm["c" /* css */])(_templateObject5());});var SettingsSelect=Object(styled_components_browser_esm["d" /* default */])(Select["a" /* default */]).attrs({component:'select'})(_templateObject6(),function(props){return props.small?94:200;});/* harmony default export */ var OptionsPage_SettingsPage = (Object(core_styles["withStyles"])(SettingsPage_styles)(SettingsPage_SettingsPage));
// EXTERNAL MODULE: ./node_modules/react-router-dom/es/NavLink.js
var NavLink = __webpack_require__(508);

// EXTERNAL MODULE: ./node_modules/react-router-dom/es/Route.js + 2 modules
var Route = __webpack_require__(507);

// EXTERNAL MODULE: ./node_modules/@material-ui/core/Tooltip/index.js
var Tooltip = __webpack_require__(477);
var Tooltip_default = /*#__PURE__*/__webpack_require__.n(Tooltip);

// CONCATENATED MODULE: ./src/components/OptionsPage/OptionsPage.js
function OptionsPage_templateObject6(){var data=Object(taggedTemplateLiteral["a" /* default */])(["\n      background-color: #0000001f !important;\n    "]);OptionsPage_templateObject6=function _templateObject6(){return data;};return data;}function OptionsPage_templateObject5(){var data=Object(taggedTemplateLiteral["a" /* default */])(["\n  margin-left: 10px !important;\n\n  &.linkIsActive {\n    background-color: #0000001f !important;\n  }\n  ","\n"]);OptionsPage_templateObject5=function _templateObject5(){return data;};return data;}function OptionsPage_templateObject4(){var data=Object(taggedTemplateLiteral["a" /* default */])(["\n  /* min-width: 600px; */\n  min-height: 500px;\n\n  /* For wide screen */\n  width: 600px;\n"]);OptionsPage_templateObject4=function _templateObject4(){return data;};return data;}function OptionsPage_templateObject3(){var data=Object(taggedTemplateLiteral["a" /* default */])(["\n  flex: 1;\n"]);OptionsPage_templateObject3=function _templateObject3(){return data;};return data;}function OptionsPage_templateObject2(){var data=Object(taggedTemplateLiteral["a" /* default */])(["\n  height: 34px;\n  margin-right: 14px;\n"]);OptionsPage_templateObject2=function _templateObject2(){return data;};return data;}function OptionsPage_templateObject(){var data=Object(taggedTemplateLiteral["a" /* default */])(["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n"]);OptionsPage_templateObject=function _templateObject(){return data;};return data;}var OptionsPage_styles=function styles(theme){return{navIcon:{marginRight:10},openInTabBtn:Object(defineProperty["a" /* default */])({color:'#fff',display:'none',marginRight:-10},theme.breakpoints.down(650),{display:'block'})};};function OptionsPage(props){var classes=props.classes,location=props.location;return react_default.a.createElement(react["Fragment"],null,react_default.a.createElement(AppBar_default.a,{position:"fixed"},react_default.a.createElement(Toolbar_default.a,null,react_default.a.createElement("a",{href:paths["r" /* TS_HOMEPAGE_URL */],target:"_blank",rel:"noopener noreferrer"},react_default.a.createElement(Logo,{src:__webpack_require__(476)})),react_default.a.createElement(NavButton,{component:NavLink["a" /* default */],to:paths["o" /* SLEEPING_TABS_PATH */]},react_default.a.createElement(Hotel_default.a,{className:classes.navIcon})," Sleeping Tabs"),react_default.a.createElement(NavButton,{component:NavLink["a" /* default */],to:paths["n" /* SETTINGS_PATH */]},react_default.a.createElement(Settings_default.a,{className:classes.navIcon})," Settings"),react_default.a.createElement(Spacer,null),react_default.a.createElement(Tooltip_default.a,{title:"Open in a tab"},react_default.a.createElement(IconButton_default.a,{component:NavLink["a" /* default */],to:location.pathname,target:"_blank",className:classes.openInTabBtn},react_default.a.createElement(OpenInNew_default.a,null))))),react_default.a.createElement(OptionsPage_Root,null,react_default.a.createElement(Toolbar_default.a,{style:{opacity:0}}),react_default.a.createElement(Main,null,react_default.a.createElement(Route["a" /* default */],{path:paths["o" /* SLEEPING_TABS_PATH */],component:OptionsPage_SleepingTabsPage}),react_default.a.createElement(Route["a" /* default */],{path:paths["n" /* SETTINGS_PATH */],component:OptionsPage_SettingsPage}))));}/* harmony default export */ var OptionsPage_OptionsPage = (Object(core_styles["withStyles"])(OptionsPage_styles)(OptionsPage));var OptionsPage_Root=styled_components_browser_esm["d" /* default */].div(OptionsPage_templateObject());var Logo=styled_components_browser_esm["d" /* default */].img(OptionsPage_templateObject2());var Spacer=styled_components_browser_esm["d" /* default */].div(OptionsPage_templateObject3());var Main=styled_components_browser_esm["d" /* default */].div(OptionsPage_templateObject4());var NavButton=Object(styled_components_browser_esm["d" /* default */])(Button_default.a).attrs({activeClassName:'linkIsActive',replace:true})(OptionsPage_templateObject5(),function(props){return props.active&&Object(styled_components_browser_esm["c" /* css */])(OptionsPage_templateObject6());});
// CONCATENATED MODULE: ./src/components/OptionsPage/index.js
/* concated harmony reexport default */__webpack_require__.d(__webpack_exports__, "default", function() { return OptionsPage_OptionsPage; });


/***/ })

}]);
//# sourceMappingURL=4.d7059930.chunk.js.map