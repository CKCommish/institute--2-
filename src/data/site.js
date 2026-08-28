export const site = {
  name: 'Lion Forum Institute',
  /* Confirmed by the client, 27 Aug. */
  legal: '501(c)(3)',
  founded: '2026',
  short: 'Lion Forum Institute',
  mission:
    'The Lion Forum Institute exists to ensure the technologies of tomorrow strengthen American families today.',
  /* ⚠ INVENTED — NOT FROM THE BRIEF. This address and the domain in
     astro.config.mjs were both authored during the first commit and never
     confirmed. This is the site's ONLY call to action, on all six pages, and
     the canonical/og:url on every page points at that domain. If the mailbox
     does not exist, every conversion path on the site is dead. See
     CONTENT-NOTES.md — client must confirm or replace. */
  email: 'partners@lionforuminstitute.org',
};

export const nav = [
  { label: 'Institute', href: '/institute/' },
  { label: 'Pilots', href: '/pilots/' },
  { label: 'Forum', href: '/forum/' },
  { label: 'People', href: '/people/' },
];

/* THE MODEL — from the prospectus, verbatim in substance.
   This is what four reviewers said the site did not have: a number a funder
   can act on. Do not round it, dress it up, or add a figure beside it that
   the prospectus does not carry. */
export const model = {
  label: 'Core Partnership',
  amount: '$2 million',
  cadence: 'a year',
  lead: 'Core Partners make multi-year commitments that both build the Institute and fund the pilots they choose to support. A typical annual Core Partnership:',
  split: [
    { amount: '$1M', name: 'Core support',
      text: 'The team, technology and infrastructure that develops the pipeline of high-impact pilots.' },
    { amount: '$1M', name: 'Dedicated pilot funding',
      text: 'Deployed across the pilot opportunities the partner selects.' },
  ],
  scale: 'Partnership levels scale with the size of the annual commitment. The largest Core Partners get first look across the full pipeline.',
};

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
                 kind of place it runs in, and — set apart, because
                 it is half the truth about any pilot still open to
                 partners. SIX FIELDS, ONE SHORT LINE EACH — the same
                 cap the brief puts on a card field, because that is the
                 only reading of "at most 3 short lines of supporting
                 text" a dedicated detail block can honour: prose is
                 capped at three lines (see pilots-detail.astro), and
                 everything else here is a labelled fact, not a sentence.
                 `who` names the PEOPLE and `where` names the PLACE — if a
                 value repeats the other's noun, one of them is wrong.

   EVERY STRING IN `detail` IS A RESTATEMENT OF refs/PROSPECTUS.txt, which
   is canonical and supersedes refs/BRIEF.md wherever the two differ. The
   prospectus gives each pilot a Problem, an Approach and a Goal in its own
   words; those are the source for `problem` / `approach` / `goal` and for
   the three `detail` rows. What the prospectus does NOT give — a named
   state, a named school, a named health system, a budget, a start date, a
   technology partner — is ABSENT, and its absence is the `needs` block.
   See CONTENT-NOTES.md for the list of slots deliberately left empty.

   `needs.run` names a KIND of institution the prospectus does not name for
   that pilot individually; the prospectus's own list of implementation
   partners ("health systems, hospitals and providers, universities,
   community partners, government") is the source. */
/* FACTUAL DISCIPLINE — read before editing any string below.
   Every claim here must be traceable to refs/PROSPECTUS.txt, or to
   refs/BRIEF.md where the prospectus is silent. Six independent
   fact-checkers have now found authored specifics in this file — a
   ninety-day window, a lead time of "weeks", a siting agreement as the
   legal instrument, a head office, a sponsorship tier, a chair count. Do
   not reintroduce a number, an interval, a ranking or a named instrument
   unless a source supplies it; a missing fact is recoverable, a fabricated
   one attributed to a real partner is not.

   STATUS. The prospectus heads this list "CURRENT PILOT PIPELINE — FOUR
   ACTIVE PILOTS — 2026" and says the Institute "is working with" Special
   Olympics, Governor Inslee and Butler University. The site used to say the
   opposite — "proposed", "none is signed" — which was an authored negative
   no source ever carried and which the canonical document contradicts.
   `status` is the prospectus's own word per pilot: Active for 01-03, and
   Exploring for 04, whose approach line says the Institute "is exploring"
   it. Do not upgrade 04, and do not write that any partner has SIGNED —
   no source says that either. Facts still needed: CONTENT-NOTES.md. */
export const pilots = [
  {
    id: 'healthy-athletes',
    index: '01',
    partner: 'Special Olympics',
    title: 'Global Health Data',
    /* WAVE 21. This read "The largest dataset on IDD health, opened to
       everyone." — the prospectus's GOAL ("make the world's largest IDD
       health dataset an open resource") written as accomplished fact. The
       dataset is being gathered; it is not open and it is not yet the
       largest. The tagline register is the one place this file's own header
       warns about, because it is compressed enough to look like a label and
       is rendered on two routes. What replaces it is the approach, which is
       what is true today: the prospectus says the Institute "is working
       with Special Olympics to gather health data from Healthy Athletes
       screenings across the world and develop an open-source dataset". The
       goal field twelve lines down still carries the aim, correctly. */
    tagline: 'Screenings from around the world, gathered into one open dataset.',
    field: 'Health',
    problem: 'More than 2 million free screenings since 1997. The next step is follow-up care.',
    approach: 'Gather Healthy Athletes data worldwide into an open-source dataset.',
    goal: 'Better IDD healthcare worldwide, the dataset open to all.',
    horizon: '3–12 months',
    status: 'Active',
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
       (`sat`, `tint`) plus a small hue correction (`warm`), chosen against
       the meter, not by eye. Held target: chroma 15 +/- 1.5, |R-B| <= 6.
       Re-measure before changing any of these; they are a SET, and a number
       moved on one frame is only correct if the other three still hold.

       01 is also the only frame with a CROP problem. It is a privacy crop
       (PHOTO-FACTS: the master is an identifiable seven-year-old and the
       face may not come back), and at zoom 1 the band read as a headless
       waist-down figure adrift in a field of terracotta — the loudest,
       most saturated object on the page, and it is first. The crop now
       closes on the stride itself: legs, shoes, two lane lines. Same
       privacy, an actual subject, and a third less open track. */
    plate: {
      grade: 0.5, sat: 3.3, tint: 3.3, warm: 0, lift: 1.2,
      zoom: 1.3, focal: '28% 70%',
      zoomSm: 1.18, focalSm: '26% 70%',
    },
    /* What the PHOTOGRAPH is, not what the pilot is. See refs/PHOTO-FACTS.md:
       a pilot's name set over a full-bleed frame reads as a caption for it. */
    credit: 'Unified track event · Camp Humphreys, Korea',
    detail: {
      what: 'An open dataset researchers and health systems can build on.',
      who: 'People with intellectual and developmental disabilities.',
      where: 'Healthy Athletes screenings across the world.',
      needs: {
        fund: 'One pilot, end to end.',
        build: 'A partner to build and host the open dataset.',
        /* Every other pilot's `run` names a KIND of institution, per the
           rule above; this one used to read 'Follow-up care after a
           screening', which names a phase of care and answers a different
           question than the label asks. A health system is on the
           prospectus's own implementation-partner list, and follow-up care
           is the prospectus's own next challenge for this pilot. */
        run: 'A health system, after the screening.',
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
    problem: 'States need better tools to negotiate data center projects.',
    approach: 'A playbook for the negotiating table.',
    goal: 'Clean energy expanded, good jobs, lower energy costs.',
    horizon: '3–12 months',
    status: 'Active',
    image: '/media/pilot-energy.jpg',
    /* the cool outlier: +22 blue-over-red before the trim. See pilot 01. */
    plate: { grade: 0.5, sat: 4.6, tint: 0, warm: 35, lift: 0.1 },
    /* What the PHOTOGRAPH is, not what the pilot is. See refs/PHOTO-FACTS.md:
       a pilot's name set over a full-bleed frame reads as a caption for it. */
    credit: 'Muskingum County, Ohio',
    detail: {
      what: 'Clean power, affordability, workforce, permitting, community benefit.',
      who: 'State governments, and affected communities.',
      where: 'States negotiating with data center developers.',
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
    /* "in the weeks that decide outcomes" was an asserted clinical window —
       the same claim as the "ninety-day window" this file's header records as
       already removed, rewritten as prose so it no longer looked like a
       number. No source gives a window. */
    tagline: 'Risk found in the data, and acted on.',
    field: 'Health',
    /* THE RANKING IS REAL AND IS BACK. An earlier fact-check stripped it as
       invented, because BRIEF.md does not carry it. refs/PROSPECTUS.txt does,
       in its own words: "Indianapolis has one of the highest infant mortality
       rates among major American cities, and mothers on Medicaid too often
       miss the prenatal care and early warnings that save infant lives."
       Both halves of that sentence are now on the page — the ranking here,
       the Medicaid clause in `detail.who`. Do not sharpen "one of the
       highest" into a rank number; the prospectus does not give one. */
    problem: 'Indianapolis has one of the highest infant mortality rates among major American cities.',
    approach: 'AI across the city’s maternal health data, plus a targeted intervention.',
    goal: 'Fewer infant deaths, and a model other cities can replicate.',
    horizon: '3–12 months',
    status: 'Active',
    /* Wave 9: the file behind this path is now Carol M. Highsmith's aerial
       of downtown Indianapolis (LC-DIG-highsm-40936). The USDA photograph of
       a mother and infant that used to sit here was rejected by the client
       and is off disk. See refs/PHOTO-FACTS.md. */
    image: '/media/pilot-maternal.jpg',
    /* the warm interior. See pilot 01. */
    plate: { grade: 0.5, sat: 1.5, tint: 2.7, warm: 0, lift: 2.0 },
    /* What the PHOTOGRAPH is, not what the pilot is. A place-name, like the
       other Highsmith frames — and here it is also the place the pilot is
       proposed for, which is why this frame was chosen. It says nothing
       about a hospital, a neighbourhood or anyone who lives there. */
    credit: 'Indianapolis, Indiana',
    /* Decorative, like the other three, now that the subject is a city and
       not a person: the copy set beside it already names Indianapolis. */
    alt: '',
    detail: {
      what: 'Risk factors found in city data; care at the right time.',
      who: 'Mothers on Medicaid, who too often miss prenatal care.',
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
    partner: 'Secretary Cardona',
    title: 'Career Pathways',
    tagline: 'Guidance that follows a student from school to work.',
    field: 'Education',
    problem: 'Low-income students lack clear guidance on careers and credentials.',
    approach: 'AI guidance on careers, skills and training routes.',
    /* "More students" is a comparison, and there is no baseline to compare
       to: no pilot has run. The goal without the comparative is the same goal. */
    goal: 'Personal guidance, and awareness of high-opportunity jobs.',
    horizon: '3–12 months',
    status: 'Exploring',
    image: '/media/pilot-education.jpg',
    /* already close to the target; it is the frame the other three were
       brought toward. See pilot 01. */
    plate: { grade: 0.5, sat: 1.1, tint: 2.3, warm: 0, lift: 0.8 },
    /* What the PHOTOGRAPH is, not what the pilot is. See refs/PHOTO-FACTS.md:
       a pilot's name set over a full-bleed frame reads as a caption for it. */
    credit: 'Adrian, Oregon',
    detail: {
      what: 'Personalised guidance, school through to work.',
      who: 'Low-income students.',
      where: 'Schools and workforce partners.',
      needs: {
        fund: 'One pilot, end to end.',
        build: 'A partner to build the guidance.',
        run: 'A school or workforce partner.',
      },
    },
  },
];

/* The terms every one of the four is offered on, stated once at the top of
   /pilots/ instead of four times down it. Every value is refs/PROSPECTUS.txt:
     · "designed to show measurable results in 3 to 12 months"
     · "FOUR ACTIVE PILOTS — 2026", and 04 "is exploring"
     · "We then share those lessons with the world."
   The third row used to promise publication "whatever it says" / "either
   way". No source carries that commitment — the prospectus says the lessons
   are shared, not that a null result is reported. The promise is now the
   sourced one.

   Wave 15: it then read "One measurable outcome each". The prospectus gives
   each pilot a Goal paragraph promising TWO OR THREE things (01 two; 02, 03
   and 04 three), so "one each" was ours, not the source's. The row now says
   only what the prospectus says: "We then share those lessons with the
   world", and "Each pilot demonstrates, through its own specific use case".
   The site's one-line-per-pilot `goal` field is compression under the
   brief's cap — it is not a claim that there is only one goal. Do not
   reintroduce a count here. */
export const pilotTerms = [
  {
    key: '3–12',
    term: 'Months',
    text: 'Designed to show measurable results in that window.',
  },
  {
    /* The key used to be 'Active' over the term 'Status' — a flat scalar,
       set at the largest rung in the rail, contradicted by the second half
       of its own caption. The prospectus's own headline is a COUNT, "FOUR
       ACTIVE PILOTS — 2026", and the count is the part nothing disputes;
       the state is what carries the exception, so the state moves down into
       the caption where the exception already lives. /partner/ and the
       homepage's Pilots scene resolve the same tension the same way. */
    key: 'Four',
    term: 'Pilots',
    text: 'Active for 2026. The fourth is still in exploration.',
  },
  {
    key: 'Shared',
    term: 'Lessons',
    text: 'The lessons from each pilot go to the world.',
  },
];

/* ── How the institute works ──────────────────────────────────────── */
/* THIS LEDGER NOW STATES THE ACT, WHICH THE SITE HAD NEVER STATED ANYWHERE.
   refs/PROSPECTUS.txt, WHAT WE DO: "For each pilot, we identify a problem,
   match it with a technology partner, recruit implementation partners, and
   measure outcomes." Four verbs, in order, and the page whose whole job is
   the model carried none of them. Two sentences later the same paragraph
   adds the fifth: "We then share those lessons with the world."

   What it replaced was three rungs of RESTATEMENT, measured on the built
   page at 1440 and 390:
     · rung 01's caption, "Health, education, workforce, energy.", was a
       verbatim duplicate of the spec rail's Focus value ~900px above it on
       the same route.
     · rung 02's caption, "Who builds it. Who runs it.", said in six words
       what the two .ispec__say sentences 300px above say in full — not
       verbatim (they name all seven stakeholder groups; this named none),
       but the same two verbs about the same two sides.
     · only rung 03's caption carried anything the page had not already
       said, and it said it about the LAST act while the first three went
       unnamed.

   So the captions go and the rungs carry the verbs. Titles only: there is
   no second line under any of them because the prospectus does not offer
   one that is not already elsewhere on this page — the partner rosters are
   the two sentences above, the window is the rail's Horizon, the focus list
   is the rail's Focus. A caption invented to fill the slot is the defect
   this scene was sent back for.

   Each rung is the source's own verb phrase. Do not add an object to one
   that the prospectus does not give it ("measure outcomes" is measure
   outcomes; it is not a number, a metric, or a target), and do not restore
   a caption row. */
export const method = [
  { index: '01', title: 'Identify a problem' },
  { index: '02', title: 'Match a technology partner' },
  { index: '03', title: 'Recruit implementation partners' },
  { index: '04', title: 'Measure outcomes' },
  { index: '05', title: 'Share the lessons with the world' },
];

/* ── People ───────────────────────────────────────────────────────── */
/* THE ROLE LINE IS THE PROSPECTUS'S OWN TITLE, NOT AN INFERENCE.
   Both records read 'Co-founder' until now, and on /people/ that label was
   at least immediately qualified by the offices around it. On the HOMEPAGE
   it stood alone under the headline — a bare "Co-founder" on the Lion Forum
   Institute's own front page, which asserts that these two men co-founded
   the Institute. No source says so. refs/PROSPECTUS.txt gives each man
   exactly one title, identical for both — "FOUNDING PARTNER, K. VENTURES;
   FOUNDING PARTNER, THE LION FORUM" — and it says the Institute is a major
   SPONSOR of the Lion Forum. Of the Institute's founding it says only that
   it is Christopher's "attempt to give back to the country", and about
   Judd's relationship to founding it, nothing at all. The only support the
   old label ever had was the heading "### Founders" in refs/BRIEF.md, and
   the prospectus supersedes the brief.
   So `role` is now the half of the quoted title that bears on this
   institute: Founding Partner of the Lion Forum, which the prospectus
   states of both men in its own words ("Christopher co-founded the Lion
   Forum"; Judd "is also a founding partner of the Lion Forum"). The other
   half — K. Ventures — is on /people/ as `foundersNote` below, stated once
   at the bridge rung and as a fact rather than a repeated office. The
   brief allows a person one title line, and this is it. Do not restore
   "Co-founder", and do not compose a new title for either man out of the
   Institute's name. */
export const founders = [
  {
    name: 'Christopher Kennedy McKelvy',
    role: 'Founding Partner, The Lion Forum',
    detail: 'Army Ranger, Afghanistan. Oculus VR and Meta. MPA, Harvard. BS, Syracuse.',
    portrait: '/media/founder-mckelvy.jpg',
  },
  {
    name: 'Judd Olanoff',
    role: 'Founding Partner, The Lion Forum',
    detail: 'Finance and politics. MBA, Stanford. MPA, Harvard. BA, Amherst.',
    portrait: '/media/founder-olanoff.jpg',
  },
];

/* The one affiliation both men share that `role` above does not carry,
   stated once for the pair on /people/ rather than twice inside the
   records — and stated as the fact, not as a third title. It lives
   here and not in the page because it is copy, and because the field it
   replaced (`founders[].lines`, the two quoted offices) had no consumer at
   all while the page hardcoded its own wording — two statements of the same
   fact, free to drift apart with nothing to catch it. There is now one.
   Sourced: the prospectus says Christopher "later co-founded K. Ventures"
   and that Judd spent his career in finance and politics "before
   co-founding K. Ventures". Do not restage this as a third "Founding
   Partner": that word is already the register of both records below it, and
   saying it a third time over them is what made this band read as a claim
   about who founded the Institute. */
export const foundersNote = 'Both co-founded K. Ventures.';

/* Prospective board — names and one short line only.
   NOTE: titles are pending client confirmation. See CONTENT-NOTES.md */
/* Prospective board. The sixteen portraits were supplied by the client from
   the prospectus and are processed to one monochrome treatment so sixteen
   rooms, backgrounds and lighting setups read as one board rather than as a
   search-results page. NONE OF THESE PEOPLE HAS AGREED TO SERVE — the word
   "prospective" has to survive every layout decision made here, structurally
   and not only in a label. Per-person permission to publish a likeness is
   still to be confirmed: see CONTENT-NOTES.md. */
export const board = [
  { name: 'John Bailey', line: 'Nonresident Senior Fellow, American Enterprise Institute' , portrait: '/media/board/bailey.jpg' },
  { name: 'Roy Bahat', line: 'Head, Bloomberg Beta' , portrait: '/media/board/bahat.jpg' },
  { name: 'Aneesh Chopra', line: 'First U.S. Chief Technology Officer; Chair, Arcadia Institute' , portrait: '/media/board/chopra.jpg' },
  { name: 'Guy Filippelli', line: 'Founder and Managing Partner, Squadra Ventures' , portrait: '/media/board/filippelli.jpg' },
  { name: 'Michael Hole', line: 'Executive Vice President and Provost, Butler University' , portrait: '/media/board/hole.jpg' },
  { name: 'Galym Imanbayev', line: 'Partner, Lightspeed Venture Partners' , portrait: '/media/board/imanbayev.jpg' },
  { name: 'Governor Jay Inslee', line: 'Former Governor of Washington' , portrait: '/media/board/inslee.jpg' },
  { name: 'Tess deBlanc-Knowles', line: 'AI and national security policy' , portrait: '/media/board/deblanc-knowles.jpg' },
  { name: 'Robin McIntosh', line: 'Co-founder and Board Chair, Workit Health' , portrait: '/media/board/mcintosh.jpg' },
  { name: 'Nate Mitchell', line: 'Co-founder, Oculus' , portrait: '/media/board/mitchell.jpg' },
  { name: 'Gina Raimondo', line: 'Former U.S. Secretary of Commerce' , portrait: '/media/board/raimondo.jpg' },
  { name: 'Kyla Scanlon', line: 'Economic commentator, author and creator' , portrait: '/media/board/scanlon.jpg' },
  { name: 'Jake Sullivan', line: 'Former U.S. National Security Advisor' , portrait: '/media/board/sullivan.jpg' },
  { name: 'Bradley Tusk', line: 'Co-founder and Managing Partner, Tusk Venture Partners' , portrait: '/media/board/tusk.jpg' },
  { name: 'Julie Yoo', line: 'General Partner, Andreessen Horowitz' , portrait: '/media/board/yoo.jpg' },
  { name: 'Helen Zhang', line: 'Schmidt Futures' , portrait: '/media/board/zhang.jpg' },
];

export const forum = {
  name: 'The Lion Forum',
  /* THE EVENT'S LOCATION, AND WHY IT HAS A VERB IN IT.

     This read 'Kennedy Compound, Hyannis Port' — a bare place-name — and it
     is set, in both of its two consumers, on a full-bleed photograph of Old
     Harbor, Block Island, Rhode Island. refs/PHOTO-FACTS.md: "A full-bleed
     photograph with a place-name set over it reads as a caption, whether or
     not you meant it as one." Position and register were doing all the work
     of keeping it apart from the photograph's own credit, and the wave-11
     blind read looked at the pixels and found the work not done: the big
     cream place-name reads as the caption and the small dim one reads as
     noise, whichever corners they are in.

     A clause with a verb cannot be read as a caption. 'Held at' says the
     string is about the CONVENING, not about the frame, and it says it in
     the string itself, so the separation survives any crop, any viewport
     and any future layout. Sourced: the prospectus, "The Lion Forum is an
     invitation-only convening held at the historic Kennedy Compound in
     Hyannis Port, Massachusetts."

     WHEN THE CLIENT'S OWN KENNEDY COMPOUND FRAMES LAND: this string does
     not need to change. It is true of the event either way, and 'Held at'
     is not a hedge against the stand-in — it is what the line means. */
  /* NBSP between 'Kennedy' and 'Compound': at 390px, and in the stacked
     (no-JS / reduced-motion) held scene at 26ch, the line broke the proper
     noun across two lines — 'Held at the Kennedy / Compound, Hyannis Port'.
     forum.astro widens the desktop lock to 46ch for exactly this reason; the
     narrow surfaces need the glue instead. Measured: no overflow at 390. */
  place: 'Held at the Kennedy\u00A0Compound, Hyannis Port',
  access: 'By invitation',
  line: 'The people who build sit with the people who decide.',
  /* THE CLOSE, set on cream at the series-breaker rung. One sentence that
     states the relationship, one that says what the Institute does with it.
     No third line — the brief's supporting-line budget is spent here. */
  /* BRIEF.md: "The Institute is a major sponsor." It said "lead sponsor"
     here, at 60px, which is a named rank in a sponsorship hierarchy and not a
     synonym. Nothing in any source ranks the Institute among the Forum's
     sponsors. */
  role: 'The Institute is a major sponsor of the Lion Forum.',
  /* The prospectus states this as purpose — the Institute "uses it as a key
     platform to recruit partners and share its results with the world."
     Purpose, not history: no result has come back to the room yet. */
  roleNote: 'The Institute is there to find pilot partners, and to bring results back to the room.',
  /* The substance beat. A foundation officer or a policy lead has to leave
     this page knowing what the convening is, who is in it, and why the
     Institute is there. Three entries, one sentence each — the brief's
     three-supporting-lines limit, spent on the page's one job. */
  /* DO NOT ADD A FOURTH ROW TO MAKE THIS BLOCK LOOK FULLER. A wave-22 read
     called §02 the block carrying "the least information per inch of any
     block on the site". Measured at 1440 in words per vertical inch of
     rendered block: §02 whole 14.8, its rows alone 18.1 — against /forum/'s
     own §01 at 10.4 and §03 at 10.0, /404/'s ledger at 12.3 and /partner/'s
     index at 11.4. §02 is the DENSEST prose block on its own page and above
     four of the site's others; only the micro-fact rails beat it
     (/institute/'s cells 26.3, /pilots/'s terms 25.8), and a scalar rail is
     not the same construction as a sentence ledger. The reading was of the
     block's dead left margin, which was a layout defect and is fixed in
     forum.astro. There is no fourth sourced row: CONTENT-NOTES.md lists what
     is deliberately absent from /forum/ and why, and every item on that list
     would have to be invented. */
  brief: {
    eyebrow: 'What it is',
    lede: 'A closed room, and a reason for the Institute to be standing in it.',
    rows: [
      {
        term: 'Format',
        text: 'By invitation only, convened each year at the historic Kennedy Compound in Hyannis Port.',
      },
      /* `lead: true` marks the row /forum/ hoists to §01, under the claim,
         instead of listing it in the ledger — the page used to describe its
         own room twice, at two scopes, 400px apart. The page found this row
         by matching its term against /^the room$/i, so renaming the term in
         THIS file silently un-hoisted it and put the duplicate back with no
         error anywhere. The relationship is a property of the row now, not
         of its display string: rename `term` freely, and move `lead` if a
         different row should ever take that position. Exactly one row must
         carry it — /forum/ throws at build time otherwise. */
      {
        term: 'The room',
        lead: true,
        text: 'Members of Congress, senior administration officials and the leadership of the top AI labs, alongside founders and investors.',
      },
      {
        term: 'The subject',
        text: 'Technology’s role in strengthening the pillars of life for American families, and in revitalizing the American Dream.',
      },
    ],
  },
  /* ── THE FOURTH QUESTION ──────────────────────────────────────────
     A programme officer arrives wanting four things: what the convening is,
     who is in it, what the Institute's relationship to it is, and how one
     might be invited. The ledger answers the first two, `role` answers the
     third, and until now NOTHING answered the fourth — the page ended on a
     mailto and left the reader to guess whether it was an application.

     What the sources support is small, and this says only that: the
     convening is invitation-only, and the Institute is a major sponsor of
     it. It therefore states the ONE useful negative — you cannot apply — and
     names the one thing a reader can actually do. It does NOT say who writes
     the guest list, what a sponsor's say over it is, or what happens after
     you write. None of that is known. (How often it meets IS known — the
     prospectus says "Each year", and the ledger's Format row now says so.)
     Do not add a line here that implies a process. */
  invite: {
    term: 'Being invited',
    lines: [
      'There is no application. The room is invited.',
      'The Institute is in that room, and an inquiry here reaches it.',
    ],
  },
  cta: 'Inquire about the Forum',
  /* ── THE STAND-IN ─────────────────────────────────────────────────
     `image` / `credit` are the Block Island frame. It is an honest stand-in
     for a convening we have no photograph of, and refs/PHOTO-FACTS.md says
     it comes OFF the site the day the real frames land — it is not to be
     kept as decoration. Until then, the credit is what stops the event line
     "Kennedy Compound, Hyannis Port" reading as this photograph's caption.
     Two location strings, two jobs, two corners. */
  image: '/media/forum.jpg',
  credit: 'Block Island, Rhode Island',
  /* ── THE LION FORUM PHOTOGRAPHS — NAMED SLOTS, NOT YET DELIVERED ──
     The client owns this photography and it takes NO attribution credit
     (refs/PHOTO-FACTS.md). Five frames have been described and none has
     reached the repository. Drop a file at the path below and /forum/ picks
     it up at build time with no other edit: `lawn` takes over the masthead,
     `stage` takes over the plate, and any of the last three appear as the
     room band between the claim and the ledger. Nothing renders while a file
     is absent. CONTENT-NOTES.md carries the slot table and what to check.

     THE `alt` STRINGS BELOW WERE WRITTEN FROM THE CLIENT'S DESCRIPTION OF
     PICTURES NOBODY HERE HAS SEEN. Read each one against the actual frame on
     arrival and correct it; an alt text is a claim about a photograph like
     any other. They deliberately name no attendee: `podium` is a sitting or
     former public official speaking and the notes record who, but a name on
     this page would be an assertion that the Institute has not cleared. */
  photos: {
    /* MASTHEAD. The only frame in the set that earns a location label —
       it is the claim the page has never been able to make with a stand-in.
       CONFIRM ON ARRIVAL that the frame is the Compound; if the client
       cannot confirm it, set this credit to '' and the picture makes no
       claim on its own. */
    lawn: {
      src: '/media/forum-lawn.jpg',
      alt: 'A lawn at dusk, a flagpole, and a harbour of moored boats beyond it.',
      credit: 'Hyannis Port, Massachusetts',
    },
    /* THE PLATE. No label: the branded backdrop says where it is. */
    stage: {
      src: '/media/forum-stage.jpg',
      alt: 'Speakers on stage at the Lion Forum, against the Forum’s backdrop.',
      credit: '',
    },
    podium: {
      src: '/media/forum-podium.jpg',
      alt: 'A speaker addressing the Lion Forum from the stage.',
      credit: '',
    },
    notebook: {
      src: '/media/forum-notebook.jpg',
      alt: 'A speaker at the Lion Forum, a notebook open in front of them.',
      credit: '',
    },
    reception: {
      src: '/media/forum-reception.jpg',
      alt: 'A reception at the Lion Forum in low evening sun.',
      credit: '',
    },
  },
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
/* The homepage Stake scene. This used to point at pilot 03's file, so
   replacing that photograph silently changed the homepage too and left three
   strings describing a picture that no longer existed — a USDA family child
   care home credited over a downtown skyline. It has its own image now, and
   its own credit, so the two can never drift again. */
/* THE PICTURE, and the credit is a fact about the PICTURE only.
   `stake.jpg` is Carol M. Highsmith's 2015 photograph of small bungalow homes
   on one of the brick streets of the Southside Bricks neighbourhood in
   Huntington, West Virginia (LC-DIG-highsm-31738). It is a residential street
   in one named town, and that is the entire claim: it is not the Institute's
   work, not a pilot site, not Indiana, and nobody in it is a subject — there
   is no person in the frame at all. The credit says where the photograph was
   taken and nothing else. If this file is ever swapped, this string changes
   with it in the same commit. */
export const stake = {
  image: '/media/stake.jpg',
  line: 'The test is ordinary life.',
  credit: 'Huntington, West Virginia',
};
