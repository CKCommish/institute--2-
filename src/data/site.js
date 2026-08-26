export const site = {
  name: 'Lion Forum Institute',
  short: 'Lion Forum Institute',
  mission:
    'The Lion Forum Institute exists to ensure the technologies of tomorrow strengthen American families today.',
  email: 'partners@lionforuminstitute.org',
};

export const nav = [
  { label: 'Institute', href: '/institute/' },
  { label: 'Pilots', href: '/pilots/' },
  { label: 'Forum', href: '/forum/' },
  { label: 'People', href: '/people/' },
];

export const cta = { label: 'Partner on a pilot', href: '/partner/' };

/* ── The four 2026 pilots ───────────────────────────────────────────

   TWO LAYERS, and the split is the brief's ("Cards first. Detail on click
   or a short dedicated block."):

     THE CARD    index · partner · field · title · tagline, then
                 problem / approach / goal, ONE LINE EACH. That limit is
                 the brief's and it governs the card. It never governed
                 the page.

     THE DETAIL  `detail`, below. What a programme officer has to leave
                 with: what the pilot actually does, who it is for, the
                 kind of place it would run in, and — set apart, because
                 it is half the truth about a proposed pilot — what it
                 still needs. SIX FIELDS, ONE SHORT LINE EACH — the same
                 cap the brief puts on a card field, because that is the
                 only reading of "at most 3 short lines of supporting
                 text" a dedicated detail block can honour: prose is
                 capped at three lines (see pilots-detail.astro), and
                 everything else here is a labelled fact, not a sentence.
                 `who` names the PEOPLE and `where` names the PLACE — if a
                 value repeats the other's noun, one of them is wrong.

   EVERY STRING IN `detail` IS A RESTATEMENT OF refs/BRIEF.md, nothing
   more. The brief gives each pilot one sentence; those sentences carry
   facts the old page threw away (adherence / reminders / navigation;
   clean power, jobs, affordability, community benefit; Medicaid mothers
   in Indianapolis; low-income students, school to work). They are here.
   What the brief does NOT give — a named state, a named district, a
   named health system, a budget, a start date, a technology partner —
   is ABSENT, and its absence is the `needs` block. See CONTENT-NOTES.md
   for the list of slots deliberately left empty.

   `needs.run` is the only slot that names a KIND of institution the
   brief does not name for that pilot individually; the brief's own list
   of implementation partners ("health systems, universities, community
   orgs, and government") is the source, and the mood is conditional
   throughout. Nothing here says a pilot is running, funded or sited. */
/* FACTUAL DISCIPLINE — read before editing any string below.
   Every claim here must be traceable to refs/BRIEF.md. These pilots are
   PROPOSED: no partner is signed, no budget is set, no target is agreed.
   Three independent fact-checkers found that this file's most quotable
   specifics had been authored rather than sourced — a ninety-day window, a
   national infant-mortality ranking, a lead time of "weeks", a siting
   agreement as the legal instrument. All are now removed. Do not reintroduce
   a number, an interval, a ranking or a named instrument unless the brief
   supplies it; a missing fact is recoverable, a fabricated one attributed to a
   real partner is not. Facts still needed from the client: CONTENT-NOTES.md. */
