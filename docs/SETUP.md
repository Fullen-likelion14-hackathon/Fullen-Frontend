# ⚙️ Project Setup

Erbe-Frontend 프로젝트 실행 방법과 권장 VS Code 확장 프로그램을 안내합니다.

프로젝트 환경은 이미 구성되어 있으므로 별도로 Vite, Tailwind CSS, shadcn/ui 등을 초기화하지 않습니다.

---

## 1. Repository Clone

HTTPS:

```bash
git clone https://github.com/Erbe-likelion14-hackathon/Erbe-Frontend.git
```

SSH:

```bash
git clone git@github.com:Erbe-likelion14-hackathon/Erbe-Frontend.git
```

프로젝트 폴더로 이동합니다.

```bash
cd Erbe-Frontend
```

---

## 2. 의존성 설치

```bash
npm install
```

`package.json`과 `package-lock.json`에 기록된 의존성이 자동으로 설치됩니다.

다음 명령을 별도로 다시 실행하지 않습니다.

```bash
npm create vite@latest
npx shadcn@latest init
npm install tailwindcss
```

초기 설정은 이미 프로젝트에 반영되어 있습니다.

---

## 3. 환경변수 설정

프로젝트 루트의 `.env.example`을 복사하여 `.env`를 생성합니다.

```bash
cp .env.example .env
```

예시:

```env
VITE_API_BASE_URL=http://localhost:8080
```

환경별 실제 값을 입력합니다.

---

## 4. 개발 서버 실행

```bash
npm run dev
```

터미널에 표시되는 주소로 접속합니다.

```text
http://localhost:5173
```

5173 포트를 사용할 수 없는 경우 다른 포트가 자동으로 사용될 수 있습니다.

---

## 5. 코드 검사

```bash
npm run lint
npm run build
```

Prettier 검사 스크립트가 등록되어 있다면 다음 명령도 실행합니다.

```bash
npm run format:check
```

---

## 6. 권장 VS Code Extensions

팀원은 아래 확장 프로그램을 설치합니다.

### 필수

| Extension                 | 제작자        | 역할                                     |
| ------------------------- | ------------- | ---------------------------------------- |
| ESLint                    | Microsoft     | ESLint 오류 및 경고 표시                 |
| Prettier - Code formatter | Prettier      | 코드 자동 포맷팅                         |
| Tailwind CSS IntelliSense | Tailwind Labs | Tailwind 클래스 자동완성 및 v4 문법 지원 |

### 권장

| Extension  | 역할                            |
| ---------- | ------------------------------- |
| Error Lens | 오류와 경고를 코드 줄 옆에 표시 |
| GitLens    | Git 변경 기록과 작성자 확인     |

Error Lens는 코드를 검사하는 도구가 아닙니다.

```text
ESLint / TypeScript
→ 오류와 경고 생성

Error Lens
→ 해당 오류와 경고를 코드 옆에 보기 쉽게 표시
```

---

## 7. Format on Save

VS Code 설정에서 다음 항목을 확인합니다.

```text
Format On Save
→ 활성화

Default Formatter
→ Prettier - Code formatter
```

프로젝트의 `.vscode/settings.json`이 포함되어 있다면 팀원에게 동일한 설정이 적용됩니다.

권장 설정:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

---

## 8. Tailwind CSS 파일 표시

`src/index.css`의 다음 문법은 Tailwind CSS v4의 정상 문법입니다.

```css
@theme inline {
  /* theme variables */
}

@custom-variant dark (&:is(.dark *));
```

`Unknown at rule` 경고가 나타난다면 다음을 확인합니다.

1. Tailwind CSS IntelliSense가 설치되어 있는지 확인합니다.
2. VS Code 오른쪽 아래 언어 모드를 `Tailwind CSS`로 선택합니다.
3. VS Code 창을 다시 불러옵니다.

```text
Cmd + Shift + P
→ Developer: Reload Window
```

---

## 9. 패키지 관리 규칙

- 패키지 매니저는 npm으로 통일합니다.
- `package-lock.json`을 반드시 커밋합니다.
- 새로운 패키지 설치 전 팀원에게 공유합니다.
- 같은 역할을 하는 라이브러리를 중복 설치하지 않습니다.

일반 의존성:

```bash
npm install <package-name>
```

개발 의존성:

```bash
npm install -D <package-name>
```

새 shadcn/ui 컴포넌트를 추가할 때:

```bash
npx shadcn@latest add dialog
```

생성된 컴포넌트 파일과 변경된 `package-lock.json`을 함께 커밋합니다.

---

## 10. 작업 시작

```bash
git switch develop
git pull origin develop
git switch -c feat/이슈번호-작업내용
```

예시:

```bash
git switch -c feat/10-login
```
