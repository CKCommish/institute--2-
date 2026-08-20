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

/* ── The four 2026 pilots ─────────────────────────────────────────── */
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
    goal: 'Follow-up care completed within ninety days.',
    /* The same sentence, split where the twelve-month axis splits it:
       the head is set above the axis, the tail starts at the closing
       edge of the ninety-day span. See components/pilots-scale.astro. */
    goalHead: 'Follow-up care completed within',
    goalTail: 'ninety days.',
    horizon: '3–12 months',
    image: '/media/pilot-health.jpg',
    /* What the PHOTOGRAPH is, not what the pilot is. See refs/PHOTO-FACTS.md:
       a pilot's name set over a full-bleed frame reads as a caption for it. */
    credit: 'Unified track event · U.S. Army',
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
    goal: 'Those terms inside one state siting agreement.',
    horizon: '3–12 months',
    image: '/media/pilot-energy.jpg',
    /* What the PHOTOGRAPH is, not what the pilot is. See refs/PHOTO-FACTS.md:
       a pilot's name set over a full-bleed frame reads as a caption for it. */
    credit: 'Muskingum County, Ohio',
  },
  {
    id: 'infant-mortality',
    index: '03',
    partner: 'Butler University',
    title: 'Infant Mortality',
    tagline: 'Risk found early, in the weeks that decide outcomes.',
    field: 'Health',
    problem: 'Among the nation’s highest infant mortality rates.',
    approach: 'Maternal health data read for early risk.',
    goal: 'Weeks of warning, in a model other cities can run.',
    horizon: '3–12 months',
    /* The 2400×1600 source carries a second identifiable woman at its right
       edge; the 2.99:1 frame on /pilots/ always shows the full source width,
       so she was cropped mid-face beside the words "Infant Mortality" — a
       real person in a public-domain USDA photograph with no relationship to
       this pilot. This is the same photograph trimmed to 2060×1600, which
       ends before her. The homepage keeps the untrimmed original. */
    image: '/media/pilot-maternal-crop.jpg',
    /* What the PHOTOGRAPH is, not what the pilot is. See refs/PHOTO-FACTS.md:
       a pilot's name set over a full-bleed frame reads as a caption for it. */
    credit: 'U.S. Department of Agriculture',
  },
  {
    id: 'career-pathways',
    index: '04',
    partner: 'Secretary Miguel Cardona',
    title: 'Career Pathways',
    tagline: 'Guidance that follows a student from school to work.',
    field: 'Education',
    problem: 'The least counseling, the largest choices.',
    approach: 'Guidance built with districts, school to work.',
    goal: 'More students land in a defined pathway.',
    horizon: '3–12 months',
    image: '/media/pilot-education.jpg',
    /* What the PHOTOGRAPH is, not what the pilot is. See refs/PHOTO-FACTS.md:
       a pilot's name set over a full-bleed frame reads as a caption for it. */
    credit: 'Adrian, Oregon',
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
  /* The bridge rung under the eyebrow: who is in the room, plainly, so the
     display line above can be a claim rather than a list. */
  who: 'Founders, investors, elected officials.',
  line: 'The people who build sit with the people who decide.',
  /* THE CLOSE, set on cream at the series-breaker rung. One sentence that
     states the relationship, one that says what the Institute does with it.
     No third line — the brief's supporting-line budget is spent here. */
  role: 'The Institute is a lead sponsor of the Lion Forum.',
  roleNote: 'Pilots find their partners in this room, and come back to it to report what happened.',
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
