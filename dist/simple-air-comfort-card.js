/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new r(i,t,s)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:c,getPrototypeOf:m}=Object,u=globalThis,p=u.trustedTypes,_=p?p.emptyScript:"",g=u.reactiveElementPolyfillSupport,f=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},$=(t,e)=>!a(t,e),y={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const n=i?.call(this);r?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=m(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...d(t),...c(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),r=t.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:b).toAttribute(e,s.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=i;const n=r.fromAttribute(e,t.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){const i=this.constructor,r=this[t];if(s??=i.getPropertyOptions(t),!((s.hasChanged??$)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[f("elementProperties")]=new Map,v[f("finalized")]=new Map,g?.({ReactiveElement:v}),(u.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,x=w.trustedTypes,A=x?x.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+S,N=`<${E}>`,k=document,P=()=>k.createComment(""),F=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,M="[ \t\n\f\r]",O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,H=/>/g,z=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,D=/"/g,L=/^(?:script|style|textarea|title)$/i,q=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),I=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),B=new WeakMap,V=k.createTreeWalker(k,129);function W(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const G=(t,e)=>{const s=t.length-1,i=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=O;for(let e=0;e<s;e++){const s=t[e];let a,l,h=-1,d=0;for(;d<s.length&&(o.lastIndex=d,l=o.exec(s),null!==l);)d=o.lastIndex,o===O?"!--"===l[1]?o=U:void 0!==l[1]?o=H:void 0!==l[2]?(L.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=z):void 0!==l[3]&&(o=z):o===z?">"===l[0]?(o=r??O,h=-1):void 0===l[1]?h=-2:(h=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?z:'"'===l[3]?D:R):o===D||o===R?o=z:o===U||o===H?o=O:(o=z,r=void 0);const c=o===z&&t[e+1].startsWith("/>")?" ":"";n+=o===O?s+N:h>=0?(i.push(a),s.slice(0,h)+C+s.slice(h)+S+c):s+S+(-2===h?e:c)}return[W(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Y{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[l,h]=G(t,e);if(this.el=Y.createElement(l,s),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=V.nextNode())&&a.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(C)){const e=h[n++],s=i.getAttribute(t).split(S),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:s,ctor:"."===o[1]?X:"?"===o[1]?tt:"@"===o[1]?et:Q}),i.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:r}),i.removeAttribute(t));if(L.test(i.tagName)){const t=i.textContent.split(S),e=t.length-1;if(e>0){i.textContent=x?x.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],P()),V.nextNode(),a.push({type:2,index:++r});i.append(t[e],P())}}}else if(8===i.nodeType)if(i.data===E)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(S,t+1));)a.push({type:7,index:r}),t+=S.length-1}r++}}static createElement(t,e){const s=k.createElement("template");return s.innerHTML=t,s}}function J(t,e,s=t,i){if(e===I)return e;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const n=F(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(e=J(t,r._$AS(t,e.values),r,i)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??k).importNode(e,!0);V.currentNode=i;let r=V.nextNode(),n=0,o=0,a=s[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Z(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new st(r,this,t)),this._$AV.push(e),a=s[++o]}n!==a?.index&&(r=V.nextNode(),n++)}return V.currentNode=k,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),F(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==I&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==j&&F(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Y.createElement(W(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new K(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=B.get(t.strings);return void 0===e&&B.set(t.strings,e=new Y(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new Z(this.O(P()),this.O(P()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=j}_$AI(t,e=this,s,i){const r=this.strings;let n=!1;if(void 0===r)t=J(this,t,e,0),n=!F(t)||t!==this._$AH&&t!==I,n&&(this._$AH=t);else{const i=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=J(this,i[s+o],e,o),a===I&&(a=this._$AH[o]),n||=!F(a)||a!==this._$AH[o],a===j?t=j:t!==j&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!i&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class X extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}class tt extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==j)}}class et extends Q{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??j)===I)return;const s=this._$AH,i=t===j&&s!==j||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==j&&(s===j||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const it=w.litHtmlPolyfillSupport;it?.(Y,Z),(w.litHtmlVersions??=[]).push("3.3.1");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class nt extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=s?.renderBefore??null;i._$litPart$=r=new Z(e.insertBefore(P(),t),t,void 0,s??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}}nt._$litElement$=!0,nt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:nt});const ot=rt.litElementPolyfillSupport;ot?.({LitElement:nt}),(rt.litElementVersions??=[]).push("4.2.1");class at extends nt{static properties={hass:{type:Object},_config:{state:!0},_isNarrow:{state:!0}};constructor(){super(),this._isNarrow=!1,this._resizeObsInitialized=!1,this._resizeObs=null}static styles=n`
  :host {
    display: block;            /* participate in layout */
  }

  ha-card {
    position: relative;
    padding: 0;
    overflow: hidden;
    isolation: isolate;        /* keep shadows inside */
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--sac-temp-bg, #2a2a2a);  /* you set this inline in render */
    box-sizing: border-box;

    /* IMPORTANT: let the Sections grid cell define height; do not force 100% */
    min-height: 0;             /* prevents overflow in tight cells */
  }

  /* Fills the card area. This is the bounding box we fit our square into. */
  .cell {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  /* Perfect square that auto-scales to the smaller of width/height, centered. */
  .square {
    position: absolute;
    inset: 0;
    margin: auto;             /* centers both axes */
    max-width: 100%;
    max-height: 100%;
    aspect-ratio: 1 / 1;      /* the magic: keeps it square */
    box-sizing: border-box;
  }

  /* Your existing canvas now just fills the square. */
  .canvas {
    position: absolute;
    inset: 0;
    background: transparent;  /* keep card background visible on ha-card */
    padding: 14px 12px 12px;  /* your inner spacing */
    box-sizing: border-box;
  }

  /* Header (unchanged) */
  .header {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
    text-align: center;
    pointer-events: none;
  }
  .title {
    font-weight: 700;
    font-size: 1.05rem;
    color: white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.35);
    line-height: 1.15;
  }
  .subtitle {
    font-weight: 600;
    font-size: 0.9rem;
    color: silver;
    margin-top: 0.15rem;
  }

  /* Four corners (unchanged) */
  .corner {
    position: absolute;
    color: white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.35);
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .corner .label { font-size: 0.75rem; opacity: 0.85; display: block; font-weight: 600; }
  .corner .value { font-size: 1.05rem; }
  .tl { left: 8%;  top: 18%; transform: translate(0,-50%);  text-align: left;  }
  .tr { right: 8%; top: 18%; transform: translate(0,-50%);  text-align: right; }
  .bl { left: 8%;  bottom: 8%; text-align: left;  }
  .br { right: 8%; bottom: 8%; text-align: right; }

  /* Center graphic (unchanged sizes are fine) */
  .graphic {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 56%; height: 56%;
    min-width: 120px; min-height: 120px;
  }

  .axis {
    position: absolute; color: rgba(255,255,255,0.92);
    font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.45);
    pointer-events: none;
  }
  .axis-top    { top: -12px; left: 50%; transform: translate(-50%, -50%); }
  .axis-bottom { bottom: -12px; left: 50%; transform: translate(-50%,  50%); }
  .axis-left   { left: -20px;  top: 50%;  transform: translate(-50%, -50%) rotate(180deg); writing-mode: vertical-rl; }
  .axis-right  { right: -20px; top: 50%;  transform: translate( 50%, -50%); writing-mode: vertical-rl; }

  .outer-ring {
    position: absolute; inset: 0; border-radius: 50%;
    border: 2.5px solid white;
    background: var(--sac-dewpoint-ring, radial-gradient(circle, dimgray, 55%, rgba(100,100,100,0.15), rgba(100,100,100,0.15)));
    /* halo is injected inline via style attr in render() */
  }

  .inner-circle {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: 46.5%; height: 46.5%; border-radius: 50%;
    background: var(--sac-inner-gradient, radial-gradient(circle, black 0%, black 60%));
    box-shadow: inset 0 0 12px rgba(0,0,0,0.6);
  }

  .dot {
    position: absolute;
    width: 15%; height: 15%; border-radius: 50%;
    background: white; box-shadow: 0 0 6px rgba(0,0,0,0.45);
    transform: translate(-50%, 50%);
    transition: left 0.8s ease-in-out, bottom 0.8s ease-in-out;
    z-index: 2;
  }

  .dot.outside::before {
    content: "";
    position: absolute; inset: -20%;
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba(255,0,0,0.8) 20%,
      rgba(255,0,0,0.3) 50%,
      rgba(255,0,0,0.1) 70%,
      rgba(255,0,0,0)   100%
    );
    animation: sac-blink 1s infinite alternate;
    z-index: -1;
  }
  @keyframes sac-blink { 0% { opacity: 1; } 100% { opacity: 0.3; } }
`;setConfig(t){if(!t||!t.temperature||!t.humidity)throw new Error('simple-air-comfort-card: "temperature" and "humidity" entities are required.');const e=t=>null==t||""===t?NaN:Number(t),s=Number.isFinite(e(t.temp_min))?e(t.temp_min):15,i=Number.isFinite(e(t.temp_max))?e(t.temp_max):35;if(i<=s)throw new Error("simple-air-comfort-card: temp_max must be greater than temp_min.");this._config={name:t.name??"Air Comfort",temperature:t.temperature,humidity:t.humidity,windspeed:t.windspeed,decimals:Number.isFinite(e(t.decimals))?e(t.decimals):1,default_wind_speed:Number.isFinite(e(t.default_wind_speed))?e(t.default_wind_speed):0,temp_min:s,temp_max:i,size_mode:"large"===t.size_mode||"small"===t.size_mode?t.size_mode:"large",large_columns:Number.isFinite(e(t.large_columns))?e(t.large_columns):12,large_rows:Number.isFinite(e(t.large_rows))?e(t.large_rows):8,small_columns:Number.isFinite(e(t.small_columns))?e(t.small_columns):6,small_rows:Number.isFinite(e(t.small_rows))?e(t.small_rows):4}}render(){if(!this.hass||!this._config)return q``;const t=this.hass.states[this._config.temperature],e=this.hass.states[this._config.humidity],s=this._config.windspeed?this.hass.states[this._config.windspeed]:void 0;if(!t||!e)return q`<ha-card>
        <div class="ratio">
          <div class="canvas">
            <div class="header">
              <div class="title">${this._config.name??"Air Comfort"}</div>
              <div class="subtitle">Entity not found: ${t?this._config.humidity:this._config.temperature}</div>
            </div>
          </div>
        </div>
      </ha-card>`;const i=(t.attributes.unit_of_measurement||"°C").trim(),r=t.state,n=e.state,o=this.#t(Number.isFinite(+r)?+r:NaN,i),a=this.#e(Number.isFinite(+n)?+n:NaN),l=this.#s(s,this._config.default_wind_speed),h=a/100*this.#i(o),d=this.#r(h),c=this.#n(o,h,l),m=this.#o(d),u=this.#a(o),p=this.#l(a),_=this.#h(o),g=this.#d(m),f=this.#c(a,o),{temp_min:b,temp_max:$}=this._config,y=this.#m(o,b,$,0,100),v=this.#u(a+.5,0,100),w=a<40||a>60||o<18||o>26.4,x=this._config.decimals,A=i,C=this.#p(this.#_(d,A),x)+` ${A}`,S=this.#p(this.#_(c,A),x)+` ${A}`;return q`
      <ha-card style="--sac-temp-bg:${_}">
        <div class="cell">
          <div class="square">
            <div class="canvas">
              <!-- your existing header/corners/graphic elements unchanged -->
              <div class="header">
                <div class="title">${this._config.name??"Air Comfort"}</div>
                <div class="subtitle">${m}</div>
              </div>

              <div class="corner tl"><span class="label">Dew point</span><span class="value">${C}</span></div>
              <div class="corner tr"><span class="label">Feels like</span><span class="value">${S}</span></div>
              <div class="corner bl"><span class="label">Temperature</span><span class="value">${u}</span></div>
              <div class="corner br"><span class="label">Humidity</span><span class="value">${p}</span></div>

              <div class="graphic" style="--sac-dewpoint-ring:${g}; --sac-inner-gradient:${f}">
                <div class="axis axis-top">Warm</div>
                <div class="axis axis-bottom">Cold</div>
                <div class="axis axis-left">Dry</div>
                <div class="axis axis-right">Humid</div>
                <div class="outer-ring" style="box-shadow:${this.#g(m)}"></div>
                <div class="inner-circle"></div>
                <div class="dot ${w?"outside":""}" style="left:${v}%; bottom:${y}%;"></div>
              </div>
            </div>
          </div>
        </div>
      </ha-card>
    `}getCardSize(){return 10}getGridOptions(){const t=this._config??{},e=Number.isFinite(t.large_columns)?t.large_columns:12,s=Number.isFinite(t.large_rows)?t.large_rows:8,i=Number.isFinite(t.small_columns)?t.small_columns:6,r=Number.isFinite(t.small_rows)?t.small_rows:4;return"small"===("small"===t.size_mode||"large"===t.size_mode?t.size_mode:"large")?{columns:i,rows:r,min_columns:i,min_rows:r,max_columns:i,max_rows:r}:{columns:e,rows:s,min_columns:e,min_rows:s,max_columns:e,max_rows:s}}#n(t,e,s){return t+.33*e-.7*s-4}#i(t){return Number.isFinite(t)?t>=0?6.1121*Math.exp(t/(257.14+t)*(18.678-t/234.5)):6.1115*Math.exp(t/(279.82+t)*(23.036-t/333.7)):NaN}#r(t){if(!Number.isFinite(t)||t<=0)return NaN;let e=-80,s=60,i=0;for(let r=0;r<60;r++){i=(e+s)/2;const r=this.#i(i);if(!Number.isFinite(r))break;if(r>t?s=i:e=i,Math.abs(s-e)<1e-4)break}return i}#o(t){return Number.isFinite(t)?t<5?"Very Dry":t>=5&&t<=10?"Dry":t>=10.1&&t<=12.79?"Pleasant":t>=12.8&&t<=15.49?"Comfortable":t>=15.5&&t<=18.39?"Sticky Humid":t>=18.4&&t<=21.19?"Muggy":t>=21.2&&t<=23.9?"Sweltering":"Stifling":"Unknown"}#a(t){return Number.isFinite(t)?t<3?"FROSTY":t>=3.1&&t<=4.99?"COLD":t>=5&&t<=8.99?"CHILLY":t>=9&&t<=13.99?"COOL":t>=14&&t<=18.99?"MILD":t>=19&&t<=23.99?"PERFECT":t>=24&&t<=27.99?"WARM":t>=28&&t<=34.99?"HOT":"BOILING":"N/A"}#l(t){return Number.isFinite(t)?t<40?"DRY":t<=60?"COMFY":"HUMID":"N/A"}#f(t){return Number.isFinite(t)?t<3?"frosty":t<=4.99?"cold":t<=8.99?"chilly":t<=13.99?"cool":t<=18.99?"mild":t<=23.99?"perfect":t<=27.99?"warm":t<=34.99?"hot":"boiling":"n/a"}#b(t){const e=String(t||"").toLowerCase();return"frosty"===e?"mediumblue":"cold"===e?"dodgerblue":"chilly"===e?"deepskyblue":"cool"===e?"mediumaquamarine":"mild"===e?"seagreen":"perfect"===e?"limegreen":"warm"===e?"gold":"hot"===e?"orange":"boiling"===e?"crimson":"dimgray"}#h(t){const e=this.#f(t);return`radial-gradient(circle, rgba(100,100,100,0.15), rgba(100,100,100,0.15), rgba(100,100,100,0.15), ${this.#b(e)})`}#g(t){return`box-shadow:\n      0 0 0 3px white inset,\n      0 0 18px 6px ${{Unknown:"dimgray",Unavailable:"dimgray","Very Dry":"deepskyblue",Dry:"mediumaquamarine",Pleasant:"limegreen",Comfortable:"yellowgreen","Sticky Humid":"yellow",Muggy:"gold",Sweltering:"orange",Stifling:"crimson"}[t]||"rgba(100,100,100,0.15)"},\n      0 0 22px 10px rgba(0,0,0,0.25)`}#d(t){const e=(t=>{switch(t){case"Very Dry":return"deepskyblue";case"Dry":return"mediumaquamarine";case"Pleasant":return"limegreen";case"Comfortable":return"yellowgreen";case"Sticky Humid":return"yellow";case"Muggy":return"gold";case"Sweltering":return"orange";case"Stifling":return"crimson";default:return"dimgray"}})(t||"Unknown");return`radial-gradient(circle, ${e}, 55%, rgba(100,100,100,0.15), rgba(100,100,100,0.15))`}#c(t,e){let s="black";Number.isFinite(t)?(t<40||t>60)&&(s="hotpink"):s="dimgray";let i="dimgray";return Number.isFinite(e)?e>34.9||e>26.5&&e<=34.9?i="rgba(255, 69, 0, 0.8)":e>24&&e<=26.5||e>19&&e<=24?i="dimgray":(e>14&&e<=19||e>9&&e<=14||e>5&&e<=9||e>3&&e<=5||e<=3)&&(i="rgba(0, 102, 255, 0.8)"):i="dimgray",`radial-gradient(circle, ${s} 0%, black, ${i} 70%)`}#u(t,e,s){return Math.min(s,Math.max(e,t))}#m(t,e,s,i,r){if(!Number.isFinite(t))return(i+r)/2;const n=(t-e)/(s-e);return this.#u(i+n*(r-i),i,r)}#e(t){return Number.isFinite(t)?Math.min(100,Math.max(0,t)):NaN}#t(t,e){if(!Number.isFinite(t))return NaN;return(e||"").toLowerCase().includes("f")?5/9*(t-32):t}#_(t,e){const s=(e||"").toLowerCase();return Number.isFinite(t)?s.includes("f")?9*t/5+32:t:NaN}#s(t,e){if(!t)return e??0;const s=parseFloat(t.state);if(!Number.isFinite(s))return e??0;const i=(t.attributes.unit_of_measurement||"m/s").toLowerCase();return i.includes("m/s")?s:i.includes("km/h")||i.includes("kph")?s/3.6:i.includes("mph")?.44704*s:i.includes("kn")?.514444*s:s}#$(t,e=1){if(!Number.isFinite(t))return NaN;const s=Math.pow(10,e);return Math.round(t*s)/s}#p(t,e=1){return Number.isFinite(t)?this.#$(t,e).toLocaleString(void 0,{minimumFractionDigits:e,maximumFractionDigits:e}):"—"}set hass(t){this._hass=t,this.requestUpdate()}get hass(){return this._hass}static getConfigElement(){return document.createElement("simple-air-comfort-card-editor")}static getStubConfig(){return{name:"Air Comfort",temperature:"sensor.temperature",humidity:"sensor.humidity",decimals:1,default_wind_speed:0,temp_min:15,temp_max:35}}}customElements.define("simple-air-comfort-card",at),window.customCards=window.customCards||[],window.customCards.push({type:"simple-air-comfort-card",name:"Simple Air Comfort Card",description:"Australian BoM apparent temperature + dew point (Arden Buck). Indoor-friendly defaults, macro-matched visuals.",preview:!0});class lt extends nt{static properties={hass:{type:Object},_config:{state:!0},_schema:{state:!0}};static styles=n`
    .wrap { padding: 8px 12px 16px; }
  `;connectedCallback(){super.connectedCallback(),window.loadCardHelpers?.().catch(()=>{})}set hass(t){this._hass=t,this.requestUpdate()}get hass(){return this._hass}setConfig(t){this._config={name:"Air Comfort",temperature:void 0,humidity:void 0,windspeed:void 0,decimals:1,default_wind_speed:0,temp_min:15,temp_max:35,size_mode:t?.size_mode??"auto",large_columns:Number.isFinite(t?.large_columns)?t.large_columns:12,large_rows:Number.isFinite(t?.large_rows)?t.large_rows:8,small_columns:Number.isFinite(t?.small_columns)?t.small_columns:6,small_rows:Number.isFinite(t?.small_rows)?t.small_rows:4,auto_breakpoint_px:Number.isFinite(t?.auto_breakpoint_px)?t.auto_breakpoint_px:360,...t??{}},this._schema=[{name:"name",selector:{text:{}}},{name:"temperature",required:!0,selector:{entity:{domain:"sensor"}}},{name:"humidity",required:!0,selector:{entity:{domain:"sensor"}}},{name:"windspeed",selector:{entity:{domain:"sensor"}}},{name:"default_wind_speed",selector:{number:{min:0,max:50,step:.1,mode:"box",unit_of_measurement:"m/s"}}},{name:"decimals",selector:{number:{min:0,max:3,step:1,mode:"box"}}},{name:"temp_min",selector:{number:{min:-20,max:50,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"temp_max",selector:{number:{min:-20,max:60,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"size_mode",selector:{select:{mode:"dropdown",options:[{label:"Large (12×8)",value:"large"},{label:"Small (6×4)",value:"small"},{label:"Auto (switch by width)",value:"auto"}]}}},{name:"large_columns",selector:{number:{min:1,max:24,step:1,mode:"box"}}},{name:"large_rows",selector:{number:{min:1,max:24,step:1,mode:"box"}}},{name:"small_columns",selector:{number:{min:1,max:24,step:1,mode:"box"}}},{name:"small_rows",selector:{number:{min:1,max:24,step:1,mode:"box"}}},{name:"auto_breakpoint_px",selector:{number:{min:200,max:1200,step:10,mode:"box",unit_of_measurement:"px"}}}]}render(){return this.hass&&this._config?q`
      <div class="wrap">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${this._schema}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._onValueChanged}
        ></ha-form>
      </div>
    `:q``}_computeLabel=t=>({name:"Name",temperature:"Temperature entity",humidity:"Humidity entity",windspeed:"Wind speed entity (optional)",default_wind_speed:"Default wind speed (m/s)",decimals:"Decimals",temp_min:"Dot temp min (°C)",temp_max:"Dot temp max (°C)",size_mode:"Card size (Sections)",large_columns:"Large: columns",large_rows:"Large: rows",small_columns:"Small: columns",small_rows:"Small: rows",auto_breakpoint_px:"Auto breakpoint (px)"}[t.name]??t.name);_onValueChanged=t=>{t.stopPropagation();const e=t.detail.value;this._config=e,((t,e,s,i)=>{const r=new Event(e,{bubbles:i?.bubbles??!0,cancelable:i?.cancelable??!1,composed:i?.composed??!0});r.detail=s,t.dispatchEvent(r)})(this,"config-changed",{config:e})}}customElements.define("simple-air-comfort-card-editor",lt);
//# sourceMappingURL=simple-air-comfort-card.js.map
