# Media report

> **Read the second pass at the bottom of this file first.** Three frames were replaced
> after this report was written (`forum.jpg`, `pilot-energy.jpg`, `pilot-maternal.jpg`) and
> one portrait variant was added. Rows marked ⚠ below are superseded. Everything else in
> the first-pass report still stands.

Status: **all 7 slots filled.** Assets live in `public/media/`. Legal record in
`public/media/ATTRIBUTIONS.md`; editorial notes and usage constraints in `CONTENT-NOTES.md`.

## Headline

Every shipped image is **public domain** — four from the Library of Congress Carol M.
Highsmith Archive ("no known restrictions on publication"), three U.S. federal works
(Army, USDA, BLM). Nothing in the set is CC-BY or CC-BY-SA, so the rendered site owes **no
attribution notice**. That was not the plan going in; it fell out of chasing the best
documentary frames, and it is the cleanest possible position.

Four of seven share one photographer, which is what makes the set read as a system rather
than a mood board.

## Slot → file → license → why

| slot | file | license | why this frame |
|---|---|---|---|
| Hero | `hero.jpg` (2800×1400) | PD — LOC Highsmith, no known restrictions | Man and his dog at the Mississippi River at dusk. Real person, real evening, wide and deep; already blue hour so the CSS navy grade lands as a near-duotone; figures sit lower-left leaving the upper-left/centre band open for the serif line. |
| Pilot — health | `pilot-health.jpg` (2400×1600) | PD — U.S. Army | A young athlete mid-stride at a Special Olympics Unified track event. Single dignified figure, shallow depth, documentary rather than event PR. |
| ⚠ Pilot — energy *(superseded)* | `pilot-energy.jpg` | PD — LOC Highsmith | A procession of high-voltage transmission towers across open pasture. Reads as grid capacity, the honest subject of a data-center-and-clean-power pilot; the most graphic frame in the set, which gives the pilot row tonal variety. |
| ⚠ Pilot — maternal *(re-cropped)* | `pilot-maternal.jpg` | PD — USDA Team Nutrition | A mother holding her infant in a home kitchen doorway, handing off a bottle. Warm, domestic, human — the opposite of clinical-cold. Cropped tighter than the original so mother and child dominate. |
| Pilot — education | `pilot-education.jpg` | PD — BLM Oregon | Two students welding together in an Oregon public high-school shop class. Actual school-to-work, actual public-school reality, mentorship inside the frame, no campus-marketing gloss, no visible logos. |
| ⚠ Forum *(superseded)* | `forum.jpg` | PD — LOC Highsmith | A shingled house above an empty tidal beach at **Hyannis Port**, overcast. Literally the Forum's town; the flat foreground is generous space for type. |
| Institute | `institute.jpg` | PD — LOC Highsmith | An empty meeting room — long dark table, deep blue walls, an American flag. Already navy, already serious, no faces to clear. |

Each slot also ships `.webp` and `@1200` variants of both formats.
All files are under budget (hero 348 KB, largest other 491 KB; limits were 900 KB / 600 KB).

## Slots filled with a caveat

None failed outright, but three carry disclosures that the copy must respect. All three are
written up in full in `CONTENT-NOTES.md`:

1. **`pilot-health.jpg` is not a Healthy Athletes screening.** It is a Special Olympics
   *Unified* track event hosted by the U.S. Army at Camp Humphreys, South Korea. I searched
   Openverse and Commons hard for a genuine Healthy Athletes screening under a commercial
   license; the only hit was a single CC-BY-SA German-language 2023 World Games frame that
   was weaker as a photograph and would have imposed a share-alike obligation. This is the
   best free-licensed Special Olympics photography that exists. **Swap it** if the Institute
   can get Special Olympics International's own imagery.
2. ⚠ *Superseded — `forum.jpg` is now Block Island, Rhode Island.* **(First pass:)** **`forum.jpg` is Hyannis Port, not the Kennedy Compound.** Never caption it as the
   Compound, and never imply the house pictured is connected to the Kennedy family or the
   Institute.
3. ⚠ *Superseded — `pilot-energy.jpg` is now Muskingum County, Ohio; still not the Pacific Northwest.* **(First pass:)** **`pilot-energy.jpg` is Texas, not the Pacific Northwest.** I could not find a
   commercially usable, well-composed Bonneville Power Administration or Washington-state
   transmission frame at usable resolution — Commons has BPA material but almost all of it
   is 1940s HABS/HAER black-and-white architectural documentation, which would have broken
   the visual system.

## Deliberately not produced

