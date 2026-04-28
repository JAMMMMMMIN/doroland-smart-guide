/*
  ============================================================================================================
  [ Credits & License ]
  
  - Project:   도로랜드 스마트 안내 시스템 (Doroland Smart Guide)
  - Creator:   XYLO (@xylito) & DORO Inc.
  - Version:   1.1.2 (2026.04.28.)
  - Source:    https://github.com/xylito/doroland-smart-guide
  - License:   CC BY-SA 4.0 (상업적 이용 가능 / 동일 조건 변경 허락 / 저작자 표시)
  
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
            indentUnit: 4
        });

        if (window.agentInitialCode) {
            window.cmEditor.setValue(window.agentInitialCode);
        }

        function updatePreview() {
            const htmlContent = window.cmEditor.getValue();
            const customStyles = window.agentCustomStyles || '';
            let finalHtml = htmlContent;
            
            if (customStyles) {
                if (finalHtml.includes('</head>')) {
                    finalHtml = finalHtml.replace('</head>', customStyles + '\n</head>');
                } else {
                    finalHtml = customStyles + '\n' + finalHtml;
                }
            }

            if (preview) {
                preview.srcdoc = finalHtml;
            }
        }

        window.cmEditor.on('change', updatePreview);
        updatePreview();
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

    // Color Picker Logic (CSS 요원용)
    const colorPicker = document.getElementById('color-picker');
    const hexValue = document.getElementById('hex-value');

    if (colorPicker && hexValue) {
        colorPicker.addEventListener('input', (e) => {
            const newColor = e.target.value;
            hexValue.textContent = newColor;
            document.documentElement.style.setProperty('--primary', newColor);
        });
    }
});
