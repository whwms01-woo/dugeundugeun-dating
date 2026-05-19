import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';

// 환경 변수 로드
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static('./'));

// 서버 구동 시 로컬 에셋(assets) 폴더 자동 생성 및 이미지 파일 복사 튜닝
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

const sourceImages = {
    'dating_main.png': 'C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\d0ab74b5-2eb5-4423-8b52-606fa7665ced\\dating_refined_cover_1779169341966.png',
    'partner_female_nf.png': 'C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\d0ab74b5-2eb5-4423-8b52-606fa7665ced\\partner_female_nf_1779170424885.png',
    'partner_male_nf.png': 'C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\d0ab74b5-2eb5-4423-8b52-606fa7665ced\\partner_male_nf_1779170443939.png',
    'partner_female_nt.png': 'C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\d0ab74b5-2eb5-4423-8b52-606fa7665ced\\partner_female_nt_1779170462994.png',
    'partner_male_nt.png': 'C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\d0ab74b5-2eb5-4423-8b52-606fa7665ced\\partner_male_nt_1779170484783.png',
    'partner_female_sp.png': 'C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\d0ab74b5-2eb5-4423-8b52-606fa7665ced\\partner_female_sp_1779174665769.png',
    'partner_male_sp.png': 'C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\d0ab74b5-2eb5-4423-8b52-606fa7665ced\\partner_male_sp_1779174713138.png',
    'partner_female_sj.png': 'C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\d0ab74b5-2eb5-4423-8b52-606fa7665ced\\partner_female_sj_1779174692215.png',
    'partner_male_sj.png': 'C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\d0ab74b5-2eb5-4423-8b52-606fa7665ced\\partner_male_sj_1779174733393.png',
    'partner_female_nf_e.png': 'C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\5842f668-c723-4a09-b615-d1b27c9fce7c\\partner_female_nf_e_1779179088405.png',
    'partner_male_nf_e.png': 'C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\5842f668-c723-4a09-b615-d1b27c9fce7c\\partner_male_nf_e_1779179114366.png',
    'partner_female_nt_e.png': 'C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\5842f668-c723-4a09-b615-d1b27c9fce7c\\partner_female_nt_e_1779179136170.png',
    'partner_male_nt_e.png': 'C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\5842f668-c723-4a09-b615-d1b27c9fce7c\\partner_male_nt_e_1779179158064.png',
    'partner_male_kodari.png': 'C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\31760e34-a570-469c-9e8d-02e9dd2f5a0b\\partner_male_kodari_1779182536564.png'
};

for (const [destName, srcPath] of Object.entries(sourceImages)) {
    const destPath = path.join(assetsDir, destName);
    if (!fs.existsSync(destPath) && fs.existsSync(srcPath)) {
        try {
            fs.copyFileSync(srcPath, destPath);
            console.log(`[Asset Setup] Successfully copied ${destName} locally!`);
        } catch (e) {
            console.error(`[Asset Setup] Failed to copy ${destName}:`, e);
        }
    }
}

// Dynamic 10 Male & 10 Female Illustration setup
const femaleTemplates = [
    'partner_female_nf.png',
    'partner_female_nt.png',
    'partner_female_sp.png',
    'partner_female_sj.png',
    'partner_female_nf_e.png',
    'partner_female_nt_e.png'
];

const maleTemplates = [
    'partner_male_nf.png',
    'partner_male_nt.png',
    'partner_male_sp.png',
    'partner_male_sj.png',
    'partner_male_nf_e.png',
    'partner_male_nt_e.png',
    'partner_male_kodari.png'
];

for (let i = 1; i <= 10; i++) {
    const fDest = path.join(assetsDir, `partner_female_${i}.png`);
    if (!fs.existsSync(fDest)) {
        const template = femaleTemplates[(i - 1) % femaleTemplates.length];
        const src = path.join(assetsDir, template);
        if (fs.existsSync(src)) {
            try {
                fs.copyFileSync(src, fDest);
                console.log(`[Asset Setup] Successfully created female character ${i} locally!`);
            } catch (e) {
                console.error(`[Asset Setup] Failed to create female character ${i}:`, e);
            }
        }
    }
    
    const mDest = path.join(assetsDir, `partner_male_${i}.png`);
    if (!fs.existsSync(mDest)) {
        const template = maleTemplates[(i - 1) % maleTemplates.length];
        const src = path.join(assetsDir, template);
        if (fs.existsSync(src)) {
            try {
                fs.copyFileSync(src, mDest);
                console.log(`[Asset Setup] Successfully created male character ${i} locally!`);
            } catch (e) {
                console.error(`[Asset Setup] Failed to create male character ${i}:`, e);
            }
        }
    }
}

