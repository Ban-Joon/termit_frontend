'use client';

import { useEffect, useState } from 'react';
import KaKaoMap from "./KaKaoMap";
import KaKaoMapBanJoon from './KaKaoMapBanJoon';

export default function TermitMap() {
    const [mapHeight, setMapHeight] = useState<string>('calc(100vh - 80px)');

    useEffect(() => {
        const updateHeight = () => {
            // Header 찾기: TERMIT 텍스트가 포함된 div 중 borderBottom이 있는 요소
            const allDivs = Array.from(document.querySelectorAll('div'));
            const headerElement = allDivs.find(div => {
                const style = window.getComputedStyle(div);
                const hasBorder = style.borderBottomWidth !== '0px' && style.borderBottomWidth !== '';
                const hasTermitText = div.textContent?.includes('TERMIT');
                return hasBorder && hasTermitText;
            }) as HTMLElement | undefined;

            if (headerElement) {
                const headerHeight = headerElement.getBoundingClientRect().height;
                setMapHeight(`calc(100vh - ${headerHeight}px)`);
            } else {
                // 헤더를 찾지 못한 경우 기본값 사용
                setMapHeight('calc(100vh - 80px)');
            }
        };

        // DOM이 완전히 렌더링된 후 측정
        const timer = setTimeout(updateHeight, 100);
        window.addEventListener('resize', updateHeight);
        
        return () => {
            window.removeEventListener('resize', updateHeight);
            clearTimeout(timer);
        };
    }, []);

    return (
        <div 
            style={{ 
                width: '100%', 
                height: mapHeight,
                margin: 0,
                padding: 0,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <KaKaoMapBanJoon height="100%"/>
        </div>
    );
}