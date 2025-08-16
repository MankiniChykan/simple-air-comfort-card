/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(s,t,i)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:d,getOwnPropertyDescriptor:l,getOwnPropertyNames:h,getOwnPropertySymbols:c,getPrototypeOf:u}=Object,p=globalThis,m=p.trustedTypes,f=m?m.emptyScript:"",g=p.reactiveElementPolyfillSupport,v=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!a(t,e),b={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&d(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);r?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...h(t),...c(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=s;const n=r.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,r=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??$)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[v("elementProperties")]=new Map,y[v("finalized")]=new Map,g?.({ReactiveElement:y}),(p.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,A=w.trustedTypes,x=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,S="?"+E,N=`<${S}>`,P=document,k=()=>P.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,M="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,F=/>/g,R=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,j=/"/g,L=/^(?:script|style|textarea|title)$/i,z=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),B=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),I=new WeakMap,V=P.createTreeWalker(P,129);function q(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=U;for(let e=0;e<i;e++){const i=t[e];let a,d,l=-1,h=0;for(;h<i.length&&(o.lastIndex=h,d=o.exec(i),null!==d);)h=o.lastIndex,o===U?"!--"===d[1]?o=H:void 0!==d[1]?o=F:void 0!==d[2]?(L.test(d[2])&&(r=RegExp("</"+d[2],"g")),o=R):void 0!==d[3]&&(o=R):o===R?">"===d[0]?(o=r??U,l=-1):void 0===d[1]?l=-2:(l=o.lastIndex-d[2].length,a=d[1],o=void 0===d[3]?R:'"'===d[3]?j:D):o===j||o===D?o=R:o===H||o===F?o=U:(o=R,r=void 0);const c=o===R&&t[e+1].startsWith("/>")?" ":"";n+=o===U?i+N:l>=0?(s.push(a),i.slice(0,l)+C+i.slice(l)+E+c):i+E+(-2===l?e:c)}return[q(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[d,l]=J(t,e);if(this.el=K.createElement(d,i),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=V.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=l[n++],i=s.getAttribute(t).split(E),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?X:"?"===o[1]?tt:"@"===o[1]?et:Q}),s.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(E),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],k()),V.nextNode(),a.push({type:2,index:++r});s.append(t[e],k())}}}else if(8===s.nodeType)if(s.data===S)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(E,t+1));)a.push({type:7,index:r}),t+=E.length-1}r++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,s){if(e===B)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=O(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Y(t,r._$AS(t,e.values),r,s)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);V.currentNode=s;let r=V.nextNode(),n=0,o=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new G(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new it(r,this,t)),this._$AV.push(e),a=i[++o]}n!==a?.index&&(r=V.nextNode(),n++)}return V.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class G{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),O(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Z(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=I.get(t.strings);return void 0===e&&I.set(t.strings,e=new K(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new G(this.O(k()),this.O(k()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=Y(this,t,e,0),n=!O(t)||t!==this._$AH&&t!==B,n&&(this._$AH=t);else{const s=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=Y(this,s[i+o],e,o),a===B&&(a=this._$AH[o]),n||=!O(a)||a!==this._$AH[o],a===W?t=W:t!==W&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class X extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class tt extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class et extends Q{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??W)===B)return;const i=this._$AH,s=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const st=w.litHtmlPolyfillSupport;st?.(K,G),(w.litHtmlVersions??=[]).push("3.3.1");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class nt extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new G(e.insertBefore(k(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}nt._$litElement$=!0,nt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:nt});const ot=rt.litElementPolyfillSupport;ot?.({LitElement:nt}),(rt.litElementVersions??=[]).push("4.2.1");const at=new URL("./sac_background_overlay.svg",import.meta.url);class dt extends nt{static properties={hass:{type:Object},_config:{state:!0}};static styles=n`
    ha-card {
      position: relative;
      overflow: hidden;
      padding: 0;
      /* subtle rounded look like your mock */
      border-radius: 12px;
    }

    /* background glow (approximate your green aura); kept subtle so themes work */
    .bg {
      position: absolute; inset: 0;
      background: radial-gradient(80% 80% at 50% 50%,
                    rgba(0,200,120,0.25), rgba(0,200,120,0.08) 40%, transparent 70%);
      filter: blur(0.5px);
      pointer-events: none;
    }

    /* optional SVG overlay you ship with the card */
    .overlay {
      position: absolute; inset: 0;
      object-fit: cover;
      width: 100%; height: 100%;
      opacity: 0.6;
      pointer-events: none;
    }

    .wrap {
      position: relative;
      display: grid;
      grid-template-rows: auto 1fr auto;
      padding: 12px;
      min-height: 260px; /* keeps a nice square-ish card */
    }

    /* header area */
    .top {
      display: grid;
      justify-items: center;
      gap: 2px;
      margin-bottom: 6px;
    }
    .room { font-weight: 600; color: var(--secondary-text-color); }
    .headline { font-size: 1.4rem; font-weight: 800; line-height: 1.1; }
    .subtle { color: var(--secondary-text-color); font-size: .9rem; }

    /* center “eye” layout */
    .center {
      display: grid;
      place-items: center;
      position: relative;
      margin: 4px 0;
    }
    .dial {
      position: relative;
      width: min(78vmin, 240px);
      aspect-ratio: 1/1;
      display: grid;
      place-items: center;
    }
    /* outer white ring */
    .ring {
      position: absolute; inset: 6%;
      border-radius: 50%;
      border: 2.5px solid rgba(255,255,255,0.95);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05) inset;
    }
    /* dewpoint/AT aura under ring (uses CSS var set from JS) */
    .aura {
      position: absolute; inset: 2%;
      border-radius: 50%;
      background: radial-gradient(60% 60% at 50% 50%,
                  var(--sac-aura, rgba(0,200,120,.25)),
                  transparent 70%);
      filter: blur(1px);
    }
    /* inner glow circle (alert colour) */
    .inner {
      position: absolute;
      inset: 27%;
      border-radius: 50%;
      background:
        radial-gradient(35% 35% at 40% 40%, rgba(255,255,255,.75), transparent 45%),
        radial-gradient(75% 75% at 50% 50%, var(--sac-inner, rgba(0,160,120,.55)), rgba(0,0,0,.25));
      box-shadow: inset 0 10px 25px rgba(0,0,0,.35);
    }
    /* pupil (the moving dot) */
    .pupil {
      position: absolute;
      width: 18%;
      aspect-ratio: 1/1;
      border-radius: 50%;
      background:
        radial-gradient(30% 30% at 30% 30%, rgba(255,255,255,.9), transparent 30%),
        radial-gradient(80% 80% at 55% 55%, rgba(0,0,0,.95), rgba(0,0,0,.7));
      transform: translate(var(--px, 0), var(--py, 0));
      transition: transform .3s ease-out, background-color .2s linear;
      will-change: transform;
    }

    /* axis labels like your mock */
    .axis {
      position: absolute; inset: 0;
      display: grid;
      grid-template-areas:
        "top top"
        "left right"
        "bottom bottom";
      grid-template-rows: 1fr auto 1fr;
      grid-template-columns: 1fr 1fr;
      font-size: .85rem; color: grey; pointer-events: none;
      font-weight: 600;
    }
    .axis .top    { grid-area: top;    justify-self: end; margin-right: 4px; }
    .axis .bottom { grid-area: bottom; justify-self: end; margin-right: 4px; }
    .axis .left   { grid-area: left;   writing-mode: vertical-rl; transform: rotate(180deg); justify-self: start; margin-left: 6px; }
    .axis .right  { grid-area: right;  writing-mode: vertical-rl; justify-self: end; margin-right: 6px; }

    /* corners with values */
    .corners {
      position: absolute; inset: 0;
      display: grid; grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      font-variant-numeric: tabular-nums;
      pointer-events: none;
    }
    .corner {
      display: grid; gap: 2px; align-content: start; justify-items: center;
      padding: 6px; font-size: .9rem;
    }
    .corner .mini { color: var(--secondary-text-color); font-size: .8rem; }
    .corner .big  { font-weight: 700; }
    .tl { align-content: start; justify-items: start; }
    .tr { align-content: start; justify-items: end;  }
    .bl { align-content: end;   justify-items: start; }
    .br { align-content: end;   justify-items: end;   }

    .bottom {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 8px;
      font-weight: 700;
    }
    .bottom .label {
      color: var(--secondary-text-color);
      font-weight: 600;
    }
  `;setConfig(t){if(!t||!t.temperature||!t.humidity)throw new Error('simple-air-comfort-card: "temperature" and "humidity" entities are required.');this._config={name:t.name??"Air Comfort",temperature:t.temperature,humidity:t.humidity,windspeed:t.windspeed,decimals:Number.isFinite(t.decimals)?t.decimals:1,default_wind_speed:Number.isFinite(t.default_wind_speed)?t.default_wind_speed:0,show_overlay:!1!==t.show_overlay}}render(){if(!this.hass||!this._config)return z``;const t=this.hass.states[this._config.temperature],e=this.hass.states[this._config.humidity],i=this._config.windspeed?this.hass.states[this._config.windspeed]:void 0;if(!t||!e)return z`<ha-card>
        <div class="wrap">
          <div class="top"><div class="room">${this._config.name}</div></div>
          <div class="subtle">Entity not found: ${t?this._config.humidity:this._config.temperature}</div>
        </div>
      </ha-card>`;const s=(t.attributes.unit_of_measurement||"°C").trim(),r=this.#t(parseFloat(t.state),s),n=this.#e(parseFloat(e.state)),o=this.#i(i,this._config.default_wind_speed),a=n/100*this.#s(r),d=this.#r(a),l=this.#n(r,a,o),h=s,c=this.#o(l,h),u=this.#o(r,h),p=this.#o(d,h),m=this._config.decimals,f=this.#a(d),g=this.#d(r),v=this.#l(r),_=this.#h(n),$=this.#c(l),b=this.#u(l),y=this.#p(-1,(n-50)/50,1),w=this.#p(-1,(22-r)/10,1),A=Math.hypot(y,w),x=.24*(A>1?y/A:y),C=.24*(A>1?w/A:w),E=i?`${this.#m(o,m)} m/s`:`${this.#m(this._config.default_wind_speed,m)} m/s (default)`;return z`
      <ha-card style=${ht({"--sac-aura":$,"--sac-inner":b})}>
        ${this._config.show_overlay?z`<img class="overlay" alt="" src="${at}">`:null}
        <div class="bg"></div>

        <div class="wrap">
          <!-- Top title + labels -->
          <div class="top">
            <div class="room">${this._config.name}</div>
            <div class="headline">${f}</div>
            <div class="subtle">${g}</div>
          </div>

          <!-- Center “eye” -->
          <div class="center">
            <div class="dial">
              <div class="aura"></div>
              <div class="ring"></div>
              <div class="inner"></div>

              <!-- axis labels like the mock -->
              <div class="axis">
                <div class="top">Warm</div>
                <div class="bottom">Cold</div>
                <div class="left">Dry</div>
                <div class="right">Humid</div>
              </div>

              <!-- corner readouts -->
              <div class="corners">
                <div class="corner tl">
                  <div class="mini">Dew point</div>
                  <div class="big">${this.#f(p,m)} ${h}</div>
                </div>
                <div class="corner tr">
                  <div class="mini">Feels like</div>
                  <div class="big">${this.#f(c,m)} ${h}</div>
                </div>
                <div class="corner bl">
                  <div class="big">${this.#f(u,m)} ${h}</div>
                  <div class="mini">${v}</div>
                </div>
                <div class="corner br">
                  <div class="big">${this.#f(n,m)} %</div>
                  <div class="mini">${_}</div>
                </div>
              </div>

              <!-- moving pupil -->
              <div class="pupil"
                   style=${ht({"--px":100*x+"%","--py":100*C+"%"})}></div>
            </div>
          </div>

          <!-- bottom row with wind & vapour pressure like your simple card -->
          <div class="bottom">
            <div>
              <div class="label">Wind speed</div>
              <div>${E}</div>
            </div>
            <div style="text-align:right">
              <div class="label">Vapour pressure (e)</div>
              <div>${this.#f(a,m)} hPa</div>
            </div>
          </div>
        </div>
      </ha-card>
    `}getCardSize(){return 4}#n(t,e,i){return t+.33*e-.7*i-4}#s(t){return Number.isFinite(t)?t>=0?6.1121*Math.exp(t/(257.14+t)*(18.678-t/234.5)):6.1115*Math.exp(t/(279.82+t)*(23.036-t/333.7)):NaN}#r(t){if(!Number.isFinite(t)||t<=0)return NaN;let e=-80,i=60,s=0;for(let r=0;r<60;r++){s=(e+i)/2;const r=this.#s(s);if(!Number.isFinite(r))break;if(r>t?i=s:e=s,Math.abs(i-e)<1e-4)break}return s}#a(t){return Number.isFinite(t)?t<5?"Very Dry":t<10?"Dry":t<17?"Comfy":t<21?"Sticky":t<24?"Uncomfortable":"Oppressive":"—"}#d(t){return Number.isFinite(t)?t<18?"Cold":t<21?"Cool":t<=24||t<=27?"Warm":"Hot":"—"}#l(t){return Number.isFinite(t)?t<18?"COLD":t<21?"COOL":t<=24?"PERFECT":t<=27?"WARM":"HOT":""}#h(t){return Number.isFinite(t)?t<30?"DRY":t<=60?"COMFY":"HUMID":""}#c(t){return Number.isFinite(t)?t<10?"rgba(60,140,255,.22)":t<18?"rgba(0,180,140,.22)":t<=25?"rgba(0,200,120,.28)":t<=30?"rgba(255,170,0,.24)":"rgba(255,60,60,.24)":"rgba(0,200,120,.22)"}#u(t){return Number.isFinite(t)?t<10?"rgba(80,140,255,.45)":t<18?"rgba(0,160,140,.48)":t<=25?"rgba(0,160,120,.55)":t<=30?"rgba(255,160,0,.5)":"rgba(255,80,80,.5)":"rgba(0,160,120,.5)"}#p(t,e,i){return Math.min(i,Math.max(t,e))}#e(t){return Number.isFinite(t)?Math.min(100,Math.max(0,t)):NaN}#t(t,e){if(!Number.isFinite(t))return NaN;return(e||"").toLowerCase().includes("f")?5/9*(t-32):t}#o(t,e){const i=(e||"").toLowerCase();return Number.isFinite(t)?i.includes("f")?9*t/5+32:t:NaN}#i(t,e){if(!t)return e??0;const i=parseFloat(t.state);if(!Number.isFinite(i))return e??0;const s=(t.attributes.unit_of_measurement||"m/s").toLowerCase();return s.includes("m/s")?i:s.includes("km/h")||s.includes("kph")?i/3.6:s.includes("mph")?.44704*i:s.includes("kn")?.514444*i:i}#m(t,e=1){if(!Number.isFinite(t))return NaN;const i=Math.pow(10,e);return Math.round(t*i)/i}#f(t,e=1){return Number.isFinite(t)?this.#m(t,e).toLocaleString(void 0,{minimumFractionDigits:e,maximumFractionDigits:e}):"—"}set hass(t){this._hass=t,this.requestUpdate()}get hass(){return this._hass}static getConfigElement(){return document.createElement("simple-air-comfort-card-editor")}static getStubConfig(){return{name:"Air Comfort",temperature:"sensor.temperature",humidity:"sensor.humidity",decimals:1,default_wind_speed:0,show_overlay:!0}}}customElements.define("simple-air-comfort-card",dt),window.customCards=window.customCards||[],window.customCards.push({type:"simple-air-comfort-card",name:"Simple Air Comfort Card",description:"Circular “eye” display with BoM apparent temperature + Arden Buck dew point. Defaults wind to 0 m/s if none.",preview:!0});class lt extends nt{static properties={hass:{type:Object},_config:{state:!0}};static styles=n`
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
  `;setConfig(t){this._config={name:t.name??"Air Comfort",temperature:t.temperature,humidity:t.humidity,windspeed:t.windspeed,decimals:Number.isFinite(t.decimals)?t.decimals:1,default_wind_speed:Number.isFinite(t.default_wind_speed)?t.default_wind_speed:0,show_overlay:!1!==t.show_overlay}}get _name(){return this._config?.name??""}get _temperature(){return this._config?.temperature??""}get _humidity(){return this._config?.humidity??""}get _windspeed(){return this._config?.windspeed??""}get _decimals(){return Number.isFinite(this._config?.decimals)?this._config.decimals:1}get _defaultWind(){return Number.isFinite(this._config?.default_wind_speed)?this._config.default_wind_speed:0}get _showOverlay(){return!1!==this._config?.show_overlay}render(){return this.hass?z`
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
          <div><label>Show overlay</label></div>
          <ha-switch
            .checked=${this._showOverlay}
            @change=${t=>this._update("show_overlay",t.target.checked)}
          ></ha-switch>
        </div>
      </div>
    `:z``}_update(t,e){const i={...this._config??{}};""===e||null==e?delete i[t]:i[t]=e,this._config=i,((t,e,i,s)=>{const r=new Event(e,{bubbles:s?.bubbles??!0,cancelable:s?.cancelable??!1,composed:s?.composed??!0});r.detail=i,t.dispatchEvent(r)})(this,"config-changed",{config:i})}_updateNumber(t,e,i=0){const s=""===e?void 0:Number(e),r=Number.isFinite(s)?s:i;this._update(t,r)}}function ht(t){return Object.entries(t).map(([t,e])=>`${t}: ${e}`).join("; ")}customElements.define("simple-air-comfort-card-editor",lt);
//# sourceMappingURL=simple-air-comfort-card.js.map
