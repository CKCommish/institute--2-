<#
.SYNOPSIS
    Finds - and, with -Fix, walks you through removing - the common causes of
    Chrome being hijacked to Yahoo Search on a Windows PC.

.DESCRIPTION
    The "Yahoo keeps taking over Chrome" problem is almost never Yahoo itself.
    It is adware that earns money from Yahoo's search-partner program by
    forcing your searches through search.yahoo.com with its partner tag
    attached. It does that from one or more of these places, all of which this
    script checks:

      1. Registry policies that force the browser's search engine
         (the "Managed by your organization" message on a home PC)
      2. A rogue Chrome cloud-management enrollment
      3. A Chrome extension that overrides search / new tab / startup pages
      4. An installed adware program (OneLaunch, Wave Browser, Web Companion...)
      5. Persistence that re-applies the hijack after you fix it: services,
         scheduled tasks, Run keys, Startup-folder items
         <- this is why it KEEPS coming back
      6. Browser shortcuts edited to open an attacker page
      7. A lookalike browser registered as the Windows default browser

    Without -Fix the script is read-only. With -Fix it asks before every
    single change and backs up everything it removes to a folder on your
    Desktop. It never deletes programs, never touches Chrome profile files,
    and never downloads or runs anything from the internet.

.EXAMPLE
    Scan only (read-only, changes nothing):
        powershell -NoProfile -ExecutionPolicy Bypass -File .\Fix-YahooHijack.ps1

.EXAMPLE
    Scan and fix (run from an elevated "Run as administrator" PowerShell):
        powershell -NoProfile -ExecutionPolicy Bypass -File .\Fix-YahooHijack.ps1 -Fix
#>
[CmdletBinding()]
param(
    [switch]$Fix
)

$ErrorActionPreference = 'Continue'

$stamp     = Get-Date -Format 'yyyyMMdd-HHmmss'
$desktop   = [Environment]::GetFolderPath('Desktop')
$logPath   = Join-Path $desktop "yahoo-hijack-scan-$stamp.txt"
$backupDir = Join-Path $desktop "yahoo-hijack-backups-$stamp"

$script:redCount    = 0
$script:reviewCount = 0

# Adware families known to hijack browser search settings.
$pupPattern = 'wave.?browser|wavesor|onelaunch|one.?launch|onestart|web.?companion|chromstera|web.?discover|search.?awesome|pc.?app.?store|smartbar|boostedbar|pdf.?power|pdfflex|artificius|taskbarify|taskbar.?system|chedot|search.?protect|conduit|babylon|mysearchdial|delta.?toolbar|sweet.?pack|snap\.do'

function Write-Section([string]$Title) {
    Write-Host ""
    Write-Host ("=" * 72) -ForegroundColor White
    Write-Host "  $Title" -ForegroundColor White
    Write-Host ("=" * 72) -ForegroundColor White
}

function Flag([string]$Tier, [string]$Text) {
    switch ($Tier) {
        'RED'    { $script:redCount++;    Write-Host "  [RED]    $Text" -ForegroundColor Red }
        'REVIEW' { $script:reviewCount++; Write-Host "  [REVIEW] $Text" -ForegroundColor Yellow }
        'OK'     { Write-Host "  [ok]     $Text" -ForegroundColor Green }
        default  { Write-Host "  [info]   $Text" -ForegroundColor Cyan }
    }
}

function Detail([string]$Text) {
    Write-Host "           $Text" -ForegroundColor Gray
}

function Confirm-Step([string]$Question) {
    if (-not $Fix) { return $false }
    $answer = Read-Host "  >> $Question  [y/N]"
    return ($answer -match '^[Yy]')
}

function Backup-RegKey([string]$RegPath) {
    # $RegPath in reg.exe form, e.g. HKCU\SOFTWARE\Policies\Google\Chrome
    try {
        if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir -Force | Out-Null }
        $file = Join-Path $backupDir (($RegPath -replace '[\\:]', '-') + '.reg')
        & reg.exe export $RegPath $file /y 2>$null | Out-Null
        if (Test-Path $file) { Detail "backed up to $file"; return $true }
    } catch { }
    Flag REVIEW "Could not back up $RegPath - leaving it untouched."
    return $false
}

