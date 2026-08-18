# Media report

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
| Pilot — energy | `pilot-energy.jpg` | PD — LOC Highsmith | A procession of high-voltage transmission towers across open pasture. Reads as grid capacity, the honest subject of a data-center-and-clean-power pilot; the most graphic frame in the set, which gives the pilot row tonal variety. |
| Pilot — maternal | `pilot-maternal.jpg` | PD — USDA Team Nutrition | A mother holding her infant in a home kitchen doorway, handing off a bottle. Warm, domestic, human — the opposite of clinical-cold. Cropped tighter than the original so mother and child dominate. |
| Pilot — education | `pilot-education.jpg` | PD — BLM Oregon | Two students welding together in an Oregon public high-school shop class. Actual school-to-work, actual public-school reality, mentorship inside the frame, no campus-marketing gloss, no visible logos. |
| Forum | `forum.jpg` | PD — LOC Highsmith | A shingled house above an empty tidal beach at **Hyannis Port**, overcast. Literally the Forum's town; the flat foreground is generous space for type. |
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
2. **`forum.jpg` is Hyannis Port, not the Kennedy Compound.** Never caption it as the
   Compound, and never imply the house pictured is connected to the Kennedy family or the
   Institute.
3. **`pilot-energy.jpg` is Texas, not the Pacific Northwest.** I could not find a
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
- `forum.jpg` is encoded slightly harder (q76 / webp q70) than the rest; fine beach texture
  is expensive and it was the only file that broke the 600 KB budget at q82.
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
