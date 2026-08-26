# Yahoo / Chrome hijack — scan and fix (Windows)

This folder is unrelated to the website source. It holds a PowerShell script the
repo owner asked for: their Windows PC keeps having Chrome's search taken over
by Yahoo, and this script finds and removes the usual causes. The whole folder
is safe to delete once the PC is clean.

## What the problem actually is

"Yahoo took over Chrome" is almost never Yahoo itself. It is adware that earns
money from Yahoo's search-partner program by forcing your searches through
`search.yahoo.com` with its partner tag (`hspart=...`) attached. It gets in as
a bundled "free" install (PDF converters, download managers, coupon tools,
lookalike browsers such as OneLaunch or Wave Browser) and holds on from up to
seven places: forced browser policies in the registry, a rogue Chrome
cloud-management enrollment, a Chrome extension, an installed program,
persistence (services / scheduled tasks / Run keys) that re-applies the hijack
after you fix it, tampered shortcuts, and the Windows default-browser
registration. The persistence part — plus Chrome Sync faithfully restoring the
bad setting from your Google account — is why it *keeps coming back*.

## Run it

1. On the affected PC, download
   [`Fix-YahooHijack.ps1`](https://raw.githubusercontent.com/CKCommish/institute--2-/claude/yahoo-default-browser-chrome-5hjjtt/tools/pc-yahoo-hijack-fix/Fix-YahooHijack.ps1)
   (right-click → Save link as…) into your Downloads folder.
2. Open PowerShell **as administrator**: Start menu → type `powershell` →
   right-click *Windows PowerShell* → *Run as administrator*.
3. Scan first (read-only, changes nothing):

   ```powershell
   cd $env:USERPROFILE\Downloads
   powershell -NoProfile -ExecutionPolicy Bypass -File .\Fix-YahooHijack.ps1
   ```

4. Read the `[RED]` findings, then fix:

   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File .\Fix-YahooHijack.ps1 -Fix
   ```

Every finding is written to a log file on your Desktop.

## What `-Fix` will touch (each change only after you type `y`)

- Delete adware-set Chrome/Edge **policy keys** in the registry (exported to a
  `.reg` backup on your Desktop first, so any deletion is reversible)
- Delete a rogue Chrome **cloud-management enrollment** (backed up first)
- Stop and **disable** (not delete) hijacker services and scheduled tasks
- Remove hijacker **startup (Run) entries** (key backed up first)
- Clean browser **shortcuts** that had a page injected (originals logged)

It never uninstalls programs for you, never edits Chrome profile files, and
never downloads or runs anything from the internet. Extensions and the search
engine list are finished by hand in Chrome — the script tells you exactly
where — because Chrome's own UI is the safe way to change those.

## The five-minute manual version

1. `chrome://extensions` — remove anything you did not knowingly install.
2. `chrome://settings/searchEngines` — set Google as default, delete Yahoo.
3. `chrome://policy` — if any policies are listed on a home PC, adware set
   them; the script removes these.
4. Windows Settings → Apps → Installed apps — uninstall anything unfamiliar,
   especially OneLaunch, Wave Browser, Web Companion, "PDF" tools, coupon or
   toolbar apps.
5. `chrome://settings/reset` → "Restore settings to their original defaults"
   (keeps bookmarks and passwords).
6. If it returns: fix every device that syncs your Google account (or clear
   server-side Chrome data at `chrome.google.com/sync`), and run Microsoft
   Defender plus Malwarebytes/AdwCleaner full scans.