function Show-RegTree([string]$PsPath) {
    $keys = @()
    $rootItem = Get-Item $PsPath -ErrorAction SilentlyContinue
    if ($rootItem) { $keys += $rootItem }
    $keys += @(Get-ChildItem $PsPath -Recurse -ErrorAction SilentlyContinue)
    foreach ($k in $keys) {
        foreach ($name in $k.GetValueNames()) {
            $value = $k.GetValue($name)
            Detail ("{0}  ::  {1} = {2}" -f $k.Name, $name, ($value -join ' | '))
        }
    }
}

function Remove-PolicyKey($Root) {
    if (Confirm-Step "Back up and DELETE the whole key $($Root.Reg)?") {
        if (Backup-RegKey $Root.Reg) {
            try {
                Remove-Item -Path $Root.Ps -Recurse -Force -ErrorAction Stop
                Flag OK "Removed $($Root.Reg)"
            } catch {
                Flag REVIEW ("Failed to remove {0}: {1}" -f $Root.Reg, $_.Exception.Message)
            }
        }
    }
}

try { Start-Transcript -Path $logPath | Out-Null } catch { }

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
$partOfDomain = $false
try { $partOfDomain = [bool](Get-CimInstance Win32_ComputerSystem -ErrorAction Stop).PartOfDomain } catch { }

$modeText = 'scan only (read-only)'
if ($Fix) { $modeText = 'SCAN + FIX (asks before every change)' }

Write-Host ""
Write-Host "Yahoo / Chrome hijack scanner" -ForegroundColor White
Write-Host ("  mode: {0}" -f $modeText)
Write-Host ("  administrator: {0}" -f $isAdmin)
Write-Host ("  log file: {0}" -f $logPath)

if ($Fix -and -not $isAdmin) {
    Flag REVIEW "Not running as administrator: machine-wide items (HKLM policies, services, some scheduled tasks) can be FOUND but not FIXED. Re-run from an elevated PowerShell to fix those."
}
if ($partOfDomain) {
    Flag REVIEW "This PC is joined to a company domain. Some policies may be real IT management - do not delete anything your IT department set."
}

# ---------------------------------------------------------------------------
Write-Section "1) Registry policies that force the browser's search engine"
Write-Host "  A home PC should normally have NO Chrome/Edge policy keys at all."
Write-Host "  Hijackers add them to lock the search engine so you cannot change it"
Write-Host "  back - that is the 'Managed by your organization' message in Chrome."

$policyRoots = @(
    @{ Ps = 'HKCU:\SOFTWARE\Policies\Google\Chrome';             Reg = 'HKCU\SOFTWARE\Policies\Google\Chrome';             NeedsAdmin = $false },
    @{ Ps = 'HKLM:\SOFTWARE\Policies\Google\Chrome';             Reg = 'HKLM\SOFTWARE\Policies\Google\Chrome';             NeedsAdmin = $true  },
    @{ Ps = 'HKLM:\SOFTWARE\WOW6432Node\Policies\Google\Chrome'; Reg = 'HKLM\SOFTWARE\WOW6432Node\Policies\Google\Chrome'; NeedsAdmin = $true  },
    @{ Ps = 'HKCU:\SOFTWARE\Policies\Microsoft\Edge';            Reg = 'HKCU\SOFTWARE\Policies\Microsoft\Edge';            NeedsAdmin = $false },
    @{ Ps = 'HKLM:\SOFTWARE\Policies\Microsoft\Edge';            Reg = 'HKLM\SOFTWARE\Policies\Microsoft\Edge';            NeedsAdmin = $true  }
)

$policyFound = $false
foreach ($root in $policyRoots) {
    if (Test-Path $root.Ps) {
        $policyFound = $true
        Flag RED "Policy key present: $($root.Reg)"
        Show-RegTree $root.Ps
        if ($Fix) {
            if ($root.NeedsAdmin -and -not $isAdmin) {
                Flag REVIEW "Cannot remove $($root.Reg) without administrator rights."
            } else {
                Remove-PolicyKey $root
            }
        }
    }
}
if (-not $policyFound) { Flag OK "No Chrome or Edge policy keys found." }

