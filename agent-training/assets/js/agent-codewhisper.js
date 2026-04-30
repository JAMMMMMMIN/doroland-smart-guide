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

    updateFromHTML: function(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const items = doc.querySelectorAll('li');
        
        items.forEach(item => {
            const code = item.querySelector('code');
            const bold = item.querySelector('b');
            if (code && bold) {
                let rawKey = code.textContent.trim();
                const valMatch = rawKey.match(/([a-zA-Z0-9-]+)=["']?([^"']+)["']?/);
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
                    let key = rawKey.replace(/[<>/]/g, '').trim();
                    if (!this.descriptions[key]) {
                        this.descriptions[key] = bold.textContent.trim();
                    }
                }
            }
        });
    },

    init: function(editor) {
        if (!editor) return;

        editor.on("inputRead", (cm, change) => {
            const line = cm.getLine(change.from.line);
            const textBefore = line.slice(0, change.from.ch + (change.text[0].length));
            const modeAtCursor = cm.getModeAt(change.from).name;
            
            const char = change.text[0];
            const isWord = /[\w-$]/.test(char);
            const isTagStart = char === "<";
            const isAttributeTrigger = char === " " && /<[a-zA-Z0-9-]+(\s+[a-zA-Z0-9-]+(="[^"]*")?)*\s+$/.test(textBefore);
            const isTagInsideTrigger = char === " " && /<[a-zA-Z0-9-]+$/.test(textBefore);
            const isValueTrigger = char === "\"" || char === "'";
            const isCssTrigger = (modeAtCursor === "css") && (char === ":" || (char === " " && /[:]\s*$/.test(textBefore)));
            const isSelectorTrigger = (modeAtCursor === "css") && /[\.\#]/.test(char);
            const isJsTrigger = (modeAtCursor === "javascript") && /[\.\=]/.test(char);

            if (change.origin !== "+input" || (!isWord && !isTagStart && !isAttributeTrigger && !isTagInsideTrigger && !isValueTrigger && !isCssTrigger && !isSelectorTrigger && !isJsTrigger)) {
                // CSS에서 ; 뒤에 바로 } 를 입력하면 공백 추가 (예: color: red; } )
                if (char === "}" && modeAtCursor === "css") {
                    const cur = cm.getCursor();
                    const prevChar = cm.getRange({line: cur.line, ch: cur.ch - 2}, {line: cur.line, ch: cur.ch - 1});
                    if (prevChar === ";") {
                        cm.replaceRange(" }", {line: cur.line, ch: cur.ch - 1}, cur);
                    }
                }
                return;
            }
            
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
                    
                    // 1. 속성값 모드 확인 (HTML attribute="..." OR CSS property: ...)
                    let attrMatch = null;
                    let isCSSValue = false;

                    if (mode === "css") {
                        const lastSemicolon = beforeCursor.lastIndexOf(';');
                        const lastBrace = beforeCursor.lastIndexOf('{');
                        const lastAnchor = Math.max(lastSemicolon, lastBrace);
                        const currentSegment = beforeCursor.slice(lastAnchor + 1);
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

                        // 색상 관련 속성인 경우 컬러피커 힌트 추가
                        const colorProps = ["background-color", "color", "border-color", "outline-color", "box-shadow"];
                        if (colorProps.includes(attrName)) {
                            suggestions.push({
                                text: "", 
                                displayText: "🎨 색상 선택기 실행...",
                                hint: (cm, data, completion) => {
                                    const colorPicker = document.getElementById('color-picker');
                                    if (colorPicker) {
                                        const onSelect = (e) => {
                                            const selectedColor = e.target.value;
                                            const line = cm.getLine(data.from.line);
                                            const charBefore = line.charAt(data.from.ch - 1);
                                            
                                            // 콜론 뒤에 공백이 없으면 자동으로 한 칸 띄우기
                                            let prefix = "";
                                            if (charBefore === ":" && !line.slice(0, data.from.ch).endsWith(": ")) {
                                                prefix = " ";
                                            }

                                            cm.replaceRange(prefix + selectedColor + ";", data.from, data.to);
                                            colorPicker.removeEventListener('change', onSelect);
                                        };
                                        colorPicker.addEventListener('change', onSelect);
                                        colorPicker.click();
                                    }
                                }
                            });
                        }

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

                    // Mode-Specific Base Hints
                    let baseHints = { list: [] };
                    if (mode === "css") {
                        baseHints = CodeMirror.hint.css(cmInstance) || { list: [] };
                        const isInsideBraces = /\{[^}]*$/.test(beforeCursor);
                        if (!isInsideBraces) {
                            if (!curWord.startsWith('#')) {
                                for (let tag in this.descriptions) {
                                    if (!baseHints.list.some(h => (typeof h === 'string' ? h : h.text) === tag)) {
                                        baseHints.list.push(tag);
                                    }
                                }
                            }
                            const fullContent = cmInstance.getValue();
                            const classMatches = fullContent.match(/class=["']([^"']+)["']/g) || [];
                            const idMatches = fullContent.match(/id=["']([^"']+)["']/g) || [];
                            classMatches.forEach(m => {
                                const classes = m.match(/["']([^"']+)["']/)[1].split(/\s+/);
                                classes.forEach(c => {
                                    if (!baseHints.list.some(h => (typeof h === 'string' ? h : h.text) === '.' + c)) {
                                        baseHints.list.push({ text: '.' + c, displayText: `🎨 .${c} (문서 내 정의됨)` });
                                    }
                                });
                            });
                            idMatches.forEach(m => {
                                const id = m.match(/["']([^"']+)["']/)[1];
                                if (!baseHints.list.some(h => (typeof h === 'string' ? h : h.text) === '#' + id)) {
                                    baseHints.list.push({ text: '#' + id, displayText: `🆔 #${id} (문서 내 정의됨)` });
                                }
                            });
                        }
                    } else if (mode === "javascript") {
                        baseHints = CodeMirror.hint.javascript(cmInstance) || { list: [] };
                        const fullContent = cmInstance.getValue();
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
                        
                        if (curWord.startsWith('.')) {
                            const textBeforeDot = beforeCursor.slice(0, start).trim();
                            if (textBeforeDot.endsWith('.style')) {
                                Object.keys(this.descriptions).forEach(p => {
                                    if (p.includes('-') || ["color", "display", "width", "height"].includes(p)) {
                                        const camelCase = p.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                                        if (!baseHints.list.some(h => (typeof h === 'string' ? h : h.text) === camelCase)) {
                                            baseHints.list.push({ text: "." + camelCase, displayText: `🎨 ${camelCase} (Style)`, isStyle: true });
                                        }
                                    }
                                });
                            }
                        }
                    } else {
                        baseHints = CodeMirror.hint.html(cmInstance) || { list: [] };
                    }

                    // 3. 모든 힌트 통합 및 스마트 포맷팅 적용
                    let combined = [];
                    const processHint = (h) => {
                        let text = typeof h === 'string' ? h : h.text;
                        if (mode === "javascript" && curWord.startsWith('.') && !text.startsWith('.')) text = "." + text;
                        let cleanKey = text.replace(/[<>\.#]/g, '');
                        let desc = this.descriptions[cleanKey];
                        let displayText = (typeof h !== 'string' && h.displayText) ? h.displayText : (desc ? `${text} : ${desc}` : text);
                        return { text: text, displayText: displayText, isStyle: h.isStyle, originalHint: h.hint };
                    };

                    missionHints.forEach(h => combined.push(processHint(h)));
                    baseHints.list.forEach(h => {
                        let processed = processHint(h);
                        if (!combined.some(m => m.text === processed.text)) combined.push(processed);
                    });

                    combined.forEach(item => {
                        item.hint = (cm, data, completion) => {
                            let replacement = completion.text;
                            const lineBefore = cm.getLine(data.from.line).slice(0, data.from.ch);
                            const fullBefore = cm.getRange({line: 0, ch: 0}, data.from);
                            
                            if (mode === "css") {
                                const isInsideBraces = /\{[^}]*$/.test(fullBefore);
                                // 현재 라인 혹은 이전 세그먼트에 이미 콜론이 있는지 확인
                                const lastAnchor = Math.max(fullBefore.lastIndexOf(';'), fullBefore.lastIndexOf('{'), fullBefore.lastIndexOf('\n'));
                                const currentSegment = fullBefore.slice(lastAnchor + 1) + lineBefore;
                                
                                // 속성 이름으로 판단되는 경우 (콜론이 없고, 선택자가 아닌 경우)
                                const isPropertyName = !replacement.includes(':') && !replacement.includes('{') && !replacement.includes('}');
                                if (isInsideBraces && isPropertyName && !currentSegment.includes(':')) {
                                    replacement += ": ";
                                }
                            } else if (mode === "javascript") {
                                const domMethods = ["getElementById", "getElementsByClassName", "getElementsByTagName", "querySelector", "querySelectorAll"];
                                if (domMethods.some(m => replacement.endsWith(m))) replacement += "('";
                                else if (replacement.match(/\.on[a-z]+$/)) replacement += " = ";
                                else if (completion.isStyle) replacement += " = '";
                            } else if (mode === "html") {
                                const isInsideTag = /<[a-zA-Z0-9-]+\s+[^>]*$/.test(beforeCursor);
                                if (isInsideTag && !replacement.startsWith('<') && !replacement.startsWith('/')) replacement += '="';
                            }

                            if (completion.originalHint) completion.originalHint(cm, data, completion);
                            else cm.replaceRange(replacement, data.from, data.to);

                            // 연쇄 자동 완성
                            if (replacement.endsWith(": ") || replacement.endsWith('="') || replacement.endsWith("('") || replacement.endsWith(" = ")) {
                                setTimeout(() => cm.execCommand("autocomplete"), 10);
                            }
                        };
                    });

                    let filtered = combined.filter(h => {
                        let text = h.text.toLowerCase();
                        if (mode === "css") {
                            if (curWord.startsWith('.')) return text.startsWith('.');
                            if (curWord.startsWith('#')) return text.startsWith('#');
                        }
                        return text.replace(/^[<>\.#]/, '').includes(matchWord.replace(/^[<>\.#]/, ''));
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
