# scripts/update-beta.ps1
# Pulls the latest redesign from branch v3 and builds it into the /beta slug on main

Write-Host "Updating /beta from branch v3..." -ForegroundColor Cyan

$currentBranch = (git rev-parse --abbrev-ref HEAD).Trim()
if ($currentBranch -ne "main") {
    Write-Warning "Switching to main branch..."
    git checkout main
}

# Checkout v3 temporarily to run the beta build
git checkout v3
npm run build:beta

# Switch back to main
git checkout main

# Remove redundant CNAME in beta folder if generated
if (Test-Path "beta\CNAME") {
    Remove-Item "beta\CNAME" -Force
}

Write-Host "Successfully updated /beta on main from v3!" -ForegroundColor Green
Write-Host "Review changes with 'git status' and commit when ready." -ForegroundColor Yellow
