# =====================================================================
# UPDATE_LOGO_SCRIPT_FIXED.ps1
# =====================================================================
# Script to copy the new logo file to all asset locations
# Uses ASCII-only comments and messages to avoid encoding issues

param(
    [string]$LogoSourcePath = ".\assets\logo.png",
    [string]$LogoUri = "ipfs://QmStnABpnxqfJQyjSGHXVS9h8kqrYi17bnsFzCKvoLeE7q"
)

Write-Host "=== UPDATE LOGOS ===" -ForegroundColor Green
Write-Host "Source: $LogoSourcePath" -ForegroundColor Cyan
Write-Host "IPFS URI: $LogoUri" -ForegroundColor Cyan
Write-Host ""

# List of target logo paths
$LogoTargets = @(
    ".\blockchains\smartchain\assets\0x419ecA43dB68E868E68d1aB460c8AC32523c7540\logo.png",
    ".\blockchains\ethereum\assets\0x419ecA43dB68E868E68d1aB460c8AC32523c7540\logo.png",
    ".\mschine\blockchains\smartchain\assets\0x419ecA43dB68E868E68d1aB460c8AC32523c7540\logo.png",
    ".\mschine\blockchains\ethereum\assets\0x419ecA43dB68E868E68d1aB460c8AC32523c7540\logo.png",
    ".\mschine\blockchains\smartchain\assets\0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11\logo.png",
    ".\mschine\blockchains\ethereum\assets\0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11\logo.png"
)

if (-not (Test-Path $LogoSourcePath)) {
    Write-Host "ERROR: logo source file not found: $LogoSourcePath" -ForegroundColor Red
    exit 1
}

$UpdatedCount = 0
foreach ($target in $LogoTargets) {
    $targetDir = Split-Path $target -Parent
    if (-not (Test-Path $targetDir)) {
        Write-Host "Creating directory: $targetDir" -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    try {
        Copy-Item -Path $LogoSourcePath -Destination $target -Force
        Write-Host "Updated: $target" -ForegroundColor Green
        $UpdatedCount++
    } catch {
        Write-Host "Failed to copy to $target : $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Total updated: $UpdatedCount / $($LogoTargets.Count)" -ForegroundColor Magenta
