# Create Inferno design assets: JSON palette, HTML, CSS, and README.

palette_json = {
    "name": "Inferno UI Core Palette",
    "version": "1.0.0",
    "tokens": {
        "core_blue": {"hex": "#00A7FF", "rgb": [0,167,255], "role": "primary"},
        "electric_cyan": {"hex": "#00D6FF", "rgb": [0,214,255], "role": "accent"},
        "deep_blue": {"hex": "#003A7C", "rgb": [0,58,124], "role": "depth"},
        "ember": {"hex": "#FF6A2E", "rgb": [255,106,46], "role": "alert/flare"},
        "ash": {"hex": "#B7BDC6", "rgb": [183,189,198], "role": "secondary text"},
        "night": {"hex": "#060608", "rgb": [6,6,8], "role": "background"},
        "teal": {"hex": "#00BFB3", "rgb": [0,191,179], "role": "calm/accent"}
    },
    "gradient_background": {
        "type": "linear",
        "angle_deg": 160,
        "stops": [
            {"color": "#060608", "pos": 0},
            {"color": "#003A7C", "pos": 0.45},
            {"color": "#00A7FF", "pos": 1.0}
        ]
    },
    "typography": {
        "heading": {"preferred": ["Orbitron","Rajdhani","system-ui","sans-serif"]},
        "body": {"preferred": ["Manrope","Open Sans","system-ui","sans-serif"]}
    }
}

import json, textwrap, os, pathlib

out_dir = "/mnt/data/inferno_ui_assets"
os.makedirs(out_dir, exist_ok=True)

with open(os.path.join(out_dir, "inferno_palette.json"), "w") as f:
    json.dump(palette_json, f, indent=2)

# CSS
css = textwrap.dedent("""
/* Inferno UI Styles v1.0.0 */
:root{
  --core-blue:#00A7FF;
  --electric-cyan:#00D6FF;
  --deep-blue:#003A7C;
  --ember:#FF6A2E;
  --ash:#B7BDC6;
  --night:#060608;
  --teal:#00BFB3;
}

@keyframes breathe {
  0% { filter: brightness(1); }
  50% { filter: brightness(1.15); }
  100% { filter: brightness(1); }
}
@keyframes emberPulse{
  0%{ box-shadow:0 0 0px var(--ember); }
  50%{ box-shadow:0 0 14px var(--ember); }
  100%{ box-shadow:0 0 0px var(--ember); }
}

*{ box-sizing:border-box; }

html,body{
  height:100%;
}
body{
  margin:0;
  color:var(--ash);
  background: radial-gradient(1000px 600px at 50% 10%, rgba(255,106,46,.15), transparent 40%),
              linear-gradient(160deg, var(--night) 0%, var(--deep-blue) 45%, var(--core-blue) 100%);
  font-family: Manrope, "Open Sans", system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif;
  animation: breathe 9s ease-in-out infinite;
}

.wrap{
  max-width:1000px;
  margin:0 auto;
  padding:48px 24px 64px;
}

.header{
  text-align:center;
  margin-top:24px;
}

.title{
  font-family: Orbitron, Rajdhani, system-ui, sans-serif;
  font-weight:700;
  letter-spacing:.25rem;
  font-size:64px;
  margin:0;
  color:var(--core-blue);
  text-shadow: 0 0 8px rgba(0,167,255,.35), 0 0 30px rgba(0,167,255,.2);
}

.hr-ember{
  width:380px;
  height:2px;
  background: linear-gradient(90deg, transparent, var(--ember), transparent);
  margin:10px auto 14px;
  border:none;
}

.subtitle{
  font-weight:600;
  color:#cfd6de;
  letter-spacing:.35rem;
  font-size:14px;
  text-transform:uppercase;
  opacity:.9;
}

.tagline{
  margin-top:8px;
  color:#cfd6de;
  font-size:20px;
}

.centerpiece{
  display:flex;
  align-items:center;
  justify-content:center;
  margin:48px auto 24px;
  width:280px;
  height:280px;
  border-radius:50%;
  border:1px solid rgba(79,195,255,.25);
  background: radial-gradient(120px 120px at 50% 60%, rgba(255,106,46,.15), transparent 70%);
  box-shadow: inset 0 0 40px rgba(79,195,255,.15), 0 0 40px rgba(0,167,255,.15);
}

.flame{
  width:120px;
  height:160px;
  filter: drop-shadow(0 0 10px rgba(255,106,46,.6));
  animation: emberPulse 3.5s ease-in-out infinite;
}

/* Actions */
.actions{
  display:flex;
  justify-content:center;
  gap:56px;
  margin:8px 0 40px;
}
.action{
  text-align:center;
  color:var(--ash);
  font-size:16px;
  opacity:.9;
}
.icon{
  display:flex;
  align-items:center;
  justify-content:center;
  width:56px;
  height:56px;
  border-radius:14px;
  border:1px solid rgba(255,106,46,.4);
  background: rgba(255,106,46,.08);
  margin:0 auto 10px;
  transition: transform .2s ease, box-shadow .2s ease;
}
.icon:hover{ transform: translateY(-2px); box-shadow: 0 6px 22px rgba(255,106,46,.25); }

/* Initialize panel */
.panel{
  width:min(760px, 95%);
  margin:0 auto;
  padding:24px;
  border:1px solid rgba(79,195,255,.35);
  border-radius:14px;
  background: linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.25));
  box-shadow: 0 0 24px rgba(0,167,255,.15);
  backdrop-filter: blur(3px);
}
.panel h2{
  margin:0 0 6px;
  font-family: Orbitron, Rajdhani, system-ui, sans-serif;
  color:var(--core-blue);
  font-weight:700;
  letter-spacing:.1rem;
}
.label{
  margin-top:8px;
  font-size:14px;
  color:#9fb2c2;
  text-transform:uppercase;
  letter-spacing:.08rem;
}

.input-row{
  margin-top:10px;
  display:flex;
  gap:12px;
}
.input{
  flex:1;
  padding:14px 16px;
  border-radius:10px;
  border:1px solid rgba(255,106,46,.6);
  background: rgba(0,0,0,.35);
  color:#e8f4ff;
  outline:none;
}
.input:focus{ border-color: var(--electric-cyan); box-shadow: 0 0 0 2px rgba(0,214,255,.25); }

.btn{
  padding:14px 18px;
  border-radius:10px;
  border:1px solid rgba(79,195,255,.4);
  background: linear-gradient(180deg, #2a63b8 0%, #174177 70%, #123155 100%);
  color:#d8eeff;
  font-weight:700;
  letter-spacing:.05rem;
  cursor:pointer;
  transition: transform .2s ease, filter .2s ease;
  display:flex;
  align-items:center;
  gap:8px;
}
.btn:hover{ filter: brightness(1.1); transform: translateY(-1px); }
.btn .dot{ width:10px; height:10px; background: var(--electric-cyan); border-radius:50%; box-shadow: 0 0 12px var(--electric-cyan); }

.footer{
  margin-top:10px;
  font-size:12px;
  color:#9fb2c2;
  text-align:center;
}
""")

