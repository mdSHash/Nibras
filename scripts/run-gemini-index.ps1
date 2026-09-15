# Builds (or resumes) the Gemini embedding index for the chat assistant.
# Meant for a daily Windows scheduled task: Gemini's free tier allows about
# 1,000 embeddings per day, so a full index takes several runs. Each run
# embeds until the daily quota is reached and keeps its progress; once the
# index is complete, a run does nothing.
#
# Output: public/data/chat-embeddings-gemini.json (commit it once complete)
# Log:    test-results/gemini-index-YYYY-MM-DD.log

$ErrorActionPreference = 'Continue'
$repo = Split-Path -Parent $PSScriptRoot
Set-Location $repo

$logDir = Join-Path $repo 'test-results'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$log = Join-Path $logDir ("gemini-index-" + (Get-Date -Format 'yyyy-MM-dd') + ".log")

"=== run started $(Get-Date -Format o) ===" | Out-File -FilePath $log -Append -Encoding utf8
& npx.cmd tsx scripts/build-chat-embeddings.ts gemini *>> $log
"=== run finished $(Get-Date -Format o) (exit $LASTEXITCODE) ===" | Out-File -FilePath $log -Append -Encoding utf8
