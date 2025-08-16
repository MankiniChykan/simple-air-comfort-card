/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(s,t,i)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:o,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:c,getPrototypeOf:u}=Object,p=globalThis,m=p.trustedTypes,f=m?m.emptyScript:"",g=p.reactiveElementPolyfillSupport,_=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!o(t,e),v={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);r?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...h(t),...c(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const n=r.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,r=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??$)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[_("elementProperties")]=new Map,y[_("finalized")]=new Map,g?.({ReactiveElement:y}),(p.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,x=w.trustedTypes,A=x?x.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+S,N=`<${E}>`,k=document,P=()=>k.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,F=Array.isArray,M="[ \t\n\f\r]",O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,H=/>/g,R=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,L=/"/g,z=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),I=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),V=new WeakMap,W=k.createTreeWalker(k,129);function q(t,e){if(!F(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":3===e?"<math>":"",a=O;for(let e=0;e<i;e++){const i=t[e];let o,l,d=-1,h=0;for(;h<i.length&&(a.lastIndex=h,l=a.exec(i),null!==l);)h=a.lastIndex,a===O?"!--"===l[1]?a=U:void 0!==l[1]?a=H:void 0!==l[2]?(z.test(l[2])&&(r=RegExp("</"+l[2],"g")),a=R):void 0!==l[3]&&(a=R):a===R?">"===l[0]?(a=r??O,d=-1):void 0===l[1]?d=-2:(d=a.lastIndex-l[2].length,o=l[1],a=void 0===l[3]?R:'"'===l[3]?L:D):a===L||a===D?a=R:a===U||a===H?a=O:(a=R,r=void 0);const c=a===R&&t[e+1].startsWith("/>")?" ":"";n+=a===O?i+N:d>=0?(s.push(o),i.slice(0,d)+C+i.slice(d)+S+c):i+S+(-2===d?e:c)}return[q(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Y{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const a=t.length-1,o=this.parts,[l,d]=G(t,e);if(this.el=Y.createElement(l,i),W.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=W.nextNode())&&o.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=d[n++],i=s.getAttribute(t).split(S),a=/([.?@])?(.*)/.exec(e);o.push({type:1,index:r,name:a[2],strings:i,ctor:"."===a[1]?X:"?"===a[1]?tt:"@"===a[1]?et:Q}),s.removeAttribute(t)}else t.startsWith(S)&&(o.push({type:6,index:r}),s.removeAttribute(t));if(z.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=x?x.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],P()),W.nextNode(),o.push({type:2,index:++r});s.append(t[e],P())}}}else if(8===s.nodeType)if(s.data===E)o.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)o.push({type:7,index:r}),t+=S.length-1}r++}}static createElement(t,e){const i=k.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,s){if(e===I)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=T(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=J(t,r._$AS(t,e.values),r,s)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??k).importNode(e,!0);W.currentNode=s;let r=W.nextNode(),n=0,a=0,o=i[0];for(;void 0!==o;){if(n===o.index){let e;2===o.type?e=new Z(r,r.nextSibling,this,t):1===o.type?e=new o.ctor(r,o.name,o.strings,this,t):6===o.type&&(e=new it(r,this,t)),this._$AV.push(e),o=i[++a]}n!==o?.index&&(r=W.nextNode(),n++)}return W.currentNode=k,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),T(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==I&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>F(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==j&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Y.createElement(q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new K(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new Y(t)),e}k(t){F(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Z(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=J(this,t,e,0),n=!T(t)||t!==this._$AH&&t!==I,n&&(this._$AH=t);else{const s=t;let a,o;for(t=r[0],a=0;a<r.length-1;a++)o=J(this,s[i+a],e,a),o===I&&(o=this._$AH[a]),n||=!T(o)||o!==this._$AH[a],o===j?t=j:t!==j&&(t+=(o??"")+r[a+1]),this._$AH[a]=o}n&&!s&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class X extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}class tt extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==j)}}class et extends Q{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??j)===I)return;const i=this._$AH,s=t===j&&i!==j||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==j&&(i===j||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const st=w.litHtmlPolyfillSupport;st?.(Y,Z),(w.litHtmlVersions??=[]).push("3.3.1");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class nt extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new Z(e.insertBefore(P(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}}nt._$litElement$=!0,nt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:nt});const at=rt.litElementPolyfillSupport;at?.({LitElement:nt}),(rt.litElementVersions??=[]).push("4.2.1");class ot extends nt{static properties={hass:{type:Object},_config:{state:!0}};static styles=n`
    ha-card {
      position: relative;
      padding: 12px 12px 14px;
      overflow: hidden;
    }

    /* Square canvas so % math matches your YAML placements */
    .canvas {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      /* Background = temperature macro */
      background: var(--sac-temp-bg, #2a2a2a);
      border-radius: 8px;
    }

    /* Title + subtitle (room name + dewpoint text) */
    .header {
      position: absolute;
      top: 6%;
      left: 50%;
      transform: translate(-50%, -50%);
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
    .outer-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2.5px solid white;
      background: var(--sac-dewpoint-ring, radial-gradient(circle, dimgray, 55%, rgba(100,100,100,0.15), rgba(100,100,100,0.15)));
      box-shadow:
        0 0 6px 3px rgba(0,0,0,0.18),
        0 0 18px 6px rgba(0,0,0,0.22);
    }

    /* Inner comfort circle: black + humidity/temperature gradient (macro) */
    .inner-circle {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 46.5%;
      height: 46.5%;
      border-radius: 50%;
      background: var(--sac-inner-gradient, radial-gradient(circle, black 0%, black 60%));
      border: 0;
      box-shadow: inset 0 0 12px rgba(0,0,0,0.6);
    }

    /* Floating dot + alert blink */
    .dot {
      position: absolute;
      width: 15%;
      height: 15%;
      border-radius: 50%;
      background: white;
      box-shadow: 0 0 6px rgba(0,0,0,0.45);
      transform: translate(-50%, 50%);
      transition: left 0.8s ease-in-out, bottom 0.8s ease-in-out;
      z-index: 2;
    }
    .dot.outside::before {
      content: "";
      position: absolute;
      inset: -20%;
      border-radius: 50%;
      background: radial-gradient(circle,
        rgba(255,0,0,0.8) 20%,
        rgba(255,0,0,0.3) 50%,
        rgba(255,0,0,0.1) 70%,
        rgba(255,0,0,0) 100%
      );
      animation: sac-blink 1s infinite alternate;
      z-index: -1;
    }
    @keyframes sac-blink {
      0%   { opacity: 1; }
      100% { opacity: 0.3; }
    }
  `;setConfig(t){if(!t||!t.temperature||!t.humidity)throw new Error('simple-air-comfort-card: "temperature" and "humidity" entities are required.');this._config={name:t.name??"Air Comfort",temperature:t.temperature,humidity:t.humidity,windspeed:t.windspeed,decimals:Number.isFinite(t.decimals)?t.decimals:1,default_wind_speed:Number.isFinite(t.default_wind_speed)?t.default_wind_speed:0,temp_min:Number.isFinite(t.temp_min)?t.temp_min:15,temp_max:Number.isFinite(t.temp_max)?t.temp_max:35}}render(){if(!this.hass||!this._config)return B``;const t=this.hass.states[this._config.temperature],e=this.hass.states[this._config.humidity],i=this._config.windspeed?this.hass.states[this._config.windspeed]:void 0;if(!t||!e)return B`<ha-card>
        <div class="canvas">
          <div class="header">
            <div class="title">${this._config.name??"Air Comfort"}</div>
            <div class="subtitle">Entity not found: ${t?this._config.humidity:this._config.temperature}</div>
          </div>
        </div>
      </ha-card>`;const s=(t.attributes.unit_of_measurement||"°C").trim(),r=this.#t(parseFloat(t.state),s),n=this.#e(parseFloat(e.state)),a=this.#i(i,this._config.default_wind_speed),o=n/100*this.#s(r),l=this.#r(o),d=this.#n(r,o,a),h=this.#a(l),c=this.#o(r),u=this.#l(n),p=this.#d(r),m=this.#h(h),f=this.#c(n,r),{temp_min:g,temp_max:_}=this._config,b=this.#u(r,g,_,0,100),$=this.#p(n+.5,0,100),v=n<40||n>60||r<18||r>26.4,y=this._config.decimals,w=s,x=this.#m(this.#f(l,w),y)+` ${w}`,A=this.#m(this.#f(d,w),y)+` ${w}`;return B`
      <ha-card>
        <div class="canvas" style="--sac-temp-bg:${p}">
          <!-- Title + Dewpoint comfort text -->
          <div class="header">
            <div class="title">${this._config.name??"Air Comfort"}</div>
            <div class="subtitle">${h}</div>
          </div>

          <!-- TL: Dew point -->
          <div class="corner tl">
            <span class="label">Dew point</span>
            <span class="value">${x}</span>
          </div>

          <!-- TR: Feels like -->
          <div class="corner tr">
            <span class="label">Feels like</span>
            <span class="value">${A}</span>
          </div>

          <!-- BL: Temperature comfort -->
          <div class="corner bl">
            <span class="label">Temperature</span>
            <span class="value">${c}</span>
          </div>

          <!-- BR: Humidity comfort -->
          <div class="corner br">
            <span class="label">Humidity</span>
            <span class="value">${u}</span>
          </div>

          <!-- Center dial -->
          <div class="graphic">
            <div class="axis axis-top">Warm</div>
            <div class="axis axis-bottom">Cold</div>
            <div class="axis axis-left">Dry</div>
            <div class="axis axis-right">Humid</div>

            <div class="outer-ring" style="background:${m}"></div>
            <div class="inner-circle" style="background:${f}"></div>

            <div class="dot ${v?"outside":""}"
                style="left:${$}%; bottom:${b}%;">
            </div>
          </div>
        </div>
      </ha-card>
    `}getCardSize(){return 4}#n(t,e,i){return t+.33*e-.7*i-4}#s(t){return Number.isFinite(t)?t>=0?6.1121*Math.exp(t/(257.14+t)*(18.678-t/234.5)):6.1115*Math.exp(t/(279.82+t)*(23.036-t/333.7)):NaN}#r(t){if(!Number.isFinite(t)||t<=0)return NaN;let e=-80,i=60,s=0;for(let r=0;r<60;r++){s=(e+i)/2;const r=this.#s(s);if(!Number.isFinite(r))break;if(r>t?i=s:e=s,Math.abs(i-e)<1e-4)break}return s}#a(t){return Number.isFinite(t)?t<5?"Very Dry":t>=5&&t<=10?"Dry":t>=10.1&&t<=12.79?"Pleasant":t>=12.8&&t<=15.49?"Comfortable":t>=15.5&&t<=18.39?"Sticky Humid":t>=18.4&&t<=21.19?"Muggy":t>=21.2&&t<=23.9?"Sweltering":"Stifling":"Unknown"}#o(t){return Number.isFinite(t)?t<3?"FROSTY":t>=3.1&&t<=4.99?"COLD":t>=5&&t<=8.99?"CHILLY":t>=9&&t<=13.99?"COOL":t>=14&&t<=18.99?"MILD":t>=19&&t<=23.99?"PERFECT":t>=24&&t<=27.99?"WARM":t>=28&&t<=34.99?"HOT":"BOILING":"N/A"}#l(t){return Number.isFinite(t)?t<40?"DRY":t<=60?"COMFY":"HUMID":"N/A"}#g(t){return Number.isFinite(t)?t<3?"frosty":t<=4.99?"cold":t<=8.99?"chilly":t<=13.99?"cool":t<=18.99?"mild":t<=23.99?"perfect":t<=27.99?"warm":t<=34.99?"hot":"boiling":"n/a"}#_(t){const e=String(t||"").toLowerCase();return"frosty"===e?"mediumblue":"cold"===e?"dodgerblue":"chilly"===e?"deepskyblue":"cool"===e?"mediumaquamarine":"mild"===e?"seagreen":"perfect"===e?"limegreen":"warm"===e?"gold":"hot"===e?"orange":"boiling"===e?"crimson":"dimgray"}#d(t){const e=this.#g(t);return`radial-gradient(circle, rgba(100,100,100,0.15), rgba(100,100,100,0.15), rgba(100,100,100,0.15), ${this.#_(e)})`}#b(t){return`box-shadow:\n      0 0 0 3px white inset,\n      0 0 18px 6px ${{Unknown:"dimgray",Unavailable:"dimgray","Very Dry":"deepskyblue",Dry:"mediumaquamarine",Pleasant:"limegreen",Comfortable:"yellowgreen","Sticky Humid":"yellow",Muggy:"gold",Sweltering:"orange",Stifling:"crimson"}[t]||"rgba(100,100,100,0.15)"},\n      0 0 22px 10px rgba(0,0,0,0.25)`}#h(t){const e=(t=>{switch(t){case"Very Dry":return"deepskyblue";case"Dry":return"mediumaquamarine";case"Pleasant":return"limegreen";case"Comfortable":return"yellowgreen";case"Sticky Humid":return"yellow";case"Muggy":return"gold";case"Sweltering":return"orange";case"Stifling":return"crimson";default:return"dimgray"}})(t||"Unknown");return`radial-gradient(circle, ${e}, 55%, rgba(100,100,100,0.15), rgba(100,100,100,0.15))`}#c(t,e){let i="black";Number.isFinite(t)?(t<40||t>60)&&(i="hotpink"):i="dimgray";let s="dimgray";return Number.isFinite(e)?e>34.9||e>26.5&&e<=34.9?s="rgba(255, 69, 0, 0.8)":e>24&&e<=26.5||e>19&&e<=24?s="dimgray":(e>14&&e<=19||e>9&&e<=14||e>5&&e<=9||e>3&&e<=5||e<=3)&&(s="rgba(0, 102, 255, 0.8)"):s="dimgray",`radial-gradient(circle, ${i} 0%, black, ${s} 70%)`}#p(t,e,i){return Math.min(i,Math.max(e,t))}#u(t,e,i,s,r){if(!Number.isFinite(t))return(s+r)/2;const n=(t-e)/(i-e);return this.#p(s+n*(r-s),s,r)}#e(t){return Number.isFinite(t)?Math.min(100,Math.max(0,t)):NaN}#t(t,e){if(!Number.isFinite(t))return NaN;return(e||"").toLowerCase().includes("f")?5/9*(t-32):t}#f(t,e){const i=(e||"").toLowerCase();return Number.isFinite(t)?i.includes("f")?9*t/5+32:t:NaN}#i(t,e){if(!t)return e??0;const i=parseFloat(t.state);if(!Number.isFinite(i))return e??0;const s=(t.attributes.unit_of_measurement||"m/s").toLowerCase();return s.includes("m/s")?i:s.includes("km/h")||s.includes("kph")?i/3.6:s.includes("mph")?.44704*i:s.includes("kn")?.514444*i:i}#$(t,e=1){if(!Number.isFinite(t))return NaN;const i=Math.pow(10,e);return Math.round(t*i)/i}#m(t,e=1){return Number.isFinite(t)?this.#$(t,e).toLocaleString(void 0,{minimumFractionDigits:e,maximumFractionDigits:e}):"—"}set hass(t){this._hass=t,this.requestUpdate()}get hass(){return this._hass}static getConfigElement(){return document.createElement("simple-air-comfort-card-editor")}static getStubConfig(){return{name:"Air Comfort",temperature:"sensor.temperature",humidity:"sensor.humidity",decimals:1,default_wind_speed:0,temp_min:15,temp_max:35}}}customElements.define("simple-air-comfort-card",ot),window.customCards=window.customCards||[],window.customCards.push({type:"simple-air-comfort-card",name:"Simple Air Comfort Card",description:"Australian BoM apparent temperature + dew point (Arden Buck). Indoor-friendly defaults, macro-matched visuals.",preview:!0});class lt extends nt{static properties={hass:{type:Object},_config:{state:!0}};static styles=n`
    .form {
      display: grid;
      gap: 12px;
      padding: 8px 12px 16px;
    }
    .row {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 12px;
      align-items: center;
    }
    .hint { opacity: 0.7; font-size: 0.9em; }
  `;setConfig(t){this._config={name:t.name??"Air Comfort",temperature:t.temperature,humidity:t.humidity,windspeed:t.windspeed,decimals:Number.isFinite(t.decimals)?t.decimals:1,default_wind_speed:Number.isFinite(t.default_wind_speed)?t.default_wind_speed:0,temp_min:Number.isFinite(t.temp_min)?t.temp_min:15,temp_max:Number.isFinite(t.temp_max)?t.temp_max:35}}get _name(){return this._config?.name??""}get _temperature(){return this._config?.temperature??""}get _humidity(){return this._config?.humidity??""}get _windspeed(){return this._config?.windspeed??""}get _decimals(){return Number.isFinite(this._config?.decimals)?this._config.decimals:1}get _defaultWind(){return Number.isFinite(this._config?.default_wind_speed)?this._config.default_wind_speed:0}get _tmin(){return Number.isFinite(this._config?.temp_min)?this._config.temp_min:15}get _tmax(){return Number.isFinite(this._config?.temp_max)?this._config.temp_max:35}render(){return this.hass?B`
      <div class="form">
        <div class="row">
          <div><label>Name</label></div>
          <ha-textfield
            .value=${this._name}
            @input=${t=>this._update("name",t.target.value)}
            placeholder="Air Comfort"
          ></ha-textfield>
        </div>

        <div class="row">
          <div><label>Temperature entity</label></div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._temperature}
            .includeDomains=${["sensor"]}
            @value-changed=${t=>this._update("temperature",t.detail.value)}
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="row">
          <div><label>Humidity entity</label></div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._humidity}
            .includeDomains=${["sensor"]}
            @value-changed=${t=>this._update("humidity",t.detail.value)}
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="row">
          <div>
            <label>Wind speed entity</label>
            <div class="hint">Optional. If empty, the default below is used.</div>
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._windspeed}
            .includeDomains=${["sensor"]}
            @value-changed=${t=>this._update("windspeed",t.detail.value)}
            allow-custom-entity
            no-clear-text
          ></ha-entity-picker>
        </div>

        <div class="row">
          <div><label>Default wind speed (m/s)</label></div>
          <div class="hint">If no wind speed entity is set, use this default.</div>
          <ha-textfield
            type="number"
            inputmode="decimal"
            step="0.1"
            .value=${String(this._defaultWind)}
            @input=${t=>this._updateNumber("default_wind_speed",t.target.value)}
          ></ha-textfield>
        </div>

        <div class="row">
          <div><label>Decimals</label></div>
          <ha-textfield
            type="number"
            step="1"
            min="0"
            .value=${String(this._decimals)}
            @input=${t=>this._updateNumber("decimals",t.target.value,0)}
          ></ha-textfield>
        </div>

        <div class="row">
          <div><label>Dot temp min (°C)</label></div>
          <ha-textfield
            type="number"
            inputmode="decimal"
            step="0.1"
            .value=${String(this._tmin)}
            @input=${t=>this._updateNumber("temp_min",t.target.value,15)}
          ></ha-textfield>
        </div>

        <div class="row">
          <div><label>Dot temp max (°C)</label></div>
          <ha-textfield
            type="number"
            inputmode="decimal"
            step="0.1"
            .value=${String(this._tmax)}
            @input=${t=>this._updateNumber("temp_max",t.target.value,35)}
          ></ha-textfield>
        </div>
      </div>
    `:B``}_update(t,e){const i={...this._config??{}};""===e||null==e?delete i[t]:i[t]=e,this._config=i,((t,e,i,s)=>{const r=new Event(e,{bubbles:s?.bubbles??!0,cancelable:s?.cancelable??!1,composed:s?.composed??!0});r.detail=i,t.dispatchEvent(r)})(this,"config-changed",{config:i})}_updateNumber(t,e,i=0){const s=""===e?void 0:Number(e),r=Number.isFinite(s)?s:i;this._update(t,r)}}customElements.define("simple-air-comfort-card-editor",lt);
//# sourceMappingURL=simple-air-comfort-card.js.map
