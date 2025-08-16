/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(s,t,i)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:o,defineProperty:d,getOwnPropertyDescriptor:l,getOwnPropertyNames:h,getOwnPropertySymbols:c,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,f=m?m.emptyScript:"",_=u.reactiveElementPolyfillSupport,g=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!o(t,e),y={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&d(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);r?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...h(t),...c(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const n=r.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,r=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??$)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[g("elementProperties")]=new Map,b[g("finalized")]=new Map,_?.({ReactiveElement:b}),(u.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A=globalThis,w=A.trustedTypes,x=w?w.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,N="?"+C,S=`<${N}>`,P=document,k=()=>P.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,H="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,F=/>/g,R=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,z=/"/g,L=/^(?:script|style|textarea|title)$/i,j=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),I=new WeakMap,V=P.createTreeWalker(P,129);function q(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":3===e?"<math>":"",a=U;for(let e=0;e<i;e++){const i=t[e];let o,d,l=-1,h=0;for(;h<i.length&&(a.lastIndex=h,d=a.exec(i),null!==d);)h=a.lastIndex,a===U?"!--"===d[1]?a=O:void 0!==d[1]?a=F:void 0!==d[2]?(L.test(d[2])&&(r=RegExp("</"+d[2],"g")),a=R):void 0!==d[3]&&(a=R):a===R?">"===d[0]?(a=r??U,l=-1):void 0===d[1]?l=-2:(l=a.lastIndex-d[2].length,o=d[1],a=void 0===d[3]?R:'"'===d[3]?z:D):a===z||a===D?a=R:a===O||a===F?a=U:(a=R,r=void 0);const c=a===R&&t[e+1].startsWith("/>")?" ":"";n+=a===U?i+S:l>=0?(s.push(o),i.slice(0,l)+E+i.slice(l)+C+c):i+C+(-2===l?e:c)}return[q(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class J{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const a=t.length-1,o=this.parts,[d,l]=G(t,e);if(this.el=J.createElement(d,i),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=V.nextNode())&&o.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=l[n++],i=s.getAttribute(t).split(C),a=/([.?@])?(.*)/.exec(e);o.push({type:1,index:r,name:a[2],strings:i,ctor:"."===a[1]?Q:"?"===a[1]?tt:"@"===a[1]?et:Z}),s.removeAttribute(t)}else t.startsWith(C)&&(o.push({type:6,index:r}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=w?w.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],k()),V.nextNode(),o.push({type:2,index:++r});s.append(t[e],k())}}}else if(8===s.nodeType)if(s.data===N)o.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)o.push({type:7,index:r}),t+=C.length-1}r++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,s){if(e===W)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=T(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=K(t,r._$AS(t,e.values),r,s)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);V.currentNode=s;let r=V.nextNode(),n=0,a=0,o=i[0];for(;void 0!==o;){if(n===o.index){let e;2===o.type?e=new Y(r,r.nextSibling,this,t):1===o.type?e=new o.ctor(r,o.name,o.strings,this,t):6===o.type&&(e=new it(r,this,t)),this._$AV.push(e),o=i[++a]}n!==o?.index&&(r=V.nextNode(),n++)}return V.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),T(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=J.createElement(q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new X(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=I.get(t.strings);return void 0===e&&I.set(t.strings,e=new J(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Y(this.O(k()),this.O(k()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Z{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=K(this,t,e,0),n=!T(t)||t!==this._$AH&&t!==W,n&&(this._$AH=t);else{const s=t;let a,o;for(t=r[0],a=0;a<r.length-1;a++)o=K(this,s[i+a],e,a),o===W&&(o=this._$AH[a]),n||=!T(o)||o!==this._$AH[a],o===B?t=B:t!==B&&(t+=(o??"")+r[a+1]),this._$AH[a]=o}n&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Q extends Z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class tt extends Z{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class et extends Z{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??B)===W)return;const i=this._$AH,s=t===B&&i!==B||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==B&&(i===B||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const st=A.litHtmlPolyfillSupport;st?.(J,Y),(A.litHtmlVersions??=[]).push("3.3.1");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class nt extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new Y(e.insertBefore(k(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}nt._$litElement$=!0,nt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:nt});const at=rt.litElementPolyfillSupport;at?.({LitElement:nt}),(rt.litElementVersions??=[]).push("4.2.1");class ot extends nt{static properties={hass:{type:Object},_config:{state:!0}};static styles=n`
    ha-card { padding: 12px 12px 16px; overflow: hidden; }

    .header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 4px;
    }
    .title { font-weight: 700; font-size: 1.05rem; letter-spacing: .2px; }

    .wrap {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 12px;
      align-items: center;
    }

    /* Left column: numbers + text lines */
    .metrics { display: grid; gap: 10px; }
    .primary {
      font-size: 2.0rem; font-weight: 800; line-height: 1;
      display: flex; align-items: baseline; gap: 6px;
    }
    .unit { opacity: .7; font-weight: 600; }

    .grid2 {
      display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px;
      font-variant-numeric: tabular-nums;
    }
    .label { opacity: .8; }
    .val { justify-self: end; font-weight: 600; }

    .comfort {
      margin-top: 2px;
      display: grid; gap: 2px;
      font-size: .95rem;
    }
    .comfort .line { display: flex; justify-content: space-between; gap: 8px; }
    .comfort .k { opacity: .75; }
    .comfort .v { font-weight: 600; }

    /* Right column: dial */
    .dialWrap { position: relative; height: 0; padding-top: 100%; } /* square */
    .dial {
      position: absolute; inset: 0;
      display: grid; place-items: center;
    }

    /* Outer ring (thin border), inner comfort disc */
    .ring {
      position: relative;
      width: 86%;
      height: 86%;
      border-radius: 50%;
      border: 2.5px solid rgba(255,255,255,0.9);
      /* subtle radial background so it looks like a dial even w/out the SVG */
      background:
        radial-gradient(closest-side, rgba(255,255,255,0.06), transparent 65%),
        radial-gradient(farthest-side, rgba(255,255,255,0.08), transparent 70%);
    }
    .inner {
      position: absolute; inset: 0;
      margin: 17%;
      border-radius: 50%;
      /* inner comfort zone colour — tweak if you want dynamic colour mapping */
      background: rgba(255,255,255,0.10);
      border: 0 solid transparent;
    }

    /* Pupil (floating dot) */
    .pupil {
      position: absolute;
      width: 14%; height: 14%;
      border-radius: 50%;
      display: grid; place-items: center;
      transform: translate(-50%, -50%);
      /* Ringed dot to read well on any background */
      background: white;
      box-shadow:
        0 0 0 3px rgba(0,0,0,0.25),
        0 0 0 6px rgba(255,255,255,0.6);
    }

    /* Dial markers */
    .marker {
      position: absolute;
      font-size: .85rem; color: grey; font-weight: 600;
      user-select: none;
      text-shadow: 0 1px 0 rgba(0,0,0,0.15);
    }
    .m-warm  { top: 4%; left: 50%; transform: translateX(-50%); }
    .m-cold  { bottom: 4%; left: 50%; transform: translateX(-50%); }
    .m-dry   { left: 4%; top: 50%; transform: translateY(-50%) rotate(180deg); writing-mode: vertical-rl; }
    .m-humid { right: 4%; top: 50%; transform: translateY(-50%); writing-mode: vertical-rl; }

    /* Fine print / muted */
    .muted { opacity: .7; }
  `;setConfig(t){if(!t?.temperature||!t?.humidity)throw new Error('simple-air-comfort-card: "temperature" and "humidity" entities are required.');this._config={name:t.name??"Aircomfort",temperature:t.temperature,humidity:t.humidity,windspeed:t.windspeed,decimals:Number.isFinite(t.decimals)?t.decimals:1,default_wind_speed:Number.isFinite(t.default_wind_speed)?t.default_wind_speed:0,temp_min:Number.isFinite(t.temp_min)?t.temp_min:10,temp_max:Number.isFinite(t.temp_max)?t.temp_max:35}}render(){if(!this.hass||!this._config)return j``;const t=this.hass.states[this._config.temperature],e=this.hass.states[this._config.humidity],i=this._config.windspeed?this.hass.states[this._config.windspeed]:void 0;if(!t||!e)return j`<ha-card>
        <div class="header"><div class="title">${this._config.name}</div></div>
        <div class="muted">
          Entity not found: ${t?this._config.humidity:this._config.temperature}
        </div>
      </ha-card>`;const s=(t.attributes.unit_of_measurement||"°C").trim(),r=this.#t(parseFloat(t.state),s),n=this.#e(parseFloat(e.state)),a=this.#i(i,this._config.default_wind_speed),o=n/100*this.#s(r),d=this.#r(o),l=this.#n(r,o,a),h=s,c=this.#a(l,h),p=this.#a(r,h),u=this.#a(d,h),m=this._config.decimals,f=this.#o(r,n,this._config.temp_min,this._config.temp_max),_=this.#d(d),g=this.#l(r,this._config.temp_min,this._config.temp_max),v=this.#h(n);return j`
      <ha-card>
        <div class="header">
          <div class="title">${this._config.name}</div>
        </div>

        <div class="wrap">
          <!-- LEFT: Values -->
          <div class="metrics">
            <div class="primary">
              ${this.#c(c,m)} <span class="unit">${h}</span>
            </div>
            <div class="muted">Apparent temperature</div>

            <div class="grid2">
              <div class="label">Dew point</div>
              <div class="val">${this.#c(u,m)} ${h}</div>

              <div class="label">Air temperature</div>
              <div class="val">${this.#c(p,m)} ${h}</div>

              <div class="label">Humidity</div>
              <div class="val">${this.#c(n,m)} %</div>
            </div>

            <!-- Text comfort lines (replacing external template sensors) -->
            <div class="comfort">
              <div class="line"><span class="k">Dew-point comfort</span><span class="v">${_}</span></div>
              <div class="line"><span class="k">Temperature comfort</span><span class="v">${g}</span></div>
              <div class="line"><span class="k">Humidity comfort</span><span class="v">${v}</span></div>
            </div>
          </div>

          <!-- RIGHT: Dial -->
          <div class="dialWrap">
            <div class="dial">
              <div class="ring">
                <div class="inner"></div>

                <!-- Pupil (hidden if NaN) -->
                ${Number.isFinite(f.left)&&Number.isFinite(f.top)?j`
                  <div class="pupil" style="left:${f.left}%; top:${f.top}%"></div>
                `:j``}

                <!-- Markers -->
                <div class="marker m-warm">Warm</div>
                <div class="marker m-cold">Cold</div>
                <div class="marker m-dry">Dry</div>
                <div class="marker m-humid">Humid</div>
              </div>
            </div>
          </div>
        </div>
      </ha-card>
    `}getCardSize(){return 3}#n(t,e,i){return t+.33*e-.7*i-4}#s(t){return Number.isFinite(t)?t>=0?6.1121*Math.exp(t/(257.14+t)*(18.678-t/234.5)):6.1115*Math.exp(t/(279.82+t)*(23.036-t/333.7)):NaN}#r(t){if(!Number.isFinite(t)||t<=0)return NaN;let e=-80,i=60,s=0;for(let r=0;r<60;r++){s=(e+i)/2;const r=this.#s(s);if(!Number.isFinite(r))break;if(r>t?i=s:e=s,Math.abs(i-e)<1e-4)break}return s}#d(t){return Number.isFinite(t)?t<8?"Very dry":t<12?"Dry":t<16?"Comfy":t<20?"Mildly humid":t<24?"Humid":"Very humid":"—"}#l(t,e,i){if(!Number.isFinite(t))return"—";return t<e?"Cold":t<e+.35*(i-e)?"Cool":t<e+.65*(i-e)?"Comfy":t<i?"Warm":"Hot"}#h(t){return Number.isFinite(t)?t<30?"Dry":t<=60?"Comfy":t<=70?"Mildly humid":"Humid":"—"}#o(t,e,i,s){if(!Number.isFinite(t)||!Number.isFinite(e))return{left:NaN,top:NaN};let r=10+80*this.#p(e/100),n=90-80*this.#p((t-i)/Math.max(1,s-i));const a=r-50,o=n-50,d=Math.sqrt(a*a+o*o);return d>43&&(r=50+a/d*43,n=50+o/d*43),r=50+.92*(r-50),n=50+.92*(n-50),{left:this.#u(r,2),top:this.#u(n,2)}}#p(t){return Math.min(1,Math.max(0,t))}#e(t){return Number.isFinite(t)?Math.min(100,Math.max(0,t)):NaN}#t(t,e){if(!Number.isFinite(t))return NaN;return(e||"").toLowerCase().includes("f")?5/9*(t-32):t}#a(t,e){if(!Number.isFinite(t))return NaN;return(e||"").toLowerCase().includes("f")?9*t/5+32:t}#i(t,e){if(!t)return Number.isFinite(e)?e:0;const i=parseFloat(t.state);if(!Number.isFinite(i))return Number.isFinite(e)?e:0;const s=(t.attributes.unit_of_measurement||"m/s").toLowerCase();return s.includes("m/s")?i:s.includes("km/h")||s.includes("kph")?i/3.6:s.includes("mph")?.44704*i:s.includes("kn")?.514444*i:i}#u(t,e=1){if(!Number.isFinite(t))return NaN;const i=Math.pow(10,e);return Math.round(t*i)/i}#c(t,e=1){return Number.isFinite(t)?this.#u(t,e).toLocaleString(void 0,{minimumFractionDigits:e,maximumFractionDigits:e}):"—"}set hass(t){this._hass=t,this.requestUpdate()}get hass(){return this._hass}static getConfigElement(){return document.createElement("simple-air-comfort-card-editor")}static getStubConfig(){return{name:"Aircomfort",temperature:"sensor.temperature",humidity:"sensor.humidity",decimals:1,default_wind_speed:0,temp_min:10,temp_max:35}}}customElements.define("simple-air-comfort-card",ot),window.customCards=window.customCards||[],window.customCards.push({type:"simple-air-comfort-card",name:"Simple Air Comfort Card",description:"BoM apparent temperature + Arden Buck dewpoint; dial with moving pupil; wind only in editor.",preview:!0});class dt extends nt{static properties={hass:{type:Object},_config:{state:!0}};static styles=n`
    .form { display: grid; gap: 12px; padding: 8px 12px 16px; }
    .row { display: grid; grid-template-columns: 210px 1fr; gap: 12px; align-items: center; }
    .hint { opacity: .7; font-size: .9em; }
  `;setConfig(t){this._config={name:t.name??"Aircomfort",temperature:t.temperature,humidity:t.humidity,windspeed:t.windspeed,decimals:Number.isFinite(t.decimals)?t.decimals:1,default_wind_speed:Number.isFinite(t.default_wind_speed)?t.default_wind_speed:0,temp_min:Number.isFinite(t.temp_min)?t.temp_min:10,temp_max:Number.isFinite(t.temp_max)?t.temp_max:35}}get _name(){return this._config?.name??""}get _temperature(){return this._config?.temperature??""}get _humidity(){return this._config?.humidity??""}get _windspeed(){return this._config?.windspeed??""}get _decimals(){return Number.isFinite(this._config?.decimals)?this._config.decimals:1}get _defWind(){return Number.isFinite(this._config?.default_wind_speed)?this._config.default_wind_speed:0}get _tmin(){return Number.isFinite(this._config?.temp_min)?this._config.temp_min:10}get _tmax(){return Number.isFinite(this._config?.temp_max)?this._config.temp_max:35}render(){return this.hass?j`
      <div class="form">
        <div class="row">
          <div><label>Name (shown at top)</label></div>
          <ha-textfield .value=${this._name}
                        @input=${t=>this.#m("name",t.target.value)}
                        placeholder="Aircomfort"></ha-textfield>
        </div>

        <div class="row">
          <div><label>Temperature entity</label></div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._temperature}
            .includeDomains=${["sensor"]}
            allow-custom-entity
            @value-changed=${t=>this.#m("temperature",t.detail.value)}>
          </ha-entity-picker>
        </div>

        <div class="row">
          <div><label>Humidity entity</label></div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._humidity}
            .includeDomains=${["sensor"]}
            allow-custom-entity
            @value-changed=${t=>this.#m("humidity",t.detail.value)}>
          </ha-entity-picker>
        </div>

        <div class="row">
          <div>
            <label>Wind speed entity</label>
            <div class="hint">Optional. Used in AT calc only.</div>
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._windspeed}
            .includeDomains=${["sensor"]}
            allow-custom-entity
            @value-changed=${t=>this.#m("windspeed",t.detail.value)}>
          </ha-entity-picker>
        </div>

        <div class="row">
          <div><label>Default wind speed (m/s)</label>
            <div class="hint">If no wind speed entity is set, this value is used.</div>
          </div>
          <ha-textfield type="number" inputmode="decimal" step="0.1"
                        .value=${String(this._defWind)}
                        @input=${t=>this.#f("default_wind_speed",t.target.value,0)}>
          </ha-textfield>
        </div>

        <div class="row">
          <div><label>Temp scale min (°C)</label>
            <div class="hint">Pupil vertical scaling lower bound.</div>
          </div>
          <ha-textfield type="number" step="0.5"
                        .value=${String(this._tmin)}
                        @input=${t=>this.#f("temp_min",t.target.value,10)}>
          </ha-textfield>
        </div>

        <div class="row">
          <div><label>Temp scale max (°C)</label>
            <div class="hint">Pupil vertical scaling upper bound.</div>
          </div>
          <ha-textfield type="number" step="0.5"
                        .value=${String(this._tmax)}
                        @input=${t=>this.#f("temp_max",t.target.value,35)}>
          </ha-textfield>
        </div>

        <div class="row">
          <div><label>Decimals</label></div>
          <ha-textfield type="number" step="1" min="0"
                        .value=${String(this._decimals)}
                        @input=${t=>this.#f("decimals",t.target.value,1)}>
          </ha-textfield>
        </div>
      </div>
    `:j``}#m(t,e){const i={...this._config??{}};""===e||null==e?delete i[t]:i[t]=e,this._config=i,((t,e,i,s)=>{const r=new Event(e,{bubbles:s?.bubbles??!0,cancelable:s?.cancelable??!1,composed:s?.composed??!0});r.detail=i,t.dispatchEvent(r)})(this,"config-changed",{config:i})}#f(t,e,i=0){const s=""===e?void 0:Number(e),r=Number.isFinite(s)?s:i;this.#m(t,r)}}customElements.define("simple-air-comfort-card-editor",dt);
//# sourceMappingURL=simple-air-comfort-card.js.map