// 에셋 통합 서빙 라우트 (클라우드/로컬 가변 호환 하이브리드 서빙)
app.get('/assets/:filename', (req, res) => {
    const filename = req.params.filename;
    const localAssetPath = path.join(assetsDir, filename);
    const fallbackPath = sourceImages[filename];

    if (fs.existsSync(localAssetPath)) {
        res.sendFile(localAssetPath);
    } else if (fallbackPath && fs.existsSync(fallbackPath)) {
        res.sendFile(fallbackPath);
    } else {
        res.status(404).send('Image not found');
    }
});

// 제미나이 API 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 공통: 제미나이 API 호출 재시도 및 마크업 제거 파싱 안전 엔진 (회복력 극대화)
async function callGeminiWithRetry(model, prompt, retries = 2) {
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text().trim();
            
            // 만약 백틱 코드 블록(```json)이 포함되어 있으면 제거
            let cleaned = text;
            if (cleaned.startsWith('```')) {
                cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '');
                cleaned = cleaned.replace(/```$/, '');
            }
            
            return JSON.parse(cleaned.trim());
        } catch (err) {
            console.error(`[Gemini Attempt ${attempt}] Failed to fetch or parse response:`, err);
            if (attempt === retries + 1) {
                throw err; // 모든 재시도가 실패하면 최종 에러 던짐
            }
            // 600ms 대기 후 재시도
            await new Promise(resolve => setTimeout(resolve, 600));
        }
    }
}

// 1. 실시간 대화 및 호감도 평가 API
app.post('/api/chat', async (req, res) => {
    try {
        const { 
            userName, 
            userGender, 
            userMbti, 
            partnerMbti, 
            scenario, 
            history, 
            currentMessage, 
            currentHeartRate,
            partnerName,
            partnerAge,
            partnerJob,
            partnerHobbies
        } = req.body;

        const model = genAI.getGenerativeModel({ 
            model: "gemini-3.1-flash-lite",
            generationConfig: { responseMimeType: "application/json" }
        });

        let prompt = "";

        if (!history || history.length === 0) {
            // 첫 번째 매칭 시작 시 파트너의 오프닝 대사 요청
            prompt = `너는 소개팅 상대방인 '${partnerName}'야. 성격과 성향은 '${partnerMbti}'형 사람이야.
            
            [내 프로필 정보]
            - 내 이름: ${partnerName || '이설아'}
            - 내 나이: ${partnerAge || '26'}세
            - 내 직업: ${partnerJob || '일러스트레이터'}
            - 내 취미: ${partnerHobbies || 'LP 음반 수집'}
            - 내 성격/MBTI 성향: ${partnerMbti}
            
            [상황 정보]
            - 상대방 정보(유저): 이름 '${userName || '익명'}', 성별 '${userGender || '상관없음'}', 성격/MBTI: ${userMbti}
            - 소개팅 장소/시나리오: ${scenario}
            
            [작성 조건]
            1. 첫 만남에서 '${partnerMbti}' 성격에 100% 빙의하여 어울리는 첫인사(오프닝 대사)를 건네줘.
            2. 내 프로필(이름, 나이, 직업, 취미 등)의 설정 정보를 완벽히 인지하고 대화 속에 어울리게 녹여낼 수 있도록 해줘. 첫 대사에서 억지로 다 말할 필요는 없고, 자연스럽게 첫인사를 나눠줘.
            3. MBTI 특성을 극대화하여 표현해줘. (예: ENFP는 하이텐션과 이모지 남발, INTJ는 차분하고 예의 바르지만 다소 건조한 말투, ESTP는 직진 플러팅 등)
            4. 첫 대사인 만큼 어색하지만 어색하지 않은 척 건네는 대사로 2~3문장 이내로 작성해줘.
            5. 속마음(innerThought)은 유저 몰래 생각하는 자신의 속마음(첫인상 느낌 등)을 1문장으로 재치 있게 적어줘.
            6. 첫 만남이므로 호감도 변동량(heartRateChange)은 0으로 설정해줘.
            
            반드시 아래 JSON 형식으로만 답변해:
            {
                "reply": "첫인사 대사",
                "heartRateChange": 0,
                "innerThought": "첫인상 속마음 한 줄"
            }`;
        } else {
            // 대화 진행 중일 때 유저의 답변에 대한 반응 평가
            const formattedHistory = history.map(h => `${h.sender === 'user' ? '유저(' + userName + ')' : partnerName + '(' + partnerMbti + ')'}: ${h.text}`).join('\n');

            prompt = `너는 소개팅 상대방인 '${partnerName}'야. 성향은 '${partnerMbti}'형이야. 유저의 새로운 말에 반응하고 호감도를 채점해줘.
            
            [내 프로필 정보]
            - 내 이름: ${partnerName || '이설아'}
            - 내 나이: ${partnerAge || '26'}세
            - 내 직업: ${partnerJob || '일러스트레이터'}
            - 내 취미: ${partnerHobbies || 'LP 음반 수집'}
            - 내 성격/MBTI 성향: ${partnerMbti}
            
            [소개팅 정보]
            - 유저 정보: 이름 '${userName || '익명'}', 성별 '${userGender || '상관없음'}', 성격/MBTI: ${userMbti}
            - 소개팅 장소: ${scenario}
            - 현재 호감도(하트레이트): ${currentHeartRate}% (0~100 사이)
            
            [이전 대화 기록]
            ${formattedHistory}
            
            [유저가 방금 던진 최신 말]
            유저: "${currentMessage}"
            
            [작성 조건 - 극사실주의 연애 시뮬레이터 규칙]
            1. 유저의 최신 말에 대해 '${partnerMbti}' 성격 특성을 200% 살려서 자연스럽게 답변(reply)해줘. 2~3문장 이내로 작성해줘.
            2. [중요: 현실적인 정색과 삐짐 피드백] 유저가 선을 넘거나 무례한 말, 성의 없는 단답, 혹은 상극인 행동을 했다면 절대 억지로 착하게 받아주지 마. 
               - 현재 호감도가 40% 이하로 낮거나 이번 턴에 기분이 상했다면 현실 소개팅처럼 차갑게 정색하거나, 말을 툭 끊어버리는 단답형 쌀쌀맞은 태도, 삐진 기색을 매우 사실적으로 팍팍 티 내줘.
               - 호감도가 극도로 떨어져 10% 이하가 되면 대놓고 한숨을 쉬거나 정색하며 경고하는 어조를 보존해줘.
            3. [소개팅 앱 컨셉의 상호 관심 표출] 일방적으로 자기 자랑이나 답변만 하지 말고, 상대방(유저)에게 진짜 관심이 있는 것처럼 역으로 주도적인 질문을 던져줘. 
               - 대화 턴 중 수시로 유저에게 나이는 몇 살인지, 어떤 직업/일을 하는지, 주말엔 보통 취미가 무엇인지 역으로 따뜻하거나 호기심 섞인 질문을 건네서 대화를 생동감 있게 티키타카로 이끌어줘.
            4. 유저가 방금 한 말을 분석해 기분과 케미에 따른 호감도 변동량(heartRateChange)을 -18에서 +18 사이의 정수로 정해줘. 
               - 유저가 성의가 없거나, 배려가 없거나, 부담스러운 멘트나 개그를 했다면 사정없이 깎아버려 (-6 ~ -18).
               - 반대로 MBTI 궁합에 어울리는 센스나 설레는 맞춤 드립을 쳤다면 시원하게 올려줘 (+6 ~ +18).
            5. 속마음(innerThought)은 겉으로 말하지 못하는 나의 100% 솔직한 진짜 내면 심리 상태(유저의 센스 평가, 기분 상태 등)를 1문장으로 재치 있게 적어줘.
            
            반드시 아래 JSON 형식으로만 답변해:
            {
                "reply": "파트너의 답변 대사",
                "heartRateChange": 호감도변동량(정수),
                "innerThought": "파트너의 진짜 속마음 한 줄"
            }`;
        }

        const chatResponse = await callGeminiWithRetry(model, prompt);
        res.json(chatResponse);
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: error.message || "대화 생성 중 오류가 발생했습니다." });
    }
});

// 2. 최종 소개팅 성적표 및 피드백 생성 API
app.post('/api/result', async (req, res) => {
    try {
        const { userName, userMbti, partnerMbti, scenario, history, finalHeartRate, isEarly } = req.body;

        const model = genAI.getGenerativeModel({ 
            model: "gemini-3.1-flash-lite",
            generationConfig: { responseMimeType: "application/json" }
        });

        const formattedHistory = history.map(h => `${h.sender === 'user' ? '유저' : partnerMbti + ' 파트너'}: ${h.text}`).join('\n');

        const prompt = `너는 대한민국 최고의 소개팅 연애 상담 전문가이자 뼈 때리는 연애 도사야.
        유저와 파트너가 나눈 소개팅 대화 내역과 최종 호감도를 분석하여 성적표(리포트 카드)를 작성해줘.
        
        [소개팅 요약 정보]
        - 유저 이름: ${userName || '익명'} (MBTI: ${userMbti})
        - 상대방 MBTI: ${partnerMbti}
        - 데이트 장소: ${scenario}
        - 최종 호감도 점수: ${finalHeartRate}%
        - 조기 종료 여부: ${isEarly ? '예 (중간 정산 - 대화 도중 유저가 먼저 데이트를 중단함)' : '아니오 (풀코스 데이트 완료)'}
        
        [전체 대화 내역 (총 ${history.length}줄)]
        ${formattedHistory}
        
        [작성 조건]
        1. 소개팅 성공 여부(status)는 최종 호감도(${finalHeartRate}%)를 기준으로 정해줘:
           - 80% 이상: "Green Light! 연인 발전 각 🟢" (커플 성공, 달달함 초과)
           - 40% 이상 80% 미만: "Soso... 친한 친구 각 🟡" (애매함, 친구 이상 연인 미만)
           - 40% 미만: "Red Light! 주선자 멱살 각 🔴" (폭망, 파토, 카톡 차단 각)
           * 만약 조기 종료(isEarly가 참)라면, status 문구에 "중간 정산 ⚠️" 머리글을 붙이고 상황(도망침, 런, 썸 중단 등)을 위트있게 풍자해줘. (예: "중간 정산 ⚠️ 야근 핑계 대고 도망 각 🏃‍♂️")
        2. 다음 세 가지 세부 역량 점수(0~100 정수)를 유저의 대화 방식과 드립 센스를 바탕으로 평가해줘:
           - 대화 센스(scoreSense): 상대방의 말에 호응하고 재치 있게 받아친 정도.
           - 설렘 지수(scoreFlutter): 상대방의 마음을 심쿵하게 만든 멘트의 퀄리티.
           - 답답 고구마 지수(scoreFrustration): 엉뚱한 소리를 하거나 눈치 없는 멘트로 꽁기하게 만든 답답함의 수준.
        3. 피드백 총평(summary)은 팩폭 스타일과 연애 조언을 섞어서 3~4문장으로 재미있게 분석해줘. 특히 조기 종료(isEarly가 참)라면 "왜 데이트를 중간에 멈췄을지"에 대해 (눈치 없이 헛소리해서 상대가 표정관리가 안 돼서 튀었거나, 혹은 너무 설레서 심장이 폭발하기 전에 런했다는 등) 기상천외한 추리를 섞어 재미있게 팩트 폭행해줘.
        4. 미래 예측(futurePrediction)은 "두 사람이 10년 뒤에 무엇을 하고 있을지"에 대해 매우 기발하고 코믹하게 한 줄로 예측해줘.
        
        반드시 아래 JSON 형식으로만 답변해:
        {
            "status": "성공 상태 문구",
            "scoreSense": 대화센스점수(정수),
            "scoreFlutter": 설렘지수점수(정수),
            "scoreFrustration": 고구마지수점수(정수),
            "summary": "총평 분석 및 피드백 내용",
            "futurePrediction": "10년 뒤 미래 모습 한 줄 예측"
        }`;

        const resultResponse = await callGeminiWithRetry(model, prompt);
        res.json(resultResponse);
    } catch (error) {
        console.error('Result API Error:', error);
        res.status(500).json({ error: error.message || "성적표 생성 중 오류가 발생했습니다." });
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`Dating Simulator Server is running at http://localhost:${port}`);
});
