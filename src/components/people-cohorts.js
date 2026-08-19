/* Cohorts for the prospective board.

   Sixteen names read as a directory when they run at one pitch. They are
   grouped here into the three constituencies the institute sits between —
   government, capital, and the people who run the work — so the roster has
   three beats instead of none.

   Each cohort also names a `lead`: the one entry set at display scale on
   /people/. It is not a ranking of the board. It is the name that makes the
   cohort legible in a glance, so a reader who reads three lines has still
   understood what the sixteen are for. Everyone else keeps alphabetical
   order, and the caption under the section says membership is prospective.

   This lives beside the People pieces rather than in src/data/site.js on
   purpose — site.js stays a flat list of names and one-line titles, and the
   grouping, the leads and the definitions are design decisions owned by
   these two files. */

const COHORTS = [
  {
    label: 'Policy',
    def: 'They have governed at scale.',
    lead: 'Gina Raimondo',
    names: [
      'John Bailey',
      'Aneesh Chopra',
      'Tess deBlanc-Knowles',
      'Governor Jay Inslee',
      'Gina Raimondo',
      'Jake Sullivan',
    ],
  },
  {
    label: 'Capital',
    def: 'They fund what gets built.',
    lead: 'Roy Bahat',
    names: ['Roy Bahat', 'Galym Imanbayev', 'Bradley Tusk', 'Julie Yoo', 'Helen Zhang'],
  },
  {
    label: 'Practice',
    def: 'They run the work itself.',
    lead: 'Michael Hole',
    names: ['Guy Filippelli', 'Michael Hole', 'Robin McIntosh', 'Nate Mitchell', 'Kyla Scanlon'],
  },
];

/* Returns [{ label, def, id, people, lead, rest }]. `people` stays the full
   cohort in alphabetical order — the homepage scene uses it. `lead` / `rest`
   are the two-tier split /people/ sets. Anyone added to site.js but not named
   above still reaches the page: they join the last cohort's `rest` rather
   than vanishing from the roster. */
export function cohortsOf(board) {
  const byName = new Map(board.map((b) => [b.name, b]));
  const groups = COHORTS.map((c) => ({
    label: c.label,
    def: c.def,
    id: `cohort-${c.label.toLowerCase()}`,
    people: c.names.map((n) => byName.get(n)).filter(Boolean),
    leadName: c.lead,
  }));
  const placed = new Set(COHORTS.flatMap((c) => c.names));
  const spare = board.filter((b) => !placed.has(b.name));
  if (spare.length) groups[groups.length - 1].people.push(...spare);

  for (const g of groups) {
    g.lead = g.people.find((p) => p.name === g.leadName) || g.people[0];
    g.rest = g.people.filter((p) => p !== g.lead);
    delete g.leadName;
  }
  return groups;
}
