import type { CSSProperties } from "react";
import { NavLink, useLocation } from "react-router-dom";

import "./FooterNavigation.css";

import mcomActiveIcon from "@/assets/icons/navigationIcons/mcom-active.png";
import mcomInactiveIcon from "@/assets/icons/navigationIcons/mcom-inactive.png";

import passportActiveIcon from "@/assets/icons/navigationIcons/passport-active.png";
import passportInactiveIcon from "@/assets/icons/navigationIcons/passport-inactive.png";

import customActiveIcon from "@/assets/icons/navigationIcons/custom-active.png";
import customInactiveIcon from "@/assets/icons/navigationIcons/custom-inactive.png";

import orderActiveIcon from "@/assets/icons/navigationIcons/onetoone-order-active.png";
import orderInActiveIcon from "@/assets/icons/navigationIcons/onetoone-order-inactive.png";

import mypageActiveIcon from "@/assets/icons/navigationIcons/mypage-active.png";
import mypageInActiveIcon from "@/assets/icons/navigationIcons/mypage-inactive.png";

// TypeScript의 interface를 사용해서
// 네비게이션 아이템 안에 잘못된 데이터가 들어가는 것을 미리 검사
interface NavigationItem {
  label: string;
  path: string;
  activeIcon: string;
  inactiveIcon: string;
}

// 푸터에 표시할 메뉴 정보
const navigationItems: NavigationItem[] = [
  {
    label: "아카이브",
    path: "/mcom",
    activeIcon: mcomActiveIcon,
    inactiveIcon: mcomInactiveIcon,
  },
  {
    label: "1:1 커스텀",
    path: "/onetooneorder",
    activeIcon: orderActiveIcon,
    inactiveIcon: orderInActiveIcon,
  },
  {
    label: "나의 여정",
    path: "/passport",
    activeIcon: passportActiveIcon,
    inactiveIcon: passportInactiveIcon,
  },
  {
    label: "커스텀",
    path: "/custom",
    activeIcon: customActiveIcon,
    inactiveIcon: customInactiveIcon,
  },
  {
    label: "마이페이지",
    path: "/mypage",
    activeIcon: mypageActiveIcon,
    inactiveIcon: mypageInActiveIcon,
  },
];

export default function FooterNavigation() {
  const { pathname, search } = useLocation();

  // /loading?to=/custom 형태의 query parameter 가져오기
  const searchParams = new URLSearchParams(search);

  // 로딩 페이지에서는 실제 이동할 페이지를 기준으로
  // 하단 네비게이션의 활성 메뉴를 결정
  //
  // /loading?to=/custom
  // → targetPath = "/custom"
  //
  // /loading?to=/onetooneorder
  // → targetPath = "/onetooneorder"
  const targetPath = pathname === "/loading" ? (searchParams.get("to") ?? "/custom") : pathname;

  // 현재 주소와 일치하는 네비게이션 메뉴의 index 찾기
  const matchedIndex = navigationItems.findIndex(({ path }) => {
    // 하위 페이지가 생겨도 해당 메뉴가 활성화되도록 함
    // 예: /passport/1 → /passport 메뉴 활성화
    return targetPath === path || targetPath.startsWith(`${path}/`);
  });

  // 일치하는 메뉴가 없는 경우 -1이 되면서 에러가 발생하지 않도록 처리
  // "/"에서는 기존대로 나의 여정(index 2)을 기본 활성화
  const activeIndex = targetPath === "/" ? 2 : matchedIndex >= 0 ? matchedIndex : 2;

  // 현재 선택된 메뉴 정보
  const activeItem = navigationItems[activeIndex];

  // 각 메뉴의 notch 위치
  const notchPositions = [
    "calc(50% - 152px)",
    "calc(50% - 76px)",
    "50%",
    "calc(50% + 76px)",
    "calc(50% + 152px)",
  ] as const;

  // 현재 선택된 메뉴 위치를 푸터 곡선에 전달
  const footerBackgroundStyle = {
    "--footer-notch-x": notchPositions[activeIndex] ?? notchPositions[0],
  } as CSSProperties;

  return (
    <nav
      aria-label="하단 네비게이션"
      className="
        fixed bottom-0 left-1/2 z-50
        h-23 w-full max-w-97
        -translate-x-1/2
        overflow-visible bg-transparent
        pb-[env(safe-area-inset-bottom)]
      "
    >
      {/* 선택된 메뉴 주변이 곡선으로 파이는 네이비 푸터 배경 */}
      <div
        aria-hidden="true"
        className="
          footer-navigation-background
          pointer-events-none
          absolute inset-0 z-0
          bg-[#242D41]
        "
        style={footerBackgroundStyle}
      />

      {/* 활성 원이 움직이는 영역 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -top-7 left-1/2 z-20
          w-95 -translate-x-1/2
        "
      >
        {/* 선택된 메뉴 위치로 활성 원 이동 */}
        <div
          className="
            flex w-1/5 justify-center
            transition-transform duration-1000
            ease-[cubic-bezier(0.22,1,0.36,1)]
            will-change-transform
          "
          style={{
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        >
          {/* 활성 메뉴 원형 도형 */}
          <div
            className="
              flex size-17
              items-center justify-center
              rounded-full bg-[#19273C]
              shadow-[0_0_10.5px_0_rgba(94,140,136,0.25),inset_0_3px_3px_0_rgba(255,255,255,0.25),inset_0_-1.5px_1.5px_0_rgba(159,159,159,0.25)]
            "
          >
            <img
              src={activeItem.activeIcon}
              alt=""
              aria-hidden="true"
              className="size-10 object-contain"
            />
          </div>
        </div>
      </div>

      {/* 메뉴 전체 영역 */}
      <div className="relative z-10 mx-auto grid h-full w-95 grid-cols-5">
        {navigationItems.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <NavLink
              key={item.path}
              to={
                item.path === "/custom" || item.path === "/onetooneorder"
                  ? `/loading?to=${encodeURIComponent(item.path)}`
                  : item.path
              }
              aria-label={`${item.label} 페이지로 이동`}
              aria-current={isActive ? "page" : undefined}
              className="
                flex h-full flex-col
                items-center justify-end
                gap-1 pb-4
                outline-none
                focus-visible:ring-2
                focus-visible:ring-white
              "
            >
              <img
                src={item.inactiveIcon}
                alt=""
                aria-hidden="true"
                className={`
                  size-9 object-contain
                  transition-opacity duration-500
                  ${isActive ? "opacity-0" : "opacity-100"}
                `}
              />

              <span
                className={`
                  text-[12px]
                  font-['Pretendard_Variable']
                  transition-colors duration-1000
                  ${isActive ? "font-semibold text-white" : "text-white/50"}
                `}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
