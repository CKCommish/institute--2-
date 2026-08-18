# Content notes — imagery

Companion to `public/media/ATTRIBUTIONS.md` (the full legal record). This file is the
editorial note: what each picture actually is, how it should be used, and what is
deliberately missing.

## The visual system

One idea holds the set together: **real American rooms, real American people, available
light.** No stock futurism, no glowing circuitry, no boardroom smiles.

Four of the seven photographs come from a single author — **Carol M. Highsmith**, whose
LOC archive is a public-domain documentary survey of contemporary America. That single
authorship is doing real work: it gives the hero, the energy pilot, the Forum and the
Institute page a consistent eye, consistent lens language and consistent restraint. The
remaining three are U.S. federal documentary photographs (Army, USDA, BLM) chosen to match
that register.

**Every image ships ungraded.** Sharp applied a mild neutral contrast lift (+4.5%) and a
downscale sharpen — nothing else. Saturation, white balance and tonality are the
photographer's. The navy grade belongs in CSS so it stays adjustable and consistent; the
files are deliberately neutral so that grade lands the same way on all seven. Do not
bake a duotone into these files.

Formats: every slot ships `.jpg` (mozjpeg q82; forum q76) and `.webp` (q78; forum q70),
at full width and at `@1200`. Use `<picture>` with the webp first.

| file | intrinsic size | aspect |
|---|---|---|
| `hero` | 2800 × 1400 | 2:1 |
| everything else | 2400 × 1600 | 3:2 |
| `@1200` variants | 1200 × 600 / 1200 × 800 | same |

---

## Slot by slot

### `hero.jpg` — a man and his dog, Mississippi River, dusk
Greenville, Mississippi, April 2016. Silhouetted figure and dog at the water's edge, a
pickup tailgate at the left edge, and a wide calm sweep of pale water and sky filling the
upper two-thirds.

**Composition contract:** the picture is cropped so the horizon sits high and the human
figures sit in the **lower left**. The headline is expected in the **upper-left through
centre** band, over open water — set it there and nothing collides. If the headline is
moved to vertical centre it will graze the man's head; either raise the type or use
`object-position: center 30%` to push the frame down.

Because it is already blue hour, the navy grade lands almost as a straight duotone. It is
the only frame in the set with real atmospheric depth — protect that, do not add vignette
on top of vignette.

### `pilot-health.jpg` — Special Olympics Unified track event
A young athlete mid-stride on the track, background thrown out of focus.

**Disclosure:** this is a U.S. Army–hosted **Special Olympics Unified** track and field
event at Camp Humphreys, South Korea (2025), not a Healthy Athletes screening and not a
domestic U.S. site. It was chosen because it is the only genuine, high-resolution,
commercially usable Special Olympics photography that reads as documentary rather than
event PR. Do not caption it as a Healthy Athletes screening. If the Institute obtains
Special Olympics International's own imagery, or a Healthy Athletes screening photo, swap
this file — the slot and dimensions are stable.

### `pilot-energy.jpg` — transmission towers, Van Zandt County, Texas
A line of high-voltage lattice towers receding across open pasture.

Stands in for the grid-capacity half of the Clean Data Center pilot. It is **Texas, not the
Pacific Northwest** — do not caption it as Washington or BPA infrastructure. It is the
brightest frame in the set (blue sky, high-key cloud); under the navy grade it becomes the
most graphic, which is useful as contrast against the darker pilots.

### `pilot-maternal.jpg` — mother, infant, kitchen doorway
USDA Team Nutrition, 2017. A mother holding her baby hands a bottle of breastmilk to a
child care provider in a family child care home.

Cropped tighter than the original so the mother and infant dominate and the second adult
reads as support rather than as a two-person brochure shot. Warm interior light, domestic
setting — deliberately *not* a clinical maternity ward, which is the tone the pilot needs.

**Disclosure:** it is a nutrition-education photograph, likely made with consenting
participants for USDA program materials. It is not a photograph of a Medicaid patient in
Indianapolis. Caption it generically ("a family child care home"), never as a Butler
University pilot participant.

### `pilot-education.jpg` — high-school welding shop
Adrian High School, Adrian, Oregon, 2016. Two students welding together, arc light and
sparks, cinder-block wall.

