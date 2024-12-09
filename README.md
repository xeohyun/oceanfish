# Ocean Sunfish Tracker 🌊🐟

**Ocean Sunfish Tracker**는 사용자의 기여도와 레벨 업 시스템을 기반으로 한 개복치 관리 애플리케이션입니다.  
사용자는 자신의 **기여 활동**을 통해 Sunfish(개복치)를 성장시키며, 매일 활동하지 않을 경우 개복치가 사망합니다.  
웹 애플리케이션은 **Django**를 백엔드로, **React.js**를 프론트엔드로 구현되었습니다.

---

## 기능 소개 🎯
### Sunfish 생성 🌱
- 새로운 Sunfish를 생성할 수 있습니다.
- Sunfish는 처음 생성 시 `Level 1`과 `Stage: Dust`로 시작합니다.
- 생성된 Sunfish는 당일 레벨 계산에서 제외되며, 다음 날부터 기여도가 반영됩니다.

### Sunfish 관리 🛠️
- 매일 GitHub 기여도를 바탕으로 Sunfish의 레벨이 증가합니다.
- **레벨 증가 규칙**:
  - 1 기여: 레벨 +1
  - 2~5 기여: 레벨 +2
  - 6~9 기여: 레벨 +3
  - 10 이상 기여: 레벨 +4
- 레벨이 증가하면 `Stage`도 함께 변경됩니다:
  - `1~3`: Dust
  - `4~10`: Baby
  - `11~30`: Adult
  - `31~50`: King
- 매일 활동이 없으면 Sunfish가 사망합니다

### 기여도 확인 🌟
- GitHub GraphQL API를 통해 사용자의 기여도를 실시간으로 확인합니다.
- 각 날짜별 기여도를 표시하며, 지난 1년간의 기록을 확인할 수 있습니다.
---

## 기술 스택 🛠️

### 프론트엔드
- **React.js**: UI 렌더링 및 상태 관리.
- **CSS**: 커스텀 스타일링 및 반응형 디자인.
- **Fetch API**: 백엔드와의 데이터 통신.

### 백엔드
- **Django**: REST API와 데이터 관리.
- **Django Rest Framework (DRF)**: API 엔드포인트 생성.
- **GitHub GraphQL API**: 사용자 기여도 데이터 가져오기.

---

## 설치 및 실행 🚀

### 1. 요구 사항
- Python 3.10 이상
- Node.js 16 이상
- Git

### 2. 클론 및 설정
```bash
# 레포지토리 클론
git clone https://github.com/xeohyun/oceanfish.git
cd oceansunfish

# 백엔드 설정
cd server
pip install -r requirements.txt
python manage.py migrate

# 환경 변수 설정 (.env 파일 생성)
GITHUB_ACCESS_TOKEN=<your_github_token>

# 서버 실행
python manage.py runserver

# 프론트엔드 설정
cd ../client
npm install
npm start
```

# Sunfish Tracker 🐟

## 사용 방법 🐟

### 애플리케이션 접속:
브라우저에서 [http://127.0.0.1:3000](http://127.0.0.1:3000)으로 접속합니다.

### Sunfish 생성:
- 모달창에서 이름을 입력해 새로운 Sunfish를 생성하세요.

### 기여도 확인:
- GitHub GraphQL API를 통해 기여도를 실시간으로 확인할 수 있습니다.

### Sunfish 관리:
- 매일 활동하여 Sunfish의 레벨을 높이세요.
- 활동이 없으면 Sunfish가 사망합니다.

---

## 데이터 모델 구조 🗂️

### Sunfish 모델
- **name**: Sunfish의 이름.
- **level**: 현재 레벨.
- **stage**: 현재 단계 (Dust, Baby, Adult, King).
- **is_alive**: 생존 여부.
- **creation_date**: Sunfish 생성 날짜.
- **last_processed_date**: 레벨 계산에서 제외된 마지막 날짜.

### Contribution 모델
- **date**: 기여 날짜.
- **count**: 해당 날짜의 기여도.
- **processed**: 해당 기여도가 처리되었는지 여부.

---

## 라이선스 📜

- MIT License
