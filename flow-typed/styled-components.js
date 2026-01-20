declare module 'styled-components' {
  declare export default any;
  
  declare export var css: any;
  
  declare export var withTheme: any;
  declare export var keyframes: any;
  
  // declare export var ThemeProvider: any;
  // declare export var createGlobalStyle: any;
  // declare export var ServerStyleSheet: any;
  // declare export var StyleSheetManager: any;
  // declare export var ThemeConsumer: any;
  // declare export var ThemeContext: any;
}


// declare module 'styled-components' {
//   // Base styled component type
//   declare type StyledComponent<Props> = React$ComponentType<Props>;
  
//   // Template literal function type
//   declare type TaggedTemplateLiteral<Props> = (
//     strings: string[],
//     ...interpolations: Array<any>
//   ) => StyledComponent<Props>;
  
//   // Individual tag functions
//   declare type StyledTag = TaggedTemplateLiteral<any>;
  
//   // Main styled object with all HTML tags
//   declare type Styled = {
//     (tagName: string): StyledTag,
//     a: StyledTag,
//     abbr: StyledTag,
//     address: StyledTag,
//     area: StyledTag,
//     article: StyledTag,
//     aside: StyledTag,
//     audio: StyledTag,
//     b: StyledTag,
//     base: StyledTag,
//     bdi: StyledTag,
//     bdo: StyledTag,
//     big: StyledTag,
//     blockquote: StyledTag,
//     body: StyledTag,
//     br: StyledTag,
//     button: StyledTag,
//     canvas: StyledTag,
//     caption: StyledTag,
//     cite: StyledTag,
//     code: StyledTag,
//     col: StyledTag,
//     colgroup: StyledTag,
//     data: StyledTag,
//     datalist: StyledTag,
//     dd: StyledTag,
//     del: StyledTag,
//     details: StyledTag,
//     dfn: StyledTag,
//     dialog: StyledTag,
//     div: StyledTag,
//     dl: StyledTag,
//     dt: StyledTag,
//     em: StyledTag,
//     embed: StyledTag,
//     fieldset: StyledTag,
//     figcaption: StyledTag,
//     figure: StyledTag,
//     footer: StyledTag,
//     form: StyledTag,
//     h1: StyledTag,
//     h2: StyledTag,
//     h3: StyledTag,
//     h4: StyledTag,
//     h5: StyledTag,
//     h6: StyledTag,
//     head: StyledTag,
//     header: StyledTag,
//     hgroup: StyledTag,
//     hr: StyledTag,
//     html: StyledTag,
//     i: StyledTag,
//     iframe: StyledTag,
//     img: StyledTag,
//     input: StyledTag,
//     ins: StyledTag,
//     kbd: StyledTag,
//     keygen: StyledTag,
//     label: StyledTag,
//     legend: StyledTag,
//     li: StyledTag,
//     link: StyledTag,
//     main: StyledTag,
//     map: StyledTag,
//     mark: StyledTag,
//     menu: StyledTag,
//     menuitem: StyledTag,
//     meta: StyledTag,
//     meter: StyledTag,
//     nav: StyledTag,
//     noscript: StyledTag,
//     object: StyledTag,
//     ol: StyledTag,
//     optgroup: StyledTag,
//     option: StyledTag,
//     output: StyledTag,
//     p: StyledTag,
//     param: StyledTag,
//     picture: StyledTag,
//     pre: StyledTag,
//     progress: StyledTag,
//     q: StyledTag,
//     rp: StyledTag,
//     rt: StyledTag,
//     ruby: StyledTag,
//     s: StyledTag,
//     samp: StyledTag,
//     script: StyledTag,
//     section: StyledTag,
//     select: StyledTag,
//     small: StyledTag,
//     source: StyledTag,
//     span: StyledTag,
//     strong: StyledTag,
//     style: StyledTag,
//     sub: StyledTag,
//     summary: StyledTag,
//     sup: StyledTag,
//     table: StyledTag,
//     tbody: StyledTag,
//     td: StyledTag,
//     textarea: StyledTag,
//     tfoot: StyledTag,
//     th: StyledTag,
//     thead: StyledTag,
//     time: StyledTag,
//     title: StyledTag,
//     tr: StyledTag,
//     track: StyledTag,
//     u: StyledTag,
//     ul: StyledTag,
//     var: StyledTag,
//     video: StyledTag,
//     wbr: StyledTag,
//     // SVG tags
//     circle: StyledTag,
//     clipPath: StyledTag,
//     defs: StyledTag,
//     ellipse: StyledTag,
//     foreignObject: StyledTag,
//     g: StyledTag,
//     image: StyledTag,
//     line: StyledTag,
//     linearGradient: StyledTag,
//     mask: StyledTag,
//     path: StyledTag,
//     pattern: StyledTag,
//     polygon: StyledTag,
//     polyline: StyledTag,
//     radialGradient: StyledTag,
//     rect: StyledTag,
//     stop: StyledTag,
//     svg: StyledTag,
//     text: StyledTag,
//     tspan: StyledTag,
//   };
  
//   declare export default Styled;
//   declare export var css: any;
//   declare export var withTheme: any;
//   declare export var keyframes: any;
//   declare export var ThemeProvider: any;
// }