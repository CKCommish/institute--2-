export const site = {
  name: 'Lion Forum Institute',
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
    plate: { grade: 0.5, sat: 4.6, tint: 0, warm: 35, lift: 0.1 },
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
    /* "in the weeks that decide outcomes" was an asserted clinical window —
       the same claim as the "ninety-day window" this file's header records as
       already removed, rewritten as prose so it no longer looked like a
       number. BRIEF.md gives data plus intervention, and nothing else. */
    tagline: 'Risk found in the data, and acted on.',
    field: 'Health',
    /* "concentrated among Medicaid mothers" was an epidemiological claim about
       a named city's health data that no source carries. BRIEF.md names the
       PEOPLE the intervention is for, not where the mortality falls — that is
       `detail.who`. Same category as the national ranking already stripped. */
    problem: 'Infant mortality in Indianapolis.',
    approach: 'Maternal health data read for early risk.',
    goal: 'Risk identified early enough to act on.',
    horizon: '3–12 months',
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
    /* "More students" is a comparison, and there is no baseline to compare
       to: no pilot has run. The goal without the comparative is the same goal. */
    goal: 'Students land in a defined pathway.',
    horizon: '3–12 months',
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
/* Prospective board. The sixteen portraits were supplied by the client from
   the prospectus and are processed to one monochrome treatment so sixteen
   rooms, backgrounds and lighting setups read as one board rather than as a
   search-results page. NONE OF THESE PEOPLE HAS AGREED TO SERVE — the word
   "prospective" has to survive every layout decision made here, structurally
   and not only in a label. Per-person permission to publish a likeness is
   still to be confirmed: see CONTENT-NOTES.md. */
export const board = [
  { name: 'John Bailey', line: 'Senior Fellow, American Enterprise Institute' , portrait: '/media/board/bailey.jpg' },
  { name: 'Roy Bahat', line: 'Head, Bloomberg Beta' , portrait: '/media/board/bahat.jpg' },
  { name: 'Aneesh Chopra', line: 'First Chief Technology Officer of the United States' , portrait: '/media/board/chopra.jpg' },
  { name: 'Guy Filippelli', line: 'Founder, RedOwl Analytics' , portrait: '/media/board/filippelli.jpg' },
  { name: 'Michael Hole', line: 'Pediatrician; Professor, UT Austin' , portrait: '/media/board/hole.jpg' },
  { name: 'Galym Imanbayev', line: 'Partner, Lightspeed Venture Partners' , portrait: '/media/board/imanbayev.jpg' },
  { name: 'Governor Jay Inslee', line: 'Governor of Washington, 2013–2025' , portrait: '/media/board/inslee.jpg' },
  { name: 'Tess deBlanc-Knowles', line: 'Former Special Advisor for AI, White House OSTP' , portrait: '/media/board/deblanc-knowles.jpg' },
  { name: 'Robin McIntosh', line: 'Co-founder and Co-CEO, Workit Health' , portrait: '/media/board/mcintosh.jpg' },
  { name: 'Nate Mitchell', line: 'Co-founder, Oculus' , portrait: '/media/board/mitchell.jpg' },
  { name: 'Gina Raimondo', line: 'U.S. Secretary of Commerce, 2021–2025' , portrait: '/media/board/raimondo.jpg' },
  { name: 'Kyla Scanlon', line: 'Writer on the economy' , portrait: '/media/board/scanlon.jpg' },
  { name: 'Jake Sullivan', line: 'U.S. National Security Advisor, 2021–2025' , portrait: '/media/board/sullivan.jpg' },
  { name: 'Bradley Tusk', line: 'Founder, Tusk Ventures' , portrait: '/media/board/tusk.jpg' },
  { name: 'Julie Yoo', line: 'General Partner, Andreessen Horowitz' , portrait: '/media/board/yoo.jpg' },
  { name: 'Helen Zhang', line: 'Investor' , portrait: '/media/board/zhang.jpg' },
];

export const forum = {
  name: 'The Lion Forum',
  place: 'Kennedy Compound, Hyannis Port',
  access: 'By invitation',
  /* The bridge rung under the eyebrow: who is in the room, plainly, so the
     display line above can be a claim rather than a list. */
  who: 'Founders, investors, elected officials.',
  line: 'The people who build sit with the people who decide.',
  /* THE CLOSE, set on cream at the series-breaker rung. One sentence that
     states the relationship, one that says what the Institute does with it.
     No third line — the brief's supporting-line budget is spent here. */
  /* BRIEF.md: "The Institute is a major sponsor." It said "lead sponsor"
     here, at 60px, which is a named rank in a sponsorship hierarchy and not a
     synonym. Nothing in any source ranks the Institute among the Forum's
     sponsors. */
  role: 'The Institute is a major sponsor of the Lion Forum.',
  /* BRIEF.md states this as intent — the Institute "uses it to recruit
     partners and share results." This line used to be in the present tense
     ("Pilots find their partners in this room, and come back to it to report
     what happened"), which is recurring practice for something no pilot has
     done once: none is signed. Purpose, not history. */
  roleNote: 'The Institute is there to find pilot partners, and to bring results back to the room.',
  /* The substance beat. A foundation officer or a policy lead has to leave
     this page knowing what the convening is, who is in it, and why the
     Institute is there. Three entries, one sentence each — the brief's
     three-supporting-lines limit, spent on the page's one job. */
  brief: {
    eyebrow: 'What it is',
    lede: 'A closed room, and a reason for the Institute to be standing in it.',
    rows: [
      {
        term: 'Format',
        text: 'By invitation only, convened at the Kennedy Compound in Hyannis Port.',
      },
      {
        term: 'The room',
        text: 'Founders and investors who build these technologies, alongside the elected officials who decide how they are used.',
      },
      {
        term: 'Why it matters',
        text: 'Those two groups settle what a technology becomes, and they are seldom in one room while there is still time to shape it.',
      },
    ],
  },
  /* ── THE FOURTH QUESTION ──────────────────────────────────────────
     A programme officer arrives wanting four things: what the convening is,
     who is in it, what the Institute's relationship to it is, and how one
     might be invited. The ledger answers the first two, `role` answers the
     third, and until now NOTHING answered the fourth — the page ended on a
     mailto and left the reader to guess whether it was an application.

     What the brief actually supports is small, and this says only that:
     the convening is invitation-only (brief), and the Institute is a lead
     sponsor of it (brief). It therefore states the ONE useful negative — you
     cannot apply — and names the one thing a reader can actually do. It does
     NOT say who writes the guest list, what a sponsor's say over it is, how
     often the Forum meets, or what happens after you write. None of that is
     known. Do not add a line here that implies a process. */
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
