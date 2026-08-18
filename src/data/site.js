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
    horizon: '3–12 months',
    image: '/media/pilot-health.jpg',
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
    image: '/media/pilot-maternal.jpg',
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
  },
];

/* ── How the institute works ──────────────────────────────────────── */
export const method = [
  { index: '01', title: 'Find the problem', text: 'One families feel, and an institution owns.' },
  { index: '02', title: 'Match the partners', text: 'Who builds it. Who runs it.' },
  { index: '03', title: 'Measure, then publish', text: 'The result goes out either way.' },
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
    detail: 'Army Ranger. Oculus and Meta. MPA, Harvard. BS, Syracuse.',
    portrait: '/media/founder-mckelvy.jpg',
  },
  {
    name: 'Judd Olanoff',
    role: 'Co-founder',
    lines: [
      'Founding Partner, K. Ventures',
      'Founding Partner, The Lion Forum',
    ],
    detail: 'MBA, Stanford GSB. MPA, Harvard Kennedy School. BA, Amherst.',
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
  line: 'A convening of founders, investors, and elected officials.',
  role: 'The Institute is a lead sponsor: the Forum is where pilots find their partners, and where results are reported back.',
  caption: 'Hyannis Port, Massachusetts',
  cta: 'Inquire about the Forum',
  image: '/media/forum.jpg',
  imageDetail: '/media/forum-detail.jpg',
};

export const whyNow =
  'AI is moving faster than public institutions can absorb it.';