# ---------------------------------------------------------------------------
Write-Section "2) Rogue Chrome cloud-management enrollment"
Write-Host "  Some hijackers enroll your Chrome into THEIR management console, which"
Write-Host "  then pushes the search engine to you exactly like corporate IT would."

$enrollRoots = @(
    @{ Ps = 'HKLM:\SOFTWARE\Google\Chrome\Enrollment';             Reg = 'HKLM\SOFTWARE\Google\Chrome\Enrollment';             NeedsAdmin = $true },
    @{ Ps = 'HKLM:\SOFTWARE\WOW6432Node\Google\Chrome\Enrollment'; Reg = 'HKLM\SOFTWARE\WOW6432Node\Google\Chrome\Enrollment'; NeedsAdmin = $true }
)
$enrollFound = $false
foreach ($root in $enrollRoots) {
    if (Test-Path $root.Ps) {
        $enrollFound = $true
        Flag RED "Chrome is enrolled in cloud management: $($root.Reg)"
        Show-RegTree $root.Ps
        Detail "Open chrome://management in Chrome to see who claims to manage it."
        if ($Fix) {
            if (-not $isAdmin) {
                Flag REVIEW "Administrator rights needed to remove the enrollment."
            } elseif ($partOfDomain) {
                Flag REVIEW "Domain-joined PC - check with IT before removing the enrollment."
            } else {
                Remove-PolicyKey $root
            }
        }
    }
}
if (-not $enrollFound) { Flag OK "No cloud-management enrollment found." }

# ---------------------------------------------------------------------------
Write-Section "3) Chrome profiles: search engine, startup pages, extensions"

