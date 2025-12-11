"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

type LatLng = { lat: number; lng: number };
type Marker = { position: LatLng; title?: string; contentHtml?: string };

interface KakaoMapProps {
  center?: LatLng;           // 초기 중심 좌표
  level?: number;            // 확대 레벨 (낮을수록 확대)
  markers?: Marker[];        // 표시할 마커 목록
  height?: number | string;  // 컨테이너 높이
}

declare global {
  interface Window {
    kakao?: any;
  }
}

export default function KakaoMap({
  center = { lat: 37.5665, lng: 126.9780 }, // 서울시청
  level = 4,
  markers = [],
  height = 420,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);

  const initMap = () => {
    // 이미 맵이 초기화되어 있으면 리턴
    if (mapInstanceRef.current) return;

    const kakao = window.kakao;
    if (!kakao || !mapRef.current) return;

    kakao.maps.load(() => {
      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level,
      });

      // 맵 인스턴스 저장
      mapInstanceRef.current = map;

      // 줌/타입 컨트롤
      const zoomCtrl = new kakao.maps.ZoomControl();
      map.addControl(zoomCtrl, kakao.maps.ControlPosition.RIGHT);

      const typeCtrl = new kakao.maps.MapTypeControl();
      map.addControl(typeCtrl, kakao.maps.ControlPosition.TOPRIGHT);
      
      // ✅ 줌 변경 이벤트 감지
      kakao.maps.event.addListener(map, "zoom_changed", () => {
        const currentLevel = map.getLevel();
        console.log("현재 줌 레벨:", currentLevel);
        // 🔹 여기에 원하는 로직을 추가하세요.
        // 예: 상태 업데이트, 특정 줌 레벨에서 마커 크기 변경 등
      });

      // 마커들 추가
      markers.forEach((m) => {
        const pos = new kakao.maps.LatLng(m.position.lat, m.position.lng);
        const marker = new kakao.maps.Marker({ position: pos, map, title: m.title });

        if (m.contentHtml) {
          const iw = new kakao.maps.InfoWindow({ content: m.contentHtml });
          kakao.maps.event.addListener(marker, "click", () => {
            iw.open(map, marker);
          });
        }
      });

      // 반응형 리사이즈 대응
      const handleResize = () => {
        const currCenter = map.getCenter();
        setTimeout(() => {
          map.relayout();
          map.setCenter(currCenter);
        }, 0);
      };

      window.addEventListener("resize", handleResize);

      // cleanup 함수를 위해 이벤트 리스너 참조 저장
      mapInstanceRef.current._resizeHandler = handleResize;
    });
  };

  // 컴포넌트 마운트 시 스크립트가 이미 로드되어 있는지 확인
  useEffect(() => {
    // 클라이언트 사이드 라우팅 시 스크립트가 이미 로드되어 있을 수 있음
    if (typeof window !== "undefined" && window.kakao && mapRef.current) {
      // 약간의 지연을 두어 DOM이 완전히 준비될 때까지 대기
      const timer = setTimeout(() => {
        initMap();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // cleanup: 컴포넌트 언마운트 시 이벤트 리스너 제거
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current?._resizeHandler) {
        window.removeEventListener("resize", mapInstanceRef.current._resizeHandler);
      }
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <>
      {/* Kakao SDK: autoload=false 로 두고, 로드 후 수동 초기화 */}
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => {
          // 스크립트 로드 후 약간의 지연을 두어 DOM이 준비될 때까지 대기
          setTimeout(() => {
            initMap();
          }, 100);
        }}
      />
      <div style={{ width: "100%", height: "100%", margin: 0, padding: 0 }}>
        <div
            ref={mapRef}
            style={{
            width: "100%",
            height: "100%",
            margin: 0,
            padding: 0,
            }}
        />
      </div>
    </>
  );
}
