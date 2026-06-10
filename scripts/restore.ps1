param(
  [Parameter(Position = 0)]
  [string]$ArchivePath
)

$ErrorActionPreference = 'Stop'

if (!$ArchivePath) {
  Write-Output 'Usage: pnpm restore -- backups\articles-site-YYYYMMDD-HHMMSS.zip'
  exit 1
}

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$archive = Resolve-Path $ArchivePath
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$restoreRoot = Join-Path $root 'backups'
$workDir = Join-Path $restoreRoot "restore-$timestamp"
$databaseDump = Join-Path $workDir 'database.sql'
$mediaSource = Join-Path $workDir 'media'
$mediaTarget = Join-Path $root 'media'
$oldMediaTarget = Join-Path $root "media.before-restore-$timestamp"

Push-Location $root
try {
  Write-Output 'Creating safety backup before restore...'
  & (Join-Path $PSScriptRoot 'backup.ps1') | Write-Output

  New-Item -ItemType Directory -Force -Path $workDir | Out-Null
  Expand-Archive -LiteralPath $archive -DestinationPath $workDir -Force

  if (!(Test-Path -LiteralPath $databaseDump)) {
    throw 'Backup archive does not contain database.sql.'
  }

  docker compose up -d | Out-Null
  Get-Content -LiteralPath $databaseDump | docker compose exec -T postgres psql -U postgres -d articles_site

  if (Test-Path -LiteralPath $mediaSource) {
    if (Test-Path -LiteralPath $mediaTarget) {
      Move-Item -LiteralPath $mediaTarget -Destination $oldMediaTarget
    }

    Copy-Item -LiteralPath $mediaSource -Destination $mediaTarget -Recurse
  }

  Remove-Item -LiteralPath $workDir -Recurse -Force
  Write-Output "Restore completed from: $archive"
} finally {
  Pop-Location
}
