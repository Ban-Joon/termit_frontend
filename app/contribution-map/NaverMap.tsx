'use client';

import { useEffect } from 'react';
import Script from 'next/script';

type NaverMapProps = {
  width?: string;
  height?: string;
};

export default function NaverMap({
  width = '100%',
  height = '400px',
}: NaverMapProps) {
  // 스크립트 로드된 후 호출할 함수
  const handleLoad = () => {
    alert('load');
    // SSR 환경 보호용: window 체크
    if (typeof window === 'undefined') return;
    if (!window.naver || !window.naver.maps) return;

    const { naver } = window;

    // 지도 옵션
    const map = new naver.maps.Map('naver-map', {
      center: new naver.maps.LatLng(37.5665, 126.9780), // 서울시청 좌표
      zoom: 14,
    });

    // 마커 하나 찍기
    new naver.maps.Marker({
      position: new naver.maps.LatLng(37.5665, 126.9780),
      map,
    });
  };

  // 혹시 Script onLoad 전에 컴포넌트가 렌더링되어도 에러 안 나게 방어
  useEffect(() => {
    // 이미 스크립트가 로드되어 있는 경우를 대비 (페이지 이동 등)
    if (typeof window === 'undefined') return;
    if (window.naver && window.naver.maps) {
      handleLoad();
    }
  }, []);

  return (
    <>
      {/* 네이버 지도 스크립트 로드 */}
      <Script
        src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=ktx7rcctrq&submodules=geocoder&ClientSecret=ee1fsafrFCweZZ9U6yljjH1LblEIMXSBMealeX7H"
        strategy="afterInteractive"
        onLoad={handleLoad}
      />

      {/* 지도가 그려질 DOM */}
      <div
        id="naver-map"
        style={{
          width,
          height,
        }}
      />
    </>
  );
}