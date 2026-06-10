$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupRoot = Join-Path $root 'backups'
$workDir = Join-Path $backupRoot "articles-site-$timestamp"
$archivePath = "$workDir.zip"
$databaseDump = Join-Path $workDir 'database.sql'
$mediaSource = Join-Path $root 'media'
$mediaTarget = Join-Path $workDir 'media'

New-Item -ItemType Directory -Force -Path $workDir | Out-Null

Push-Location $root
try {
  docker compose ps postgres --status running | Out-Null

  docker compose exec -T postgres pg_dump `
    -U postgres `
    -d articles_site `
    --clean `
    --if-exists `
    --no-owner `
    --no-privileges `
    --format=plain `
    --file=/tmp/articles-site-backup.sql

  docker compose exec -T postgres cat /tmp/articles-site-backup.sql | Set-Content -LiteralPath $databaseDump -Encoding utf8
  docker compose exec -T postgres rm /tmp/articles-site-backup.sql | Out-Null

  if (Test-Path -LiteralPath $mediaSource) {
    Copy-Item -LiteralPath $mediaSource -Destination $mediaTarget -Recurse
  }

  Compress-Archive -Path (Join-Path $workDir '*') -DestinationPath $archivePath -Force
  Remove-Item -LiteralPath $workDir -Recurse -Force

  Write-Output "Backup created: $archivePath"
} finally {
  Pop-Location
}
