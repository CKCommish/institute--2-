/* Cohorts for the prospective board.

   Sixteen names read as a directory when they run at one pitch. They are
   grouped here into the three constituencies the institute sits between —
   government, capital, and the people who run the work — so the roster has
   three beats instead of none. Editorial grouping only: the order inside a
   cohort is alphabetical, so nothing implies rank.

   This lives beside the People pieces rather than in src/data/site.js on
   purpose — site.js stays a flat list of names and one-line titles, and the
   grouping is a design decision owned by these two files. */

const COHORTS = [
  {
    label: 'Policy',
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
    names: ['Roy Bahat', 'Galym Imanbayev', 'Bradley Tusk', 'Julie Yoo', 'Helen Zhang'],
  },
  {
    label: 'Practice',
    names: ['Guy Filippelli', 'Michael Hole', 'Robin McIntosh', 'Nate Mitchell', 'Kyla Scanlon'],
  },
];

/* Returns [{ label, id, people }]. Anyone added to site.js but not named
   above still reaches the page — they join the last cohort rather than
   vanishing from the roster. */
export function cohortsOf(board) {
  const byName = new Map(board.map((b) => [b.name, b]));
  const groups = COHORTS.map((c) => ({
    label: c.label,
    id: `cohort-${c.label.toLowerCase()}`,
    people: c.names.map((n) => byName.get(n)).filter(Boolean),
  }));
  const placed = new Set(COHORTS.flatMap((c) => c.names));
  const spare = board.filter((b) => !placed.has(b.name));
  if (spare.length) groups[groups.length - 1].people.push(...spare);
  return groups;
}
