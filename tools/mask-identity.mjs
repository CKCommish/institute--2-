/* Strip the identifying band from a frame before a BLIND comparison.

   WHY. The wave-26 judge disclosed that its "blind" A/B was not blind:
   oryzo.ai stamps its wordmark in the top-left of every frame and carries a
   four-item nav beside it, so the judge knew which column was which from the
   first pair. Our own frames carry a wordmark and nav in exactly the same
   place. A comparison where one side is identifiable is not a comparison —
   and this protocol is the client's stated measure of done, so every blind
   read this project has run before now inherits the same defect.

   THE FIX is symmetric and it is a crop, not a paint: a filled rectangle is
   itself a tell if the two sides' bands are different heights, and a blur
   still leaks the wordmark's silhouette. Both frames lose the same FRACTION
   of their height off the top and are then compared at the same width.

   HOW MUCH. Measured: oryzo's masthead band is 62px of a 900px viewport;
   ours is 63px at 1440x900 and 58px at 390x844. TOP = 0.08 clears all three
   with margin at both viewports (72px desktop, 68px mobile).

   WHAT IT COSTS A JUDGE. 8% off the top of a viewport frame. It removes the
   nav, the wordmark and the top rule — so a judge can no longer assess
   masthead treatment, nav register, or how the top edge of the page meets
   the first scene. It does NOT touch the picture, the type block, the
   scroll cue or any band below the fold line, which is where every motion
   and composition question this project asks actually lives. State the crop
   in the judge's brief so an absent masthead is not read as a missing one.

   It cannot mask a brand name that appears INSIDE the photography or copy
   (oryzo's own frames set "ORYZO IS TAKING EVERYONE'S JOBS" in the plate
   art). That is a limit of any crop and should be disclosed, not papered
   over. */
export const TOP = 0.08;

/** Crop the identifying top band. `img` is a sharp instance or a Buffer. */
export async function maskIdentity(sharp, input) {
  const buf = Buffer.isBuffer(input) ? input : await input.toBuffer();
  const m = await sharp(buf).metadata();
  const cut = Math.round(m.height * TOP);
  return sharp(buf)
    .extract({ left: 0, top: cut, width: m.width, height: m.height - cut })
    .toBuffer();
}
