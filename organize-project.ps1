# PowerShell-skript för att organisera filstrukturen

# Skapa mappstrukturen om den inte redan finns
if (-Not (Test-Path -Path "frontend\src")) {
    New-Item -Path "frontend\src" -ItemType Directory -Force
}

if (-Not (Test-Path -Path "frontend\public")) {
    New-Item -Path "frontend\public" -ItemType Directory -Force
}

# Kopiera alla src-filer till frontend/src
Copy-Item -Path "src\*" -Destination "frontend\src\" -Recurse -Force

# Kopiera alla public-filer till frontend/public
Copy-Item -Path "public\*" -Destination "frontend\public\" -Force

# Byt namn på package.json.new till package.json
if (Test-Path -Path "package.json.new") {
    Move-Item -Path "package.json.new" -Destination "package.json" -Force
}

# Lista upp filer som kan tas bort (men ta inte bort dem automatiskt)
Write-Host "`nEfter att ha kört detta skript kan följande filer/mappar tas bort från rotmappen:"
Write-Host "- src/               (Alla filer är nu kopierade till frontend/src)"
Write-Host "- public/            (Alla filer är nu kopierade till frontend/public)"
Write-Host "- index.html         (Finns nu i frontend/index.html)"
Write-Host "- tsconfig.json      (Finns nu i frontend/tsconfig.json)"
Write-Host "- tsconfig.node.json (Finns nu i frontend/tsconfig.node.json)"
Write-Host "- vite.config.ts     (Finns nu i frontend/vite.config.ts)"
Write-Host "- move-files.txt     (Behövs inte längre)"
Write-Host "- organize-project.ps1 (Detta skript, behövs inte efter användning)"

Write-Host "`nFöljande ska behållas i rotmappen:"
Write-Host "- frontend/          (Innehåller all frontend-kod)"
Write-Host "- server/            (Innehåller all backend-kod)"
Write-Host "- uploads/           (Används av servern för uppladdade filer)"
Write-Host "- package.json       (Innehåller skript för att köra både frontend och backend)"
Write-Host "- .env               (Miljövariabler för servern)"

Write-Host "`nEfter detta kommer projektet att ha en ren struktur med tydlig separation mellan frontend och backend."
Write-Host "Starta servern med 'npm run server' och frontend med 'npm run frontend'."
