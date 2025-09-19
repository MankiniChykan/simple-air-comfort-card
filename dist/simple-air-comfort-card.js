/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let r=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=n.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n.set(i,t))}return t}toString(){return this.cssText}};const s=(t,...e)=>{const n=1===t.length?t[0]:e.reduce((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new r(n,t,i)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:o,defineProperty:l,getOwnPropertyDescriptor:m,getOwnPropertyNames:c,getOwnPropertySymbols:_,getPrototypeOf:h}=Object,d=globalThis,p=d.trustedTypes,u=p?p.emptyScript:"",f=d.reactiveElementPolyfillSupport,g=(t,e)=>t,x={toAttribute(t,e){switch(e){case Boolean:t=t?u:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!o(t,e),y={attribute:!0,type:String,converter:x,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),d.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&l(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:r}=m(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:n,set(e){const s=n?.call(this);r?.call(this,e),this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=h(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...c(t),..._(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,n)=>{if(e)i.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of n){const n=document.createElement("style"),r=t.litNonce;void 0!==r&&n.setAttribute("nonce",r),n.textContent=e.cssText,i.appendChild(n)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:x).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:x;this._$Em=n;const s=r.fromAttribute(e,t.type);this[n]=s??this._$Ej?.get(n)??s,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const n=this.constructor,r=this[t];if(i??=n.getPropertyOptions(t),!((i.hasChanged??b)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:n,wrapped:r},s){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==r||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===n&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,n=this[e];!0!==t||this._$AL.has(e)||void 0===n||this.C(e,void 0,i,n)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[g("elementProperties")]=new Map,w[g("finalized")]=new Map,f?.({ReactiveElement:w}),(d.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const v=globalThis,$=v.trustedTypes,C=$?$.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,N="?"+T,E=`<${N}>`,R=document,F=()=>R.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,k=Array.isArray,M="[ \t\n\f\r]",L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,S=/-->/g,P=/>/g,H=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,I=/"/g,B=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),U=Symbol.for("lit-noChange"),z=Symbol.for("lit-nothing"),Y=new WeakMap,G=R.createTreeWalker(R,129);function j(t,e){if(!k(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const q=(t,e)=>{const i=t.length-1,n=[];let r,s=2===e?"<svg>":3===e?"<math>":"",a=L;for(let e=0;e<i;e++){const i=t[e];let o,l,m=-1,c=0;for(;c<i.length&&(a.lastIndex=c,l=a.exec(i),null!==l);)c=a.lastIndex,a===L?"!--"===l[1]?a=S:void 0!==l[1]?a=P:void 0!==l[2]?(B.test(l[2])&&(r=RegExp("</"+l[2],"g")),a=H):void 0!==l[3]&&(a=H):a===H?">"===l[0]?(a=r??L,m=-1):void 0===l[1]?m=-2:(m=a.lastIndex-l[2].length,o=l[1],a=void 0===l[3]?H:'"'===l[3]?I:D):a===I||a===D?a=H:a===S||a===P?a=L:(a=H,r=void 0);const _=a===H&&t[e+1].startsWith("/>")?" ":"";s+=a===L?i+E:m>=0?(n.push(o),i.slice(0,m)+A+i.slice(m)+T+_):i+T+(-2===m?e:_)}return[j(t,s+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class V{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let r=0,s=0;const a=t.length-1,o=this.parts,[l,m]=q(t,e);if(this.el=V.createElement(l,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=G.nextNode())&&o.length<a;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(A)){const e=m[s++],i=n.getAttribute(t).split(T),a=/([.?@])?(.*)/.exec(e);o.push({type:1,index:r,name:a[2],strings:i,ctor:"."===a[1]?Q:"?"===a[1]?tt:"@"===a[1]?et:Z}),n.removeAttribute(t)}else t.startsWith(T)&&(o.push({type:6,index:r}),n.removeAttribute(t));if(B.test(n.tagName)){const t=n.textContent.split(T),e=t.length-1;if(e>0){n.textContent=$?$.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],F()),G.nextNode(),o.push({type:2,index:++r});n.append(t[e],F())}}}else if(8===n.nodeType)if(n.data===N)o.push({type:2,index:r});else{let t=-1;for(;-1!==(t=n.data.indexOf(T,t+1));)o.push({type:7,index:r}),t+=T.length-1}r++}}static createElement(t,e){const i=R.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,n){if(e===U)return e;let r=void 0!==n?i._$Co?.[n]:i._$Cl;const s=O(e)?void 0:e._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),void 0===s?r=void 0:(r=new s(t),r._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=r:i._$Cl=r),void 0!==r&&(e=K(t,r._$AS(t,e.values),r,n)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??R).importNode(e,!0);G.currentNode=n;let r=G.nextNode(),s=0,a=0,o=i[0];for(;void 0!==o;){if(s===o.index){let e;2===o.type?e=new X(r,r.nextSibling,this,t):1===o.type?e=new o.ctor(r,o.name,o.strings,this,t):6===o.type&&(e=new it(r,this,t)),this._$AV.push(e),o=i[++a]}s!==o?.index&&(r=G.nextNode(),s++)}return G.currentNode=R,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),O(t)?t===z||null==t||""===t?(this._$AH!==z&&this._$AR(),this._$AH=z):t!==this._$AH&&t!==U&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>k(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==z&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(R.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=V.createElement(j(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new J(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Y.get(t.strings);return void 0===e&&Y.set(t.strings,e=new V(t)),e}k(t){k(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const r of t)n===e.length?e.push(i=new X(this.O(F()),this.O(F()),this,this.options)):i=e[n],i._$AI(r),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Z{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,r){this.type=1,this._$AH=z,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=z}_$AI(t,e=this,i,n){const r=this.strings;let s=!1;if(void 0===r)t=K(this,t,e,0),s=!O(t)||t!==this._$AH&&t!==U,s&&(this._$AH=t);else{const n=t;let a,o;for(t=r[0],a=0;a<r.length-1;a++)o=K(this,n[i+a],e,a),o===U&&(o=this._$AH[a]),s||=!O(o)||o!==this._$AH[a],o===z?t=z:t!==z&&(t+=(o??"")+r[a+1]),this._$AH[a]=o}s&&!n&&this.j(t)}j(t){t===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Q extends Z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===z?void 0:t}}class tt extends Z{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==z)}}class et extends Z{constructor(t,e,i,n,r){super(t,e,i,n,r),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??z)===U)return;const i=this._$AH,n=t===z&&i!==z||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==z&&(i===z||n);n&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const nt=v.litHtmlPolyfillSupport;nt?.(V,X),(v.litHtmlVersions??=[]).push("3.3.1");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class st extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const n=i?.renderBefore??e;let r=n._$litPart$;if(void 0===r){const t=i?.renderBefore??null;n._$litPart$=r=new X(e.insertBefore(F(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return U}}st._$litElement$=!0,st.finalized=!0,rt.litElementHydrateSupport?.({LitElement:st});const at=rt.litElementPolyfillSupport;at?.({LitElement:st}),(rt.litElementVersions??=[]).push("4.2.1");const ot=(t,e,i={},n)=>{const r=new CustomEvent(e,{detail:i,bubbles:n?.bubbles??!0,cancelable:n?.cancelable??!1,composed:n?.composed??!0});return t?.dispatchEvent(r),r},lt=["t_frosty_max","t_cold_max","t_chilly_max","t_cool_max","t_mild_max","t_warm_min","t_hot_min","t_boiling_min","t_perf_min","t_perf_max"];let mt=!1,ct=!1;class _t extends st{static properties={hass:{type:Object},_config:{state:!0}};constructor(){super(),this._config=void 0,this._ro=null,this._hass=void 0}static styles=s`
    /* HOST: keep layout flexible; height comes from content (the 1:1 stage) */
    :host {
        display: block;
        width: 100%;
        box-sizing: border-box;
        min-height: 0;
        --sac-scale: 1;
        --sac-top-offset: calc(var(--sac-scale, 1) * 50px);
        position: relative;
        padding: var(--card-content-padding, 0px);
        overflow: hidden;
        isolation: isolate;
        border-radius: var(--ha-card-border-radius, 12px);
        background: var(--sac-temp-bg, #2a2a2a);
        contain: layout paint;

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
      z-index:3;
    }

    /* When comfort is outside, show a pulsing halo */
    .dot.outside::before{
      content:""; position:absolute; inset:-50%; border-radius:50%;
      background:radial-gradient(circle, rgba(255,0,0,.8) 20%, rgba(255,0,0,.3) 50%, rgba(255,0,0,.1) 70%, rgba(255,0,0,0) 100%);
      animation:sac-heartbeat 2s cubic-bezier(.215,.61,.355,1) infinite; z-index:2;
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
    .canvas{ position:absolute; inset:0; padding:0; z-index:0; }

    /* Header area: small grey title + white comfort subtitle centered near top */
    .header{
      position:absolute; top:10%; left:50%; transform:translate(-50%,-50%);
      width:100%; text-align:center; pointer-events:none; z-index:4;
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
    .corner{ position:absolute; color:#fff; text-shadow:0 1px 2px rgba(0,0,0,.35); z-index:4; }
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
    /* tiny sub-label under the metric (e.g., "BoM" / "Wind Chill") */
    .corner .sublabel{
      display:block;
      margin-top: 2px;
      font-weight:300;
      font-size: calc(var(--sac-scale,1) * 12px);
      letter-spacing:.2px;
      opacity:.75;
    }
    .corner .comfort{
      font-weight:400;
      font-size: calc(var(--sac-scale,1) * 22px);
      letter-spacing:.2px;
      display: block;
      margin-top: 0rem;
    }
    .tl{ left:0%;  top:var(--sac-top-offset); transform:translate(20%,0);  text-align:left; }
    .tr{ right:0%; top:var(--sac-top-offset); transform:translate(-20%,0); text-align:right; }
    .bl{ left:0%;  bottom:0%; transform:translate(20%,-5%);   text-align:left; }
    .br{ right:0%; bottom:0%; transform:translate(-20%,-5%);   text-align:right; }

    /* The circular dial (outer ring + inner circle) sized at 45% of the stage */
    .graphic{
      position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
      width:var(--sac-ring-pct,45%); height:var(--sac-ring-pct,45%); z-index:1;
    }

    /* Axis labels (dim) placed just outside the dial */
    .axis{
      position:absolute; color:rgba(200,200,200,.8);
      font-weight:300; text-shadow:0 1px 2px rgba(0,0,0,.25);
      font-size: calc(var(--sac-scale,1) * 16px);
      pointer-events:none; z-index:2;
    }
    .axis-top    { top:-10px;  left:50%; transform:translate(-50%,-50%); }
    .axis-bottom { bottom:-10px;left:50%; transform:translate(-50%, 50%); }
    .axis-left   { left:-10px; top:50%;  transform:translate(-50%,-50%) rotate(180deg); writing-mode:vertical-rl; }
    .axis-right  { right:-10px;top:50%;  transform:translate( 50%,-50%); writing-mode:vertical-rl; }

    /* The shiny outer ring: solid border + subtle glow */
    .outer-ring{
      position:absolute; inset:0; border-radius:50%; border-style: solid; border-color: #fff; border-width: max(1px, calc(var(--sac-scale, 1) * var(--sac-ring-border-base, 2.5px)));
      background:var(--sac-dewpoint-ring,radial-gradient(circle,dimgray, 55%,rgba(100,100,100,.15),rgba(100,100,100,.15)));
      box-shadow:0 0 6px 3px rgba(0,0,0,.18), 0 0 18px 6px rgba(0,0,0,.22);
    }

    /* Inner "eye": gradient that tints toward hot/cold/humid based on data */
    .inner-circle{
      position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
      width: var(--sac-inner-pct, 46.5%); height: var(--sac-inner-pct, 46.5%); border-radius:50%;
      background:var(--sac-inner-gradient,radial-gradient(circle,black 0%,black 60%));
      box-shadow:inset 0 0 12px rgba(0,0,0,.6);
    }
  `;connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{const t=this.renderRoot?.querySelector(".ratio")||this;if(!t)return;this._ro=new ResizeObserver(e=>{for(const i of e){const e=(i.contentBoxSize?.[0]?.inlineSize??i.contentRect?.width??t.clientWidth??300)/300;this.style.setProperty("--sac-scale",String(e))}}),this._ro.observe(t)})}disconnectedCallback(){try{this._ro?.disconnect()}catch(t){}this._ro=null,super.disconnectedCallback()}setConfig(t){const e=String(t?.temp_display_unit??"auto").toLowerCase(),i="c"===e||"°c"===e?"c":"f"===e||"°f"===e?"f":"auto",n=String(t?.wind_display_unit??"ms").toLowerCase(),r=/km\/?h/.test(n)?"kmh":n.includes("mph")?"mph":n.includes("kn")?"kn":"ms",s=t=>null==t||""===t?NaN:Number(t),a=((t,e)=>{if(!Number.isFinite(t))return 0;switch(e){case"kmh":return t/3.6;case"mph":return.44704*t;case"kn":return.514444*t;default:return t}})(Number.isFinite(s(t?.default_wind_speed))?s(t.default_wind_speed):0,r);if(!t||!t.temperature||!t.humidity)throw new Error('simple-air-comfort-card: "temperature" and "humidity" are required.');if(!mt){const e=lt.filter(e=>e in t);e.length&&(console.warn("simple-air-comfort-card: Detected legacy/derived or alias keys in YAML. The card now derives hidden neighbors automatically from 10 anchors.\nOmit these keys from YAML:",e,"\nKeep only: t_frosty_min, t_cold_min, t_chilly_min, t_cool_min, t_mild_min, t_perfect_min, t_perfect_max, t_warm_max, t_hot_max, t_boiling_max."),mt=!0)}if(!ct){("t_perfect_min"in t||"t_perfect_max"in t)&&("t_perf_min"in t||"t_perf_max"in t)&&(console.warn("simple-air-comfort-card: Both alias sets present for PERFECT band. Using t_perfect_min/t_perfect_max and ignoring t_perf_min/t_perf_max."),ct=!0)}const o=t=>null==t||""===t?NaN:Number(t),l=Number.isFinite(o(t.ring_pct))?o(t.ring_pct):45,m=Number.isFinite(o(t.inner_pct))?o(t.inner_pct):46.5,c=Number.isFinite(o(t.y_offset_pct))?o(t.y_offset_pct):0,_=this.#t(t),h=this.#e(_);this._config={name:t.name??"Air Comfort",temperature:t.temperature,humidity:t.humidity,windspeed:t.windspeed,feels_like:t.feels_like??"bom",decimals:Number.isFinite(o(t.decimals))?o(t.decimals):1,temp_display_unit:i,wind_display_unit:r,default_wind_speed:Number.isFinite(a)?a:0,t_frosty_min:h.t_frosty_min,t_frosty_max:h.t_frosty_max,t_cold_min:h.t_cold_min,t_cold_max:h.t_cold_max,t_chilly_min:h.t_chilly_min,t_chilly_max:h.t_chilly_max,t_cool_min:h.t_cool_min,t_cool_max:h.t_cool_max,t_mild_min:h.t_mild_min,t_mild_max:h.t_mild_max,t_perf_min:h.t_perf_min,t_perf_max:h.t_perf_max,t_warm_min:h.t_warm_min,t_warm_max:h.t_warm_max,t_hot_min:h.t_hot_min,t_hot_max:h.t_hot_max,t_boiling_min:h.t_boiling_min,t_boiling_max:h.t_boiling_max,ring_pct:l,inner_pct:m,center_pct:50,y_offset_pct:c,rh_left_inner_pct:Number.isFinite(o(t.rh_left_inner_pct))?o(t.rh_left_inner_pct):40,rh_right_inner_pct:Number.isFinite(o(t.rh_right_inner_pct))?o(t.rh_right_inner_pct):60}}render(){if(!this.hass||!this._config)return W``;const t=this.hass.states[this._config.temperature],e=this.hass.states[this._config.humidity],i=this._config.windspeed?this.hass.states[this._config.windspeed]:void 0;if(!t||!e){this.style.setProperty("--sac-temp-bg","#2a2a2a");const{y_center:t}=this.#i();return W`
        <div class="ratio" role="img" aria-label="Air comfort dial">
          <div class="canvas">
            ${this.#n({dewText:"Unknown",tempText:"N/A",rhText:"N/A",ringGrad:this.#r("Unknown"),innerGrad:this.#s(NaN,NaN,this.#a()),xPct:50,yPct:t,outside:!0,dewOut:"—",atOut:"—",tempRaw:"—",rhRaw:"—",axisTopStyle:"",axisBottomStyle:"",axisLeftStyle:"",axisRightStyle:""})}
          </div>
        </div>
      `}const n=(t.attributes.unit_of_measurement||"°C").trim(),r=this.#o(Number.isFinite(+t.state)?+t.state:NaN,n),s=this.#l(Number.isFinite(+e.state)?+e.state:NaN),a=this.#m(i,this._config.default_wind_speed),o=s/100*this.#c(r),l=this.#_(o);let m,c;switch(String(this._config.feels_like||"bom")){case"wind_chill":m=this.#h(r,a),c="Wind Chill";break;case"heat_index":m=this.#d(r,s),c="Heat Index";break;case"humidex":m=this.#p(r,o),c="Humidex";break;default:m=this.#u(r,o,a),c="BoM AT"}const _=this.#f(l),h=this.#g(r),d=this.#x(s),p=this.#b(r),u=this.#r(_),f=this.#a(),g=this.#s(s,r,f),x=Number(this._config?.rh_left_inner_pct??40),b=Number(this._config?.rh_right_inner_pct??60),y=this.#y(),w=Number.isFinite(r)&&r>f.PERFECT.max,v=Number.isFinite(r)&&r<f.PERFECT.min,$=Number.isFinite(s)&&s<x,C=Number.isFinite(s)&&s>b,A=t=>`\n      color:white;\n      text-shadow:\n        0 0 calc(var(--sac-scale,1) * 2px)  rgba(255,255,255,.95),\n        0 0 calc(var(--sac-scale,1) * 10px) ${t},\n        0 0 calc(var(--sac-scale,1) * 22px) ${t},\n        0 0 calc(var(--sac-scale,1) * 40px) ${t},\n        0 0 calc(var(--sac-scale,1) * 70px) ${t},\n        0 0 calc(var(--sac-scale,1) * 100px) ${t};\n    `,T=w?A(y.hot):"",N=v?A(y.cold):"",E=$?A(y.humid):"",R=C?A(y.humid):"",F=this.#w(r),O=Number.isFinite(F)?this.#v(F+(this._config.y_offset_pct||0),0,100):50,k=this.#$(s),M=Number.isFinite(k)?this.#v(k,0,100):50,L=!Number.isFinite(s)||!Number.isFinite(r)||(s<x||s>b||r<f.PERFECT.min||r>f.PERFECT.max),S=this._config.decimals,P=this._config?.temp_display_unit||"auto",H="c"===P?"°C":"f"===P?"°F":n,D=this.#C(this.#A(l,H),S)+` ${H}`,I=this.#C(this.#A(m,H),S)+` ${H}`,B=this.#C(this.#A(r,H),S)+` ${H}`,U=Number.isFinite(s)?this.#T(s,S).toFixed(S)+" %":"—";return this.style.setProperty("--sac-temp-bg",p),W`
      <div class="ratio" role="img" aria-label="Air comfort dial">
        <div class="canvas">
          ${this.#n({Tc:r,RH:s,dpC:l,atC:m,dewText:_,tempText:h,rhText:d,ringGrad:u,innerGrad:g,xPct:M,yPct:O,outside:L,outUnit:H,d:S,dewOut:D,atOut:I,tempRaw:B,rhRaw:U,atTag:c,axisTopStyle:T,axisBottomStyle:N,axisLeftStyle:E,axisRightStyle:R})}
        </div>
      </div>
    `}#n({dewText:t,tempText:e,rhText:i,ringGrad:n,innerGrad:r,xPct:s,yPct:a,outside:o,dewOut:l,atOut:m,tempRaw:c,rhRaw:_,atTag:h,axisTopStyle:d="",axisBottomStyle:p="",axisLeftStyle:u="",axisRightStyle:f=""}){return W`
      <div class="header">
        <div class="title">${this._config.name??"Air Comfort"}</div>
        <div class="subtitle">${t}</div>
      </div>

      <!-- TL / TR corner stats -->
      <div class="corner tl">
        <span class="label">Dew point</span>
        <span class="metric">${l}</span>
      </div>
      <div class="corner tr">
        <span class="label">Feels like</span>
        <span class="metric">${m}</span>
        ${h?W`<span class="sublabel">${h}</span>`:z}
      </div>

      <!-- BL / BR corner stats (raw values + comfort labels) -->
      <div class="corner bl">
        <span class="label">Temp</span>
        <span class="metric">${c}</span>
        <span class="comfort">${e}</span>
      </div>
      <div class="corner br">
        <span class="label">Humidity</span>
        <span class="metric">${_}</span>
        <span class="comfort">${i}</span>
      </div>

      <!-- Dial (outer ring + inner eye) and labeled axes -->
      <div class="graphic"
            style="--sac-ring-pct:${this._config.ring_pct}%;
                  --sac-inner-pct:${this._config.inner_pct}%;
                  --sac-dewpoint-ring:${n};
                  --sac-inner-gradient:${r}">
        <div class="axis axis-top"    style=${d||z}    aria-label="Warm">Warm</div>
        <div class="axis axis-bottom" style=${p||z} aria-label="Cold">Cold</div>
        <div class="axis axis-left"   style=${u||z}   aria-label="Dry">Dry</div>
        <div class="axis axis-right"  style=${f||z}  aria-label="Humid">Humid</div>

        <div class="outer-ring" aria-hidden="true"></div>
        <div class="inner-circle" aria-hidden="true"></div>
      </div>

      <!-- The moving dot -->
      <div class="dot ${o?"outside":""}" style="left:${s}%; bottom:${a}%;"></div>
    `}#u(t,e,i){return t+.33*e-.7*i-4}#h(t,e){if(!Number.isFinite(t)||!Number.isFinite(e))return NaN;const i=3.6*e;return 13.12+.6215*t-11.37*Math.pow(i,.16)+.3965*t*Math.pow(i,.16)}#d(t,e){if(!Number.isFinite(t)||!Number.isFinite(e))return NaN;const i=9*t/5+32,n=this.#l(e);return 5*(2.04901523*i-42.379+10.14333127*n+-.22475541*i*n+-.00683783*i*i+-.05481717*n*n+.00122874*i*i*n+85282e-8*i*n*n+-199e-8*i*i*n*n-32)/9}#p(t,e){return Number.isFinite(t)&&Number.isFinite(e)?t+.5555*(e-10):NaN}#c(t){return Number.isFinite(t)?t>=0?6.1121*Math.exp(t/(257.14+t)*(18.678-t/234.5)):6.1115*Math.exp(t/(279.82+t)*(23.036-t/333.7)):NaN}#_(t){if(!Number.isFinite(t)||t<=0)return NaN;let e=-80,i=60,n=0;for(let r=0;r<60;r++){n=(e+i)/2;const r=this.#c(n);if(!Number.isFinite(r))break;if(r>t?i=n:e=n,Math.abs(i-e)<1e-4)break}return n}#f(t){return Number.isFinite(t)?t<5?"Very Dry":t<=10?"Dry":t<=12.79?"Pleasant":t<=15.49?"Comfortable":t<=18.39?"Sticky Humid":t<=21.19?"Muggy":t<=23.9?"Sweltering":"Stifling":"Unknown"}#g(t){if(!Number.isFinite(t))return"N/A";const e=this.#a(),i=this.#N(t),n=[["FROSTY",e.FROSTY.min,e.FROSTY.max],["COLD",e.COLD.min,e.COLD.max],["CHILLY",e.CHILLY.min,e.CHILLY.max],["COOL",e.COOL.min,e.COOL.max],["MILD",e.MILD.min,e.MILD.max],["PERFECT",e.PERFECT.min,e.PERFECT.max],["WARM",e.WARM.min,e.WARM.max],["HOT",e.HOT.min,e.HOT.max],["BOILING",e.BOILING.min,e.BOILING.max]];for(const[t,e,r]of n)if(i>=e&&i<=r)return t;return i<n[0][1]?"FROSTY":"BOILING"}#x(t){if(!Number.isFinite(t))return"N/A";const e=Number(this._config?.rh_left_inner_pct??40),i=Number(this._config?.rh_right_inner_pct??60);return t<e?"DRY":t<=i?"COMFY":"HUMID"}#E(t){return Number.isFinite(t)?this.#g(t).toLowerCase():"n/a"}#R(t){const e=String(t||"").toLowerCase();return"frosty"===e?"mediumblue":"cold"===e?"dodgerblue":"chilly"===e?"deepskyblue":"cool"===e?"mediumaquamarine":"mild"===e?"seagreen":"perfect"===e?"limegreen":"warm"===e?"gold":"hot"===e?"orange":"boiling"===e?"crimson":"dimgray"}#b(t){const e=this.#E(t);return`radial-gradient(circle, rgba(100,100,100,0.15), rgba(100,100,100,0.15), rgba(100,100,100,0.15), ${this.#R(e)})`}#r(t){return`radial-gradient(circle, ${{"Very Dry":"deepskyblue",Dry:"mediumaquamarine",Pleasant:"limegreen",Comfortable:"yellowgreen","Sticky Humid":"yellow",Muggy:"gold",Sweltering:"orange",Stifling:"crimson"}[t]||"dimgray"}, 55%, rgba(100,100,100,0.15), rgba(100,100,100,0.15))`}#s(t,e,i){const n=this.#y(),r=Number(this._config?.rh_left_inner_pct??40),s=Number(this._config?.rh_right_inner_pct??60);let a="black";Number.isFinite(t)?(t<r||t>s)&&(a=n.humid):a="dimgray";const o=i.PERFECT.min,l=i.PERFECT.max;let m=n.inband;return Number.isFinite(e)&&(e>l?m=n.hot:e<o&&(m=n.cold)),`radial-gradient(circle, ${a} 0%, black, ${m} 70%)`}#v(t,e,i){return Math.min(i,Math.max(e,t))}#F(t,e,i){return e+(i-e)*t}#O(t,e,i){return(t-e)/(i-e)}#N(t){return Math.round(10*t)/10}#k(t){return t*t*(3-2*t)}#y(){return{hot:"var(--sac-col-hot, rgba(255,69,0,0.95))",cold:"var(--sac-col-cold, rgba(0,102,255,0.95))",humid:"var(--sac-col-humid-alert, hotpink)",inband:"var(--sac-col-inband, dimgray)"}}#a(){const t=this._config||{},e=(t,e)=>{const i=Number.isFinite(t)?t:e;return Math.round(10*i)/10},i={FROSTY:{min:e(t.t_frosty_min,0),max:e(t.t_frosty_max,2.9)},COLD:{min:e(t.t_cold_min,3),max:e(t.t_cold_max,4.9)},CHILLY:{min:e(t.t_chilly_min,5),max:e(t.t_chilly_max,8.9)},COOL:{min:e(t.t_cool_min,9),max:e(t.t_cool_max,13.9)},MILD:{min:e(t.t_mild_min,14),max:e(t.t_mild_max,18.9)},PERFECT:{min:e(t.t_perf_min,19),max:e(t.t_perf_max,23.9)},WARM:{min:e(t.t_warm_min,24),max:e(t.t_warm_max,27.9)},HOT:{min:e(t.t_hot_min,28),max:e(t.t_hot_max,34.9)},BOILING:{min:e(t.t_boiling_min,35),max:e(t.t_boiling_max,50)}},n=["FROSTY","COLD","CHILLY","COOL","MILD","PERFECT","WARM","HOT","BOILING"];for(let t=0;t<n.length;t++){const r=n[t-1]&&i[n[t-1]],s=i[n[t]];if(t>0){const t=e(r.max+.1,r.max+.1);s.min<t&&(s.min=t)}s.max<s.min&&(s.max=s.min)}return i}#M(t){return Math.round(10*t)/10}#t(t){const e="t_perfect_min"in t?t.t_perfect_min:t.t_perf_min,i="t_perfect_max"in t?t.t_perfect_max:t.t_perf_max;return{t_frosty_min:Number(t.t_frosty_min??0),t_cold_min:Number(t.t_cold_min??3),t_chilly_min:Number(t.t_chilly_min??5),t_cool_min:Number(t.t_cool_min??9),t_mild_min:Number(t.t_mild_min??14),t_perfect_min:Number(e??19),t_perfect_max:Number(i??23.9),t_warm_max:Number(t.t_warm_max??27.9),t_hot_max:Number(t.t_hot_max??34.9),t_boiling_max:Number(t.t_boiling_max??50)}}#e(t){const e=this.#M.bind(this),i=.1,n={frosty_min:e(t.t_frosty_min??0),cold_min:e(t.t_cold_min??3),chilly_min:e(t.t_chilly_min??5),cool_min:e(t.t_cool_min??9),mild_min:e(t.t_mild_min??14),perf_min:e(t.t_perfect_min??19),perf_max:e(t.t_perfect_max??23.9),warm_max:e(t.t_warm_max??27.9),hot_max:e(t.t_hot_max??34.9),boiling_max:e(t.t_boiling_max??50)};n.cold_min=Math.max(e(n.frosty_min+i),n.cold_min),n.chilly_min=Math.max(e(n.cold_min+i),n.chilly_min),n.cool_min=Math.max(e(n.chilly_min+i),n.cool_min),n.mild_min=Math.max(e(n.cool_min+i),n.mild_min),n.perf_min=Math.max(e(n.mild_min+i),Math.min(n.perf_min,e(n.perf_max-i))),n.perf_max=Math.max(e(n.perf_min+i),Math.min(n.perf_max,e(n.warm_max-i))),n.warm_max=Math.max(e(n.perf_max+i),Math.min(n.warm_max,e(n.hot_max-i))),n.hot_max=Math.max(e(n.warm_max+i),Math.min(n.hot_max,e(n.boiling_max-i)));return{t_frosty_min:n.frosty_min,t_cold_min:n.cold_min,t_chilly_min:n.chilly_min,t_cool_min:n.cool_min,t_mild_min:n.mild_min,t_perf_min:n.perf_min,t_perf_max:n.perf_max,t_warm_max:n.warm_max,t_hot_max:n.hot_max,t_boiling_max:n.boiling_max,t_frosty_max:e(n.cold_min-i),t_cold_max:e(n.chilly_min-i),t_chilly_max:e(n.cool_min-i),t_cool_max:e(n.mild_min-i),t_mild_max:e(n.perf_min-i),t_warm_min:e(n.perf_max+i),t_hot_min:e(n.warm_max+i),t_boiling_min:e(n.hot_max+i)}}#i(){const t=Number(this._config?.ring_pct??45),e=Number(this._config?.inner_pct??46.5),i=Number(this._config?.center_pct??50),n=t/2,r=e/100*(t/2);return{y_outer_bottom:i-n,y_outer_top:i+n,y_inner_bottom:i-r,y_inner_top:i+r,y_center:i,x_inner_left:50-r,x_inner_right:50+r}}#$(t){if(!Number.isFinite(t))return NaN;const{x_inner_left:e,x_inner_right:i}=this.#i(),n=Number(this._config?.rh_left_inner_pct??40),r=Number(this._config?.rh_right_inner_pct??60),s=this.#v(n,0,100),a=this.#v(Math.max(r,s+.1),0,100),o=this.#v(t,0,100),l=1e-6;if(s<=l&&o<=s)return 0;if(a>=100-l&&o>=a)return 100;if(o<=s){const t=this.#O(o,0,s);return this.#F(t,0,e)}if(o>=a){const t=this.#O(o,a,100);return this.#F(t,i,100)}{const t=this.#O(o,s,a);return this.#F(t,e,i)}}#w(t){const e=this.#i(),i=this.#a(),n=e.y_outer_bottom,r=e.y_inner_bottom,s=e.y_inner_top,a=e.y_outer_top,o=(t,e,i)=>{const n=i-e;return!Number.isFinite(n)||Math.abs(n)<1e-6?0:this.#v((t-e)/n,0,1)},l=i.FROSTY.min,m=i.MILD.min,c=n,_=t=>0+o(t,l,m)*(c-0),h=_(i.FROSTY.min),d=_(i.COLD.min),p=_(i.CHILLY.min),u=_(i.COOL.min),f=_(i.MILD.min),g=i.WARM.max,x=i.BOILING.max,b=a,y=b+o(i.HOT.max,g,x)*(100-b),w=[{t:i.FROSTY.min,y:h},{t:i.COLD.min,y:d},{t:i.CHILLY.min,y:p},{t:i.COOL.min,y:u},{t:i.MILD.min,y:f},{t:i.PERFECT.min,y:r},{t:i.PERFECT.max,y:s},{t:i.WARM.max,y:a},{t:i.HOT.max,y:y},{t:i.BOILING.max,y:100}];if(!Number.isFinite(t))return e.y_center;if(t<=w[0].t)return w[0].y;if(t>=w[w.length-1].t)return w[w.length-1].y;for(let e=0;e<w.length-1;e++){const n=w[e],r=w[e+1];if(t>=n.t&&t<=r.t){const e=this.#v((t-n.t)/(r.t-n.t),0,1),s=n.t===i.MILD.min&&r.t===i.PERFECT.min||n.t===i.PERFECT.min&&r.t===i.PERFECT.max||n.t===i.PERFECT.max&&r.t===i.WARM.max?e:this.#k(e);return n.y+(r.y-n.y)*s}}return e.y_center}#l(t){return Number.isFinite(t)?Math.min(100,Math.max(0,t)):NaN}#o(t,e){return Number.isFinite(t)?(e||"").toLowerCase().includes("f")?5/9*(t-32):t:NaN}#A(t,e){return Number.isFinite(t)?(e||"").toLowerCase().includes("f")?9*t/5+32:t:NaN}#m(t,e){if(!t)return e??0;const i=parseFloat(t.state);if(!Number.isFinite(i))return e??0;const n=(t.attributes.unit_of_measurement||"m/s").toLowerCase();return n.includes("m/s")?i:n.includes("km/h")||n.includes("kph")?i/3.6:n.includes("mph")?.44704*i:n.includes("kn")?.514444*i:i}#T(t,e=1){if(!Number.isFinite(t))return NaN;const i=Math.pow(10,e);return Math.round(t*i)/i}#C(t,e=1){return Number.isFinite(t)?this.#T(t,e).toLocaleString(void 0,{minimumFractionDigits:e,maximumFractionDigits:e}):"—"}set hass(t){this._hass=t,this.requestUpdate()}get hass(){return this._hass}static getConfigElement(){return document.createElement("simple-air-comfort-card-editor")}static getStubConfig(t){const e=t??document.querySelector("home-assistant")?.hass,i=e?.states??{},n=t=>{for(const[e,n]of Object.entries(i))if(t(e,n))return e},r=t=>t?.attributes?.device_class,s=t=>(t?.attributes?.unit_of_measurement||"").toLowerCase();return{name:"Area Name",temperature:n((t,e)=>t.startsWith("sensor.")&&"temperature"===r(e))||n((t,e)=>t.startsWith("sensor.")&&/°c|°f/.test(s(e)))||n(t=>t.startsWith("sensor.")),humidity:n((t,e)=>t.startsWith("sensor.")&&"humidity"===r(e))||n((t,e)=>t.startsWith("sensor.")&&s(e).includes("%"))||n(t=>t.startsWith("sensor.")),windspeed:n((t,e)=>t.startsWith("sensor.")&&"wind_speed"===r(e))||n((t,e)=>t.startsWith("sensor.")&&/(m\/s|km\/h|kph|mph|kn)/.test(s(e))),decimals:1,default_wind_speed:.1}}}customElements.define("simple-air-comfort-card",_t);class ht extends st{static properties={hass:{type:Object},_config:{state:!0}};static styles=s`
    .wrap{ padding:12px 12px 16px; }
    .row{
      display:grid;
      grid-template-columns:1fr auto auto; /* title | value | button group */
      align-items:center;
      gap:10px;
      padding:8px 0;
    }
    .name{ font-weight:600; }
    .helper{ grid-column:1 / -1; opacity:.8; font-size:.92em; margin:-2px 0 4px; }
    .btn{
      appearance:none;
      border:1px solid var(--divider-color, #444);
      background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.08));
      color:var(--primary-text-color,#fff);
      padding:6px 10px;
      border-radius:10px;
      font-weight:600;
      cursor:pointer;
      display:inline-flex;
      align-items:center;
      gap:8px;
      box-shadow: 0 1px 0 rgba(255,255,255,.06) inset,
                  0 1px 8px rgba(0,0,0,.15);
      transition: transform .05s ease, box-shadow .15s ease, background .2s ease, opacity .2s ease;
    }
    .btn svg{ width:16px; height:16px; display:block; }
    /* icon-only button sizing */
    .btn.icon{
      width:34px;
      height:34px;
      padding:0;
      justify-content:center;
    }
    .btn:hover{
      box-shadow: 0 1px 0 rgba(255,255,255,.08) inset,
                  0 2px 12px rgba(0,0,0,.25);
    }
    .btn:active{ transform:translateY(1px); }
    .btn:focus-visible{
      outline:2px solid transparent;
      box-shadow:
        0 0 0 2px rgba(255,255,255,.15) inset,
        0 0 0 2px rgba(255,255,255,.15),
        0 0 0 4px rgba(3,169,244,.45);
    }
    .btn.ghost{
      background:transparent;
      border-color:rgba(255,255,255,.15);
    }
    .btn[disabled]{ opacity:.45; cursor:not-allowed; box-shadow:none; }
    .seg{ display:flex; gap:8px; justify-self:end; }  /* keep the buttons on the right */
    .value{
      font-variant-numeric:tabular-nums;
      font-weight:700;
      padding:2px 8px;
      border-radius:8px;
      background:rgba(255,255,255,.06);
      justify-self:end;   /* push the pill to the right edge of its grid cell */
      text-align:right;   /* align digits inside the pill to the right */
      min-width:6ch;      /* keeps width stable as numbers change */
      margin-right:2px;   /* tiny breathing room before the buttons */
      white-space:nowrap; /* prevent "°C" wrapping to next line */
    }
    /* band-tinted value pill (uses --pill-col provided inline) */
    .value.coloured{
      color: var(--pill-col);
      /* modern browsers: soft fill + subtle border from band color */
      background: color-mix(in srgb, var(--pill-col) 18%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--pill-col) 45%, transparent);
    }
    /* Center row styling (green) */
    .name--center{ color: var(--sac-center-green, #8ef0ae); font-weight:700; }
    .value--center{
      background: rgba(76,175,80,.18);
      color: var(--sac-center-green, #8ef0ae);
      box-shadow: inset 0 0 0 1px rgba(76,175,80,.35);
    }
    /* Placeholder segment to keep grid alignment without visible buttons */
    .seg--ghost{ visibility:hidden; }
    .title{ font-size:0.95em; opacity:.85; margin:12px 0 6px; }
    .actions{ display:flex; gap:8px; margin-top:10px; }
    .danger{ border-color:#a33; color:#fff; background:#702; }
  `;connectedCallback(){super.connectedCallback(),window.loadCardHelpers?.().catch(()=>{})}set hass(t){this._hass=t,this._autoFillDefaults(),this.requestUpdate()}get hass(){return this._hass}setConfig(t){this._config={name:"Area Name",temperature:void 0,humidity:void 0,windspeed:void 0,temp_display_unit:"auto",wind_display_unit:"ms",feels_like:"bom",decimals:1,default_wind_speed:.1,t_frosty_min:0,t_frosty_max:2.9,t_cold_min:3,t_cold_max:4.9,t_chilly_min:5,t_chilly_max:8.9,t_cool_min:9,t_cool_max:13.9,t_mild_min:14,t_mild_max:18.9,t_perfect_min:19,t_perfect_max:23.9,t_warm_min:24,t_warm_max:27.9,t_hot_min:28,t_hot_max:34.9,t_boiling_min:35,t_boiling_max:50,y_offset_pct:0,rh_left_inner_pct:40,rh_right_inner_pct:60,...t??{}},this._defaults={hot_max:34.9,warm_max:27.9,perf_max:23.9,perf_min:19,perfect_max:23.9,perfect_min:19,mild_min:14,cool_min:9,chilly_min:5,cold_min:3}}render(){return this.hass&&this._config?W`<div class="wrap">
      <div class="title">Entities & Misc</div>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${[{name:"name",selector:{text:{}}},{name:"temperature",required:!0,selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"humidity",required:!0,selector:{entity:{domain:"sensor",device_class:"humidity"}}},{name:"windspeed",selector:{entity:{domain:"sensor",device_class:"wind_speed"}}},{name:"temp_display_unit",selector:{select:{mode:"dropdown",options:[{value:"auto",label:"Auto (follow sensor)"},{value:"c",label:"Celsius (°C)"},{value:"f",label:"Fahrenheit (°F)"}]}}},{name:"wind_display_unit",selector:{select:{mode:"dropdown",options:[{value:"ms",label:"m/s"},{value:"kmh",label:"km/h"},{value:"mph",label:"mph"},{value:"kn",label:"kn"}]}}},{name:"default_wind_speed",selector:{number:{min:0,max:200,step:.1,mode:"box",unit_of_measurement:{ms:"m/s",kmh:"km/h",mph:"mph",kn:"kn"}[this._config?.wind_display_unit||"ms"]}}},{name:"feels_like",selector:{select:{mode:"dropdown",options:[{value:"bom",label:"Apparent Temperature (BoM, T+RH+Wind)"},{value:"wind_chill",label:"Wind Chill (T+Wind, cold)"},{value:"heat_index",label:"Heat Index (T+RH, hot)"},{value:"humidex",label:"Humidex (T+RH, hot)"}]}}},{name:"decimals",selector:{number:{min:0,max:3,step:1,mode:"box"}}},{name:"y_offset_pct",selector:{number:{min:-30,max:30,step:.5,mode:"box",unit_of_measurement:"%"}}}]}
        .computeLabel=${this._label}
        .computeHelper=${this._helper}
        @value-changed=${this._onMiscChange}>
      </ha-form>

      <div class="title">Humidity anchors (buttons)</div>
      ${this._rhRow("rh_left_inner_pct","Low Humidity Alert (%)")}
      ${this._rhRow("rh_right_inner_pct","High Humidity Alert (%)")}

      <div class="title">Temperature anchors (buttons)</div>
      ${this._anchorRow("t_boiling_max","BOILING.max → Top of Card (100%)","Changes how far (HOT.max) is from the edge of the card.",!1)}
      ${this._anchorRow("t_hot_max","HOT.max (Scales with BOILING.max)","Limit ±4°C from default.",!0)}
      ${this._anchorRow("t_warm_max","WARM.max → Outer Ring Top ","Limit ±4°C from default.",!0)}
      ${this._anchorRow("t_perfect_max","PERFECT.max → Inner Comfort Circle Top","High Temperature Alert : Limit ±4°C from default.",!0)}

      <!-- Center row (green, aligned like others) -->
      ${(()=>{const t=this._centerTemp(),e=Number(this._config?.t_perfect_min),i=Number(this._config?.t_perfect_max),n=Number.isFinite(e)&&Number.isFinite(i)?`Midpoint of PERFECT band: (${e.toFixed(1)} → ${i.toFixed(1)}). Updates automatically when either edge changes.`:"Read-only. Midpoint of PERFECT band. Set PERFECT.min and PERFECT.max to compute.";return W`
          <div class="row">
            <div class="name name--center">Calculated PERFECT midpoint</div>
            <div class="value value--center" title=${t}>${t}</div>
            <div class="seg seg--ghost"><button class="btn icon" aria-hidden="true"></button></div>
            <div class="helper">${n}</div>
          </div>`})()}

      ${this._anchorRow("t_perfect_min","PERFECT.min → Inner Comfort Circle Bottom","Low Temperature Alert Limit : ±4°C from default.",!0)}
      ${this._anchorRow("t_mild_min","MILD.min → Outer Ring Bottom","Limit ±4°C from default.",!0)}
      ${this._anchorRow("t_cool_min","COOL.min (Scales with FROSTY.min)","Limit ±4°C from default.",!0)}
      ${this._anchorRow("t_chilly_min","CHILLY.min (Scales with FROSTY.min)","Limit ±4°C from default.",!0)}
      ${this._anchorRow("t_cold_min","COLD.min (Scales with FROSTY.min)","Limit ±4°C from default.",!0)}
      ${this._anchorRow("t_frosty_min","FROSTY.min → Bottom of Card (0%)","Changes how far (COOL.min → COLD.min) is from the edge of the card.",!1)}

      <div class="actions">
        <button class="btn danger" @click=${this._resetDefaults}>Reset to defaults</button>
      </div>
    </div>`:W``}_label=t=>{const e=t.name;return{name:"Name",temperature:"Temperature entity",humidity:"Humidity entity",windspeed:"Wind speed entity (optional)",feels_like:"Feels-like formula",default_wind_speed:`Default wind speed (${{ms:"m/s",kmh:"km/h",mph:"mph",kn:"kn"}[this._config?.wind_display_unit||"ms"]})`,decimals:"Decimals",rh_left_inner_pct:"Inner circle left RH (%)",rh_right_inner_pct:"Inner circle right RH (%)",y_offset_pct:"Vertical dot offset (%)"}[e]??e};_bandBaseColour(t){const e=String(t||"").toLowerCase();return"frosty"===e?"mediumblue":"cold"===e?"dodgerblue":"chilly"===e?"deepskyblue":"cool"===e?"mediumaquamarine":"mild"===e?"seagreen":"perfect"===e?"limegreen":"warm"===e?"gold":"hot"===e?"orange":"boiling"===e?"crimson":"dimgray"}_bandForAnchor(t){switch(t){case"t_boiling_max":return"boiling";case"t_hot_max":return"hot";case"t_warm_max":return"warm";case"t_perfect_max":case"t_perfect_min":return"perfect";case"t_mild_min":return"mild";case"t_cool_min":return"cool";case"t_chilly_min":return"chilly";case"t_cold_min":return"cold";case"t_frosty_min":return"frosty";default:return null}}_anchorRow(t,e,i,n){const r=Number(this._config?.[t]),s=Number.isFinite(r)?`${r.toFixed(1)} °C`:"—",a=this._bandForAnchor(t),o=a?this._bandBaseColour(a):null,l=n?this._capFor(t):null,m=!!l&&r<=l.lo,c=!!l&&r>=l.hi;return W`
      <div class="row">
        <div class="name">${e}</div>
        <div class="value ${o?"coloured":""}" style=${o?`--pill-col:${o}`:z} title=${s}>${s}</div>
        <div class="seg">
          <button
            class="btn icon ghost"
            type="button"
            ?disabled=${m}
            @click=${()=>this._bump(t,-.1,n)}
            aria-label="${e} down"
            title="Decrease by 0.1 °C"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
            </svg>
          </button>
          <button
            class="btn icon"
            type="button"
            ?disabled=${c}
            @click=${()=>this._bump(t,.1,n)}
            aria-label="${e} up"
            title="Increase by 0.1 °C"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
        <div class="helper">${i}</div>
      </div>
    `}_rhRow(t,e){const i=Number(this._config?.[t]),n=Number.isFinite(i)?`${i.toFixed(1)} %`:"—",r=.1,s=Number(this._config?.rh_left_inner_pct??40),a=Number(this._config?.rh_right_inner_pct??60);let o=!1,l=!1;"rh_left_inner_pct"===t?(o=i<=0,l=i>=a-r):(o=i<=s+r,l=i>=100);const m=this._helper({name:t});return W`
      <div class="row">
        <div class="name">${e}</div>
        <div class="value coloured" style="--pill-col:${"hotpink"}" title=${n}>${n}</div>
        <div class="seg">
          <button
            class="btn icon ghost"
            type="button"
            ?disabled=${o}
            @click=${()=>this._bump(t,-.1,!1)}
            aria-label="${e} down"
            title="Decrease by ${r} %">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
            </svg>
          </button>
          <button
            class="btn icon"
            type="button"
            ?disabled=${l}
            @click=${()=>this._bump(t,.1,!1)}
            aria-label="${e} up"
            title="Increase by ${r} %">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
        <div class="helper">${m}</div>
      </div>
    `}_helper=t=>{const e=t=>this.hass?.states?.[this._config?.[t]],i=t=>e(t)?.attributes?.unit_of_measurement??"",n=t.name;switch(n){case"name":return"Shown as the small grey title at the top of the card.";case"temperature":return"Pick an indoor temperature sensor. "+(i("temperature")?`Current unit: ${i("temperature")}.`:"");case"temp_display_unit":return"Choose the temperature unit used for display. Calculations always normalize internally.";case"humidity":return"Pick a relative humidity sensor (0–100%). "+(i("humidity")?`Current unit: ${i("humidity")}.`:"");case"windspeed":return"Optional. If set, Feels Like Temperature uses this wind; if empty, the “Default wind speed” below is used.";case"wind_display_unit":return"Unit for showing the default wind value below (YAML-safe tokens). Physics converts to m/s internally.";case"default_wind_speed":return"Indoor fallback for Feels Like Temperature when no wind sensor is set. Typical indoors: 0.0–0.2 in the chosen unit.";case"feels_like":return"Choose the formula for the top-right “Feels like” value. BoM uses T+RH+Wind; Wind Chill uses T+Wind (cold); Heat Index/Humidex use T+RH (hot).";case"decimals":return"How many decimal places to show for temperatures and humidity.";case"rh_left_inner_pct":return"Maps RH to the inner-comfort-circle LEFT intersection horizontally";case"rh_right_inner_pct":return"Maps RH to the inner-comfort-circle RIGHT intersection horizontally";case"y_offset_pct":return"Fine-tune the dot’s vertical position in % of card height (positive moves up)."}return"t_boiling_max"===n?"BOILING.max → top (100%). Dragging down stops at BOILING.min (tracks HOT.max+0.1). Dragging up increases the scale.":"t_hot_max"===n?"HOT.max. Drags BOILING.min with it up/down (BOILING.min = HOT.max+0.1). HOT.max ≤ BOILING.max−0.1 and ≥ WARM.max+0.1.":"t_warm_max"===n?"WARM.max → outer-top. Drags HOT.min with it (HOT.min = WARM.max+0.1). WARM.max ≤ HOT.max−0.1 and ≥ PERFECT.max+0.1.":"t_perfect_max"===n?"PERFECT.max → inner-top. Drags WARM.min (WARM.min = PERFECT.max+0.1). PERFECT.max ≤ WARM.max−0.1 and ≥ PERFECT.min+0.1.":"t_perfect_min"===n?"PERFECT.min → inner-bottom. Drags MILD.max (MILD.max = PERFECT.min−0.1). PERFECT.min ≤ PERFECT.max−0.1 and ≥ MILD.min+0.1.":"t_mild_min"===n?"MILD.min → outer-bottom. Drags COOL.max (COOL.max = MILD.min−0.1). MILD.min ≤ PERFECT.min and ≥ COOL.min+0.1.":"t_cool_min"===n?"COOL.min. Drags CHILLY.max (CHILLY.max = COOL.min−0.1). COOL.min ≤ MILD.min and ≥ CHILLY.min+0.1.":"t_chilly_min"===n?"CHILLY.min. Drags COLD.max (COLD.max = CHILLY.min−0.1). CHILLY.min ≤ COOL.min and ≥ COLD.min+0.1.":"t_cold_min"===n?"COLD.min. Drags FROSTY.max (FROSTY.max = COLD.min−0.1). COLD.min ≤ CHILLY.min and ≥ FROSTY.min+0.1.":"t_frosty_min"===n?"FROSTY.min → bottom (0%). Dragging up stops at FROSTY.max (COLD.max−0.1). Dragging down increases the scale lower.":/^t_.*_(min|max)$/.test(n)?"All band edges keep contiguous 0.1 °C gaps automatically.":"Tip: values update immediately; click Save when done."};_centerTemp(){const t=this._config||{},e=Number(t.t_perfect_min),i=Number(t.t_perfect_max);return Number.isFinite(e)&&Number.isFinite(i)?`${((e+i)/2).toFixed(2)} °C`:"—"}_capFor(t){const e=t.replace("t_",""),i=this._defaults[e]??(e.startsWith("perfect_")?this._defaults[e.replace("perfect_","perf_")]:void 0);if(void 0===i)return null;const n=t=>Math.round(10*t)/10;return{lo:n(i-4),hi:n(i+4)}}_resetDefaults=()=>{const t={...this._config||{}};t.t_boiling_max=50,t.t_hot_max=34.9,t.t_warm_max=27.9,t.t_perfect_max=23.9,t.t_perfect_min=19,t.t_mild_min=14,t.t_cool_min=9,t.t_chilly_min=5,t.t_cold_min=3,t.t_frosty_min=0;const e=this._applyTempsRowBiDirectional(t,["t_boiling_max","t_hot_max","t_warm_max","t_perfect_max","t_perfect_min","t_mild_min","t_cool_min","t_chilly_min","t_cold_min","t_frosty_min"]);this._config=e,ot(this,"config-changed",{config:this._persistKeys(e)})};_toDisplayWind(t,e){if(!Number.isFinite(t))return 0;switch(e){case"kmh":return 3.6*t;case"mph":return t/.44704;case"kn":return t/.514444;default:return t}}_fromDisplayWind(t,e){if(!Number.isFinite(t))return 0;switch(e){case"kmh":return t/3.6;case"mph":return.44704*t;case"kn":return.514444*t;default:return t}}_onMiscChange=t=>{t.stopPropagation();const e={...t.detail?.value||{}};if(!Object.keys(e).length)return;if("wind_display_unit"in e&&null!=this._config?.default_wind_speed){const t=this._config.wind_display_unit||"ms",i=e.wind_display_unit||t;if(t!==i){const n=Number(this._config.default_wind_speed),r=this._fromDisplayWind(n,t);e.default_wind_speed=this._toDisplayWind(r,i)}}const i={...this._config||{},...e};this._config=i,ot(this,"config-changed",{config:this._persistKeys(i)})};_bump(t,e,i){const n=t=>Math.round(10*t)/10,r={...this._config||{}},s=Number(r[t]);if(!Number.isFinite(s))return;let a=n(s+e);const o={t_hot_max:"t_hot_max",t_warm_max:"t_warm_max",t_perfect_max:"t_perfect_max",t_perfect_min:"t_perfect_min",t_mild_min:"t_mild_min",t_cool_min:"t_cool_min",t_chilly_min:"t_chilly_min",t_cold_min:"t_cold_min"};if(i&&o[t]){const e=this._defaults[o[t].replace("t_","")];if(Number.isFinite(e)){const t=n(e-4),i=n(e+4);a=Math.min(i,Math.max(t,a))}}const l={...r,[t]:a},m=this._applyTempsRowBiDirectional(l,[t]);this._config=m,ot(this,"config-changed",{config:this._persistKeys(m)})}_applyTempsRowBiDirectional(t,e=[]){const i=t=>Math.round(10*(Number(t)||0))/10,n=.1,r={boiling_max:i(t.t_boiling_max??50),hot_max:i(t.t_hot_max??34.9),warm_max:i(t.t_warm_max??27.9),perf_max:i(t.t_perfect_max??23.9),perf_min:i(t.t_perfect_min??19),mild_min:i(t.t_mild_min??14),cool_min:i(t.t_cool_min??9),chilly_min:i(t.t_chilly_min??5),cold_min:i(t.t_cold_min??3),frosty_min:i(t.t_frosty_min??0)},s={t_boiling_max:"boiling_max",t_hot_max:"hot_max",t_warm_max:"warm_max",t_perfect_max:"perf_max",t_perfect_min:"perf_min",t_mild_min:"mild_min",t_cool_min:"cool_min",t_chilly_min:"chilly_min",t_cold_min:"cold_min",t_frosty_min:"frosty_min"},a=(e&&e.length?e:Object.keys(s)).map(t=>s[t]||t).filter(Boolean);a.forEach(t=>{switch(t){case"boiling_max":r.boiling_max=Math.max(r.boiling_max,i(r.hot_max+n));break;case"hot_max":r.hot_max=Math.max(i(r.warm_max+n),Math.min(r.hot_max,i(r.boiling_max-n)));break;case"warm_max":r.warm_max=Math.max(i(r.perf_max+n),Math.min(r.warm_max,i(r.hot_max-n)));break;case"perf_max":r.perf_max=Math.max(i(r.perf_min+n),Math.min(r.perf_max,i(r.warm_max-n)));break;case"perf_min":r.perf_min=Math.max(i(r.mild_min+n),Math.min(r.perf_min,i(r.perf_max-n)));break;case"mild_min":r.mild_min=Math.max(i(r.cool_min+n),Math.min(r.mild_min,i(r.perf_min-n)));break;case"cool_min":r.cool_min=Math.max(i(r.chilly_min+n),Math.min(r.cool_min,i(r.mild_min-n)));break;case"chilly_min":r.chilly_min=Math.max(i(r.cold_min+n),Math.min(r.chilly_min,i(r.cool_min-n)));break;case"cold_min":r.cold_min=Math.max(i(r.frosty_min+n),Math.min(r.cold_min,i(r.chilly_min-n)));break;case"frosty_min":r.frosty_min=Math.min(r.frosty_min,i(r.cold_min-n))}});const o={...t};o.t_boiling_max=r.boiling_max,o.t_hot_max=r.hot_max,o.t_warm_max=r.warm_max,o.t_perfect_max=r.perf_max,o.t_perfect_min=r.perf_min,o.t_mild_min=r.mild_min,o.t_cool_min=r.cool_min,o.t_chilly_min=r.chilly_min,o.t_cold_min=r.cold_min,o.t_frosty_min=r.frosty_min,o.t_boiling_min=i(r.hot_max+n),o.t_hot_min=i(r.warm_max+n),o.t_warm_min=i(r.perf_max+n),o.t_mild_max=i(r.perf_min-n),o.t_cool_max=i(r.mild_min-n),o.t_chilly_max=i(r.cool_min-n),o.t_cold_max=i(r.chilly_min-n),o.t_frosty_max=i(r.cold_min-n);const l=t=>Math.min(100,Math.max(0,i(t)));return o.rh_left_inner_pct=l(o.rh_left_inner_pct??40),o.rh_right_inner_pct=l(o.rh_right_inner_pct??60),o.rh_right_inner_pct<=o.rh_left_inner_pct&&(o.rh_right_inner_pct=l(o.rh_left_inner_pct+.1)),o}_persistKeys(t){const e={type:"custom:simple-air-comfort-card",name:t.name,temperature:t.temperature,temp_display_unit:t.temp_display_unit,feels_like:t.feels_like,humidity:t.humidity,windspeed:t.windspeed,wind_display_unit:t.wind_display_unit,default_wind_speed:t.default_wind_speed,decimals:t.decimals,y_offset_pct:t.y_offset_pct,rh_left_inner_pct:t.rh_left_inner_pct,rh_right_inner_pct:t.rh_right_inner_pct,t_frosty_min:t.t_frosty_min,t_cold_min:t.t_cold_min,t_chilly_min:t.t_chilly_min,t_cool_min:t.t_cool_min,t_mild_min:t.t_mild_min,t_perfect_min:t.t_perfect_min??t.t_perf_min,t_perfect_max:t.t_perfect_max??t.t_perf_max,t_warm_max:t.t_warm_max,t_hot_max:t.t_hot_max,t_boiling_max:t.t_boiling_max};return window.__sac_editor_prune_warned__||(console.info("simple-air-comfort-card-editor: Pruning derived temperature keys from YAML; the card will re-derive them at runtime from the 10 anchors."),window.__sac_editor_prune_warned__=!0),e}_autoPicked=!1;_autoFillDefaults(){if(this._autoPicked||!this.hass||!this._config)return;const t=this.hass.states,e=e=>{for(const[i,n]of Object.entries(t))if(e(i,n))return i},i=t=>t?.attributes?.device_class;this._config.temperature||(this._config.temperature=e((t,e)=>t.startsWith("sensor.")&&"temperature"===i(e))||this._config.temperature),this._config.humidity||(this._config.humidity=e((t,e)=>t.startsWith("sensor.")&&"humidity"===i(e))||this._config.humidity),this._autoPicked=!0,ot(this,"config-changed",{config:this._persistKeys(this._config)})}}customElements.get("simple-air-comfort-card-editor")||customElements.define("simple-air-comfort-card-editor",ht);window.customCards=window.customCards||[],window.customCards.push({type:"simple-air-comfort-card",name:"Simple Air Comfort Card",description:"Dew point + AT dial, comfort words, moving dot.",preview:!0,documentationURL:"https://github.com/MankiniChykan/simple-air-comfort-card"}),console.info('%c SIMPLE AIR COMFORT CARD %c v"1.0.321-dev.0" ',"color:white;background:#2a2a2a;padding:2px 6px;border-radius:4px 0 0 4px;","color:#2a2a2a;background:#c9c9c9;padding:2px 6px;border-radius:0 4px 4px 0;"),_t.prototype.getCardSize=function(){return 3},_t.prototype.getGridOptions=function(){return{columns:6,rows:"auto",min_columns:6,max_columns:12,min_rows:1,max_rows:6}};
//# sourceMappingURL=simple-air-comfort-card.js.map
