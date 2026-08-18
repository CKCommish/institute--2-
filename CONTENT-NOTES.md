# Content notes — imagery

Companion to `public/media/ATTRIBUTIONS.md` (the full legal record). This file is the
editorial note: what each picture actually is, how it should be used, and what is
deliberately missing.

## The visual system

One idea holds the set together: **real American rooms, real American people, available
light.** No stock futurism, no glowing circuitry, no boardroom smiles.

Four of the seven slots come from a single author — **Carol M. Highsmith**, whose
LOC archive is a public-domain documentary survey of contemporary America. That single
authorship is doing real work: it gives the hero, the energy pilot, the Forum and the
Institute page a consistent eye, consistent lens language and consistent restraint. The
remaining three are U.S. federal documentary photographs (Army, USDA, BLM) chosen to match
that register. An eighth file, `pilot-health-portrait`, is a second crop of an existing
photograph rather than a new one.

**Every image ships ungraded.** Sharp applied a mild neutral contrast lift (+4.5%) and a
mild downscale sharpen — nothing else. Saturation, white balance and tonality are the
photographer's. The navy grade belongs in CSS so it stays adjustable and consistent; the
files are deliberately neutral so that grade lands the same way on all seven. Do not
bake a duotone into these files.

Formats: every slot ships `.jpg` (mozjpeg q82; forum q80) and `.webp` (q78; forum q76),
at full width and at `@1200`. Use `<picture>` with the webp first. The one exception is
`pilot-health-portrait`, which ships `.jpg` + `.webp` only — see below.

| file | intrinsic size | aspect |
|---|---|---|
| `hero` | 2800 × 1400 | 2:1 |
| `forum` | 2800 × 1250 | 2.24:1 |
| everything else | 2400 × 1600 | 3:2 |
| `pilot-health-portrait` | 1600 × 2000 | 4:5 — no `@1200` |
| `@1200` variants | 1200 × 600 / 1200 × 536 / 1200 × 800 | same as parent |

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

### `pilot-energy.jpg` — a high-voltage transmission tower, Muskingum County, Ohio
Carol Highsmith, October 2016. A single enormous twin-mast steel lattice tower shot low and
close, guy wires radiating out to all four corners, conductors running off left and right,
one more tower small in the left distance, a dark wooded ridge along the base and a white
paddock fence at the bottom. Heavy overcast with the sun diffusing behind the cloud, so the
steel edge-lights against a luminous grey sky.

**Replaced in the second pass.** The first pass used a procession of towers across pasture
in Van Zandt County, Texas under a blue sky with cumulus. It was the brightest, most
cheerful frame in the set and fought everything around it. This one carries tonal weight
instead of sky, and it is deliberately composed for the two shapes the site actually asks
of it: the tower head sits inside the `16 / 5.5` letterbox band used on `/pilots/`
(`focal 50% 62%`), and the whole structure survives the 4:5 centre crop used for the
homepage hover preview.

**Disclosure:** it is **Ohio, not the Pacific Northwest.** Do not caption it as Washington
or as BPA infrastructure. I searched the Highsmith archive and Wikimedia Commons again for
a Washington-state or Bonneville transmission frame: Commons still only has 1940s HAER
black-and-white documentation and low-grade European substation snapshots, and Highsmith's
Pacific-Northwest energy coverage is wind turbines above the Columbia, not transmission.

### `pilot-maternal.jpg` — mother and infant, home kitchen
USDA Team Nutrition, 2017. A woman in a blue-grey sweater holds her infant against her
shoulder in the doorway of a family child care home. Warm yellow wall, a small framed
photograph behind them, white cabinetry at the left edge. Available interior light.

**Re-cropped in the second pass.** The first pass kept the second adult — a child care
provider receiving a bottle of breastmilk — and the two-adult interaction made it read like
a program brochure. The frame now takes only the left 60% of the original, which drops the
provider entirely and leaves the mother and child alone. It is warmer, quieter and much
better at the aspect ratios the site actually uses: this file is rendered at **4:5 on
desktop and 4:3 on mobile** (`/pilots/`) and at 4:5 again in the homepage preview, and the
old crop put a half-sliced second face at the right edge in all three.

**Disclosure unchanged:** it is a nutrition-education photograph made for USDA program
materials, not a photograph of a Medicaid patient in Indianapolis. Caption it generically
("a family child care home"), never as a Butler University pilot participant. Cropping the
provider out does not change what the picture is; it only changes what it emphasises.

