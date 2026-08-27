/* The prospective board, and the two facts the site is allowed to state
   about it: how many were put forward, and how many are seated.

   ── WHY THERE ARE NO LONGER THREE COHORTS ──────────────────────────
   This file used to sort the sixteen into Policy / Capital / Practice and
   hang a sentence off each bucket — "They have governed at scale.", "They
   fund what gets built.", "They run the work itself." Those sentences were
   the last thing on this site that said something about a named, living
   person that neither `refs/PROSPECTUS.txt` nor `refs/BRIEF.md` says. They
   were written here, by us, about sixteen people who have not joined, on a
   page that states 00 SEATED in the same breath.

   And the sort was wrong on its own terms, twice. Guy Filippelli is
   "Founder and Managing Partner, Squadra Ventures" — a venture firm — and
   he sat under Practice. Kyla Scanlon is "Economic commentator, author and
   creator" and she sat under "They run the work itself." Neither placement
   survives a reading of the person's own title, and a title is the only
   thing about these sixteen that we actually know.

   A grouping that cannot be derived from the titles is an editorial claim.
   The prospectus lists these people exactly one way — a flat list under
   PROSPECTIVE BOARD MEMBERS — and `src/data/site.js` carries that list in
   that order. The site now does the same. Order here is the client's own
   order, unaltered: it is neither ranked nor re-sorted by us, because both
   of those would be decisions we have no basis for.

   What is left in this file is arithmetic (`standingOf`, `rowsFor`) and two
   clauses of quoted offices (`boardBridge` / `homeBridge`). Nothing here
   characterises anybody.

   The filename is now a fossil — there are no cohorts. It is kept because
   both pages that show the board import from it and a stable path is worth
   more than an accurate one; this header is the correction. */

/* ── THE BRIDGE RUNGS ────────────────────────────────────────────────
   The clause that hands a reader up from an 11px label to a display line.
   On the roster it carries the whole payload: what is in the room, in one
   sentence, so nobody has to count to sixteen to feel it.

   EVERY PHRASE IS AN OFFICE QUOTED FROM A TITLE IN site.js — a cabinet
   secretary is "Former U.S. Secretary of Commerce", the provost is
   "Executive Vice President and Provost, Butler University", and so on.
   The clause this used to end on, "And the people who run the work", was
   not: it was the Practice cohort's definition wearing a different hat,
   authored here, about people who have not joined. It is replaced by two
   more offices, which is the same information carried by the only words
   any source gives us.

   AND THE TENSE IS THE TITLE'S TENSE. Three of these offices are held in
   the past and site.js says so in the only words it has — "Former U.S.
   Secretary of Commerce", "Former U.S. National Security Advisor", "Former
   Governor of Washington". Written as "A cabinet secretary. A national
   security advisor. A governor." this clause said the present tense over a
   board that is not seated, two inches above a plate that says "Former" three
   times, and a reader doing diligence would have read it as sitting
   officials joining a board. "Former" is repeated rather than pooled into
   one qualifier because pooling needs a grouping and this file does not do
   groupings; the repetition is the same scruple as 00 SEATED and "Titles for
   identification only", and it costs one line. The other three — the first
   U.S. CTO, the provost, the co-founder of Oculus — carry no "Former" in
   site.js, so they carry none here. */
/* The no-break spaces are load-bearing: `.bridge` is `text-wrap: balance`,
   and left to itself it parks the lone article "A" at the end of a line and
   starts the next one on "former". An article belongs to its noun phrase. */
export const boardBridge =
  'A\u00A0former cabinet secretary. A\u00A0former national security advisor. A\u00A0former governor. The country’s first chief technology officer. A university provost. A co-founder of Oculus.';

export const mastheadBridge =
  'A pilot is only as good as the people who will answer for it.';

/* The homepage says it in half the words — the scene there is one glance,
   not a page. Same rule: every office is quoted from a title in site.js. */
export const homeBridge =
  'A\u00A0former cabinet secretary. A\u00A0former governor. The country’s first chief technology officer.';

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
   the way they meet 16. The verb is "put forward", which is what
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
    /* "Not yet seated", not "none has accepted".
       `refs/BRIEF.md` says the board is PROSPECTIVE. Prospective supports
       "not yet seated" — that is what the word means. It does not support a
       count of who has or has not accepted: accepting an invitation and being
       seated on a formed board are two different acts, and nobody has told us
       the first number. The site was asserting it at 67px over sixteen named,
       identifiable people. Claim only what the source carries. */
    accepted: '00',
    acceptedLabel: 'Seated',
    none: 'The board is not yet seated.',
    line: `${word} put forward. The board is not yet seated.`,
  };
}

/* ── THE SHAPE OF THE SHEET ──────────────────────────────────────────
   The one thing flattening buys, and the reason the roster is not simply
   sixteen rows.

   Sixteen is a rectangle. Two columns of eight, and on a phone one column
   of sixteen — every fold divides the roster evenly and no cell is ever
   empty. The cohorts could never do that: they were 6 / 5 / 5, so on three
   tracks the bottom-right corner of the plate was blank and a column rule
   ran 93px past the last name into nothing, twice. That was a real defect
   of the grouping, not of the grid.

   Two tracks also buy the width the payload needs. At three tracks a
   record had ~330px for its text and offices like "First U.S. Chief
   Technology Officer; Chair, Arcadia Institute" broke into ragged
   two- and three-line blocks. At two, near a full desktop, the offices set
   on one line each and become a legible vertical run — sixteen offices
   read at a glance, in the only words any source gives us. That run IS the
   calibre of the room, stated as fact instead of as three headings we
   wrote ourselves.

   `rowsFor` returns the row count per column count so the fill stays
   column-major at every width: a reader takes the left column top to
   bottom, then the right one, the way a printed roster is read. */
export function rowsFor(board) {
  const n = board.length;
  return { two: Math.ceil(n / 2), one: n };
}
