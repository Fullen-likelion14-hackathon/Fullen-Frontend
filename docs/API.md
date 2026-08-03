# 🌐 API & State Convention

Axios, TanStack Query, Zustand와 환경변수 사용 규칙입니다.

---

## 역할 구분

```text
Axios
→ 서버에 HTTP 요청 전송

TanStack Query
→ 서버 데이터 캐싱, 로딩 및 오류 상태 관리

Zustand
→ 클라이언트 전역 상태 관리
```

### Zustand 사용 대상

- 로그인 여부
- 클라이언트에서 관리하는 사용자 상태
- 사이드바 열림 여부
- 테마
- 여러 화면에서 공유하는 UI 상태

### TanStack Query 사용 대상

- 사용자 목록
- 게시글 목록
- 상세 정보
- 서버 검색 결과
- API 로딩 및 오류 상태

서버에서 받은 데이터를 Zustand에 중복 저장하지 않습니다.

---

## Axios Instance

Axios 공통 설정은 한 곳에서 관리합니다.

```ts
// src/api/client.ts

import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

API 함수에서는 `axios.get()`을 직접 호출하지 않고 공통 인스턴스를 사용합니다.

```ts
interface User {
  id: number;
  name: string;
}

export async function getUser(userId: number): Promise<User> {
  const response = await apiClient.get<User>(`/users/${userId}`);

  return response.data;
}
```

### API 작성 규칙

- 컴포넌트 안에서 직접 Axios 요청을 보내지 않습니다.
- API 요청 함수는 기능별 `api` 폴더에 작성합니다.
- 요청 및 응답 타입을 명시합니다.
- Axios 응답 전체가 아니라 필요한 데이터만 반환합니다.
- 서버 주소는 환경변수로 관리합니다.
- 공통 인증 및 오류 처리는 Axios Instance에서 관리합니다.

---

## TanStack Query

서버 데이터는 TanStack Query를 사용합니다.

```ts
export const userKeys = {
  all: ["users"] as const,
  detail: (userId: number) => ["users", userId] as const,
};
```

```tsx
const userQuery = useQuery({
  queryKey: userKeys.detail(userId),
  queryFn: () => getUser(userId),
});
```

### Query Key 규칙

```text
도메인 → 목록 또는 상세 → 식별자 또는 필터
```

```ts
["users"][("users", userId)][("posts", { page, category })];
```

- Query Key는 일관된 구조를 사용합니다.
- 식별자나 검색 조건이 다르면 Query Key에도 포함합니다.
- 서버 데이터를 임의로 복사하여 Zustand에 저장하지 않습니다.

---

## Zustand

Store는 `src/stores`에서 관리합니다.

```ts
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
  clearAccessToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  clearAccessToken: () => set({ accessToken: null }),
}));
```

컴포넌트에서는 필요한 값만 선택합니다.

```tsx
const accessToken = useAuthStore((state) => state.accessToken);
```

전체 Store를 한 번에 구독하는 방식은 가급적 피합니다.

```tsx
const store = useAuthStore();
```

---

## Environment Variable

실제 환경변수 파일은 Git에 올리지 않습니다.

```text
.env
.env.local
.env.development.local
.env.production.local
```

팀원에게 필요한 변수명은 `.env.example`로 공유합니다.

```env
VITE_API_BASE_URL=http://localhost:8080
```

Vite 환경변수는 반드시 `VITE_`로 시작합니다.

```ts
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```

프론트엔드 환경변수는 브라우저에 포함될 수 있으므로 비밀번호나 비밀 API 키를 저장하지 않습니다.
