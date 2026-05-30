export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  topic: string
  author: string
  date: string
  read: string
  cover: string
  bg: string
  body: string
}

export const POSTS: BlogPost[] = [
  {
    slug: 'how-we-trained-oven-on-800k-3d-renders',
    title: 'How we trained Oven on 800k 3D renders without losing the soul',
    excerpt: 'A peek inside the data pipeline, the rendering rig that almost burnt down our office, and how we keep output from drifting into uncanny-valley plastic.',
    topic: 'Engineering',
    author: 'Mira Patel',
    date: 'May 22, 2026',
    read: '8 min',
    cover: '/assets/diamond.webp',
    bg: '#E6F0FF',
    body: `Training a generative model on 3D assets is nothing like training on photographs. A photo is flat — no normals, no depth map, no light rig. A 3D render is a lie you have to believe in. Every pixel carries a hidden story about where the light came from, what the surface is made of, and how much air sits between the lens and the object.

We started with 800,000 renders across 14 style categories: clay, glass, plastic, chrome, fabric, paper, voxel, metal, plush, neon, ceramic, wood, marble, and liquid. Each render was produced with a deterministic pipeline — fixed HDRI lighting, fixed camera angle, fixed output resolution — so the model could learn material properties without fighting against random environmental noise.

The data pipeline runs on a 64-GPU cluster. At peak we were producing 12,000 renders per hour, which sounds fast until you realise your SSD RAID is filling up at 180 GB/h and you have to ship drives between cities to keep up with your own output.

The soul problem is harder to describe. Early checkpoints made technically correct icons that felt wrong — too smooth, too symmetrical, too much like stock art. We fixed this by injecting controlled imperfection: sub-pixel surface variation, micro-scratches on metal, soft shadow bleeding on clay. The model had to learn that good icons look slightly handmade even when they aren't.

Current output sits at 94.2% style consistency score across a benchmark of 3,000 human-rated pairs. The 5.8% failure rate is almost entirely confined to prompts with conflicting material cues ("glossy matte chrome" — you know who you are).`,
  },
  {
    slug: 'field-guide-to-writing-prompts-that-bake-clean-icons',
    title: 'A field guide to writing prompts that bake clean icons',
    excerpt: 'Subject + style + lighting + format. Why two extra words can save you ten retries, with side-by-side examples for ten common categories.',
    topic: 'Tutorial',
    author: 'Jonah Reed',
    date: 'May 18, 2026',
    read: '6 min',
    cover: '/assets/trophy.webp',
    bg: '#FFF4DC',
    body: `The single most common mistake in Oven AI prompts is leaving out the style adjective. "Shopping cart" produces an icon. "Clay shopping cart" produces a good icon. The model has already learned that "shopping cart" implies a 3D render, so you don't need to say "3D icon of" anymore — but you do need to tell it what world the object lives in.

**The formula that works consistently:**

Subject + style + lighting + format. [Material / style] [subject noun] [optional: lighting cue] [optional: colour hint]

Examples that reliably produce clean results:
- "Clay piggy bank, warm rim light" — soft, friendly, toy-store feel
- "Glass trophy, caustic floor shadow" — premium, award-season energy
- "Polished chrome rocket, dark studio" — high-contrast, SaaS hero material
- "Paper craft house, overhead soft box" — editorial, educational tone
- "Voxel cat, flat even light" — retro game aesthetic, no surprises

**Lighting cues that change everything:**

Rim lighting adds depth and separates the object from the background. Overhead lighting flattens — use it for voxel or paper craft. Caustics (light bending through glass) are only meaningful for transparent materials; adding "caustic" to a clay prompt will confuse the model and cost you a retry.

**When to use colour hints:**

Oven defaults to the most archetypal colour for each object (banana = yellow, sky = blue). Override it when your product design system demands it. "Cobalt blue clay piggy bank" will produce a blue pig. Keep it to one adjective; two competing colour instructions usually cancel out.

**The ten categories that behave differently:**

Characters (people, animals) — always specify material first, posture second. "Clay sitting fox" not "sitting fox, clay" — noun-last gives the model posture precedence over material.

Food — say what it's made of, not just what it is. "Clay slice of pizza" vs "pizza" gives you 10x consistency.

Abstract symbols (arrows, checkmarks, stars) — these are hardest. Add a container: "Clay checkmark inside a rounded square" outperforms "clay checkmark" every time.`,
  },
  {
    slug: 'style-memory-lock-your-brand-once',
    title: 'Style memory is here — lock your brand once, forget about it',
    excerpt: 'Train Oven on a handful of your existing assets and every render that follows matches your system.',
    topic: 'Product',
    author: 'Amelie Brun',
    date: 'May 10, 2026',
    read: '4 min',
    cover: '/assets/shake.webp',
    bg: '#EAE3FF',
    body: `If you've shipped more than 20 icons from Oven, you've probably noticed a small but real consistency problem: the third clay icon you generate looks slightly different from the first one. Same prompt structure, same style word, different session. The model is stateless between generations, so it explores the style space slightly differently each time.

Style Memory is our fix for this.

Upload 3 to 10 of your existing Oven icons (PNG or GLB) and we extract a compact style fingerprint — lighting angle, shadow softness, surface micro-texture, colour temperature, specular intensity. Subsequent renders in your workspace are seeded with this fingerprint, pulling output toward your established look rather than toward the model's prior.

**What it does well:**

Cohesion across a large icon set. If you've been building a clay-heavy product UI for four months, your tenth icon will match your first. Background colour temperature stays consistent. Shadow direction locks in.

**What it doesn't do:**

It doesn't correct bad prompts. If you describe a material that conflicts with your stored style (asking for glass behaviour when your style memory is full of clay), the model will split the difference awkwardly. Use it as a consistency layer on top of good prompts, not as a substitute for them.

**How to activate it:**

Settings, then Style Memory, then Upload reference icons, then Save fingerprint. From that point, every generation in the workspace uses it. You can pause it per-generation with the "Ignore style memory" toggle on the generation panel.

Available on Studio and Enterprise plans.`,
  },
  {
    slug: 'designers-we-love-five-people-changing-3d-in-product-ui',
    title: 'Designers we love: five people changing how 3D feels in product UI',
    excerpt: "Profiles of five working designers — what they make, how they ship, and the corner of the craft they're quietly moving forward.",
    topic: 'Community',
    author: 'Theo Mensah',
    date: 'May 4, 2026',
    read: '12 min',
    cover: '/assets/icecream.webp',
    bg: '#FFE4EC',
    body: `3D in product UI is having a genuine moment. Not the gaudy, drop-shadow-everything era of 2012, and not the flat-design backlash years either — something more considered. Icons that feel material without feeling heavy. Depth that adds meaning rather than decoration.

We reached out to five designers whose work we keep coming back to, and asked them a simple question: what problem are you actually trying to solve?

**Priya Nair, product design lead**

Priya works on a fintech app with a predominantly South Asian user base. Her insight: "Clay and plush materials read as approachable and safe across cultures in a way that line icons don't. When I put a clay piggy bank next to a wire transfer flow, the cognitive load of 'is this serious' goes away." She ships icons in sets of 12, always same material, always same lighting temperature.

**Marcus Hollenbeck, indie game developer**

Marcus has been shipping voxel-aesthetic mobile games for six years. He uses Oven for UI icons — health bars, inventory items, menu buttons. "Game art teams are tiny. I used to spend two days per icon on a 3D asset. Now I spend twenty minutes." His current project ships with 340 Oven-generated icons.

**Yuki Tanaka, design systems engineer**

Yuki maintains a design system for a 200-person product company. "The hard problem isn't generating an icon. It's making sure icon number 200 looks like it belongs with icon number 1." She uses Style Memory and an internal review checklist with 6 criteria: shadow direction, highlight position, material reflection, corner radius, visual weight, background value.

**Isabela Cortez, brand designer**

Isabela's clients are early-stage startups with no design budget. "They need 30 icons yesterday and can't afford $15 per asset from a marketplace. Oven makes that viable." She ships full icon packs under client commercial license on a Studio plan, charges $150 per pack, and turns around in 48 hours.

**Dev Kapoor, developer and occasional designer**

Dev is an engineer who ends up doing design work because his team has no designer. "I'm not good at this, and I know I'm not good at it. What I needed was a tool that made my output look like a designer made it even when I was the one making it." His qualifier: it works for icons, not for full illustrations.`,
  },
  {
    slug: 'glb-export-when-to-ship-a-real-3d-asset',
    title: 'GLB export, explained: when (and when not) to ship a real 3D asset',
    excerpt: "Transparent PNG is still the right answer 90% of the time. Here's the 10% where a GLB pulls real weight.",
    topic: 'Tutorial',
    author: 'Wei Lin',
    date: 'April 28, 2026',
    read: '7 min',
    cover: '/assets/cap.webp',
    bg: '#DCEEFF',
    body: `Every Oven generation ships with four export options: PNG, SVG, GLB, and APNG. Most people download the PNG and move on. This is correct behaviour 90% of the time. But GLB is there for a reason, and knowing when to use it versus when not to will save you from shipping unnecessarily heavy pages.

**What GLB actually is**

GLB is the binary form of glTF (GL Transmission Format) — a 3D file that contains mesh data, material definitions, and optionally animations. An Oven-exported GLB contains the full geometry of your icon: every vertex, every face, every material parameter. The file is typically 150 to 250 KB for a single icon.

**When GLB is the right choice**

Hero sections with scroll interaction: if you want the icon to rotate as the user scrolls or interact with cursor position, you need the 3D mesh. Load GLB into react-three-fiber or three.js and use it with OrbitControls or a custom scroll hook.

360-degree presentations: turntable animations for product pages. A live-rendered GLB is smoother than APNG and lets the user grab and rotate.

Blender compositing: if you're placing an icon into a 3D scene for a video or motion graphics project, you need the actual mesh.

Design tool 3D features: Figma, Spline, and similar tools are adding 3D import. GLB works.

**When GLB is the wrong choice**

UI icons in a web app: use PNG. The browser doesn't need 200 KB of geometry to display a 64px icon. A 2048px PNG with transparency weighs about 40 KB at typical compression.

Email: PNG only. GLB in email is not supported.

App icons for iOS and Android: these platforms require specific formats. Export PNG at 2048px and resize.

Landing page static hero images: unless you specifically want interactivity, PNG loads faster and requires zero JavaScript.

**Performance note**

Loading a GLB requires WebGL initialisation, shader compilation, and mesh upload to the GPU. On a mid-range mobile device this takes 200 to 400ms. For most UI applications this latency is not acceptable. For a deliberate hero section experience, it is fine.`,
  },
  {
    slug: 'behind-the-rebrand-why-ovens-logo-is-a-circle',
    title: "Behind the rebrand: why Oven's logo is a circle and nothing else",
    excerpt: "Eighteen rounds, two dropped concepts, and the surprisingly hot debate about whether you're allowed to put text inside a tiny circle.",
    topic: 'Design',
    author: 'Sasha K.',
    date: 'April 19, 2026',
    read: '9 min',
    cover: '/assets/cart.avif',
    bg: '#E8F0FF',
    body: `When we started the rebrand, we had one constraint and one constraint only: the logo had to work at 16 by 16 pixels as a favicon without becoming an unreadable smudge.

At 16x16 you have 256 pixels to work with before antialiasing turns everything grey. Any letterform thinner than 2px disappears. Any detail smaller than 3px becomes noise.

**Round one: the oven door**

The first concept was a stylised oven door — the four-pane window you see on kitchen ovens. Everyone in the company loved it. It communicated the name directly. It had character. At 16x16, it looked like a grid of grey squares. We killed it.

**Round two: the letter O**

We tried making the O from "Oven" the logo. Helvetica Neue Bold, slightly flattened, a warm orange-brown to lean into the baking metaphor. The problem: every other company whose name starts with O has had the same idea. It read as generic at any size above 32px.

**The pivot: just the circle**

Someone on the team said: "What if we stop trying to make it look like an oven and just make it look warm?" A filled circle in a warm off-white, like the colour of unglazed ceramic. Not white (too clinical), not beige (too corporate), not orange (too aggressive). The exact value we landed on is #F4F0EB — a value we now call "clay" internally.

The circle doesn't represent an oven. It represents a finished baked object — the output of the oven rather than the oven itself.

**The favicon problem, solved**

At 16x16, a filled warm-coloured circle on a dark background is immediately recognisable and doesn't decay into noise. We ship both light and dark mode variants.

**The text debate**

Should the wordmark put "Oven" inside the circle? No. You cannot fit four readable letters into a 32x32 space without the font size dropping below 8px. The wordmark keeps the circle and the word separate: the circle to the left, "Oven" in Instrument Serif Regular to the right. Instrument Serif references craft, warmth, and handmaking — associations that counterbalance the very digital nature of what we actually do.

Eighteen rounds. Two dropped concepts. One warm circle.`,
  },
  {
    slug: 'what-were-shipping-next-quarter',
    title: "What we're shipping next quarter — a rough sketch",
    excerpt: "API, animated APNG sequences, batch jobs, multi-seat workspaces. The order we're tackling them and why.",
    topic: 'Product',
    author: 'Mira Patel',
    date: 'April 11, 2026',
    read: '5 min',
    cover: '/assets/pig.avif',
    bg: '#FFE6F0',
    body: `Every quarter we publish a rough sketch of what we're building. Not a promise, not a roadmap with dates, just a transparent description of where we're putting energy and why. Things move around. Some things get cut. This is the honest version.

**API (Q2 priority 1)**

The most-requested feature since launch. A REST API that accepts a prompt and style parameter and returns a PNG URL or base64 blob. Rate-limited by plan tier, authenticated by API key.

Why it's taking longer than expected: the generation pipeline currently runs as a serverless function with cold-start latency that's fine for a web UI but not acceptable for programmatic use where you might be calling it inside a customer-facing flow. We're moving generation to a warm worker pool before we open the API.

**Animated APNG sequences (Q2 priority 2)**

The current APNG export is a 360-degree turntable loop. We're adding two new animation modes: idle bounce (subtle up-down float, great for landing page heroes) and appear (the icon scales in from zero with a slight elastic overshoot, for onboarding flows).

**Batch jobs (Q2 priority 3)**

Upload a CSV of prompts, get back a ZIP of PNGs. For designers building large icon sets, this removes the need to click-and-wait 40 times. First version will be synchronous.

**Multi-seat workspaces (Q3)**

Shared style memory, shared generated library, team billing. This is the biggest scope item on the list and the one we're least willing to give a date for. We'd rather ship it right than ship it fast.

**What's not on the list**

Video generation is not in scope. The training data requirements are 10x what we have today and the generation latency would be too high for the interactive product we want to build.

Text overlays on icons are not in scope. We think icons without text work better as icons. This is a philosophy position, not a technical one.`,
  },
]
