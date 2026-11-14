// Duplicate articles consolidated into the strongest post on the same query.
//
// Grove published several near-identical posts per keyword (three "best AI 3D
// icon generator" lists, six "best background remover" lists...). Competing
// pages split relevance and links, so Google ranks none of them confidently.
// Each key 301s to its value; fetchGrovePosts drops the keys so they also leave
// the blog index, the homepage preview and the sitemap.
//
// Shared by next.config.mjs (the redirects) and lib/grove.ts (the filter), so
// it stays plain JS.

/** @type {Record<string, string>} loser slug -> winner slug */
export const BLOG_REDIRECTS = {
  // "best AI 3D icon generator"
  'finding-the-best-ai-3d-icon-generator-7-tools-tested-in-2026':
    'the-7-best-ai-3d-icon-generators-in-2026-tested-with-real-outputs',
  'the-7-best-ai-3d-icon-generator-tools-in-2026-an-honest-founder-s-comparison':
    'the-7-best-ai-3d-icon-generators-in-2026-tested-with-real-outputs',

  // "AI 3D icon generator free"
  'the-reality-of-using-an-ai-3d-icon-generator-free-in-2026-the-honest-upgrade-mat':
    'ai-3d-icon-generator-free-what-you-actually-get-and-where-it-breaks-down',
  'the-reality-of-using-an-ai-3d-icon-generator-free-in-2026-what-0-actually-gets':
    'ai-3d-icon-generator-free-what-you-actually-get-and-where-it-breaks-down',

  // "3D logo in Illustrator"
  'how-to-make-a-3d-logo-in-illustrator-and-the-6-second-alternative-designers-swi':
    'how-to-make-a-3d-logo-in-illustrator-2026-guide-the-6-second-3d-icon-maker-alter',

  // "make 3D icons without Blender"
  'stop-fighting-blender-how-to-generate-drop-in-ready-3d-icons-in-6-seconds':
    'how-to-make-custom-3d-icons-in-6-seconds-without-blender',

  // "custom 3D icon pack for Android"
  'how-to-design-and-build-a-custom-3d-icon-pack-apk-for-android':
    'how-to-create-a-custom-3d-icon-pack-for-android-without-learning-blender',

  // "automatic background removal in Photoshop"
  'automatic-background-removal-in-photoshop-the-fastest-method-and-when-to-skip-it':
    'automatic-background-removal-in-photoshop-the-2026-guide-edge-case-gallery',
  'how-to-automatic-remove-background-in-photoshop-4-methods-ranked-by-speed':
    'automatic-background-removal-in-photoshop-the-2026-guide-edge-case-gallery',

  // "best automatic background remover"
  'choosing-the-best-automatic-background-removal-tool-in-2026-7-apps-tested':
    'the-best-automatic-background-remover-in-2026-8-tools-tested-for-real-workflows',
  'finding-the-best-auto-background-remover-app-7-top-picks-for-2026':
    'the-best-automatic-background-remover-in-2026-8-tools-tested-for-real-workflows',
  'automatic-background-removal-shouldn-t-be-this-hard-a-30-second-workflow-for-202':
    'the-best-automatic-background-remover-in-2026-8-tools-tested-for-real-workflows',
  'transparent-backgrounds-shouldn-t-be-this-hard-5-automatic-background-removal-t':
    'the-best-automatic-background-remover-in-2026-8-tools-tested-for-real-workflows',
  '5-tools-for-automatic-background-removal-online-no-downloads-required':
    'the-best-automatic-background-remover-in-2026-8-tools-tested-for-real-workflows',

  // "best Figma plugins"
  'the-best-figma-plugins-for-designers-a-2026-stack-for-fast-shipping-teams':
    'the-best-figma-plugins-in-2026-15-tools-tested-for-real-workflows',

  // "solo founder: ship features, not Figma files"
  'stop-pushing-pixels-the-solo-founder-s-guide-to-shipping-features-not-figma-fi':
    'the-2026-playbook-for-a-solo-founder-shipping-features-not-figma-files',

  // "Frankenstein UI"
  'the-biggest-design-mistake-new-founders-make-and-how-to-avoid-the-frankenstein-u':
    'the-frankenstein-ui-5-mistakes-product-teams-make-with-ai-icon-generators',
  'the-frankenstein-ui-trap-why-static-3d-asset-packs-are-a-mistake-for-early-st':
    'the-frankenstein-ui-5-mistakes-product-teams-make-with-ai-icon-generators',

  // "brand-consistent marketing assets"
  'how-to-keep-your-brand-style-consistent-across-100-marketing-assets-without-a':
    'how-to-prevent-off-brand-marketing-assets-audit-checklist-style-memory-workflow',
}