export const pilots = [
  {
    id: 'healthy-athletes',
    index: '01',
    partner: 'Special Olympics',
    title: 'Healthy Athletes',
    tagline: 'A free screening becomes real follow-up care.',
    field: 'Health',
    problem: 'Screenings find the problem. Care rarely follows.',
    approach: 'An app that carries the result home.',
    goal: 'Care completed, not just recommended.',
    horizon: '3–12 months',
    /* The 3:1 band cut from the foot of the Army frame. The full frame is
       a seven-year-old girl at a Unified track meet in South Korea, face
       and school name legible, and at 1440 wide it filled the screen under
       a Special Olympics headline — a real, identifiable child fronting a
       programme she has no relationship to. The band keeps the event and
       drops the individual: a stride, a lane, a track. See PHOTO-FACTS. */
    image: '/media/pilot-health-track.jpg',
    /* ── THE PLATE GRADE, PER SOURCE ────────────────────────────────
       Measured over the exact 537.7 x 358.4 plate box on /pilots/ at 1440,
       the four frames arrived as four commissions: mean chroma 41.7 / 22.0 /
       20.7 / 13.3 — a 3.1x span — and the hue swung warm-red, cool-blue,
       warm, neutral across four blocks a reader scrolls in ten seconds.
       One `grade` could not close that, because `grade` is one number and
       the four sources differ in saturation, not in exposure. So each frame
       now carries its own trim on the two colour halves of the house grade
       (`sat`, `tint`) plus a hue correction (`warm`), chosen against the
       meter, not by eye. Re-measure before changing any of these; they are
       a SET, and a number moved on one frame is only correct if the other
       three still hold.

       ── AND THE ONE COLOUR A READER ACTUALLY AUDITS: SKIN ──────────
       Frame-mean chroma was matched and skin was not, which is the half of
       the match nobody sees and the half everybody does. Sampled inside the
       rendered plates at 1440 (the runner's calf, the mother's cheek, the
       welder's forearm), the set read 113/109/121, 167/157/156 and
       135/120/119 — R-B -8.4 / +11.4 / +16.6, a 25-point swing in human
       skin, with 01 alone sitting on the blue side of neutral. A frame-mean
       cannot see that: a lavender calf inside a plate whose track is
       terracotta averages out to the same number as a warm cheek in a grey
       room.

       So the trims are now set against SKIN, in Lab, where lightness is
       divided out and three faces at L* 17, 52 and 65 can be compared at
       all. Held target: skin b* 0 +/- 1.5 and a* 3-7 on the three frames
       that carry a person; frame chroma 4.5-6.5 on all four. Measured after:
       skin R-B +4.2 / +6.0 / +8.7 (span 4.5, was 25.0) and skin b*
       -1.2 / -0.4 / -1.0 (span 0.8, was 10.3). `warm` carries most of the
       correction because hue-rotate runs BEFORE the desaturate and the navy
       blend, so it steers what colour survives rather than adding one.

       01 pays for this at the frame: its ground is a red track, and any
       setting that puts its calf on the same side of neutral as the other
       two skins also warms the track (frame R-B -9.0 -> +0.9). That is the
       right trade. The track is scenery a reader never audits; the calf is
       the one surface she reads as a person.

       01 is also the only frame with a CROP problem. It is a privacy crop
       (PHOTO-FACTS: the master is an identifiable seven-year-old and the
       face may not come back), and at zoom 1 the band read as a headless
       waist-down figure adrift in a field of terracotta — the loudest,
       most saturated object on the page, and it is first. The crop now
       closes on the stride itself: legs, shoes, two lane lines. Same
       privacy, an actual subject, and a third less open track. */
    plate: {
      grade: 0.5, sat: 2.8, tint: 2.55, warm: 19, lift: 1.2,
      zoom: 1.3, focal: '28% 70%',
      zoomSm: 1.18, focalSm: '26% 70%',
    },
    /* What the PHOTOGRAPH is, not what the pilot is. See refs/PHOTO-FACTS.md:
       a pilot's name set over a full-bleed frame reads as a caption for it. */
    credit: 'Unified track event · U.S. Army',
    detail: {
      what: 'Reminders, adherence and navigation.',
      who: 'Athletes who take a free screening.',
      where: 'Special Olympics screening events.',
      needs: {
        fund: 'One pilot, end to end.',
        build: 'A team to build the app.',
        run: 'A programme, and follow-up care.',
      },
    },
  },
  {
    id: 'clean-data-centers',
    index: '02',
    partner: 'Governor Jay Inslee',
    title: 'Clean Data Centers',
    tagline: 'States negotiate the buildout instead of absorbing it.',
    field: 'Energy',
    problem: 'Data centers arrive before states set terms.',
    approach: 'A playbook for the negotiating table.',
    goal: 'Those terms adopted by one state.',
    horizon: '3–12 months',
    image: '/media/pilot-energy.jpg',
    /* the cool outlier: +22 blue-over-red before the trim. See pilot 01. */
    /* 02 IS IN THE TINT LAYER LIKE THE OTHER THREE. It used to carry
       `tint: 0` — unified by desaturation alone, so it was the one frame
       that would not have followed the set if --fig-tint were ever retuned,
       and at frame chroma 4.1 (against 6.7 on 01) it was already the
       flattest of the four, its tree line drained to grey. It is a neutral
       overcast sky over most of its area, so it takes the smallest dose in
       the set rather than none: chroma 4.1 -> 5.2 and the foliage comes
       back, at a cost of 2.8 points of frame R-B. It has no skin in it. */
    plate: { grade: 0.5, sat: 4.6, tint: 0.9, warm: 35, lift: 0.1 },
    /* What the PHOTOGRAPH is, not what the pilot is. See refs/PHOTO-FACTS.md:
       a pilot's name set over a full-bleed frame reads as a caption for it. */
    credit: 'Muskingum County, Ohio',
    detail: {
      what: 'Clean power, jobs, affordability, community benefit.',
      who: 'State governments, and affected communities.',
      where: 'One state, at the point of siting.',
      needs: {
        fund: 'One pilot, end to end.',
        build: 'A partner to build the playbook.',
        run: 'A state preparing to negotiate.',
      },
    },
  },
  {
    id: 'infant-mortality',
    index: '03',
    partner: 'Butler University',
    title: 'Infant Mortality',
    tagline: 'Risk found early, in the weeks that decide outcomes.',
    field: 'Health',
    problem: 'Infant mortality in Indianapolis, concentrated among Medicaid mothers.',
    approach: 'Maternal health data read for early risk.',
    goal: 'Risk identified early enough to act on.',
    horizon: '3–12 months',
    /* The re-cut master, which ends before the second adult in the USDA
       original. `pilot-maternal-crop.jpg` was the wave-4 workaround and is
       obsolete; /pilots/ carried the correction as a component override
       until now. See refs/PHOTO-FACTS.md. */
    image: '/media/pilot-maternal.jpg',
    /* the warm interior. See pilot 01. */
    plate: { grade: 0.5, sat: 1.5, tint: 2.98, warm: -7, lift: 2.0 },
    /* What the PHOTOGRAPH is, not who owns it. This one frame's subject is a
       private individual at full scale, so the credit names the room she is
       standing in rather than the federal agency that holds the rights. */
    credit: 'Family child care home · USDA',
    /* The one pilot frame that ships real alt text: the other three are
       places and events the copy already describes, this one is a person. */
    alt: 'A mother holds her infant against her shoulder in the doorway of a family child care home.',
    detail: {
      what: 'Maternal health data read early, and acted on.',
      who: 'Mothers on Medicaid.',
      where: 'Indianapolis.',
      needs: {
        fund: 'One pilot, end to end.',
        build: 'A partner to build the model.',
        run: 'A health system, alongside Butler.',
      },
    },
  },
  {
    id: 'career-pathways',
    index: '04',
    partner: 'Secretary Miguel Cardona',
    title: 'Career Pathways',
    tagline: 'Guidance that follows a student from school to work.',
    field: 'Education',
    problem: 'The largest choices, with the least guidance.',
    approach: 'Built with districts, school to work.',
    goal: 'More students land in a defined pathway.',
    horizon: '3–12 months',
    image: '/media/pilot-education.jpg',
    /* already close to the target; it is the frame the other three were
       brought toward. See pilot 01. */
    plate: { grade: 0.5, sat: 1.1, tint: 2.95, warm: -10, lift: 0.8 },
    /* What the PHOTOGRAPH is, not what the pilot is. See refs/PHOTO-FACTS.md:
       a pilot's name set over a full-bleed frame reads as a caption for it. */
    credit: 'Adrian, Oregon',
    detail: {
      what: 'Personalised guidance, school through to work.',
      who: 'Low-income students.',
      where: 'Public school districts.',
      needs: {
        fund: 'One pilot, end to end.',
        build: 'A partner to build the guidance.',
        run: 'A district willing to run it.',
      },
    },
  },
];

