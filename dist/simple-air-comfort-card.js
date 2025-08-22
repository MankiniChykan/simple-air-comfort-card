/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(s,t,i)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:m,getOwnPropertyDescriptor:l,getOwnPropertyNames:c,getOwnPropertySymbols:h,getPrototypeOf:_}=Object,d=globalThis,u=d.trustedTypes,p=u?u.emptyScript:"",f=d.reactiveElementPolyfillSupport,g=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?p:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},x=(t,e)=>!a(t,e),y={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:x};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),d.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&m(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);r?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=_(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...c(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const n=r.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,r=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??x)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[g("elementProperties")]=new Map,$[g("finalized")]=new Map,f?.({ReactiveElement:$}),(d.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,v=w.trustedTypes,C=v?v.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+N,T=`<${E}>`,S=document,F=()=>S.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,P=Array.isArray,R="[ \t\n\f\r]",L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,k=/-->/g,M=/>/g,H=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,U=/"/g,D=/^(?:script|style|textarea|title)$/i,z=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),B=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),G=new WeakMap,j=S.createTreeWalker(S,129);function Y(t,e){if(!P(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const q=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=L;for(let e=0;e<i;e++){const i=t[e];let a,m,l=-1,c=0;for(;c<i.length&&(o.lastIndex=c,m=o.exec(i),null!==m);)c=o.lastIndex,o===L?"!--"===m[1]?o=k:void 0!==m[1]?o=M:void 0!==m[2]?(D.test(m[2])&&(r=RegExp("</"+m[2],"g")),o=H):void 0!==m[3]&&(o=H):o===H?">"===m[0]?(o=r??L,l=-1):void 0===m[1]?l=-2:(l=o.lastIndex-m[2].length,a=m[1],o=void 0===m[3]?H:'"'===m[3]?U:I):o===U||o===I?o=H:o===k||o===M?o=L:(o=H,r=void 0);const h=o===H&&t[e+1].startsWith("/>")?" ":"";n+=o===L?i+T:l>=0?(s.push(a),i.slice(0,l)+A+i.slice(l)+N+h):i+N+(-2===l?e:h)}return[Y(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class V{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[m,l]=q(t,e);if(this.el=V.createElement(m,i),j.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=j.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(A)){const e=l[n++],i=s.getAttribute(t).split(N),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?Q:"?"===o[1]?tt:"@"===o[1]?et:Z}),s.removeAttribute(t)}else t.startsWith(N)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(D.test(s.tagName)){const t=s.textContent.split(N),e=t.length-1;if(e>0){s.textContent=v?v.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],F()),j.nextNode(),a.push({type:2,index:++r});s.append(t[e],F())}}}else if(8===s.nodeType)if(s.data===E)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(N,t+1));)a.push({type:7,index:r}),t+=N.length-1}r++}}static createElement(t,e){const i=S.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,s){if(e===B)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=O(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=J(t,r._$AS(t,e.values),r,s)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??S).importNode(e,!0);j.currentNode=s;let r=j.nextNode(),n=0,o=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new X(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new it(r,this,t)),this._$AV.push(e),a=i[++o]}n!==a?.index&&(r=j.nextNode(),n++)}return j.currentNode=S,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),O(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>P(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(S.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=V.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new K(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new V(t)),e}k(t){P(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new X(this.O(F()),this.O(F()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Z{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=J(this,t,e,0),n=!O(t)||t!==this._$AH&&t!==B,n&&(this._$AH=t);else{const s=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=J(this,s[i+o],e,o),a===B&&(a=this._$AH[o]),n||=!O(a)||a!==this._$AH[o],a===W?t=W:t!==W&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Q extends Z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class tt extends Z{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class et extends Z{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??W)===B)return;const i=this._$AH,s=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const st=w.litHtmlPolyfillSupport;st?.(V,X),(w.litHtmlVersions??=[]).push("3.3.1");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class nt extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new X(e.insertBefore(F(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}nt._$litElement$=!0,nt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:nt});const ot=rt.litElementPolyfillSupport;ot?.({LitElement:nt}),(rt.litElementVersions??=[]).push("4.2.1");const at=(t,e,i,s)=>{const r=new Event(e,{bubbles:s?.bubbles??!0,cancelable:s?.cancelable??!1,composed:s?.composed??!0});return r.detail=i,t.dispatchEvent(r),r};class mt extends nt{static properties={hass:{type:Object},_config:{state:!0}};constructor(){super(),this._config=void 0,this._ro=null,this._hass=void 0}static styles=n`
    /* HOST: keep layout flexible; height comes from content (the 1:1 stage) */
    :host{
      display:inline-block;
      width:100%;
      box-sizing:border-box;
      min-height:0;               /* avoid flex overflow weirdness in dashboards */
      --sac-scale: 1;             /* dynamic type scaling set by ResizeObserver */
    }

    /* ha-card: our visual container (rounded, dark background) */
    ha-card{
      position:relative;
      padding:0;
      overflow:hidden;
      isolation:isolate;
      border-radius:var(--ha-card-border-radius,12px);
      background:var(--sac-temp-bg,#2a2a2a);

      /* Center the 1:1 square inside the card */
      display:flex;
      align-items:center;
      justify-content:center;

      box-sizing:border-box;
      min-height:0;              /* helps in grid/flex layouts */
      contain: layout paint;     /* let browser optimize layout/paint within */
    }

    /* 1:1 square stage using aspect-ratio (replaces padding-top hacks) */
    .ratio{
      position:relative;
      display:block;
      width:100%;
      max-width:100%;
      max-height:100%;
      aspect-ratio:1 / 1;
      margin:0;
      overflow:hidden;
      flex:0 0 auto;
    }

    /* Moving dot:
     * - Absolutely positioned in percent (left/bottom)
     * - 6% of stage size (looks good for typical cards)
     */
    .dot{
      position:absolute; width:6%; height:6%; border-radius:50%;
      background:#fff; box-shadow:0 0 6px rgba(0,0,0,.45);
      transform:translate(-50%, 50%); /* align dot center to coordinate */
      transition:left .8s ease-in-out,bottom .8s ease-in-out; /* smooth moves */
      z-index:2;
    }

    /* When comfort is outside, show a pulsing halo */
    .dot.outside::before{
      content:""; position:absolute; inset:-50%; border-radius:50%;
      background:radial-gradient(circle, rgba(255,0,0,.8) 20%, rgba(255,0,0,.3) 50%, rgba(255,0,0,.1) 70%, rgba(255,0,0,0) 100%);
      animation:sac-heartbeat 2s cubic-bezier(.215,.61,.355,1) infinite; z-index:-1;
    }
    @keyframes sac-heartbeat{
      /* two quick pulses, then rest */
      0%   { transform:scale(1);   opacity:0;   }
      15%  { transform:scale(1.18);opacity:1;   }
      30%  { transform:scale(.98); opacity:.6;  }
      45%  { transform:scale(1.12);opacity:1;   }
      55%  { transform:scale(1);   opacity:0;   }
      100% { transform:scale(1);   opacity:0;   }
    }

    /* Layer to hold the dial graphics */
    .canvas{ position:absolute; inset:0; padding:0; }

    /* Header area: small grey title + white comfort subtitle centered near top */
    .header{
      position:absolute; top:10%; left:50%; transform:translate(-50%,-50%);
      width:100%; text-align:center; pointer-events:none;
    }
    .title{
      color:#c9c9c9; font-weight:300;
      font-size: calc(var(--sac-scale,1) * 16px);
      line-height:1.1; letter-spacing:.2px;
    }
    .subtitle{
      color:#fff; font-weight:400;
      font-size: calc(var(--sac-scale,1) * 22px);
      text-shadow:0 1px 2px rgba(0,0,0,.35);
    }

    /* Corner stats: TL dew point, TR apparent temp, BL raw temp, BR RH */
    .corner{ position:absolute; color:#fff; text-shadow:0 1px 2px rgba(0,0,0,.35); }
    .corner .label{
      font-weight:300; opacity:.75; letter-spacing:.1px;
      font-size: calc(var(--sac-scale,1) * 16px);
      display:block;
    }
    .corner .metric{
      font-weight:500;
      font-size: calc(var(--sac-scale,1) * 20px);
      line-height:1.05;
      display: block;
    }
    .corner .comfort{
      font-weight:400;
      font-size: calc(var(--sac-scale,1) * 22px);
      letter-spacing:.2px;
      display: block;
      margin-top: 0.1rem;
    }
    .tl{ left:8%;  top:23%;  transform:translate(0,-50%); text-align:left; }
    .tr{ right:8%; top:23%;  transform:translate(0,-50%); text-align:right; }
    .bl{ left:8%;  bottom:3%; transform:translate(0,0);   text-align:left; }
    .br{ right:8%; bottom:3%; transform:translate(0,0);   text-align:right; }

    /* The circular dial (outer ring + inner circle) sized at 45% of the stage */
    .graphic{
      position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
      width:45%; height:45%;
    }

    /* Axis labels (dim) placed just outside the dial */
    .axis{
      position:absolute; color:rgba(200,200,200,.8);
      font-weight:300; text-shadow:0 1px 2px rgba(0,0,0,.25);
      font-size: calc(var(--sac-scale,1) * 16px);
      pointer-events:none;
    }
    .axis-top    { top:-10px;  left:50%; transform:translate(-50%,-50%); }
    .axis-bottom { bottom:-10px;left:50%; transform:translate(-50%, 50%); }
    .axis-left   { left:-10px; top:50%;  transform:translate(-50%,-50%) rotate(180deg); writing-mode:vertical-rl; }
    .axis-right  { right:-10px;top:50%;  transform:translate( 50%,-50%); writing-mode:vertical-rl; }

    /* The shiny outer ring: solid border + subtle glow */
    .outer-ring{
      position:absolute; inset:0; border-radius:50%; border:2.5px solid #fff;
      background:var(--sac-dewpoint-ring,radial-gradient(circle,dimgray,55%,rgba(100,100,100,.15),rgba(100,100,100,.15)));
      box-shadow:0 0 6px 3px rgba(0,0,0,.18), 0 0 18px 6px rgba(0,0,0,.22);
    }

    /* Inner "eye": gradient that tints toward hot/cold/humid based on data */
    .inner-circle{
      position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
      width:46.5%; height:46.5%; border-radius:50%;
      background:var(--sac-inner-gradient,radial-gradient(circle,black 0%,black 60%));
      box-shadow:inset 0 0 12px rgba(0,0,0,.6);
    }
  `;connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{const t=this.renderRoot?.querySelector(".ratio")||this;if(!t)return;this._ro=new ResizeObserver(e=>{for(const i of e){const e=(i.contentBoxSize?.[0]?.inlineSize??i.contentRect?.width??t.clientWidth??300)/300;this.style.setProperty("--sac-scale",String(e))}}),this._ro.observe(t)})}disconnectedCallback(){try{this._ro?.disconnect()}catch(t){}this._ro=null,super.disconnectedCallback()}setConfig(t){if(!t||!t.temperature||!t.humidity)throw new Error('simple-air-comfort-card: "temperature" and "humidity" are required.');const e=t=>null==t||""===t?NaN:Number(t),i=Number.isFinite(e(t.ring_pct))?e(t.ring_pct):45,s=Number.isFinite(e(t.inner_pct))?e(t.inner_pct):46.5,r=Number.isFinite(e(t.y_offset_pct))?e(t.y_offset_pct):0;this._config={name:t.name??"Air Comfort",temperature:t.temperature,humidity:t.humidity,windspeed:t.windspeed,decimals:Number.isFinite(e(t.decimals))?e(t.decimals):1,default_wind_speed:Number.isFinite(e(t.default_wind_speed))?e(t.default_wind_speed):0,t_frosty_min:Number.isFinite(e(t.t_frosty_min))?e(t.t_frosty_min):-40,t_frosty_max:Number.isFinite(e(t.t_frosty_max))?e(t.t_frosty_max):2.9,t_cold_min:Number.isFinite(e(t.t_cold_min))?e(t.t_cold_min):3,t_cold_max:Number.isFinite(e(t.t_cold_max))?e(t.t_cold_max):4.9,t_chilly_min:Number.isFinite(e(t.t_chilly_min))?e(t.t_chilly_min):5,t_chilly_max:Number.isFinite(e(t.t_chilly_max))?e(t.t_chilly_max):8.9,t_cool_min:Number.isFinite(e(t.t_cool_min))?e(t.t_cool_min):9,t_cool_max:Number.isFinite(e(t.t_cool_max))?e(t.t_cool_max):13.9,t_mild_min:Number.isFinite(e(t.t_mild_min))?e(t.t_mild_min):14,t_mild_max:Number.isFinite(e(t.t_mild_max))?e(t.t_mild_max):18.9,t_perf_min:Number.isFinite(e(t.t_perf_min))?e(t.t_perf_min):19,t_perf_max:Number.isFinite(e(t.t_perf_max))?e(t.t_perf_max):23.9,t_warm_min:Number.isFinite(e(t.t_warm_min))?e(t.t_warm_min):24,t_warm_max:Number.isFinite(e(t.t_warm_max))?e(t.t_warm_max):27.9,t_hot_min:Number.isFinite(e(t.t_hot_min))?e(t.t_hot_min):28,t_hot_max:Number.isFinite(e(t.t_hot_max))?e(t.t_hot_max):34.9,t_boiling_min:Number.isFinite(e(t.t_boiling_min))?e(t.t_boiling_min):35,t_boiling_max:Number.isFinite(e(t.t_boiling_max))?e(t.t_boiling_max):60,ring_pct:i,inner_pct:s,center_pct:50,y_offset_pct:r,rh_left_inner_pct:Number.isFinite(e(t.rh_left_inner_pct))?e(t.rh_left_inner_pct):40,rh_right_inner_pct:Number.isFinite(e(t.rh_right_inner_pct))?e(t.rh_right_inner_pct):60}}render(){if(!this.hass||!this._config)return z``;const t=this.hass.states[this._config.temperature],e=this.hass.states[this._config.humidity],i=this._config.windspeed?this.hass.states[this._config.windspeed]:void 0;if(!t||!e)return z`<ha-card>
        <div class="ratio" role="img" aria-label="Air comfort dial">
          <div class="canvas">
            ${this.#t({dewText:"Unknown",tempText:"N/A",rhText:"N/A",ringGrad:this.#e("Unknown"),innerGrad:this.#i(NaN,NaN,this.#s()),xPct:50,yPct:50,outside:!1,dewOut:"—",atOut:"—",tempRaw:"—",rhRaw:"—",axisTopStyle:"",axisBottomStyle:"",axisLeftStyle:"",axisRightStyle:""})}
          </div>
        </div>
      </ha-card>`;const s=(t.attributes.unit_of_measurement||"°C").trim(),r=this.#r(Number.isFinite(+t.state)?+t.state:NaN,s),n=this.#n(Number.isFinite(+e.state)?+e.state:NaN),o=this.#o(i,this._config.default_wind_speed),a=n/100*this.#a(r),m=this.#m(a),l=this.#l(r,a,o),c=this.#c(m),h=this.#h(r),_=this.#_(n),d=this.#d(r),u=this.#e(c),p=this.#s(),f=this.#i(n,r,p),g=Number(this._config?.rh_left_inner_pct??40),b=Number(this._config?.rh_right_inner_pct??60),x=this.#u(),y=Number.isFinite(r)&&r>p.PERFECT.max,$=Number.isFinite(r)&&r<p.PERFECT.min,w=Number.isFinite(n)&&n<g,v=Number.isFinite(n)&&n>b,C=y?`color:white; text-shadow:\n      0 0 2px white, 0 0 6px ${x.hot}, 0 0 12px ${x.hot}, 0 0 20px ${x.hot}`:"",A=$?`color:white; text-shadow:\n      0 0 2px white, 0 0 6px ${x.cold}, 0 0 12px ${x.cold}, 0 0 20px ${x.cold}`:"",N=w?`color:white; text-shadow:\n      0 0 2px white, 0 0 6px ${x.humid}, 0 0 12px ${x.humid}, 0 0 20px ${x.humid}`:"",E=v?`color:white; text-shadow:\n      0 0 2px white, 0 0 6px ${x.humid}, 0 0 12px ${x.humid}, 0 0 20px ${x.humid}`:"",T=this.#p(r),S=Number.isFinite(T)?this.#f(T+(this._config.y_offset_pct||0),0,100):50,F=this.#g(n),O=Number.isFinite(F)?this.#f(F,0,100):50,P=!Number.isFinite(n)||!Number.isFinite(r)||(n<g||n>b||r<p.PERFECT.min||r>p.PERFECT.max),R=this._config.decimals,L=s,k=this.#b(this.#x(m,L),R)+` ${L}`,M=this.#b(this.#x(l,L),R)+` ${L}`,H=this.#b(this.#x(r,L),R)+` ${L}`,I=Number.isFinite(n)?this.#y(n,R).toFixed(R)+" %":"—";return z`<ha-card style="--sac-temp-bg:${d}">
      <div class="ratio" role="img" aria-label="Air comfort dial">
        <div class="canvas">
          ${this.#t({Tc:r,RH:n,dpC:m,atC:l,dewText:c,tempText:h,rhText:_,cardBg:d,ringGrad:u,innerGrad:f,xPct:O,yPct:S,outside:P,outUnit:L,d:R,dewOut:k,atOut:M,tempRaw:H,rhRaw:I,axisTopStyle:C,axisBottomStyle:A,axisLeftStyle:N,axisRightStyle:E})}
        </div>
      </div>
    </ha-card>`}#t({dewText:t,tempText:e,rhText:i,ringGrad:s,innerGrad:r,xPct:n,yPct:o,outside:a,dewOut:m,atOut:l,tempRaw:c,rhRaw:h,axisTopStyle:_="",axisBottomStyle:d="",axisLeftStyle:u="",axisRightStyle:p=""}){return z`
      <div class="header">
        <div class="title">${this._config.name??"Air Comfort"}</div>
        <div class="subtitle">${t}</div>
      </div>

      <!-- TL / TR corner stats -->
      <div class="corner tl">
        <span class="label">Dew point</span>
        <span class="metric">${m}</span>
      </div>
      <div class="corner tr">
        <span class="label">Feels like</span>
        <span class="metric">${l}</span>
      </div>

      <!-- BL / BR corner stats (raw values + comfort labels) -->
      <div class="corner bl">
        <span class="label">Temp</span>
        <span class="metric">${c}</span>
        <span class="comfort">${e}</span>
      </div>
      <div class="corner br">
        <span class="label">Humidity</span>
        <span class="metric">${h}</span>
        <span class="comfort">${i}</span>
      </div>

      <!-- Dial (outer ring + inner eye) and labeled axes -->
      <div class="graphic" style="--sac-dewpoint-ring:${s}; --sac-inner-gradient:${r}">
        <div class="axis axis-top"    style=${_||W}    aria-label="Warm">Warm</div>
        <div class="axis axis-bottom" style=${d||W} aria-label="Cold">Cold</div>
        <div class="axis axis-left"   style=${u||W}   aria-label="Dry">Dry</div>
        <div class="axis axis-right"  style=${p||W}  aria-label="Humid">Humid</div>

        <div class="outer-ring" aria-hidden="true"></div>
        <div class="inner-circle" aria-hidden="true"></div>
      </div>

      <!-- The moving dot -->
      <div class="dot ${a?"outside":""}" style="left:${n}%; bottom:${o}%;"></div>
    `}#l(t,e,i){return t+.33*e-.7*i-4}#a(t){return Number.isFinite(t)?t>=0?6.1121*Math.exp(t/(257.14+t)*(18.678-t/234.5)):6.1115*Math.exp(t/(279.82+t)*(23.036-t/333.7)):NaN}#m(t){if(!Number.isFinite(t)||t<=0)return NaN;let e=-80,i=60,s=0;for(let r=0;r<60;r++){s=(e+i)/2;const r=this.#a(s);if(!Number.isFinite(r))break;if(r>t?i=s:e=s,Math.abs(i-e)<1e-4)break}return s}#c(t){return Number.isFinite(t)?t<5?"Very Dry":t<=10?"Dry":t<=12.79?"Pleasant":t<=15.49?"Comfortable":t<=18.39?"Sticky Humid":t<=21.19?"Muggy":t<=23.9?"Sweltering":"Stifling":"Unknown"}#h(t){if(!Number.isFinite(t))return"N/A";const e=this.#s(),i=this.#$(t),s=[["FROSTY",e.FROSTY.min,e.FROSTY.max],["COLD",e.COLD.min,e.COLD.max],["CHILLY",e.CHILLY.min,e.CHILLY.max],["COOL",e.COOL.min,e.COOL.max],["MILD",e.MILD.min,e.MILD.max],["PERFECT",e.PERFECT.min,e.PERFECT.max],["WARM",e.WARM.min,e.WARM.max],["HOT",e.HOT.min,e.HOT.max],["BOILING",e.BOILING.min,e.BOILING.max]];for(const[t,e,r]of s)if(i>=e&&i<=r)return t;return i<s[0][1]?"FROSTY":"BOILING"}#_(t){if(!Number.isFinite(t))return"N/A";const e=Number(this._config?.rh_left_inner_pct??40),i=Number(this._config?.rh_right_inner_pct??60);return t<e?"DRY":t<=i?"COMFY":"HUMID"}#w(t){return Number.isFinite(t)?this.#h(t).toLowerCase():"n/a"}#v(t){const e=String(t||"").toLowerCase();return"frosty"===e?"mediumblue":"cold"===e?"dodgerblue":"chilly"===e?"deepskyblue":"cool"===e?"mediumaquamarine":"mild"===e?"seagreen":"perfect"===e?"limegreen":"warm"===e?"gold":"hot"===e?"orange":"boiling"===e?"crimson":"dimgray"}#d(t){const e=this.#w(t);return`radial-gradient(circle, rgba(100,100,100,0.15), rgba(100,100,100,0.15), rgba(100,100,100,0.15), ${this.#v(e)})`}#e(t){return`radial-gradient(circle, ${{"Very Dry":"deepskyblue",Dry:"mediumaquamarine",Pleasant:"limegreen",Comfortable:"yellowgreen","Sticky Humid":"yellow",Muggy:"gold",Sweltering:"orange",Stifling:"crimson"}[t]||"dimgray"}, 55%, rgba(100,100,100,0.15), rgba(100,100,100,0.15))`}#i(t,e,i){const s=this.#u(),r=Number(this._config?.rh_left_inner_pct??40),n=Number(this._config?.rh_right_inner_pct??60);let o="black";Number.isFinite(t)?(t<r||t>n)&&(o=s.humid):o="dimgray";const a=i.PERFECT.min,m=i.PERFECT.max;let l=s.inband;return Number.isFinite(e)&&(e>m?l=s.hot:e<a&&(l=s.cold)),`radial-gradient(circle, ${o} 0%, black, ${l} 70%)`}#f(t,e,i){return Math.min(i,Math.max(e,t))}#C(t,e,i){return e+(i-e)*t}#A(t,e,i){return(t-e)/(i-e)}#$(t){return Math.round(10*t)/10}#N(t){return t*t*(3-2*t)}#u(){return{hot:"var(--sac-col-hot, rgba(255,69,0,0.95))",cold:"var(--sac-col-cold, rgba(0,102,255,0.95))",humid:"var(--sac-col-humid-alert, hotpink)",inband:"var(--sac-col-inband, dimgray)"}}#s(){const t=this._config||{},e=t=>Math.round(10*t)/10,i={FROSTY:{min:e(t.t_frosty_min??-40),max:e(t.t_frosty_max??2.9)},COLD:{min:e(t.t_cold_min??3),max:e(t.t_cold_max??4.9)},CHILLY:{min:e(t.t_chilly_min??5),max:e(t.t_chilly_max??8.9)},COOL:{min:e(t.t_cool_min??9),max:e(t.t_cool_max??13.9)},MILD:{min:e(t.t_mild_min??14),max:e(t.t_mild_max??18.9)},PERFECT:{min:e(t.t_perf_min??19),max:e(t.t_perf_max??23.9)},WARM:{min:e(t.t_warm_min??24),max:e(t.t_warm_max??27.9)},HOT:{min:e(t.t_hot_min??28),max:e(t.t_hot_max??34.9)},BOILING:{min:e(t.t_boiling_min??35),max:e(t.t_boiling_max??60)}},s=["FROSTY","COLD","CHILLY","COOL","MILD","PERFECT","WARM","HOT","BOILING"];for(let t=0;t<s.length;t++){const r=i[s[t]];if(t>0){const n=e((s[t-1]&&i[s[t-1]]).max+.1);r.min<n&&(r.min=n)}r.max<r.min&&(r.max=r.min)}return i}#E(){const t=Number(this._config?.ring_pct??45),e=Number(this._config?.inner_pct??46.5),i=Number(this._config?.center_pct??50),s=t/2,r=e/100*(t/2),n=i-s,o=i+s;return{y_outer_bottom:n,y_outer_top:o,y_inner_bottom:i-r,y_inner_top:i+r,y_center:i,y_half_below_outer:(0+n)/2,y_half_above_outer:(100+o)/2,x_inner_left:50-r,x_inner_right:50+r}}#g(t){if(!Number.isFinite(t))return NaN;const{x_inner_left:e,x_inner_right:i}=this.#E(),s=Number(this._config?.rh_left_inner_pct??40),r=Number(this._config?.rh_right_inner_pct??60),n=this.#f(s,0,100),o=this.#f(Math.max(r,n+.1),0,100),a=this.#f(t,0,100),m=1e-6;if(n<=m&&a<=n)return 0;if(o>=100-m&&a>=o)return 100;if(a<=n){const t=this.#A(a,0,n);return this.#C(t,0,e)}if(a>=o){const t=this.#A(a,o,100);return this.#C(t,i,100)}{const t=this.#A(a,n,o);return this.#C(t,e,i)}}#p(t){const e=this.#E(),i=this.#s(),s=[{t:i.FROSTY.max,y:e.y_half_below_outer},{t:i.COOL.min,y:e.y_outer_bottom},{t:i.PERFECT.min,y:e.y_inner_bottom},{t:(i.PERFECT.min+i.PERFECT.max)/2,y:e.y_center},{t:i.PERFECT.max,y:e.y_inner_top},{t:i.HOT.max,y:e.y_outer_top},{t:Math.min(i.BOILING.max,i.BOILING.min+5),y:e.y_half_above_outer}];if(!Number.isFinite(t))return e.y_center;if(t<=s[0].t)return s[0].y;if(t>=s[s.length-1].t)return s[s.length-1].y;for(let e=0;e<s.length-1;e++){const i=s[e],r=s[e+1];if(t>=i.t&&t<=r.t){const e=this.#f((t-i.t)/(r.t-i.t),0,1),s=this.#N(e);return i.y+(r.y-i.y)*s}}return e.y_center}#n(t){return Number.isFinite(t)?Math.min(100,Math.max(0,t)):NaN}#r(t,e){return Number.isFinite(t)?(e||"").toLowerCase().includes("f")?5/9*(t-32):t:NaN}#x(t,e){return Number.isFinite(t)?(e||"").toLowerCase().includes("f")?9*t/5+32:t:NaN}#o(t,e){if(!t)return e??0;const i=parseFloat(t.state);if(!Number.isFinite(i))return e??0;const s=(t.attributes.unit_of_measurement||"m/s").toLowerCase();return s.includes("m/s")?i:s.includes("km/h")||s.includes("kph")?i/3.6:s.includes("mph")?.44704*i:s.includes("kn")?.514444*i:i}#y(t,e=1){if(!Number.isFinite(t))return NaN;const i=Math.pow(10,e);return Math.round(t*i)/i}#b(t,e=1){return Number.isFinite(t)?this.#y(t,e).toLocaleString(void 0,{minimumFractionDigits:e,maximumFractionDigits:e}):"—"}set hass(t){this._hass=t,this.requestUpdate()}get hass(){return this._hass}static getConfigElement(){return document.createElement("simple-air-comfort-card-editor")}static getStubConfig(t){const e=t??document.querySelector("home-assistant")?.hass,i=e?.states??{},s=t=>{for(const[e,s]of Object.entries(i))if(t(e,s))return e},r=t=>t?.attributes?.device_class,n=t=>(t?.attributes?.unit_of_measurement||"").toLowerCase();return{name:"Area Name",temperature:s((t,e)=>t.startsWith("sensor.")&&"temperature"===r(e))||s((t,e)=>t.startsWith("sensor.")&&/°c|°f/.test(n(e)))||s(t=>t.startsWith("sensor.")),humidity:s((t,e)=>t.startsWith("sensor.")&&"humidity"===r(e))||s((t,e)=>t.startsWith("sensor.")&&n(e).includes("%"))||s(t=>t.startsWith("sensor.")),windspeed:s((t,e)=>t.startsWith("sensor.")&&"wind_speed"===r(e))||s((t,e)=>t.startsWith("sensor.")&&/(m\/s|km\/h|kph|mph|kn)/.test(n(e))),decimals:1,default_wind_speed:.1}}}customElements.define("simple-air-comfort-card",mt);class lt extends nt{static properties={hass:{type:Object},_config:{state:!0},_schema:{state:!0}};static styles=n`
    .wrap{ padding:8px 12px 16px; }
    .columns{ display:grid; grid-template-columns:1fr 1fr; gap:12px; align-items:start; }
    .col-title{ font-size:.9em; opacity:.8; margin:8px 0 4px; }
    @media (max-width:560px){ .columns{ grid-template-columns:1fr; } }
  `;connectedCallback(){super.connectedCallback(),window.loadCardHelpers?.().catch(()=>{})}set hass(t){this._hass=t,this._autoFillDefaults(),this.requestUpdate()}get hass(){return this._hass}setConfig(t){this._config={name:"Area Name",temperature:void 0,humidity:void 0,windspeed:void 0,decimals:1,default_wind_speed:.1,t_frosty_min:-40,t_frosty_max:2.9,t_cold_min:3,t_cold_max:4.9,t_chilly_min:5,t_chilly_max:8.9,t_cool_min:9,t_cool_max:13.9,t_mild_min:14,t_mild_max:18.9,t_perf_min:19,t_perf_max:23.9,t_warm_min:24,t_warm_max:27.9,t_hot_min:28,t_hot_max:34.9,t_boiling_min:35,t_boiling_max:60,y_offset_pct:0,rh_left_inner_pct:40,rh_right_inner_pct:60,...t??{}},this._schema=[{name:"name",selector:{text:{}}},{name:"temperature",required:!0,selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"humidity",required:!0,selector:{entity:{domain:"sensor",device_class:"humidity"}}},{name:"windspeed",selector:{entity:{domain:"sensor",device_class:"wind_speed"}}},{name:"default_wind_speed",selector:{number:{min:0,max:50,step:.1,mode:"box",unit_of_measurement:"m/s"}}},{name:"decimals",selector:{number:{min:0,max:3,step:1,mode:"box"}}},{name:"t_frosty_min",selector:{number:{min:-60,max:20,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_frosty_max",selector:{number:{min:-60,max:20,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_cold_min",selector:{number:{min:-60,max:25,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_cold_max",selector:{number:{min:-60,max:25,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_chilly_min",selector:{number:{min:-60,max:30,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_chilly_max",selector:{number:{min:-60,max:30,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_cool_min",selector:{number:{min:-60,max:35,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_cool_max",selector:{number:{min:-60,max:35,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_mild_min",selector:{number:{min:-60,max:40,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_mild_max",selector:{number:{min:-60,max:40,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_perf_min",selector:{number:{min:-60,max:45,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_perf_max",selector:{number:{min:-60,max:45,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_warm_min",selector:{number:{min:-60,max:50,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_warm_max",selector:{number:{min:-60,max:50,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_hot_min",selector:{number:{min:-60,max:60,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_hot_max",selector:{number:{min:-60,max:60,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_boiling_min",selector:{number:{min:-60,max:80,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_boiling_max",selector:{number:{min:-60,max:80,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"rh_left_inner_pct",selector:{number:{min:0,max:100,step:.1,mode:"box",unit_of_measurement:"%"}}},{name:"rh_right_inner_pct",selector:{number:{min:0,max:100,step:.1,mode:"box",unit_of_measurement:"%"}}},{name:"y_offset_pct",selector:{number:{min:-30,max:30,step:.5,mode:"box",unit_of_measurement:"%"}}}]}render(){if(!this.hass||!this._config)return z``;const t=this._schema.filter(t=>!(t=>"string"==typeof t&&t.startsWith("t_")&&(t.endsWith("_min")||t.endsWith("_max")))(t.name)),e=this._schema.filter(t=>/^t_.*_min$/.test(t.name)),i=this._schema.filter(t=>/^t_.*_max$/.test(t.name));return z`<div class="wrap">
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${t}
        .computeLabel=${this._label}
        .computeHelper=${this._helper}
        @value-changed=${this._onChange}>
      </ha-form>

      <div class="columns">
        <div>
          <div class="col-title">Band mins (°C)</div>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${e}
            .computeLabel=${this._label}
            .computeHelper=${this._helper}
            @value-changed=${this._onChange}>
          </ha-form>
        </div>
        <div>
          <div class="col-title">Band maxes (°C)</div>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${i}
            .computeLabel=${this._label}
            .computeHelper=${this._helper}
            @value-changed=${this._onChange}>
          </ha-form>
        </div>
      </div>
    </div>`}_label=t=>{const e=t.name,i={name:"Name",temperature:"Temperature entity",humidity:"Humidity entity",windspeed:"Wind speed entity (optional)",default_wind_speed:"Default wind speed (m/s)",decimals:"Decimals",t_frosty_min:"FROSTY min (°C)",t_frosty_max:"FROSTY max (°C)",t_cold_min:"COLD min (°C)",t_cold_max:"COLD max (°C)",t_chilly_min:"CHILLY min (°C)",t_chilly_max:"CHILLY max (°C)",t_cool_min:"COOL min (°C)",t_cool_max:"COOL max (°C)",t_mild_min:"MILD min (°C)",t_mild_max:"MILD max (°C)",t_perf_min:"PERFECT min (°C)",t_perf_max:"PERFECT max (°C)",t_warm_min:"WARM min (°C)",t_warm_max:"WARM max (°C)",t_hot_min:"HOT min (°C)",t_hot_max:"HOT max (°C)",t_boiling_min:"BOILING min (°C)",t_boiling_max:"BOILING max (°C)",rh_left_inner_pct:"Inner circle left RH (%)",rh_right_inner_pct:"Inner circle right RH (%)",ring_pct:"Outer ring box size (% of card)",inner_pct:"Inner circle size (% of ring box)",y_offset_pct:"Vertical dot offset (%)"}[e];return i?"t_frosty_min"===e||"t_boiling_max"===e?`${i} (unused)`:/_min$/.test(e)&&"t_boiling_min"!==e?`${i} (computed)`:i:e};_helper=t=>{const e=t.name,i=t=>this.hass?.states?.[this._config?.[t]],s=t=>i(t)?.attributes?.unit_of_measurement??"",r={t_cold_min:"t_frosty_max",t_chilly_min:"t_cold_max",t_cool_min:"t_chilly_max",t_mild_min:"t_cool_max",t_perf_min:"t_mild_max",t_warm_min:"t_perf_max",t_hot_min:"t_warm_max"},n=t=>(t?.match(/^t_(.+)_(min|max)$/)?.[1]||"").toUpperCase();switch(e){case"name":return"Shown as the small grey title at the top of the card.";case"temperature":return"Pick an indoor temperature sensor. "+(s("temperature")?`Current unit: ${s("temperature")}.`:"");case"humidity":return"Pick a relative humidity sensor (0–100%). "+(s("humidity")?`Current unit: ${s("humidity")}.`:"");case"windspeed":return"Optional. If set, Apparent Temperature uses this wind; if empty, the “Default wind speed” below is used.";case"default_wind_speed":return"Indoor fallback for Apparent Temperature when no wind sensor is set. Typical indoors: 0.0–0.2 m/s.";case"decimals":return"How many decimal places to show for temperatures and humidity.";case"rh_left_inner_pct":case"rh_right_inner_pct":return"Maps RH to the inner-circle intersections horizontally: left = this %, right = this %. 0% stays at the left edge; 100% stays at the right edge.";case"y_offset_pct":return"Fine-tune the dot’s vertical position in % of card height (positive moves up)."}if("t_frosty_min"===e)return"Unused lower edge (ignored on save). Contiguity starts from FROSTY max.";if("t_boiling_max"===e)return"Unused upper edge (ignored on save).";if(e in r){const t=r[e],i=this._config?.[t],s=this._config?.[e];return`Computed • locked: ${n(e)} min = ${n(t)} max + 0.1 °C.`+(Number.isFinite(i)&&Number.isFinite(s)?` Now: ${i} → ${s} °C.`:"")}return["t_frosty_max","t_cold_max","t_chilly_max","t_cool_max","t_mild_max","t_perf_max","t_warm_max","t_hot_max","t_boiling_min"].includes(e)?"Editable: 0.1 °C steps. Moving this shifts the next min to (this max + 0.1).":/^t_.*_(min|max)$/.test(e)?"Bands use 0.1 °C steps. Each next min follows the previous max + 0.1.":"Tip: values update immediately; click Save when done."};_onChange=t=>{t.stopPropagation();const e={...t.detail?.value||{}};for(const t of Object.keys(e))(/^t_.*_min$/.test(t)&&"t_boiling_min"!==t||"t_frosty_min"===t||"t_boiling_max"===t)&&delete e[t];if(0===Object.keys(e).length)return;const i={...this._config||{},...e},s=this._sanitizeBandsAndCal(i);this._config=s,at(this,"config-changed",{config:s})};_sanitizeBandsAndCal(t){const e=t=>Math.round(10*(Number(t)??0))/10,i=.1,s={...t},r=["t_frosty_max","t_cold_max","t_chilly_max","t_cool_max","t_mild_max","t_perf_max","t_warm_max","t_hot_max"];for(const t of r)t in s&&(s[t]=e(s[t]));"t_boiling_min"in s&&(s.t_boiling_min=e(s.t_boiling_min)),s.t_cold_min=e(s.t_frosty_max+i),s.t_chilly_min=e(s.t_cold_max+i),s.t_cool_min=e(s.t_chilly_max+i),s.t_mild_min=e(s.t_cool_max+i),s.t_perf_min=e(s.t_mild_max+i),s.t_warm_min=e(s.t_perf_max+i),s.t_hot_min=e(s.t_warm_max+i);const n=[["t_frosty_min","t_frosty_max"],["t_cold_min","t_cold_max"],["t_chilly_min","t_chilly_max"],["t_cool_min","t_cool_max"],["t_mild_min","t_mild_max"],["t_perf_min","t_perf_max"],["t_warm_min","t_warm_max"],["t_hot_min","t_hot_max"]];for(const[t,i]of n){const r=e(s[t]);!Number.isFinite(s[i])||s[i]<r?s[i]=r:s[i]=e(s[i])}const o=e(s.t_hot_max+i);!Number.isFinite(s.t_boiling_min)||s.t_boiling_min<o?s.t_boiling_min=o:s.t_boiling_min=e(s.t_boiling_min);const a=t=>Math.min(100,Math.max(0,e(t)));return s.rh_left_inner_pct=a(s.rh_left_inner_pct??40),s.rh_right_inner_pct=a(s.rh_right_inner_pct??60),s.rh_right_inner_pct<=s.rh_left_inner_pct&&(s.rh_right_inner_pct=a(s.rh_left_inner_pct+.1)),delete s.t_frosty_min,delete s.t_boiling_max,s}_autoPicked=!1;_autoFillDefaults(){if(this._autoPicked||!this.hass||!this._config)return;const t=this.hass.states,e=e=>{for(const[i,s]of Object.entries(t))if(e(i,s))return i},i=t=>t?.attributes?.device_class;this._config.temperature||(this._config.temperature=e((t,e)=>t.startsWith("sensor.")&&"temperature"===i(e))||this._config.temperature),this._config.humidity||(this._config.humidity=e((t,e)=>t.startsWith("sensor.")&&"humidity"===i(e))||this._config.humidity),this._autoPicked=!0,at(this,"config-changed",{config:this._config})}}customElements.get("simple-air-comfort-card-editor")||customElements.define("simple-air-comfort-card-editor",lt);window.customCards=window.customCards||[],window.customCards.push({type:"simple-air-comfort-card",name:"Simple Air Comfort Card",description:"Dew point + AT dial, comfort words, moving dot.",preview:!0,documentationURL:"https://github.com/MankiniChykan/simple-air-comfort-card"}),console.info('%c SIMPLE AIR COMFORT CARD %c v"1.0.208" ',"color:white;background:#2a2a2a;padding:2px 6px;border-radius:4px 0 0 4px;","color:#2a2a2a;background:#c9c9c9;padding:2px 6px;border-radius:0 4px 4px 0;"),mt.prototype.getCardSize=function(){return 3},mt.prototype.getGridOptions=function(){return{columns:6,rows:"auto",min_columns:6,max_columns:12,min_rows:1,max_rows:6}};
//# sourceMappingURL=simple-air-comfort-card.js.map
