import { css } from 'lit';

export const cardStyles = css`
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
      position:absolute; inset:0; border-radius:50%; border-style: solid; border-color: #fff; border-width: max(1.5px, calc(var(--sac-scale, 1) * var(--sac-ring-border-base, 2.5px)));
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

    /* ------------------------------------------------------
     * Temperature-tinted icon puck
     * - Paint order target: ABOVE host bg, BELOW all content
     * - Achieved via z-index:-1 and being a child of .ratio
     * ------------------------------------------------------ */
    .icon-puck{
      position:absolute;
      left:10%;
      top:50%;
      width:50%;
      transform: translate(-50%, -50%) scale(0.8);
      aspect-ratio: 1 / 1;
      border-radius:50%;
      /* default is overwritten at render with the temp-based gradient */
      background: radial-gradient(circle, rgba(255,215,0,0.5) 0%, rgba(0,0,0,0) 78%);
      display:flex; align-items:center; justify-content:center;
      pointer-events:none;
      /* host bg → z<0 → z=0 → z>0; keep this beneath all content */
      z-index:-1;
    }
    .icon-puck ha-icon{
      --mdc-icon-size: calc(var(--sac-scale,1) * 60px);
      color: rgba(255,255,255,0.5);
      filter: drop-shadow(0 1px 2px rgba(0,0,0,.45));
    }
  `;
