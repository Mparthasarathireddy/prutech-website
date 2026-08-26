# PruTech Website (Dolby-style)

A cinematic single-page site for PruTech Solutions, inspired by dolby.com and
branded with PruTech's navy + orange identity. Built as static HTML/CSS/JS — no
build step, no dependencies.

## Structure
```
index.html        # markup
css/styles.css     # theme + layout + responsive
js/main.js         # particle hero, live-typing Apex code, terminal, scroll reveals
```

## Run it locally (VS Code)

**Option A — Live Server extension (easiest)**
1. Open this folder in VS Code.
2. Install the "Live Server" extension (Ritwick Dey).
3. Right-click `index.html` → **Open with Live Server**.
4. It opens at `http://127.0.0.1:5500`.

**Option B — Python**
```bash
python -m http.server 8000
# then open http://localhost:8000
```

**Option C — Node**
```bash
npx serve .
```

## Notes / next steps
- The hero "video" is a self-built animation (particle network + live-typing
  Apex code + a deploy terminal) — no external files, so it loads instantly.
- Swap `Pru`/`Tech` text logo for the real SVG when you want.
- All sections (Services, Salesforce showcase, Process, Case Study, Contact)
  map to the real prutech.com content.
- Easy to extend into multi-page (Services/About/Contact) — just ask.
