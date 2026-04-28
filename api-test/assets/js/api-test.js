/*
  ============================================================================================================
  [ Credits & License ]
  
  - Project:   도로랜드 스마트 안내 시스템 (Doroland Smart Guide)
  - Creator:   XYLO (@xylito) & DORO Inc.
  - Version:   1.1.1 (2026.04.28.)
  - Source:    https://github.com/xylito/doroland-smart-guide
  - License:   CC BY-SA 4.0 (상업적 이용 가능 / 동일 조건 변경 허락 / 저작자 표시)
  
  이 저작물은 공공데이터를 활용한 웹 개발 교육용 실습 자료로 제작되었습니다.
  미래의 훌륭한 웹 마스터가 될 여러분을 응원합니다!
  ============================================================================================================
*/
// api-test-common.js

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('doroland-theme', next);
    updateToggleUI(next);
}

function updateToggleUI(theme) {
    const icon = document.querySelector('.toggle-icon');
    const label = document.querySelector('.toggle-label');
    if (icon && label) {
        if (theme === 'light') {
            icon.textContent = '🌙';
            label.textContent = '야간 모드';
        } else {
            icon.textContent = '☀️';
            label.textContent = '주간 모드';
        }
    }
}

(function() {
    const saved = localStorage.getItem('doroland-theme');
    let theme;
    if (saved) {
        theme = saved;
    } else {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = systemDark ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
    document.addEventListener('DOMContentLoaded', () => {
        updateToggleUI(theme);
    });
})();

// Swagger UI 번역 및 공통 에러 가이드 삽입 유틸리티
function applySwaggerTranslationsAndErrorGuide() {
    const replaceTextNodes = (selector, oldText, newText) => {
        document.querySelectorAll(selector).forEach(el => {
            Array.from(el.childNodes).forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() === oldText) {
                    node.nodeValue = node.nodeValue.replace(oldText, newText);
                }
            });
        });
    };

    // 주요 버튼 텍스트 변경
    replaceTextNodes('.try-out__btn', 'Try it out', '테스트 시작 (API 입력 열기)');
    replaceTextNodes('.execute', 'Execute', '실행하기 (API 호출)');
    replaceTextNodes('.btn-clear', 'Clear', '초기화');
    replaceTextNodes('button.cancel', 'Cancel', '취소');

    // 주요 제목 텍스트 변경
    replaceTextNodes('.opblock-section-header h4 span', 'Parameters', '파라미터 (입력값)');
    replaceTextNodes('.responses-wrapper > .opblock-section-header h4', 'Responses', '실행 결과 (응답)');
    replaceTextNodes('.responses-inner h4', 'Responses', '실행 결과 (응답)');
    replaceTextNodes('.servers-title', 'Servers', 'API 서버 접속 주소');
    
    // 테이블 항목 번역
    replaceTextNodes('.parameter__name', 'Name', '파라미터명 (Name)');
    replaceTextNodes('.parameter__type', 'Description', '설명 (Description)');
    replaceTextNodes('.response-col_status', 'Code', '응답 코드 (Code)');
    replaceTextNodes('.response-col_description', 'Description', '응답 결과 설명 (Description)');

    // --- 실행 결과(응답) 하단에 에러코드 안내문을 주입 ---
    const responsesWrapper = document.querySelector('.responses-wrapper');
    if (responsesWrapper && !document.getElementById('error-code-guide')) {
        const errorGuide = document.createElement('div');
        errorGuide.id = 'error-code-guide';
        errorGuide.style = "margin: 20px; padding: 25px; background: #fffdf5; border-radius: 8px; border: 1px solid #ffecca; font-size: 13px; color: #444; box-shadow: 0 4px 8px rgba(0,0,0,0.02);";
        errorGuide.innerHTML = `
            <h4 style="margin: 0 0 15px 0; color: #b7790a; font-size: 16px;">📌 공공데이터 API 공통 응답 메시지 (resultCode / resultMsg) 코드표</h4>
            <table style="width: 100%; border-collapse: collapse; text-align: left; background: white; font-size: 13px; table-layout: fixed; word-break: break-word;">
                <colgroup><col style="width: 15%;"><col style="width: 45%;"><col style="width: 40%;"></colgroup>
                <tr style="background: #fff8e1; border-bottom: 2px solid #ffe199;">
                    <th style="padding: 10px; border: 1px solid #eee; color: #7a5000;">에러코드</th>
                    <th style="padding: 10px; border: 1px solid #eee; color: #7a5000;">에러메세지</th>
                    <th style="padding: 10px; border: 1px solid #eee; color: #7a5000;">설명</th>
                </tr>
                <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold; color: #0d8a5e;">00</td><td style="padding: 8px; border: 1px solid #eee; color: #0d8a5e; font-weight: bold;">NORMAL_SERVICE</td><td style="padding: 8px; border: 1px solid #eee; color: #0d8a5e; font-weight: bold;">정상</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">01</td><td style="padding: 8px; border: 1px solid #eee;">APPLICATION_ERROR</td><td style="padding: 8px; border: 1px solid #eee;">어플리케이션 에러</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">02</td><td style="padding: 8px; border: 1px solid #eee;">DB_ERROR</td><td style="padding: 8px; border: 1px solid #eee;">데이터베이스 에러</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">03</td><td style="padding: 8px; border: 1px solid #eee;">NODATA_ERROR</td><td style="padding: 8px; border: 1px solid #eee;">데이터없음 에러</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">04</td><td style="padding: 8px; border: 1px solid #eee;">HTTP_ERROR</td><td style="padding: 8px; border: 1px solid #eee;">HTTP 에러</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">05</td><td style="padding: 8px; border: 1px solid #eee;">SERVICETIME_OUT</td><td style="padding: 8px; border: 1px solid #eee;">서비스 연결실패 에러</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">10</td><td style="padding: 8px; border: 1px solid #eee;">INVALID_REQUEST_PARAMETER_ERROR</td><td style="padding: 8px; border: 1px solid #eee;">잘못된 요청 파라메터 에러</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">11</td><td style="padding: 8px; border: 1px solid #eee;">NO_MANDATORY_REQUEST_PARAMETERS_ERROR</td><td style="padding: 8px; border: 1px solid #eee;">필수요청 파라메터가 없음</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">12</td><td style="padding: 8px; border: 1px solid #eee;">NO_OPENAPI_SERVICE_ERROR</td><td style="padding: 8px; border: 1px solid #eee;">해당 오픈 API 서비스가 없거나 폐기됨</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">20</td><td style="padding: 8px; border: 1px solid #eee;">SERVICE_ACCESS_DENIED_ERROR</td><td style="padding: 8px; border: 1px solid #eee;">서비스 접근거부</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">21</td><td style="padding: 8px; border: 1px solid #eee;">TEMPORARILY_DISABLE_THE_SERVICEKEY_ERROR</td><td style="padding: 8px; border: 1px solid #eee;">일시적으로 사용할 수 없는 서비스 키</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">22</td><td style="padding: 8px; border: 1px solid #eee;">LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR</td><td style="padding: 8px; border: 1px solid #eee;">서비스 요청제한횟수 초과에러</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">30</td><td style="padding: 8px; border: 1px solid #eee;">SERVICE_KEY_IS_NOT_REGISTERED_ERROR</td><td style="padding: 8px; border: 1px solid #eee;">등록되지 않은 서비스키</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">31</td><td style="padding: 8px; border: 1px solid #eee;">DEADLINE_HAS_EXPIRED_ERROR</td><td style="padding: 8px; border: 1px solid #eee;">기한만료된 서비스키</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">32</td><td style="padding: 8px; border: 1px solid #eee;">UNREGISTERED_IP_ERROR</td><td style="padding: 8px; border: 1px solid #eee;">등록되지 않은 IP</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">33</td><td style="padding: 8px; border: 1px solid #eee;">UNSIGNED_CALL_ERROR</td><td style="padding: 8px; border: 1px solid #eee;">서명되지 않은 호출</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">99</td><td style="padding: 8px; border: 1px solid #eee;">UNKNOWN_ERROR</td><td style="padding: 8px; border: 1px solid #eee;">기타에러</td></tr>
            </table>
        `;
        responsesWrapper.appendChild(errorGuide);
    }
}
