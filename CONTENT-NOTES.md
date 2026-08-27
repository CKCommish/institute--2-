# Content notes — imagery

> **SUPERSEDED IN PART — 27 Aug 2026.** `refs/PROSPECTUS.txt` is now the canonical
> source and beats `refs/BRIEF.md` on every conflict. Entries below that describe the
> four pilots as *proposed*, *sought*, or *"none is signed"* are OUT OF DATE: the
> prospectus heads them "FOUR ACTIVE PILOTS — 2026" and says the Institute *is working
> with* Special Olympics, Governor Inslee and Butler University; pilot 04 it describes
> as being *explored*. Also out of date here: the Indianapolis infant-mortality ranking
> was stripped as invented and is REAL — it is in the prospectus and is back on the
> site; and pilot 01 is Global Health Data (an open-source dataset), not a Healthy
> Athletes app. Do not restore any of the old wording from the change log below.

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

### `pilot-health-track.jpg` — the same event, cut to the track
**Added in the /pilots/ rebuild (wave 8), and it is now the file that page ships.**
The band is `left 0, top 800, 2400 × 800` of `pilot-health.jpg`: shorts, legs, shoes,
lane lines, the red of the track. No face, no shirt graphic, no school name.

The frame it replaces was the whole photograph, full-bleed at 1440 × 780, directly under
the headline *Healthy Athletes* — a real, identifiable child of about seven fronting a
Special Olympics programme she has no relationship to, on a page written for funders. The
picture was always illustrating *the event*, not *her*; this crop is the picture doing
only that. **No second contrast pass** was applied: the master already carries the house
+4.5% and doubling it is not neutral.

`pilot-health.jpg` stays on disk as the master this is cut from. Nothing references it.

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

---

# Content notes — /pilots/ copy

## What the page asserts, and where every assertion comes from

`refs/BRIEF.md` gives each pilot exactly one sentence. Those sentences carry facts the
page used to throw away, and the `detail` block in `src/data/site.js` is those facts and
nothing else:

| slot | source |
|---|---|
| `detail.what` | the brief's own one-line description of the pilot (adherence / reminders / navigation; clean power, jobs, affordability, community benefit; AI on maternal health data + intervention; personalised guidance school to work) |
| `detail.who` | the population named in the same sentence (Medicaid mothers; low-income students; …) |
| `detail.where` | the *kind* of setting the pilot is defined around, in the conditional. Only 03 has a real place in the brief — Indianapolis. |
| `Measured by` | the pilot's existing `goal` string, unchanged |
| `Proposed by` | the pilot's existing `partner` string, with the site-wide "Proposed" qualifier |
| `detail.needs.*` | `/partner/`: "Every pilot still needs money, a technology, or somewhere real to run it." The three roles are that page's own Fund it / Build it / Run it. |

## To be confirmed — slots deliberately left empty

None of the following is in the brief or the prospectus extract, so none of it is on the
page. **Do not fill any of these in without the client.**

1. **Who builds each pilot.** No technology partner is named for any of the four. The page
   says so, in the `Technology` slot of "What it still needs", rather than implying a
   builder exists.
2. **Who runs each pilot.** No implementation partner — no health system, district, state
   agency or community organisation — is named for any of the four. The `Somewhere to run
   it` slot names the *kind* of institution each pilot needs, drawn from the brief's own
   list ("health systems, universities, community orgs, and government"). No specific
   institution is claimed.
3. **Where 01, 02 and 04 would run.** Only Indianapolis (03) is a real place in the source.
   01 says "wherever Healthy Athletes screenings already happen", 02 "one state", 04
   "public school districts" — the settings the pilots are defined around, not locations.
4. **Which of the three asks is already met for any given pilot.** `/partner/` says "Most
   need two of the three", which implies at least one is sometimes covered; the source
   never says which, for which pilot. The page therefore lists all three for all four and
   claims nothing about what is already in hand.
