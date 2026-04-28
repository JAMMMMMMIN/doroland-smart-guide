/*
  ============================================================================================================
  [ Credits & License ]
  
  - Project:    도로랜드 정보국 훈련소
  - Creator:    XYLO
  - Powered by: DORO Inc.
  - Version:    1.3.0 (2026.04.29.)
  - Source:     https://github.com/xylito/doroland-smart-guide
  - License:    CC BY-SA 4.0 (상업적 이용 가능 / 동일 조건 변경 허락 / 저작자 표시)
  
  이 저작물은 공공데이터를 활용한 웹 개발 교육용 실습 자료로 제작되었습니다.
  미래의 훌륭한 웹 마스터가 될 여러분을 응원합니다!
  ============================================================================================================
*/
/*
  ============================================================================================================
  [ DORO Smart Guide - Global Element Screenshot Tool ]
  - Shortcut: Cmd + Shift + S
  - Description: Capture any DOM element as an image to clipboard for PPT/Documentation.
  - Features: Parent navigation (ArrowUp), Element Info Tooltip, Iframe support.
  ============================================================================================================
*/

(function() {
    // Prevent multiple initializations
    if (window.DoroScreenshotInitialized) return;
    window.DoroScreenshotInitialized = true;

    // Load html2canvas from CDN
    if (typeof html2canvas === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(script);
    }

    let isSelectionMode = false;
    let hoveredEl = null;
    let overlay = null;
    let tooltip = null;

    function getElementInfo(el) {
        if (!el) return '';
        let info = `<span style="color: #60a5fa; font-weight: bold;">${el.tagName.toLowerCase()}</span>`;
        if (el.id) info += `<span style="color: #f87171;">#${el.id}</span>`;
        if (el.className) {
            const classes = Array.from(el.classList).filter(c => 
                !c.startsWith('') && !c.startsWith('screenshot-') && !c.startsWith('cm-')
            ).join('.');
            if (classes) info += `<span style="color: #34d399;">.${classes}</span>`;
        }
        return info;
    }

    function createOverlay() {
        if (document.getElementById('screenshot-overlay')) return;
        
        // Hide UI in iframes if the parent is also likely running the script
        const isIframe = window !== window.top;
        
        overlay = document.createElement('div');
        overlay.id = 'screenshot-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, ${isIframe ? '0' : '0.15'}); z-index: 2147483640;
            cursor: crosshair; pointer-events: none;
            transition: background 0.3s;
        `;
        
        if (!isIframe) {
            const badge = document.createElement('div');
            badge.id = 'screenshot-badge';
            badge.style.cssText = `
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                background: #1e293b; color: white; padding: 10px 25px;
                border-radius: 30px; font-weight: bold; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                font-size: 14px; z-index: 2147483647; font-family: 'Pretendard Variable', sans-serif;
                border: 2px solid #ff8c42; pointer-events: auto;
                display: flex; align-items: center; gap: 10px;
            `;
            badge.innerHTML = '<span>📸</span> <strong>스크린샷 모드</strong> <span style="margin: 0 10px; color: #64748b;">|</span> 클릭: 복사, ⬆️: 상위 선택, Esc: 취소';
            document.body.appendChild(badge);
        }
        
        tooltip = document.createElement('div');
        tooltip.id = 'screenshot-tooltip';
        tooltip.style.cssText = `
            position: fixed; background: #0f172a; color: white; padding: 6px 12px;
            border-radius: 6px; font-size: 12px; font-family: monospace;
            z-index: 2147483647; pointer-events: none; display: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5); border: 1px solid #475569;
            white-space: nowrap;
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(tooltip);
    }

    function removeOverlay() {
        ['screenshot-overlay', 'screenshot-badge', 'screenshot-tooltip'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
        overlay = null;
        tooltip = null;
        if (hoveredEl) {
            hoveredEl.style.outline = hoveredEl.getAttribute('data-prev-outline') || '';
            hoveredEl.removeAttribute('data-prev-outline');
            hoveredEl = null;
        }
    }

    function highlightElement(el) {
        if (!el || el === document.body || el === document.documentElement) return;
        // Skip highlighting IFRAME elements in parent to avoid double highlight with internal script
        if (el.tagName === 'IFRAME') return;
        if (hoveredEl === el) return;

        if (hoveredEl) {
            hoveredEl.style.outline = hoveredEl.getAttribute('data-prev-outline') || '';
        }
        hoveredEl = el;
        hoveredEl.setAttribute('data-prev-outline', hoveredEl.style.outline || '');
        hoveredEl.style.outline = '3px solid #ff8c42';
        
        // Update Tooltip
        if (tooltip) {
            tooltip.style.display = 'block';
            tooltip.innerHTML = getElementInfo(hoveredEl);
            const rect = hoveredEl.getBoundingClientRect();
            tooltip.style.top = (rect.top - 30 > 10 ? rect.top - 30 : rect.bottom + 10) + 'px';
            tooltip.style.left = rect.left + 'px';
        }
    }

    function toggleSelectionMode(forceState) {
        isSelectionMode = typeof forceState === 'boolean' ? forceState : !isSelectionMode;
        window.DoroScreenshotActive = isSelectionMode; // Global flag for other scripts
        if (isSelectionMode) {
            createOverlay();
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('click', onClick, true);
            window.addEventListener('mouseleave', onWindowLeave); // Fix sticky highlight
            // Notify iframes
            Array.from(document.querySelectorAll('iframe')).forEach(ifr => {
                try { ifr.contentWindow.postMessage({ type: 'DORO_SCREENSHOT_MODE', state: true }, '*'); } catch(e) {}
            });
        } else {
            removeOverlay();
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('click', onClick, true);
            window.removeEventListener('mouseleave', onWindowLeave);
            // Notify iframes
            Array.from(document.querySelectorAll('iframe')).forEach(ifr => {
                try { ifr.contentWindow.postMessage({ type: 'DORO_SCREENSHOT_MODE', state: false }, '*'); } catch(e) {}
            });
        }
    }

    function onWindowLeave() {
        if (hoveredEl) {
            hoveredEl.style.outline = hoveredEl.getAttribute('data-prev-outline') || '';
            hoveredEl.removeAttribute('data-prev-outline');
            hoveredEl = null;
        }
        if (tooltip) tooltip.style.display = 'none';
    }

    function onMouseMove(e) {
        if (!isSelectionMode) return;
        
        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (target && target !== hoveredEl && !target.id?.startsWith('screenshot')) {
            highlightElement(target);
        }
    }

    async function onClick(e) {
        if (!isSelectionMode) return;
        e.preventDefault();
        e.stopPropagation();

        const target = hoveredEl;
        if (!target) return;

        // Visual Feedback
        target.style.outline = '4px solid #22c55e';
        const isIframe = window !== window.top;
        
        if (isIframe) {
            window.parent.postMessage({ type: 'DORO_SCREENSHOT_BUSY' }, '*');
        } else {
            const badge = document.getElementById('screenshot-badge');
            if (badge) badge.innerHTML = '<span>⌛</span> 이미지 생성 중... 잠시만 기다려주세요.';
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            const canvas = await html2canvas(target, {
                backgroundColor: null,
                useCORS: true,
                scale: 3,
                logging: false,
                ignoreElements: (el) => el.id?.startsWith('screenshot')
            });

            canvas.toBlob(async (blob) => {
                try {
                    const data = [new ClipboardItem({ 'image/png': blob })];
                    await navigator.clipboard.write(data);
                    showGlobalToast('✅ 이미지가 클립보드에 복사되었습니다!');
                } catch (err) {
                    console.error('Clipboard write failed:', err);
                    showGlobalToast('❌ 클립보드 복사 실패');
                }
                
                if (isIframe) {
                    window.parent.postMessage({ type: 'DORO_SCREENSHOT_DONE' }, '*');
                }
            });
        } catch (err) {
            console.error('Screenshot failed:', err);
            showGlobalToast('❌ 이미지 생성 실패');
            if (isIframe) {
                window.parent.postMessage({ type: 'DORO_SCREENSHOT_DONE' }, '*');
            }
        }

        toggleSelectionMode(false);
    }

    function showGlobalToast(msg) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
            background: #1e293b; color: white; padding: 15px 30px;
            border-radius: 40px; z-index: 2147483647; font-weight: bold;
            box-shadow: 0 4px 25px rgba(0,0,0,0.4); border: 2px solid #ff8c42;
            font-family: sans-serif; pointer-events: none;
            opacity: 1; transition: opacity 0.5s ease-out;
        `;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3500);
    }

    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            toggleSelectionMode();
        } else if (isSelectionMode) {
            if (e.key === 'Escape') {
                toggleSelectionMode(false);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (hoveredEl && hoveredEl.parentElement && hoveredEl.parentElement !== document.documentElement && hoveredEl.parentElement !== document.body) {
                    highlightElement(hoveredEl.parentElement);
                }
            }
        }
    });

    window.addEventListener('message', (e) => {
        if (e.data.type === 'DORO_SCREENSHOT_MODE') {
            toggleSelectionMode(e.data.state);
        } else if (e.data.type === 'DORO_SCREENSHOT_BUSY') {
            const badge = document.getElementById('screenshot-badge');
            if (badge) badge.innerHTML = '<span>⌛</span> 이미지 생성 중... 잠시만 기다려주세요.';
        } else if (e.data.type === 'DORO_SCREENSHOT_DONE') {
            toggleSelectionMode(false);
        }
    });
})();
