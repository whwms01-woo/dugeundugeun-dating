# [AI Love Counselor] Auto Deployment Script

Write-Host ""
Write-Host "[AI Love Counselor] Starting live deployment!" -ForegroundColor Green

# 1. Git Add
Write-Host ""
Write-Host "[Step 1] Packing code files (git add .)..." -ForegroundColor Yellow
git add .

# 2. Git Commit
$commitMsg = "fix: resolve page reset layout stretch and profile modal tags alignment bugs"
Write-Host "[Step 2] Creating git commit..." -ForegroundColor Yellow
git commit -m $commitMsg

# 3. Git Push
Write-Host "[Step 3] Pushing to GitHub (git push origin main)..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "[AI Love Counselor] GitHub push complete! Render will update the live site in 1-2 minutes." -ForegroundColor Green
Write-Host "Great job today! Enjoy your dating simulator matches!" -ForegroundColor Cyan
Write-Host ""