$userData = Join-Path $env:LOCALAPPDATA 'Google\Chrome\User Data'
if (-not (Test-Path $userData)) {
    Flag INFO "No Chrome user-data folder at $userData"
} else {
    $profiles = Get-ChildItem $userData -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -eq 'Default' -or $_.Name -like 'Profile *' }
    foreach ($chromeProfile in $profiles) {
        Write-Host ""
        Write-Host "  --- profile '$($chromeProfile.Name)' ---" -ForegroundColor White

        $dsp = $null; $startupUrls = @(); $homepage = $null
        foreach ($prefName in @('Secure Preferences', 'Preferences')) {
            $prefPath = Join-Path $chromeProfile.FullName $prefName
            if (-not (Test-Path $prefPath)) { continue }
            try { $prefs = Get-Content -LiteralPath $prefPath -Raw -ErrorAction Stop | ConvertFrom-Json } catch { continue }
            if (-not $dsp -and $prefs.default_search_provider_data -and $prefs.default_search_provider_data.template_url_data) {
                $dsp = $prefs.default_search_provider_data.template_url_data
            }
            if ($prefs.session -and $prefs.session.startup_urls) { $startupUrls = @($prefs.session.startup_urls) }
            if (-not $homepage -and $prefs.homepage) { $homepage = $prefs.homepage }
        }

        if ($dsp) {
            $searchUrl = $dsp.url
            if (-not $searchUrl) { $searchUrl = $dsp.search_url }
            if ("$searchUrl" -match 'yahoo\.') {
                Flag RED ("Default search engine is Yahoo: '{0}'" -f $dsp.short_name)
                Detail ("search URL: {0}" -f $searchUrl)
                if ("$searchUrl" -match 'hspart=([^&"\s]+)') {
                    Detail ("Yahoo partner tag hspart={0} - this names the adware family that gets paid for your searches." -f $matches[1])
                }
                Detail "Fix (after removing the cause): chrome://settings/searchEngines -> set Google, delete the Yahoo entry."
            } else {
                Flag INFO ("Default search engine: '{0}'  {1}" -f $dsp.short_name, $searchUrl)
            }
        } else {
            Flag OK "Default search engine not overridden (Chrome default)."
        }

        foreach ($u in $startupUrls) {
            if (("$u" -match 'yahoo\.') -or ("$u" -match $pupPattern)) { Flag RED "Startup page: $u" }
            else { Flag INFO "Startup page: $u" }
        }
        if ($homepage) {
            if (("$homepage" -match 'yahoo\.') -or ("$homepage" -match $pupPattern)) { Flag RED "Homepage: $homepage" }
            else { Flag INFO "Homepage: $homepage" }
        }

        $extRoot = Join-Path $chromeProfile.FullName 'Extensions'
        if (Test-Path $extRoot) {
            foreach ($extDir in (Get-ChildItem $extRoot -Directory -ErrorAction SilentlyContinue)) {
                if ($extDir.Name -eq 'Temp') { continue }
                $verDir = Get-ChildItem $extDir.FullName -Directory -ErrorAction SilentlyContinue |
                    Sort-Object Name -Descending | Select-Object -First 1
                if (-not $verDir) { continue }
                $manifestPath = Join-Path $verDir.FullName 'manifest.json'
                if (-not (Test-Path $manifestPath)) { continue }
                try { $manifest = Get-Content -LiteralPath $manifestPath -Raw -ErrorAction Stop | ConvertFrom-Json } catch { continue }

                $name = [string]$manifest.name
                if ($name -match '^__MSG_(.+)__$') {
                    $msgKey = $matches[1]
                    $locale = $manifest.default_locale
                    if (-not $locale) { $locale = 'en' }
                    $msgPath = Join-Path $verDir.FullName ("_locales\{0}\messages.json" -f $locale)
                    if (Test-Path $msgPath) {
                        try {
                            $messages = Get-Content -LiteralPath $msgPath -Raw -ErrorAction Stop | ConvertFrom-Json
                            $prop = $messages.PSObject.Properties | Where-Object { $_.Name -eq $msgKey } | Select-Object -First 1
                            if ($prop -and $prop.Value.message) { $name = $prop.Value.message }
                        } catch { }
                    }
                }

                $overrides = @()
                $cso = $manifest.chrome_settings_overrides
                if ($cso) {
                    if ($cso.search_provider) { $overrides += 'SEARCH ENGINE' }
                    if ($cso.homepage)        { $overrides += 'homepage' }
                    if ($cso.startup_pages)   { $overrides += 'startup pages' }
                }
                if ($manifest.chrome_url_overrides -and $manifest.chrome_url_overrides.newtab) { $overrides += 'new-tab page' }

                if ($overrides.Count -gt 0) {
                    Flag RED ("Extension '{0}' (id {1}) overrides: {2}" -f $name, $extDir.Name, ($overrides -join ', '))
                    if ($cso -and $cso.search_provider -and $cso.search_provider.search_url) {
                        Detail ("its search URL: {0}" -f $cso.search_provider.search_url)
                    }
                    Detail "If you did not install this on purpose, remove it at chrome://extensions."
                    Detail "(This script deliberately does not delete Chrome profile files.)"
                } elseif ($name -match $pupPattern) {
                    Flag RED ("Extension '{0}' (id {1}) matches a known adware name - remove it at chrome://extensions." -f $name, $extDir.Name)
                } else {
                    Detail ("extension: {0}  ({1})" -f $name, $extDir.Name)
                }
            }
        } else {
            Flag INFO "No extensions folder in this profile."
        }
    }
}

# ---------------------------------------------------------------------------
Write-Section "4) Installed programs known to hijack search"

$uninstallRoots = @(
    'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*',
    'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*',
    'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*'
)
$apps = foreach ($root in $uninstallRoots) { Get-ItemProperty $root -ErrorAction SilentlyContinue }

$knownBad = @($apps | Where-Object { $_.DisplayName -and ($_.DisplayName -match $pupPattern) })
foreach ($app in $knownBad) {
    Flag RED ("Installed program: '{0}'   publisher: {1}" -f $app.DisplayName, $app.Publisher)
    if ($app.InstallLocation) { Detail "location: $($app.InstallLocation)" }
    if ($app.UninstallString) { Detail "uninstall command: $($app.UninstallString)" }
}
if ($knownBad.Count -eq 0) { Flag OK "No known hijacker programs in the installed-apps list." }

$knownGoodBrowsers = 'Google Chrome|Microsoft Edge|Mozilla Firefox|Firefox|Brave|Opera|Vivaldi|Tor Browser'
$suspicious = @($apps | Where-Object {
    $_.DisplayName -and
    ($_.DisplayName -notmatch $pupPattern) -and
    ($_.DisplayName -match 'search|toolbar|browser') -and
    ($_.DisplayName -notmatch $knownGoodBrowsers) -and
    ($_.DisplayName -notmatch 'Windows|Microsoft|Intel|NVIDIA|AMD|Everything|PowerToys|BrowserCore')
})
foreach ($app in $suspicious) {
    Flag REVIEW ("Look at this one yourself: '{0}'   publisher: {1}" -f $app.DisplayName, $app.Publisher)
}