`public/media/founder-mckelvy.jpg` and `public/media/founder-olanoff.jpg` **do not exist.**
No rights-cleared photographs of Christopher Kennedy McKelvy or Judd Olanoff are available
under any commercial-use license, and synthetic portraits were out of scope and out of
character for a civic institute. Same rule applied to the prospective board: names and one
title line only, no portraits — a photograph of a sitting or former public official on the
Institute's own site would imply an affiliation that does not exist.

**The People page must render without portraits.** Name plus one title line on a flat navy
or cream field is a better answer than a grey avatar; it also matches the brief's "name,
one title line, no paragraph." Please do not ship placeholder head shapes. Client to supply
1600 × 2000 minimum portraits with a signed release.

## Notes for whoever owns the CSS

- **Do not bake a grade into these files.** They ship neutral (contrast +4.5%, nothing else)
  precisely so one CSS navy grade lands identically across all seven. I verified the whole
  set under a simulated navy duotone and it holds together.
- Hero expects type in the **upper-left through centre**. At vertical centre the headline
  grazes the man's head — either raise the type or use `object-position: center 30%`.
- ⚠ Superseded: the current `forum.jpg` is q80 / webp q76 at 2800 × 1250 and sits at 295 KB.
- Use `<picture>` with the `.webp` first, `@1200` as the small source.

## Method, briefly

Openverse was tried first and is weak for this job: poor relevance ranking on documentary
subjects, and it caps Flickr results at 1024 px — below the 2400 px this system needs. The
two sources that actually worked, both keyless:

- **LOC Pictures API**, `co=highsm` to restrict to the Highsmith archive.
- **Wikimedia Commons API** with `extmetadata`, filtering on `LicenseShortName` and
  preferring U.S. federal public-domain works over CC-BY-SA.

Roughly 1,900 candidates were harvested across ~70 queries, ~350 were downloaded and
reviewed on contact sheets, and the hero and two revised crops were tested under a
simulated navy grade with live headline type before being locked.

---

# Second pass — three frames replaced, one portrait variant added

Everything below the line was done in a later pass against the first-pass set. Rights
position is unchanged: **still 100% public domain**, still four of seven slots by Carol M.
Highsmith, still no attribution obligation on the rendered site.

## What changed

| file | before | after | why |
|---|---|---|---|
| `forum.jpg` | Shingled house on the beach at Hyannis Port, MA (highsm-57378) | **Old Harbor at dusk, Block Island, RI** (LC-HS503-4129 / highsm-14245) | Craft *and* risk. See below. |
| `pilot-energy.jpg` | Transmission towers across pasture, Van Zandt County, TX (highsm-29991) | **A single high-voltage tower under heavy overcast, Muskingum County, OH** (highsm-41718) | Tonal weight instead of bright cumulus sky. |
| `pilot-maternal.jpg` | Mother + infant + child care provider, USDA | **Same photograph, re-cropped to the left 60%** — provider dropped entirely | The three-person interaction read as a program brochure, and the second face was sliced at the edge in every ratio the site uses. |
| `pilot-health-portrait.jpg/.webp` | — | **New 4:5 crop, 1600 × 2000** | The 4:5 centre crop of `pilot-health.jpg` clips the athlete's trailing foot. |

New intrinsic sizes: `forum` is now **2800 × 1250 (2.24:1)** because it renders full-bleed
behind display type; `pilot-energy` and `pilot-maternal` stay 2400 × 1600.
`pilot-health-portrait` is 1600 × 2000 and ships **no `@1200` pair** — it is only ever
rendered small. Largest file in the set is now 475 KB (`pilot-health.jpg`, untouched);
budgets were 900 KB hero / 600 KB everything else.

## `forum.jpg` — the one that needed a decision

The brief was "the most cinematic moment on the site". The Hyannis Port frame was a record
shot — flat grey sky, small house, half the frame empty sand — and the obvious craft fix
(crop tighter, make the house bigger) made a second, worse problem worse: a large private
house **at Hyannis Port** printed under a Forum headline reads as a claim that it is the
Kennedy Compound. That is precisely what `refs/PHOTO-FACTS.md` exists to prevent.

I tested both routes the brief asked for, side by side, under the real treatment with live
headline type. Tighter crops of the Hyannis source are genuinely better than what shipped —
and still not good, because there is no light in that frame to find.

Then I looked for a better source. Coverage was exhaustive rather than lucky:

- The entire Highsmith Cape Cod / Martha's Vineyard / Provincetown shoot (April–May 2019).
  I enumerated the accession range and confirmed the only frames I had not pulled were
  Boston aerials. **The whole shoot is flat overcast documentary work.** There is no
  cinematic Cape Cod frame in that archive.
- Highsmith's Maine, New Hampshire and Rhode Island coastal work (~440 frames reviewed on
  contact sheets) — mostly bright midday and aerials.