/* The terms every one of the four is offered on, stated once at the top of
   /pilots/ instead of four times down it. Every value is refs/BRIEF.md or
   copy already shipped elsewhere on this site:
     · 3–12 months, measurable outcome, publish the lesson  → BRIEF
     · "None is signed."                                    → /partner/
     · "money, a technology, or somewhere real to run it"   → /partner/ */
export const pilotTerms = [
  {
    key: '3–12',
    term: 'Months',
    text: 'From the first week to a published result.',
  },
  {
    key: 'Proposed',
    term: 'Status',
    text: 'Named partners are sought for 2026. None is signed.',
  },
  {
    key: 'Either way',
    term: 'Published',
    text: 'One measurable outcome each, reported whatever it says.',
  },
];

/* ── How the institute works ──────────────────────────────────────── */
export const method = [
  { index: '01', title: 'Find the problem', text: 'One an institution already owns.' },
  { index: '02', title: 'Match the partners', text: 'Who builds it. Who runs it.' },
  { index: '03', title: 'Measure, then publish', text: 'Whatever the result.' },
];

/* ── People ───────────────────────────────────────────────────────── */
export const founders = [
  {
    name: 'Christopher Kennedy McKelvy',
    role: 'Co-founder',
    lines: [
      'Founding Partner, K. Ventures',
      'Founding Partner, The Lion Forum',
    ],
    detail: 'Army Ranger. Oculus and Meta. MPA, Harvard.',
    portrait: '/media/founder-mckelvy.jpg',
  },
  {
    name: 'Judd Olanoff',
    role: 'Co-founder',
    lines: [
      'Founding Partner, K. Ventures',
      'Founding Partner, The Lion Forum',
    ],
    detail: 'MBA, Stanford. MPA, Harvard. BA, Amherst.',
    portrait: '/media/founder-olanoff.jpg',
  },
];

