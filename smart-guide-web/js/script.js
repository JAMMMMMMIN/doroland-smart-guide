/*
  ============================================================================================================
  [ Credits & License ]
  
  - Project:   도로랜드 스마트 안내 시스템 (Doroland Smart Guide)
  - Creator:   XYLO (@xylito) & DORO Inc. & You
  - Version:   1.1.0 (2026.04.28.)
  - Source:    https://github.com/xylito/doroland-smart-guide
  - License:   CC BY-SA 4.0 (상업적 이용 가능 / 동일 조건 변경 허락 / 저작자 표시)
  
  이 저작물은 공공데이터를 활용한 웹 개발 교육용 실습 자료로 제작되었습니다.
  미래의 훌륭한 웹 마스터가 될 여러분을 응원합니다!
  ============================================================================================================
*/
// 🌟 도로랜드 스마트 안내 시스템 자바스크립트 코드 🌟
// 교육 과정: 3~4주차 자바스크립트 역할 및 연동 실습

// [3주차 실습] 1. 샘플 데이터(JSON) 준비하기 (실제 API 연결 전 안전하게 테스트하는 단계)
const sampleData = {
    weather: {
        temp: "24",
        condition: "맑음",
        rainProb: "10%"
    },
    dust: {
        value: 45,
        status: "보통"
    },
    forecast: [
        { time: "12:00", temp: "25℃", rainProb: "0%", status: "맑음 ☀️" },
        { time: "15:00", temp: "27℃", rainProb: "10%", status: "구름조금 🌥️" },
        { time: "18:00", temp: "23℃", rainProb: "40%", status: "흐림 ☁️" }
    ]
};

// [3~4주차 실습] 2. 화면(HTML)에 데이터 넣는 함수 만들기
function renderData(data) {
    // ----------------------------------------------------
    // ▶ 날씨 데이터 넣기
    // ----------------------------------------------------
    const weatherInfo = document.getElementById("weather-info");
    weatherInfo.innerHTML = `
        <div class="data-value">${data.weather.temp}℃</div>
        <p style="text-align:center; font-size:1.2rem;">
            하늘 상태: <strong>${data.weather.condition}</strong><br>
            (강수확률: ${data.weather.rainProb})
        </p>
    `;

    // ----------------------------------------------------
    // ▶ 미세먼지 측정 데이터 넣기 및 뱃지 색상 조건달기
    // ----------------------------------------------------
    const airInfo = document.getElementById("air-info");
    
    // 미세먼지 수치에 따라 뱃지 디자인 클래스 결정! (조건문 활용)
    let badgeClass = "good";
    if (data.dust.value > 80) {
        badgeClass = "bad";    // 80 초과면 나쁨(빨강)
    } else if (data.dust.value > 30) {
        badgeClass = "normal"; // 30 초과면 보통(노랑)
    }

    airInfo.innerHTML = `
        <div class="data-value">${data.dust.value} <span style="font-size:1rem; color:#888;">㎍/㎥</span></div>
        <p style="text-align:center; font-size:1.2rem;">
            현재 농도 등급: <span class="badge ${badgeClass}">${data.dust.status}</span>
        </p>
    `;

    // ----------------------------------------------------
    // [4주차 핵심] ▶ 데이터 해석 & 자동 안내 문구 만들기
    // ----------------------------------------------------
    const guideMsg = document.getElementById("recommendation-msg");
    let recommendation = "";

    // 단순 수치 출력이 아니라, "그래서 오늘 뭘 타면 좋을까?"를 판단해줍니다.
    if (data.dust.status === "나쁨" || badgeClass === "bad") {
        // 미세먼지가 나쁠 때
        recommendation = "🚨 <strong>미세먼지가 조금 답답한 날이에요.</strong><br>야외 롤러코스터보다는 실내 시설인 <strong>로봇 어드벤처</strong> 관람을 추천해요! 마스크를 꼭 착용해주세요.";
        
    } else if (data.weather.condition.includes("비") || parseInt(data.weather.rainProb) > 50) {
        // 비가 오거나 올 확률이 높을 때
        recommendation = "☔ <strong>비가 올 확률이 높습니다.</strong><br>우산을 준비하고, 빙글빙글 실내 <strong>컵라이더</strong>를 즐겨보는 건 어떨까요?";
        
    } else {
        // 날씨 좋고 미세먼지도 괜찮을 때
        recommendation = "✨ <strong>야외 활동하기 참 좋은 시원한 날씨예요!</strong><br>야외 광장에서 열리는 중앙 퍼레이드와 관람차를 마음껏 즐겨보세요! 🎈";
    }
    
    // HTML에 문구 삽입
    guideMsg.innerHTML = recommendation;

    // ----------------------------------------------------
    // ▶ 시간별 상세 예보 표 만들기 (반복문 사용하기)
    // ----------------------------------------------------
    const tableBody = document.getElementById("forecast-table-body");
    tableBody.innerHTML = ""; // 기존 글자(로딩중...) 지우기

    // forecast 배열 안의 데이터를 하나씩 꺼내서 표의 한 줄(tr)로 만듭니다.
    for (let i = 0; i < data.forecast.length; i++) {
        let item = data.forecast[i];
        
        let row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${item.time}</strong></td>
            <td>${item.temp}</td>
            <td>${item.rainProb}</td>
            <td>${item.status}</td>
        `;
        tableBody.appendChild(row); // 표 안에 한 줄 추가!
    }
}

// [3주차 실습] 3. 데이터 가져오기 버튼 클릭 이벤트 연결
// 실제 API(기상청 공공데이터, 에어코리아 API)에 연결하기 전에는 시뮬레이션을 합니다.
document.getElementById("fetch-data-btn").addEventListener("click", () => {
    
    const btn = document.getElementById("fetch-data-btn");
    btn.innerText = "데이터 통신 중... 📡";
    btn.style.opacity = 0.7;

    // [과제 안내]
    // GPT를 활용해서 아래 부분을 실제 공공데이터 fetch 코드로 바꿔보세요!
    // (폴더 내의 swagger-kma-weather.html와 swagger-airkorea-pollution.html 문서를 참고하면 어떤 api가 있는지 확인할 수 있습니다.)
    
    // 임시 시뮬레이션 (1초 후 데이터 완성된 척 하기)
    setTimeout(() => {
        // 샘플 데이터를 넘겨서 화면 그리기
        renderData(sampleData);
        
        // 버튼 원래대로
        btn.innerText = "새로고침 (최신 데이터 가져오기)";
        btn.style.opacity = 1;

    }, 1000); 
});

// 처음에 홈페이지 열리면 바로 샘플데이터로 화면을 보여줍니다.
renderData(sampleData);
