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

// Robust Gemini Helper with Model Fallbacks and Safe JSON Extraction (회복력 극대화)
// 🚀 무료티어 최적화: RPM 폭탄 방지 - 재시도 딜레이 대폭 증가, 모델별 1회 시도
async function generateGeminiContentWithRetry(prompt, retries = 1) {
    // 모델 설정: 이 API 키에서 실제 사용 가능한 모델만 사용
    // gemini-2.0-flash-lite: 무료 RPD 1500회, RPM 30 → 가장 넉넉함 ✅
    // gemini-2.0-flash: 무료 RPD 200회, RPM 15
    // gemini-2.5-flash: 무료 RPD 25회 → 최후 수단
    const modelConfigs = [
        { 
            name: "gemini-2.0-flash-lite", 
            config: { responseMimeType: "application/json" }
        },
        { 
            name: "gemini-2.0-flash", 
            config: { responseMimeType: "application/json" }
        },
        { 
            name: "gemini-2.5-flash", 
            config: { responseMimeType: "application/json" },
            thinkingConfig: { thinkingBudget: 0 }
        }
    ];
    const errors = [];

    for (const modelCfg of modelConfigs) {
        for (let attempt = 1; attempt <= retries + 1; attempt++) {
            try {
                console.log(`[Gemini] Attempting generation with model: ${modelCfg.name} (Attempt ${attempt})...`);
                const modelOptions = { 
                    model: modelCfg.name,
                    generationConfig: modelCfg.config
                };
                if (modelCfg.thinkingConfig) {
                    modelOptions.generationConfig = {
                        ...modelCfg.config,
                        ...modelCfg.thinkingConfig
                    };
                }
                const model = genAI.getGenerativeModel(modelOptions);
                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text().trim();
                
                text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
                
                const startIndex = text.indexOf('{');
                const endIndex = text.lastIndexOf('}');
                if (startIndex !== -1 && endIndex !== -1) {
                    text = text.substring(startIndex, endIndex + 1);
                }
                
                const jsonResult = JSON.parse(text);
                console.log(`[Gemini] Successfully generated and parsed content using model: ${modelCfg.name}!`);
                return jsonResult;
            } catch (err) {
                let cleanErrorMessage = err.message;
                const isRateLimit = cleanErrorMessage.includes('429') || cleanErrorMessage.toLowerCase().includes('quota') || cleanErrorMessage.toLowerCase().includes('limit') || cleanErrorMessage.toLowerCase().includes('exhausted');
                
                if (isRateLimit) {
                    cleanErrorMessage = '429 Too Many Requests (RPM Limit Exceeded)';
                } else if (cleanErrorMessage.length > 150) {
                    cleanErrorMessage = cleanErrorMessage.substring(0, 150) + '...';
                }
                
                console.error(`[Gemini] Model ${modelCfg.name} (Attempt ${attempt}) failed:`, cleanErrorMessage);
                errors.push(`${modelCfg.name} (Attempt ${attempt}): ${cleanErrorMessage}`);
                
                if (attempt <= retries) {
                    // 429 발생 시 20초 대기 - RPM 폭탄 방지 핵심
                    const delay = isRateLimit ? (20000 * attempt) : 1000;
                    console.log(`[Gemini] Waiting ${delay}ms before next retry attempt...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else if (isRateLimit) {
                    console.log(`[Gemini] Rate limit on ${modelCfg.name}, switching to next model...`);
                }
            }
        }
    }
    
    throw new Error(`모든 AI 모델 호출 실패:\n- ${errors.join('\n- ')}`);
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

        // Model initialization is now handled dynamically in generateGeminiContentWithRetry

        let prompt = "";

        // MBTI별 소개팅 질문 스타일 정의 (자연스러운 정보 탐색 패턴)
        const mbtiQuestionStyle = {
            'ENFP': '밝고 신나는 톤으로 "어머 저도 궁금한데요!" 스타일로 연속 질문 폭격',
            'ENTP': '지적 호기심 가득한 "오, 그럼 혹시~?" 스타일의 꼬리 물기 질문',
            'ENFJ': '따뜻하고 배려 깊게 "요즘 어떻게 지내세요?" 스타일로 일상 깊이 파고들기',
            'ENTJ': '직접적으로 "그래서 직업은요? 꿈은요?" 효율적 정보 수집 스타일',
            'INFP': '조심스럽고 감성적으로 "...혹시 여쭤봐도 될까요?" 스타일의 수줍은 질문',
            'INTP': '분석적으로 "흥미롭네요. 그럼 보통 주말엔 뭐 하세요?" 관찰자 스타일',
            'INFJ': '깊이 있게 "그 일 하면서 어떤 게 가장 보람차세요?" 본질 탐구 스타일',
            'INTJ': '효율적이고 차분하게 "직업이나 관심사는 어떻게 되시나요?" 단도직입형',
            'ESFP': '신나고 활발하게 "어머 진짜요?! 어디서요?! 저도!" 공감 폭발 스타일',
            'ESTP': '직진으로 "몇 살이에요? 뭐 해요?" 쿨하고 직접적인 스타일',
            'ESFJ': '다정하게 "가족은 어떻게 되세요? 사는 동네는요?" 생활밀착형 질문',
            'ESTJ': '체계적으로 "직업, 사는 곳, 취미 순서로 알고 싶어요" 정리형',
            'ISFP': '조용히 "...취미가 뭐예요? 저도 좀 알고 싶어서요" 소근소근 스타일',
            'ISTP': '무뚝뚝하지만 진심으로 "뭐 좋아해요?" 쿨한 직구형',
            'ISFJ': '배려 깊게 "불편한 건 없으세요? 어디서 오셨어요?" 섬세한 관심형',
            'ISTJ': '신중하게 "실례가 안 된다면 직업이 어떻게 되세요?" 예의 바른 정보형'
        };
        const questionStyle = mbtiQuestionStyle[partnerMbti] || '자연스럽고 친근하게';

        // 아직 물어보지 않은 정보 추적 (최근 5턴 기록만 사용)
        const recentHistory = history ? history.slice(-5) : [];
        const historyText = recentHistory.map(h => `${h.sender === 'user' ? '유저(' + userName + ')' : partnerName}: ${h.text}`).join('\n');
        const alreadyAsked = historyText.toLowerCase();
        const needToAsk = [];
        if (!alreadyAsked.includes('직업') && !alreadyAsked.includes('일 하')) needToAsk.push('직업/하는 일');
        if (!alreadyAsked.includes('취미') && !alreadyAsked.includes('주말')) needToAsk.push('취미/주말 생활');
        if (!alreadyAsked.includes('사는') && !alreadyAsked.includes('동네') && !alreadyAsked.includes('어디')) needToAsk.push('사는 곳/동네');
        if (!alreadyAsked.includes('나이') && !alreadyAsked.includes('살')) needToAsk.push('나이');

        if (!history || history.length === 0) {
            // 첫 번째 매칭 시작 시 파트너의 오프닝 대사 요청
            prompt = `너는 소개팅 상대방 '${partnerName}'(${partnerMbti})야.
            내 정보: 이름 ${partnerName}, ${partnerAge}세, 직업 ${partnerJob || '일러스트레이터'}, 취미 ${partnerHobbies || 'LP 음반 수집'}.
            상대(유저): 이름 ${userName || '익명'}, 성별 ${userGender || '미상'}, MBTI ${userMbti}.
            장소: ${scenario}.
            
            [첫인사 조건]
            - ${partnerMbti} 성격 100% 살린 2~3문장의 자연스러운 첫인사.
            - 억지스럽지 않게 상대에게 이름이나 한 가지만 살짝 물어봐도 좋아.
            - MBTI별 말투 극대화 (ENFP=하이텐션이모지, INTJ=차분건조, ESTP=직진플러팅 등).
            - heartRateChange는 반드시 0.
            - innerThought: 첫인상 속마음 1문장.
            
            JSON만 반환:
            {"reply": "첫인사", "heartRateChange": 0, "innerThought": "속마음"}`;
        } else {
            // 대화 진행 중
            const formattedHistory = history.slice(-6).map(h => `${h.sender === 'user' ? '유저' : partnerName}: ${h.text}`).join('\n');
            const askHint = needToAsk.length > 0 ? `\n- 자연스럽게 상대의 [${needToAsk[0]}]을(를) ${questionStyle} 방식으로 물어봐.` : '\n- 대화 흐름에 맞게 더 깊은 이야기를 나눠.';

            prompt = `너는 소개팅 상대방 '${partnerName}'(${partnerMbti})야. 유저 말에 반응하고 호감도를 채점해.
            내 정보: ${partnerName}, ${partnerAge}세, ${partnerJob || '일러스트레이터'}, 취미 ${partnerHobbies || 'LP 음반 수집'}.
            유저: ${userName || '익명'} (${userMbti}), 현재 호감도 ${currentHeartRate}%.
            장소: ${scenario}.
            
            [최근 대화 (최근 6턴)]
            ${formattedHistory}
            
            [유저 최신 말]
            유저: "${currentMessage}"
            
            [답변 조건]
            1. ${partnerMbti} 성격 200% 살린 2~3문장 답변.${askHint}
            2. 호감도 40% 이하이거나 무례/성의없는 답변이면 현실처럼 쌀쌀맞게 정색. 10% 이하면 한숨+경고.
            3. 티키타카: 내 얘기만 하지 말고 유저에게 진짜 관심 표현.
            4. heartRateChange: -18~+18 정수 (성의없음/무례=-6~-18, MBTI궁합맞는센스=+6~+18).
               - [궁극기: 선물 전달] 만약 유저 최신 말에 "[🎁 선물 전달: ...]"이 포함되어 있다면, 선물의 종류와 함께 건넨 멘트의 진정성, 내 성향과의 궁합을 깐깐하게 평가해! 취향을 제대로 저격했다면 +25~+40점의 폭발적 심쿵 보너스를 주고 감동한 반응을 보여. 취향에 안 맞거나 멘트가 별로면 "이런 걸로 때우려고요?"라며 -15~-25점 페널티와 정색을 줘.
            5. innerThought: 솔직한 속마음 1문장.
            
            JSON만 반환:
            {"reply": "답변", "heartRateChange": 변동량, "innerThought": "속마음"}`;
        }

        const chatResponse = await generateGeminiContentWithRetry(prompt);
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

        // Model initialization is now handled dynamically in generateGeminiContentWithRetry

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
        5. 비밀 일기장(secretDiary)은 상대방 파트너의 1인칭 시점으로 오늘 유저와 나눴던 대화와 최종 감정에 대한 솔직한 심경을 적어두는 다이어리 형식(3~4문장)으로 작성해줘. 호감도가 높으면 달달하게 설레어하고, 낮으면 쌀쌀맞거나 어이없어하는 심리를 극사실적으로 살려야 해.
        6. 카톡 애프터 메시(afterMessage)는 오늘 밤 파트너가 유저에게 보낼 리얼한 카카오톡 애프터 메시지 형식으로 작성해줘. (호감도가 높으면 긴장감과 하트 섞인 애프터 제안, 낮으면 정중하지만 선 긋는 거절, 아주 낮으면 읽씹을 대체하여 주선자나 친구에게 단톡방에서 늘어놓는 분노의 하소연 멘트)
        
        반드시 아래 JSON 형식으로만 답변해:
        {
            "status": "성공 상태 문구",
            "scoreSense": 대화센스점수(정수),
            "scoreFlutter": 설렘지수점수(정수),
            "scoreFrustration": 고구마지수점수(정수),
            "summary": "총평 분석 및 피드백 내용",
            "futurePrediction": "10년 뒤 미래 모습 한 줄 예측",
            "secretDiary": "상대방의 비밀 속마음 일기 내용",
            "afterMessage": "오늘 밤 상대방이 유저에게 보낼 리얼 카카오톡 메시지"
        }`;

        const resultResponse = await generateGeminiContentWithRetry(prompt);
        res.json(resultResponse);
    } catch (error) {
        console.error('Result API Error:', error);
        res.status(500).json({ error: error.message || "성적표 생성 중 오류가 발생했습니다." });
    }
});

// Diagnosis endpoint accessible via browser
app.get('/api/diag', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const diag = {
        apiKeyStatus: apiKey ? `LOADED (Length: ${apiKey.length})` : "NOT LOADED",
        apiKeyPreview: apiKey ? `${apiKey.substring(0, 5)}...${apiKey.slice(-5)}` : "NONE",
        models: [],
        error: null
    };
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        if (data.models) {
            diag.models = data.models.map(m => m.name);
        } else if (data.error) {
            diag.error = data.error.message;
        } else {
            diag.error = JSON.stringify(data);
        }
    } catch (err) {
        diag.error = err.message;
    }
    res.json(diag);
});

// 서버 실행
app.listen(port, () => {
    console.log(`Dating Simulator Server is running at http://localhost:${port}`);
});

// Startup Diagnostic Logs to debug API key and model availability
(async () => {
    console.log("=== STARTUP DIAGNOSTICS ===");
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("GEMINI_API_KEY status:", apiKey ? `LOADED (Length: ${apiKey.length})` : "NOT LOADED");
    if (apiKey) {
        console.log("GEMINI_API_KEY preview:", `${apiKey.substring(0, 5)}...${apiKey.slice(-5)}`);
        try {
            console.log("[Diagnostic] Fetching available models from Google API...");
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            const data = await response.json();
            if (data.models) {
                console.log("[Diagnostic] Successfully fetched models! Available models:");
                data.models.forEach(m => console.log(`  - ${m.name}`));
            } else if (data.error) {
                console.log("[Diagnostic] Google API returned an error:", data.error.message);
            } else {
                console.log("[Diagnostic] Unknown response structure:", data);
            }
        } catch (err) {
            console.error("[Diagnostic] Failed to fetch models:", err.message);
        }
    }
    console.log("===========================");
})();
