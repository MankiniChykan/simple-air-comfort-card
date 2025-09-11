/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(s,t,i)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:o,defineProperty:m,getOwnPropertyDescriptor:c,getOwnPropertyNames:l,getOwnPropertySymbols:h,getPrototypeOf:_}=Object,d=globalThis,p=d.trustedTypes,u=p?p.emptyScript:"",f=d.reactiveElementPolyfillSupport,g=(t,e)=>t,x={toAttribute(t,e){switch(e){case Boolean:t=t?u:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!o(t,e),y={attribute:!0,type:String,converter:x,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),d.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&m(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);n?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=_(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...l(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),n=t.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:x).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:x;this._$Em=s;const r=n.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,n=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??b)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[g("elementProperties")]=new Map,$[g("finalized")]=new Map,f?.({ReactiveElement:$}),(d.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,v=w.trustedTypes,C=v?v.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+E,T=`<${O}>`,N=document,L=()=>N.createComment(""),R=t=>null===t||"object"!=typeof t&&"function"!=typeof t,F=Array.isArray,S="[ \t\n\f\r]",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,P=/-->/g,k=/>/g,D=RegExp(`>|${S}(?:([^\\s"'>=/]+)(${S}*=${S}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,H=/"/g,B=/^(?:script|style|textarea|title)$/i,U=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),Y=Symbol.for("lit-nothing"),z=new WeakMap,G=N.createTreeWalker(N,129);function j(t,e){if(!F(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const q=(t,e)=>{const i=t.length-1,s=[];let n,r=2===e?"<svg>":3===e?"<math>":"",a=M;for(let e=0;e<i;e++){const i=t[e];let o,m,c=-1,l=0;for(;l<i.length&&(a.lastIndex=l,m=a.exec(i),null!==m);)l=a.lastIndex,a===M?"!--"===m[1]?a=P:void 0!==m[1]?a=k:void 0!==m[2]?(B.test(m[2])&&(n=RegExp("</"+m[2],"g")),a=D):void 0!==m[3]&&(a=D):a===D?">"===m[0]?(a=n??M,c=-1):void 0===m[1]?c=-2:(c=a.lastIndex-m[2].length,o=m[1],a=void 0===m[3]?D:'"'===m[3]?H:I):a===H||a===I?a=D:a===P||a===k?a=M:(a=D,n=void 0);const h=a===D&&t[e+1].startsWith("/>")?" ":"";r+=a===M?i+T:c>=0?(s.push(o),i.slice(0,c)+A+i.slice(c)+E+h):i+E+(-2===c?e:h)}return[j(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class V{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const a=t.length-1,o=this.parts,[m,c]=q(t,e);if(this.el=V.createElement(m,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=G.nextNode())&&o.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(A)){const e=c[r++],i=s.getAttribute(t).split(E),a=/([.?@])?(.*)/.exec(e);o.push({type:1,index:n,name:a[2],strings:i,ctor:"."===a[1]?Q:"?"===a[1]?tt:"@"===a[1]?et:Z}),s.removeAttribute(t)}else t.startsWith(E)&&(o.push({type:6,index:n}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(E),e=t.length-1;if(e>0){s.textContent=v?v.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],L()),G.nextNode(),o.push({type:2,index:++n});s.append(t[e],L())}}}else if(8===s.nodeType)if(s.data===O)o.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(E,t+1));)o.push({type:7,index:n}),t+=E.length-1}n++}}static createElement(t,e){const i=N.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,s){if(e===W)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const r=R(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=J(t,n._$AS(t,e.values),n,s)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??N).importNode(e,!0);G.currentNode=s;let n=G.nextNode(),r=0,a=0,o=i[0];for(;void 0!==o;){if(r===o.index){let e;2===o.type?e=new X(n,n.nextSibling,this,t):1===o.type?e=new o.ctor(n,o.name,o.strings,this,t):6===o.type&&(e=new it(n,this,t)),this._$AV.push(e),o=i[++a]}r!==o?.index&&(n=G.nextNode(),r++)}return G.currentNode=N,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=Y,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),R(t)?t===Y||null==t||""===t?(this._$AH!==Y&&this._$AR(),this._$AH=Y):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>F(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Y&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(N.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=V.createElement(j(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new K(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=z.get(t.strings);return void 0===e&&z.set(t.strings,e=new V(t)),e}k(t){F(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new X(this.O(L()),this.O(L()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Z{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=Y,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Y}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(void 0===n)t=J(this,t,e,0),r=!R(t)||t!==this._$AH&&t!==W,r&&(this._$AH=t);else{const s=t;let a,o;for(t=n[0],a=0;a<n.length-1;a++)o=J(this,s[i+a],e,a),o===W&&(o=this._$AH[a]),r||=!R(o)||o!==this._$AH[a],o===Y?t=Y:t!==Y&&(t+=(o??"")+n[a+1]),this._$AH[a]=o}r&&!s&&this.j(t)}j(t){t===Y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Q extends Z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Y?void 0:t}}class tt extends Z{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Y)}}class et extends Z{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??Y)===W)return;const i=this._$AH,s=t===Y&&i!==Y||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==Y&&(i===Y||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const st=w.litHtmlPolyfillSupport;st?.(V,X),(w.litHtmlVersions??=[]).push("3.3.1");const nt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class rt extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new X(e.insertBefore(L(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}rt._$litElement$=!0,rt.finalized=!0,nt.litElementHydrateSupport?.({LitElement:rt});const at=nt.litElementPolyfillSupport;at?.({LitElement:rt}),(nt.litElementVersions??=[]).push("4.2.1");const ot=(t,e,i,s)=>{const n=new Event(e,{bubbles:s?.bubbles??!0,cancelable:s?.cancelable??!1,composed:s?.composed??!0});return n.detail=i,t.dispatchEvent(n),n};class mt extends rt{static properties={hass:{type:Object},_config:{state:!0}};constructor(){super(),this._config=void 0,this._ro=null,this._hass=void 0}static styles=r`
    /* HOST: keep layout flexible; height comes from content (the 1:1 stage) */
    :host {
        display: block;
        width: 100%;
        box-sizing: border-box;
        min-height: 0;
        --sac-scale: 1;
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
      margin-top: 0rem;
    }
    .tl{ left:0%;  top:0%;  transform:translate(20%,100%); text-align:left; }
    .tr{ right:0%; top:0%;  transform:translate(-20%,100%); text-align:right; }
    .bl{ left:0%;  bottom:0%; transform:translate(20%,-5%);   text-align:left; }
    .br{ right:0%; bottom:0%; transform:translate(-20%,-5%);   text-align:right; }

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
  `;connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{const t=this.renderRoot?.querySelector(".ratio")||this;if(!t)return;this._ro=new ResizeObserver(e=>{for(const i of e){const e=(i.contentBoxSize?.[0]?.inlineSize??i.contentRect?.width??t.clientWidth??300)/300;this.style.setProperty("--sac-scale",String(e))}}),this._ro.observe(t)})}disconnectedCallback(){try{this._ro?.disconnect()}catch(t){}this._ro=null,super.disconnectedCallback()}setConfig(t){if(!t||!t.temperature||!t.humidity)throw new Error('simple-air-comfort-card: "temperature" and "humidity" are required.');const e=t=>null==t||""===t?NaN:Number(t),i=Number.isFinite(e(t.ring_pct))?e(t.ring_pct):45,s=Number.isFinite(e(t.inner_pct))?e(t.inner_pct):46.5,n=Number.isFinite(e(t.y_offset_pct))?e(t.y_offset_pct):0;this._config={name:t.name??"Air Comfort",temperature:t.temperature,humidity:t.humidity,windspeed:t.windspeed,decimals:Number.isFinite(e(t.decimals))?e(t.decimals):1,default_wind_speed:Number.isFinite(e(t.default_wind_speed))?e(t.default_wind_speed):0,t_frosty_min:Number.isFinite(e(t.t_frosty_min))?e(t.t_frosty_min):-40,t_frosty_max:Number.isFinite(e(t.t_frosty_max))?e(t.t_frosty_max):2.9,t_cold_min:Number.isFinite(e(t.t_cold_min))?e(t.t_cold_min):3,t_cold_max:Number.isFinite(e(t.t_cold_max))?e(t.t_cold_max):4.9,t_chilly_min:Number.isFinite(e(t.t_chilly_min))?e(t.t_chilly_min):5,t_chilly_max:Number.isFinite(e(t.t_chilly_max))?e(t.t_chilly_max):8.9,t_cool_min:Number.isFinite(e(t.t_cool_min))?e(t.t_cool_min):9,t_cool_max:Number.isFinite(e(t.t_cool_max))?e(t.t_cool_max):13.9,t_mild_min:Number.isFinite(e(t.t_mild_min))?e(t.t_mild_min):14,t_mild_max:Number.isFinite(e(t.t_mild_max))?e(t.t_mild_max):18.9,t_perf_min:Number.isFinite(e(t.t_perf_min))?e(t.t_perf_min):19,t_perf_max:Number.isFinite(e(t.t_perf_max))?e(t.t_perf_max):23.9,t_warm_min:Number.isFinite(e(t.t_warm_min))?e(t.t_warm_min):24,t_warm_max:Number.isFinite(e(t.t_warm_max))?e(t.t_warm_max):27.9,t_hot_min:Number.isFinite(e(t.t_hot_min))?e(t.t_hot_min):28,t_hot_max:Number.isFinite(e(t.t_hot_max))?e(t.t_hot_max):34.9,t_boiling_min:Number.isFinite(e(t.t_boiling_min))?e(t.t_boiling_min):35,t_boiling_max:Number.isFinite(e(t.t_boiling_max))?e(t.t_boiling_max):60,ring_pct:i,inner_pct:s,center_pct:50,y_offset_pct:n,rh_left_inner_pct:Number.isFinite(e(t.rh_left_inner_pct))?e(t.rh_left_inner_pct):40,rh_right_inner_pct:Number.isFinite(e(t.rh_right_inner_pct))?e(t.rh_right_inner_pct):60}}render(){if(!this.hass||!this._config)return U``;const t=this.hass.states[this._config.temperature],e=this.hass.states[this._config.humidity],i=this._config.windspeed?this.hass.states[this._config.windspeed]:void 0;if(!t||!e){this.style.setProperty("--sac-temp-bg","#2a2a2a");const{y_center:t}=this.#t();return U`
        <div class="ratio" role="img" aria-label="Air comfort dial">
          <div class="canvas">
            ${this.#e({dewText:"Unknown",tempText:"N/A",rhText:"N/A",ringGrad:this.#i("Unknown"),innerGrad:this.#s(NaN,NaN,this.#n()),xPct:50,yPct:t,outside:!0,dewOut:"—",atOut:"—",tempRaw:"—",rhRaw:"—",axisTopStyle:"",axisBottomStyle:"",axisLeftStyle:"",axisRightStyle:""})}
          </div>
        </div>
      `}const s=(t.attributes.unit_of_measurement||"°C").trim(),n=this.#r(Number.isFinite(+t.state)?+t.state:NaN,s),r=this.#a(Number.isFinite(+e.state)?+e.state:NaN),a=this.#o(i,this._config.default_wind_speed),o=r/100*this.#m(n),m=this.#c(o),c=this.#l(n,o,a),l=this.#h(m),h=this.#_(n),_=this.#d(r),d=this.#p(n),p=this.#i(l),u=this.#n(),f=this.#s(r,n,u),g=Number(this._config?.rh_left_inner_pct??40),x=Number(this._config?.rh_right_inner_pct??60),b=this.#u(),y=Number.isFinite(n)&&n>u.PERFECT.max,$=Number.isFinite(n)&&n<u.PERFECT.min,w=Number.isFinite(r)&&r<g,v=Number.isFinite(r)&&r>x,C=y?`color:white; text-shadow:\n      0 0 2px white, 0 0 6px ${b.hot}, 0 0 12px ${b.hot}, 0 0 20px ${b.hot}`:"",A=$?`color:white; text-shadow:\n      0 0 2px white, 0 0 6px ${b.cold}, 0 0 12px ${b.cold}, 0 0 20px ${b.cold}`:"",E=w?`color:white; text-shadow:\n      0 0 2px white, 0 0 6px ${b.humid}, 0 0 12px ${b.humid}, 0 0 20px ${b.humid}`:"",O=v?`color:white; text-shadow:\n      0 0 2px white, 0 0 6px ${b.humid}, 0 0 12px ${b.humid}, 0 0 20px ${b.humid}`:"",T=this.#f(n),N=Number.isFinite(T)?this.#g(T+(this._config.y_offset_pct||0),0,100):50,L=this.#x(r),R=Number.isFinite(L)?this.#g(L,0,100):50,F=!Number.isFinite(r)||!Number.isFinite(n)||(r<g||r>x||n<u.PERFECT.min||n>u.PERFECT.max),S=this._config.decimals,M=s,P=this.#b(this.#y(m,M),S)+` ${M}`,k=this.#b(this.#y(c,M),S)+` ${M}`,D=this.#b(this.#y(n,M),S)+` ${M}`,I=Number.isFinite(r)?this.#$(r,S).toFixed(S)+" %":"—";return this.style.setProperty("--sac-temp-bg",d),U`
      <div class="ratio" role="img" aria-label="Air comfort dial">
        <div class="canvas">
          ${this.#e({Tc:n,RH:r,dpC:m,atC:c,dewText:l,tempText:h,rhText:_,cardBg:d,ringGrad:p,innerGrad:f,xPct:R,yPct:N,outside:F,outUnit:M,d:S,dewOut:P,atOut:k,tempRaw:D,rhRaw:I,axisTopStyle:C,axisBottomStyle:A,axisLeftStyle:E,axisRightStyle:O})}
        </div>
      </div>
    `}#e({dewText:t,tempText:e,rhText:i,ringGrad:s,innerGrad:n,xPct:r,yPct:a,outside:o,dewOut:m,atOut:c,tempRaw:l,rhRaw:h,axisTopStyle:_="",axisBottomStyle:d="",axisLeftStyle:p="",axisRightStyle:u=""}){return U`
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
        <span class="metric">${c}</span>
      </div>

      <!-- BL / BR corner stats (raw values + comfort labels) -->
      <div class="corner bl">
        <span class="label">Temp</span>
        <span class="metric">${l}</span>
        <span class="comfort">${e}</span>
      </div>
      <div class="corner br">
        <span class="label">Humidity</span>
        <span class="metric">${h}</span>
        <span class="comfort">${i}</span>
      </div>

      <!-- Dial (outer ring + inner eye) and labeled axes -->
      <div class="graphic" style="--sac-dewpoint-ring:${s}; --sac-inner-gradient:${n}">
        <div class="axis axis-top"    style=${_||Y}    aria-label="Warm">Warm</div>
        <div class="axis axis-bottom" style=${d||Y} aria-label="Cold">Cold</div>
        <div class="axis axis-left"   style=${p||Y}   aria-label="Dry">Dry</div>
        <div class="axis axis-right"  style=${u||Y}  aria-label="Humid">Humid</div>

        <div class="outer-ring" aria-hidden="true"></div>
        <div class="inner-circle" aria-hidden="true"></div>
      </div>

      <!-- The moving dot -->
      <div class="dot ${o?"outside":""}" style="left:${r}%; bottom:${a}%;"></div>
    `}#l(t,e,i){return t+.33*e-.7*i-4}#m(t){return Number.isFinite(t)?t>=0?6.1121*Math.exp(t/(257.14+t)*(18.678-t/234.5)):6.1115*Math.exp(t/(279.82+t)*(23.036-t/333.7)):NaN}#c(t){if(!Number.isFinite(t)||t<=0)return NaN;let e=-80,i=60,s=0;for(let n=0;n<60;n++){s=(e+i)/2;const n=this.#m(s);if(!Number.isFinite(n))break;if(n>t?i=s:e=s,Math.abs(i-e)<1e-4)break}return s}#h(t){return Number.isFinite(t)?t<5?"Very Dry":t<=10?"Dry":t<=12.79?"Pleasant":t<=15.49?"Comfortable":t<=18.39?"Sticky Humid":t<=21.19?"Muggy":t<=23.9?"Sweltering":"Stifling":"Unknown"}#_(t){if(!Number.isFinite(t))return"N/A";const e=this.#n(),i=this.#w(t),s=[["FROSTY",e.FROSTY.min,e.FROSTY.max],["COLD",e.COLD.min,e.COLD.max],["CHILLY",e.CHILLY.min,e.CHILLY.max],["COOL",e.COOL.min,e.COOL.max],["MILD",e.MILD.min,e.MILD.max],["PERFECT",e.PERFECT.min,e.PERFECT.max],["WARM",e.WARM.min,e.WARM.max],["HOT",e.HOT.min,e.HOT.max],["BOILING",e.BOILING.min,e.BOILING.max]];for(const[t,e,n]of s)if(i>=e&&i<=n)return t;return i<s[0][1]?"FROSTY":"BOILING"}#d(t){if(!Number.isFinite(t))return"N/A";const e=Number(this._config?.rh_left_inner_pct??40),i=Number(this._config?.rh_right_inner_pct??60);return t<e?"DRY":t<=i?"COMFY":"HUMID"}#v(t){return Number.isFinite(t)?this.#_(t).toLowerCase():"n/a"}#C(t){const e=String(t||"").toLowerCase();return"frosty"===e?"mediumblue":"cold"===e?"dodgerblue":"chilly"===e?"deepskyblue":"cool"===e?"mediumaquamarine":"mild"===e?"seagreen":"perfect"===e?"limegreen":"warm"===e?"gold":"hot"===e?"orange":"boiling"===e?"crimson":"dimgray"}#p(t){const e=this.#v(t);return`radial-gradient(circle, rgba(100,100,100,0.15), rgba(100,100,100,0.15), rgba(100,100,100,0.15), ${this.#C(e)})`}#i(t){return`radial-gradient(circle, ${{"Very Dry":"deepskyblue",Dry:"mediumaquamarine",Pleasant:"limegreen",Comfortable:"yellowgreen","Sticky Humid":"yellow",Muggy:"gold",Sweltering:"orange",Stifling:"crimson"}[t]||"dimgray"}, 55%, rgba(100,100,100,0.15), rgba(100,100,100,0.15))`}#s(t,e,i){const s=this.#u(),n=Number(this._config?.rh_left_inner_pct??40),r=Number(this._config?.rh_right_inner_pct??60);let a="black";Number.isFinite(t)?(t<n||t>r)&&(a=s.humid):a="dimgray";const o=i.PERFECT.min,m=i.PERFECT.max;let c=s.inband;return Number.isFinite(e)&&(e>m?c=s.hot:e<o&&(c=s.cold)),`radial-gradient(circle, ${a} 0%, black, ${c} 70%)`}#g(t,e,i){return Math.min(i,Math.max(e,t))}#A(t,e,i){return e+(i-e)*t}#E(t,e,i){return(t-e)/(i-e)}#w(t){return Math.round(10*t)/10}#O(t){return t*t*(3-2*t)}#u(){return{hot:"var(--sac-col-hot, rgba(255,69,0,0.95))",cold:"var(--sac-col-cold, rgba(0,102,255,0.95))",humid:"var(--sac-col-humid-alert, hotpink)",inband:"var(--sac-col-inband, dimgray)"}}#n(){const t=this._config||{},e=(t,e)=>{const i=Number.isFinite(t)?t:e;return Math.round(10*i)/10},i={FROSTY:{min:e(t.t_frosty_min,-40),max:e(t.t_frosty_max,2.9)},COLD:{min:e(t.t_cold_min,3),max:e(t.t_cold_max,4.9)},CHILLY:{min:e(t.t_chilly_min,5),max:e(t.t_chilly_max,8.9)},COOL:{min:e(t.t_cool_min,9),max:e(t.t_cool_max,13.9)},MILD:{min:e(t.t_mild_min,14),max:e(t.t_mild_max,18.9)},PERFECT:{min:e(t.t_perf_min,19),max:e(t.t_perf_max,23.9)},WARM:{min:e(t.t_warm_min,24),max:e(t.t_warm_max,27.9)},HOT:{min:e(t.t_hot_min,28),max:e(t.t_hot_max,34.9)},BOILING:{min:e(t.t_boiling_min,35),max:e(t.t_boiling_max,60)}},s=["FROSTY","COLD","CHILLY","COOL","MILD","PERFECT","WARM","HOT","BOILING"];for(let t=0;t<s.length;t++){const n=s[t-1]&&i[s[t-1]],r=i[s[t]];if(t>0){const t=e(n.max+.1,n.max+.1);r.min<t&&(r.min=t)}r.max<r.min&&(r.max=r.min)}return i}#t(){const t=Number(this._config?.ring_pct??45),e=Number(this._config?.inner_pct??46.5),i=Number(this._config?.center_pct??50),s=t/2,n=e/100*(t/2),r=i-s,a=i+s;return{y_outer_bottom:r,y_outer_top:a,y_inner_bottom:i-n,y_inner_top:i+n,y_center:i,y_half_below_outer:(0+r)/2,y_half_above_outer:(100+a)/2,x_inner_left:50-n,x_inner_right:50+n}}#x(t){if(!Number.isFinite(t))return NaN;const{x_inner_left:e,x_inner_right:i}=this.#t(),s=Number(this._config?.rh_left_inner_pct??40),n=Number(this._config?.rh_right_inner_pct??60),r=this.#g(s,0,100),a=this.#g(Math.max(n,r+.1),0,100),o=this.#g(t,0,100),m=1e-6;if(r<=m&&o<=r)return 0;if(a>=100-m&&o>=a)return 100;if(o<=r){const t=this.#E(o,0,r);return this.#A(t,0,e)}if(o>=a){const t=this.#E(o,a,100);return this.#A(t,i,100)}{const t=this.#E(o,r,a);return this.#A(t,e,i)}}#f(t){const e=this.#t(),i=this.#n(),s=e.y_outer_bottom,n=e.y_inner_bottom,r=e.y_inner_top,a=e.y_outer_top,o=(t,e,i)=>{const s=i-e;return!Number.isFinite(s)||Math.abs(s)<1e-6?0:this.#g((t-e)/s,0,1)},m=i.FROSTY.min,c=i.MILD.min,l=s,h=t=>0+o(t,m,c)*(l-0),_=h(i.FROSTY.min),d=h(i.COLD.min),p=h(i.CHILLY.min),u=h(i.COOL.min),f=h(i.MILD.min),g=i.WARM.max,x=i.BOILING.max,b=a,y=b+o(i.HOT.max,g,x)*(100-b),$=[{t:i.FROSTY.min,y:_},{t:i.COLD.min,y:d},{t:i.CHILLY.min,y:p},{t:i.COOL.min,y:u},{t:i.MILD.min,y:f},{t:i.PERFECT.min,y:n},{t:i.PERFECT.max,y:r},{t:i.WARM.max,y:a},{t:i.HOT.max,y:y},{t:i.BOILING.max,y:100}];if(!Number.isFinite(t))return e.y_center;if(t<=$[0].t)return $[0].y;if(t>=$[$.length-1].t)return $[$.length-1].y;for(let e=0;e<$.length-1;e++){const s=$[e],n=$[e+1];if(t>=s.t&&t<=n.t){const e=this.#g((t-s.t)/(n.t-s.t),0,1),r=s.t===i.MILD.min&&n.t===i.PERFECT.min||s.t===i.PERFECT.min&&n.t===i.PERFECT.max||s.t===i.PERFECT.max&&n.t===i.WARM.max?e:this.#O(e);return s.y+(n.y-s.y)*r}}return e.y_center}#a(t){return Number.isFinite(t)?Math.min(100,Math.max(0,t)):NaN}#r(t,e){return Number.isFinite(t)?(e||"").toLowerCase().includes("f")?5/9*(t-32):t:NaN}#y(t,e){return Number.isFinite(t)?(e||"").toLowerCase().includes("f")?9*t/5+32:t:NaN}#o(t,e){if(!t)return e??0;const i=parseFloat(t.state);if(!Number.isFinite(i))return e??0;const s=(t.attributes.unit_of_measurement||"m/s").toLowerCase();return s.includes("m/s")?i:s.includes("km/h")||s.includes("kph")?i/3.6:s.includes("mph")?.44704*i:s.includes("kn")?.514444*i:i}#$(t,e=1){if(!Number.isFinite(t))return NaN;const i=Math.pow(10,e);return Math.round(t*i)/i}#b(t,e=1){return Number.isFinite(t)?this.#$(t,e).toLocaleString(void 0,{minimumFractionDigits:e,maximumFractionDigits:e}):"—"}set hass(t){this._hass=t,this.requestUpdate()}get hass(){return this._hass}static getConfigElement(){return document.createElement("simple-air-comfort-card-editor")}static getStubConfig(t){const e=t??document.querySelector("home-assistant")?.hass,i=e?.states??{},s=t=>{for(const[e,s]of Object.entries(i))if(t(e,s))return e},n=t=>t?.attributes?.device_class,r=t=>(t?.attributes?.unit_of_measurement||"").toLowerCase();return{name:"Area Name",temperature:s((t,e)=>t.startsWith("sensor.")&&"temperature"===n(e))||s((t,e)=>t.startsWith("sensor.")&&/°c|°f/.test(r(e)))||s(t=>t.startsWith("sensor.")),humidity:s((t,e)=>t.startsWith("sensor.")&&"humidity"===n(e))||s((t,e)=>t.startsWith("sensor.")&&r(e).includes("%"))||s(t=>t.startsWith("sensor.")),windspeed:s((t,e)=>t.startsWith("sensor.")&&"wind_speed"===n(e))||s((t,e)=>t.startsWith("sensor.")&&/(m\/s|km\/h|kph|mph|kn)/.test(r(e))),decimals:1,default_wind_speed:.1}}}customElements.define("simple-air-comfort-card",mt);class ct extends rt{static properties={hass:{type:Object},_config:{state:!0},_schema:{state:!0}};static styles=r`
    .wrap{ padding:12px 12px 16px; }
    .row{ display:grid; grid-template-columns:auto 1fr auto auto; align-items:center; gap:10px; padding:8px 0; }
    .name{ font-weight:600; }
    .helper{ grid-column:1 / -1; opacity:.8; font-size:.92em; margin:-2px 0 4px; }
    .btn{
      appearance:none; border:1px solid var(--divider-color, #444);
      background:var(--ha-card-background, #1c1c1c); color:var(--primary-text-color,#fff);
      padding:4px 10px; border-radius:8px; font-weight:600; cursor:pointer;
    }
    .btn:active{ transform:translateY(1px); }
    .value{ font-variant-numeric:tabular-nums; font-weight:600; }
    .title{ font-size:0.95em; opacity:.85; margin:12px 0 6px; }
    .mid{ margin:6px 0 4px; font-size:.95em; opacity:.9; }
    .actions{ display:flex; gap:8px; margin-top:10px; }
    .danger{ border-color:#a33; color:#fff; background:#702; }
  `;connectedCallback(){super.connectedCallback(),window.loadCardHelpers?.().catch(()=>{})}set hass(t){this._hass=t,this._autoFillDefaults(),this.requestUpdate()}get hass(){return this._hass}setConfig(t){this._config={name:"Area Name",temperature:void 0,humidity:void 0,windspeed:void 0,decimals:1,default_wind_speed:.1,t_frosty_min:-40,t_frosty_max:2.9,t_cold_min:3,t_cold_max:4.9,t_chilly_min:5,t_chilly_max:8.9,t_cool_min:9,t_cool_max:13.9,t_mild_min:14,t_mild_max:18.9,t_perf_min:19,t_perf_max:23.9,t_warm_min:24,t_warm_max:27.9,t_hot_min:28,t_hot_max:34.9,t_boiling_min:35,t_boiling_max:60,y_offset_pct:0,rh_left_inner_pct:40,rh_right_inner_pct:60,...t??{}},this._defaults={t_hot_max:34.9,t_warm_max:27.9,t_perf_max:23.9,t_perf_min:19,t_mild_min:14,t_cool_min:9,t_chilly_min:5,t_cold_min:3}}render(){return this.hass&&this._config?U`<div class="wrap">
      <div class="title">Entities & Misc</div>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${[{name:"name",selector:{text:{}}},{name:"temperature",required:!0,selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"humidity",required:!0,selector:{entity:{domain:"sensor",device_class:"humidity"}}},{name:"windspeed",selector:{entity:{domain:"sensor",device_class:"wind_speed"}}},{name:"default_wind_speed",selector:{number:{min:0,max:50,step:.1,mode:"box",unit_of_measurement:"m/s"}}},{name:"decimals",selector:{number:{min:0,max:3,step:1,mode:"box"}}},{name:"rh_left_inner_pct",selector:{number:{min:0,max:100,step:.1,mode:"box",unit_of_measurement:"%"}}},{name:"rh_right_inner_pct",selector:{number:{min:0,max:100,step:.1,mode:"box",unit_of_measurement:"%"}}},{name:"y_offset_pct",selector:{number:{min:-30,max:30,step:.5,mode:"box",unit_of_measurement:"%"}}}]}
        .computeLabel=${this._label}
        .computeHelper=${this._helper}
        @value-changed=${this._onMiscChange}>
      </ha-form>

      <div class="title">Temperature anchors (buttons)</div>
      ${this._anchorRow("t_boiling_max","BOILING.max → top (100%)","Dragging number down stops at BOILING.min. Dragging number up increases the scale.",!1)}
      ${this._anchorRow("t_hot_max","HOT.max (tied to BOILING.min +0.1)","Button down drops BOILING.min. Button up increases HOT.max. Limit ±4°C from default.",!0)}
      ${this._anchorRow("t_warm_max","WARM.max → outer-top (tied to HOT.min +0.1)","Button down drops HOT.min. Button up increases WARM.max. Limit ±4°C from default.",!0)}
      ${this._anchorRow("t_perf_max","PERFECT.max → inner-top (tied to WARM.min +0.1)","Button down drops WARM.min. Button up increases PERFECT.max. Limit ±4°C from default.",!0)}

      <div class="mid">Center (midpoint PERFECT min/max): ${this._centerTemp()}</div>

      ${this._anchorRow("t_perf_min","PERFECT.min → inner-bottom (tied to MILD.max −0.1)","Button down drops PERFECT.min. Button up increases MILD.max. Limit ±4°C from default.",!0)}
      ${this._anchorRow("t_mild_min","MILD.min → outer-bottom (tied to COOL.max −0.1)","Button down drops MILD.min. Button up increases COOL.max. Limit ±4°C from default.",!0)}
      ${this._anchorRow("t_cool_min","COOL.min (tied to CHILLY.max −0.1)","Button down drops COOL.min. Button up increases CHILLY.max. Limit ±4°C from default.",!0)}
      ${this._anchorRow("t_chilly_min","CHILLY.min (tied to COLD.max −0.1)","Button down drops CHILLY.min. Button up increases COLD.max. Limit ±4°C from default.",!0)}
      ${this._anchorRow("t_cold_min","COLD.min (tied to FROSTY.max −0.1)","Button down drops COLD.min. Button up increases FROSTY.max. Limit ±4°C from default.",!0)}
      ${this._anchorRow("t_frosty_min","FROSTY.min → bottom (0%)","Dragging number up stops at FROSTY.max. Dragging number down increases the scale.",!1)}

      <div class="actions">
        <button class="btn danger" @click=${this._resetDefaults}>Reset to defaults</button>
      </div>
    </div>`:U``}_label=t=>{const e=t.name;return{name:"Name",temperature:"Temperature entity",humidity:"Humidity entity",windspeed:"Wind speed entity (optional)",default_wind_speed:"Default wind speed (m/s)",decimals:"Decimals",rh_left_inner_pct:"Inner circle left RH (%)",rh_right_inner_pct:"Inner circle right RH (%)",ring_pct:"Outer ring box size (% of card)",inner_pct:"Inner circle size (% of ring box)",y_offset_pct:"Vertical dot offset (%)"}[e]??e};_anchorRow(t,e,i,s){const n=Number(this._config?.[t]),r=Number.isFinite(n)?`${n.toFixed(1)} °C`:"—";return U`
      <div class="row">
        <div class="name">${e}</div>
        <div class="value">${r}</div>
        <button class="btn" @click=${()=>this._bump(t,-.1,s)} aria-label="${e} down">−</button>
        <button class="btn" @click=${()=>this._bump(t,.1,s)} aria-label="${e} up">+</button>
        <div class="helper">${i}</div>
      </div>
    `}_helper=t=>{const e=t=>this.hass?.states?.[this._config?.[t]],i=t=>e(t)?.attributes?.unit_of_measurement??"",s=t.name;switch(s){case"name":return"Shown as the small grey title at the top of the card.";case"temperature":return"Pick an indoor temperature sensor. "+(i("temperature")?`Current unit: ${i("temperature")}.`:"");case"humidity":return"Pick a relative humidity sensor (0–100%). "+(i("humidity")?`Current unit: ${i("humidity")}.`:"");case"windspeed":return"Optional. If set, Apparent Temperature uses this wind; if empty, the “Default wind speed” below is used.";case"default_wind_speed":return"Indoor fallback for Apparent Temperature when no wind sensor is set. Typical indoors: 0.0–0.2 m/s.";case"decimals":return"How many decimal places to show for temperatures and humidity.";case"rh_left_inner_pct":case"rh_right_inner_pct":return"Maps RH to the inner-circle intersections horizontally: left = this %, right = this %. 0% stays at the left edge; 100% stays at the right edge.";case"y_offset_pct":return"Fine-tune the dot’s vertical position in % of card height (positive moves up)."}return"t_boiling_max"===s?"BOILING.max → top (100%). Dragging down stops at BOILING.min (tracks HOT.max+0.1). Dragging up increases the scale.":"t_hot_max"===s?"HOT.max. Drags BOILING.min with it up/down (BOILING.min = HOT.max+0.1). HOT.max ≤ BOILING.max−0.1 and ≥ WARM.max+0.1.":"t_warm_max"===s?"WARM.max → outer-top. Drags HOT.min with it (HOT.min = WARM.max+0.1). WARM.max ≤ HOT.max−0.1 and ≥ PERFECT.max+0.1.":"t_perf_max"===s?"PERFECT.max → inner-top. Drags WARM.min (WARM.min = PERFECT.max+0.1). PERFECT.max ≤ WARM.max−0.1 and ≥ PERFECT.min+0.1.":"t_perf_min"===s?"PERFECT.min → inner-bottom. Drags MILD.max (MILD.max = PERFECT.min−0.1). PERFECT.min ≤ PERFECT.max−0.1 and ≥ MILD.min+0.1.":"t_mild_min"===s?"MILD.min → outer-bottom. Drags COOL.max (COOL.max = MILD.min−0.1). MILD.min ≤ PERFECT.min and ≥ COOL.min+0.1.":"t_cool_min"===s?"COOL.min. Drags CHILLY.max (CHILLY.max = COOL.min−0.1). COOL.min ≤ MILD.min and ≥ CHILLY.min+0.1.":"t_chilly_min"===s?"CHILLY.min. Drags COLD.max (COLD.max = CHILLY.min−0.1). CHILLY.min ≤ COOL.min and ≥ COLD.min+0.1.":"t_cold_min"===s?"COLD.min. Drags FROSTY.max (FROSTY.max = COLD.min−0.1). COLD.min ≤ CHILLY.min and ≥ FROSTY.min+0.1.":"t_frosty_min"===s?"FROSTY.min → bottom (0%). Dragging up stops at FROSTY.max (COLD.max−0.1). Dragging down increases the scale lower.":/^t_.*_(min|max)$/.test(s)?"All band edges keep contiguous 0.1 °C gaps automatically.":"Tip: values update immediately; click Save when done."};_centerTemp(){const t=this._config||{},e=Number(t.t_perf_min),i=Number(t.t_perf_max);return Number.isFinite(e)&&Number.isFinite(i)?`${((e+i)/2).toFixed(2)} °C`:"—"}_resetDefaults=()=>{const t={...this._config||{}};t.t_boiling_max=60,t.t_hot_max=34.9,t.t_warm_max=27.9,t.t_perf_max=23.9,t.t_perf_min=19,t.t_mild_min=14,t.t_cool_min=9,t.t_chilly_min=5,t.t_cold_min=3,t.t_frosty_min=-40;const e=this._applyTempsRowBiDirectional(t,["t_boiling_max","t_hot_max","t_warm_max","t_perf_max","t_perf_min","t_mild_min","t_cool_min","t_chilly_min","t_cold_min","t_frosty_min"]);this._config=e,ot(this,"config-changed",{config:e})};_onMiscChange=t=>{t.stopPropagation();const e={...t.detail?.value||{}};if(!Object.keys(e).length)return;const i={...this._config||{},...e};this._config=i,ot(this,"config-changed",{config:i})};_bump(t,e,i){const s=t=>Math.round(10*t)/10,n={...this._config||{}},r=Number(n[t]);if(!Number.isFinite(r))return;let a=s(r+(e>0?.1:-.1));i&&this._defaults[t.replace("t_","")];const o={t_hot_max:"t_hot_max",t_warm_max:"t_warm_max",t_perf_max:"t_perf_max",t_perf_min:"t_perf_min",t_mild_min:"t_mild_min",t_cool_min:"t_cool_min",t_chilly_min:"t_chilly_min",t_cold_min:"t_cold_min"};if(i&&o[t]){const e=this._defaults[o[t].replace("t_","")];if(Number.isFinite(e)){const t=s(e-4),i=s(e+4);a=Math.min(i,Math.max(t,a))}}const m={...n,[t]:a},c=this._applyTempsRowBiDirectional(m,[t]);this._config=c,ot(this,"config-changed",{config:c})}_applyTempsRowBiDirectional(t,e=[]){const i=t=>Math.round(10*(Number(t)||0))/10,s=.1,n={boiling_max:i(t.t_boiling_max??60),hot_max:i(t.t_hot_max??34.9),warm_max:i(t.t_warm_max??27.9),perf_max:i(t.t_perf_max??23.9),perf_min:i(t.t_perf_min??19),mild_min:i(t.t_mild_min??14),cool_min:i(t.t_cool_min??9),chilly_min:i(t.t_chilly_min??5),cold_min:i(t.t_cold_min??3),frosty_min:i(t.t_frosty_min??-40)},r={t_boiling_max:"boiling_max",t_hot_max:"hot_max",t_warm_max:"warm_max",t_perf_max:"perf_max",t_perf_min:"perf_min",t_mild_min:"mild_min",t_cool_min:"cool_min",t_chilly_min:"chilly_min",t_cold_min:"cold_min",t_frosty_min:"frosty_min"},a=(e&&e.length?e:Object.keys(r)).map(t=>r[t]||t).filter(Boolean);a.forEach(t=>{switch(t){case"boiling_max":n.boiling_max=Math.max(n.boiling_max,i(n.hot_max+s));break;case"hot_max":n.hot_max=Math.max(i(n.warm_max+s),Math.min(n.hot_max,i(n.boiling_max-s)));break;case"warm_max":n.warm_max=Math.max(i(n.perf_max+s),Math.min(n.warm_max,i(n.hot_max-s)));break;case"perf_max":n.perf_max=Math.max(i(n.perf_min+s),Math.min(n.perf_max,i(n.warm_max-s)));break;case"perf_min":n.perf_min=Math.max(i(n.mild_min+s),Math.min(n.perf_min,i(n.perf_max-s)));break;case"mild_min":n.mild_min=Math.max(i(n.cool_min+s),Math.min(n.mild_min,i(n.perf_min-0)));break;case"cool_min":n.cool_min=Math.max(i(n.chilly_min+s),Math.min(n.cool_min,i(n.mild_min-0)));break;case"chilly_min":n.chilly_min=Math.max(i(n.cold_min+s),Math.min(n.chilly_min,i(n.cool_min-0)));break;case"cold_min":n.cold_min=Math.max(i(n.frosty_min+s),Math.min(n.cold_min,i(n.chilly_min-0)));break;case"frosty_min":n.frosty_min=Math.min(n.frosty_min,i(n.cold_min-s))}});const o={...t};o.t_boiling_max=n.boiling_max,o.t_hot_max=n.hot_max,o.t_warm_max=n.warm_max,o.t_perf_max=n.perf_max,o.t_perf_min=n.perf_min,o.t_mild_min=n.mild_min,o.t_cool_min=n.cool_min,o.t_chilly_min=n.chilly_min,o.t_cold_min=n.cold_min,o.t_frosty_min=n.frosty_min,o.t_boiling_min=i(n.hot_max+s),o.t_hot_min=i(n.warm_max+s),o.t_warm_min=i(n.perf_max+s),o.t_mild_max=i(n.perf_min-s),o.t_cool_max=i(n.mild_min-s),o.t_chilly_max=i(n.cool_min-s),o.t_cold_max=i(n.chilly_min-s),o.t_frosty_max=i(n.cold_min-s);const m=t=>Math.min(100,Math.max(0,i(t)));return o.rh_left_inner_pct=m(o.rh_left_inner_pct??40),o.rh_right_inner_pct=m(o.rh_right_inner_pct??60),o.rh_right_inner_pct<=o.rh_left_inner_pct&&(o.rh_right_inner_pct=m(o.rh_left_inner_pct+.1)),o}_autoPicked=!1;_autoFillDefaults(){if(this._autoPicked||!this.hass||!this._config)return;const t=this.hass.states,e=e=>{for(const[i,s]of Object.entries(t))if(e(i,s))return i},i=t=>t?.attributes?.device_class;this._config.temperature||(this._config.temperature=e((t,e)=>t.startsWith("sensor.")&&"temperature"===i(e))||this._config.temperature),this._config.humidity||(this._config.humidity=e((t,e)=>t.startsWith("sensor.")&&"humidity"===i(e))||this._config.humidity),this._autoPicked=!0,ot(this,"config-changed",{config:this._config})}}customElements.get("simple-air-comfort-card-editor")||customElements.define("simple-air-comfort-card-editor",ct);window.customCards=window.customCards||[],window.customCards.push({type:"simple-air-comfort-card",name:"Simple Air Comfort Card",description:"Dew point + AT dial, comfort words, moving dot.",preview:!0,documentationURL:"https://github.com/MankiniChykan/simple-air-comfort-card"}),console.info('%c SIMPLE AIR COMFORT CARD %c v"1.0.285" ',"color:white;background:#2a2a2a;padding:2px 6px;border-radius:4px 0 0 4px;","color:#2a2a2a;background:#c9c9c9;padding:2px 6px;border-radius:0 4px 4px 0;"),mt.prototype.getCardSize=function(){return 3},mt.prototype.getGridOptions=function(){return{columns:6,rows:"auto",min_columns:6,max_columns:12,min_rows:1,max_rows:6}};
//# sourceMappingURL=simple-air-comfort-card.js.map
