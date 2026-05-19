import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

// 환경 변수 로드
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static('./'));

// 메인 일러스트 이미지 서빙 라우트
app.get('/assets/dating_main.png', (req, res) => {
    const imgPath = 'C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\d0ab74b5-2eb5-4423-8b52-606fa7665ced\\dating_refined_cover_1779169341966.png';
    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath);
    } else {
        res.status(404).send('Image not found');
    }
});

// 캐릭터 일러스트 이미지 서빙 라우트들
app.get('/assets/partner_female_nf.png', (req, res) => {
    res.sendFile('C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\d0ab74b5-2eb5-4423-8b52-606fa7665ced\\partner_female_nf_1779170424885.png');
});
app.get('/assets/partner_male_nf.png', (req, res) => {
    res.sendFile('C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\d0ab74b5-2eb5-4423-8b52-606fa7665ced\\partner_male_nf_1779170443939.png');
});
app.get('/assets/partner_female_nt.png', (req, res) => {
    res.sendFile('C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\d0ab74b5-2eb5-4423-8b52-606fa7665ced\\partner_female_nt_1779170462994.png');
});
app.get('/assets/partner_male_nt.png', (req, res) => {
    res.sendFile('C:\\Users\\itdm_\\.gemini\\antigravity\\brain\\d0ab74b5-2eb5-4423-8b52-606fa7665ced\\partner_male_nt_1779170484783.png');
});

// 제미나이 API 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. 실시간 대화 및 호감도 평가 API
app.post('/api/chat', async (req, res) => {
    try {
        const { userName, userGender, userMbti, partnerMbti, scenario, history, currentMessage, currentHeartRate } = req.body;

        const model = genAI.getGenerativeModel({ 
            model: "gemini-3.1-flash-lite",
            generationConfig: { responseMimeType: "application/json" }
        });

        let prompt = "";

        if (!history || history.length === 0) {
            // 첫 번째 매칭 시작 시 파트너의 오프닝 대사 요청
            prompt = `너는 소개팅 상대방인 '${partnerMbti}' 성향의 사람이야.
            
            [상황 정보]
            - 내 이름(소개팅 상대방): 익명 (성격/MBTI: ${partnerMbti})
            - 상대방 정보(유저): 이름 '${userName || '익명'}', 성별 '${userGender || '상관없음'}', 성격/MBTI: ${userMbti}
            - 소개팅 장소/시나리오: ${scenario}
            
            [작성 조건]
            1. 첫 만남에서 '${partnerMbti}' 성격에 100% 빙의하여 어울리는 첫인사(오프닝 대사)를 건네줘.
            2. MBTI 특성을 극대화하여 표현해줘. (예: ENFP는 하이텐션과 이모지 남발, INTJ는 차분하고 예의 바르지만 다소 건조한 말투, ESTP는 직진 플러팅 등)
            3. 첫 대사인 만큼 어색하지만 어색하지 않은 척 건네는 대사로 2~3문장 이내로 작성해줘.
            4. 속마음(innerThought)은 유저 몰래 생각하는 자신의 속마음(첫인상 느낌 등)을 1문장으로 재치 있게 적어줘.
            5. 첫 만남이므로 호감도 변동량(heartRateChange)은 0으로 설정해줘.
            
            반드시 아래 JSON 형식으로만 답변해:
            {
                "reply": "첫인사 대사",
                "heartRateChange": 0,
                "innerThought": "첫인상 속마음 한 줄"
            }`;
        } else {
            // 대화 진행 중일 때 유저의 답변에 대한 반응 평가
            const formattedHistory = history.map(h => `${h.sender === 'user' ? '유저' : partnerMbti + ' 파트너'}: ${h.text}`).join('\n');

            prompt = `너는 소개팅 상대방인 '${partnerMbti}' 성향의 사람이야. 유저의 새로운 말에 반응하고 호감도를 채점해줘.
            
            [소개팅 정보]
            - 내 성격/MBTI: ${partnerMbti}
            - 유저 정보: 이름 '${userName || '익명'}', 성별 '${userGender || '상관없음'}', 성격/MBTI: ${userMbti}
            - 소개팅 장소: ${scenario}
            - 현재 호감도(하트레이트): ${currentHeartRate}% (0~100 사이)
            
            [이전 대화 기록]
            ${formattedHistory}
            
            [유저가 방금 던진 최신 말]
            유저: "${currentMessage}"
            
            [작성 조건]
            1. 유저의 최신 말에 대해 '${partnerMbti}' 성격 특성을 200% 살려서 자연스럽게 답변(reply)해줘. 2~3문장 이내로 톡 쏘거나, 수줍어하거나, 티키타카가 되게 작성해줘.
            2. 유저가 방금 한 말이 내 성격('${partnerMbti}') 입장에서 마음에 드는지 판단하여 호감도 변동량(heartRateChange)을 -15에서 +15 사이의 정수로 정해줘. 
               - 내 MBTI 특징과 매칭이 잘 되거나 센스 있게 설레는 멘트를 던졌으면 양수(+5 ~ +15)
               - 너무 지루하거나, 무례하거나, 내 성격 특징과 상극인 멘트(예: 계획적인 INTJ에게 무계획적인 소리 늘어놓기 등)를 했다면 음수(-5 ~ -15)
               - 평범하거나 무난하면 0에 가깝게 설정.
            3. 속마음(innerThought)은 유저가 방금 한 말에 대한 파트너의 유쾌하고 솔직한 진짜 생각/평가를 1문장으로 나타내줘.
            
            반드시 아래 JSON 형식으로만 답변해:
            {
                "reply": "파트너의 답변 대사",
                "heartRateChange": 호감도변동량(정수),
                "innerThought": "파트너의 진짜 속마음 한 줄"
            }`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        res.json(JSON.parse(text));
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: error.message || "대화 생성 중 오류가 발생했습니다." });
    }
});

