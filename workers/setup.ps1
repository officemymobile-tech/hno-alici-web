# Einmaliges Deploy des Mitteilungs-Workers
# Voraussetzung: wrangler login (Cloudflare)

param(
  [Parameter(Mandatory = $true)]
  [string]$GitHubPat,
  [Parameter(Mandatory = $true)]
  [string]$AdminPassword
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Prüfe Cloudflare-Login …" -ForegroundColor Cyan
npx wrangler whoami | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Bitte zuerst: npx wrangler login" -ForegroundColor Red
  exit 1
}

Write-Host "Setze Geheimnisse …" -ForegroundColor Cyan
$AdminPassword | npx wrangler secret put ADMIN_PASSWORD
$GitHubPat | npx wrangler secret put GITHUB_PAT

Write-Host "Deploy Worker …" -ForegroundColor Cyan
$deployOut = npx wrangler deploy 2>&1 | Out-String
Write-Host $deployOut

if ($deployOut -match "https://[a-zA-Z0-9.-]+\.workers\.dev") {
  $url = $Matches[0].TrimEnd('/')
  $configPath = Join-Path $PSScriptRoot "..\public\admin\config.js"
  $config = @"
/**
 * API-URL des Cloudflare Workers (automatisch gesetzt)
 */
window.ADMIN_CONFIG = {
  apiUrl: "$url",
};
"@
  Set-Content -Path $configPath -Value $config -Encoding UTF8
  Write-Host ""
  Write-Host "Worker-URL: $url" -ForegroundColor Green
  Write-Host "config.js aktualisiert. Bitte committen und pushen." -ForegroundColor Green
  Write-Host ""
  Write-Host "Ordinations-Passwort (an Praxis weitergeben, nicht GitHub):" -ForegroundColor Yellow
  Write-Host $AdminPassword
} else {
  Write-Host "Deploy abgeschlossen — Worker-URL bitte manuell in public/admin/config.js eintragen." -ForegroundColor Yellow
}