with open(os.path.join(out_dir, "inferno_styles.css"), "w") as f:
    f.write(css)

# HTML with inline SVG icons
html = textwrap.dedent("""
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Inferno – Trauma-Aware AI Platform</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700&family=Orbitron:wght@600;700;800&family=Rajdhani:wght@600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="inferno_styles.css">
</head>
<body>
  <div class="wrap">
    <header class="header">
      <h1 class="title">INFERNO</h1>
      <div class="hr-ember"></div>
      <div class="subtitle">TRAUMA-AWARE AI PLATFORM</div>
      <p class="tagline">Out of the fire, we remember who we are.</p>
    </header>

    <section class="centerpiece">
      <!-- Flame motif -->
      <svg class="flame" viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#FFA56F"/>
            <stop offset="60%" stop-color="#FF6A2E"/>
            <stop offset="100%" stop-color="#B63F1A"/>
          </linearGradient>
        </defs>
        <path d="M60 8 C75 28, 90 46, 86 68 C83 84, 65 92, 68 110 C70 122, 81 128, 84 140 C82 148, 74 152, 60 152 C40 152, 30 144, 30 130 C32 114, 48 104, 50 88 C52 72, 32 60, 36 40 C40 24, 51 16, 60 8Z" fill="url(#g1)" />
        <path d="M55 68 C64 80, 64 92, 58 108 C54 118, 48 124, 48 132 C48 140, 58 144, 60 144" fill="none" stroke="#FF9A63" stroke-width="2" opacity=".5"/>
      </svg>
    </section>

    <div class="actions">
      <div class="action">
        <div class="icon" title="Ground">
          <!-- hand icon -->
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF6A2E" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12v-2a1 1 0 0 1 2 0v2h1V7a1 1 0 1 1 2 0v5h1V6a1 1 0 1 1 2 0v6h1V8a1 1 0 1 1 2 0v6.2c0 2.65-2.15 4.8-4.8 4.8H9.5C7.57 19 6 17.43 6 15.5V12z"/>
          </svg>
        </div>
        Ground
      </div>
      <div class="action">
        <div class="icon" title="Reflect">
          <!-- head/silhouette icon -->
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF6A2E" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3c4.42 0 8 3.03 8 7 0 2.52-1.46 4.64-3.64 5.9l.86 2.6H9.9l.5-2.3C8.16 15.63 6 13.53 6 10c0-3.97 3.58-7 8-7z"/>
          </svg>
        </div>
        Reflect
      </div>
    </div>

    <section class="panel">
      <h2>Initialize System</h2>
      <div class="label">User Identification</div>
      <div class="input-row">
        <input class="input" placeholder="Enter your name" />
        <button class="btn"><span class="dot"></span> Initialize</button>
      </div>
      <div class="footer">AlphaVox Family • Inferno Module</div>
    </section>
  </div>
</body>
</html>
""")

with open(os.path.join(out_dir, "inferno_ui.html"), "w") as f:
    f.write(html)

readme = textwrap.dedent("""
# Inferno UI — Hand-off Pack

Files:
- `inferno_palette.json` — color tokens and typography references.
- `inferno_styles.css` — CSS variables, gradients, glow, breathing animations.
- `inferno_ui.html` — static splash/login mock that matches the approved concept.

How to use:
1. Open `inferno_ui.html` in a browser to preview.
2. Import `inferno_palette.json` into your design system or convert variables to Tailwind tokens.
3. Copy CSS variables from `:root` into your app/theme to keep colors consistent across AlphaVox family modules.

Notes:
- Primary blue `#00A7FF` and ember `#FF6A2E` should never be used together as 50/50 surfaces — keep ember for highlights and state changes.
- The breathing animation should remain subtle (cycle ~9s) to avoid agitation for PTSD contexts.
- Button/input contrast meets WCAG AA on the dark background; keep glow restrained in production.

— Prepared for Everett Christman (Luma Cognify / Christman AI Project)
""")

with open(os.path.join(out_dir, "README.txt"), "w") as f:
    f.write(readme)

out_dir