- Highsmith's `dusk` / `twilight` / `sunset` keyword sets (~500 frames), filtered to New
  England.
- Wikimedia Commons, public-domain only, for Cape Cod: postcards, manuscripts, Sanborn
  maps and NPS wildlife. Nothing usable.

The winner is **Old Harbor, Block Island, Rhode Island at dusk** — mirror-calm water,
a breakwater across the middle distance, moored sailboats, a blue-hour sky with lit cloud
bands. Real foreground / middle / far, real light, and a wide quiet band of water in the
lower left exactly where the display line sits. Verified under `grade 0.62` plus the bottom
ink ramp at a 1.70:1 desktop box, a 2.72:1 ultrawide box and a 0.56:1 phone box.

**It is Rhode Island, not Cape Cod.** `refs/PHOTO-FACTS.md` now carries a section on how
the Forum scene should handle the two location strings it is now juggling — the event's
location ("Kennedy Compound, Hyannis Port", which is a fact about the convening and stays)
and the photograph's location ("Block Island, Rhode Island"). **Whoever owns the Forum copy
needs to read that section.** It is the one open decision this pass creates.

## `pilot-energy.jpg`

Searched Highsmith for substations, switchyards, transmission and power plants (~290
frames) and Commons for BPA / DOE / substation material (~120). Commons is still a dead end
here — 1940s HAER black-and-white and low-grade European substation snapshots.

The pick is a single enormous twin-mast lattice tower shot low and close, guy wires
radiating to the corners, dark wooded ridge, white paddock fence, heavy overcast with the
sun diffusing behind the cloud. Tonal weight, not sky, exactly as asked.

It is composed for the two shapes the site actually asks of this file, which is easy to get
wrong: `/pilots/` renders it as a **`16 / 5.5` letterbox band at `focal 50% 62%`**, and the
homepage renders it at **4:5**. Both were simulated at the real grades before locking.

**Still not the Pacific Northwest** — it is Ohio now instead of Texas. I looked again;
Highsmith's Columbia-basin energy coverage is wind turbines, not transmission. The
disclosure in `CONTENT-NOTES.md` stands, with the geography updated.

## `pilot-maternal.jpg`

Re-cropped, not replaced. Same USDA Team Nutrition photograph, same disclosure. Taking the
left 60% of the original drops the child care provider entirely and leaves the mother and
her infant alone against a warm wall. Tested at 4:5 and at 4:3 (the two ratios `/pilots/`
actually uses) plus the homepage preview; the old crop put a half-sliced second face at the
right edge in all three.

## The 4:5 audit — what to wire up

Every `pilot-*` image is rendered at 4:5 somewhere. All four were checked under the real
window, which is tighter than a plain centre crop because `Figure` adds parallax overscan
(4% on the homepage preview, 10% at `parallax={7}`).

| file | 4:5 verdict | action |
|---|---|---|
| `pilot-energy` | strong — the tower fills the frame | none |
| `pilot-education` | good — arc and both students stay centred | none |
| `pilot-maternal` | failed before the re-crop, good after it | fixed in the main file; **no variant needed** |
| `pilot-health` | subject survives, but the crop clips her trailing foot and pushes her onto the left edge | **variant shipped** |

**Files to wire up — exactly two:**

- `public/media/pilot-health-portrait.jpg`
- `public/media/pilot-health-portrait.webp`

Use them **only** for the 4:5 preview. `pilot-health.jpg` must stay everywhere else —
`/pilots/` renders that pilot full-bleed at `focal 50% 34%`.

## Method note

Same as the first pass: LOC Pictures API (`co=highsm`) and the Wikimedia Commons API, both
keyless. Roughly 1,400 further candidates were harvested and ~700 reviewed on indexed
contact sheets. Nothing was judged from a thumbnail: every finalist was pulled at full
resolution, cropped, then composited under a byte-accurate reimplementation of
`src/components/Figure.astro` — the same `saturate`/`contrast`/`brightness` filter, the same
three-stop navy multiply scrim, the same vignette, the same bottom ink ramp, the same
`object-fit: cover` focal behaviour and parallax overscan — and judged in that state, with
simulated display type over the Forum candidates. Several frames that looked fine raw died
under the grade; the ones that shipped were chosen in it.

---

# Wave 9 — pilot 03's photograph replaced (client rejection)

**Scope: one image.** No other frame, pilot, page or layout was touched.

## What happened

The client rejected the picture in pilot 03 (*Infant Mortality*, Butler University):
"I don't like the photo of the mother with the kid." Taken at face value — the image is
out, not re-cropped. The USDA Team Nutrition photograph is off disk, and so are the
obsolete `pilot-maternal-crop.*` files (all four variants, including the `@1200` pair the
earlier cleanup missed).

## What ships