The strongest "school to work" frame available under a free license: real public-school
students, real skill, real mentorship inside the frame, no campus-marketing gloss. Note
the subject is career and technical education, so avoid copy that implies a laptop-and-
software classroom. No visible brand logos in this frame (some adjacent frames in the same
set have university T-shirts — this one does not).

### `forum.jpg` — Hyannis Port shoreline
Carol Highsmith, May 2019. A large shingled house with a small tower above an empty tidal
beach, overcast, with a pier running out to the right.

**This is Hyannis Port, Massachusetts. It is *not* the Kennedy Compound.** The LOC caption
is "Home and small tower undergoing renovation on a beach at Hyannis Port." Use it as
atmosphere for the Forum's setting; never label it as the Compound, and never imply the
building pictured is associated with the Kennedy family or the Institute. If the Forum
needs a picture of the actual venue, that must come from the client with a release.

Overcast, low contrast, muted — exactly the "evening or overcast" register asked for, and
the flat foreground beach is generous space for type.

### `institute.jpg` — meeting room, Fair Park Tower Building, Dallas
Carol Highsmith, May 2014. A long dark table, deep blue walls, an American flag on the end
wall, chairs down both sides, empty.

The most on-message frame in the set: a room where decisions get made, restrained and
already navy. Empty, so there are no faces to clear and no implied endorsement. Works as a
wide establishing image or as a full-bleed band behind the "how we work" beats.

**Disclosure:** it is a park headquarters building in Dallas, not an Institute property.
Do not caption it as the Institute's offices.

---

## Deliberately absent

### Founder portraits
`public/media/founder-mckelvy.jpg` and `public/media/founder-olanoff.jpg` **do not exist and
were not created.** This is intentional.

There are no rights-cleared photographs of **Christopher Kennedy McKelvy** or **Judd
Olanoff** available under any license that permits commercial use. Using a press photo, a
scraped social image, or an image of any Kennedy-family member as a stand-in would be a
rights violation and a misrepresentation. Generating synthetic portraits was also ruled
out — a civic institute cannot ship invented pictures of its own founders.

**Action for the client:** supply two portraits with a signed photographer release and
subject consent, at **1600 × 2000 minimum**, natural light, plain or environmental
background, no studio backdrop. Drop them in as `founder-mckelvy.jpg` and
`founder-olanoff.jpg`.

**Action for the build in the meantime:** the People page must render without portraits.
Name plus one title line, set in the editorial serif, on a flat navy or cream field, is a
better answer than a grey avatar silhouette — and it matches the brief's "name, one title
line, no paragraph." Do not ship placeholder head shapes.

### Board member portraits
Same rule. The prospective board is a **grid of names and one-line titles only**. Several
named people are sitting or former public officials; any photograph of them presented
inside the Institute's own site would imply an affiliation that does not yet exist. No
board portraits were sourced and none should be.

### Lion Forum event photography
No photograph of an actual Lion Forum convening exists in this repo. `forum.jpg` is a
location mood image, not documentation of the event. Any real event photography must come
from the client.

---

## If you need to re-source

The two APIs that produced this set, both usable without a key:

- **Library of Congress** — `https://www.loc.gov/pictures/search/?q=TERMS&co=highsm&fo=json&c=50`
  (`co=highsm` restricts to the Highsmith archive; everything there is "no known
  restrictions"). Full resolution via IIIF at
  `https://tile.loc.gov/image-services/iiif/service:pnp:highsm:GROUP:NUM/full/pct:100/0/default.jpg`,
  falling back to the master TIFF at
  `https://tile.loc.gov/storage-services/master/pnp/highsm/GROUP/NUMa.tif` when an item has
  no IIIF service.
- **Wikimedia Commons** — `action=query&generator=search&gsrnamespace=6&prop=imageinfo&iiprop=url|size|extmetadata`.
  Filter on `extmetadata.LicenseShortName`; prefer `Public domain` U.S. federal works over
  CC-BY-SA so the site never owes a share-alike obligation.

Openverse was tried and is weak here: its relevance ranking is poor for documentary
subjects and it caps Flickr results at 1024 px, which is below the 2400 px this system
needs.