if (($knownBad.Count -gt 0) -and (Confirm-Step "Open Windows 'Installed apps' now so you can uninstall the RED items above?")) {
    Start-Process 'ms-settings:appsfeatures'
    Detail "Uninstall the RED items there. This script does not auto-run uninstallers."
}

# ---------------------------------------------------------------------------
Write-Section "5) Persistence - what makes the hijack COME BACK after you fix it"

Write-Host "  - Services -"
$badServices = @()
try {
    $badServices = @(Get-CimInstance Win32_Service -ErrorAction Stop | Where-Object {
        ("$($_.PathName)" -match $pupPattern) -or ("$($_.DisplayName)" -match $pupPattern) -or ("$($_.Name)" -match $pupPattern)
    })
} catch { }
foreach ($svc in $badServices) {
    Flag RED ("Service '{0}' ({1})   state: {2}" -f $svc.DisplayName, $svc.Name, $svc.State)
    Detail "path: $($svc.PathName)"
    if (Confirm-Step "Stop and DISABLE service '$($svc.Name)'? (reversible in services.msc)") {
        try {
            Stop-Service -Name $svc.Name -Force -ErrorAction SilentlyContinue
            Set-Service -Name $svc.Name -StartupType Disabled -ErrorAction Stop
            Flag OK "Service '$($svc.Name)' stopped and disabled."
        } catch { Flag REVIEW ("Could not disable '{0}': {1}" -f $svc.Name, $_.Exception.Message) }
    }
}
if ($badServices.Count -eq 0) { Flag OK "No services matching known hijacker names." }

Write-Host "  - Scheduled tasks -"
$redTasks = @()
try { $allTasks = @(Get-ScheduledTask -ErrorAction Stop) } catch { $allTasks = @() }
foreach ($task in $allTasks) {
    foreach ($action in @($task.Actions)) {
        $exe = [string]$action.Execute
        if (-not $exe) { continue }
        $arguments = [string]$action.Arguments
        $line = ("$exe $arguments").Trim()
        $where = "$($task.TaskPath)$($task.TaskName)"
        if ($line -match $pupPattern) {
            Flag RED ("Task {0}   runs: {1}" -f $where, $line)
            $redTasks += ,$task
        }
        elseif (($exe -match 'powershell|pwsh|wscript|cscript|mshta|cmd\.exe') -and ($arguments -match '-enc|encodedcommand|hidden|downloadstring|invoke-expression|iwr |irm |\.hta')) {
            Flag RED ("Task {0}   runs a hidden/encoded script: {1}" -f $where, $line)
            $redTasks += ,$task
        }
        elseif ($line -match 'https?://') {
            Flag REVIEW ("Task {0} opens a URL: {1}" -f $where, $line)
        }
        elseif ($line -match 'AppData\\Local\\Temp|\\Temp\\') {
            Flag REVIEW ("Task {0} runs from a Temp folder: {1}" -f $where, $line)
        }
        elseif (($line -match 'AppData') -and ($task.TaskPath -notmatch '^\\Microsoft\\')) {
            Flag REVIEW ("Task {0} runs from AppData (normal for OneDrive/Discord/Slack - worry only if unfamiliar): {1}" -f $where, $line)
        }
    }
}
foreach ($task in $redTasks) {
    if (Confirm-Step "DISABLE scheduled task '$($task.TaskPath)$($task.TaskName)'? (reversible in Task Scheduler)") {
        try {
            Disable-ScheduledTask -TaskName $task.TaskName -TaskPath $task.TaskPath -ErrorAction Stop | Out-Null
            Flag OK "Task disabled."
        } catch { Flag REVIEW ("Could not disable it: {0}" -f $_.Exception.Message) }
    }
}
if ($redTasks.Count -eq 0) { Flag OK "No scheduled tasks matching known hijacker patterns." }

