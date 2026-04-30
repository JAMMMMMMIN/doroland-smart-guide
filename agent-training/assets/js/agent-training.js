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
// Theme Toggle
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('doroland-theme', next);
    updateToggleUI(next);
    if (window.cmEditor) {
        window.cmEditor.setOption("theme", next === 'dark' ? 'tokyo-night' : 'default');
    }
}

function updateToggleUI(theme) {
    const icon = document.querySelector('.toggle-icon');
    const label = document.querySelector('.toggle-label');
    if (!icon || !label) return;
    if (theme === 'light') {
        icon.textContent = '🌙';
        label.textContent = '야간 모드';
    } else {
        icon.textContent = '☀️';
        label.textContent = '주간 모드';
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

document.addEventListener('DOMContentLoaded', () => {
    const editorElement = document.getElementById('html-editor');
    const preview = document.getElementById('preview-frame');

    if (editorElement) {
        window.cmEditor = CodeMirror.fromTextArea(editorElement, {
            mode: "htmlmixed",
            theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'tokyo-night' : 'default',
            lineNumbers: true,
            lineWrapping: true,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            smartIndent: true,
            matchBrackets: true,
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Enter": "newlineAndIndent"
            },
            autoCloseTags: true,
            autoCloseBrackets: true
        });

        // Codewhisper (스마트 자동완성) 초기화
        if (window.Codewhisper) {
            window.Codewhisper.init(window.cmEditor);
        }

        // 1. 코드 저장 및 불러오기 (localStorage)
        const storageKey = `doroland-code-${window.location.pathname}`;
        const savedCode = localStorage.getItem(storageKey);

        if (savedCode) {
            window.cmEditor.setValue(savedCode);
        } else if (window.agentInitialCode) {
            window.cmEditor.setValue(window.agentInitialCode);
        }

        // 수동 초기화 함수
        window.resetCode = function() {
            if (confirm("작성 중인 코드를 초기화하고 처음 상태로 되돌리겠습니까?")) {
                localStorage.removeItem(storageKey);
                if (window.agentInitialCode) {
                    window.cmEditor.setValue(window.agentInitialCode);
                }
            }
        };

        // 코드 다운로드 함수
        window.downloadCode = function() {
            const code = window.cmEditor.getValue();
            const blob = new Blob([code], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            
            // 파일명 생성 (페이지명 기반)
            const pageName = window.location.pathname.split('/').pop().replace('.html', '');
            a.href = url;
            a.download = `doroland_${pageName}_result.html`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        // 변경 시 자동 저장 (디바운스 처리) 및 붙여넣기 자동 들여쓰기
        let saveTimeout;
        window.cmEditor.on("change", (instance, changeObj) => {
            // 붙여넣기 시 자동 들여쓰기 처리 (다중행 대응)
            if (changeObj.origin === "paste") {
                const from = changeObj.from.line;
                const to = changeObj.from.line + changeObj.text.length;
                for (let i = from; i < to; i++) {
                    instance.indentLine(i, "smart");
                }
            }

            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                localStorage.setItem(storageKey, window.cmEditor.getValue());
            }, 1000);
            updatePreview();
        });

        function updatePreview() {
            const lines = window.cmEditor.getValue().split('\n');
            let modifiedHtmlLines = lines.map((line, idx) => {
                return line.replace(/<([a-zA-Z0-9\-]+)(?![^>]*\bdata-source-line\b)([^>]*)>/g, '<$1 data-source-line="' + idx + '"$2>');
            });
            let htmlContent = modifiedHtmlLines.join('\n');
            
            // Heuristic Parsing for CSS and JS mappings
            let cssMap = {};
            let jsMap = {};
            let jsVarMap = {};
            let lineTypes = {};
            let inStyle = false;
            let inScript = false;
            
            lines.forEach((line, idx) => {
                let text = line.trim();
                lineTypes[idx] = 'html';
                if (text.startsWith('<style>')) inStyle = true;
                else if (text.startsWith('</style>')) inStyle = false;
                else if (text.startsWith('<script>')) inScript = true;
                else if (text.startsWith('</script>')) inScript = false;
                else {
                    if (inStyle) {
                        lineTypes[idx] = 'css';
                        let match = line.match(/^([^{]+)\s*\{/);
                        if (match) {
                            let selectors = match[1].split(',').map(s => s.trim()).filter(s => s);
                            selectors.forEach(sel => {
                                let cleanSel = sel.replace(/:[a-zA-Z-]+/g, ''); 
                                if (cleanSel && !cleanSel.includes('@')) {
                                    if (!cssMap[cleanSel]) cssMap[cleanSel] = [];
                                    cssMap[cleanSel].push(idx);
                                }
                            });
                        }
                    }
                    if (inScript) {
                        lineTypes[idx] = 'js';
                        
                        // 1. Detect variable assignment
                        let assignMatch = line.match(/(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*document\.(getElementById|querySelector(?:All)?)\(['"]([^'"]+)['"]\)/);
                        if (assignMatch) {
                            let varName = assignMatch[1];
                            let method = assignMatch[2];
                            let query = assignMatch[3];
                            let sel = method === 'getElementById' ? '#' + query : query;
                            
                            if (!jsMap[sel]) jsMap[sel] = [];
                            jsMap[sel].push(idx);
                            jsVarMap[varName] = sel;
                        } else {
                            // 2. Normal queries
                            let idMatch = line.match(/getElementById\(['"]([^'"]+)['"]\)/);
                            if (idMatch) {
                                let sel = '#' + idMatch[1];
                                if (!jsMap[sel]) jsMap[sel] = [];
                                jsMap[sel].push(idx);
                            }
                            let qMatch = line.match(/querySelector(?:All)?\(['"]([^'"]+)['"]\)/);
                            if (qMatch) {
                                let sel = qMatch[1];
                                if (!jsMap[sel]) jsMap[sel] = [];
                                jsMap[sel].push(idx);
                            }
                        }
                        
                        // 3. Track variable usage
                        for (let varName in jsVarMap) {
                            let regex = new RegExp("\\b" + varName + "\\b");
                            if (regex.test(line)) {
                                let sel = jsVarMap[varName];
                                if (!jsMap[sel]) jsMap[sel] = [];
                                if (!jsMap[sel].includes(idx)) jsMap[sel].push(idx);
                            }
                        }
                    }
                }
            });
            window.__lineTypesMap = lineTypes;

            const customStyles = window.agentCustomStyles || '';
            
            // Inject our Inspector script
            const inspectorScript = `
<script>
    const cssMap = ${JSON.stringify(cssMap)};
    const jsMap = ${JSON.stringify(jsMap)};
    const lineTypes = ${JSON.stringify(lineTypes)};
    
    function getColorForType(type) {
        if (type === 'css') return { border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.2)' };
        if (type === 'js') return { border: '#eab308', bg: 'rgba(234, 179, 8, 0.2)' };
        return { border: '#f97316', bg: 'rgba(249, 115, 22, 0.2)' };
    }
    
    document.addEventListener('mouseover', function(e) {
        if (window.DoroScreenshotActive) return; // Disable inspector during screenshot mode
        let target = e.target;
        while (target && target.nodeType === 1) {
            let linesData = [];
            
            if (target.hasAttribute('data-source-line')) {
                let l = parseInt(target.getAttribute('data-source-line'));
                linesData.push({ line: l, type: 'html' });
            }
            
            for (let sel in cssMap) {
                try { if (target.matches(sel)) cssMap[sel].forEach(l => linesData.push({ line: l, type: 'css' })); } catch(err) {} 
            }
            
            for (let sel in jsMap) {
                try { if (target.matches(sel)) jsMap[sel].forEach(l => linesData.push({ line: l, type: 'js' })); } catch(err) {}
            }
            
            if (linesData.length > 0) {
                let uniqueLines = {};
                linesData.forEach(d => { uniqueLines[d.line] = d.type; });
                let payloadLines = Object.keys(uniqueLines).map(k => ({ line: parseInt(k), type: uniqueLines[k] }));
                
                window.parent.postMessage({ type: 'hover-lines', lines: payloadLines }, '*');
                
                let oldOutline = target.style.outline;
                let oldBg = target.style.backgroundColor;
                target.setAttribute('data-old-outline', oldOutline || '');
                target.setAttribute('data-old-bg', oldBg || '');
                
                let color = getColorForType('html');
                target.style.outline = '2px solid ' + color.border;
                if (target.tagName !== 'BODY' && target.tagName !== 'HTML') {
                    target.style.backgroundColor = color.bg;
                }
                
                target.addEventListener('mouseout', function onMouseOut() {
                    target.style.outline = target.getAttribute('data-old-outline');
                    target.style.backgroundColor = target.getAttribute('data-old-bg');
                    window.parent.postMessage({ type: 'unhover-lines', lines: payloadLines }, '*');
                    target.removeEventListener('mouseout', onMouseOut);
                }, { once: true });
                
                e.stopPropagation();
                break;
            }
            target = target.parentElement;
        }
    });
    
    window.addEventListener('message', function(e) {
        if (window.DoroScreenshotActive) return; // Disable inspector logic during screenshot mode
        if (e.data.type === 'highlight-element') {
            const line = e.data.line;
            const lineType = e.data.agentType || 'html';
            let elsToHighlight = Array.from(document.querySelectorAll('[data-source-line="' + line + '"]'));
            
            for (let sel in cssMap) {
                if (cssMap[sel].includes(line)) {
                    try { elsToHighlight = elsToHighlight.concat(Array.from(document.querySelectorAll(sel))); } catch(err) {}
                }
            }
            for (let sel in jsMap) {
                if (jsMap[sel].includes(line)) {
                    try { elsToHighlight = elsToHighlight.concat(Array.from(document.querySelectorAll(sel))); } catch(err) {}
                }
            }
            
            elsToHighlight = [...new Set(elsToHighlight)];
            window.__highlightedElements = window.__highlightedElements || {};
            window.__highlightedElements[line] = [];
            
            let color = getColorForType(lineType);
            
            elsToHighlight.forEach(el => {
                let oldOutline = el.style.outline;
                let oldBg = el.style.backgroundColor;
                el.setAttribute('data-parent-old-outline', oldOutline || '');
                el.setAttribute('data-parent-old-bg', oldBg || '');
                
                el.style.outline = '3px solid ' + color.border;
                if (el.tagName !== 'BODY' && el.tagName !== 'HTML') {
                    el.style.backgroundColor = color.bg;
                }
                
                window.__highlightedElements[line].push(el);
            });
            
            if (elsToHighlight.length > 0) {
                elsToHighlight[0].scrollIntoView({ behavior: "smooth", block: "nearest" });
                window.parent.postMessage({ type: 'element-found', line: line, agentType: lineType }, '*');
            }
            
        } else if (e.data.type === 'unhighlight-element') {
            const line = e.data.line;
            if (window.__highlightedElements && window.__highlightedElements[line]) {
                window.__highlightedElements[line].forEach(el => {
                    el.style.outline = el.getAttribute('data-parent-old-outline');
                    el.style.backgroundColor = el.getAttribute('data-parent-old-bg');
                });
                delete window.__highlightedElements[line];
            }
        }
    });
</script>
`;
            
            let finalHtml = htmlContent;
            const screenshotScript = '<script src="../assets/js/global-screenshot.js"></script>';
            const injection = customStyles + '\n' + inspectorScript + '\n' + screenshotScript;
            
            if (finalHtml.includes('</head>')) {
                finalHtml = finalHtml.replace('</head>', injection + '\n</head>');
            } else {
                finalHtml = injection + '\n' + finalHtml;
            }

            if (preview) {
                preview.srcdoc = finalHtml;
            }
        }

        window.cmEditor.on('change', updatePreview);
        updatePreview();

        // ------------------ DOM Inspector Bidirectional Logic ------------------ //
        window.addEventListener('message', function(e) {
            if (!window.cmEditor) return;
            if (e.data.type === 'hover-line') {
                const lineNum = parseInt(e.data.line);
                window.cmEditor.addLineClass(lineNum, 'background', 'cm-highlight-html');
            } else if (e.data.type === 'unhover-line') {
                const lineNum = parseInt(e.data.line);
                window.cmEditor.removeLineClass(lineNum, 'background', 'cm-highlight-html');
            } else if (e.data.type === 'hover-lines') {
                e.data.lines.forEach(data => {
                    window.cmEditor.addLineClass(data.line, 'background', 'cm-highlight-' + data.type);
                });
            } else if (e.data.type === 'unhover-lines') {
                e.data.lines.forEach(data => {
                    window.cmEditor.removeLineClass(data.line, 'background', 'cm-highlight-' + data.type);
                });
            } else if (e.data.type === 'element-found') {
                const lineNum = parseInt(e.data.line);
                window.cmEditor.addLineClass(lineNum, 'background', 'cm-highlight-' + e.data.agentType);
            }
        });

        let lastHoveredLine = -1;
        window.cmEditor.getWrapperElement().addEventListener('mousemove', function(e) {
            const coords = window.cmEditor.coordsChar({left: e.clientX, top: e.clientY});
            const line = coords.line;
            if (line !== lastHoveredLine) {
                if (lastHoveredLine !== -1) {
                    if (preview && preview.contentWindow) preview.contentWindow.postMessage({ type: 'unhighlight-element', line: lastHoveredLine }, '*');
                    let lastType = window.__lineTypesMap && window.__lineTypesMap[lastHoveredLine] ? window.__lineTypesMap[lastHoveredLine] : 'html';
                    window.cmEditor.removeLineClass(lastHoveredLine, 'background', 'cm-highlight-' + lastType);
                }
                if (preview && preview.contentWindow) {
                    let type = window.__lineTypesMap && window.__lineTypesMap[line] ? window.__lineTypesMap[line] : 'html';
                    preview.contentWindow.postMessage({ type: 'highlight-element', line: line, agentType: type }, '*');
                }
                lastHoveredLine = line;
            }
        });

        window.cmEditor.getWrapperElement().addEventListener('mouseleave', function() {
            if (lastHoveredLine !== -1) {
                if (preview && preview.contentWindow) preview.contentWindow.postMessage({ type: 'unhighlight-element', line: lastHoveredLine }, '*');
                let lastType = window.__lineTypesMap && window.__lineTypesMap[lastHoveredLine] ? window.__lineTypesMap[lastHoveredLine] : 'html';
                window.cmEditor.removeLineClass(lastHoveredLine, 'background', 'cm-highlight-' + lastType);
                lastHoveredLine = -1;
            }
        });
        // ----------------------------------------------------------------------- //
    }

    // Copy Button Logic
    document.querySelectorAll('.mission-card code').forEach(codeBlock => {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        
        codeBlock.parentNode.insertBefore(wrapper, codeBlock);
        wrapper.appendChild(codeBlock);
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '📋';
        copyBtn.title = '코드 복사';
        
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(codeBlock.innerText).then(() => {
                copyBtn.innerHTML = '✅';
                setTimeout(() => {
                    copyBtn.innerHTML = '📋';
                }, 2000);
            });
        });
        
        wrapper.appendChild(copyBtn);
    });

    // Dictionary Content Loading Logic
    const dictBox = document.querySelector('.dictionary-box');
    if (dictBox) {
        const dictFile = dictBox.getAttribute('data-dict-file');
        const dictContent = document.getElementById('dictionary-content');
        


        if (dictFile && dictContent) {
            fetch(`./assets/data/${dictFile}.html`)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.text();
                })
                .then(html => {
                    dictContent.innerHTML = html;
                    if (window.Codewhisper) window.Codewhisper.updateFromHTML(html);
                })
                .catch(error => {
                    console.warn('External dictionary load failed, using dump fallback:', error);
                    
                    // 덤프 자료(Fallback) 사용 로직
                    const type = dictFile.split('-')[1]; // html, css, js 추출
                    const fallbackHtml = (window.CodewhisperDump && window.CodewhisperDump[type]) 
                                        ? `<ul>${window.CodewhisperDump[type]}</ul>`
                                        : null;

                    if (fallbackHtml) {
                        dictContent.innerHTML = fallbackHtml + '<p style="color: #6366f1; font-size: 0.8rem; margin-top: 10px;">ℹ️ 오프라인 모드: 덤프 자료가 로드되었습니다.</p>';
                        if (window.Codewhisper) {
                            window.Codewhisper.updateFromHTML(fallbackHtml);
                            // CSS 요원 페이지라면 HTML 태그 덤프도 추가로 불러오기 (선택자 힌트용)
                            if (type === 'css' && window.CodewhisperDump.html) {
                                window.Codewhisper.updateFromHTML(`<ul>${window.CodewhisperDump.html}</ul>`);
                            }
                        }
                    } else {
                        let errorMsg = '백과사전 내용을 불러오는 데 실패했습니다.';
                        if (window.location.protocol === 'file:') {
                            errorMsg += '<br><small>(로컬 파일 보안 정책 때문입니다. 라이브 서버를 사용하시거나 덤프 파일을 확인해 주세요.)</small>';
                        }
                        dictContent.innerHTML = `<p style="color: #ef4444; font-size: 0.9rem;">${errorMsg}</p>`;
                    }
                });
        }

        // CSS/JS 페이지라도 HTML 태그 힌트를 위해 HTML 사전을 추가로 로드
        if (dictFile && dictFile !== 'dict-html') {
            fetch(`./assets/data/dict-html.html`)
                .then(r => r.ok ? r.text() : null)
                .then(html => {
                    if (html && window.Codewhisper) window.Codewhisper.updateFromHTML(html);
                })
                .catch(() => {
                    if (window.Codewhisper && window.CodewhisperDump && window.CodewhisperDump.html) {
                        window.Codewhisper.updateFromHTML(`<ul>${window.CodewhisperDump.html}</ul>`);
                    }
                });
        }
        // JS 페이지라면 CSS 사전도 로드 (.style. 힌트용)
        if (dictFile === 'dict-js') {
            fetch(`./assets/data/dict-css.html`)
                .then(r => r.ok ? r.text() : null)
                .then(html => {
                    if (html && window.Codewhisper) window.Codewhisper.updateFromHTML(html);
                })
                .catch(() => {
                    if (window.Codewhisper && window.CodewhisperDump && window.CodewhisperDump.css) {
                        window.Codewhisper.updateFromHTML(`<ul>${window.CodewhisperDump.css}</ul>`);
                    }
                });
        }
    }
});
