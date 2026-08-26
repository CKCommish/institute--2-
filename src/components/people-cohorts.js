/* The prospective board, arranged.

   Sixteen names in one alphabetical column is a directory: you have to read
   all sixteen rows before you know what the board is. The point of this
   roster is the calibre of the room, not the list, so the names are grouped
   into the three constituencies the institute sits between — the people who
   have governed, the people who fund, and the people who run the work — and
   set as three columns of a plate rather than sixteen rows of a table. A
   reader takes in three column heads and two or three names they recognise
   and has understood it; the rest is there to be read, not to be processed.

   Order inside a cohort is editorial, not alphabetical: the offices that
   are legible on sight lead the column. No title is authored here. Every
   line comes from src/data/site.js verbatim and is pending client
   confirmation — see CONTENT-NOTES.md.

   The groupings, the order, the definitions and the two head clauses below
   are design decisions and live beside the People pieces on purpose.
   src/data/site.js stays a flat list of names and one-line titles. */

const COHORTS = [
  {
    label: 'Policy',
    def: 'They have governed at scale.',
    names: [
      'Gina Raimondo',
      'Jake Sullivan',
      'Governor Jay Inslee',
      'Aneesh Chopra',
      'Tess deBlanc-Knowles',
      'John Bailey',
    ],
  },
  {
    label: 'Capital',
    def: 'They fund what gets built.',
    names: ['Roy Bahat', 'Julie Yoo', 'Galym Imanbayev', 'Bradley Tusk', 'Helen Zhang'],
  },
  {
    label: 'Practice',
    def: 'They run the work itself.',
    names: ['Nate Mitchell', 'Michael Hole', 'Robin McIntosh', 'Guy Filippelli', 'Kyla Scanlon'],
  },
];

/* The bridge rung — the clause that hands a reader up from an 11px label to
   a display line. On the roster it carries the whole payload: what is in the
   room, in one sentence, so nobody has to count to sixteen to feel it. Every
   office named here is quoted from a title in site.js. */
export const boardBridge =
  'A cabinet secretary. A national security advisor. A governor. The country’s first chief technology officer. And the people who run the work.';

export const mastheadBridge =
  'A pilot is only as good as the people who will answer for it.';

/* The homepage says it in half the words — the scene there is one glance,
   not a page. Same rule: every office is quoted from a title in site.js. */
export const homeBridge =
  'A cabinet secretary. A governor. The country’s first chief technology officer.';

/* ── THE STANDING OF THE ROSTER ──────────────────────────────────────
   Sixteen names was a list a reader could take or leave. Sixteen faces is a
   claim, and the claim it makes — "these people are with us" — is one this
   institute has no right to make: nobody on this roster has agreed to serve.
   A reader does not read the eyebrow before they read the faces, so the
   qualification cannot live in an 11px label riding each entry. It has to be
   a fact with a number in it, stated once at the size of a headline and once
   more as a standing mark on the roster itself.

   Both come from here. `line` is the sentence, `put` and `accepted` are the
   two counts — and `accepted` is 00 by definition, not by data: it is the
   only number on this page that will change when the situation does, and it
   is written as a zero rather than as an absence so that a reader meets it
   the way they meet 06 POLICY. The verb is "put forward", which is what
   CONTENT-NOTES.md says is true, and not "asked", which nobody has
   confirmed. */
const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight',
  'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'];

export function standingOf(board) {
  const n = board.length;
  const word = WORDS[n] || String(n);
  return {
    put: String(n).padStart(2, '0'),
    putLabel: 'Put forward',
    accepted: '00',
    acceptedLabel: 'Accepted',
    none: 'None has accepted.',
    line: `${word} put forward. None has accepted.`,
  };
}

/* Returns [{ label, def, id, count, people }] — people in the editorial
   order above. Anyone added to site.js but not named here still reaches the
   page: they join the last cohort rather than vanishing from the roster. */
export function cohortsOf(board) {
  const byName = new Map(board.map((b) => [b.name, b]));
  const groups = COHORTS.map((c) => ({
    label: c.label,
    def: c.def,
    id: `cohort-${c.label.toLowerCase()}`,
    people: c.names.map((n) => byName.get(n)).filter(Boolean),
  }));
  const placed = new Set(COHORTS.flatMap((c) => c.names));
  const spare = board.filter((b) => !placed.has(b.name));
  if (spare.length) groups[groups.length - 1].people.push(...spare);

  for (const g of groups) g.count = String(g.people.length).padStart(2, '0');
  return groups;
}