// 2. 최종 소개팅 성적표 및 피드백 생성 API
app.post('/api/result', async (req, res) => {
    try {
        const { userName, userMbti, partnerMbti, scenario, history, finalHeartRate } = req.body;

        const model = genAI.getGenerativeModel({ 
            model: "gemini-3.1-flash-lite",
            generationConfig: { responseMimeType: "application/json" }
        });

        const formattedHistory = history.map(h => `${h.sender === 'user' ? '유저' : partnerMbti + ' 파트너'}: ${h.text}`).join('\n');

        const prompt = `너는 대한민국 최고의 소개팅 연애 상담 전문가이자 뼈 때리는 연애 도사야.
        유저와 파트너가 나눈 5턴의 소개팅 대화 내역과 최종 호감도를 분석하여 성적표(리포트 카드)를 작성해줘.
        
        [소개팅 요약 정보]
        - 유저 이름: ${userName || '익명'} (MBTI: ${userMbti})
        - 상대방 MBTI: ${partnerMbti}
        - 데이트 장소: ${scenario}
        - 최종 호감도 점수: ${finalHeartRate}%
        
        [전체 대화 내역]
        ${formattedHistory}
        
        [작성 조건]
        1. 소개팅 성공 여부(status)는 최종 호감도(${finalHeartRate}%)를 기준으로 정해줘:
           - 80% 이상: "Green Light! 연인 발전 각 🟢" (커플 성공, 달달함 초과)
           - 40% 이상 80% 미만: "Soso... 친한 친구 각 🟡" (애매함, 친구 이상 연인 미만)
           - 40% 미만: "Red Light! 주선자 멱살 각 🔴" (폭망, 파토, 카톡 차단 각)
        2. 다음 세 가지 세부 역량 점수(0~100 정수)를 유저의 대화 방식과 드립 센스를 바탕으로 평가해줘:
           - 대화 센스(scoreSense): 상대방의 말에 호응하고 재치 있게 받아친 정도.
           - 설렘 지수(scoreFlutter): 상대방의 마음을 심쿵하게 만든 멘트의 퀄리티.
           - 답답 고구마 지수(scoreFrustration): 엉뚱한 소리를 하거나 눈치 없는 멘트로 꽁기하게 만든 답답함의 수준.
        3. 피드백 총평(summary)은 팩폭 스타일과 연애 조언을 섞어서 3~4문장으로 재미있게 분석해줘.
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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        res.json(JSON.parse(text));
    } catch (error) {
        console.error('Result API Error:', error);
        res.status(500).json({ error: error.message || "성적표 생성 중 오류가 발생했습니다." });
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`Dating Simulator Server is running at http://localhost:${port}`);
});
