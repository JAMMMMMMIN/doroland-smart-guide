/*
  ============================================================================================================
  [ Codewhisper - Smart Autocomplete Module ]
  
  - Project:    도로랜드 정보국 훈련소
  - Module:     AI-style code completion and hint engine
  - Author:     XYLO / Antigravity
  ============================================================================================================
*/

window.Codewhisper = {
    // 기본 사전 데이터
    descriptions: {
        // HTML Tags
        'a': '링크를 만드는 태그', 'img': '이미지를 넣는 태그', 'input': '입력창을 만드는 태그',
        'div': '구역을 나누는 상자', 'span': '문장 안의 작은 구역', 'p': '문단(텍스트) 태그',
        'button': '클릭하는 버튼', 'ul': '순서 없는 목록', 'ol': '순서 있는 목록', 'li': '목록의 항목',
        'h1': '가장 큰 제목', 'h2': '중간 제목', 'h3': '작은 제목', 'br': '줄바꿈 태그',
        'strong': '글씨를 굵게', 'em': '글씨를 기울임', 'label': '입력창의 이름표',
        
        // HTML Attributes
        'href': '연결할 주소(URL)', 'src': '이미지나 파일의 경로', 'alt': '이미지 설명(대체 텍스트)',
        'class': '여러 번 쓸 수 있는 스타일 이름', 'id': '한 번만 쓰는 고유 이름', 'style': '직접 디자인 설정',
        'target': '링크가 열릴 창 (_blank: 새창)', 'type': '입력창의 종류', 'placeholder': '미리 보여줄 글자',
        'value': '기본값/입력된 값', 'width': '가로 길이', 'height': '세로 길이',
        
        // CSS Properties
        'color': '글자 색상', 'background-color': '배경 색상', 'font-size': '글자 크기',
        'font-weight': '글자 두께', 'text-align': '텍스트 정렬', 'padding': '안쪽 여백',
        'margin': '바깥 여백', 'border': '테두리', 'border-radius': '테두리 둥글게',
        'width': '가로 너비', 'height': '세로 높이', 'display': '보여주는 방식 (flex, block 등)',
        'flex': '유연한 박스 설정', 'justify-content': '가로 정렬 방식', 'align-items': '세로 정렬 방식',
        'position': '위치 설정 방식', 'top': '위에서부터 거리', 'left': '왼쪽에서부터 거리',
        'cursor': '마우스 커서 모양', 'opacity': '투명도', 'transition': '부드러운 변화(애니메이션)',
        
        // JS Keywords/Methods
        'const': '변하지 않는 변수 선언', 'let': '변할 수 있는 변수 선언', 'function': '함수 정의',
        'document': '현재 문서(웹페이지) 객체', 'getElementById': 'ID로 요소 찾기',
        'querySelector': 'CSS 선택자로 요소 찾기', 'addEventListener': '이벤트 발생 감지',
        'console.log': '콘솔에 내용 출력', 'window': '브라우저 창 객체', 'alert': '경고창 띄우기'
    },

    // 속성 값 사전 데이터
    attributeValues: {
        'type': {
            'text': '일반 텍스트 입력창', 'password': '비밀번호 입력창', 'button': '클릭용 버튼',
            'checkbox': '다중 선택 체크박스', 'radio': '단일 선택 라디오', 'color': '색상 선택기',
            'email': '이메일 주소 입력', 'number': '숫자 입력창', 'date': '날짜 선택기',
            'file': '파일 업로드', 'submit': '전송 버튼'
        },
        'target': {
            '_blank': '새 탭에서 열기', '_self': '현재 탭에서 열기',
            '_parent': '부모 프레임에서 열기', '_top': '최상단 창에서 열기'
        },
        'rel': {
            'noopener': '보안을 위해 새창 연결 차단', 'noreferrer': '참조 정보 숨김',
            'stylesheet': 'CSS 파일 연결'
        },
        'method': { 'get': '데이터 조회 방식', 'post': '데이터 전송 방식' }
    },

    // 백과사전 HTML에서 설명을 추출하여 업데이트
    updateFromHTML: function(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const items = doc.querySelectorAll('li');
        
        items.forEach(item => {
            const code = item.querySelector('code');
            const bold = item.querySelector('b');
            if (code && bold) {
                let rawKey = code.textContent.trim();
                
                // 패턴 1: 속성값 형태 (예: type="text")
                const valMatch = rawKey.match(/([a-zA-Z0-9-]+)=["']?([^"']+)["']?/);
                if (valMatch) {
                    const attr = valMatch[1];
                    const val = valMatch[2];
                    if (!this.attributeValues[attr]) this.attributeValues[attr] = {};
                    this.attributeValues[attr][val] = bold.textContent.trim();
                } else {
                    // 패턴 2: 일반 태그/속성 형태
                    let key = rawKey.replace(/[<>/]/g, '').trim();
                    if (!this.descriptions[key]) {
                        this.descriptions[key] = bold.textContent.trim();
                    }
                }
            }
        });
    },

    // 에디터에 Codewhisper 로직 연결
    init: function(editor) {
        if (!editor) return;

        editor.on("inputRead", (cm, change) => {
            const line = cm.getLine(change.from.line);
            const textBefore = line.slice(0, change.from.ch + (change.text[0].length));
            
            const isWord = /\w/.test(change.text[0]);
            const isTagStart = change.text[0] === "<";
            const isAttributeTrigger = change.text[0] === " " && /<[a-zA-Z0-9-]+(\s+[a-zA-Z0-9-]+(="[^"]*")?)*\s+$/.test(textBefore);
            const isTagInsideTrigger = change.text[0] === " " && /<[a-zA-Z0-9-]+$/.test(textBefore);
            // 속성값 트리거 (따옴표 입력 시)
            const isValueTrigger = change.text[0] === "\"" || change.text[0] === "'";

            if (change.origin !== "+input" || (!isWord && !isTagStart && !isAttributeTrigger && !isTagInsideTrigger && !isValueTrigger)) return;
            
            cm.showHint({
                completeSingle: false,
                hint: (cmInstance) => {
                    let cur = cmInstance.getCursor(), currentLine = cmInstance.getLine(cur.line);
                    let start = cur.ch, end = cur.ch;
                    
                    // 속성값 모드 확인 로직
                    const beforeCursor = currentLine.slice(0, cur.ch);
                    const attrMatch = beforeCursor.match(/([a-zA-Z0-9-]+)=["']([^"']*)$/);
                    
                    if (attrMatch) {
                        const attrName = attrMatch[1];
                        const curValue = attrMatch[2].toLowerCase();
                        const valStart = cur.ch - curValue.length;
                        
                        let suggestions = [];
                        if (this.attributeValues[attrName]) {
                            const values = this.attributeValues[attrName];
                            for (let v in values) {
                                if (v.startsWith(curValue)) {
                                    suggestions.push({
                                        text: v,
                                        displayText: `${v} : ${values[v]}`
                                    });
                                }
                            }
                        }
                        
                        if (suggestions.length > 0) {
                            return {
                                list: suggestions,
                                from: CodeMirror.Pos(cur.line, valStart),
                                to: CodeMirror.Pos(cur.line, cur.ch)
                            };
                        }
                    }

                    // 일반 태그/속성 모드
                    while (start && /[\w-]/.test(currentLine.charAt(start - 1))) --start;
                    if (start > 0 && currentLine.charAt(start - 1) === '<') --start;

                    let curWord = currentLine.slice(start, end).toLowerCase();
                    let matchWord = curWord.startsWith('<') ? curWord.slice(1) : curWord;
                    
                    // 1. Mission-Specific "Whisper" Hints
                    let missionHints = [];
                    if (matchWord.length >= 2 && !isAttributeTrigger && !isTagInsideTrigger) {
                        document.querySelectorAll('.mission-card code').forEach(code => {
                            let text = code.innerText.trim();
                            let lines = text.split('\n');
                            lines.forEach(l => {
                                let cleanL = l.trim();
                                if (cleanL.toLowerCase().includes(matchWord)) {
                                    missionHints.push({
                                        text: cleanL,
                                        displayText: `✨ ${cleanL.substring(0, 35)}${cleanL.length > 35 ? '...' : ''} (미션 힌트)`,
                                        className: 'whisper-hint'
                                    });
                                }
                            });
                        });
                    }

                    // 2. Mode-Specific Hints
                    let baseHints = { list: [] };
                    const mode = cmInstance.getMode().name;
                    if (mode === "css") baseHints = CodeMirror.hint.css(cmInstance) || { list: [] };
                    else if (mode === "javascript") baseHints = CodeMirror.hint.javascript(cmInstance) || { list: [] };
                    else if (mode === "xml" || mode === "htmlmixed") baseHints = CodeMirror.hint.html(cmInstance) || { list: [] };
                    
                    let combined = [...missionHints];
                    if (baseHints && baseHints.list) {
                        baseHints.list.forEach(h => {
                            let text = typeof h === 'string' ? h : h.text;
                            let cleanTextForLookup = text.startsWith('<') ? text.slice(1) : text;
                            if (cleanTextForLookup.endsWith('>')) cleanTextForLookup = cleanTextForLookup.slice(0, -1);
                            
                            let desc = this.descriptions[cleanTextForLookup];
                            let displayText = desc ? `${text} : ${desc}` : text;

                            if (!combined.some(m => m.text === text)) {
                                combined.push({
                                    text: text,
                                    displayText: displayText
                                });
                            }
                        });
                    }

                    let filtered = combined.filter(h => {
                        let text = typeof h === 'string' ? h : h.text;
                        let cleanText = text.startsWith('<') ? text.slice(1) : text;
                        return cleanText.toLowerCase().includes(matchWord);
                    });

                    return {
                        list: filtered.slice(0, 15),
                        from: CodeMirror.Pos(cur.line, start),
                        to: CodeMirror.Pos(cur.line, end)
                    };
                }
            });
        });
    }
};

