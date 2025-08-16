/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(s,t,i)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:d,getOwnPropertyDescriptor:h,getOwnPropertyNames:l,getOwnPropertySymbols:c,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,f=m?m.emptyScript:"",_=u.reactiveElementPolyfillSupport,g=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!a(t,e),b={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&d(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);r?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...l(t),...c(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const n=r.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,r=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??$)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[g("elementProperties")]=new Map,y[g("finalized")]=new Map,_?.({ReactiveElement:y}),(u.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A=globalThis,w=A.trustedTypes,x=w?w.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+S,N=`<${C}>`,P=document,k=()=>P.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,U="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,R=/>/g,D=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),F=/'/g,z=/"/g,L=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),j=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),I=new WeakMap,V=P.createTreeWalker(P,129);function q(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=H;for(let e=0;e<i;e++){const i=t[e];let a,d,h=-1,l=0;for(;l<i.length&&(o.lastIndex=l,d=o.exec(i),null!==d);)l=o.lastIndex,o===H?"!--"===d[1]?o=T:void 0!==d[1]?o=R:void 0!==d[2]?(L.test(d[2])&&(r=RegExp("</"+d[2],"g")),o=D):void 0!==d[3]&&(o=D):o===D?">"===d[0]?(o=r??H,h=-1):void 0===d[1]?h=-2:(h=o.lastIndex-d[2].length,a=d[1],o=void 0===d[3]?D:'"'===d[3]?z:F):o===z||o===F?o=D:o===T||o===R?o=H:(o=D,r=void 0);const c=o===D&&t[e+1].startsWith("/>")?" ":"";n+=o===H?i+N:h>=0?(s.push(a),i.slice(0,h)+E+i.slice(h)+S+c):i+S+(-2===h?e:c)}return[q(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class J{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[d,h]=G(t,e);if(this.el=J.createElement(d,i),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=V.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=h[n++],i=s.getAttribute(t).split(S),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?Q:"?"===o[1]?tt:"@"===o[1]?et:X}),s.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=w?w.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],k()),V.nextNode(),a.push({type:2,index:++r});s.append(t[e],k())}}}else if(8===s.nodeType)if(s.data===C)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)a.push({type:7,index:r}),t+=S.length-1}r++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,s){if(e===j)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=M(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=K(t,r._$AS(t,e.values),r,s)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);V.currentNode=s;let r=V.nextNode(),n=0,o=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Z(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new it(r,this,t)),this._$AV.push(e),a=i[++o]}n!==a?.index&&(r=V.nextNode(),n++)}return V.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),M(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==j&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=J.createElement(q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Y(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=I.get(t.strings);return void 0===e&&I.set(t.strings,e=new J(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Z(this.O(k()),this.O(k()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=K(this,t,e,0),n=!M(t)||t!==this._$AH&&t!==j,n&&(this._$AH=t);else{const s=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=K(this,s[i+o],e,o),a===j&&(a=this._$AH[o]),n||=!M(a)||a!==this._$AH[o],a===B?t=B:t!==B&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Q extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class tt extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class et extends X{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??B)===j)return;const i=this._$AH,s=t===B&&i!==B||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==B&&(i===B||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const st=A.litHtmlPolyfillSupport;st?.(J,Z),(A.litHtmlVersions??=[]).push("3.3.1");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class nt extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new Z(e.insertBefore(k(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}}nt._$litElement$=!0,nt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:nt});const ot=rt.litElementPolyfillSupport;ot?.({LitElement:nt}),(rt.litElementVersions??=[]).push("4.2.1");const at="sac_background_overlay.svg";class dt extends nt{static properties={hass:{type:Object},_config:{state:!0}};static styles=n`
    ha-card { padding: 0; overflow: hidden; }

    /* Canvas that holds everything */
    .canvas {
      position: relative;
      padding: 18px 18px 20px;
      min-height: 420px;   /* responsive; grows with container width */
    }

    /* SVG background */
    .bg {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      pointer-events: none;
    }
    .bg img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.9;
      filter: saturate(0.9);
    }
    /* Title sitting ON the background */
    .bg-title {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      font-weight: 700;
      font-size: 1.05rem;
      color: rgba(255,255,255,0.85);
      letter-spacing: .3px;
      text-shadow: 0 1px 2px rgba(0,0,0,.5);
    }

    /* Dial stage (kept away from card edges) */
    .stage {
      position: relative;
      z-index: 2;
      margin: 36px 18px 24px;
      border-radius: 18px;
      padding: clamp(18px, 3vw, 28px);
      background: radial-gradient(120% 120% at 50% 35%, rgba(0,0,0,.35), rgba(0,0,0,.55));
      box-shadow: inset 0 0 60px rgba(0,0,0,.35);
    }

    /* Dial geometry */
    .dial {
      position: relative;
      width: min(86vw, 560px);
      max-width: 100%;
      margin: 0 auto;
      aspect-ratio: 1/1;
    }
    .ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 3px solid rgba(255,255,255,0.9);
      box-shadow: 0 0 12px rgba(255,255,255,0.2), inset 0 0 40px rgba(0,0,0,.4);
    }
    .inner {
      position: absolute;
      inset: 20% 20% 20% 20%;
      border-radius: 50%;
      background: radial-gradient(60% 60% at 50% 45%, rgba(11,109,93,.9), rgba(0,0,0,.7));
      box-shadow: inset 0 0 60px rgba(0,0,0,.55);
    }
    .iris {
      position: absolute;
      inset: 32% 32% 32% 32%;
      border-radius: 50%;
      background: radial-gradient(65% 65% at 45% 40%, rgba(11,109,93,.9), rgba(0,0,0,.85));
      box-shadow: inset 0 0 40px rgba(0,0,0,.7);
    }
    .pupil {
      position: absolute;
      top: 50%; left: 50%;
      width: 56px; height: 56px;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: radial-gradient(60% 60% at 45% 40%, #0c0c0c, #000);
      box-shadow: 0 0 0 6px rgba(255,255,255,0.85),
                  0 4px 18px rgba(0,0,0,.6);
    }

    /* Cardinal captions (static) */
    .caption {
      position: absolute;
      font-size: .92rem;
      font-weight: 600;
      color: rgba(255,255,255,.75);
      text-shadow: 0 1px 2px rgba(0,0,0,.7);
      user-select: none;
    }
    .top    { top: -30px; left: 50%; transform: translate(-50%, 0); }
    .bottom { bottom: -30px; left: 50%; transform: translate(-50%, 0); }
    .left   { left: -34px; top: 50%; transform: translate(0, -50%) rotate(-90deg); }
    .right  { right: -34px; top: 50%; transform: translate(0, -50%) rotate(90deg); }

    /* Value labels around dial */
    .metric {
      position: absolute;
      display: grid;
      gap: 2px;
      text-align: center;
      color: rgba(255,255,255,.85);
      text-shadow: 0 1px 2px rgba(0,0,0,.6);
      font-variant-numeric: tabular-nums;
    }
    .metric .k { font-size: .92rem; opacity: .9; }
    .metric .v { font-size: 1.05rem; font-weight: 800; letter-spacing: .2px; }

    .tl { top: 13%; left: 18%; }   /* Dew point */
    .tr { top: 13%; right: 18%; }  /* Feels like */
    .bl { bottom: 11%; left: 18%; }/* Air temp + INTENSITY (Mild/…) */
    .br { bottom: 11%; right: 18%; }/* RH + COMFORT (Comfy/Dry/…) */

    .sub { font-size: .9rem; color: rgba(255,255,255,.7); }

    /* Hide the stock header; we render title on the background instead */
    .hidden-header { display:none }
  `;setConfig(t){if(!t||!t.temperature||!t.humidity)throw new Error('simple-air-comfort-card: "temperature" and "humidity" entities are required.');this._config={name:t.name??"Air Comfort",temperature:t.temperature,humidity:t.humidity,windspeed:t.windspeed,decimals:Number.isFinite(t.decimals)?t.decimals:1,default_wind_speed:Number.isFinite(t.default_wind_speed)?t.default_wind_speed:0}}render(){if(!this.hass||!this._config)return W``;const t=this.hass.states[this._config.temperature],e=this.hass.states[this._config.humidity],i=this._config.windspeed?this.hass.states[this._config.windspeed]:void 0;if(!t||!e)return W`<ha-card>
        <div class="canvas">
          <div class="bg"><img src=${at} alt="" /></div>
          <div class="metric tl"><div class="k">Entity not found</div></div>
        </div>
      </ha-card>`;const s=(t.attributes.unit_of_measurement||"°C").trim(),r=this.#t(parseFloat(t.state),s),n=this.#e(parseFloat(e.state)),o=this.#i(i,this._config.default_wind_speed),a=n/100*this.#s(r),d=this.#r(a),h=this.#n(r,a,o),l=s,c=this.#o(h,l),p=this.#o(r,l),u=this.#o(d,l),m=this.#a(r,n),f=this.#d(r,n),_=this._config.decimals;return W`
      <ha-card>
        <!-- We don't render a standard header; title appears over background -->
        <div class="hidden-header">${this._config.name}</div>

        <div class="canvas">
          <!-- Background SVG + overlaid title -->
          <div class="bg">
            <img src=${at} alt="" />
            <div class="bg-title">Air Comfort</div>
          </div>

          <div class="stage">
            <div class="dial">
              <div class="ring"></div>
              <div class="inner"></div>
              <div class="iris"></div>
              <div class="pupil"></div>

              <!-- Static captions around ring -->
              <div class="caption top">Warm</div>
              <div class="caption right">Humid</div>
              <div class="caption bottom">Cold</div>
              <div class="caption left">Dry</div>

              <!-- Metrics placed like your reference -->
              <div class="metric tl">
                <div class="k">Dew point</div>
                <div class="v">${this.#h(u,_)} ${l}</div>
              </div>

              <div class="metric tr">
                <div class="k">Feels like</div>
                <div class="v">${this.#h(c,_)} ${l}</div>
              </div>

              <div class="metric bl">
                <div class="v">${this.#h(p,_)} ${l}</div>
                <!-- REPLACES “PERFECT” with the top’s smaller word -->
                <div class="sub">${f}</div>
              </div>

              <div class="metric br">
                <div class="v">${this.#h(n,_)} %</div>
                <!-- REPLACES “COMFY” with the top’s big comfort word -->
                <div class="sub">${m}</div>
              </div>
            </div>
          </div>
        </div>
      </ha-card>
    `}getCardSize(){return 4}#n(t,e,i){return t+.33*e-.7*i-4}#s(t){return Number.isFinite(t)?t>=0?6.1121*Math.exp(t/(257.14+t)*(18.678-t/234.5)):6.1115*Math.exp(t/(279.82+t)*(23.036-t/333.7)):NaN}#r(t){if(!Number.isFinite(t)||t<=0)return NaN;let e=-80,i=60,s=0;for(let r=0;r<60;r++){s=(e+i)/2;const r=this.#s(s);if(!Number.isFinite(r))break;if(r>t?i=s:e=s,Math.abs(i-e)<1e-4)break}return s}#a(t,e){return e<30?"Dry":e>60?"Humid":t<18?"Cold":t>26?"Warm":"Comfy"}#d(t,e){const i=Math.hypot((t-22)/8,(e-45)/25);return i<.45?"Mild":i<.85?"Moderate":"Severe"}#e(t){return Number.isFinite(t)?Math.min(100,Math.max(0,t)):NaN}#t(t,e){if(!Number.isFinite(t))return NaN;return(e||"").toLowerCase().includes("f")?5/9*(t-32):t}#o(t,e){const i=(e||"").toLowerCase();return Number.isFinite(t)?i.includes("f")?9*t/5+32:t:NaN}#i(t,e){if(!t)return e??0;const i=parseFloat(t.state);if(!Number.isFinite(i))return e??0;const s=(t.attributes.unit_of_measurement||"m/s").toLowerCase();return s.includes("m/s")?i:s.includes("km/h")||s.includes("kph")?i/3.6:s.includes("mph")?.44704*i:s.includes("kn")?.514444*i:i}#l(t,e=1){if(!Number.isFinite(t))return NaN;const i=Math.pow(10,e);return Math.round(t*i)/i}#h(t,e=1){return Number.isFinite(t)?this.#l(t,e).toLocaleString(void 0,{minimumFractionDigits:e,maximumFractionDigits:e}):"—"}set hass(t){this._hass=t,this.requestUpdate()}get hass(){return this._hass}static getConfigElement(){return document.createElement("simple-air-comfort-card-editor")}static getStubConfig(){return{name:"Air Comfort",temperature:"sensor.temperature",humidity:"sensor.humidity",decimals:1,default_wind_speed:0}}}customElements.define("simple-air-comfort-card",dt),window.customCards=window.customCards||[],window.customCards.push({type:"simple-air-comfort-card",name:"Simple Air Comfort Card",description:"Australian BoM apparent temperature + dew point (Arden Buck). Wind is optional; defaults to 0.0 m/s.",preview:!0});class ht extends nt{static properties={hass:{type:Object},_config:{state:!0}};static styles=n`
    .form { display: grid; gap: 12px; padding: 8px 12px 16px; }
    .row { display: grid; grid-template-columns: 220px 1fr; gap: 12px; align-items: center; }
    .hint { opacity: 0.7; font-size: 0.9em; }
  `;setConfig(t){this._config={name:t.name??"Air Comfort",temperature:t.temperature,humidity:t.humidity,windspeed:t.windspeed,decimals:Number.isFinite(t.decimals)?t.decimals:1,default_wind_speed:Number.isFinite(t.default_wind_speed)?t.default_wind_speed:0}}get _name(){return this._config?.name??""}get _temperature(){return this._config?.temperature??""}get _humidity(){return this._config?.humidity??""}get _windspeed(){return this._config?.windspeed??""}get _decimals(){return Number.isFinite(this._config?.decimals)?this._config.decimals:1}get _defaultWind(){return Number.isFinite(this._config?.default_wind_speed)?this._config.default_wind_speed:0}render(){return this.hass?W`
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
            <div class="hint">Optional. If empty, wind defaults below.</div>
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
      </div>
    `:W``}_update(t,e){const i={...this._config??{}};""===e||null==e?delete i[t]:i[t]=e,this._config=i,((t,e,i,s)=>{const r=new Event(e,{bubbles:s?.bubbles??!0,cancelable:s?.cancelable??!1,composed:s?.composed??!0});r.detail=i,t.dispatchEvent(r)})(this,"config-changed",{config:i})}_updateNumber(t,e,i=0){const s=""===e?void 0:Number(e),r=Number.isFinite(s)?s:i;this._update(t,r)}}customElements.define("simple-air-comfort-card-editor",ht);
//# sourceMappingURL=simple-air-comfort-card.js.map
