/*
  ============================================================================================================
  [ Credits & License ]
  
  - Project:    도로랜드 정보국 훈련소
  - Creator:    XYLO
  - Powered by: DORO Inc.
  - Version:    1.4.2 (2026.04.30.)
  - Source:     https://github.com/xylito/doroland-smart-guide
  - License:    CC BY-SA 4.0 (상업적 이용 가능 / 동일 조건 변경 허락 / 저작자 표시)
  
  이 저작물은 공공데이터를 활용한 웹 개발 교육용 실습 자료로 제작되었습니다.
  미래의 훌륭한 웹 마스터가 될 여러분을 응원합니다!
  ============================================================================================================
*/

window.Codewhisper = {
    descriptions: {
        // HTML Tags
        'a': '🔗 링크를 만드는 태그', 'img': '🖼️ 이미지를 넣는 태그', 'input': '⌨️ 입력창을 만드는 태그',
        'div': '📦 구역을 나누는 상자', 'span': '📏 문장 안의 작은 구역', 'p': '📝 문단(텍스트) 태그',
        'button': '🖱️ 클릭하는 버튼', 'ul': '📜 순서 없는 목록', 'ol': '🔢 순서 있는 목록', 'li': '🔹 목록의 항목',
        'h1': '🔝 가장 큰 제목', 'h2': '🥈 중간 제목', 'h3': '🥉 작은 제목', 'br': '⏎ 줄바꿈 태그',
        'strong': '<b> 굵은 글씨', 'em': '<i> 기울임 글씨', 'label': '🏷️ 입력창의 이름표',
        'table': '📊 표를 만드는 태그', 'tr': '➖ 표의 가로 줄', 'td': '▫️ 표의 칸(데이터)', 'th': '💎 표의 제목 칸',
        'form': '📩 입력 양식 전체 상자', 'meta': '⚙️ 웹페이지의 정보 설정', 'link': '🖇️ 외부 파일(CSS 등) 연결',
        'script': '📜 자바스크립트 코드 연결', 'header': '🏠 머리말 구역', 'footer': '🏁 꼬리말 구역', 'section': '📑 큰 구역 구분',
        'audio': '🎵 소리를 재생하는 태그', 'video': '🎬 영상을 재생하는 태그', 'iframe': '🖼️ 다른 페이지를 삽입',
        'canvas': '🎨 그림을 그리는 영역', 'svg': '📐 벡터 그래픽 그리기', 'nav': '🧭 네비게이션 메뉴 구역',
        
        // HTML Attributes
        'href': '🔗 연결할 주소(URL)', 'src': '📂 이미지나 파일의 경로', 'alt': '💬 이미지 설명(대체 텍스트)',
        'class': '🏷️ 여러 번 쓸 수 있는 스타일 이름', 'id': '🆔 한 번만 쓰는 고유 이름', 'style': '🎨 직접 디자인 설정',
        'target': '📤 링크가 열릴 창 (_blank: 새창)', 'type': '⚙️ 입력창의 종류', 'placeholder': '💡 미리 보여줄 글자',
        'value': '💎 기본값/입력된 값', 'width': '↔️ 가로 길이', 'height': '↕️ 세로 길이', 'name': '📛 서버로 보낼 데이터 이름',
        'rel': '🔗 현재 페이지와 관계 설정', 'method': '📤 데이터 전송 방식', 'action': '🎯 데이터를 보낼 주소',
        'autoplay': '▶️ 자동 재생 설정', 'controls': '⏯️ 재생 컨트롤 표시', 'loop': '🔁 반복 재생 설정',
        
        // CSS Properties
        'color': '🎨 글자 색상', 'background-color': '🖼️ 배경 색상', 'font-size': '📏 글자 크기',
        'font-weight': '💪 글자 두께', 'text-align': '↔️ 텍스트 정렬', 'padding': '📦 안쪽 여백',
        'margin': '↔️ 바깥 여백', 'border': '🖼️ 테두리', 'border-radius': '🟡 테두리 둥글게',
        'width': '↔️ 가로 너비', 'height': '↕️ 세로 높이', 'display': '👁️ 보여주는 방식',
        'flex': '🧩 유연한 박스 설정', 'justify-content': '↔️ 가로 정렬 방식', 'align-items': '↕️ 세로 정렬 방식',
        'position': '📍 위치 설정 방식', 'top': '⬆️ 위에서부터 거리', 'left': '⬅️ 왼쪽에서부터 거리',
        'cursor': '🖱️ 마우스 커서 모양', 'opacity': '👻 투명도 (0~1)', 'transition': '⏳ 부드러운 변화 (애니메이션)',
        'z-index': '📚 겹치는 순서 (높을수록 위)', 'overflow': '🌊 넘치는 내용 처리', 'box-shadow': '🌘 상자 그림자',
        'white-space': '⌨️ 공백 처리 방식', 'list-style': '🔹 목록 기호 설정', 'transform': '🔄 모양 변형 (회전, 크기 등)',
        'animation': '🎬 애니메이션 효과', 'background-image': '🖼️ 배경 이미지 설정', 'box-sizing': '📏 박스 크기 계산 방식',
        
        // JS Keywords/Methods
        'const': '🔒 변하지 않는 변수 선언', 'let': '🔓 변할 수 있는 변수 선언', 'var': '⚠️ (구형) 변수 선언',
        'function': '⚙️ 함수 정의', 'if': '❓ 조건문 (만약 ~라면)', 'else': '❗ 조건문 (그렇지 않으면)',
        'for': '🔁 반복문 (정해진 횟수만큼)', 'while': '🔄 반복문 (조건이 맞는 동안)', 'return': '🔙 결과값 반환/함수 종료',
        'document': '📄 현재 문서(웹페이지) 객체', 'getElementById': '🆔 ID로 요소 찾기',
        'querySelector': '🔍 CSS 선택자로 요소 찾기', 'querySelectorAll': '🔍 모든 요소를 리스트로 찾기',
        'addEventListener': '⚡ 이벤트 발생 감지', 'console.log': '🖥️ 콘솔에 내용 출력', 
        'window': '🌐 브라우저 창 객체', 'alert': '🔔 경고창 띄우기', 'class': '🏗️ 객체 설계도 정의',
        'setTimeout': '⏰ 일정 시간 뒤 실행', 'setInterval': '🔄 일정 시간마다 반복 실행',
        'localStorage': '💾 브라우저에 데이터 저장', 'JSON.parse': '📦 문자열을 객체로 변환',
        'Math.random': '🎲 랜덤한 숫자 생성', 'Math.floor': '📉 소수점 내림', 'fetch': '🌐 데이터 서버에서 가져오기'
    },

    attributeValues: {
        'type': {
            'text': '⌨️ 일반 텍스트 입력창', 'password': '🔒 비밀번호 입력창', 'button': '🖱️ 클릭용 버튼',
            'checkbox': '✅ 다중 선택 체크박스', 'radio': '🔘 단일 선택 라디오', 'color': '🎨 색상 선택기',
            'email': '📧 이메일 주소 입력', 'number': '🔢 숫자 입력창', 'date': '📅 날짜 선택기',
            'range': '↔️ 범위 선택 슬라이더', 'file': '📂 파일 업로드', 'submit': '📤 전송 버튼', 'reset': '🔄 입력 초기화 버튼'
        },
        'target': {
            '_blank': '🆕 새 탭에서 열기', '_self': '🏠 현재 탭에서 열기',
            '_parent': '⬆️ 부모 프레임에서 열기', '_top': '🔝 최상단 창에서 열기'
        },
        'rel': {
            'noopener': '🛡️ 보안을 위해 새창 연결 차단', 'noreferrer': '🔒 참조 정보 숨김',
            'stylesheet': '🖇️ CSS 파일 연결', 'icon': '🖼️ 파비콘 설정'
        },
        'method': { 'get': '🔍 데이터 조회 방식(주소에 표시)', 'post': '🔒 데이터 전송 방식(숨겨서 전송)' },
        'text-align': { 'center': '↔️ 가운데 정렬', 'left': '⬅️ 왼쪽 정렬', 'right': '➡️ 오른쪽 정렬', 'justify': '↔️ 양쪽 맞춤' },
        'display': { 'flex': '🧩 유연한 박스 레이아웃', 'block': '📦 한 줄 다 차지', 'inline-block': '📏 글자처럼 흐름', 'none': '👻 숨기기', 'grid': '🏁 격자 레이아웃', 'inline': '📏 줄 안의 요소' },
        'justify-content': { 'center': '↔️ 가운데 정렬', 'space-between': '↔️ 양 끝 벌리기', 'space-around': '↔️ 일정 간격', 'flex-start': '⬅️ 앞으로 정렬', 'flex-end': '➡️ 뒤로 정렬' },
        'align-items': { 'center': '↕️ 세로 가운데', 'flex-start': '⬆️ 세로 위쪽', 'flex-end': '⬇️ 세로 아래쪽', 'stretch': '↕️ 가득 채움' },
        'flex-direction': { 'row': '➡️ 가로 방향', 'column': '⬇️ 세로 방향', 'row-reverse': '⬅️ 가로 역순', 'column-reverse': '⬆️ 세로 역순' },
        'flex-wrap': { 'nowrap': '🚫 줄바꿈 없음', 'wrap': '🔄 줄바꿈 허용', 'wrap-reverse': '🔄 역순 줄바꿈' },
        'border': { '1px solid black': '📏 1px 검정 실선', '2px dashed #38bdf8': '📏 2px 하늘색 점선', 'none': '🚫 테두리 없음' },
        'font-weight': { 'bold': '💪 굵게', 'normal': '📏 보통 두께', '100': '얇게', '900': '매우 굵게' },
        'cursor': { 'pointer': '🖱️ 손가락 모양', 'default': '🖱️ 화살표', 'not-allowed': '🚫 금지 모양', 'wait': '⏳ 로딩 중 모양', 'help': '❓ 도움말 모양' },
        'position': { 'relative': '📍 현재 기준', 'absolute': ' 부모 안에서 자유롭게', 'fixed': '🌐 화면 고정', 'sticky': '📌 스크롤 고정' },
        'overflow': { 'visible': '👁️ 다 보여주기', 'hidden': '👻 넘치는 부분 숨기기', 'scroll': '📜 스크롤바 표시', 'auto': '🔄 자동 스크롤' },
        'object-fit': { 'cover': '🖼️ 비율 맞춰 가득 채움', 'contain': '🖼️ 비율 맞춰 전체 보여줌', 'fill': '🖼️ 꽉 채우기 (왜곡 발생)' },
        'padding': { '10px': '📦 모든 방향 10px', '20px': '📦 모든 방향 20px', '0': '🚫 여백 없음' },
        'margin': { '10px': '↔️ 모든 방향 10px', '0 auto': '↔️ 가운데 정렬용', '0': '🚫 여백 없음' },
        'border-radius': { '5px': '🟡 약간 둥글게', '10px': '🟠 많이 둥글게', '50%': '🟢 완전 동그랗게', '0': '🟦 직각 테두리' }
    },

    getHints: function(cmInstance) {
        let cur = cmInstance.getCursor(), currentLine = cmInstance.getLine(cur.line);
        let start = cur.ch, end = cur.ch;
        const mode = cmInstance.getModeAt(cur).name;
        const beforeCursorFull = cmInstance.getRange({line: 0, ch: 0}, cur);
        const beforeCursorLine = currentLine.slice(0, cur.ch);
        
        // 1. 속성값 모드 확인
        let attrMatch = null;
        let isCSSValue = false;

        if (mode === "css") {
            const lastAnchor = Math.max(beforeCursorFull.lastIndexOf(';'), beforeCursorFull.lastIndexOf('{'), beforeCursorFull.lastIndexOf('\n'));
            const currentSegment = beforeCursorFull.slice(lastAnchor + 1);
            attrMatch = currentSegment.match(/([a-zA-Z0-9-]+):\s*([^;}]*)$/);
            isCSSValue = !!attrMatch;
        } else {
            attrMatch = beforeCursorLine.match(/([a-zA-Z0-9-]+)=["']([^"']*)$/);
        }
        
        if (attrMatch) {
            const attrName = attrMatch[1];
            const curValue = attrMatch[2].trim().toLowerCase();
            const valStart = cur.ch - curValue.length;
            let suggestions = [];

            if (["background-color", "color", "border-color", "outline-color"].includes(attrName)) {
                suggestions.push({
                    text: "", displayText: "🎨 색상 선택기 실행...",
                    hint: (cm, data, completion) => {
                        const picker = document.getElementById('color-picker');
                        if (picker) {
                            const onSelect = (e) => {
                                const col = e.target.value;
                                const line = cm.getLine(data.from.line);
                                let pref = (line.charAt(data.from.ch - 1) === ":" && !line.slice(0, data.from.ch).endsWith(": ")) ? " " : "";
                                cm.replaceRange(pref + col + ";", data.from, data.to);
                                picker.removeEventListener('change', onSelect);
                            };
                            picker.addEventListener('change', onSelect);
                            picker.click();
                        }
                    }
                });
            }

            if (window.Codewhisper.attributeValues[attrName]) {
                const vals = window.Codewhisper.attributeValues[attrName];
                for (let v in vals) {
                    if (v.startsWith(curValue)) {
                        suggestions.push({
                            text: v + (isCSSValue ? ";" : '"'),
                            displayText: `${v} : ${vals[v]}`
                        });
                    }
                }
            }
            
            if (suggestions.length > 0) return { list: suggestions, from: CodeMirror.Pos(cur.line, valStart), to: cur };
            if (isCSSValue) return { list: [], from: cur, to: cur };
        }

        // 2. JavaScript DOM 메소드 인자 추천 (getElementById, querySelector 등)
        if (mode === "javascript") {
            const domMatch = beforeCursorLine.match(/(getElementById|getElementsByClassName|getElementsByTagName|getElementsByName|querySelector|querySelectorAll)\(['"]([^'"]*)$/);
            if (domMatch) {
                const method = domMatch[1];
                const curVal = domMatch[2].toLowerCase();
                const fullContent = cmInstance.getValue();
                let suggestions = [];

                if (method === "getElementById" || method.includes("querySelector")) {
                    (fullContent.match(/id=["']([^"']+)["']/g) || []).forEach(m => {
                        const id = m.match(/["']([^"']+)["']/)[1];
                        const prefix = method.includes("querySelector") ? "#" : "";
                        if (id.toLowerCase().startsWith(curVal.replace(/^#/, ''))) {
                            suggestions.push({ text: prefix + id + "')", displayText: `🆔 ${prefix}${id} (ID)` });
                        }
                    });
                }
                
                if (method === "getElementsByClassName" || method.includes("querySelector")) {
                    (fullContent.match(/class=["']([^"']+)["']/g) || []).forEach(m => {
                        m.match(/["']([^"']+)["']/)[1].split(/\s+/).forEach(c => {
                            const prefix = method.includes("querySelector") ? "." : "";
                            if (c.toLowerCase().startsWith(curVal.replace(/^\./, ''))) {
                                suggestions.push({ text: prefix + c + "')", displayText: `🎨 ${prefix}${c} (Class)` });
                            }
                        });
                    });
                }

                if (method === "getElementsByTagName" || method.includes("querySelector")) {
                    for (let tag in window.Codewhisper.descriptions) {
                        if (!tag.includes('-') && !tag.startsWith('.') && tag.toLowerCase().startsWith(curVal)) {
                            suggestions.push({ text: tag + "')", displayText: `🏷️ ${tag} (Tag)` });
                        }
                    }
                }

                if (method === "getElementsByName") {
                    (fullContent.match(/name=["']([^"']+)["']/g) || []).forEach(m => {
                        const name = m.match(/["']([^"']+)["']/)[1];
                        if (name.toLowerCase().startsWith(curVal)) {
                            suggestions.push({ text: name + "')", displayText: `📛 ${name} (Name)` });
                        }
                    });
                }

                if (suggestions.length > 0) return { list: suggestions, from: CodeMirror.Pos(cur.line, cur.ch - curVal.length), to: cur };
            }

            // 3. JavaScript 스타일 값 대입 추천 (style.color = " 등)
            const jsStyleMatch = beforeCursorLine.match(/\.style\.([a-zA-Z0-9_$]+)\s*=\s*(["']?)([^"']*)$/);
            if (jsStyleMatch) {
                const prop = jsStyleMatch[1]; // color, backgroundColor 등
                const hasQuote = !!jsStyleMatch[2];
                const curVal = jsStyleMatch[3].toLowerCase();
                const valStart = cur.ch - curVal.length - (hasQuote ? 1 : 0);
                let suggestions = [];

                if (prop === "color" || prop === "backgroundColor" || prop === "borderColor") {
                    const colors = ["red", "blue", "green", "yellow", "black", "white", "gray", "purple", "orange", "pink", "skyblue", "gold", "silver", "transparent"];
                    colors.forEach(c => {
                        if (c.startsWith(curVal)) {
                            suggestions.push({ text: "'" + c + "';", displayText: `🎨 '${c}'` });
                        }
                    });
                } else if (prop === "display") {
                    ["block", "none", "flex", "inline-block", "grid"].forEach(v => {
                        if (v.startsWith(curVal)) suggestions.push({ text: "'" + v + "';", displayText: `📦 '${v}'` });
                    });
                } else if (prop === "cursor") {
                    ["pointer", "default", "wait", "move", "not-allowed"].forEach(v => {
                        if (v.startsWith(curVal)) suggestions.push({ text: "'" + v + "';", displayText: `🖱️ '${v}'` });
                    });
                }

                if (suggestions.length > 0) return { list: suggestions, from: CodeMirror.Pos(cur.line, valStart), to: cur };
            }
        }

        // 2. 일반 모드
        while (start && /[\w-$]/.test(currentLine.charAt(start - 1))) --start;
        if (start > 0 && /[\<\.\#]/.test(currentLine.charAt(start - 1))) --start;
        let curWord = currentLine.slice(start, end).toLowerCase();
        let matchWord = curWord.replace(/^[<>\.#]/, '');
        
        let missionHints = [];
        if (matchWord.length >= 1) {
            document.querySelectorAll('.mission-card code').forEach(code => {
                let text = code.innerText.trim();
                if (text.toLowerCase().includes(matchWord)) {
                    missionHints.push({ text: text, displayText: `✨ ${text.substring(0, 30)} (미션 힌트)`, className: 'whisper-hint' });
                }
            });
        }

        let baseHints = { list: [] };
        if (mode === "css") {
            baseHints = CodeMirror.hint.css(cmInstance) || { list: [] };
            if (!/\{[^}]*$/.test(beforeCursorFull)) {
                if (!curWord.startsWith('#')) {
                    for (let tag in window.Codewhisper.descriptions) {
                        if (!tag.includes('-') && !baseHints.list.some(h => (typeof h === 'string' ? h : h.text) === tag)) baseHints.list.push(tag);
                    }
                }
                const full = cmInstance.getValue();
                // 클래스 스캔
                (full.match(/class=["']([^"']+)["']/g) || []).forEach(m => {
                    m.match(/["']([^"']+)["']/)[1].split(/\s+/).forEach(c => {
                        if (!baseHints.list.some(h => (typeof h === 'string' ? h : h.text) === '.' + c)) {
                            baseHints.list.push({ text: '.' + c, displayText: `🎨 .${c} (문서 내 class)` });
                        }
                    });
                });
                // 아이디 스캔
                (full.match(/id=["']([^"']+)["']/g) || []).forEach(m => {
                    const id = m.match(/["']([^"']+)["']/)[1];
                    if (!baseHints.list.some(h => (typeof h === 'string' ? h : h.text) === '#' + id)) {
                        baseHints.list.push({ text: '#' + id, displayText: `🆔 #${id} (문서 내 id)` });
                    }
                });
            }
        } else if (mode === "javascript") {
            baseHints = CodeMirror.hint.javascript(cmInstance) || { list: [] };
            const fullContent = cmInstance.getValue();
            
            // 1. 문서 내 변수/함수 선언 스캔 (const, let, var, function)
            const varMatches = fullContent.match(/(const|let|var)\s+([a-zA-Z0-9_$]+)/g) || [];
            const funcMatches = fullContent.match(/function\s+([a-zA-Z0-9_$]+)/g) || [];
            const localVars = new Set();
            varMatches.forEach(m => localVars.add(m.split(/\s+/).pop()));
            funcMatches.forEach(m => localVars.add(m.split(/\s+/).pop()));
            
            localVars.forEach(v => {
                if (v && !baseHints.list.some(h => (typeof h === 'string' ? h : h.text) === v)) {
                    baseHints.list.push({ text: v, displayText: `📦 ${v} (지역 변수/함수)` });
                }
            });

            // 2. 점(.) 입력 시 속성/메소드 추천
            if (curWord.startsWith('.')) {
                const domProps = ["innerText", "innerHTML", "style", "value", "onclick", "addEventListener", "classList", "getAttribute", "setAttribute", "appendChild", "remove", "parentElement", "children", "focus", "blur"];
                domProps.forEach(p => {
                    if (!baseHints.list.some(h => (typeof h === 'string' ? h : h.text) === p)) {
                        baseHints.list.push({ text: "." + p, displayText: `🔹 ${p} (DOM 속성/메소드)` });
                    }
                });

                // .style 뒤에는 CSS 속성 추천 (camelCase)
                if (/\.style\.[a-zA-Z0-9_$]*$/.test(beforeCursorLine.trim())) {
                    Object.keys(window.Codewhisper.descriptions).forEach(prop => {
                        if (prop.includes('-') || ["color", "display", "width", "height", "margin", "padding", "border"].includes(prop)) {
                            const camel = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                            // 이미 입력된 부분이 있으면 필터링을 위해 점 제외하고 추가
                            if (!baseHints.list.some(h => (typeof h === 'string' ? h : h.text).includes(camel))) {
                                baseHints.list.push({ text: camel, displayText: `🎨 ${camel} (Style)`, isStyle: true });
                            }
                        }
                    });
                }
            }
        } else {
            baseHints = CodeMirror.hint.html(cmInstance) || { list: [] };
        }

        let combined = [];
        const process = (h) => {
            let text = typeof h === 'string' ? h : h.text;
            if (mode === "javascript" && curWord.startsWith('.') && !text.startsWith('.')) text = "." + text;
            let clean = text.replace(/[<>\.#]/g, '');
            let desc = window.Codewhisper.descriptions[clean];
            let disp = (typeof h !== 'string' && h.displayText) ? h.displayText : (desc ? `${text} : ${desc}` : text);
            return { text: text, displayText: disp, isStyle: h.isStyle, originalHint: h.hint };
        };

        missionHints.forEach(h => combined.push(process(h)));
        baseHints.list.forEach(h => {
            let p = process(h);
            if (!combined.some(m => m.text === p.text)) combined.push(p);
        });

        combined.forEach(item => {
            item.hint = (cm, data, completion) => {
                let repl = completion.text;
                if (mode === "css") {
                    const fullB = cm.getRange({line: 0, ch: 0}, data.from);
                    const isInside = /\{[^}]*$/.test(fullB);
                    const lastA = Math.max(fullB.lastIndexOf(';'), fullB.lastIndexOf('{'), fullB.lastIndexOf('\n'));
                    const seg = fullB.slice(lastA + 1);
                    if (isInside && !repl.includes(':') && !repl.includes('{') && !seg.includes(':')) repl += ": ";
                } else if (mode === "javascript") {
                    const domMethods = ["getElementById", "getElementsByClassName", "getElementsByTagName", "getElementsByName", "querySelector", "querySelectorAll"];
                    if (domMethods.some(m => repl.endsWith(m))) repl += "('";
                } else if (mode === "html") {
                    const fullB = cm.getRange({line: 0, ch: 0}, data.from);
                    if (/<[a-zA-Z0-9-]+\s+[^>]*$/.test(fullB) && !repl.startsWith('<')) repl += '="';
                }

                if (completion.originalHint) completion.originalHint(cm, data, completion);
                else cm.replaceRange(repl, data.from, data.to);

                // 핵심: 즉시 연쇄 자동 완성 실행 (지연 시간 없이)
                if (repl.endsWith(": ") || repl.endsWith('="') || repl.endsWith("('")) {
                    cm.showHint({ completeSingle: false, hint: window.Codewhisper.getHints });
                }
            };
        });

        let filtered = combined.filter(h => {
            let t = h.text.toLowerCase();
            if (mode === "css") {
                if (curWord.startsWith('.')) return t.startsWith('.');
                if (curWord.startsWith('#')) return t.startsWith('#');
            }
            return t.replace(/^[<>\.#]/, '').includes(matchWord);
        });

        return { list: filtered.slice(0, 15), from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end) };
    },

    init: function(editor) {
        if (!editor) return;
        editor.on("inputRead", (cm, change) => {
            const char = change.text[0];
            const mode = cm.getModeAt(change.from).name;
            const line = cm.getLine(change.from.line).slice(0, change.from.ch + char.length);
            
            const trigger = /[\w-$<.\#:'"]/.test(char) || (char === " " && /<[a-z0-9-]+\s+$/i.test(line)) || (char === " " && /:\s*$/i.test(line));
            if (change.origin !== "+input" || !trigger) {
                if (char === "}" && mode === "css") {
                    const cur = cm.getCursor();
                    if (cm.getRange({line: cur.line, ch: cur.ch - 2}, {line: cur.line, ch: cur.ch - 1}) === ";") cm.replaceRange(" }", {line: cur.line, ch: cur.ch - 1}, cur);
                }
                return;
            }
            cm.showHint({ completeSingle: false, hint: this.getHints });
        });
    }
};
