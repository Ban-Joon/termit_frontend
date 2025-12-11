'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { Box, Text } from '@mantine/core';

// 👇 여기에 카카오 개발자 센터에서 발급받은 'JavaScript 키'를 넣어주세요.
const KAKAO_JS_KEY = "YOUR_KAKAO_JS_KEY_HERE";

export default function MapPage() {
  const mapElement = useRef<HTMLDivElement>(null);

  const initMap = () => {
    const kakao = (window as any).kakao;
    if (!kakao || !kakao.maps) return;

    // v3와 달리 카카오는 load 함수를 통해 로딩 완료를 보장받아야 안전합니다.
    kakao.maps.load(() => {
        if (!mapElement.current) return;

        const options = {
            center: new kakao.maps.LatLng(33.450701, 126.570667), // 기본 좌표 (제주도 카카오 본사)
            level: 3 // 확대 레벨
        };

        new kakao.maps.Map(mapElement.current, options);
        console.log("Kakao Map initialized");
    });
  };

  return (
    <>
      <Script
        strategy="afterInteractive"
        // autoload=false 필수: Next.js에서는 스크립트 로드 후 수동으로 load를 호출하는 것이 안전합니다.
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`}
        onReady={initMap}
      />
      
      <Box style={{ position: 'relative', width: '100%', height: 'calc(100vh - 60px)' }}>
        {KAKAO_JS_KEY === "YOUR_KAKAO_JS_KEY_HERE" && (
             <Box style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, background: 'rgba(255,255,255,0.9)', padding: '10px', borderRadius: '8px' }}>
                <Text c="red" fw={700}>카카오 API 키를 설정해주세요</Text>
                <Text size="sm">코드 상단의 KAKAO_JS_KEY 변수에 키를 입력하세요.</Text>
             </Box>
        )}
        <div ref={mapElement} style={{ minHeight: '100%', width: '100%' }} id="map" />
      </Box>
    </>
  );
}
