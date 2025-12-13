"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useMediaQuery } from '@mantine/hooks';

type LatLng = { lat: number; lng: number };
type Marker = { position: LatLng; title?: string; contentHtml?: string };
type CustomOverlayType = { id: string; position: LatLng; content: string };
export type PolygonType = { path: LatLng[]; strokeColor?: string; fillColor?: string; };

interface KakaoMapProps {
  center?: LatLng;           // 초기 중심 좌표
  level?: number;            // 확대 레벨 (낮을수록 확대)
  markers?: Marker[];        // 표시할 마커 목록
  customOverlays?: CustomOverlayType[]; // 커스텀 오버레이 목록
  polygons?: PolygonType[];  // 다각형 목록
  height?: number | string;  // 컨테이너 높이
  onOverlayClick?: (id: string) => void; // 오버레이 클릭 이벤트
  onCenterChange?: (center: LatLng) => void;
  onZoomChange?: (level: number) => void;
}

declare global {
  interface Window {
    kakao?: any;
  }
}

export default function KaKaoMapBanJoon({
  center = { lat: 36.3504, lng: 127.3845 }, // 대전시청
  level = 12,
  markers = [],
  customOverlays = [],
  polygons = [],
  height = 420,
  onOverlayClick,
  onCenterChange,
  onZoomChange,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const customOverlaysRef = useRef<any[]>([]);
  const polygonsRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Keep latest callbacks in refs to use in event listeners without re-binding
  const onCenterChangeRef = useRef(onCenterChange);
  const onZoomChangeRef = useRef(onZoomChange);

  useEffect(() => {
    onCenterChangeRef.current = onCenterChange;
    onZoomChangeRef.current = onZoomChange;
  }, [onCenterChange, onZoomChange]);

  const initMap = () => {
    // 이미 맵이 초기화되어 있으면 리턴
    if (mapInstanceRef.current) return;

    const kakao = window.kakao;
    if (!kakao || !mapRef.current) return;

    kakao.maps.load(() => {
      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level,
        draggable: true, // Enable dragging explicitly
        scrollwheel: true,
      });
      
      // 모바일 등에서 확실하게 드래그 활성화
      map.setDraggable(true);

      // 맵 인스턴스 저장
      mapInstanceRef.current = map;
      setIsLoaded(true);

      // 줌/타입 컨트롤
      const zoomCtrl = new kakao.maps.ZoomControl();
      map.addControl(zoomCtrl, kakao.maps.ControlPosition.RIGHT);

      const typeCtrl = new kakao.maps.MapTypeControl();
      map.addControl(typeCtrl, kakao.maps.ControlPosition.TOPRIGHT);
      
      // ✅ 줌 변경 이벤트 감지
      kakao.maps.event.addListener(map, "zoom_changed", () => {
        const currentLevel = map.getLevel();
        console.log("현재 줌 레벨:", currentLevel);
        if (onZoomChangeRef.current) {
            onZoomChangeRef.current(currentLevel);
        }
      });

      // ✅ 중심 좌표 변경 이벤트 감지 (이동 종료 시)
      kakao.maps.event.addListener(map, "dragend", () => {
        const center = map.getCenter();
        if (onCenterChangeRef.current) {
            onCenterChangeRef.current({ lat: center.getLat(), lng: center.getLng() });
        }
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
          map.setDraggable(true); // Ensure draggable is re-enabled
        }, 0);
      };

      window.addEventListener("resize", handleResize);

      // cleanup 함수를 위해 이벤트 리스너 참조 저장
      mapInstanceRef.current._resizeHandler = handleResize;

      // Force-enable dragging on mobile via direct event handling
      const preventTouch = (e: TouchEvent) => {
        // Allow pinch-zoom (2 fingers) but prevent scroll (1 finger) to force map drag
        if (e.touches.length === 1) {
            e.preventDefault();
        }
      };
      
      if (mapRef.current) {
         // Use passive: false to allow preventDefault
         mapRef.current.addEventListener('touchmove', preventTouch, { passive: false });
      }
      mapInstanceRef.current._preventTouch = preventTouch; 
    });
  };

  // 컴포넌트 마운트 시 스크립트가 이미 로드되어 있는지 확인
  useEffect(() => {
    // 클라이언트 사이드 라우팅 시 스크립트가 이미 로드되어 있을 수 있음
    if (typeof window !== "undefined" && window.kakao && mapRef.current) {
      // 약간의 지연을 두어 DOM이 완전히 준비될 때까지 대기
      const timer = setTimeout(() => {
        initMap();
        // Force draggable just in case
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setDraggable(true);
        }
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
      if (mapInstanceRef.current?._preventTouch && mapRef.current) {
         mapRef.current.removeEventListener('touchmove', mapInstanceRef.current._preventTouch);
      }
      mapInstanceRef.current = null;
    };
  }, []);

  // Polygons Update Effect
  useEffect(() => {
      if (!isLoaded) return;
      const map = mapInstanceRef.current;
      const kakao = window.kakao;
      if (!map || !kakao) return;

      // Clear existing
      polygonsRef.current.forEach(p => p.setMap(null));
      polygonsRef.current = [];

      // Add new
      if (polygons && polygons.length > 0) {
          polygons.forEach((poly) => {
            const path = poly.path.map(p => new kakao.maps.LatLng(p.lat, p.lng));
            const newPoly = new kakao.maps.Polygon({
                map: map,
                path: path,
                strokeWeight: 2,
                strokeColor: poly.strokeColor || '#5C7CFA',
                strokeOpacity: 0.8,
                strokeStyle: 'solid',
                fillColor: poly.fillColor || '#A5D8FF',
                fillOpacity: 0.5 
            });
            polygonsRef.current.push(newPoly);
        });
      }
  }, [polygons, isLoaded]);

  // Center Update Effect
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !window.kakao) return;
    const currentCenter = mapInstanceRef.current.getCenter();
    const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng);
    
    // Check if distance is significant to avoid loops/jitter
    const dist = Math.sqrt(
        Math.pow(currentCenter.getLat() - center.lat, 2) + 
        Math.pow(currentCenter.getLng() - center.lng, 2)
    );

    if (dist > 0.00001) {
        mapInstanceRef.current.setCenter(newCenter);
    }
  }, [center, isLoaded]);

  // Level Update Effect
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;
    const currentLevel = mapInstanceRef.current.getLevel();
    if (currentLevel !== level) {
         mapInstanceRef.current.setLevel(level, { animate: true });
    }
  }, [level, isLoaded]);

  // Custom Overlays Update Effect
  useEffect(() => {
    if (!isLoaded) return;
    const map = mapInstanceRef.current;
    const kakao = window.kakao;
    if (!map || !kakao) return;

    // Clear existing
    customOverlaysRef.current.forEach(o => o.setMap(null));
    customOverlaysRef.current = [];

    // Add new
    if (customOverlays && customOverlays.length > 0) {
      customOverlays.forEach((overlay) => {
         const pos = new kakao.maps.LatLng(overlay.position.lat, overlay.position.lng);
         
         const contentEl = document.createElement('div');
         contentEl.innerHTML = overlay.content;
         contentEl.style.cursor = 'pointer';
         
         // contentEl.addEventListener('mousedown', (e) => e.stopPropagation()); // Removed per checklist
         // contentEl.addEventListener('touchstart', (e) => e.stopPropagation()); // Removed per checklist
         contentEl.addEventListener('click', (e) => {
             e.stopPropagation(); // Prevent map click
             if (onOverlayClick) onOverlayClick(overlay.id);
         });

         const newOverlay = new kakao.maps.CustomOverlay({
             map: map,
             position: pos,
             content: contentEl,
             yAnchor: 1,
             zIndex: 10
         });
         
         customOverlaysRef.current.push(newOverlay);
      });
    }
  }, [customOverlays, onOverlayClick, isLoaded]);

  // Responsive Touch Action Logic:
  // Using Inline Style (Mobile Default) + CSS Class Override (Desktop)
  // This ensures mobile always works (priority), while desktop gets restored via !important CSS.

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
            className="desktop-touch-auto" // Valid only on desktop via globals.css
            style={{
            width: "100%",
            height: "100%",
            margin: 0,
            padding: 0,
            touchAction: 'none', // Default for mobile (Inline has high specificity, but Class has !important)
            pointerEvents: 'auto'
            }}
        />
      </div>
    </>
  );
}
