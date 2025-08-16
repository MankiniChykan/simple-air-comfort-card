/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(s,t,i)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:o,defineProperty:h,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:c,getPrototypeOf:m}=Object,u=globalThis,p=u.trustedTypes,_=p?p.emptyScript:"",g=u.reactiveElementPolyfillSupport,f=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!o(t,e),v={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&h(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);n?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=m(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...d(t),...c(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),n=t.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:$).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=s;const r=n.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,n=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??b)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[f("elementProperties")]=new Map,y[f("finalized")]=new Map,g?.({ReactiveElement:y}),(u.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,x=w.trustedTypes,A=x?x.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,S="?"+N,C=`<${S}>`,F=document,M=()=>F.createComment(""),k=t=>null===t||"object"!=typeof t&&"function"!=typeof t,P=Array.isArray,T="[ \t\n\f\r]",O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,H=/>/g,R=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,L=/"/g,B=/^(?:script|style|textarea|title)$/i,z=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),I=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),W=new WeakMap,q=F.createTreeWalker(F,129);function V(t,e){if(!P(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const Y=(t,e)=>{const i=t.length-1,s=[];let n,r=2===e?"<svg>":3===e?"<math>":"",a=O;for(let e=0;e<i;e++){const i=t[e];let o,h,l=-1,d=0;for(;d<i.length&&(a.lastIndex=d,h=a.exec(i),null!==h);)d=a.lastIndex,a===O?"!--"===h[1]?a=U:void 0!==h[1]?a=H:void 0!==h[2]?(B.test(h[2])&&(n=RegExp("</"+h[2],"g")),a=R):void 0!==h[3]&&(a=R):a===R?">"===h[0]?(a=n??O,l=-1):void 0===h[1]?l=-2:(l=a.lastIndex-h[2].length,o=h[1],a=void 0===h[3]?R:'"'===h[3]?L:D):a===L||a===D?a=R:a===U||a===H?a=O:(a=R,n=void 0);const c=a===R&&t[e+1].startsWith("/>")?" ":"";r+=a===O?i+C:l>=0?(s.push(o),i.slice(0,l)+E+i.slice(l)+N+c):i+N+(-2===l?e:c)}return[V(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class G{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const a=t.length-1,o=this.parts,[h,l]=Y(t,e);if(this.el=G.createElement(h,i),q.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=q.nextNode())&&o.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=l[r++],i=s.getAttribute(t).split(N),a=/([.?@])?(.*)/.exec(e);o.push({type:1,index:n,name:a[2],strings:i,ctor:"."===a[1]?X:"?"===a[1]?tt:"@"===a[1]?et:Q}),s.removeAttribute(t)}else t.startsWith(N)&&(o.push({type:6,index:n}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(N),e=t.length-1;if(e>0){s.textContent=x?x.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],M()),q.nextNode(),o.push({type:2,index:++n});s.append(t[e],M())}}}else if(8===s.nodeType)if(s.data===S)o.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(N,t+1));)o.push({type:7,index:n}),t+=N.length-1}n++}}static createElement(t,e){const i=F.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,s){if(e===I)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const r=k(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=J(t,n._$AS(t,e.values),n,s)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??F).importNode(e,!0);q.currentNode=s;let n=q.nextNode(),r=0,a=0,o=i[0];for(;void 0!==o;){if(r===o.index){let e;2===o.type?e=new Z(n,n.nextSibling,this,t):1===o.type?e=new o.ctor(n,o.name,o.strings,this,t):6===o.type&&(e=new it(n,this,t)),this._$AV.push(e),o=i[++a]}r!==o?.index&&(n=q.nextNode(),r++)}return q.currentNode=F,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),k(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==I&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>P(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==j&&k(this._$AH)?this._$AA.nextSibling.data=t:this.T(F.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(V(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new K(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new G(t)),e}k(t){P(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new Z(this.O(M()),this.O(M()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(void 0===n)t=J(this,t,e,0),r=!k(t)||t!==this._$AH&&t!==I,r&&(this._$AH=t);else{const s=t;let a,o;for(t=n[0],a=0;a<n.length-1;a++)o=J(this,s[i+a],e,a),o===I&&(o=this._$AH[a]),r||=!k(o)||o!==this._$AH[a],o===j?t=j:t!==j&&(t+=(o??"")+n[a+1]),this._$AH[a]=o}r&&!s&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class X extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}class tt extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==j)}}class et extends Q{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??j)===I)return;const i=this._$AH,s=t===j&&i!==j||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==j&&(i===j||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const st=w.litHtmlPolyfillSupport;st?.(G,Z),(w.litHtmlVersions??=[]).push("3.3.1");const nt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class rt extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new Z(e.insertBefore(M(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}}rt._$litElement$=!0,rt.finalized=!0,nt.litElementHydrateSupport?.({LitElement:rt});const at=nt.litElementPolyfillSupport;at?.({LitElement:rt}),(nt.litElementVersions??=[]).push("4.2.1");class ot extends rt{static properties={hass:{type:Object},_config:{state:!0}};static styles=r`
    ha-card {
      position: relative;
      padding: 12px 12px 14px;
      overflow: hidden;
    }

    /* Maintain a square canvas for the graphic so percentages match your YAML layout */
    .canvas {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      /* Background = temperature color mapping (matches your comfort bands) */
      background: var(--sac-temp-bg, #2a2a2a);
      border-radius: 8px;
    }

    /* Title + subtitle row */
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

    /* The four text corners (TL/TR/BL/BR), using your picture-element style placements */
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
    .tl { left: 8%; top: 18%; transform: translate(-0%, -50%); text-align: left; }
    .tr { right: 8%; top: 18%; transform: translate(0%, -50%); text-align: right; }
    .bl { left: 8%; bottom: 8%; transform: translate(0%, 0%); text-align: left; }
    .br { right: 8%; bottom: 8%; transform: translate(0%, 0%); text-align: right; }

    /* Right-side graphic group (matches your YAML proportions) */
    .graphic {
      position: absolute;
      top: 50%;
      right: 4.5%;
      transform: translate(0, -50%);
      width: 45%;
      height: 45%;
      min-width: 120px; /* keep it visible on small cards */
      min-height: 120px;
    }

    /* Outer ring: white border + dewpoint gradient fill (your ring macro colors) */
    .outer-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2.5px solid white;
      background: var(--sac-dewpoint-ring, radial-gradient(circle, dimgray, 55%, rgba(100,100,100,0.15), rgba(100,100,100,0.15)));
    }

    /* Inner comfort circle: black base + humidity/temperature gradient per your macro */
    .inner-circle {
      position: absolute;
      /* From your YAML: inner ~21% within a 45% ring -> centered circle sized ~21% of canvas. */
      /* We’ll center it within the outer ring using 50% and translate. */
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

    /* Floating dot and its blink aura when outside limits */
    .dot {
      position: absolute;
      width: 15%;
      height: 15%;
      border-radius: 50%;
      background: white;
      box-shadow: 0 0 6px rgba(0,0,0,0.45);
      transform: translate(-50%, 50%); /* Match your macro’s translate */
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
      0% { opacity: 1; }
      100% { opacity: 0.3; }
    }
  `;setConfig(t){if(!t||!t.temperature||!t.humidity)throw new Error('simple-air-comfort-card: "temperature" and "humidity" entities are required.');this._config={name:t.name??"Air Comfort",temperature:t.temperature,humidity:t.humidity,windspeed:t.windspeed,decimals:Number.isFinite(t.decimals)?t.decimals:1,default_wind_speed:Number.isFinite(t.default_wind_speed)?t.default_wind_speed:0,temp_min:Number.isFinite(t.temp_min)?t.temp_min:15,temp_max:Number.isFinite(t.temp_max)?t.temp_max:35,temp_min_warning:Number.isFinite(t.temp_min_warning)?t.temp_min_warning:18,temp_max_warning:Number.isFinite(t.temp_max_warning)?t.temp_max_warning:26.4,humidity_min:Number.isFinite(t.humidity_min)?t.humidity_min:40,humidity_max:Number.isFinite(t.humidity_max)?t.humidity_max:60}}render(){if(!this.hass||!this._config)return z``;const t=this.hass.states[this._config.temperature],e=this.hass.states[this._config.humidity],i=this._config.windspeed?this.hass.states[this._config.windspeed]:void 0;if(!t||!e)return z`<ha-card>
        <div class="canvas"></div>
        <div style="padding: 8px; color: var(--primary-text-color)">Missing entity:
          ${t?this._config.humidity:this._config.temperature}</div>
      </ha-card>`;const s=(t.attributes.unit_of_measurement||"°C").trim(),n=this.#t(parseFloat(t.state),s),r=this.#e(parseFloat(e.state)),a=this.#i(i,this._config.default_wind_speed),o=r/100*this.#s(n),h=this.#n(o),l=this.#r(n,o,a),d=this.#a(h),c=this.#o(n),m=this.#h(r),u=this.#l(d),p=this.#d(r,n),_=this.#c(n),{leftPct:g,bottomPct:f,outsideLimits:$}=this.#m(n,r,this._config.temp_min,this._config.temp_max,this._config.temp_min_warning,this._config.temp_max_warning,this._config.humidity_min,this._config.humidity_max),b=this._config.decimals,v=this.#u(this.#p(h,s),b),y=this.#u(this.#p(l,s),b);return z`
      <ha-card>
        <div class="canvas" style=${`\n      --sac-temp-bg: ${_};\n      --sac-dewpoint-ring: ${u};\n      --sac-inner-gradient: ${p};\n    `}>

          <!-- Title + subtitle (dewpoint comfort text) -->
          <div class="header">
            <div class="title">${this._config.name}</div>
            <div class="subtitle">${d}</div>
          </div>

          <!-- TL: Dew point -->
          <div class="corner tl">
            <span class="label">Dew point</span>
            <span class="value">${v} ${s}</span>
          </div>

          <!-- TR: Apparent temperature -->
          <div class="corner tr">
            <span class="label">Feels like</span>
            <span class="value">${y} ${s}</span>
          </div>

          <!-- BL: Temperature comfort text -->
          <div class="corner bl">
            <span class="label">Temperature</span>
            <span class="value">${c}</span>
          </div>

          <!-- BR: Humidity comfort text -->
          <div class="corner br">
            <span class="label">Humidity</span>
            <span class="value">${m}</span>
          </div>

          <!-- Right graphic: outer dewpoint ring + inner comfort circle + floating dot -->
          <div class="graphic">
            <div class="outer-ring"></div>
            <div class="inner-circle"></div>

            <!-- Floating dot -->
            <div
              class="dot ${$?"outside":""}"
              style="left:${g}%; bottom:${f}%;">
            </div>
          </div>
        </div>
      </ha-card>
    `}getCardSize(){return 3}#r(t,e,i){return t+.33*e-.7*i-4}#s(t){return Number.isFinite(t)?t>=0?6.1121*Math.exp(t/(257.14+t)*(18.678-t/234.5)):6.1115*Math.exp(t/(279.82+t)*(23.036-t/333.7)):NaN}#n(t){if(!Number.isFinite(t)||t<=0)return NaN;let e=-80,i=60,s=0;for(let n=0;n<60;n++){s=(e+i)/2;const n=this.#s(s);if(!Number.isFinite(n))break;if(n>t?i=s:e=s,Math.abs(i-e)<1e-4)break}return s}#a(t){return Number.isFinite(t)?t<5?"Very Dry":t<=10?"Dry":t<=12.79?"Pleasant":t<=15.49?"Comfortable":t<=18.39?"Sticky Humid":t<=21.19?"Muggy":t<=23.9?"Sweltering":"Stifling":"Unknown"}#o(t){return Number.isFinite(t)?t<3?"FROSTY":t<=4.99?"COLD":t<=8.99?"CHILLY":t<=13.99?"COOL":t<=18.99?"MILD":t<=23.99?"PERFECT":t<=27.99?"WARM":t<=34.99?"HOT":"BOILING":"N/A"}#h(t){return Number.isFinite(t)?t<40?"DRY":t<=60?"COMFY":"HUMID":"N/A"}#l(t){return`radial-gradient(circle, ${"Very Dry"===t?"deepskyblue":"Dry"===t?"mediumaquamarine":"Pleasant"===t?"limegreen":"Comfortable"===t?"yellowgreen":"Sticky Humid"===t?"yellow":"Muggy"===t?"gold":"Sweltering"===t?"orange":"Stifling"===t?"crimson":"dimgray"}, 55%, rgba(100,100,100,0.15), rgba(100,100,100,0.15))`}#d(t,e){let i="dimgray";Number.isFinite(t)&&(i=t>60||t<40?"hotpink":"black");let s="dimgray";return Number.isFinite(e)&&(s=e>26.5?"rgba(255, 69, 0, 0.8)":e>24&&e<=26.5||e>19&&e<=24?"dimgray":"rgba(0, 102, 255, 0.8)"),`radial-gradient(circle, ${i} 0%, black, ${s} 70%)`}#c(t){return Number.isFinite(t)?t<3?"linear-gradient(135deg,#001a4d,#003d99)":t<=4.99?"linear-gradient(135deg,#0a2a6b,#0f49a5)":t<=8.99?"linear-gradient(135deg,#0e4ba0,#1380d3)":t<=13.99?"linear-gradient(135deg,#1063b7,#16a0e0)":t<=18.99?"linear-gradient(135deg,#0f8a7a,#1fc0a5)":t<=23.99?"linear-gradient(135deg,#2aa84a,#85c638)":t<=27.99?"linear-gradient(135deg,#f0b323,#f76b1c)":t<=34.99?"linear-gradient(135deg,#ef4823,#e9290f)":"linear-gradient(135deg,#7a0000,#b00000)":"#333"}#m(t,e,i,s,n,r,a,o){const h=Number.isFinite(t),l=Number.isFinite(e),d=h?t:22,c=l?e:50,m=100*(Math.min(Math.max(d,i),s)-i)/(s-i),u=Math.min(Math.max(c,0),100)+.5,p=c<a||c>o||d<n||d>r||!l&&!h||!l&&h&&22===d||l&&!h&&50===c;return{leftPct:this.#_(u,1),bottomPct:this.#_(m,1),outsideLimits:p}}#t(t,e){if(!Number.isFinite(t))return NaN;return(e||"").toLowerCase().includes("f")?5/9*(t-32):t}#p(t,e){if(!Number.isFinite(t))return NaN;return(e||"").toLowerCase().includes("f")?9*t/5+32:t}#e(t){return Number.isFinite(t)?Math.min(100,Math.max(0,t)):NaN}#i(t,e){if(!t)return e??0;const i=parseFloat(t.state);if(!Number.isFinite(i))return e??0;const s=(t.attributes.unit_of_measurement||"m/s").toLowerCase();return s.includes("m/s")?i:s.includes("km/h")||s.includes("kph")?i/3.6:s.includes("mph")?.44704*i:s.includes("kn")?.514444*i:i}#_(t,e=1){if(!Number.isFinite(t))return NaN;const i=Math.pow(10,e);return Math.round(t*i)/i}#u(t,e=1){return Number.isFinite(t)?this.#_(t,e).toLocaleString(void 0,{minimumFractionDigits:e,maximumFractionDigits:e}):"—"}set hass(t){this._hass=t,this.requestUpdate()}get hass(){return this._hass}static getConfigElement(){return document.createElement("simple-air-comfort-card-editor")}static getStubConfig(){return{name:"Air Comfort",temperature:"sensor.temperature",humidity:"sensor.humidity",decimals:1,default_wind_speed:0,temp_min:15,temp_max:35,temp_min_warning:18,temp_max_warning:26.4,humidity_min:40,humidity_max:60}}}customElements.define("simple-air-comfort-card",ot),window.customCards=window.customCards||[],window.customCards.push({type:"simple-air-comfort-card",name:"Simple Air Comfort Card",description:"Australian BoM apparent temperature + dew point (Buck). Outer dewpoint ring, inner comfort circle, and moving dot.",preview:!0});class ht extends rt{static properties={hass:{type:Object},_config:{state:!0}};static styles=r`
    .form {
      display: grid;
      gap: 12px;
      padding: 8px 12px 16px;
    }
    .row {
      display: grid;
      grid-template-columns: 230px 1fr;
      gap: 12px;
      align-items: center;
    }
    .hint { opacity: 0.72; font-size: 0.9em; }
    ha-textfield { width: 100%; }
  `;setConfig(t){this._config={name:t.name??"Air Comfort",temperature:t.temperature,humidity:t.humidity,windspeed:t.windspeed,decimals:Number.isFinite(t.decimals)?t.decimals:1,default_wind_speed:Number.isFinite(t.default_wind_speed)?t.default_wind_speed:0,temp_min:Number.isFinite(t.temp_min)?t.temp_min:15,temp_max:Number.isFinite(t.temp_max)?t.temp_max:35,temp_min_warning:Number.isFinite(t.temp_min_warning)?t.temp_min_warning:18,temp_max_warning:Number.isFinite(t.temp_max_warning)?t.temp_max_warning:26.4,humidity_min:Number.isFinite(t.humidity_min)?t.humidity_min:40,humidity_max:Number.isFinite(t.humidity_max)?t.humidity_max:60}}get _name(){return this._config?.name??""}get _temperature(){return this._config?.temperature??""}get _humidity(){return this._config?.humidity??""}get _windspeed(){return this._config?.windspeed??""}get _decimals(){return Number.isFinite(this._config?.decimals)?this._config.decimals:1}get _defaultWind(){return Number.isFinite(this._config?.default_wind_speed)?this._config.default_wind_speed:0}get _tmin(){return Number.isFinite(this._config?.temp_min)?this._config.temp_min:15}get _tmax(){return Number.isFinite(this._config?.temp_max)?this._config.temp_max:35}get _twmin(){return Number.isFinite(this._config?.temp_min_warning)?this._config.temp_min_warning:18}get _twmax(){return Number.isFinite(this._config?.temp_max_warning)?this._config.temp_max_warning:26.4}get _hmin(){return Number.isFinite(this._config?.humidity_min)?this._config.humidity_min:40}get _hmax(){return Number.isFinite(this._config?.humidity_max)?this._config.humidity_max:60}render(){return this.hass?z`
      <div class="form">
        <div class="row">
          <div><label>Name</label></div>
          <ha-textfield
            .value=${this._name}
            @input=${t=>this._set("name",t.target.value)}
            placeholder="Air Comfort"
          ></ha-textfield>
        </div>

        <div class="row">
          <div><label>Temperature entity</label></div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._temperature}
            .includeDomains=${["sensor"]}
            @value-changed=${t=>this._set("temperature",t.detail.value)}
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="row">
          <div><label>Humidity entity</label></div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._humidity}
            .includeDomains=${["sensor"]}
            @value-changed=${t=>this._set("humidity",t.detail.value)}
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="row">
          <div>
            <label>Wind speed entity</label>
            <div class="hint">Optional. Used only in Apparent Temperature.</div>
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._windspeed}
            .includeDomains=${["sensor"]}
            @value-changed=${t=>this._set("windspeed",t.detail.value)}
            allow-custom-entity
            no-clear-text
          ></ha-entity-picker>
        </div>

        <div class="row">
          <div><label>Default wind speed (m/s)</label>
            <div class="hint">Used if no wind entity is set.</div>
          </div>
          <ha-textfield
            type="number" inputmode="decimal" step="0.1"
            .value=${String(this._defaultWind)}
            @input=${t=>this._setNum("default_wind_speed",t.target.value,0)}
          ></ha-textfield>
        </div>

        <div class="row">
          <div><label>Decimals</label></div>
          <ha-textfield
            type="number" step="1" min="0"
            .value=${String(this._decimals)}
            @input=${t=>this._setNum("decimals",t.target.value,1)}
          ></ha-textfield>
        </div>

        <div class="row">
          <div><label>Temp scale min / max (°C)</label>
            <div class="hint">Dot vertical mapping (bottom..top).</div>
          </div>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(this._tmin)}
            @input=${t=>this._setNum("temp_min",t.target.value,15)}
          ></ha-textfield>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(this._tmax)}
            @input=${t=>this._setNum("temp_max",t.target.value,35)}
          ></ha-textfield>
        </div>

        <div class="row">
          <div><label>Temp warning min / max (°C)</label>
            <div class="hint">Blink when outside.</div>
          </div>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(this._twmin)}
            @input=${t=>this._setNum("temp_min_warning",t.target.value,18)}
          ></ha-textfield>
          <ha-textfield
            type="number" step="0.1"
            .value=${String(this._twmax)}
            @input=${t=>this._setNum("temp_max_warning",t.target.value,26.4)}
          ></ha-textfield>
        </div>

        <div class="row">
          <div><label>Humidity range min / max (%)</label>
            <div class="hint">Blink when outside.</div>
          </div>
          <ha-textfield
            type="number" step="1"
            .value=${String(this._hmin)}
            @input=${t=>this._setNum("humidity_min",t.target.value,40)}
          ></ha-textfield>
          <ha-textfield
            type="number" step="1"
            .value=${String(this._hmax)}
            @input=${t=>this._setNum("humidity_max",t.target.value,60)}
          ></ha-textfield>
        </div>
      </div>
    `:z``}_set(t,e){const i={...this._config??{}};""===e||null==e?delete i[t]:i[t]=e,this._config=i,((t,e,i,s)=>{const n=new Event(e,{bubbles:s?.bubbles??!0,cancelable:s?.cancelable??!1,composed:s?.composed??!0});n.detail=i,t.dispatchEvent(n)})(this,"config-changed",{config:i})}_setNum(t,e,i){const s=""===e?void 0:Number(e);this._set(t,Number.isFinite(s)?s:i)}}customElements.define("simple-air-comfort-card-editor",ht);
//# sourceMappingURL=simple-air-comfort-card.js.map
