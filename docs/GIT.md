# 🌿 Git Convention

Erbe-Frontend 프로젝트의 Git 협업 규칙입니다.

모든 작업은 반드시 **원격 `develop` 브랜치를 최신화한 후** 시작합니다.

---

# 🌳 Branch Strategy

## `main`

- 항상 배포 가능한 상태를 유지합니다.
- 직접 작업하거나 직접 Push하지 않습니다.
- 배포 시점에 `develop` 브랜치를 Pull Request로 병합합니다.

## `develop`

- 다음 배포를 준비하는 통합 개발 브랜치입니다.
- 모든 작업 브랜치는 `develop`에서 생성합니다.
- 직접 작업하거나 직접 Push하지 않습니다.
- 코드 리뷰를 통과한 변경 사항만 병합합니다.

## 작업 브랜치

- 하나의 브랜치는 하나의 이슈만 담당합니다.
- 반드시 최신 `develop` 브랜치에서 생성합니다.
- 작업 완료 후 `develop`을 대상으로 Pull Request를 생성합니다.
- Merge 완료 후 작업 브랜치를 삭제합니다.

<p align="center">
  <img src="./images/gitflow.png" alt="Git Flow" width="1000" />
</p>

```text
main
 └── develop
      ├── feat/10-login
      ├── feat/11-signup
      ├── fix/15-header
      └── chore/1-eslint
```

---

# 📌 Branch Naming Convention

## 형식

```text
prefix/이슈번호-작업내용
```

## 예시

```text
feat/10-login-api
fix/23-header-layout
design/12-login-page
refactor/30-user-service
docs/5-update-readme
chore/1-eslint-setting
```

| Prefix     | 설명                        |
| ---------- | --------------------------- |
| `feat`     | 새로운 기능 추가            |
| `fix`      | 버그 수정                   |
| `hotfix`   | 긴급 버그 수정              |
| `design`   | UI 및 CSS 수정              |
| `refactor` | 기능 변경 없는 코드 개선    |
| `docs`     | 문서 수정                   |
| `chore`    | 설정 파일 및 개발 환경 변경 |

## 작성 규칙

- 영문 소문자와 숫자를 사용합니다.
- 단어 구분은 하이픈 `-`을 사용합니다.
- 공백, 한글, 언더스코어를 사용하지 않습니다.
- 브랜치명에는 `#`을 넣지 않습니다.
- 하나의 브랜치는 하나의 작업만 담당합니다.

```text
feat/10-user-login       ✅
fix/15-header-layout     ✅

feat/#10-login           ❌
feat/10_UserLogin        ❌
feature/로그인            ❌
```

---

# 📝 Commit Convention

## 형식

```text
이모지 Type: 작업 내용
```

## 예시

```text
🎉 Start: 프로젝트 초기 설정
✨ Feat: 로그인 API 연결
🐛 Fix: 로그인 버튼 오류 수정
🚑 Hotfix: 배포 환경 로그인 오류 긴급 수정
🎨 Design: 로그인 페이지 스타일 수정
♻️ Refactor: Header 컴포넌트 분리
🔧 Settings: ESLint 및 Prettier 설정 수정
🗃️ Comment: 인증 로직 주석 추가
➕ Dependency/Plugin: React Router DOM 추가
📝 Docs: README 협업 규칙 수정
🔀 Merge: 로그인 기능 브랜치 병합
🚀 Deploy: 운영 환경 배포
🚚 Rename: 사용자 페이지 파일명 변경
🔥 Remove: 사용하지 않는 컴포넌트 삭제
⏪ Revert: 로그인 로직 이전 버전으로 복구
```

| 이모지 | Type                | 설명                             |
| ------ | ------------------- | -------------------------------- |
| 🎉     | `Start`             | 프로젝트 생성 및 초기 설정       |
| ✨     | `Feat`              | 새로운 기능 구현                 |
| 🐛     | `Fix`               | 버그 수정                        |
| 🚑     | `Hotfix`            | 긴급 버그 수정                   |
| 🎨     | `Design`            | UI 및 CSS 변경                   |
| ♻️     | `Refactor`          | 기능 변경 없는 코드 구조 개선    |
| 🔧     | `Settings`          | 개발 환경 및 설정 파일 변경      |
| 🗃️     | `Comment`           | 주석 추가 및 수정                |
| ➕     | `Dependency/Plugin` | 라이브러리 및 플러그인 추가      |
| 📝     | `Docs`              | 문서 추가 및 수정                |
| 🔀     | `Merge`             | 브랜치 병합                      |
| 🚀     | `Deploy`            | 배포 관련 작업                   |
| 🚚     | `Rename`            | 파일 및 폴더 이동 또는 이름 변경 |
| 🔥     | `Remove`            | 파일 및 코드 삭제                |
| ⏪     | `Revert`            | 이전 커밋으로 되돌리기           |

