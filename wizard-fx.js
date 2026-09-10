// FastCast wizard orbit effects — NOT IMPLEMENTED
// Binding rules: docs/WEBSITE_DESIGN_CONTRACT.md (§4 wizard stage, §6 motion)
// Full FX spec: docs/WEBSITE_VISUAL_IDEATION.md
//
// Implementation agent should:
// 1. Tier-detect (low / medium / high) per spec §8
// 2. Populate .wizard-particles with CSS offset-path dots or canvas 2D
// 3. Pause on document.hidden; respect prefers-reduced-motion
// 4. Inject via build-site.py on index.html only (defer)
// 5. Extend check-site.cjs with wizard reduced-motion assertions
