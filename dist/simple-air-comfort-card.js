/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(s,t,i)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:h,getOwnPropertySymbols:m,getPrototypeOf:d}=Object,p=globalThis,u=p.trustedTypes,_=u?u.emptyScript:"",f=p.reactiveElementPolyfillSupport,g=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},x=(t,e)=>!a(t,e),y={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:x};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);r?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=d(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...h(t),...m(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const n=r.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,r=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??x)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[g("elementProperties")]=new Map,$[g("finalized")]=new Map,f?.({ReactiveElement:$}),(p.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,v=w.trustedTypes,A=v?v.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+N,S=`<${E}>`,P=document,T=()=>P.createComment(""),k=t=>null===t||"object"!=typeof t&&"function"!=typeof t,F=Array.isArray,O="[ \t\n\f\r]",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,H=/>/g,U=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,L=/"/g,z=/^(?:script|style|textarea|title)$/i,I=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),j=new WeakMap,G=P.createTreeWalker(P,129);function q(t,e){if(!F(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const V=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=M;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,h=0;for(;h<i.length&&(o.lastIndex=h,c=o.exec(i),null!==c);)h=o.lastIndex,o===M?"!--"===c[1]?o=R:void 0!==c[1]?o=H:void 0!==c[2]?(z.test(c[2])&&(r=RegExp("</"+c[2],"g")),o=U):void 0!==c[3]&&(o=U):o===U?">"===c[0]?(o=r??M,l=-1):void 0===c[1]?l=-2:(l=o.lastIndex-c[2].length,a=c[1],o=void 0===c[3]?U:'"'===c[3]?L:D):o===L||o===D?o=U:o===R||o===H?o=M:(o=U,r=void 0);const m=o===U&&t[e+1].startsWith("/>")?" ":"";n+=o===M?i+S:l>=0?(s.push(a),i.slice(0,l)+C+i.slice(l)+N+m):i+N+(-2===l?e:m)}return[q(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Y{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[c,l]=V(t,e);if(this.el=Y.createElement(c,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=G.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=l[n++],i=s.getAttribute(t).split(N),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?X:"?"===o[1]?tt:"@"===o[1]?et:Q}),s.removeAttribute(t)}else t.startsWith(N)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(z.test(s.tagName)){const t=s.textContent.split(N),e=t.length-1;if(e>0){s.textContent=v?v.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],T()),G.nextNode(),a.push({type:2,index:++r});s.append(t[e],T())}}}else if(8===s.nodeType)if(s.data===E)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(N,t+1));)a.push({type:7,index:r}),t+=N.length-1}r++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,s){if(e===W)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=k(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=K(t,r._$AS(t,e.values),r,s)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);G.currentNode=s;let r=G.nextNode(),n=0,o=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Z(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new it(r,this,t)),this._$AV.push(e),a=i[++o]}n!==a?.index&&(r=G.nextNode(),n++)}return G.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),k(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>F(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&k(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Y.createElement(q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new J(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=j.get(t.strings);return void 0===e&&j.set(t.strings,e=new Y(t)),e}k(t){F(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Z(this.O(T()),this.O(T()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=K(this,t,e,0),n=!k(t)||t!==this._$AH&&t!==W,n&&(this._$AH=t);else{const s=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=K(this,s[i+o],e,o),a===W&&(a=this._$AH[o]),n||=!k(a)||a!==this._$AH[o],a===B?t=B:t!==B&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class X extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class tt extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class et extends Q{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??B)===W)return;const i=this._$AH,s=t===B&&i!==B||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==B&&(i===B||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const st=w.litHtmlPolyfillSupport;st?.(Y,Z),(w.litHtmlVersions??=[]).push("3.3.1");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class nt extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new Z(e.insertBefore(T(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}nt._$litElement$=!0,nt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:nt});const ot=rt.litElementPolyfillSupport;ot?.({LitElement:nt}),(rt.litElementVersions??=[]).push("4.2.1");const at=(t,e,i,s)=>{const r=new Event(e,{bubbles:s?.bubbles??!0,cancelable:s?.cancelable??!1,composed:s?.composed??!0});return r.detail=i,t.dispatchEvent(r),r};class ct extends nt{static properties={hass:{type:Object},_config:{state:!0}};constructor(){super(),this._config=void 0}static styles=n`
    /* Host should not force a height; HA grid drives width, .ratio drives height */
    :host{ display:inline-block; width:100%; box-sizing:border-box; }

    ha-card{
      position:relative; padding:0; overflow:hidden; isolation:isolate;
      border-radius:var(--ha-card-border-radius,12px);
      background:var(--sac-temp-bg,#2a2a2a);
      display:block; box-sizing:border-box; min-height:0; aspect-ratio:1/1
    }

    /* Square stage defines height (no absolute here) */
    .ratio{ position:relative; width:100%; height:100%; margin:0; }

    /* Dot (+ halo when outside) — positioned in % of the whole card */
    .dot{
      position:absolute; width:6%; height:6%; border-radius:50%;
      background:#fff; box-shadow:0 0 6px rgba(0,0,0,.45);
      transform:translate(-50%, 50%);
      transition:left .8s ease-in-out,bottom .8s ease-in-out; z-index:2;
    }
    .dot.outside::before{
      content:""; position:absolute; inset:-20%; border-radius:50%;
      background:radial-gradient(circle, rgba(255,0,0,.8) 20%, rgba(255,0,0,.3) 50%, rgba(255,0,0,.1) 70%, rgba(255,0,0,0) 100%);
      animation:sac-blink 1s infinite alternate; z-index:-1;
    }
    @keyframes sac-blink{ 0%{opacity:1} 100%{opacity:.3} }

    /* Fill the square with the face */
    .canvas{ position:absolute; inset:0; padding:0px 0px 0px; }

    /* Header (room name + dew-point comfort text under it) */
    .header{
      position:absolute; top:10%; left:50%; transform:translate(-50%,-50%);
      width:100%; text-align:center; pointer-events:none;
    }
    .title{
      color:#c9c9c9; font-weight:300;
      font-size:clamp(10px,1.8vw,14px);
      line-height:1.1; letter-spacing:.2px;
    }
    .subtitle{
      color:#fff; font-weight:600;
      font-size:clamp(13px,2.4vw,18px);
      text-shadow:0 1px 2px rgba(0,0,0,.35);
    }

    /* Corners */
    .corner{ position:absolute; color:#fff; text-shadow:0 1px 2px rgba(0,0,0,.35); }
    .corner .label{
      font-weight:300; opacity:.75; letter-spacing:.1px;
      font-size:clamp(9px,1.6vw,12px);
      display:block;
    }
    .corner .metric{
      font-weight:500;
      font-size:clamp(12px,2.2vw,16px);
      line-height:1.05;
      display: block;
    }
    .corner .comfort{
      font-weight:500;
      font-size:clamp(11px,2vw,15px);
      letter-spacing:.2px;
      display: block;
      margin-top: 0.1rem;
    }
    .tl{ left:8%;  top:23%;  transform:translate(0,-50%); text-align:left; }
    .tr{ right:8%; top:23%;  transform:translate(0,-50%); text-align:right; }
    .bl{ left:8%;  bottom:3%; transform:translate(0,0);   text-align:left; }
    .br{ right:8%; bottom:3%; transform:translate(0,0);   text-align:right; }

    /* Dial — 45% like original */
    .graphic{
      position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
      width:45%; height:45%;
    }

    /* Axis labels: smaller & dim grey */
    .axis{
      position:absolute; color:rgba(200,200,200,.8);
      font-weight:300; text-shadow:0 1px 2px rgba(0,0,0,.25);
      font-size:clamp(9px,1.7vw,12px);
      pointer-events:none;
    }
    .axis-top    { top:-10px;  left:50%; transform:translate(-50%,-50%); }
    .axis-bottom { bottom:-10px;left:50%; transform:translate(-50%, 50%); }
    .axis-left   { left:-10px; top:50%;  transform:translate(-50%,-50%) rotate(180deg); writing-mode:vertical-rl; }
    .axis-right  { right:-10px;top:50%;  transform:translate( 50%,-50%); writing-mode:vertical-rl; }

    .outer-ring{
      position:absolute; inset:0; border-radius:50%; border:2.5px solid #fff;
      background:var(--sac-dewpoint-ring,radial-gradient(circle,dimgray,55%,rgba(100,100,100,.15),rgba(100,100,100,.15)));
      box-shadow:0 0 6px 3px rgba(0,0,0,.18), 0 0 18px 6px rgba(0,0,0,.22);
    }
    .inner-circle{
      position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
      width:46.5%; height:46.5%; border-radius:50%;
      background:var(--sac-inner-gradient,radial-gradient(circle,black 0%,black 60%));
      box-shadow:inset 0 0 12px rgba(0,0,0,.6);
    }

  `;setConfig(t){if(!t||!t.temperature||!t.humidity)throw new Error('simple-air-comfort-card: "temperature" and "humidity" are required.');const e=t=>null==t||""===t?NaN:Number(t),i=Number.isFinite(e(t.temp_min))?e(t.temp_min):15,s=Number.isFinite(e(t.temp_max))?e(t.temp_max):35;if(s<=i)throw new Error("simple-air-comfort-card: temp_max must be > temp_min.");const r=Number.isFinite(e(t.ring_pct))?e(t.ring_pct):45,n=Number.isFinite(e(t.inner_pct))?e(t.inner_pct):46.5,o=Number.isFinite(e(t.y_offset_pct))?e(t.y_offset_pct):0;this._config={name:t.name??"Air Comfort",temperature:t.temperature,humidity:t.humidity,windspeed:t.windspeed,decimals:Number.isFinite(e(t.decimals))?e(t.decimals):1,default_wind_speed:Number.isFinite(e(t.default_wind_speed))?e(t.default_wind_speed):0,temp_min:i,temp_max:s,t_frosty_max:Number.isFinite(e(t.t_frosty_max))?e(t.t_frosty_max):3,t_cold_max:Number.isFinite(e(t.t_cold_max))?e(t.t_cold_max):4.99,t_chilly_max:Number.isFinite(e(t.t_chilly_max))?e(t.t_chilly_max):8.99,t_cool_max:Number.isFinite(e(t.t_cool_max))?e(t.t_cool_max):13.99,t_mild_max:Number.isFinite(e(t.t_mild_max))?e(t.t_mild_max):18.99,t_perf_max:Number.isFinite(e(t.t_perf_max))?e(t.t_perf_max):23.99,t_warm_max:Number.isFinite(e(t.t_warm_max))?e(t.t_warm_max):27.99,t_hot_max:Number.isFinite(e(t.t_hot_max))?e(t.t_hot_max):34.99,ring_pct:r,inner_pct:n,center_pct:50,y_offset_pct:o}}render(){if(!this.hass||!this._config)return I``;const t=this.hass.states[this._config.temperature],e=this.hass.states[this._config.humidity],i=this._config.windspeed?this.hass.states[this._config.windspeed]:void 0;if(!t||!e)return I`<ha-card>
        <div class="ratio">
          <div class="canvas">
            ${this.#t({Tc:NaN,RH:NaN,dpC:NaN,atC:NaN,dewText:"Unknown",tempText:"N/A",rhText:"N/A",cardBg:this.#e(NaN),ringGrad:this.#i("Unknown"),innerGrad:this.#s(NaN,NaN),xPct:50,yPct:50,outside:!1,outUnit:t?.attributes?.unit_of_measurement||"°C",d:this._config.decimals,dewOut:"—",atOut:"—",tempRaw:"—",rhRaw:"—"})}
          </div>
        </div>
      </ha-card>`;const s=(t.attributes.unit_of_measurement||"°C").trim(),r=this.#r(Number.isFinite(+t.state)?+t.state:NaN,s),n=this.#n(Number.isFinite(+e.state)?+e.state:NaN),o=this.#o(i,this._config.default_wind_speed),a=n/100*this.#a(r),c=this.#c(a),l=this.#l(r,a,o),h=this.#h(c),m=this.#m(r),d=this.#d(n),p=this.#e(r),u=this.#i(h),_=this.#s(n,r),f=this.#p(r),g=Number.isFinite(f)?this.#u(f+(this._config.y_offset_pct||0),0,100):50,b=Number.isFinite(n)?this.#u(n+.5,0,100):50,x=!Number.isFinite(n)||!Number.isFinite(r)||(n<40||n>60||r<18||r>26.4),y=this._config.decimals,$=s,w=this.#_(this.#f(c,$),y)+` ${$}`,v=this.#_(this.#f(l,$),y)+` ${$}`,A=this.#_(this.#f(r,$),y)+` ${$}`,C=Number.isFinite(n)?this.#g(n,y).toFixed(y)+" %":"—";return I`<ha-card style="--sac-temp-bg:${p}">
      <div class="ratio">
        <div class="canvas">
          ${this.#t({Tc:r,RH:n,dpC:c,atC:l,dewText:h,tempText:m,rhText:d,cardBg:p,ringGrad:u,innerGrad:_,xPct:b,yPct:g,outside:x,outUnit:$,d:y,dewOut:w,atOut:v,tempRaw:A,rhRaw:C})}
        </div>
      </div>
    </ha-card>`}#t({dewText:t,tempText:e,rhText:i,ringGrad:s,innerGrad:r,xPct:n,yPct:o,outside:a,dewOut:c,atOut:l,tempRaw:h,rhRaw:m}){return I`
      <div class="header">
        <div class="title">${this._config.name??"Air Comfort"}</div>
        <div class="subtitle">${t}</div>
      </div>

      <!-- TL / TR -->
      <div class="corner tl">
        <span class="label">Dew point</span>
        <span class="metric">${c}</span>
      </div>
      <div class="corner tr">
        <span class="label">Feels like</span>
        <span class="metric">${l}</span>
      </div>

      <!-- BL / BR (raw values + comfort words) -->
      <div class="corner bl">
        <span class="label">Temp</span>
        <span class="metric">${h}</span>
        <span class="comfort">${e}</span>
      </div>
      <div class="corner br">
        <span class="label">Humidity</span>
        <span class="metric">${m}</span>
        <span class="comfort">${i}</span>
      </div>

      <!-- Dial -->
      <div class="graphic" style="--sac-dewpoint-ring:${s}; --sac-inner-gradient:${r}">
        <div class="axis axis-top">Warm</div>
        <div class="axis axis-bottom">Cold</div>
        <div class="axis axis-left">Dry</div>
        <div class="axis axis-right">Humid</div>

        <div class="outer-ring"></div>
        <div class="inner-circle"></div>
      </div>
      <div class="dot ${a?"outside":""}" style="left:${n}%; bottom:${o}%;"></div>
    `}#l(t,e,i){return t+.33*e-.7*i-4}#a(t){return Number.isFinite(t)?t>=0?6.1121*Math.exp(t/(257.14+t)*(18.678-t/234.5)):6.1115*Math.exp(t/(279.82+t)*(23.036-t/333.7)):NaN}#c(t){if(!Number.isFinite(t)||t<=0)return NaN;let e=-80,i=60,s=0;for(let r=0;r<60;r++){s=(e+i)/2;const r=this.#a(s);if(!Number.isFinite(r))break;if(r>t?i=s:e=s,Math.abs(i-e)<1e-4)break}return s}#h(t){return Number.isFinite(t)?t<5?"Very Dry":t<=10?"Dry":t<=12.79?"Pleasant":t<=15.49?"Comfortable":t<=18.39?"Sticky Humid":t<=21.19?"Muggy":t<=23.9?"Sweltering":"Stifling":"Unknown"}#m(t){if(!Number.isFinite(t))return"N/A";const e=this._config||{},i=e.t_frosty_max??3,s=e.t_cold_max??4.99,r=e.t_chilly_max??8.99,n=e.t_cool_max??13.99,o=e.t_mild_max??18.99,a=e.t_perf_max??23.99,c=e.t_warm_max??27.99,l=e.t_hot_max??34.99;return t<i?"FROSTY":t<=s?"COLD":t<=r?"CHILLY":t<=n?"COOL":t<=o?"MILD":t<=a?"PERFECT":t<=c?"WARM":t<=l?"HOT":"BOILING"}#d(t){return Number.isFinite(t)?t<40?"DRY":t<=60?"COMFY":"HUMID":"N/A"}#b(t){return Number.isFinite(t)?t<3?"frosty":t<=4.99?"cold":t<=8.99?"chilly":t<=13.99?"cool":t<=18.99?"mild":t<=23.99?"perfect":t<=27.99?"warm":t<=34.99?"hot":"boiling":"n/a"}#x(t){const e=String(t||"").toLowerCase();return"frosty"===e?"mediumblue":"cold"===e?"dodgerblue":"chilly"===e?"deepskyblue":"cool"===e?"mediumaquamarine":"mild"===e?"seagreen":"perfect"===e?"limegreen":"warm"===e?"gold":"hot"===e?"orange":"boiling"===e?"crimson":"dimgray"}#e(t){const e=this.#b(t);return`radial-gradient(circle, rgba(100,100,100,0.15), rgba(100,100,100,0.15), rgba(100,100,100,0.15), ${this.#x(e)})`}#i(t){return`radial-gradient(circle, ${{"Very Dry":"deepskyblue",Dry:"mediumaquamarine",Pleasant:"limegreen",Comfortable:"yellowgreen","Sticky Humid":"yellow",Muggy:"gold",Sweltering:"orange",Stifling:"crimson"}[t]||"dimgray"}, 55%, rgba(100,100,100,0.15), rgba(100,100,100,0.15))`}#s(t,e){let i="black";Number.isFinite(t)?(t<40||t>60)&&(i="hotpink"):i="dimgray";let s="dimgray";return Number.isFinite(e)&&(s=e>34.9||e>26.5?"rgba(255,69,0,0.8)":e>24||e>19?"dimgray":"rgba(0,102,255,0.8)"),`radial-gradient(circle, ${i} 0%, black, ${s} 70%)`}#u(t,e,i){return Math.min(i,Math.max(e,t))}#y(t,e,i,s,r){if(!Number.isFinite(t))return(s+r)/2;const n=(t-e)/(i-e);return this.#u(s+n*(r-s),s,r)}#$(t){return t*t*(3-2*t)}#w(){const t=Number(this._config?.ring_pct??45),e=Number(this._config?.inner_pct??46.5),i=Number(this._config?.center_pct??50),s=t/2,r=e/100*(t/2),n=i-s,o=i+s;return{y_outer_bottom:n,y_outer_top:o,y_inner_bottom:i-r,y_inner_top:i+r,y_center:i,y_half_below_outer:(0+n)/2,y_half_above_outer:(100+o)/2}}#p(t){const e=this.#w(),i=this._config||{},s=i.t_frosty_max??3;i.t_cold_max;const r=i.t_chilly_max??8.99,n=i.t_cool_max??13.99,o=i.t_mild_max??18.99,a=i.t_perf_max??23.99,c=i.t_warm_max??27.99,l=i.t_hot_max??34.99,h=s,m=r,d=n,p=(o+a)/2,u=a,_=c,f=Math.min(60,Math.max(l+5,40)),g=[{t:h,y:e.y_half_below_outer},{t:m,y:e.y_outer_bottom},{t:d,y:e.y_inner_bottom},{t:p,y:e.y_center},{t:u,y:e.y_inner_top},{t:_,y:e.y_outer_top},{t:f,y:e.y_half_above_outer}];if(!Number.isFinite(t))return e.y_center;if(t<=g[0].t)return g[0].y;if(t>=g[g.length-1].t)return g[g.length-1].y;for(let e=0;e<g.length-1;e++){const i=g[e],s=g[e+1];if(t>=i.t&&t<=s.t){const e=this.#u((t-i.t)/(s.t-i.t),0,1),r=this.#$(e);return i.y+(s.y-i.y)*r}}return e.y_center}#n(t){return Number.isFinite(t)?Math.min(100,Math.max(0,t)):NaN}#r(t,e){return Number.isFinite(t)?(e||"").toLowerCase().includes("f")?5/9*(t-32):t:NaN}#f(t,e){return Number.isFinite(t)?(e||"").toLowerCase().includes("f")?9*t/5+32:t:NaN}#o(t,e){if(!t)return e??0;const i=parseFloat(t.state);if(!Number.isFinite(i))return e??0;const s=(t.attributes.unit_of_measurement||"m/s").toLowerCase();return s.includes("m/s")?i:s.includes("km/h")||s.includes("kph")?i/3.6:s.includes("mph")?.44704*i:s.includes("kn")?.514444*i:i}#g(t,e=1){if(!Number.isFinite(t))return NaN;const i=Math.pow(10,e);return Math.round(t*i)/i}#_(t,e=1){return Number.isFinite(t)?this.#g(t,e).toLocaleString(void 0,{minimumFractionDigits:e,maximumFractionDigits:e}):"—"}set hass(t){this._hass=t,this.requestUpdate()}get hass(){return this._hass}static getConfigElement(){return document.createElement("simple-air-comfort-card-editor")}static getStubConfig(t){const e=t??document.querySelector("home-assistant")?.hass,i=e?.states??{},s=t=>{for(const[e,s]of Object.entries(i))if(t(e,s))return e},r=t=>t?.attributes?.device_class,n=t=>(t?.attributes?.unit_of_measurement||"").toLowerCase();return{name:"Area Name",temperature:s((t,e)=>t.startsWith("sensor.")&&"temperature"===r(e))||s((t,e)=>t.startsWith("sensor.")&&/°c|°f/.test(n(e)))||s(t=>t.startsWith("sensor.")),humidity:s((t,e)=>t.startsWith("sensor.")&&"humidity"===r(e))||s((t,e)=>t.startsWith("sensor.")&&n(e).includes("%"))||s(t=>t.startsWith("sensor.")),windspeed:s((t,e)=>t.startsWith("sensor.")&&"wind_speed"===r(e))||s((t,e)=>t.startsWith("sensor.")&&/(m\/s|km\/h|kph|mph|kn)/.test(n(e))),decimals:1,default_wind_speed:.1,temp_min:15,temp_max:35}}}customElements.define("simple-air-comfort-card",ct);class lt extends nt{static properties={hass:{type:Object},_config:{state:!0},_schema:{state:!0}};static styles=n`.wrap{ padding:8px 12px 16px; }`;connectedCallback(){super.connectedCallback(),window.loadCardHelpers?.().catch(()=>{})}set hass(t){this._hass=t,this._autoFillDefaults(),this.requestUpdate()}get hass(){return this._hass}setConfig(t){this._config={name:"Area Name",temperature:void 0,humidity:void 0,windspeed:void 0,decimals:1,default_wind_speed:.1,temp_min:15,temp_max:35,decimals:1,default_wind_speed:.1,temp_min:15,temp_max:35,t_frosty_max:3,t_cold_max:4.99,t_chilly_max:8.99,t_cool_max:13.99,t_mild_max:18.99,t_perf_max:23.99,t_warm_max:27.99,t_hot_max:34.99,ring_pct:45,inner_pct:46.5,y_offset_pct:0,...t??{}},this._schema=[{name:"name",selector:{text:{}}},{name:"temperature",required:!0,selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"humidity",required:!0,selector:{entity:{domain:"sensor",device_class:"humidity"}}},{name:"windspeed",selector:{entity:{domain:"sensor",device_class:"wind_speed"}}},{name:"default_wind_speed",selector:{number:{min:0,max:50,step:.1,mode:"box",unit_of_measurement:"m/s"}}},{name:"decimals",selector:{number:{min:0,max:3,step:1,mode:"box"}}},{name:"temp_min",selector:{number:{min:-20,max:50,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"temp_max",selector:{number:{min:-20,max:60,step:.1,mode:"box",unit_of_measurement:"°C"}}},{name:"t_frosty_max",selector:{number:{min:-40,max:10,step:.01,mode:"box",unit_of_measurement:"°C"}}},{name:"t_cold_max",selector:{number:{min:-40,max:15,step:.01,mode:"box",unit_of_measurement:"°C"}}},{name:"t_chilly_max",selector:{number:{min:-40,max:20,step:.01,mode:"box",unit_of_measurement:"°C"}}},{name:"t_cool_max",selector:{number:{min:-40,max:25,step:.01,mode:"box",unit_of_measurement:"°C"}}},{name:"t_mild_max",selector:{number:{min:-40,max:30,step:.01,mode:"box",unit_of_measurement:"°C"}}},{name:"t_perf_max",selector:{number:{min:-40,max:35,step:.01,mode:"box",unit_of_measurement:"°C"}}},{name:"t_warm_max",selector:{number:{min:-40,max:40,step:.01,mode:"box",unit_of_measurement:"°C"}}},{name:"t_hot_max",selector:{number:{min:-40,max:60,step:.01,mode:"box",unit_of_measurement:"°C"}}},{name:"ring_pct",selector:{number:{min:10,max:90,step:.1,mode:"box",unit_of_measurement:"%"}}},{name:"inner_pct",selector:{number:{min:10,max:100,step:.1,mode:"box",unit_of_measurement:"%"}}},{name:"y_offset_pct",selector:{number:{min:-30,max:30,step:.5,mode:"box",unit_of_measurement:"%"}}}]}render(){return this.hass&&this._config?I`<div class="wrap">
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema}
        .computeLabel=${this._label}
        .computeHelper=${this._helper} 
        @value-changed=${this._onChange}>
      </ha-form>
    </div>`:I``}_label=t=>({name:"Name",temperature:"Temperature entity",humidity:"Humidity entity",windspeed:"Wind speed entity (optional)",default_wind_speed:"Default wind speed (m/s)",decimals:"Decimals",temp_min:"Dot temp min (°C)",temp_max:"Dot temp max (°C)",t_frosty_max:"FROSTY max (°C)",t_cold_max:"COLD max (°C)",t_chilly_max:"CHILLY max (°C)",t_cool_max:"COOL max (°C)",t_mild_max:"MILD max (°C)",t_perf_max:"PERFECT max (°C)",t_warm_max:"WARM max (°C)",t_hot_max:"HOT max (°C)",ring_pct:"Outer ring box size (% of card)",inner_pct:"Inner circle size (% of ring box)",y_offset_pct:"Vertical dot offset (%)"}[t.name]??t.name);_helper=t=>{const e=t.name,i=t=>this.hass?.states?.[this._config?.[t]],s=t=>i(t)?.attributes?.unit_of_measurement??"";switch(e){case"name":return"Shown as the small grey title at the top of the card.";case"temperature":return"Pick an indoor temperature sensor. "+(s("temperature")?`Current unit: ${s("temperature")}.`:"");case"humidity":return"Pick a relative humidity sensor (0–100%). "+(s("humidity")?`Current unit: ${s("humidity")}.`:"");case"windspeed":return"Optional. If set, Apparent Temperature uses this wind; if empty, the “Default wind speed” below is used.";case"default_wind_speed":return"Indoor fallback for Apparent Temperature when no wind sensor is set. Typical indoors: 0.0–0.2 m/s.";case"decimals":return"How many decimal places to show for temperatures and humidity.";case"temp_min":return"Lower bound of the dot’s vertical scale (affects Y mapping only).";case"temp_max":return"Upper bound of the dot’s vertical scale. Must be greater than min.";case"t_frosty_max":case"t_cold_max":case"t_chilly_max":case"t_cool_max":case"t_mild_max":case"t_perf_max":case"t_warm_max":case"t_hot_max":return"Boundary temperatures used for both comfort text and the dot’s vertical mapping.";case"ring_pct":return"Diameter of the outer ring as a % of the card. Keep in sync with your CSS.";case"inner_pct":return"Diameter of the inner circle as a % of the outer ring box. Keep in sync with your CSS.";case"y_offset_pct":return"Fine-tune the dot’s vertical position in % of card height (positive moves up).";default:return"Tip: values update immediately; click Save when done."}};_onChange=t=>{t.stopPropagation();const e=t.detail.value;this._config=e,at(this,"config-changed",{config:e})};_autoPicked=!1;_autoFillDefaults(){if(this._autoPicked||!this.hass||!this._config)return;const t=this.hass.states,e=e=>{for(const[i,s]of Object.entries(t))if(e(i,s))return i},i=t=>t?.attributes?.device_class;this._config.temperature||(this._config.temperature=e((t,e)=>t.startsWith("sensor.")&&"temperature"===i(e))||this._config.temperature),this._config.humidity||(this._config.humidity=e((t,e)=>t.startsWith("sensor.")&&"humidity"===i(e))||this._config.humidity),this._autoPicked=!0,at(this,"config-changed",{config:this._config})}}customElements.get("simple-air-comfort-card-editor")||customElements.define("simple-air-comfort-card-editor",lt);window.customCards=window.customCards||[],window.customCards.push({type:"simple-air-comfort-card",name:"Simple Air Comfort Card",description:"Dew point + AT dial, comfort words, moving dot.",preview:!0,documentationURL:"https://github.com/MankiniChykan/simple-air-comfort-card"}),ct.prototype.getCardSize=function(){return 1},console.info('%c SIMPLE AIR COMFORT CARD %c v"1.0.152" ',"color:white;background:#2a2a2a;padding:2px 6px;border-radius:4px 0 0 4px;","color:#2a2a2a;background:#c9c9c9;padding:2px 6px;border-radius:0 4px 4px 0;");
//# sourceMappingURL=simple-air-comfort-card.js.map