## 작성 규칙

- 제목 끝에 마침표를 붙이지 않습니다.
- 한 커밋에는 하나의 논리적 변경만 포함합니다.
- `수정`, `작업`, `변경`처럼 모호한 표현만 사용하지 않습니다.
- 기능 변경과 스타일 변경은 가능하면 분리합니다.

```text
🐛 Fix: 버그 수정                         ❌
🐛 Fix: 로그인 요청 중복 실행 오류 수정   ✅
```

---

# 🔄 Workflow

## 1. 반드시 `develop` 최신화

모든 작업은 아래 명령으로 시작합니다.

```bash
git switch develop
git pull origin develop
```

`develop`을 최신화하지 않은 상태에서는 작업 브랜치를 생성하지 않습니다.

---

## 2. 작업 브랜치 생성

```bash
git switch -c feat/10-login
```

---

## 3. 작업 진행

작업 중에도 원격 `develop`에 변경 사항이 생겼다면 최신 내용을 반영합니다.

```bash
git fetch origin
git merge origin/develop
```

충돌이 발생하면 작업자가 직접 해결합니다.

---

## 4. 변경 사항 확인

```bash
git status
git diff
```

커밋 전에 의도하지 않은 파일이 포함되지 않았는지 확인합니다.

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

## 6. 커밋

```bash
git add .
git commit -m "✨ Feat: 로그인 기능 구현"
```

가능하면 커밋 대상 파일을 확인한 뒤 필요한 파일만 추가합니다.

```bash
git add src/pages/LoginPage.tsx
git add src/features/auth
```

---

## 7. 원격 저장소 Push

```bash
git push -u origin feat/10-login
```

이후부터는 다음 명령만 사용할 수 있습니다.

```bash
git push
```

---

## 8. Pull Request 생성

```text
base: develop
compare: feat/10-login
```

Pull Request는 반드시 저장소에 등록된 템플릿을 사용합니다.

```text
.github/PULL_REQUEST_TEMPLATE.md
```

- 템플릿 항목을 임의로 삭제하지 않습니다.
- 관련 이슈를 연결합니다.
- UI 변경이 있다면 스크린샷 또는 GIF를 첨부합니다.
- 리뷰가 필요한 부분을 명확하게 작성합니다.

---

## 9. 리뷰 및 Merge

- 최소 1명의 리뷰 승인을 받습니다.
- 충돌은 Pull Request 작성자가 해결합니다.
- 코드 검사에 실패한 상태에서는 Merge하지 않습니다.
- Merge 방식은 **Squash and Merge**를 사용합니다.
- Merge가 끝나면 원격 작업 브랜치를 삭제합니다.

---

## 10. Merge 이후 로컬 정리

```bash
git switch develop
git pull origin develop
git branch -d feat/10-login
```

다음 작업도 다시 최신 `develop`에서 시작합니다.

---

# 🚀 Merge Strategy

기본 Merge 방식은 **Squash and Merge**입니다.

기능 브랜치의 여러 커밋을 하나의 기능 단위 커밋으로 합쳐 `develop` 브랜치의 기록을 관리합니다.

## Merge 규칙

- 최소 1명의 리뷰 승인을 받습니다.
- 작성자는 자신의 Pull Request를 직접 승인하지 않습니다.
- 충돌은 Pull Request 작성자가 해결합니다.
- 검사 실패 상태에서는 Merge하지 않습니다.
- Merge 후 작업 브랜치를 삭제합니다.
- `main`, `develop` 브랜치에 직접 Push하지 않습니다.

---

# 📌 Pull Request Convention

Pull Request는 저장소에 등록된 템플릿만 사용합니다.

```text
.github/PULL_REQUEST_TEMPLATE.md
```

- PR 제목과 본문은 템플릿 형식에 맞게 작성합니다.
- 관련 이슈를 반드시 연결합니다.
- UI 변경이 있다면 스크린샷 또는 GIF를 첨부합니다.
- 리뷰가 필요한 부분은 본문에 작성합니다.
- 최소 1명의 리뷰 승인 후 Merge합니다.
- Merge 방식은 **Squash and Merge**를 사용합니다.

---

# 🗂 Issue Convention

Issue는 저장소에 등록된 템플릿만 사용합니다.

```text
.github/ISSUE_TEMPLATE/
```

- 작업 시작 전에 Issue를 생성합니다.
- 기능, 버그, 설정 작업에 맞는 템플릿을 선택합니다.
- 하나의 Issue에는 하나의 작업 단위만 작성합니다.
- 담당자와 Label을 지정합니다.
- 작업 브랜치명에 Issue 번호를 포함합니다.
- 템플릿 항목을 임의로 삭제하지 않습니다.