Write-Host "  - Run keys (programs that start with Windows) -"
$runRoots = @(
    @{ Ps = 'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run';             Reg = 'HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run' },
    @{ Ps = 'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce';         Reg = 'HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce' },
    @{ Ps = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run';             Reg = 'HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run' },
    @{ Ps = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce';         Reg = 'HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce' },
    @{ Ps = 'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run'; Reg = 'HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run' }
)
foreach ($root in $runRoots) {
    $key = Get-Item $root.Ps -ErrorAction SilentlyContinue
    if (-not $key) { continue }
    foreach ($valueName in $key.GetValueNames()) {
        $command = [string]$key.GetValue($valueName)
        if (-not $command) { continue }
        $entry = ("{0}  ::  {1} = {2}" -f $root.Reg, $valueName, $command)
        $isRed = ($command -match $pupPattern) -or ($valueName -match $pupPattern) -or
                 ($command -match 'AppData\\Local\\Temp|-enc |encodedcommand|mshta|downloadstring|invoke-expression')
        if ($isRed) {
            Flag RED $entry
            if (Confirm-Step "Back up this Run key and REMOVE the entry '$valueName'?") {
                if (Backup-RegKey $root.Reg) {
                    try {
                        Remove-ItemProperty -Path $root.Ps -Name $valueName -ErrorAction Stop
                        Flag OK "Removed startup entry '$valueName'."
                    } catch { Flag REVIEW ("Could not remove it: {0}" -f $_.Exception.Message) }
                }
            }
        }
        elseif ($command -match 'AppData') {
            Flag REVIEW "$entry   (AppData is normal for OneDrive/Discord/Slack - worry only if unfamiliar)"
        }
        else {
            Detail $entry
        }
    }
}

Write-Host "  - Startup folders -"
$startupDirs = @([Environment]::GetFolderPath('Startup'), [Environment]::GetFolderPath('CommonStartup'))
foreach ($dir in $startupDirs) {
    if (-not ($dir -and (Test-Path $dir))) { continue }
    foreach ($item in (Get-ChildItem $dir -File -ErrorAction SilentlyContinue)) {
        if ($item.Name -match $pupPattern) { Flag RED ("Startup item: {0}" -f $item.FullName) }
        elseif ($item.Extension -ne '.ini') { Detail ("startup item: {0}" -f $item.FullName) }
    }
}

# ---------------------------------------------------------------------------
Write-Section "6) Browser shortcuts with an injected page"

$shell = New-Object -ComObject WScript.Shell
$shortcutDirs = @(
    [Environment]::GetFolderPath('Desktop'),
    [Environment]::GetFolderPath('CommonDesktopDirectory'),
    [Environment]::GetFolderPath('StartMenu'),
    [Environment]::GetFolderPath('CommonStartMenu'),
    (Join-Path $env:APPDATA 'Microsoft\Internet Explorer\Quick Launch')
)
$shortcutFindings = 0
foreach ($dir in $shortcutDirs) {
    if (-not ($dir -and (Test-Path $dir))) { continue }
    foreach ($lnk in (Get-ChildItem $dir -Recurse -Filter *.lnk -ErrorAction SilentlyContinue)) {
        try { $sc = $shell.CreateShortcut($lnk.FullName) } catch { continue }
        $target    = [string]$sc.TargetPath
        $arguments = [string]$sc.Arguments
        $isBrowser = $target -match 'chrome\.exe|msedge\.exe|firefox\.exe|brave\.exe|opera\.exe|launcher\.exe'
        if ($target -match $pupPattern) {
            $shortcutFindings++
            Flag RED ("Shortcut points at a hijacker program: {0}" -f $lnk.FullName)
            Detail ("target: {0}" -f $target)
        }
        elseif ($isBrowser -and $arguments -and ($arguments -match 'https?:|www\.')) {
            $shortcutFindings++
            Flag RED ("Shortcut opens the browser WITH a page injected: {0}" -f $lnk.FullName)
            Detail ("target: {0}" -f $target)
            Detail ("injected arguments: {0}" -f $arguments)
            if (Confirm-Step "Clean this shortcut (remove the injected arguments)?") {
                try {
                    if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir -Force | Out-Null }
                    Add-Content -Path (Join-Path $backupDir 'shortcuts-before-cleaning.txt') -Value ("{0}`t{1}`t{2}" -f $lnk.FullName, $target, $arguments)
                    $sc.Arguments = ''
                    $sc.Save()
                    Flag OK "Shortcut cleaned."
                } catch { Flag REVIEW ("Could not clean the shortcut: {0}" -f $_.Exception.Message) }
            }
        }
    }
}
if ($shortcutFindings -eq 0) { Flag OK "No tampered browser shortcuts found." }

# ---------------------------------------------------------------------------
Write-Section "7) Windows default browser registration"

$progIdNames = @{
    'ChromeHTML'  = 'Google Chrome'
    'MSEdgeHTM'   = 'Microsoft Edge'
    'BraveHTML'   = 'Brave'
    'OperaStable' = 'Opera'
    'VivaldiHTM'  = 'Vivaldi'
    'IE.HTTP'     = 'Internet Explorer'
}
foreach ($scheme in @('http', 'https')) {
    $userChoice = Get-ItemProperty ("HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\{0}\UserChoice" -f $scheme) -ErrorAction SilentlyContinue
    $progId = [string]$userChoice.ProgId
    if (-not $progId) { Flag INFO "No default-browser registration found for $scheme."; continue }
    $friendly = $progIdNames[$progId]
    if (-not $friendly -and $progId -like 'FirefoxURL*') { $friendly = 'Mozilla Firefox' }
    if ($progId -match $pupPattern) {
        Flag RED ("Default browser for {0} is a known lookalike/adware browser: {1}" -f $scheme, $progId)
    } elseif ($friendly) {
        Flag INFO ("Default browser for {0}: {1}" -f $scheme, $friendly)
    } else {
        Flag REVIEW ("Default browser for {0} is an app this script does not recognise: {1}. If you did not choose it, a fake browser may have registered itself." -f $scheme, $progId)
    }
}
Detail "Windows only lets YOU change the default browser: Settings > Apps > Default apps."
if (Confirm-Step "Open the Default Apps settings page now?") { Start-Process 'ms-settings:defaultapps' }

# ---------------------------------------------------------------------------
Write-Section "Summary"

Write-Host ("  RED findings:    {0}   (near-certain hijack causes)" -f $script:redCount)
Write-Host ("  REVIEW findings: {0}   (look these over yourself)" -f $script:reviewCount)
if (Test-Path $backupDir) { Write-Host "  Backups: $backupDir" }
Write-Host "  Full log: $logPath"
Write-Host ""
Write-Host "  Finish the job inside Chrome itself (the script never edits your profile):" -ForegroundColor White
Write-Host "   1. chrome://extensions - remove anything you did not install on purpose."
Write-Host "   2. chrome://settings/searchEngines - set Google as default, then delete the"
Write-Host "      Yahoo entries (3-dot menu next to each one)."
Write-Host "   3. chrome://settings/onStartup and chrome://settings/appearance - remove any"
Write-Host "      Yahoo startup page or homepage."
Write-Host "   4. Restart Chrome. chrome://policy should list nothing, and the 'Managed by"
Write-Host "      your organization' line in the Chrome menu should be gone."
Write-Host "   5. Still stubborn? chrome://settings/reset -> 'Restore settings to their"
Write-Host "      original defaults' (keeps bookmarks and saved passwords)."
Write-Host ""
Write-Host "  If it comes back AGAIN, the two usual suspects:" -ForegroundColor White
Write-Host "   - Chrome Sync restoring the bad setting from your Google account: fix every"
Write-Host "     synced device, or clear server-side Chrome data at chrome.google.com/sync"
Write-Host "   - Leftover malware: run a full Microsoft Defender scan plus a free"
Write-Host "     second-opinion scan (Malwarebytes and its AdwCleaner are the usual picks)."
Write-Host ""
if ((-not $Fix) -and ($script:redCount -gt 0)) {
    Write-Host "  This was a READ-ONLY scan. To fix the RED items, re-run from an elevated" -ForegroundColor Yellow
    Write-Host "  (Run as administrator) PowerShell with:" -ForegroundColor Yellow
    Write-Host "      powershell -NoProfile -ExecutionPolicy Bypass -File .\Fix-YahooHijack.ps1 -Fix" -ForegroundColor Yellow
}

try { Stop-Transcript | Out-Null } catch { }
