# Supernormal Kitchen

Sample website, demo only.

A static, responsive restaurant website with a deep burgundy and cream visual theme, built with plain HTML, CSS and JavaScript for GitHub Pages. No build step or backend is required. The preorder and breakfast bowl plan forms compose WhatsApp messages for the kitchen; they do not process payments or create automatic subscriptions. Preview with a local static server; the home page loads its specials with `fetch()` and will not load them from a `file://` URL.

The framed burgundy table still-life on the dining room back wall is a locally stored image sourced from [Unsplash by 360floralflaves](https://unsplash.com/photos/a-table-topped-with-plates-and-bowls-filled-with-food-M99r__RBNzE).

Business details are based on the Instagram screenshot in `ALL things/`. The 3D food sculpture and remaining images in `assets/images/hero/` are generated illustrations. The 14 branded product photographs in `assets/images/gallery/` came from the WhatsApp ZIP supplied in `ALL things/` and are used in the gallery, featured areas, and matching menu cards. The 29 regular menu items, seasonal Diwali box, and dedicated festival offers page in `menu.html` and `offers.html` were transcribed from the artifact screenshots added to `ALL things/` on 2026-10-30. Twenty-two matching product photos were extracted from those screenshots and appear behind their menu cards; items without a supplied photo remain text-only. Current dishes, prices, ingredients, service area, and availability should be confirmed with the kitchen before publishing.

## Interactive dining room

The home page introduces the brand and links to `room.html`, which is the separate interactive dining room. The room uses the Blender scene from `../outputs/olive-arch-bistro/luxury-restaurant.blend`, exported to `assets/models/olive-arch-bistro-room.glb`. The original Blender file remains in `outputs/olive-arch-bistro/`. Eight chef specials from `data/specials.json` sit on the centre table. Select a dish to see its details and order link. All eight specials use compact Blender-exported `.glb` models. Their file paths are defined in `data/specials.json`.

The room header keeps the brand at upper left, an Order button at upper right, and other page links in the expandable Explore menu. The two framed wall posters split all 29 dishes from `data/menu.json` into Menu I and Menu II. While standing, drag to view any part of the room and scroll to zoom; choose a chair (or use the keyboard chair choices) to sit at the table. From the seat, drag horizontally to rotate the centre table and view the specials through a full 360°; use **Get up** at lower left to stand and resume room viewing. Select either wall poster to move closer, switch with Menu I and Menu II, and use the plus and minus controls to zoom the poster. **All dishes** opens a searchable list of the same complete menu. The tabletop and its eight chef specials rotate slowly while the seated camera stays fixed. The page has a static room image fallback when WebGL is unavailable.

To preview locally, open this folder in VS Code and use Live Server, or run `python3 -m http.server 8000` in this directory and visit `http://localhost:8000/`. A local server is required for the JSON `fetch()` calls and ES modules. The room model is about 24 MB, so the first load may take a few seconds.

To add a chef special, add one object to `data/specials.json`, choose an unused table position, and add it to the order form if it can be preordered. To use another `.glb` dish, put it in `assets/models/` and set `modelPath` on its specials object. Regular menu dishes are edited in `data/menu.json`.

## Folder tree

```text
supernormal-kitchen/
├── ALL things/
│   ├── Screenshot_20261030_232437.png
│   ├── Screenshot_20261030_234421.png
│   ├── Screenshot_20261030_234439.png
│   ├── Screenshot_20261030_234450.png
│   ├── Screenshot_20261030_234458.png
│   ├── Screenshot_20261030_234511.png
│   ├── Screenshot_20261030_234520.png
│   ├── Screenshot_20261030_234530.png
│   ├── Screenshot_20261030_234538.png
│   ├── Screenshot_20261030_234545.png
│   ├── Screenshot_20261030_234552.png
│   ├── Screenshot_20261030_234558.png
│   ├── Screenshot_20261030_234606.png
│   ├── Screenshot_20261030_234612.png
│   ├── Screenshot_20261030_234619.png
│   └── WhatsApp Unknown 2026-10-30 at 11.49.57 PM.zip
├── assets/
│   ├── animations/
│   │   └── .gitkeep
│   ├── audio/
│   │   └── .gitkeep
│   ├── docs/
│   │   └── .gitkeep
│   ├── fonts/
│   │   └── .gitkeep
│   ├── hdri/
│   │   └── .gitkeep
│   ├── images/
│   │   ├── brand/
│   │   │   ├── .gitkeep
│   │   │   └── instagram-logo.png
│   │   ├── dishes/
│   │   │   ├── .gitkeep
│   │   │   ├── asian-crunch-paw-paw-salad.webp
│   │   │   ├── bang-bang-rice-bowl.webp
│   │   │   ├── berry-bliss-acai-bowl.webp
│   │   │   ├── cafe-noir-dessert-jar.webp
│   │   │   ├── cinnamon-cocoa-granola.webp
│   │   │   ├── diwali-box.webp
│   │   │   ├── hot-honey.webp
│   │   │   ├── lemon-pepper-chicken.webp
│   │   │   ├── mango-sticky-rice.webp
│   │   │   ├── matcha-pistachio-yoghurt-parfait.webp
│   │   │   ├── mocha-baked-oats.webp
│   │   │   ├── open-burrito-bowl.webp
│   │   │   ├── spiced-mutton-muse.webp
│   │   │   ├── spiced-mutton-muse-poster.webp
│   │   │   ├── summer-protein-pasta-bowl.webp
│   │   │   ├── supernormal-secret-dressing.webp
│   │   │   ├── tandoori-cottage-cheese-steak.webp
│   │   │   ├── the-morning-roast.webp
│   │   │   ├── the-peanut-snap.webp
│   │   │   ├── the-supernormal-larb.webp
│   │   │   ├── tropical-bowl.webp
│   │   │   ├── tropical-sunset-cup.webp
│   │   │   ├── velvet-cocoa-mousse.webp
│   │   │   └── zesty-avo-crunch.webp
│   │   ├── favicon/
│   │   │   └── .gitkeep
│   │   ├── gallery/
│   │   │   ├── .gitkeep
│   │   │   ├── bang-bang-rice-bowl.webp
│   │   │   ├── branded-carrot-jar.webp
│   │   │   ├── branded-mango-jar.webp
│   │   │   ├── branded-matcha-jar.webp
│   │   │   ├── cafe-noir-dessert-jar.webp
│   │   │   ├── cinnamon-cocoa-granola.webp
│   │   │   ├── lemon-pepper-chicken.webp
│   │   │   ├── matcha-pistachio-parfait.webp
│   │   │   ├── open-burrito-bowl.webp
│   │   │   ├── spiced-mutton-muse.webp
│   │   │   ├── supernormal-larb.webp
│   │   │   ├── the-morning-roast.webp
│   │   │   ├── tropical-bowl.webp
│   │   │   └── tropical-dessert-jar.webp
│   │   ├── hero/
│   │   │   ├── .gitkeep
│   │   │   ├── breakfast-jars.webp
│   │   │   ├── catering-spread.webp
│   │   │   ├── food-sculpture.webp
│   │   │   └── hero-bowl.webp
│   │   ├── icons/
│   │   │   └── .gitkeep
│   │   ├── og/
│   │   │   └── .gitkeep
│   │   ├── posters/
│   │   │   └── .gitkeep
│   │   └── team/
│   │       └── .gitkeep
│   ├── models/
│   │   ├── draco/
│   │   │   └── .gitkeep
│   │   ├── olive-arch-bistro-room.glb
│   │   ├── spiced-mutton-food-texture.png
│   │   ├── spiced-mutton-muse.blend
│   │   ├── spiced-mutton-muse.glb
│   │   └── spiced-mutton-muse-preview.webp
│   ├── shaders/
│   │   └── .gitkeep
│   ├── textures/
│   │   ├── .gitkeep
│   │   └── walnut-table.webp
│   └── video/
│       ├── .gitkeep
│       └── spiced-mutton-muse-table.mp4
├── css/
│   ├── base/
│   │   ├── reset.css
│   │   ├── typography.css
│   │   └── variables.css
│   ├── components/
│   │   ├── buttons.css
│   │   ├── footer.css
│   │   └── nav.css
│   ├── pages/
│   │   ├── .gitkeep
│   │   ├── home.css
│   │   ├── inner.css
│   │   └── theme.css
│   ├── home.css
│   ├── room.css
│   └── style.css
├── data/
│   ├── .gitkeep
│   ├── menu.json
│   └── specials.json
├── js/
│   ├── modules/
│   │   └── .gitkeep
│   ├── utils/
│   │   └── .gitkeep
│   ├── vendor/
│   │   └── .gitkeep
│   ├── scene.js
│   ├── specials.js
│   └── script.js
├── .editorconfig
├── .gitignore
├── .nojekyll
├── 404.html
├── about.html
├── contact.html
├── favicon.ico
├── gallery.html
├── index.html
├── menu.html
├── offers.html
├── order.html
├── privacy.html
├── README.md
├── reservations.html
├── robots.txt
├── site.webmanifest
├── sitemap.xml
├── terms.html
└── thank-you.html
```

## Source repository


## Public hosting

The restaurant website is published with GitHub Pages at https://weburon7.github.io/supernormal-kitchen/.
Source repository: https://github.com/weburon7/supernormal-kitchen

## SEO research and implementation — 2 November 2026

The preferred public site is **https://weburon7.github.io/supernormal-kitchen/**. All content pages use that origin for canonicals, sharing metadata and structured data. Navigation and asset paths remain relative for GitHub Pages.

### Evidence and decisions

This was qualitative public search research, not a search-volume or ranking study. No Keyword Planner, Search Console or private analytics data was available. Query groups included `Supernormal Kitchen Ludhiana`, `supernormal_kitchen`, `healthy bowls breakfast delivery Ludhiana`, `protein bowls Ludhiana`, and breakfast meal plan/catering variations.

- The supplied Instagram screenshot (`ALL things/Screenshot_20261030_232437.png`) confirms the brand name, Ludhiana, breakfast jars/protein bowls, delivery/pickup, events/catering, Instagram handle and WhatsApp number. The online Instagram profile could not be fetched by the research browser, so the supplied material remains the primary source for business facts.
- [D’KARVE Run Club](https://www.endorfin.run/clubs/dkarverunclub) lists Supernormal Kitchen as a healthy food partner in Ludhiana. This supports the local brand association, not an address, opening hours or nutrition claim.
- Local commercial pages use concrete food and service categories: [Shredfarmer’s menu](https://shredfarmer.com/menu/) presents rice bowls and salads, while [HealthyRizz](https://healthyrizz.in/) presents meal plans and delivery. This supports clear category wording in titles and visible copy. Competitors' nutrition figures, timings, prices and health claims were not transferred to this site.
- “Supernormal” can refer to the unrelated [Australian restaurant](https://supernormal.net.au/menu). Keeping **Supernormal Kitchen + Ludhiana** together helps distinguish the business. This is a qualitative inference from the search results, not a measured ranking claim.

| Page | Search intent and content focus |
| --- | --- |
| Home | Supernormal Kitchen Ludhiana; breakfast jars and protein bowls |
| Menu | Brand menu and listed prices; breakfast bowls, rice bowls, salads and desserts |
| Order | Meal preorders and breakfast bowl plan enquiries in Ludhiana |
| Events | Event catering in Ludhiana; date, guest count and menu enquiries |
| Contact | Brand WhatsApp/contact; delivery locality and pickup instructions |
| Gallery | Named dishes and real supplied food photography |
| Offers | Seasonal Diwali gift boxes and bulk gifting enquiries |
| About | Brand identity and Ludhiana services |
| Room | Virtual dining room and eight chef specials, rather than a physical dine-in claim |

### Implemented

- Distinct titles and descriptions for every page; indexable marketing pages; confirmation, error and legal pages retain `noindex, follow` and stay out of the sitemap.
- Self-referencing absolute canonicals; home canonical ends with `/`, other pages use their actual `.html` paths. Home navigation uses `./` to reduce duplicate home URLs.
- Open Graph and Twitter sharing metadata, using an unchanged supplied Open Burrito Bowl photo converted to JPEG. The brand logo is also exported as a usable favicon.
- Nine canonical URLs in the XML sitemap, with actual modification date. No fabricated priorities or publication schedules.
- Organization/WebSite/WebPage JSON-LD identifies the brand, Instagram, WhatsApp contact and Ludhiana service area. The menu has Menu/MenuSection/MenuItem data matching all 29 visible regular dishes. Only single, unambiguous listed prices become structured offers; no availability guarantees are supplied.
- The 3D room has eight static linked specials before JavaScript enhances them. The complete menu already renders in HTML, so its dishes do not depend on canvas or JavaScript for discovery.
- Visible local ordering questions explain delivery/pickup checks, WhatsApp preorder confirmation, breakfast plan enquiries and event catering. They are not marked up as FAQ rich results.
- Intrinsic image dimensions reduce layout movement; the home hero image is prioritized. Three.js remains exclusive to the room page.

[Google’s title guidance](https://developers.google.com/search/docs/appearance/title-link), [description guidance](https://developers.google.com/search/docs/appearance/snippet), [canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) and [Organization guidance](https://developers.google.com/search/docs/appearance/structured-data/organization) informed these changes. Titles, snippets and rich results are ultimately chosen by the search engine.

### Remaining owner/account tasks

1. Verify the URL-prefix property `https://weburon7.github.io/supernormal-kitchen/` in Google Search Console, then submit `https://weburon7.github.io/supernormal-kitchen/sitemap.xml` and inspect the home/menu URLs. No verification token was available in this session. Indexing and rankings are not guaranteed.
2. The project-level `robots.txt` cannot control the entire `weburon7.github.io` host. Crawlers use **https://weburon7.github.io/robots.txt**, not `/supernormal-kitchen/robots.txt`. The host-root robots URL returned HTTP 404 on 2 November 2026, so no host-level blocking rule was detected. The project file is permissive and documents the sitemap, but Search Console submission is needed for reliable sitemap discovery. See [Google’s robots.txt location rules](https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt).
3. Confirm the business's actual address, public hours, map listing and current service areas before adding physical Restaurant/LocalBusiness markup or updating a Google Business Profile. The virtual room is not evidence of a real dine-in venue. Google’s [local business guide](https://developers.google.com/search/docs/appearance/structured-data/local-business) requires physical business information; none was invented here.
4. Keep the Instagram/profile website link pointed to this GitHub Pages address. The old hosted preview has not been changed; if both versions are promoted, update its canonical or retire the duplicate when the owner chooses.
5. Review prices and seasonal offers with the kitchen. Keep preorder/subscription wording as enquiries until a real confirmation/payment service exists. The existing demo disclosures remain.
6. When moving to a custom domain, update every canonical, JSON-LD identifier, social image/URL and sitemap URL together. Keep redirects where the hosting platform supports them.