`public/media/pilot-maternal.{jpg,webp}` + `@1200` variants —
**Carol M. Highsmith, *Aerial view of Indianapolis, Indiana*, 2016-09-19.**
LC-DIG-highsm-40936 · https://www.loc.gov/item/2016631754/ ·
Library of Congress Carol M. Highsmith Archive, "No known restrictions on publication."

Downtown Indianapolis from a plane on a hazy September afternoon: the Chase Tower and the
towers around Monument Circle, low-rise blocks and a convention hall in the near ground,
tree canopy running out to a flat horizon. **No identifiable person in the frame.**
Original 8406 × 5604; cropped 3:2 from the top (full width, y 0–5268) to drop a band of
surface parking and interstate ramps; 2400 × 1600, contrast +4.5%, mild sharpen,
mozjpeg q78 / webp q74. 574 KB / 481 KB; `@1200` 162 KB / 148 KB. No colour grade baked in.

## Why this frame

1. **It is the honest one.** The pilot is proposed for Indianapolis. This is Indianapolis.
   Nothing has to be implied, and the credit (`Indianapolis, Indiana`) is the same kind of
   plain location string the other Highsmith frames carry.
2. **It has no subject to exploit.** Six critics have now flagged real people used on this
   site in ways they never agreed to, and a page headed *Infant Mortality* is the worst
   place on the site to print a stranger's face. A city cannot be misrepresented by being
   photographed.
3. **It makes the set read as one system.** Five of the shipped frames are now Highsmith /
   Library of Congress.
4. **It survives the grade.** Under pilot 03's actual plate (grade .5, sat ×1.5, tint ×2.7,
   lift 2.0) the haze goes cool blue-grey, the towers keep their tonal separation, and the
   horizon holds the frame. Checked at 3:2 (the `/pilots/` plate), 4:3 (`ratioSm`), 16:7,
   1:1, the homepage Stake full-bleed band at `zoom 1.22 / focal 68% 42%`, and a 390 × 700
   phone frame. It works in all of them; the close Stake crop is the best of them.

## Rejected

~20 candidates from the LOC Highsmith Indianapolis holdings (three pages of results),
judged on an indexed contact sheet raw and again under the grade.

- **Butler University campus aerials** (2016631670 / 671) — factually the most on-point
  frame available, and the weakest picture: flat midday green that turns to grey-green mush
  under the grade and reads as a real-estate listing.
- **Larue D. Carter psychiatric hospital aerial** (2016631663 / 665) — the only hospital in
  the Highsmith Indianapolis set, and a psychiatric hospital is the wrong association for
  an infant-mortality pilot. There is no LOC Highsmith frame of a general hospital, clinic
  corridor or neonatal unit in Indianapolis; that idea has no public-domain source here.
- **Close downtown aerial** (2016631769) and **near-downtown grid** (2016631777) — good
  texture, no subject; both collapse into grey noise under the veil.
- **Monuments and civic set pieces** — Soldiers' and Sailors' Monument, the Obelisk, the
  War Memorial, the State House at dusk. Handsome, but they caption the pilot as government
  or memorial rather than as a city.
- **Suburban and reservoir aerials** (Fishers, Geist, Somerset Lakes) — affluent
  subdivisions, the opposite of the pilot's population.
- **Artsgarden at sunset** (2016631745) — the liveliest photograph in the pool and the one
  that grades best, but it is a street of parked cars and retail signage; it reads as
  downtown lifestyle, not as a civic frame.
- Anything with a baby, a small child, a clinical set or a face was excluded before the
  sheet was built.

## One thing left open, and it is not optional

**`pilot-maternal.jpg` is used twice.** Besides pilot 03's plate it is the full-bleed
photograph in the homepage Stake scene (`src/components/scroll-Stake-alt.astro`, fed by
`stake` in `src/data/site.js`). Replacing the file changed the picture in both places. This
pass was scoped to pilot 03, so the Stake scene's copy was left alone — and it now describes
a photograph that does not exist:

- `scroll-Stake-alt.astro` hard-codes `stakeCredit = 'Family child care home · USDA'` and a
  `stakeAlt` describing a mother holding her infant.
- `site.js` → `stake.credit` is `'U.S. Department of Agriculture'`, and the comment on
  `stake.altLine` argues from "an identifiable woman in a USDA photograph".

Those must become `Indianapolis, Indiana` and an empty `alt` before the site ships. Flagged
in `refs/PHOTO-FACTS.md` as well. Second-order: pilot 03's `plate` trim
(`sat 1.5, tint 2.7, lift 2.0`) was metered against a warm dim interior. It reads acceptably
on the aerial — that is what the shape tests above were checked under — but a re-meter
against the new file would be the tidy follow-up.