5. **Budget, start date, cohort size, and the identity of the measuring party.** Absent
   everywhere. No number appears on this page that is not in the source: `3–12 months`
   (brief), and `ninety days` (the pilot's own pre-existing goal string).
6. **Board and partner status.** Unchanged from the rest of the site: named partners are
   sought, none is signed. The page states this at reading size under the masthead rule,
   and repeats the qualifier beside every partner name.

## What was cut, and why

**The twelve-month axis** (`src/components/pilots-scale.astro`, deleted). It was a
beautifully drawn object and it encoded exactly one fact — that ninety days is a quarter
of twelve months — which the sentence set through it already stated in words. It cost
about 200px of the page's best space to repeat its own caption, and it split the goal
sentence in half so the eye had to jump a chart to finish reading it. There is no
per-pilot schedule data that would let it carry anything else: all four horizons are the
same `3–12 months`. The window is now stated once, as a term, in the masthead.

## Facts the site needs and does not have

Three independent fact-checkers audited every claim on `/pilots/` against
`refs/BRIEF.md`. Five specifics had been authored rather than sourced and have
been removed: a ninety-day follow-up window, a national infant-mortality
ranking for Indianapolis, a lead time of "weeks", a state siting agreement as
the legal instrument, and a claim about counsellor provision.

Nothing has replaced them, because only you can supply the real figures. A
funder cannot currently size, score, or schedule any of these pilots. To make
the page decidable, each pilot needs:

- **A cost.** A range is enough. "Underwrite one pilot, end to end" is the
  entire financial content of the site and it appears identically four times.
  A programme officer cannot route a request she cannot size.
- **A baseline and a target.** Every goal is currently a direction, not a
  number: follow-up care completed by X% within Y, against Z% today. Without a
  baseline no goal can be judged ambitious or trivial.
- **A scale.** How many athletes, mothers, students, districts; one state or a
  model for fifty.
- **A start date** and a decision-by date for a funder.
- **Who measures it**, against which data, and where it publishes. For the
  Indianapolis pilot specifically: data access, IRB, privacy, and who validates
  the model — the first questions any health programme officer asks.
- **Whether any of the three asks is already met** for any pilot.

Also unresolved, and only you can settle them:

- **Governor Inslee appears both as a pilot partner and on the prospective
  board.** That tension is in the source material.
- **Prospective board titles** are best-effort and need confirming per person.
- **No portraits.** `founder-mckelvy.jpg` and `founder-olanoff.jpg` are
  deliberately absent; drop them into `public/media/` and the People page uses
  them. A Lion Forum stage photograph would replace the Block Island frame the
  Forum page currently uses as an evocative stand-in.

## Not a public website

This is shared by link with funders, partners and prospective board members —
closer in kind to the prospectus than to a public site. `robots.txt` disallows
everything, `vercel.json` sends `X-Robots-Tag: noindex, nofollow, noarchive,
noimageindex` on every host, and the same directive is in the HTML so it
travels if the site is served from somewhere else. There is no sitemap.

**That is obscurity, not access control.** Anyone with the link can open it, and
a link forwarded once is a link in the wild. If the contents warrant it —
sixteen portraits of people who have not agreed to serve is the obvious case —
put Vercel's password protection in front of the deployment. That is a project
setting, not something this repo can do.

## Board portraits — provenance and the permission gap

Sixteen headshots were supplied by the client (`Prospectus_document_review.zip`,
`uploads/Headshots/thumbs/`), one for every name on the prospective board. They
are processed to a single monochrome treatment at 480×480 and live in
`public/media/board/`, keyed by surname.

Two things are unresolved and only the client can resolve them:

1. **Permission per person.** Lower stakes than they would be on a public
   site — a link-shared page is much closer to the prospectus these portraits
   came from. Still worth a check on two points: several are official portraits
   of federal and state officials, which usually carry a required photographer
   credit, and a link that gets forwarded stops being private. Not a blocker;
   a thing to know.

2. **They have not agreed to serve.** The board is *prospective*. Sixteen
   portraits in a grid is the strongest possible visual assertion that a board
   exists, and it will be read that way regardless of the label above it. The
   page has to carry that qualification structurally. If any of these people
   has not been asked, showing their face here is a materially bigger claim
   than showing their name.

## Lion Forum photographs — owned, no credit

The Institute owns the Lion Forum photography. No photographer attribution is
required or wanted on any of it.

Five frames have been shown but have not reached the repository: two on stage
against the branded backdrop, Governor Inslee speaking, a speaker with a
notebook, Aneesh Chopra at a reception, and the lawn at dusk with the flagpole
and the harbour behind it.

**Pasted images do not reach the filesystem — a zip does.** The sixteen board
headshots arrived because they were zipped. Send these the same way and they
can be wired in immediately.

Still to decide when they arrive: whether attendees at a private,
invitation-only convening may be shown by name and face. Governor Inslee on
stage is plainly fine. The reception and crowd frames put identifiable guests
in shot, which is a different question from the stage.

### The slots are built and waiting — drop the files in

`/forum/` and the homepage Forum scene now resolve each photographic beat
against the filesystem **at build time**. Put a file at the path below and it
appears with its own framing, its own `alt` and its own credit rule; put
nothing there, as today, and the page renders exactly as it does now — no gap,
no placeholder, no broken image. Nothing else has to be edited to wire these
in. Paths and strings live in the `forum.photos` object in `src/data/site.js`.

| slot | file | where it lands | corner label |
| --- | --- | --- | --- |
| `lawn` | `public/media/forum-lawn.jpg` | **the /forum/ masthead** and the homepage held scene — replaces the Block Island stand-in in both | `Hyannis Port, Massachusetts` |
| `stage` | `public/media/forum-stage.jpg` | **the /forum/ plate**, the full-bleed band above the close | none — the branded backdrop says where it is |
| `podium` | `public/media/forum-podium.jpg` | the room band, between the claim and the ledger | none |
| `notebook` | `public/media/forum-notebook.jpg` | the room band | none |
| `reception` | `public/media/forum-reception.jpg` | the room band | none |

**The room band does not exist until one of its three files does.** With one
file it is a single ~400px plate; with three it is a row of three. It carries
no page type, no names, and no caption. That is the wave-8 rule restated: the
size of a frame is part of the claim it makes about the people in it, and
these are the frames with identifiable guests. Do not promote one of them to
full bleed.

**Six things to check on arrival, in this order.**

1. **`lawn` — is it the Compound?** The masthead credit says
   `Hyannis Port, Massachusetts`. It is the first time this site has been able
   to make that claim with a picture rather than a headline. If the client
   cannot confirm the frame, set that credit to `''` — an unlabelled lawn at
   dusk makes no claim on its own — and leave `forum.place` to say where the
   convening is.
2. **Every `alt` string was written from a description, not from a picture.**
   Nobody here has seen these frames. Read each one against the actual file
   and correct it. An alt text is a claim about a photograph like any other.
3. **`notebook` and `reception` are not cleared.** The open question above —
   whether guests at a private convening may be shown by name and face —
   applies to both. A file on disk renders; do not put one there before that
   is settled. `stage` and `podium` are public speaking on a public stage.
4. **No name goes on the page.** `podium` is Governor Inslee and `reception`
   is Aneesh Chopra; both are recorded here and neither appears in any string
   the site renders. Naming an attendee is an assertion about who attends,
   which is the class of claim three fact-checks have already had to strip.
5. **Retune the framing.** The `focal` values for `lawn` (both the masthead
   and the homepage hold) and for `stage` are guesses at pictures nobody has
   seen. The masthead's display stack also returns to the **left rail** on
   arrival: hanging it right is an answer to the stand-in's empty right half,
   not a rule. Re-hang it right only after looking at the new frame and
   finding the same open space.
6. **Then delete the stand-in.** `public/media/forum.jpg` (and its `.webp` and
   `@1200` variants) comes off the site once `lawn` and `stage` are both in.
   It was an honest stand-in for a place we had no picture of; it is not to be
   kept as decoration. `refs/PHOTO-FACTS.md` says the same.

A slot may also carry a `ratio` if the picture cannot survive the band's 4:5
crop — the reception frame is the likely one. Set it after looking at the
photograph, not before.

## /forum/ copy — what the page asserts, and where it comes from

Every string on the page traces to `refs/BRIEF.md`:

- invitation-only convening at the Kennedy Compound, Hyannis Port
- founders, investors, elected officials
- the Institute is a lead sponsor
- it uses the Forum to recruit pilot partners and report results back

Nothing else is asserted. The page answers a fourth question it used to leave
open — how one might be invited — and answers it with the only two things the
brief supports: the room is invited, and the Institute is in it.

### Deliberately absent from /forum/, and why

| not on the page | why |
| --- | --- |
| dates, a season, a year | the brief gives none |
| how often the Forum sits | unknown |
| how many attend | unknown; an unverified count was already stripped from /people/ once |
| a programme, agenda or session list | invented if written |
| any attendee's name | naming an attendee asserts who attends; see item 4 above |
| who issues invitations, and what a sponsor's say over the list is | unknown. "There is no application. The room is invited." is the whole of what can be said |
| what happens after an inquiry | unknown; the page promises nothing |
| pilots recruited or results reported at the Forum, in the specific | no partner is signed |

If the client can supply any of the above **in writing**, most of them are one
short line each and the ledger has room for a fourth row.


---

# Wave 10 — the truth pass, and what is still open

Four independent reviewers (a fact-checker, a foundation programme officer,
the craft critic, a sceptical journalist) went over the rendered site. All four
said the same thing: craft is not the problem, the truth layer is. Every
finding they raised was an assertion the sources do not carry, and the pattern
was consistent — the qualifier ("proposed", "sought", "not seated") was always
present somewhere on the site and always absent from the largest type.

## Removed this wave

| where | was | now | why |
| --- | --- | --- | --- |
| `src/pages/people.astro` claim | "Advising the pilots we run. Opening the doors they need." | "A board to advise the pilots. To open the doors they need." | Two present participles asserting that sixteen named people are doing work for an organisation none has joined, over their own photographs, 90px above `00 SEATED`, and on pilots the Institute does not run. The mood is purposive now. |
| `src/pages/partner.astro` pilots bridge | "Each pilot is named for whoever proposed it. None is signed." | "Partners named are sought for 2026. None is signed." | Attributed initiative to a former U.S. Secretary of Education and a former Governor. No source says who originated any pilot. It also pointed the opposite way from the homepage and /pilots/, which both said *sought*. Now the same sentence all three ship. |
| `src/pages/partner.astro` lede | "…money, a technology, **or** somewhere real to run it. Most need two of the three." | "…money, a technology, **and** somewhere real to run it." | A distribution invented over four pilots that have never run, contradicting this page's own headline 1,550px below and /institute/. All four `needs` blocks in site.js carry all three. |
| `src/components/Footer.astro`, `src/components/Nav.astro` | "Hyannis Port · Washington, D.C." | *(removed)* | An invented pair of office locations in the canonical address position, on all seven pages and in the mobile drawer — fourteen impressions. Neither string is in BRIEF.md or site.js. Hyannis Port is where the Forum convenes; Washington, D.C. appears in no source at all. |
| `src/components/scenes/Hero.astro` eyebrow | "Four pilots · 2026" | "Four pilots, proposed · 2026" | The word *proposed* was on every other surface and nowhere in the first viewport of the front door, at either width, above four named institutions and officials. Also applied to the /pilots/ masthead eyebrow for one grammar. |
| `src/components/scenes/PeopleScene.astro` headline | "Sixteen people **asked** to govern the work." | "Sixteen **put forward** to govern the work." | `people-cohorts.js` already holds this rule and /people/ already shipped it: *asked* asserts an invitation was extended to sixteen named living people, and nobody has confirmed one was. |
| `site.js` `forum.role` | "a **lead** sponsor" | "a **major** sponsor" | BRIEF.md says major. Lead sponsor is a named rank in a sponsorship hierarchy, and it was the largest type on /forum/. |
| `site.js` `forum.roleNote` | "Pilots find their partners in this room, and come back to it to report what happened." | "The Institute is there to find pilot partners, and to bring results back to the room." | Present-tense recurring practice for something no pilot has done once. BRIEF states it as intent. |
| `site.js` pilot 03 `problem` | "Infant mortality in Indianapolis, **concentrated among Medicaid mothers**." | "Infant mortality in Indianapolis." | An epidemiological claim about a named city's health data, asserted flatly with no source. Same category as the national ranking already stripped. `detail.who` carries the population the intervention is for, which is what BRIEF actually says. |
| `site.js` pilot 03 `tagline` | "Risk found early, **in the weeks that decide outcomes**." | "Risk found in the data, and acted on." | An asserted clinical window — the "ninety-day window" this file already recorded as removed, rewritten as prose so it no longer looked like a number. |
| `site.js` pilot 04 `goal` | "**More** students land in a defined pathway." | "Students land in a defined pathway." | A comparative with no baseline to compare to. |
| `src/pages/people.astro` board `alt` | "…**sixteen chairs** set around a long table…" | "…chairs set around a long table…" | A fabricated count, and it was exactly the size of the board, asserted 200px above "Sixteen put forward" — turning a 1936 exposition hall in Dallas into a room laid for this board. Neither PHOTO-FACTS nor ATTRIBUTIONS records a chair count; there are fourteen. |
| `institute.jpg` credit (both uses) | "Library of Congress" | "Dallas, Texas" | See refs/PHOTO-FACTS.md. The corner label's job is location, not attribution, and an archive name does nothing to stop the "Institute's own room" reading this file exists to prevent. |
| `site.js` pilot 01 `credit` | "Unified track event · U.S. Army" | "Unified track event · Camp Humphreys, Korea" | The only pilot credit with no location, in a column where the other three are U.S. place-names. PHOTO-FACTS: never imply the frame is domestic. In that set, omitting the location IS the implication. |

## The one the reviewers could not see: 72 comments were shipping in view-source

Astro emits `<!-- … -->` to the browser and strips `{/* … */}` at build. This
repo writes long, candid comments — they are the best thing in it — and 61 of
them were written in the HTML form, which rendered as **72 comments in the
built pages** (some components repeat per card). On a link going to funders,
partners and journalists, view-source is part of the page.

The worst of them was on the **homepage**, in `src/components/scenes/Hero.astro`:

> "The lower half's job is proof. **The four institutions that agreed to run a
> pilot** are the only credential this page has…"

That is false, it is the precise claim the entire site is built to avoid, and
it was one Ctrl-U away from the four names it describes. Others shipping in
`/partner/` admitted a deleted sentence, described a "real child at a Special
Olympics meet" used as ground, and quoted a git SHA and a critic's verdict.

**Fixed both ways.** The Hero sentence is corrected in source. All 61 markup
comments are now `{/* … */}`; the built pages carry **zero** HTML comments and
the CSS minifier already stripped `/* */` from the stylesheets. Not one word of
rendered text changed — verified word-for-word against the previous build —
and every page height in `tools/shoot.mjs` is identical. `AGENTS.md` carries
the rule now.

## Still needed from the client — nothing below can be written from a source

Each of these is a hole a reviewer walked into. **Do not fill any of them by
inference.** A missing fact is recoverable; a fabricated one attributed to a
real partner is not — that failure has now happened five times on this project.

### 1. The size of the ask. *(the foundation officer's blocker)*

There is no number anywhere on the site and no promise of one: zero dollar
signs, zero ranges, no "budget available on request" across seven pages. The
only statement of the ask is "One pilot, end to end." — `needs.fund`, repeated
identically under all four pilots in `src/data/site.js`, and again as door 01
on `/partner/`.

A programme officer cannot tell whether this is a $75k discretionary cheque or
a $3M board item, and that single fact decides who at a foundation reads the
link and what they write back. **No budget exists yet, so the fix is not a
figure — it is one honest line the client will stand behind** about when a
costed budget appears. One sentence, and it goes under door 01 on `/partner/`.

### 2. Whether each named pilot partner has actually been approached.

The site now says, in one voice on three pages, "Partners named are sought for
2026. None is signed." That is the most conservative reading of BRIEF.md, which
lists the four pilots by partner name and states nothing about who initiated
what.

But *sought* is still a claim about a real person: it says the Institute has
approached Special Olympics, Governor Inslee, Butler University and Secretary
Cardona. **Only the client knows whether each has been contacted, and whether
each consents to being named on a public link.** If any has not, that name
cannot stay in the pilot slot in any form. If any of the four in fact brought
the proposal to the Institute, "sought" is wrong for that pilot — but it must
be corrected per pilot, in writing, not restored as a blanket sentence.

### 3. A real metric for each pilot.

`/pilots/` sets the label **MEASURED BY** at ~34px over four sentences, and not
one of the four has a baseline, a unit or a target:

- "Those terms adopted by one state."
- "Care completed, not just recommended."
- "Risk identified early enough to act on."
- "Students land in a defined pathway."

The page above them promises "One measurable outcome each." A reader who has
been told *measured* and is handed a sentence starts to wonder whether anyone
has thought about evaluation. Two acceptable resolutions, both requiring the
client: supply the metric, or state plainly when the metric gets set (e.g.
that it is agreed with the partner before the pilot starts). **Do not invent a
number for this slot.** The label may be worth changing if neither can be had.

### 4. Legal and fiscal status.

`grep` across all seven pages: zero occurrences of 501(c), nonprofit, charity,
fiscal sponsor, EIN. A foundation cannot process a grant without knowing what
the Institute is. Nothing in BRIEF.md says. One line in the footer would carry
it — and the footer now has room, since the invented offices came out of it.

### 5. An address, if there is one.

"Hyannis Port · Washington, D.C." is gone from the footer and the mobile menu
because no source carries it. If the Institute has a real registered address,
that is where it goes and the slot is empty and waiting.

### 6. "A person answers."

`/partner/`, under the mailto. It is a first-party promise about the
Institute's own behaviour rather than a claim about a third party, so it is
left standing — but nobody has confirmed it. If no one is staffing that
mailbox, it is the first thing a partner will discover is untrue.

### 7. Still open from earlier waves

- `partners@lionforuminstitute.org` and the domain in `astro.config.mjs` are
  invented and unconfirmed. This is the site's only call to action.
- The sixteen board one-line titles are unconfirmed.
- Per-person permission to publish a likeness is unconfirmed, for all sixteen.

## Two things looked at and deliberately left alone

- **`/people/` h1, "The people accountable for the work."** A prospective board
  is not yet accountable for anything. It stays because the qualifier is in the
  same viewport and in the reader's path: the bridge above it is future-tense
  ("the people who **will** answer for it") and the ledger directly beneath it
  reads `02 FOUNDERS / 16 PROSPECTIVE BOARD`. That is the test the reviewers
  set — the hedge on the same screen as the largest type — and this line passes
  it. If the h1 is ever moved away from that ledger, it has to change.
- **`/institute/`, "Every pilot runs the same way."** Present tense for a method
  no pilot has run. It reads as a statement of method rather than of history,
  the method is BRIEF.md's, and the eyebrow two rungs above it says
  "Four pilots, proposed". Watch it; do not let it acquire an object.

## Adding the photographs when they arrive

One command does the whole job — extract, match, resize, convert, place:

```bash
node tools/add-photos.mjs ~/Downloads/lion-forum-photos.zip
```

It accepts a zip, a folder, or loose files. It matches on filename, refuses
anything under 1400px wide, and will not assign a picture to a slot by
position unless you pass `--accept-guesses` — a photograph in the wrong slot
makes a claim nobody checked. To be explicit:

```bash
node tools/add-photos.mjs lawn=lawn.jpg stage=stage.jpg podium=inslee.jpg \
  notebook=speaker.jpg reception=chopra.jpg founders=office.jpg
```

Slots: `lawn` (Forum masthead and the homepage held scene), `stage`,
`podium`, `notebook`, `reception`, `founders`.

Then, and this part is not optional:

1. **Look at each one.** The `alt` strings in `src/data/site.js` were written
   from a description of pictures nobody here has seen. An alt text is a claim
   about a photograph like any other.
2. **Confirm the lawn frame is the Kennedy Compound.** If it cannot be
   confirmed, set its credit to `''` and the picture makes no claim on its own.
3. Re-run `tools/photo-meter.mjs` and `tools/credit-sweep.mjs`.
