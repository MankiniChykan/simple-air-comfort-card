/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let r=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const i=this.t;if(t&&void 0===e){const t=void 0!==i&&1===i.length;t&&(e=s.get(i)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&s.set(i,e))}return e}toString(){return this.cssText}};const o=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new r(s,e,i)},n=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:m}=Object,u=globalThis,p=u.trustedTypes,_=p?p.emptyScript:"",g=u.reactiveElementPolyfillSupport,f=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},$=(e,t)=>!a(e,t),y={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&l(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:r}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const o=s?.call(this);r?.call(this,t),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const e=m(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const e=this.properties,t=[...h(e),...d(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(t)i.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=t.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=s;const o=r.fromAttribute(t,e.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(e,t,i){if(void 0!==e){const s=this.constructor,r=this[e];if(i??=s.getPropertyOptions(e),!((i.hasChanged??$)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==r||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[f("elementProperties")]=new Map,w[f("finalized")]=new Map,g?.({ReactiveElement:w}),(u.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const v=globalThis,x=v.trustedTypes,A=x?x.createPolicy("lit-html",{createHTML:e=>e}):void 0,C="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,N="?"+S,E=`<${N}>`,k=document,P=()=>k.createComment(""),M=e=>null===e||"object"!=typeof e&&"function"!=typeof e,F=Array.isArray,T="[ \t\n\f\r]",O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,U=/>/g,R=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,z=/"/g,L=/^(?:script|style|textarea|title)$/i,V=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),B=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),I=new WeakMap,q=k.createTreeWalker(k,129);function j(e,t){if(!F(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const W=(e,t)=>{const i=e.length-1,s=[];let r,o=2===t?"<svg>":3===t?"<math>":"",n=O;for(let t=0;t<i;t++){const i=e[t];let a,l,c=-1,h=0;for(;h<i.length&&(n.lastIndex=h,l=n.exec(i),null!==l);)h=n.lastIndex,n===O?"!--"===l[1]?n=H:void 0!==l[1]?n=U:void 0!==l[2]?(L.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=R):void 0!==l[3]&&(n=R):n===R?">"===l[0]?(n=r??O,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?R:'"'===l[3]?z:D):n===z||n===D?n=R:n===H||n===U?n=O:(n=R,r=void 0);const d=n===R&&e[t+1].startsWith("/>")?" ":"";o+=n===O?i+E:c>=0?(s.push(a),i.slice(0,c)+C+i.slice(c)+S+d):i+S+(-2===c?t:d)}return[j(e,o+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class Y{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,o=0;const n=e.length-1,a=this.parts,[l,c]=W(e,t);if(this.el=Y.createElement(l,i),q.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=q.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(C)){const t=c[o++],i=s.getAttribute(e).split(S),n=/([.?@])?(.*)/.exec(t);a.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?X:"?"===n[1]?ee:"@"===n[1]?te:Q}),s.removeAttribute(e)}else e.startsWith(S)&&(a.push({type:6,index:r}),s.removeAttribute(e));if(L.test(s.tagName)){const e=s.textContent.split(S),t=e.length-1;if(t>0){s.textContent=x?x.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],P()),q.nextNode(),a.push({type:2,index:++r});s.append(e[t],P())}}}else if(8===s.nodeType)if(s.data===N)a.push({type:2,index:r});else{let e=-1;for(;-1!==(e=s.data.indexOf(S,e+1));)a.push({type:7,index:r}),e+=S.length-1}r++}}static createElement(e,t){const i=k.createElement("template");return i.innerHTML=e,i}}function J(e,t,i=e,s){if(t===B)return t;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=M(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(e),r._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(t=J(e,r._$AS(e,t.values),r,s)),t}class K{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??k).importNode(t,!0);q.currentNode=s;let r=q.nextNode(),o=0,n=0,a=i[0];for(;void 0!==a;){if(o===a.index){let t;2===a.type?t=new Z(r,r.nextSibling,this,e):1===a.type?t=new a.ctor(r,a.name,a.strings,this,e):6===a.type&&(t=new ie(r,this,e)),this._$AV.push(t),a=i[++n]}o!==a?.index&&(r=q.nextNode(),o++)}return q.currentNode=k,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),M(e)?e===G||null==e||""===e?(this._$AH!==G&&this._$AR(),this._$AH=G):e!==this._$AH&&e!==B&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>F(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==G&&M(this._$AH)?this._$AA.nextSibling.data=e:this.T(k.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Y.createElement(j(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new K(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=I.get(e.strings);return void 0===t&&I.set(e.strings,t=new Y(e)),t}k(e){F(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const r of e)s===t.length?t.push(i=new Z(this.O(P()),this.O(P()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=G,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=G}_$AI(e,t=this,i,s){const r=this.strings;let o=!1;if(void 0===r)e=J(this,e,t,0),o=!M(e)||e!==this._$AH&&e!==B,o&&(this._$AH=e);else{const s=e;let n,a;for(e=r[0],n=0;n<r.length-1;n++)a=J(this,s[i+n],t,n),a===B&&(a=this._$AH[n]),o||=!M(a)||a!==this._$AH[n],a===G?e=G:e!==G&&(e+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(e)}j(e){e===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class X extends Q{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===G?void 0:e}}class ee extends Q{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==G)}}class te extends Q{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??G)===B)return;const i=this._$AH,s=e===G&&i!==G||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==G&&(i===G||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ie{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}}const se=v.litHtmlPolyfillSupport;se?.(Y,Z),(v.litHtmlVersions??=[]).push("3.3.1");const re=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class oe extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let r=s._$litPart$;if(void 0===r){const e=i?.renderBefore??null;s._$litPart$=r=new Z(t.insertBefore(P(),e),e,void 0,i??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}oe._$litElement$=!0,oe.finalized=!0,re.litElementHydrateSupport?.({LitElement:oe});const ne=re.litElementPolyfillSupport;ne?.({LitElement:oe}),(re.litElementVersions??=[]).push("4.2.1");class ae extends oe{static properties={hass:{type:Object},_config:{state:!0},_isNarrow:{state:!0}};constructor(){super(),this._isNarrow=!1,this._resizeObsInitialized=!1,this._resizeObs=null}static styles=o`
    :host {
      display: block;                /* ensure the custom element participates in layout */
      width: 100%;          /* let width be controlled by HA’s grid */
      box-sizing: border-box;      
    }  
    ha-card {
      position: relative;
      padding: 0;
      overflow: hidden;
      isolation: isolate;
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--sac-temp-bg, #2a2a2a);
      height: 100%;
      /* IMPORTANT: no flex here */
      display: block;
      box-sizing: border-box;
      min-height: 0;
    }

    /* Make the inner square center itself inside whatever box Sections gives us */
    .ratio {
      position: absolute;
      inset: 0;           /* allow centering within the full card box */
      margin: auto;       /* center both axes */
      width: auto%;
      max-width: 100%;
      height: auto;       /* let aspect-ratio drive the height */
      max-height: 100%;
      aspect-ratio: 1 / 1;/* true square without the padding-top hack */
      box-sizing: border-box;
    }

    /* Square canvas so % math matches your YAML placements */
    .canvas {
      position: absolute;
      inset: 0;                                 /* fill ha-card */
      background: transparent;                  /* was var(--sac-temp-bg, …) */
      padding: 14px 12px 12px;                  /* if you stil want inner spacing */
      border-radius: 0;
      box-sizing: border-box;
    }

    /* Title + subtitle (room name + dewpoint text) */
    .header {
      position: absolute;
      top: 10%;   /* never closer than ~10px to the top on small cards */
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

    /* Four corners (TL/TR/BL/BR) */
    .corner {
      position: absolute;
      color: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.35);
      font-weight: 700;
      letter-spacing: 0.2px;
    }
    .corner .label {
      font-size: 0.75rem;
      opacity: 0.85;
      display: block;
      font-weight: 600;
    }
    .corner .value {
      font-size: 1.05rem;
    }
    .tl { left: 8%;  top: 18%; transform: translate(0, -50%);  text-align: left;  }
    .tr { right: 8%; top: 18%; transform: translate(0, -50%);  text-align: right; }
    .bl { left: 8%;  bottom: 8%;  transform: translate(0,  0%);  text-align: left;  }
    .br { right: 8%; bottom: 8%;  transform: translate(0,  0%);  text-align: right; }

    /* Center graphic: perfectly centered concentric circles */
    .graphic {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 56%;
      height: 56%;
      min-width: 120px;
      min-height: 120px;
    }

    /* Axis labels placed around the dial rim */
    .axis {
      position: absolute;
      color: rgba(255,255,255,0.92);
      font-weight: 700;
      text-shadow: 0 1px 2px rgba(0,0,0,0.45);
      pointer-events: none;
    }
    .axis-top    { top: -12px; left: 50%; transform: translate(-50%, -50%); }
    .axis-bottom { bottom: -12px; left: 50%; transform: translate(-50%,  50%); }
    .axis-left   { left: -20px;  top: 50%;  transform: translate(-50%, -50%) rotate(180deg); writing-mode: vertical-rl; }
    .axis-right  { right: -20px; top: 50%;  transform: translate( 50%, -50%); writing-mode: vertical-rl; }

    /* Outer ring: white border + dewpoint gradient fill (macro colours) */
    .dial {
      width: 100%;
      height: 100%;
      display: block; /* make SVG fill the box cleanly */
    }

    /* SVG-based dot + halo */
    .dot-core {
      fill: white;
      /* use an SVG filter below for shadow (more consistent than box-shadow) */
      filter: url(#dotShadow);
    }

    .halo {
      pointer-events: none;   /* don't block clicks/hover */
      opacity: 0;             /* hidden by default */
    }

    .outside .halo {
      animation: sac-blink 1s infinite alternate;
      opacity: 1;
    }

    @keyframes sac-blink {
      0%   { opacity: 1; }
      100% { opacity: 0.3; }
    }
  `;setConfig(e){if(!e||!e.temperature||!e.humidity)throw new Error('simple-air-comfort-card: "temperature" and "humidity" entities are required.');const t=e=>null==e||""===e?NaN:Number(e),i=Number.isFinite(t(e.temp_min))?t(e.temp_min):15,s=Number.isFinite(t(e.temp_max))?t(e.temp_max):35;if(s<=i)throw new Error("simple-air-comfort-card: temp_max must be greater than temp_min.");this._config={name:e.name??"Air Comfort",temperature:e.temperature,humidity:e.humidity,windspeed:e.windspeed,decimals:Number.isFinite(t(e.decimals))?t(e.decimals):1,default_wind_speed:Number.isFinite(t(e.default_wind_speed))?t(e.default_wind_speed):0,temp_min:i,temp_max:s,size_mode:e.size_mode??"auto",large_columns:Number.isFinite(t(e.large_columns))?t(e.large_columns):12,large_rows:Number.isFinite(t(e.large_rows))?t(e.large_rows):8,small_columns:Number.isFinite(t(e.small_columns))?t(e.small_columns):6,small_rows:Number.isFinite(t(e.small_rows))?t(e.small_rows):4,auto_breakpoint_px:Number.isFinite(t(e.auto_breakpoint_px))?t(e.auto_breakpoint_px):360,dial_scale:Math.max(.75,Math.min(1.5,Number.isFinite(t(e.dial_scale))?t(e.dial_scale):1))}}render(){if(!this.hass||!this._config)return V``;const e=this.hass.states[this._config.temperature],t=this.hass.states[this._config.humidity],i=this._config.windspeed?this.hass.states[this._config.windspeed]:void 0;if(!e||!t)return V`<ha-card>
        <div class="ratio">
          <div class="canvas">
            <div class="header">
              <div class="title">${this._config.name??"Air Comfort"}</div>
              <div class="subtitle">Entity not found: ${e?this._config.humidity:this._config.temperature}</div>
            </div>
          </div>
        </div>
      </ha-card>`;const s=(e.attributes.unit_of_measurement||"°C").trim(),r=e.state,o=t.state,n=this.#e(Number.isFinite(+r)?+r:NaN,s),a=this.#t(Number.isFinite(+o)?+o:NaN),l=this.#i(i,this._config.default_wind_speed),c=a/100*this.#s(n),h=this.#r(c),d=this.#o(n,c,l),m=this.#n(h),u=this.#a(n),p=this.#l(a),_=this.#c(n);this.#h(m),this.#d(a,n);const{temp_min:g,temp_max:f}=this._config,b=this.#m(n,g,f,0,100),$=this.#u(a+.5,0,100),y=this._config.decimals,w=s,v=this.#p(this.#_(h,w),y)+` ${w}`,x=this.#p(this.#_(d,w),y)+` ${w}`;return V`
      <ha-card style="--sac-temp-bg:${_}">
        <div class="ratio">
          <div class="canvas">
            <div class="header">
              <div class="title">${this._config.name??"Air Comfort"}</div>
              <div class="subtitle">${m}</div>
            </div>

            <div class="corner tl"><span class="label">Dew point</span><span class="value">${v}</span></div>
            <div class="corner tr"><span class="label">Feels like</span><span class="value">${x}</span></div>
            <div class="corner bl"><span class="label">Temperature</span><span class="value">${u}</span></div>
            <div class="corner br"><span class="label">Humidity</span><span class="value">${p}</span></div>

            <!-- Center dial (SVG scales like ring-tile) -->
            <div class="graphic">
              <div class="axis axis-top">Warm</div>
              <div class="axis axis-bottom">Cold</div>
              <div class="axis axis-left">Dry</div>
              <div class="axis axis-right">Humid</div>

              ${this.#g({xPct:$,yPct:b,dewText:m,RH:a,Tc:n,scale:this._config.dial_scale??1})}
            </div>
          </div>
        </div>
      </ha-card>
    `}getCardSize(){return 10}getGridOptions(){const e=this._config??{},t=Number.isFinite(e.large_columns)?e.large_columns:12,i=Number.isFinite(e.large_rows)?e.large_rows:8,s=Number.isFinite(e.small_columns)?e.small_columns:6,r=Number.isFinite(e.small_rows)?e.small_rows:4;return"small"===("small"===e.size_mode||"large"===e.size_mode?e.size_mode:"large")?{columns:s,rows:r,min_columns:s,min_rows:r,max_columns:s,max_rows:r}:{columns:t,rows:i,min_columns:t,min_rows:i,max_columns:t,max_rows:i}}#o(e,t,i){return e+.33*t-.7*i-4}#s(e){return Number.isFinite(e)?e>=0?6.1121*Math.exp(e/(257.14+e)*(18.678-e/234.5)):6.1115*Math.exp(e/(279.82+e)*(23.036-e/333.7)):NaN}#r(e){if(!Number.isFinite(e)||e<=0)return NaN;let t=-80,i=60,s=0;for(let r=0;r<60;r++){s=(t+i)/2;const r=this.#s(s);if(!Number.isFinite(r))break;if(r>e?i=s:t=s,Math.abs(i-t)<1e-4)break}return s}#n(e){return Number.isFinite(e)?e<5?"Very Dry":e>=5&&e<=10?"Dry":e>=10.1&&e<=12.79?"Pleasant":e>=12.8&&e<=15.49?"Comfortable":e>=15.5&&e<=18.39?"Sticky Humid":e>=18.4&&e<=21.19?"Muggy":e>=21.2&&e<=23.9?"Sweltering":"Stifling":"Unknown"}#a(e){return Number.isFinite(e)?e<3?"FROSTY":e>=3.1&&e<=4.99?"COLD":e>=5&&e<=8.99?"CHILLY":e>=9&&e<=13.99?"COOL":e>=14&&e<=18.99?"MILD":e>=19&&e<=23.99?"PERFECT":e>=24&&e<=27.99?"WARM":e>=28&&e<=34.99?"HOT":"BOILING":"N/A"}#l(e){return Number.isFinite(e)?e<40?"DRY":e<=60?"COMFY":"HUMID":"N/A"}#f(e){return Number.isFinite(e)?e<3?"frosty":e<=4.99?"cold":e<=8.99?"chilly":e<=13.99?"cool":e<=18.99?"mild":e<=23.99?"perfect":e<=27.99?"warm":e<=34.99?"hot":"boiling":"n/a"}#b(e){const t=String(e||"").toLowerCase();return"frosty"===t?"mediumblue":"cold"===t?"dodgerblue":"chilly"===t?"deepskyblue":"cool"===t?"mediumaquamarine":"mild"===t?"seagreen":"perfect"===t?"limegreen":"warm"===t?"gold":"hot"===t?"orange":"boiling"===t?"crimson":"dimgray"}#c(e){const t=this.#f(e);return`radial-gradient(circle, rgba(100,100,100,0.15), rgba(100,100,100,0.15), rgba(100,100,100,0.15), ${this.#b(t)})`}#$(e){return`box-shadow:\n      0 0 0 3px white inset,\n      0 0 18px 6px ${{Unknown:"dimgray",Unavailable:"dimgray","Very Dry":"deepskyblue",Dry:"mediumaquamarine",Pleasant:"limegreen",Comfortable:"yellowgreen","Sticky Humid":"yellow",Muggy:"gold",Sweltering:"orange",Stifling:"crimson"}[e]||"rgba(100,100,100,0.15)"},\n      0 0 22px 10px rgba(0,0,0,0.25)`}#h(e){const t=(e=>{switch(e){case"Very Dry":return"deepskyblue";case"Dry":return"mediumaquamarine";case"Pleasant":return"limegreen";case"Comfortable":return"yellowgreen";case"Sticky Humid":return"yellow";case"Muggy":return"gold";case"Sweltering":return"orange";case"Stifling":return"crimson";default:return"dimgray"}})(e||"Unknown");return`radial-gradient(circle, ${t}, 55%, rgba(100,100,100,0.15), rgba(100,100,100,0.15))`}#d(e,t){let i="black";Number.isFinite(e)?(e<40||e>60)&&(i="hotpink"):i="dimgray";let s="dimgray";return Number.isFinite(t)?t>34.9||t>26.5&&t<=34.9?s="rgba(255, 69, 0, 0.8)":t>24&&t<=26.5||t>19&&t<=24?s="dimgray":(t>14&&t<=19||t>9&&t<=14||t>5&&t<=9||t>3&&t<=5||t<=3)&&(s="rgba(0, 102, 255, 0.8)"):s="dimgray",`radial-gradient(circle, ${i} 0%, black, ${s} 70%)`}#y(e){switch(e){case"Very Dry":return"deepskyblue";case"Dry":return"mediumaquamarine";case"Pleasant":return"limegreen";case"Comfortable":return"yellowgreen";case"Sticky Humid":return"yellow";case"Muggy":return"gold";case"Sweltering":return"orange";case"Stifling":return"crimson";default:return"dimgray"}}#w(e,t){let i="black";Number.isFinite(e)?(e<40||e>60)&&(i="hotpink"):i="dimgray";let s="dimgray";return Number.isFinite(t)&&(t>34.9||t>26.5&&t<=34.9?s="rgba(255, 69, 0, 0.8)":t>24&&t<=26.5||t>19&&t<=24?s="dimgray":(t>14&&t<=19||t>9&&t<=14||t>5&&t<=9||t>3&&t<=5||t<=3)&&(s="rgba(0, 102, 255, 0.8)")),{humidityColor:i,temperatureColor:s}}#g({xPct:e,yPct:t,dewText:i,RH:s,Tc:r,scale:o=1}){const n=this.#y(i),{humidityColor:a,temperatureColor:l}=this.#w(s,r),c=2.5*o,h=7.5*o,d=this.#u(e,0,100),m=this.#u(100-t,0,100);return V`
    <svg class="dial" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-label="comfort dial">
      <defs>
        <!-- Outer ring fill: soft dewpoint tint (matches your macro palette) -->
        <radialGradient id="sac-ring" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stop-color="${n}"></stop>
          <stop offset="55%" stop-color="${n}"></stop>
          <stop offset="100%" stop-color="rgba(100,100,100,0.15)"></stop>
        </radialGradient>

        <!-- Inner eye: humidity core -> temperature rim -->
        <radialGradient id="sac-inner" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stop-color="${a}"></stop>
          <stop offset="60%" stop-color="black"></stop>
          <stop offset="70%" stop-color="${l}"></stop>
          <stop offset="100%" stop-color="${l}"></stop>
        </radialGradient>

        <!-- Soft ring halo (subtle) -->
        <filter id="sac-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="${1.2*o}" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- Outer ring -->
      <circle cx="50" cy="50" r="48" fill="url(#sac-ring)" stroke="white" stroke-width="${c}" filter="url(#sac-glow)"></circle>

      <!-- Inner eye -->
      <circle cx="50" cy="50" r="23.25" fill="url(#sac-inner)"></circle>

      <!-- Floating dot -->
      <circle cx="${d}" cy="${m}" r="${h}" fill="white">
        ${s<40||s>60||r<18||r>26.4?V`
          <animate attributeName="opacity" values="1;0.35;1" dur="1.2s" repeatCount="indefinite"></animate>
        `:""}
      </circle>
    </svg>
  `}#u(e,t,i){return Math.min(i,Math.max(t,e))}#m(e,t,i,s,r){if(!Number.isFinite(e))return(s+r)/2;const o=(e-t)/(i-t);return this.#u(s+o*(r-s),s,r)}#t(e){return Number.isFinite(e)?Math.min(100,Math.max(0,e)):NaN}#e(e,t){if(!Number.isFinite(e))return NaN;return(t||"").toLowerCase().includes("f")?5/9*(e-32):e}#_(e,t){const i=(t||"").toLowerCase();return Number.isFinite(e)?i.includes("f")?9*e/5+32:e:NaN}#i(e,t){if(!e)return t??0;const i=parseFloat(e.state);if(!Number.isFinite(i))return t??0;const s=(e.attributes.unit_of_measurement||"m/s").toLowerCase();return s.includes("m/s")?i:s.includes("km/h")||s.includes("kph")?i/3.6:s.includes("mph")?.44704*i:s.includes("kn")?.514444*i:i}#v(e,t=1){if(!Number.isFinite(e))return NaN;const i=Math.pow(10,t);return Math.round(e*i)/i}#p(e,t=1){return Number.isFinite(e)?this.#v(e,t).toLocaleString(void 0,{minimumFractionDigits:t,maximumFractionDigits:t}):"—"}set hass(e){this._hass=e,this.requestUpdate()}get hass(){return this._hass}static getConfigElement(){return document.createElement("simple-air-comfort-card-editor")}static getStubConfig(){return{name:"Air Comfort",temperature:"sensor.temperature",humidity:"sensor.humidity",decimals:1,default_wind_speed:0,temp_min:15,temp_max:35}}}customElements.define("simple-air-comfort-card",ae),window.customCards=window.customCards||[],window.customCards.push({type:"simple-air-comfort-card",name:"Simple Air Comfort Card",description:"Australian BoM apparent temperature + dew point (Arden Buck). Indoor-friendly defaults, macro-matched visuals.",preview:!0});class le extends oe{static properties={hass:{type:Object},_config:{state:!0},_schema:{state:!0}};static styles=o`
    .wrap { padding: 8px 12px 16px; }
  `;connectedCallback(){super.connectedCallback(),window.loadCardHelpers?.().catch(()=>{})}set hass(e){this._hass=e,this.requestUpdate()}get hass(){return this._hass}setConfig(e){this._config={name:"Air Comfort",temperature:void 0,humidity:void 0,windspeed:void 0,decimals:1,default_wind_speed:0,temp_min:15,temp_max:35,size_mode:e?.size_mode??"auto",large_columns:Number.isFinite(e?.large_columns)?e.large_columns:12,large_rows:Number.isFinite(e?.large_rows)?e.large_rows:8,small_columns:Number.isFinite(e?.small_columns)?e.small_columns:6,small_rows:Number.isFinite(e?.small_rows)?e.small_rows:4,auto_breakpoint_px:Number.isFinite(e?.auto_breakpoint_px)?e.auto_breakpoint_px:360,...e??{}},this._schema=[{name:"name",selector:{text:{}}},{name:"temperature",required:!0,selector:{entity:{domain:"sensor"}}},{name:"humidity",required:!0,selector:{entity:{domain:"sensor"}}},{name:"windspeed",selector:{entity:{domain:"sensor"}}},{name:"default_wind_speed",selector:{number:{min:0,max:50,step:.1,mode:"box",unit_of_measurement:"m/s"}}},{name:"decimals",selector:{number:{min:0,max:3,step:1,mode:"box"}}},{name:"temp_min",selector:{number:{min:-20,max:50,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"temp_max",selector:{number:{min:-20,max:60,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"size_mode",selector:{select:{mode:"dropdown",options:[{label:"Large (12×8)",value:"large"},{label:"Small (6×4)",value:"small"},{label:"Auto (switch by width)",value:"auto"}]}}},{name:"large_columns",selector:{number:{min:1,max:24,step:1,mode:"box"}}},{name:"large_rows",selector:{number:{min:1,max:24,step:1,mode:"box"}}},{name:"small_columns",selector:{number:{min:1,max:24,step:1,mode:"box"}}},{name:"small_rows",selector:{number:{min:1,max:24,step:1,mode:"box"}}},{name:"auto_breakpoint_px",selector:{number:{min:200,max:1200,step:10,mode:"box",unit_of_measurement:"px"}}}]}render(){return this.hass&&this._config?V`
      <div class="wrap">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${this._schema}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._onValueChanged}
        ></ha-form>
      </div>
    `:V``}_computeLabel=e=>({name:"Name",temperature:"Temperature entity",humidity:"Humidity entity",windspeed:"Wind speed entity (optional)",default_wind_speed:"Default wind speed (m/s)",decimals:"Decimals",temp_min:"Dot temp min (°C)",temp_max:"Dot temp max (°C)",size_mode:"Card size (Sections)",large_columns:"Large: columns",large_rows:"Large: rows",small_columns:"Small: columns",small_rows:"Small: rows",auto_breakpoint_px:"Auto breakpoint (px)"}[e.name]??e.name);_onValueChanged=e=>{e.stopPropagation();const t=e.detail.value;this._config=t,((e,t,i,s)=>{const r=new Event(t,{bubbles:s?.bubbles??!0,cancelable:s?.cancelable??!1,composed:s?.composed??!0});r.detail=i,e.dispatchEvent(r)})(this,"config-changed",{config:t})}}customElements.define("simple-air-comfort-card-editor",le);
//# sourceMappingURL=simple-air-comfort-card.js.map