### `pilot-education.jpg` — high-school welding shop
Adrian High School, Adrian, Oregon, 2016. Two students welding together, arc light and
sparks, cinder-block wall.

The strongest "school to work" frame available under a free license: real public-school
students, real skill, real mentorship inside the frame, no campus-marketing gloss. Note
the subject is career and technical education, so avoid copy that implies a laptop-and-
software classroom. No visible brand logos in this frame (some adjacent frames in the same
set have university T-shirts — this one does not).

### `forum.jpg` — Old Harbor at dusk, Block Island, Rhode Island
Carol Highsmith, from her earlier colour-transparency work (LOC dates it "between 1980 and
2006"). Mirror-calm harbour water in the foreground, a long stone breakwater running right
across the middle distance with two small navigation beacons on it, two moored sailboats
and a few pilings at the left, and a blue-hour sky filled with lit stratocumulus bands.

**This is Rhode Island. It is not Cape Cod and it is not Hyannis Port.** Read the note
below before writing any caption near it.

**Replaced in the second pass, and this one is a judgement call worth understanding.**
The first pass used *Home and small tower undergoing renovation on a beach at Hyannis Port*
— literally the Forum's town. Two things were wrong with it. As a photograph it was a
record shot: flat grey sky, a small house, and half the frame given to empty sand. And as
an editorial object it was the single riskiest frame in the set — a large private house **at
Hyannis Port**, set under a Forum headline, is an open invitation to the Kennedy-Compound
misreading `refs/PHOTO-FACTS.md` exists to prevent. Making the house bigger (the obvious
craft fix) made that worse, not better.

I searched the whole Highsmith Cape Cod / Martha's Vineyard shoot (April–May 2019, ~170
frames, all of it) plus Maine, Rhode Island and coastal Massachusetts, and Wikimedia Commons
for public-domain Cape Cod photography. The 2019 Cape shoot is uniformly flat overcast
documentary work; Commons has postcards, manuscripts and NPS wildlife. There is no
better Cape Cod frame available under a free licence. Block Island is genuinely New England
coastal, genuinely at dusk, and it is a materially better photograph: foreground, middle
distance and far sky all present, real light, and a wide quiet band of water in the lower
left exactly where the display line sits.

The frame is shipped at 2.24:1 because the Forum section renders it full-bleed behind type.
Verified under the real treatment (`grade 0.62`, bottom ink ramp) at a 1.70:1 desktop box,
a 2.72:1 ultrawide box and a 0.56:1 phone box — it holds at all three.

### `institute.jpg` — meeting room, Fair Park Tower Building, Dallas
Carol Highsmith, May 2014. A long dark table, deep blue walls, an American flag on the end
wall, chairs down both sides, empty.

The most on-message frame in the set: a room where decisions get made, restrained and
already navy. Empty, so there are no faces to clear and no implied endorsement. Works as a
wide establishing image or as a full-bleed band behind the "how we work" beats.

**Disclosure:** it is a park headquarters building in Dallas, not an Institute property.
Do not caption it as the Institute's offices.

### `pilot-health-portrait.jpg` / `.webp` — the one portrait variant
Same photograph as `pilot-health.jpg` (U.S. Army, Camp Humphreys, 2025), cropped natively
to **4:5** at 1600 × 2000. No `@1200` pair — it is only ever rendered small.

Every `pilot-*` image is rendered at 4:5 somewhere: all four appear as the homepage
pilot-list hover preview, and `pilot-maternal` is 4:5 on `/pilots/` as well. All four were
checked under the real window — `object-fit: cover` **plus** Figure's parallax overscan,
which is tighter than a plain centre crop (4% on the homepage preview, 10% at
`parallax={7}`).

| file | survives a 4:5 crop? | action |
|---|---|---|
| `pilot-energy` | yes, very well — the tower fills the frame | none |
| `pilot-education` | yes — the arc and both students stay centred | none |
| `pilot-maternal` | **no**, before the re-crop; **yes** after it | fixed in the main file, no variant needed |
| `pilot-health` | subject survives but the centre crop clips her trailing foot and pushes her onto the left edge | **variant shipped** |

Wire `pilot-health-portrait.*` into the 4:5 preview only. Everywhere else `pilot-health.jpg`
still stands, and it must — `/pilots/` renders that pilot full-bleed at `focal 50% 34%`.


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
