/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(s,t,i)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:o,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:c,getPrototypeOf:u}=Object,p=globalThis,m=p.trustedTypes,f=m?m.emptyScript:"",_=p.reactiveElementPolyfillSupport,g=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!o(t,e),b={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);r?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...h(t),...c(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const n=r.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,r=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??$)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[g("elementProperties")]=new Map,y[g("finalized")]=new Map,_?.({ReactiveElement:y}),(p.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A=globalThis,w=A.trustedTypes,E=w?w.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,x="?"+S,N=`<${x}>`,P=document,M=()=>P.createComment(""),k=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,U="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,T=/>/g,z=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,F=/"/g,L=/^(?:script|style|textarea|title)$/i,j=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),I=Symbol.for("lit-nothing"),B=new WeakMap,V=P.createTreeWalker(P,129);function q(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":3===e?"<math>":"",a=H;for(let e=0;e<i;e++){const i=t[e];let o,l,d=-1,h=0;for(;h<i.length&&(a.lastIndex=h,l=a.exec(i),null!==l);)h=a.lastIndex,a===H?"!--"===l[1]?a=R:void 0!==l[1]?a=T:void 0!==l[2]?(L.test(l[2])&&(r=RegExp("</"+l[2],"g")),a=z):void 0!==l[3]&&(a=z):a===z?">"===l[0]?(a=r??H,d=-1):void 0===l[1]?d=-2:(d=a.lastIndex-l[2].length,o=l[1],a=void 0===l[3]?z:'"'===l[3]?F:D):a===F||a===D?a=z:a===R||a===T?a=H:(a=z,r=void 0);const c=a===z&&t[e+1].startsWith("/>")?" ":"";n+=a===H?i+N:d>=0?(s.push(o),i.slice(0,d)+C+i.slice(d)+S+c):i+S+(-2===d?e:c)}return[q(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class G{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const a=t.length-1,o=this.parts,[l,d]=Z(t,e);if(this.el=G.createElement(l,i),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=V.nextNode())&&o.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=d[n++],i=s.getAttribute(t).split(S),a=/([.?@])?(.*)/.exec(e);o.push({type:1,index:r,name:a[2],strings:i,ctor:"."===a[1]?X:"?"===a[1]?tt:"@"===a[1]?et:Q}),s.removeAttribute(t)}else t.startsWith(S)&&(o.push({type:6,index:r}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=w?w.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],M()),V.nextNode(),o.push({type:2,index:++r});s.append(t[e],M())}}}else if(8===s.nodeType)if(s.data===x)o.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)o.push({type:7,index:r}),t+=S.length-1}r++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,s){if(e===W)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=k(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=J(t,r._$AS(t,e.values),r,s)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);V.currentNode=s;let r=V.nextNode(),n=0,a=0,o=i[0];for(;void 0!==o;){if(n===o.index){let e;2===o.type?e=new Y(r,r.nextSibling,this,t):1===o.type?e=new o.ctor(r,o.name,o.strings,this,t):6===o.type&&(e=new it(r,this,t)),this._$AV.push(e),o=i[++a]}n!==o?.index&&(r=V.nextNode(),n++)}return V.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=I,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),k(t)?t===I||null==t||""===t?(this._$AH!==I&&this._$AR(),this._$AH=I):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==I&&k(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new K(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=B.get(t.strings);return void 0===e&&B.set(t.strings,e=new G(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Y(this.O(M()),this.O(M()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=I,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=I}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=J(this,t,e,0),n=!k(t)||t!==this._$AH&&t!==W,n&&(this._$AH=t);else{const s=t;let a,o;for(t=r[0],a=0;a<r.length-1;a++)o=J(this,s[i+a],e,a),o===W&&(o=this._$AH[a]),n||=!k(o)||o!==this._$AH[a],o===I?t=I:t!==I&&(t+=(o??"")+r[a+1]),this._$AH[a]=o}n&&!s&&this.j(t)}j(t){t===I?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class X extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===I?void 0:t}}class tt extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==I)}}class et extends Q{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??I)===W)return;const i=this._$AH,s=t===I&&i!==I||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==I&&(i===I||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const st=A.litHtmlPolyfillSupport;st?.(G,Y),(A.litHtmlVersions??=[]).push("3.3.1");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let nt=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new Y(e.insertBefore(M(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};nt._$litElement$=!0,nt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:nt});const at=rt.litElementPolyfillSupport;at?.({LitElement:nt}),(rt.litElementVersions??=[]).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot=1;let lt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dt="important",ht=" !"+dt,ct=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends lt{constructor(t){if(super(t),t.type!==ot||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const s=e[t];if(null!=s){this.ft.add(t);const e="string"==typeof s&&s.endsWith(ht);t.includes("-")||e?i.setProperty(t,e?s.slice(0,-11):s,e?dt:""):i[t]=s}}return W}});class ut extends nt{static properties={hass:{type:Object},_config:{state:!0}};static styles=n`
    :host { --ring-size: 68%; } /* ring size relative to the square canvas */

    ha-card { padding: 16px; overflow: hidden; }

    /* Header */
    .header { display: grid; place-items: center; gap: 4px; margin-bottom: 6px; text-align: center; }
    .title { font-weight: 700; opacity: 0.9; }
    .summary { font-size: 1.6rem; font-weight: 800; line-height: 1; }
    .sub { opacity: 0.75; font-size: 0.95rem; }

    /* Square working area holding the dial */
    .canvas {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 12px;
      background: radial-gradient(60% 60% at 50% 45%, rgba(0,160,120,0.22), rgba(0,0,0,0.36) 55%, rgba(0,0,0,0.65));
      box-shadow: inset 0 0 60px rgba(0,0,0,0.35);
    }

    /* Real white outer ring (not dependent on the SVG) */
    .ring {
      position: absolute;
      left: 50%; top: 50%;
      width: var(--ring-size); height: var(--ring-size);
      transform: translate(-50%, -50%);
      border-radius: 50%;
      border: 2.5px solid rgba(255,255,255,0.95);
      box-shadow: 0 0 4px rgba(0,0,0,0.45);
      pointer-events: none;
    }

    /* Optional overlay SVG for the soft halo/vignette */
    .overlay {
      position: absolute; left: 50%; top: 50%;
      width: var(--ring-size); height: var(--ring-size);
      transform: translate(-50%, -50%);
      object-fit: contain; pointer-events: none;
      filter: drop-shadow(0 0 6px rgba(0,0,0,0.35)) brightness(1.05);
    }

    /* Inner glow */
    .inner {
      position: absolute; left: 50%; top: 50%;
      width: calc(var(--ring-size) * 0.58); height: calc(var(--ring-size) * 0.58);
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background:
        radial-gradient(40% 40% at 45% 45%, rgba(0,0,0,0.9), rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.1) 65%, transparent 66%),
        radial-gradient(circle at 50% 55%, rgba(0,200,160,0.6), rgba(0,120,100,0.42) 60%, rgba(0,0,0,0.15) 100%);
    }

    /* Floating dot (white rimmed) whose position is tied to comfort */
    .dot {
      position: absolute;
      left: calc(50% + var(--dot-x));
      top:  calc(50% + var(--dot-y));
      width: calc(var(--ring-size) * 0.095);
      height: calc(var(--ring-size) * 0.095);
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: #000;
      border: 6px solid rgba(238,238,238,0.98);
      box-shadow: 0 10px 18px rgba(0,0,0,0.55);
    }

    /* Ring-tied captions */
    .label { position: absolute; color: rgba(255,255,255,0.8); text-shadow: 0 1px 2px rgba(0,0,0,0.5); font-variant-numeric: tabular-nums; }
    .label.small { font-size: 0.95rem; font-weight: 700; }
    .label.tiny  { font-size: 0.85rem; opacity: 0.72; font-weight: 600; }
    .label.caption { font-size: 0.85rem; opacity: 0.65; }

    /* Cardinal captions positioned relative to the ring */
    .at-top    { left: 50%; top: 38%; transform: translate(-50%, -50%); }
    .at-bottom { left: 50%; top: 79%; transform: translate(-50%, -50%); }
    .at-left   { left: 24%;  top: 58%; transform: translate(-50%, -50%) rotate(180deg); writing-mode: vertical-rl; }
    .at-right  { left: 76%;  top: 58%; transform: translate(-50%, -50%); writing-mode: vertical-rl; }

    /* Corner metric blocks that hug the ring */
    .corner { position: absolute; transform: translate(-50%, -50%); text-align: center; }
    .tl { left: 34%; top: 33%; } /* Dew point */
    .tr { left: 66%; top: 33%; } /* Feels like */
    .bl { left: 34%; top: 77%; } /* Air temp + text */
    .br { left: 66%; top: 77%; } /* RH + text   */

    .metric { display: grid; gap: 2px; justify-items: center; }
    .metric .big { font-weight: 900; }
    .metric .cap { opacity: 0.72; font-size: 0.85rem; }
  `;setConfig(t){if(!t||!t.temperature||!t.humidity)throw new Error('simple-air-comfort-card: "temperature" and "humidity" entities are required.');this._config={name:t.name??"Air Comfort",temperature:t.temperature,humidity:t.humidity,windspeed:t.windspeed,decimals:Number.isFinite(t.decimals)?t.decimals:1,default_wind_speed:Number.isFinite(t.default_wind_speed)?t.default_wind_speed:0,overlay_url:t.overlay_url||"/hacsfiles/simple-air-comfort-card/sac_background_overlay.svg"}}render(){if(!this.hass||!this._config)return j``;const t=this.hass.states[this._config.temperature],e=this.hass.states[this._config.humidity],i=this._config.windspeed?this.hass.states[this._config.windspeed]:void 0;if(!t||!e)return j`<ha-card>
        <div class="header"><div class="title">${this._config.name}</div></div>
        <div class="sub">Entity not found: ${t?this._config.humidity:this._config.temperature}</div>
      </ha-card>`;const s=(t.attributes.unit_of_measurement||"°C").trim(),r=this.#t(parseFloat(t.state),s),n=parseFloat(e.state),a=this.#e(n),o=this.#i(i,this._config.default_wind_speed),l=a/100*this.#s(r),d=this.#r(l),h=this.#n(r,l,o),c=s,u=this.#a(r,c),p=this.#a(d,c),m=this.#a(h,c),f=this._config.decimals,_=a<35?"Dry":a>60?"Humid":"Comfy",g=h>=26?"Hot":h>=23?"Warm":h>=19?"Mild":h>=16?"Cool":"Cold",v=a<35?"DRY":a<=60?"COMFY":"HUMID",$=h>20&&h<22?"PERFECT":h>=18&&h<=24?"MILD":h<18?"COOL":"WARM",b=t=>Math.max(-1,Math.min(1,t)),y=b((a-50)/50),A=b((21-h)/10),w=`calc(var(--ring-size) * 0.32 * ${y.toFixed(3)})`,E=`calc(var(--ring-size) * 0.32 * ${A.toFixed(3)})`,C=this._config.overlay_url;return j`
      <ha-card>
        <!-- Header -->
        <div class="header">
          <div class="title">${this._config.name}</div>
          <div class="summary">${_}</div>
          <div class="sub">${g}</div>
        </div>

        <!-- Dial -->
        <div class="canvas" style=${ct({"--dot-x":w,"--dot-y":E})}>
          <!-- Cardinal captions -->
          <div class="label tiny at-top">Warm</div>
          <div class="label tiny at-bottom">Cold</div>
          <div class="label tiny at-left">Dry</div>
          <div class="label tiny at-right">Humid</div>

          <!-- Ring + optional overlay + glow + dot -->
          <div class="ring"></div>
          <img class="overlay" src="${C}" alt="" />
          <div class="inner"></div>
          <div class="dot" aria-hidden="true"></div>

          <!-- Corners -->
          <div class="corner tl metric">
            <div class="label caption">Dew point</div>
            <div class="label small big">${this.#o(p,f)} ${c}</div>
          </div>

          <div class="corner tr metric">
            <div class="label caption">Feels like</div>
            <div class="label small big">${this.#o(m,f)} ${c}</div>
          </div>

          <div class="corner bl metric">
            <div class="label small big">${this.#o(u,f)} ${c}</div>
            <div class="label cap">${$}</div>
          </div>

          <div class="corner br metric">
            <div class="label small big">${this.#o(a,f)} %</div>
            <div class="label cap">${v}</div>
          </div>
        </div>
      </ha-card>
    `}getCardSize(){return 3}#n(t,e,i){return t+.33*e-.7*i-4}#s(t){return Number.isFinite(t)?t>=0?6.1121*Math.exp(t/(257.14+t)*(18.678-t/234.5)):6.1115*Math.exp(t/(279.82+t)*(23.036-t/333.7)):NaN}#r(t){if(!Number.isFinite(t)||t<=0)return NaN;let e=-80,i=60,s=0;for(let r=0;r<60;r++){s=(e+i)/2;const r=this.#s(s);if(!Number.isFinite(r))break;if(r>t?i=s:e=s,Math.abs(i-e)<1e-4)break}return s}#e(t){return Number.isFinite(t)?Math.min(100,Math.max(0,t)):NaN}#t(t,e){if(!Number.isFinite(t))return NaN;return(e||"").toLowerCase().includes("f")?5/9*(t-32):t}#a(t,e){const i=(e||"").toLowerCase();return Number.isFinite(t)?i.includes("f")?9*t/5+32:t:NaN}#i(t,e){if(!t)return e??0;const i=parseFloat(t.state);if(!Number.isFinite(i))return e??0;const s=(t.attributes.unit_of_measurement||"m/s").toLowerCase();return s.includes("m/s")?i:s.includes("km/h")||s.includes("kph")?i/3.6:s.includes("mph")?.44704*i:s.includes("kn")?.514444*i:i}#l(t,e=1){if(!Number.isFinite(t))return NaN;const i=Math.pow(10,e);return Math.round(t*i)/i}#o(t,e=1){return Number.isFinite(t)?this.#l(t,e).toLocaleString(void 0,{minimumFractionDigits:e,maximumFractionDigits:e}):"—"}set hass(t){this._hass=t,this.requestUpdate()}get hass(){return this._hass}static getConfigElement(){return document.createElement("simple-air-comfort-card-editor")}static getStubConfig(){return{name:"Air Comfort",temperature:"sensor.temperature",humidity:"sensor.humidity",decimals:1,default_wind_speed:0}}}customElements.define("simple-air-comfort-card",ut),window.customCards=window.customCards||[],window.customCards.push({type:"simple-air-comfort-card",name:"Simple Air Comfort Card",description:"Australian BoM apparent temperature + dew point (Arden Buck). Wind defaults to 0.0 m/s if not provided.",preview:!0});class pt extends nt{static properties={hass:{type:Object},_config:{state:!0}};static styles=n`
    .form { display: grid; gap: 12px; padding: 8px 12px 16px; }
    .row {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 12px;
      align-items: center;
    }
    .hint { opacity: 0.7; font-size: 0.9em; }
  `;setConfig(t){this._config={name:t.name??"Air Comfort",temperature:t.temperature,humidity:t.humidity,windspeed:t.windspeed,decimals:Number.isFinite(t.decimals)?t.decimals:1,default_wind_speed:Number.isFinite(t.default_wind_speed)?t.default_wind_speed:0,overlay_url:t.overlay_url||"/hacsfiles/simple-air-comfort-card/sac_background_overlay.svg"}}get _name(){return this._config?.name??""}get _temperature(){return this._config?.temperature??""}get _humidity(){return this._config?.humidity??""}get _windspeed(){return this._config?.windspeed??""}get _decimals(){return Number.isFinite(this._config?.decimals)?this._config.decimals:1}get _defaultWind(){return Number.isFinite(this._config?.default_wind_speed)?this._config.default_wind_speed:0}get _overlay(){return this._config?.overlay_url??""}render(){return this.hass?j`
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
            <div class="hint">Optional. If empty, wind defaults below and is used only in the calculation.</div>
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
          <div><label>Default wind speed (m/s)</label>
            <div class="hint">If no wind speed entity is set, use this default.</div>
          </div>
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
          <div><label>Overlay URL (optional)</label>
            <div class="hint">Defaults to the HACS path. Leave blank to keep default.</div>
          </div>
          <ha-textfield
            .value=${this._overlay}
            @input=${t=>this._update("overlay_url",t.target.value)}
            placeholder="/hacsfiles/simple-air-comfort-card/sac_background_overlay.svg"
          ></ha-textfield>
        </div>
      </div>
    `:j``}_update(t,e){const i={...this._config??{}};""===e||null==e?delete i[t]:i[t]=e,this._config=i,((t,e,i,s)=>{const r=new Event(e,{bubbles:s?.bubbles??!0,cancelable:s?.cancelable??!1,composed:s?.composed??!0});r.detail=i,t.dispatchEvent(r)})(this,"config-changed",{config:i})}_updateNumber(t,e,i=0){const s=""===e?void 0:Number(e),r=Number.isFinite(s)?s:i;this._update(t,r)}}customElements.define("simple-air-comfort-card-editor",pt);
//# sourceMappingURL=simple-air-comfort-card.js.map
