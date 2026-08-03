# 🎨 CSS Convention

Erbe-Frontend 프로젝트는 **Tailwind CSS v4 + shadcn/ui**를 사용합니다.

---

## 기본 규칙

- Tailwind Utility Class를 우선 사용합니다.
- 인라인 스타일 `style={{ ... }}`은 사용하지 않습니다.
- 공통 UI는 shadcn/ui 컴포넌트를 우선 사용합니다.
- 동일한 스타일이 반복되면 컴포넌트로 분리합니다.
- 반응형 스타일은 Mobile First 방식으로 작성합니다.
- Tailwind 클래스 오타와 중복을 확인합니다.
- 임의값은 디자인 요구사항이 명확한 경우에만 사용합니다.

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2">...</div>
```

잘못된 예시:

```tsx
<div className="gird grid-cols-1 ,md:grid-cols-2 gap">...</div>
```

- `gird` → `grid`
- `,md:` → `md:`
- `gap` → `gap-4`처럼 크기를 명시

---

## Class 작성 순서

다음 순서를 권장합니다.

```text
Layout
→ Position
→ Flex / Grid
→ Size
→ Spacing
→ Border
→ Background / Color
→ Typography
→ Effect
→ State
→ Responsive
```

예시:

```tsx
<button className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-600 md:w-auto">
  저장
</button>
```

---

## 반응형 작성

모바일 스타일을 기본으로 작성한 뒤 화면 크기에 따라 확장합니다.

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">...</div>
```

```text
기본      → 모바일
sm:       → 작은 화면 이상
md:       → 태블릿 이상
lg:       → 데스크톱 이상
```

---

## shadcn/ui 규칙

- CLI로 생성한 컴포넌트는 `src/components/ui`에 둡니다.
- 공통 디자인을 변경할 때만 기본 UI 컴포넌트를 수정합니다.
- 특정 화면의 스타일은 `className`으로 변경합니다.
- 반복되는 UI는 별도의 공통 컴포넌트로 분리합니다.
- 새로운 Variant 추가는 팀원과 합의한 후 진행합니다.

특정 화면에서만 색상 변경:

```tsx
<Button className="bg-blue-500 hover:bg-blue-600">저장</Button>
```

전체 프로젝트에서 반복해서 사용해야 한다면 Variant로 분리합니다.

```tsx
<Button variant="success">저장</Button>
```

---

## 공통 컴포넌트 분리 기준

다음 조건 중 하나 이상에 해당하면 공통 컴포넌트 분리를 고려합니다.

- 두 곳 이상에서 동일한 UI가 반복됩니다.
- 동일한 레이아웃과 동작을 공유합니다.
- 화면마다 텍스트나 데이터만 달라집니다.
- 접근성이나 이벤트 처리 로직을 공통으로 사용합니다.

재사용 가능성이 없는 작은 UI를 무조건 공통화하지 않습니다.

---

## 금지 사항

특별한 이유 없이 다음 방식을 사용하지 않습니다.

```tsx
<div style={{ backgroundColor: "blue" }} />
```

```css
.example {
  color: red !important;
}
```

```tsx
<div className="w-[347px] mt-[13px]" />
```

임의값과 `!important`가 필요한 경우 코드 리뷰에서 이유를 설명합니다.
