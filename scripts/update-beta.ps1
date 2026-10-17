# scripts/update-beta.ps1
# Pulls the latest redesign from branch v3 and builds it into the /beta slug on main

Write-Host "Updating /beta from branch v3..." -ForegroundColor Cyan

# Checkout v3 and build with /beta/ base into a temporary directory
git checkout v3
npx vite build --base=/beta/ --outDir=temp-beta

# Switch back to main branch
git checkout main

# Replace beta directory with newly built version
if (Test-Path "beta") {
    Remove-Item -Recurse -Force "beta" -ErrorAction SilentlyContinue
}
Move-Item "temp-beta" "beta"

# Remove redundant CNAME in beta folder if generated
if (Test-Path "beta\CNAME") {
    Remove-Item "beta\CNAME" -Force -ErrorAction SilentlyContinue
}

Write-Host "Successfully updated /beta on main from v3!" -ForegroundColor Green
Write-Host "Review changes with 'git status' and commit when ready." -ForegroundColor Yellow
