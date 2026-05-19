# 🚀 [AI 사랑의 카운셀러] 실시간 배포 자동화 파워쉘 스크립트

Write-Host "`n💖 [AI 사랑의 카운셀러] 경석님! 라이브 배포를 전격 가동합니다! 🔮✨" -ForegroundColor Green

# 1. Git 상태 추가
Write-Host "`n📦 [1단계] 수정된 소스코드 포장 중 (git add .)..." -ForegroundColor Yellow
git add .

# 2. Git 커밋 생성
$commitMsg = "feat: AI 카운셀러 복구 및 10대10 일러스트 확장 매칭 엔진 탑재"
Write-Host "📝 [2단계] 배포 보고서 작성 중 (git commit)..." -ForegroundColor Yellow
git commit -m $commitMsg

# 3. 깃허브 푸시
Write-Host "✈️ [3단계] 깃허브 클라우드로 전송 중 (git push origin main)..." -ForegroundColor Yellow
git push origin main

Write-Host "`n🎉 [AI 사랑의 카운셀러] 원격 깃허브 푸시 완료! Render 서버가 1~2분 내로 실시간으로 라이브 웹사이트에 적용할 것입니다!" -ForegroundColor Green
Write-Host "오늘 하루도 수고 많으셨습니다! 이제 설레는 소개팅 데이트 결과를 만나보세요! 💖✨`n" -ForegroundColor Cyan
