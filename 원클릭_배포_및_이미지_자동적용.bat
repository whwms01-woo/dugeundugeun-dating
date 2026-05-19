@echo off
chcp 65001 > nul
title 💖 AI 소개팅 연애 시뮬레이터 원클릭 자동화 마법사 💖

echo ========================================================
echo   [AI Love Counselor] 원클릭 이미지 적용 및 실서버 배포 마법사
echo ========================================================
echo.

set "SOURCE_DIR=C:\Users\itdm_\.gemini\antigravity\brain\1a394e99-ec6b-4841-825b-c0fd36f54b77"
set "TARGET_DIR=%~dp0assets"

echo [Step 1] 고화질 AI 캐릭터 이미지를 assets 폴더로 복사 및 적용 중...
echo.

:: 1. partner_female_1 복사
for %%F in ("%SOURCE_DIR%\partner_female_1_*.png") do (
    echo [여성 1번] 발견: %%~nxF -^> partner_female_1.png 적용 완료
    copy /y "%%F" "%TARGET_DIR%\partner_female_1.png" > nul
)

:: 2. partner_female_2 복사
for %%F in ("%SOURCE_DIR%\partner_female_2_*.png") do (
    echo [여성 2번] 발견: %%~nxF -^> partner_female_2.png 적용 완료
    copy /y "%%F" "%TARGET_DIR%\partner_female_2.png" > nul
)

:: 3. partner_male_1 복사
for %%F in ("%SOURCE_DIR%\partner_male_1_*.png") do (
    echo [남성 1번] 발견: %%~nxF -^> partner_male_1.png 적용 완료
    copy /y "%%F" "%TARGET_DIR%\partner_male_1.png" > nul
)

:: 4. partner_male_2 복사
for %%F in ("%SOURCE_DIR%\partner_male_2_*.png") do (
    echo [남성 2번] 발견: %%~nxF -^> partner_male_2.png 적용 완료
    copy /y "%%F" "%TARGET_DIR%\partner_male_2.png" > nul
)

echo.
echo ========================================================
echo   캐릭터 이미지 적용 완료! 이제 실서버 live 배포를 시작합니다.
echo ========================================================
echo.

:: Git 배포 처리
echo [Step 2] 깃허브 변경사항 패키징 중 (git add .)...
git add .

echo.
echo [Step 3] 로컬 배포 커밋 생성 중 (git commit)...
git commit -m "fix: optimize mobile UI header and implement interactive inner-mind overlay modal"

echo.
echo [Step 4] 실서버 라이브 전송 중 (git push origin main)...
git push origin main

echo.
echo ========================================================
echo 🎉 훌륭합니다! 캐릭터 이미지 교체 및 서버 자동 배포가 완료되었습니다.
echo ⏳ Render 실서버에 반영되기까지 약 1~2분 정도 걸립니다.
echo.
echo 아무 키나 누르시면 이 창이 닫힙니다.
echo ========================================================
pause > nul
