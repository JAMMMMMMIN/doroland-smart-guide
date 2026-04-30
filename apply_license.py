import os
import re

# ==========================================
# [1] 라이선스 설정 정보
# ==========================================
INFO = {
    "PROJECT_FINAL": "도로랜드 스마트 안내 시스템",
    "PROJECT_TRAINING": "도로랜드 정보국 훈련소",
    "CREATOR": "XYLO",
    "HANDLE": "@xylito",
    "POWERED_BY": "DORO Inc.",
    "VERSION": "1.4.2",
    "DATE": "2026.04.30.",
    "YEAR": "2026",
    "SOURCE": "https://github.com/xylito/doroland-smart-guide",
    "LICENSE": "CC BY-SA 4.0 (상업적 이용 가능 / 동일 조건 변경 허락 / 저작자 표시)",
    "GITHUB": "github.com/xylito"
}

# 확장자별 주석 스타일 정의
STYLES = {
    ".html": {"start": "<!--", "end": "-->"},
    ".css":  {"start": "/*",  "end": "*/"},
    ".js":   {"start": "/*",  "end": "*/"}
}

def get_content(is_final_mission=False):
    """파일 경로에 따라 동적으로 라이선스 본문을 생성합니다."""
    creator = INFO['CREATOR'] + ' & You' if is_final_mission else INFO['CREATOR']
    project = INFO['PROJECT_FINAL'] if is_final_mission else INFO['PROJECT_TRAINING']
    return f"""
  ============================================================================================================
  [ Credits & License ]
  
  - Project:    {project}
  - Creator:    {creator}
  - Powered by: {INFO['POWERED_BY']}
  - Version:    {INFO['VERSION']} ({INFO['DATE']})
  - Source:     {INFO['SOURCE']}
  - License:    {INFO['LICENSE']}
  
  이 저작물은 공공데이터를 활용한 웹 개발 교육용 실습 자료로 제작되었습니다.
  미래의 훌륭한 웹 마스터가 될 여러분을 응원합니다!
  ============================================================================================================
"""

def get_html_footer(is_final_mission=False):
    """HTML 파일의 하단 푸터(ui-footer)를 동적으로 생성합니다."""
    creator = INFO['CREATOR'] + ' & You' if is_final_mission else INFO['CREATOR']
    project = INFO['PROJECT_FINAL'] if is_final_mission else INFO['PROJECT_TRAINING']
    license_short = INFO['LICENSE'].split(' (')[0].strip()
    
    return f"""    <footer class="ui-footer">
        &copy; {INFO['YEAR']} {creator} | {project} {INFO['VERSION']} | Powered by {INFO['POWERED_BY']} | License: {license_short} | 
        <a href="https://{INFO['GITHUB']}" target="_blank" rel="noopener noreferrer">{INFO['GITHUB']}</a>
    </footer>"""

def update_license_file():
    """루트의 LICENSE 파일 내용을 업데이트합니다."""
    filepath = "LICENSE"
    if not os.path.exists(filepath):
        return
        
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 버전 정보 업데이트 (Version x.x.x (yyyy.mm.dd.))
        content = re.sub(r"Version \d+\.\d+\.\d+ \(.*?\)", f"Version {INFO['VERSION']} ({INFO['DATE']})", content)
        
        # 카피라이트 정보 업데이트 (Copyright (c) yyyy ...)
        content = re.sub(r"Copyright \(c\) \d{4} .*? & .*?(\n|$)", f"Copyright (c) {INFO['YEAR']} {INFO['CREATOR']} ({INFO['HANDLE']})\n", content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"📄 LICENSE 파일 업데이트 완료")
    except Exception as e:
        print(f"❌ LICENSE 업데이트 중 오류: {e}")

def update_readme_file():
    """README.md 파일의 제목 옆에 버전 정보를 업데이트합니다."""
    filepath = "README.md"
    if not os.path.exists(filepath):
        return
        
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 제목 옆의 버전 정보 업데이트 (# 제목 Version x.x.x (yyyy.mm.dd.))
        version_str = f"Version {INFO['VERSION']} ({INFO['DATE']})"
        
        # 기존 버전 패턴이 있으면 교체, 없으면 제목 뒤에 추가
        if "Version" in content.split('\n')[0]:
            content = re.sub(r"Version \d+\.\d+\.\d+ \(.*?\)", version_str, content, count=1)
        else:
            lines = content.split('\n')
            lines[0] = f"{lines[0].strip()} {version_str}"
            content = '\n'.join(lines)
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"📝 README.md 파일 업데이트 완료")
    except Exception as e:
        print(f"❌ README.md 업데이트 중 오류: {e}")

def apply_license():
    # 1. 문서 파일들 먼저 업데이트
    update_license_file()
    update_readme_file()
    
    count = 0
    # 현재 디렉토리부터 하위 폴더까지 모두 탐색
    for root, dirs, files in os.walk("."):
        # 특정 폴더 제외 (숨김 폴더 등)
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        
        # smart-guide-web 폴더 내부인지 확인
        is_final_mission = "smart-guide-web" in root
        
        for filename in files:
            # 본인 파일은 제외
            if filename == "apply_license.py":
                continue
                
            ext = os.path.splitext(filename)[1].lower()
            if ext in STYLES:
                filepath = os.path.join(root, filename)
                style = STYLES[ext]
                content_body = get_content(is_final_mission)
                full_header = f"{style['start']}{content_body}{style['end']}\n"
                
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        file_content = f.read()
                    
                    # 기존 주석 패턴 매칭 ( Credits & License 문구 기준)
                    pattern = re.compile(
                        re.escape(style['start']) + r".*?\[ Credits & License \].*?" + re.escape(style['end']),
                        re.DOTALL
                    )
                    
                    if pattern.search(file_content):
                        new_content = pattern.sub(full_header.strip(), file_content)
                        # strip()으로 인해 사라진 개행 보충 (기존 헤더가 맨 위였을 경우 대비)
                        if not new_content.startswith(full_header):
                             new_content = new_content.replace(full_header.strip(), full_header.strip() + "\n")
                    else:
                        # 없다면 맨 위에 추가
                        new_content = full_header + file_content
                    
                    # HTML 파일인 경우 푸터도 업데이트
                    if ext == '.html':
                        # 클래스 순서나 추가 속성에 상관없이 ui-footer 클래스를 가진 footer 탐색
                        footer_pattern = re.compile(r'^\s*<footer[^>]*class="[^"]*ui-footer[^"]*"[^>]*>.*?</footer>', re.DOTALL | re.MULTILINE)
                        if footer_pattern.search(new_content):
                            new_content = footer_pattern.sub(get_html_footer(is_final_mission), new_content)
                    
                    # 파일 쓰기
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    
                    suffix = " (& You 포함)" if is_final_mission else ""
                    print(f"✅ 적용 완료: {filepath}{suffix}")
                    count += 1
                except Exception as e:
                    print(f"❌ 오류 발생 ({filepath}): {e}")
    
    print(f"\n✨ 총 {count}개의 파일과 LICENSE, README 파일이 업데이트되었습니다!")

if __name__ == "__main__":
    apply_license()
