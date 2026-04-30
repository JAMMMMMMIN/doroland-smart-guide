/*
  ============================================================================================================
  [ Credits & License ]
  
  - Project:    도로랜드 정보국 훈련소
  - Creator:    XYLO
  - Powered by: DORO Inc.
  - Version:    1.4.0 (2026.04.30.)
  - Source:     https://github.com/xylito/doroland-smart-guide
  - License:    CC BY-SA 4.0 (상업적 이용 가능 / 동일 조건 변경 허락 / 저작자 표시)
  
  이 저작물은 공공데이터를 활용한 웹 개발 교육용 실습 자료로 제작되었습니다.
  미래의 훌륭한 웹 마스터가 될 여러분을 응원합니다!
  ============================================================================================================
*/
/*
  ============================================================================================================
  [ Codewhisper - Smart Autocomplete Module ]
  
  - Project:    도로랜드 정보국 훈련소
  - Module:     AI-style code completion and hint engine
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
                
                // 패턴 1: HTML 속성값 형태 (예: type="text")
                const valMatch = rawKey.match(/([a-zA-Z0-9-]+)=["']?([^"']+)["']?/);
                // 패턴 1-2: CSS 속성값 형태 (예: text-align: center)
                const cssValMatch = rawKey.match(/([a-zA-Z0-9-]+):\s*([^;]+)/);

                if (valMatch) {
                    const attr = valMatch[1];
                    const val = valMatch[2];
                    if (!this.attributeValues[attr]) this.attributeValues[attr] = {};
                    this.attributeValues[attr][val] = bold.textContent.trim();
                } else if (cssValMatch) {
                    const prop = cssValMatch[1];
                    const val = cssValMatch[2].trim();
                    if (!this.attributeValues[prop]) this.attributeValues[prop] = {};
                    this.attributeValues[prop][val] = bold.textContent.trim();
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
            const modeAtCursor = cm.getModeAt(change.from).name;
            
            // Trigger check
            const char = change.text[0];
            const isWord = /[\w-$]/.test(char);
            const isTagStart = char === "<";
            const isAttributeTrigger = char === " " && /<[a-zA-Z0-9-]+(\s+[a-zA-Z0-9-]+(="[^"]*")?)*\s+$/.test(textBefore);
            const isTagInsideTrigger = char === " " && /<[a-zA-Z0-9-]+$/.test(textBefore);
            const isValueTrigger = char === "\"" || char === "'";
            // CSS 속성 및 값 트리거
            const isCssTrigger = (modeAtCursor === "css") && (/[\{\;\:]/.test(char) || (char === " " && /[\{\;\:]\s*$/.test(textBefore)));
            // CSS 클래스/ID 트리거
            const isSelectorTrigger = (modeAtCursor === "css") && /[\.\#]/.test(char);
            // JS 속성 및 대입 트리거
            const isJsTrigger = (modeAtCursor === "javascript") && /[\.\=]/.test(char);

            if (change.origin !== "+input" || (!isWord && !isTagStart && !isAttributeTrigger && !isTagInsideTrigger && !isValueTrigger && !isCssTrigger && !isSelectorTrigger && !isJsTrigger)) return;
            
            // 수동 '=' 입력 시 공백 보정
            if (char === "=" && modeAtCursor === "javascript" && !textBefore.endsWith(" = ")) {
                const cur = cm.getCursor();
                const prevChar = cm.getRange({line: cur.line, ch: cur.ch - 2}, {line: cur.line, ch: cur.ch - 1});
                if (prevChar !== " ") {
                    cm.replaceRange(" = ", {line: cur.line, ch: cur.ch - 1}, cur);
                }
            }
            
            cm.showHint({
                completeSingle: false,
                hint: (cmInstance) => {
                    let cur = cmInstance.getCursor(), currentLine = cmInstance.getLine(cur.line);
                    let start = cur.ch, end = cur.ch;
                    const mode = cmInstance.getModeAt(cur).name;
                    const beforeCursor = currentLine.slice(0, cur.ch);
                    
                    // 1. 전용 특수 모드 (이벤트 핸들러, DOM 인자 등)
                    if (mode === "javascript") {
                        // (A) 이벤트 핸들러 전용 추천 (onclick = , addEventListener 등)
                        const eventHandlerMatch = beforeCursor.match(/on[a-z]+\s*=\s*([a-zA-Z0-9_$]*)$/) || 
                                             beforeCursor.match(/addEventListener\(['"][^'"]+['"]\s*,\s*([a-zA-Z0-9_$]*)$/);
                        if (eventHandlerMatch) {
                            const curVal = eventHandlerMatch[1].toLowerCase();
                            const fullContent = cmInstance.getValue();
                            const funcMatches = fullContent.match(/function\s+([a-zA-Z0-9_$]+)/g) || [];
                            let suggestions = [];

                            funcMatches.forEach(m => {
                                const funcName = m.split(/\s+/)[1];
                                if (funcName.toLowerCase().startsWith(curVal)) {
                                    let replacement = funcName + ";";
                                    // = 뒤에 공백이 없는 경우 보정
                                    if (beforeCursor.endsWith('=') && !beforeCursor.endsWith(' = ')) {
                                        replacement = " " + replacement;
                                    }

                                    suggestions.push({
                                        text: replacement,
                                        displayText: `⚡ ${funcName} (정의된 함수)`
                                    });
                                }
                            });

                            if (suggestions.length > 0) {
                                return {
                                    list: suggestions,
                                    from: CodeMirror.Pos(cur.line, cur.ch - curVal.length),
                                    to: cur
                                };
                            }
                        }

                        // (B) DOM 메소드 인자 추천 (getElementById 등)
                        const domMatch = beforeCursor.match(/(getElementById|getElementsByClassName|getElementsByTagName|querySelector|querySelectorAll)\(['"]([^'"]*)$/);
                        if (domMatch) {
                            const method = domMatch[1];
                            const curVal = domMatch[2].toLowerCase();
                            const fullContent = cmInstance.getValue();
                            let suggestions = [];

                            if (method === "getElementById" || method.includes("querySelector")) {
                                const idMatches = fullContent.match(/id=["']([^"']+)["']/g) || [];
                                idMatches.forEach(m => {
                                    const id = m.match(/["']([^"']+)["']/)[1];
                                    const prefix = method.includes("querySelector") ? "#" : "";
                                    if (id.toLowerCase().startsWith(curVal.replace(/^#/, ''))) {
                                        suggestions.push({ text: prefix + id + "')", displayText: `🆔 ${prefix}${id} (ID)` });
                                    }
                                });
                            }
                            
                            if (method === "getElementsByClassName" || method.includes("querySelector")) {
                                const classMatches = fullContent.match(/class=["']([^"']+)["']/g) || [];
                                classMatches.forEach(m => {
                                    const classes = m.match(/["']([^"']+)["']/)[1].split(/\s+/);
                                    classes.forEach(c => {
                                        const prefix = method.includes("querySelector") ? "." : "";
                                        if (c.toLowerCase().startsWith(curVal.replace(/^\./, ''))) {
                                            suggestions.push({ text: prefix + c + "')", displayText: `🎨 ${prefix}${c} (Class)` });
                                        }
                                    });
                                });
                            }

                            if (method === "getElementsByTagName" || method.includes("querySelector")) {
                                for (let tag in this.descriptions) {
                                    if (tag.toLowerCase().startsWith(curVal)) {
                                        suggestions.push({ text: tag + "')", displayText: `🏷️ ${tag} (Tag)` });
                                    }
                                }
                            }

                            if (suggestions.length > 0) {
                                return {
                                    list: suggestions,
                                    from: CodeMirror.Pos(cur.line, cur.ch - curVal.length),
                                    to: cur
                                };
                            }
                        }
                    }

                    // 2. 속성값 모드 확인 (HTML attribute="..." OR CSS property: ...)
                    let attrMatch = null;
                    let isCSSValue = false;

                    if (mode === "css") {
                        // 마지막 세미콜론 이후의 텍스트에서 콜론이 있는지 확인
                        const lastSemicolon = beforeCursor.lastIndexOf(';');
                        const currentSegment = beforeCursor.slice(lastSemicolon + 1);
                        attrMatch = currentSegment.match(/([a-zA-Z0-9-]+):\s*([^;]*)$/);
                        isCSSValue = !!attrMatch;
                    } else {
                        attrMatch = beforeCursor.match(/([a-zA-Z0-9-]+)=["']([^"']*)$/);
                    }
                    
                    if (attrMatch) {
                        const attrName = attrMatch[1];
                        const curValue = attrMatch[2].trim().toLowerCase();
                        const valStart = cur.ch - curValue.length;
                        
                        let suggestions = [];
                        if (this.attributeValues[attrName]) {
                            const values = this.attributeValues[attrName];
                            for (let v in values) {
                                if (v.startsWith(curValue)) {
                                    suggestions.push({
                                        text: v + (isCSSValue ? ";" : '"'),
                                        displayText: `${v} : ${values[v]}`,
                                        hint: (cm, data, completion) => {
                                            cm.replaceRange(completion.text, data.from, data.to);
                                        }
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

                    // 2. 일반 모드 (태그, 속성, CSS 선택자, CSS 속성 등)
                    while (start && /[\w-$]/.test(currentLine.charAt(start - 1))) --start;
                    if (start > 0 && /[\<\.\#]/.test(currentLine.charAt(start - 1))) --start;

                    let curWord = currentLine.slice(start, end).toLowerCase();
                    let matchWord = curWord;
                    if (curWord.startsWith('<')) matchWord = curWord.slice(1);
                    
                    // Mission-Specific "Whisper" Hints
                    let missionHints = [];
                    if (matchWord.length >= 1 && !isAttributeTrigger && !isTagInsideTrigger && !isCssTrigger && !isJsTrigger) {
                        document.querySelectorAll('.mission-card code').forEach(code => {
                            let text = code.innerText.trim();
                            if (text.toLowerCase().includes(matchWord)) {
                                missionHints.push({
                                    text: text,
                                    displayText: `✨ ${text.substring(0, 35)} (미션 힌트)`,
                                    className: 'whisper-hint'
                                });
                            }
                        });
                    }

                    // Mode-Specific Hints
                    let baseHints = { list: [] };
                    if (mode === "css") {
                        baseHints = CodeMirror.hint.css(cmInstance) || { list: [] };
                        // 선택자 위치(중괄호 밖)인 경우 HTML 태그 및 문서 내 클래스/ID 추천
                        const isInsideBraces = /\{[^}]*$/.test(beforeCursor);
                        if (!isInsideBraces) {
                            // 클래스(.) 입력 시 클래스만, 아이디(#) 입력 시 아이디만 추천
                            if (!curWord.startsWith('#')) {
                                for (let tag in this.descriptions) {
                                    if (!baseHints.list.some(h => (typeof h === 'string' ? h : h.text) === tag)) {
                                        baseHints.list.push(tag);
                                    }
                                }
                            }
                            
                            // 2. 문서 내 클래스/ID 스캔 및 추가
                            const fullContent = cmInstance.getValue();
                            const classMatches = fullContent.match(/class=["']([^"']+)["']/g) || [];
                            const idMatches = fullContent.match(/id=["']([^"']+)["']/g) || [];
                            
                            const extractedItems = [];
                            classMatches.forEach(m => {
                                const classes = m.match(/["']([^"']+)["']/)[1].split(/\s+/);
                                classes.forEach(c => extractedItems.push('.' + c));
                            });
                            idMatches.forEach(m => {
                                const id = m.match(/["']([^"']+)["']/)[1];
                                extractedItems.push('#' + id);
                            });

                            extractedItems.forEach(item => {
                                if (!baseHints.list.some(h => (typeof h === 'string' ? h : h.text) === item)) {
                                    baseHints.list.push({
                                        text: item,
                                        displayText: `🎨 ${item} (문서 내 정의됨)`
                                    });
                                }
                            });
                        }
                    } else if (mode === "javascript") {
                        baseHints = CodeMirror.hint.javascript(cmInstance) || { list: [] };
                        
                        // 1. 문서 내 변수/함수 선언 스캔 로직 강화
                        const fullContent = cmInstance.getValue();
                        const varMatches = fullContent.match(/(const|let|var)\s+([a-zA-Z0-9_$]+)/g) || [];
                        const funcMatches = fullContent.match(/function\s+([a-zA-Z0-9_$]+)/g) || [];
                        const assignMatches = fullContent.match(/([a-zA-Z0-9_$]+)\s*=/g) || [];
                        
                        const localVars = new Set();
                        varMatches.forEach(m => localVars.add(m.split(/\s+/).pop()));
                        funcMatches.forEach(m => localVars.add(m.split(/\s+/).pop()));
                        assignMatches.forEach(m => localVars.add(m.replace('=', '').trim()));

                        localVars.forEach(v => {
                            if (v && !baseHints.list.some(h => (typeof h === 'string' ? h : h.text) === v)) {
                                baseHints.list.push({
                                    text: v,
                                    displayText: `📦 ${v} (지역 변수/함수)`
                                });
                            }
                        });

                        // 2. JS 속성 접근 시 (.) 공통 DOM 속성/메소드 추천
                        if (curWord.startsWith('.')) {
                            // (A) .style. 뒤인 경우 CSS 속성들을 camelCase로 추천
                            const textBeforeDot = beforeCursor.slice(0, start).trim();
                            if (textBeforeDot.endsWith('.style')) {
                                const cssProps = Object.keys(this.descriptions).filter(k => 
                                    !k.startsWith('<') && !k.startsWith('.') && !k.startsWith('#') && (k.includes('-') || ["color", "display", "width", "height", "margin", "padding", "border"].includes(k))
                                );
                                cssProps.forEach(p => {
                                    const camelCase = p.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                                    if (!baseHints.list.some(h => (typeof h === 'string' ? h : h.text) === camelCase)) {
                                        baseHints.list.push({
                                            text: "." + camelCase,
                                            displayText: `🎨 ${camelCase} (Style)`,
                                            isStyle: true
                                        });
                                    }
                                });
                            } else {
                                // (B) 일반적인 점(.) 접근인 경우 공통 DOM 속성 추천
                                const domProps = ["innerHTML", "innerText", "style", "value", "onclick", "addEventListener", "remove", "classList", "getAttribute", "setAttribute", "appendChild", "querySelector", "parentElement", "children"];
                                domProps.forEach(p => {
                                    if (!baseHints.list.some(h => (typeof h === 'string' ? h : h.text) === p)) {
                                        baseHints.list.push({
                                            text: "." + p,
                                            displayText: `🔹 ${p} (DOM 속성/메소드)`
                                        });
                                    }
                                });
                            }
                        }
                    } else {
                        baseHints = CodeMirror.hint.html(cmInstance) || { list: [] };
                    }
                    
                    let combined = [...missionHints];
                    if (baseHints && baseHints.list) {
                        baseHints.list.forEach(h => {
                            let text = typeof h === 'string' ? h : h.text;
                            
                            // 자바스크립트 속성 접근 시 점(.)이 사라지는 버그 수정
                            if (mode === "javascript" && curWord.startsWith('.') && !text.startsWith('.')) {
                                text = "." + text;
                            }

                            let cleanTextForLookup = text;
                            if (text.startsWith('<')) cleanTextForLookup = text.slice(1);
                            if (text.startsWith('.')) cleanTextForLookup = text.slice(1);
                            if (cleanTextForLookup.endsWith('>')) cleanTextForLookup = cleanTextForLookup.slice(0, -1);
                            
                            let desc = this.descriptions[cleanTextForLookup];
                            let displayText = desc ? `${text} : ${desc}` : text;

                            if (!combined.some(m => m.text === text)) {
                                combined.push({
                                    text: text,
                                    displayText: displayText,
                                    isStyle: h.isStyle,
                                    hint: (cm, data, completion) => {
                                        let replacement = completion.text;
                                        if (mode === "css") {
                                            const isInsideBraces = /\{[^}]*$/.test(beforeCursor);
                                            const lastAnchor = Math.max(beforeCursor.lastIndexOf(';'), beforeCursor.lastIndexOf('{'));
                                            const currentSegment = beforeCursor.slice(lastAnchor + 1);

                                            if (beforeCursor.trim().endsWith('{') && !beforeCursor.endsWith(' ')) {
                                                replacement = " " + replacement;
                                            }

                                            if (isInsideBraces && !currentSegment.includes(':')) {
                                                replacement += ": ";
                                            }
                                        } else if (mode === "javascript") {
                                            // DOM 메소드 자동 괄호 및 따옴표 삽입
                                            const domMethods = ["getElementById", "getElementsByClassName", "getElementsByTagName", "querySelector", "querySelectorAll"];
                                            if (domMethods.some(m => replacement.endsWith(m))) {
                                                replacement += "('";
                                            }
                                            // 이벤트 핸들러 자동 '=' 삽입
                                            else if (replacement.match(/\.on[a-z]+$/)) {
                                                replacement += " = ";
                                            }
                                            // 스타일 속성 자동 " = '" 삽입
                                            else if (completion.isStyle) {
                                                replacement += " = '";
                                            }
                                        } else if (mode === "html") {
                                            // HTML 속성 자동 =" 삽입
                                            const isInsideTag = /<[a-zA-Z0-9-]+\s+[^>]*$/.test(beforeCursor);
                                            // 태그 시작(<tag)이 아니고 속성 이름인 경우만 삽입
                                            if (isInsideTag && !replacement.startsWith('<') && !replacement.startsWith('/')) {
                                                replacement += '="';
                                            }
                                        }
                                        
                                        cm.replaceRange(replacement, data.from, data.to);
                                        
                                        if (mode === "css" && replacement.endsWith(": ")) {
                                            setTimeout(() => cm.execCommand("autocomplete"), 10);
                                        } else if (mode === "javascript" && (replacement.endsWith("('") || replacement.endsWith(" = ") || replacement.endsWith(" = '"))) {
                                            setTimeout(() => cm.execCommand("autocomplete"), 10);
                                        } else if (mode === "html" && replacement.endsWith('="')) {
                                            setTimeout(() => cm.execCommand("autocomplete"), 10);
                                        }
                                    }
                                });
                            }
                        });
                    }

                    // 3. 자바스크립트 DOM 인자 및 값 추천
                    if (mode === "javascript") {
                        // (1) 메소드 인자 추천 (getElementById 등)
                        const jsMatch = beforeCursor.match(/(getElementById|getElementsByClassName|getElementsByTagName|querySelector|querySelectorAll)\(['"]([^'"]*)$/);
                        // (2) 속성값 대입 추천 (style.color = " 등)
                        const jsValueMatch = beforeCursor.match(/([a-zA-Z0-9_$]+)\.?(style\.)?([a-zA-Z0-9_$]+)\s*=\s*["']([^"']*)$/);

                        if (jsMatch) {
                            const method = jsMatch[1];
                            const curVal = jsMatch[2].toLowerCase();
                            const fullContent = cmInstance.getValue();
                            let suggestions = [];

                            if (method === "getElementById" || method.includes("querySelector")) {
                                const idMatches = fullContent.match(/id=["']([^"']+)["']/g) || [];
                                idMatches.forEach(m => {
                                    const id = m.match(/["']([^"']+)["']/)[1];
                                    const prefix = method.includes("querySelector") ? "#" : "";
                                    if (id.toLowerCase().startsWith(curVal.replace(/^#/, ''))) {
                                        suggestions.push({ text: prefix + id + "')", displayText: `🆔 ${prefix}${id} (ID)` });
                                    }
                                });
                            }
                            
                            if (method === "getElementsByClassName" || method.includes("querySelector")) {
                                const classMatches = fullContent.match(/class=["']([^"']+)["']/g) || [];
                                classMatches.forEach(m => {
                                    const classes = m.match(/["']([^"']+)["']/)[1].split(/\s+/);
                                    classes.forEach(c => {
                                        const prefix = method.includes("querySelector") ? "." : "";
                                        if (c.toLowerCase().startsWith(curVal.replace(/^\./, ''))) {
                                            suggestions.push({ text: prefix + c + "')", displayText: `🎨 ${prefix}${c} (Class)` });
                                        }
                                    });
                                });
                            }

                            if (method === "getElementsByTagName" || method.includes("querySelector")) {
                                for (let tag in this.descriptions) {
                                    if (tag.toLowerCase().startsWith(curVal)) {
                                        suggestions.push({ text: tag + "')", displayText: `🏷️ ${tag} (Tag)` });
                                    }
                                }
                            }

                            if (suggestions.length > 0) {
                                return {
                                    list: suggestions,
                                    from: CodeMirror.Pos(cur.line, cur.ch - curVal.length),
                                    to: cur
                                };
                            }
                        } else if (jsValueMatch) {
                            const prop = jsValueMatch[3]; // color, display 등
                            const curVal = jsValueMatch[4].toLowerCase();
                            let suggestions = [];

                            // 스타일 관련 속성값 추천
                            if (prop === "color" || prop === "backgroundColor" || prop === "borderColor") {
                                const colors = ["red", "blue", "green", "yellow", "black", "white", "gray", "purple", "orange", "pink", "skyblue", "gold", "silver"];
                                colors.forEach(c => {
                                    if (c.startsWith(curVal)) suggestions.push({ text: c + "';", displayText: `🎨 ${c}` });
                                });
                            } else if (prop === "display") {
                                ["block", "none", "flex", "inline-block", "grid"].forEach(v => {
                                    if (v.startsWith(curVal)) suggestions.push({ text: v + "';", displayText: `📦 ${v}` });
                                });
                            } else if (prop === "cursor") {
                                ["pointer", "default", "wait", "move", "not-allowed"].forEach(v => {
                                    if (v.startsWith(curVal)) suggestions.push({ text: v + "';", displayText: `🖱️ ${v}` });
                                });
                            }

                            if (suggestions.length > 0) {
                                return {
                                    list: suggestions,
                                    from: CodeMirror.Pos(cur.line, cur.ch - curVal.length),
                                    to: cur
                                };
                            }
                        }

                        // (3) 이벤트 핸들러 함수 추천 (onclick = , addEventListener 등)
                        const eventHandlerMatch = beforeCursor.match(/on[a-z]+\s*=\s*([a-zA-Z0-9_$]*)$/) || 
                                             beforeCursor.match(/addEventListener\(['"][^'"]+['"]\s*,\s*([a-zA-Z0-9_$]*)$/);
                        if (eventHandlerMatch) {
                            const curVal = eventHandlerMatch[1].toLowerCase();
                            const fullContent = cmInstance.getValue();
                            const funcMatches = fullContent.match(/function\s+([a-zA-Z0-9_$]+)/g) || [];
                            let suggestions = [];

                            funcMatches.forEach(m => {
                                const funcName = m.split(/\s+/)[1];
                                if (funcName.toLowerCase().startsWith(curVal)) {
                                    suggestions.push({
                                        text: funcName + ";",
                                        displayText: `⚡ ${funcName} (정의된 함수)`
                                    });
                                }
                            });

                            if (suggestions.length > 0) {
                                return {
                                    list: suggestions,
                                    from: CodeMirror.Pos(cur.line, cur.ch - curVal.length),
                                    to: cur
                                };
                            }
                        }
                    }

                    let filtered = combined.filter(h => {
                        let text = typeof h === 'string' ? h : h.text;
                        let cleanText = text;
                        if (text.startsWith('<')) cleanText = text.slice(1);
                        
                        // CSS 필터링 강화: . 입력 시 .으로 시작하는 것만, # 입력 시 #으로 시작하는 것만
                        if (mode === "css") {
                            if (curWord.startsWith('.')) return text.startsWith('.');
                            if (curWord.startsWith('#')) return text.startsWith('#');
                        }
                        
                        return cleanText.toLowerCase().includes(matchWord.replace(/^[\.\#]/, ''));
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