/* Prospective board — names and one short line only.
   NOTE: titles are pending client confirmation. See CONTENT-NOTES.md */
export const board = [
  { name: 'John Bailey', line: 'Senior Fellow, American Enterprise Institute' },
  { name: 'Roy Bahat', line: 'Head, Bloomberg Beta' },
  { name: 'Aneesh Chopra', line: 'First Chief Technology Officer of the United States' },
  { name: 'Guy Filippelli', line: 'Founder, RedOwl Analytics' },
  { name: 'Michael Hole', line: 'Pediatrician; Professor, UT Austin' },
  { name: 'Galym Imanbayev', line: 'Partner, Lightspeed Venture Partners' },
  { name: 'Governor Jay Inslee', line: 'Governor of Washington, 2013–2025' },
  { name: 'Tess deBlanc-Knowles', line: 'Former Special Advisor for AI, White House OSTP' },
  { name: 'Robin McIntosh', line: 'Co-founder and Co-CEO, Workit Health' },
  { name: 'Nate Mitchell', line: 'Co-founder, Oculus' },
  { name: 'Gina Raimondo', line: 'U.S. Secretary of Commerce, 2021–2025' },
  { name: 'Kyla Scanlon', line: 'Writer on the economy' },
  { name: 'Jake Sullivan', line: 'U.S. National Security Advisor, 2021–2025' },
  { name: 'Bradley Tusk', line: 'Founder, Tusk Ventures' },
  { name: 'Julie Yoo', line: 'General Partner, Andreessen Horowitz' },
  { name: 'Helen Zhang', line: 'Investor' },
];

export const forum = {
  name: 'The Lion Forum',
  place: 'Kennedy Compound, Hyannis Port',
  access: 'By invitation',
  line: 'The people who build sit with the people who decide.',
  /* THE CLOSE, set on cream at the series-breaker rung. One sentence that
     states the relationship, one that says what the Institute does with it.
     No third line — the brief's supporting-line budget is spent here. */
  role: 'The Institute is a lead sponsor of the Lion Forum.',
  roleNote: 'Pilots find their partners in this room, and come back to it to report what happened.',
  /* The substance beat. A foundation officer has to leave this page knowing
     what the convening is, who is in it, and why the Institute is there.

     THREE ENTRIES IS NOT THE SAME AS THREE LINES, and refs/BRIEF.md caps the
     LINES: "any section: at most 3 short lines of supporting text". These
     rows used to run 68 / 114 / 121 characters, which set two lines each at
     1440 — six rendered lines for a three-line budget, and ten on a phone.
     Each row is now one rendered line at BOTH widths (≤ 34 characters, the
     narrowest sentence measure the mobile ledger offers), so the beat spends
     exactly three. `who` in §2 carried the same words as `The room` and came
     off the page rather than being said twice. */
  brief: {
    eyebrow: 'What it is',
    rows: [
      { term: 'Format', text: 'By invitation, at the Compound.' },
      { term: 'The room', text: 'Founders, investors, officials.' },
      { term: 'Why it matters', text: 'They rarely meet this early.' },
    ],
  },
  cta: 'Inquire about the Forum',
  image: '/media/forum.jpg',
  /* What the PHOTOGRAPH is — a harbour at dusk on Block Island, RI. It is not
     Hyannis Port and must never be set where it reads as one with `place`.
     See refs/PHOTO-FACTS.md. */
  credit: 'Block Island, Rhode Island',
};

/* The scene reads eyebrow → lead → claim. The lead is the bridge rung: it
   tells you the weight of the line that follows, so the held space between
   them is an interval and not a hole. The claim stays ONE sentence. */
export const whyNowLead = 'Everything that follows starts with one fact.';

export const whyNow =
  'AI is moving faster than public institutions can absorb it.';

/* THE STAKE — the homepage's photographic interlude, between the method and
   the pilots that run it. FOUR WORDS, and they are the brief's own test: the
   institute is judged on the median family, not on the frontier. The hero
   says what the institute exists to ensure; this says who it is for. It is
   also the whole of the scene's copy — the sentence has to be short enough
   to set in a narrow column beside the subject rather than across her. */
export const stake = {
  image: '/media/pilot-maternal.jpg',
  line: 'For the median family.',
  /* THE ALTERNATE LINE — see components/scroll-Stake-alt.astro.
     `line` above prints a statistician's abstraction over an identifiable
     woman in a U.S. Department of Agriculture photograph who has no
     relationship to this institute. `altLine` states the same standard as
     the Institute's own test rather than as a label for the person in the
     frame: the subject of the sentence is what we judge technology by, not
     who she is. Same length, same three-line break in the same measure. */
  altLine: 'The test is ordinary life.',
  credit: 'U.S. Department of Agriculture',
};
