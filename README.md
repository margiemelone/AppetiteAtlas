# Appetite Atlas

Web application for **Appetite Atlas LLC** — a digital eating-behavior assessment for adults taking GLP-1 medications. The assessment combines validated instruments (TFEQ-R21 and RED-9) to generate a research-grounded eating phenotype, with educational interpretation tailored to the GLP-1 patient experience.

Live at **[appetiteatlas.health](https://appetiteatlas.health)**.

Built with React + Vite, deployed on Vercel, DNS managed through Cloudflare.

---

## Project structure

```
appetiteatlas/
├── index.html              # HTML entry point + page metadata
├── package.json            # Dependencies & build scripts
├── vite.config.js          # Build configuration
├── src/
│   ├── App.jsx             # Main application — marketing site + assessment
│   ├── main.jsx            # React entry point
│   └── founder.jpg         # Founder photo (About section)
└── README.md               # This file
```

The entire site lives in `src/App.jsx`. It contains:

- The marketing site (Hero, Gap, Approach, Assessment, About, Waitlist, Footer)
- The assessment flow (Context → Satisfaction → TFEQ → RED-9 → Demographics → Results)
- Seven eating-phenotype interpretations (Homeostatic, Cognitive Restrainer, Effortful Restrainer, Emotional Eater, Reward-Driven Eater, Multi-Driver, Mixed)
- The post-results behavioral consultation CTA

Brand and copy constants are at the top of `App.jsx`:

| Constant         | Where it lives in the file    | What it controls                          |
|------------------|--------------------------------|-------------------------------------------|
| `BRAND_NAME`     | Line ~38                       | Brand name everywhere on the site         |
| `FOUNDER_NAME`   | Line ~39                       | Founder name (About section, consultation)|
| `CONTACT_EMAIL`  | Line ~40                       | Email used in mailto links                |

## Deployment

This project is deployed automatically by Vercel. Any commit to the `main` branch triggers a rebuild and redeploy within ~60 seconds.

### Updating content

1. Open `src/App.jsx` on GitHub
2. Click the pencil icon to edit
3. Make your changes
4. Scroll down → "Commit changes"
5. Wait ~60 seconds → refresh appetiteatlas.health (incognito)

### Updating the founder photo

Replace `src/founder.jpg` with a new image of the same name. The code references the filename, so as long as the new file is named `founder.jpg`, no code change is needed.

## Local development

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Production build

```bash
npm run build
```

Vercel runs this automatically on every commit.

---

## Legal & compliance notes

- The TFEQ-R21 and RED-9 items in the codebase are placeholder approximations of validated wording. A prototype banner is displayed across all assessment screens for academic honesty. Replace with verified item wording from the licensors before any paid release.
- The post-results consultation tier is positioned as a *behavioral consultation* — educational, not nutrition counseling or medical nutrition therapy. The wording in the consultation card was drafted to stay clear of NJ's Dietitian/Nutritionist Licensing Act. Do not change this language without a licensed healthcare-attorney review.
- Appetite Atlas LLC is registered in New Jersey. Sole member: Margaret Melone, PhD.
- "Appetite Atlas™" is used as a common-law trademark on the site. USPTO registration not yet filed.
