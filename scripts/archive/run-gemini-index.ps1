# Builds (or resumes) the Gemini embedding index for the chat assistant.
# Meant for a daily Windows scheduled task: Gemini's free tier allows about
# 1,000 embeddings per day, so a full index takes several runs. Each run
# embeds until the daily quota is reached and keeps its progress; once the
# index is complete, a run does nothing.
#
# Progress shows in the task's window and in the log. Closing the window
# stops the run; the next run picks up where it left off.
#
# Output: public/data/chat-embeddings-gemini.json (commit it once complete)
# Log:    test-results/gemini-index-YYYY-MM-DD.log

$ErrorActionPreference = 'Continue'
[Console]::OutputEncoding = [Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = 'Nibras - Gemini chat index'
$repo = Split-Path -Parent $PSScriptRoot
Set-Location $repo

$logDir = Join-Path $repo 'test-results'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$log = Join-Path $logDir ("gemini-index-" + (Get-Date -Format 'yyyy-MM-dd') + ".log")

# One shared handle for the whole run, so something reading the log can't
# block writes. If the log can't be opened, progress still shows here.
$writer = $null
try {
  $stream = [IO.File]::Open($log, [IO.FileMode]::Append, [IO.FileAccess]::Write, [IO.FileShare]::ReadWrite)
  $writer = New-Object IO.StreamWriter($stream, (New-Object Text.UTF8Encoding($false)))
  $writer.AutoFlush = $true
} catch {
  Write-Host "Could not open the log ($($_.Exception.Message)); progress is shown here only." -ForegroundColor Yellow
}

function Write-Log([string]$line) {
  Write-Host $line
  if ($writer) { $writer.WriteLine($line) }
}

Write-Host 'Building the Nibras chat index. Leave this window open: it closes by itself'
Write-Host "when today's run is done (usually 10-20 minutes). Log: $log"
Write-Host ''
try {
  Write-Log "=== run started $(Get-Date -Format o) ==="
  # cmd merges stderr into stdout, so warnings arrive as plain lines (not
  # PowerShell error records) and the log stays UTF-8 instead of UTF-16.
  & cmd.exe /c "npx.cmd tsx scripts/build-chat-embeddings.ts gemini 2>&1" | ForEach-Object { Write-Log $_ }
  Write-Log "=== run finished $(Get-Date -Format o) (exit $LASTEXITCODE) ==="
} finally {
  if ($writer) { $writer.Dispose() }
}
