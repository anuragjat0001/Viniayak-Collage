# 🏛️ Vinayak PG College — Super Premium 3D Website

> **"Shaping Leaders Since 2005"**  
> A luxurious, fully interactive 3D clone of Vinayak PG College, Chomu, Jaipur  
> Affiliated to University of Rajasthan

---

## 🚀 Live Preview

Open `index.html` directly in any modern browser — **no build tools, no server required.**

```
vinayak-pg-college-3d-clone/
├── index.html          ← Main entry point (open this)
├── css/
│   └── style.css       ← Full custom styles
├── js/
│   ├── main.js         ← Loader, nav, particles, utilities
│   ├── three-scene.js  ← 3D campus building + floating objects
│   └── animations.js   ← GSAP scroll animations
├── assets/             ← (placeholder for future images)
└── README.md           ← This file
```

---

## ✨ Features

### 3D & Visual
- **Interactive 3D Campus** – Full college building rendered in Three.js r128 with:
  - Main block, left/right wings, columns, windows, entrance arch
  - Flagpole with animated waving flag
  - Trees, lawn, ground with shadow mapping
- **Floating 3D Objects** – Graduation caps, open books, lab beakers, basketballs, geometric orbs — all gently bobbing and rotating
- **Mouse-drag orbit** – Drag the hero to rotate the campus 360°
- **Auto slow rotation** – Camera slowly orbits when idle
- **Particle system** – 400+ gold/emerald/white 3D star particles drifting through the scene
- **2D Particle overlay** – Subtle floating dust particles on HTML canvas

### Design
- **Dark Luxury Theme** – Navy (#0a1428) + Gold (#d4af77 / #f5c469) + Emerald (#10b981)
- **Glassmorphism** – Frosted glass cards throughout
- **Cinzel + Raleway + Playfair Display** – Elegant typographic hierarchy
- **Custom scrollbar** – Gold-accented thin scrollbar

### Animations (GSAP)
- **Loading screen** – Animated crest rings with progress bar
- **Hero entrance** – Staggered reveal of title, tagline, buttons, stats
- **Counter animation** – Stats count up on reveal (2005, 5000+, 15+)
- **Scroll triggers** – Section reveals (up/left/right) using IntersectionObserver
- **ScrollTrigger** – Course cards, facility cards, admission steps all stagger in
- **Parallax glows** – Background glow orbs move at different scroll speeds
- **Active nav links** – Gold highlight follows scroll position
- **3D card tilt** – Subtle perspective tilt on hover (desktop)
- **Cursor glow** – Soft gold radial follow cursor (desktop)

### Sections
1. **Home / Hero** – 3D campus + animated headline + CTA + stats
2. **About the College** – SVG campus illustration + key facts
3. **Chairman's Message** – Dual message cards (Chairman + Principal)
4. **Courses** – BA, BSc, BCom (UG) + MA, MSc (PG) with programme tags
5. **Facilities** – 6 facility cards: Lab, Sports, Hall, Classrooms, Library, Computer Lab
6. **Online Admission** – 4-step process + eligibility cards + key dates
7. **Contact Us** – Contact details + enquiry form with validation
8. **Footer** – Full links, contact, affiliation info

---

## 📱 Mobile Responsive

- Hamburger menu with smooth slide animation
- Single-column layouts on small screens
- Floating "Apply Now" button on mobile (bottom right)
- Touch-based 3D camera orbit on hero canvas
- Font sizes scale with `clamp()` for fluid typography

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| HTML5 | — | Structure & semantics |
| Tailwind CSS | via CDN | Utility-first styling |
| Three.js | r128 (CDN) | 3D scene rendering |
| GSAP | 3.12.5 (CDN) | Animations & ScrollTrigger |
| Google Fonts | Cinzel, Raleway, Playfair Display | Typography |

**Zero dependencies to install. Zero build tools needed.**

---

## 📂 How to Create the ZIP File

### Method 1: Windows
1. Navigate to the `vinayak-pg-college-3d-clone/` folder
2. Select all files: `Ctrl + A`
3. Right-click → **Send to** → **Compressed (zipped) folder**
4. Rename to `vinayak-pg-college-3d-clone.zip`

### Method 2: macOS
1. Navigate to the project folder in Finder
2. Right-click the `vinayak-pg-college-3d-clone/` folder
3. Select **Compress "vinayak-pg-college-3d-clone"**
4. The `.zip` file appears in the same directory

### Method 3: Linux / Terminal
```bash
cd /path/to/parent-folder
zip -r vinayak-pg-college-3d-clone.zip vinayak-pg-college-3d-clone/
```

---

## ⚡ Quick Start

```bash
# If you have Python installed (for a local server):
cd vinayak-pg-college-3d-clone
python -m http.server 8080
# Then open: http://localhost:8080

# OR — simply open index.html directly in Chrome/Firefox/Edge
```

> **Note:** The website works fully offline. All CDN links load external libraries (Three.js, GSAP, Tailwind, Google Fonts). An internet connection is required for first load to cache these; after that it works offline.

---

## 🌐 College Contact Information

| | |
|---|---|
| **College** | Vinayak PG College, Chomu, Jaipur |
| **Tagline** | Shaping Leaders Since 2005 |
| **Affiliation** | University of Rajasthan, Jaipur |
| **Phone** | +91 94142 47984 |
| **Email** | vinayakgroup2003@gmail.com |
| **Programmes** | BA, BSc, BCom (UG) · MA, MSc (PG) |

---

## 🔧 Customisation Guide

### Change College Name / Content
Edit `index.html` — all content is in plain HTML and clearly commented.

### Change Colors
Edit `css/style.css` — CSS variables are defined at the top:
```css
:root {
  --gold:      #d4af77;
  --gold-bright:#f5c469;
  --emerald:   #10b981;
  --navy:      #0a1428;
}
```

### Change 3D Scene
Edit `js/three-scene.js` — the building geometry is built using Three.js primitives. 
Key sections:
- `// ── Main building body ──` — adjust building dimensions
- `// ── Floating Objects ──` — add/remove floating items
- `// LIGHTING` — adjust light colours and intensity

### Add Real Photos
Replace SVG illustrations with `<img>` tags pointing to real campus photos:
```html
<img src="assets/campus-front.jpg" alt="Vinayak PG College Campus" class="w-full h-full object-cover rounded-xl" />
```

---

## 📄 License

© 2025 Vinayak PG College, Chomu, Jaipur. All rights reserved.  
Website built for educational and institutional purposes.
