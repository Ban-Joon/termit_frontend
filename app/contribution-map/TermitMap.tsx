'use client';

import { useEffect, useState, Fragment } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import KaKaoMapBanJoon from './KaKaoMapBanJoon';
import { MOCK_SIDEBAR_DATA } from './data';

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

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [priceOptionIndex, setPriceOptionIndex] = useState<number>(0);
    const [showMoreTransactions, setShowMoreTransactions] = useState<boolean>(false);
    
    // NATION: 전국 뷰 (대전 중심, 서울 포인트)
    // CITY: 도시 뷰 (서울 중심, 강남구 포인트)
    // DISTRICT: 구 뷰 (강남구 중심, 아파트 포인트들)
    const [viewMode, setViewMode] = useState<'NATION' | 'CITY' | 'DISTRICT'>('NATION');

    const [mapState, setMapState] = useState<{ center: { lat: number; lng: number }; level: number }>({
        center: { lat: 36.3504, lng: 127.3845 }, // Default: Daejeon (Korea View) (NATION)
        level: 12
    });

    // Reset price option and transaction view when selectedId changes
    useEffect(() => {
        setPriceOptionIndex(0);
        setShowMoreTransactions(false);
    }, [selectedId]);

    // Automatic viewMode switching based on zoom level when no item is selected
    useEffect(() => {
        if (selectedId) return; // Do not switch if sidebar is open

        const { level } = mapState;
        
        if (level >= 10) {
            setViewMode('NATION');
        } else if (level >= 7) {
            setViewMode('CITY');
        } else {
            setViewMode('DISTRICT');
        }
    }, [mapState.level, selectedId]);

    const selectedData = MOCK_SIDEBAR_DATA.find(d => d.id === selectedId);

    // Dynamic Overlays based on viewMode
    let customOverlays: any[] = [];

    if (viewMode === 'NATION') {
        customOverlays = [
            {
                id: 'seoul',
                position: { lat: 37.5665, lng: 126.9780 }, // Seoul City Hall
                content: `
                    <div style="
                        padding: 10px 15px; 
                        background-color: #339AF0; 
                        color: white; 
                        border-radius: 20px; 
                        box-shadow: 0 4px 10px rgba(0,0,0,0.2); 
                        font-family: sans-serif;
                        text-align: center;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 14px;
                        border: 2px solid white;
                    ">
                        서울특별시
                    </div>
                `
            }
        ];
    } else if (viewMode === 'CITY') {
        customOverlays = [
            {
                id: 'gangnam-gu',
                position: { lat: 37.5172, lng: 127.0473 }, // Gangnam-gu Office
                content: `
                    <div style="
                        padding: 8px 12px; 
                        background-color: #FD7E14; 
                        color: white; 
                        border-radius: 15px; 
                        box-shadow: 0 4px 10px rgba(0,0,0,0.2); 
                        font-family: sans-serif;
                        text-align: center;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 13px;
                        border: 2px solid white;
                    ">
                        강남구
                    </div>
                `
            },
            {
                id: 'seodaemun-gu',
                position: { lat: 37.5791, lng: 126.9368 }, // Seodaemun-gu Office
                content: `
                    <div style="
                        padding: 8px 12px; 
                        background-color: #FD7E14; 
                        color: white; 
                        border-radius: 15px; 
                        box-shadow: 0 4px 10px rgba(0,0,0,0.2); 
                        font-family: sans-serif;
                        text-align: center;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 13px;
                        border: 2px solid white;
                    ">
                        서대문구
                    </div>
                `
            }
        ];
    } else if (viewMode === 'DISTRICT') {
        customOverlays = [
            {
                id: 'samsung-lotte',
                position: { lat: 37.5177, lng: 127.0498 }, // 삼성동 롯데아파트 103동 인근
                content: `
                    <div style="
                        padding: 6px 10px; 
                        background-color: #FD7E14; 
                        color: white; 
                        border-radius: 12px; 
                        box-shadow: 0 2px 6px rgba(0,0,0,0.15); 
                        font-family: sans-serif;
                        text-align: center;
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        line-height: 1.2;
                    ">
                        <div style="font-size: 10px; opacity: 0.9; font-weight: normal;">21.2억~</div>
                        <div style="font-size: 13px; font-weight: bold;">30.8억</div>
                    </div>
                `
            },
            {
                id: 'nonhyeon-paragon',
                position: { lat: 37.5147, lng: 127.0365 }, // 논현동양파라곤
                content: `
                    <div style="
                        padding: 6px 10px; 
                        background-color: #15AABF; 
                        color: white; 
                        border-radius: 12px; 
                        box-shadow: 0 2px 6px rgba(0,0,0,0.15); 
                        font-family: sans-serif;
                        text-align: center;
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        line-height: 1.2;
                    ">
                        <div style="font-size: 10px; opacity: 0.9; font-weight: normal;">33억~</div>
                        <div style="font-size: 13px; font-weight: bold;">35억</div>
                    </div>
                `
            },
            {
                id: 'hongjewon-hyundai',
                position: { lat: 37.5880, lng: 126.9440 }, // 홍제원현대
                content: `
                    <div style="
                        padding: 6px 10px; 
                        background-color: #12B886; 
                        color: white; 
                        border-radius: 12px; 
                        box-shadow: 0 2px 6px rgba(0,0,0,0.15); 
                        font-family: sans-serif;
                        text-align: center;
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        line-height: 1.2;
                    ">
                        <div style="font-size: 10px; opacity: 0.9; font-weight: normal;">9억~</div>
                        <div style="font-size: 13px; font-weight: bold;">9.5억</div>
                    </div>
                `
            }
        ];
    }

    // Mock Data for Polygons (단지 경계 제거)
    const polygons: any[] = []; // 사용자 요청으로 폴리곤 제거

    const handleOverlayClick = (id: string) => {
        console.log("Clicked overlay:", id);
        
        if (id === 'seoul') {
            setMapState({
                center: { lat: 37.5665, lng: 126.9780 }, // 서울시청
                level: 9
            });
            setViewMode('CITY');
        } else if (id === 'gangnam-gu') {
            setMapState({
                center: { lat: 37.5172, lng: 127.0473 }, // 강남구청
                level: 6
            });
            setViewMode('DISTRICT');
        } else if (id === 'seodaemun-gu') {
            setMapState({
                center: { lat: 37.5791, lng: 126.9368 }, // 서대문구청
                level: 6
            });
            setViewMode('DISTRICT');
        } else {
            // 아파트 선택 (Level 3 이동)
            setSelectedId(id);
            if (id === 'samsung-lotte') {
                setMapState({
                    center: { lat: 37.5177, lng: 127.0498 },
                    level: 3
                });
            } else if (id === 'nonhyeon-paragon') {
                setMapState({
                    center: { lat: 37.5147, lng: 127.0365 },
                    level: 3
                });
            } else if (id === 'hongjewon-hyundai') {
                setMapState({
                    center: { lat: 37.5880, lng: 126.9440 },
                    level: 3
                });
            }
        }
    };

    const isMobile = useMediaQuery('(max-width: 768px)');

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
             {/* Left Sidebar */}
             <div style={{
                position: 'absolute',
                top: 0,
                left: selectedId ? 0 : (isMobile ? '-100%' : '-640px'), // Slide in/out
                width: isMobile ? '100%' : 'clamp(480px, 30vw, 640px)',
                height: '100%',
                backgroundColor: 'white',
                zIndex: 20,
                boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
                transition: 'left 0.3s ease-in-out',
                padding: '20px',
                boxSizing: 'border-box',
                overflowY: 'auto'
            }}>
                {selectedData && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Header Section */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 'bold' }}>{selectedData.title}</h2>
                                <div style={{ fontSize: '14px', color: '#888' }}>
                                    {selectedData.subTitle}
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedId(null)}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '24px', padding: '0 4px' }}
                            >✕</button>
                        </div>

                        {/* Price Section */}
                        <div style={{ padding: '20px', backgroundColor: '#F8F9FA', borderRadius: '12px', border: '1px solid #E9ECEF' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <div style={{ fontSize: '13px', color: '#868E96' }}>{selectedData.priceSection.averageLabel}</div>
                                
                                {selectedData.priceSection.options.length > 1 ? (
                                    <select
                                        value={priceOptionIndex}
                                        onChange={(e) => setPriceOptionIndex(Number(e.target.value))}
                                        style={{
                                            border: '1px solid #CED4DA',
                                            borderRadius: '4px',
                                            padding: '2px 8px',
                                            fontSize: '12px',
                                            backgroundColor: 'white',
                                            color: '#495057',
                                            cursor: 'pointer',
                                            outline: 'none'
                                        }}
                                    >
                                        {selectedData.priceSection.options.map((opt, idx) => (
                                            <option key={idx} value={idx}>{opt.unit}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <div style={{ border: '1px solid #CED4DA', borderRadius: '4px', padding: '2px 8px', fontSize: '12px', backgroundColor: 'white', color: '#495057', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {selectedData.priceSection.options[0].unit} ▾
                                    </div>
                                )}
                            </div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#5C7CFA' }}>
                                {selectedData.priceSection.options[priceOptionIndex].price}
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div>
                            <div style={{ display: 'flex', borderBottom: '1px solid #F1F3F5', paddingBottom: '8px', marginBottom: '12px', fontSize: '12px', color: '#868E96' }}>
                                <div style={{ flex: 1 }}>계약일</div>
                                <div style={{ flex: 1 }}>면적(공급)</div>
                                <div style={{ flex: 1, textAlign: 'right' }}>가격</div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {selectedData.recentTransactions.map((tx, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                                        <div style={{ flex: 1, color: '#495057' }}>{tx.date}</div>
                                        <div style={{ flex: 1, color: '#495057' }}>{tx.area}</div>
                                        <div style={{ flex: 1, textAlign: 'right' }}>
                                            <div style={{ fontWeight: 'bold' }}>{tx.price}</div>
                                            <div style={{ fontSize: '11px', color: '#868E96' }}>{tx.floor}</div>
                                        </div>
                                    </div>
                                ))}
                                {showMoreTransactions && selectedData.additionalTransactions?.map((tx, idx) => (
                                    <div key={`more-${idx}`} style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                                        <div style={{ flex: 1, color: '#495057' }}>{tx.date}</div>
                                        <div style={{ flex: 1, color: '#495057' }}>{tx.area}</div>
                                        <div style={{ flex: 1, textAlign: 'right' }}>
                                            <div style={{ fontWeight: 'bold' }}>{tx.price}</div>
                                            <div style={{ fontSize: '11px', color: '#868E96' }}>{tx.floor}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedData.additionalTransactions && (
                                <button 
                                    onClick={() => setShowMoreTransactions(!showMoreTransactions)}
                                    style={{ width: '100%', marginTop: '20px', padding: '12px', border: '1px solid #E9ECEF', borderRadius: '8px', backgroundColor: 'white', color: '#868E96', fontSize: '13px', cursor: 'pointer' }}
                                >
                                    {showMoreTransactions ? '접기 ⌃' : '더보기 ⌄'}
                                </button>
                            )}
                        </div>

                        {/* Architectural Plan */}
                        <div>
                             <div style={{ marginBottom: '12px' }}>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1864AB' }}>건축계획(안)</h3>
                                <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '4px', color: '#000' }}>가. 건축계획(안) 개요</div>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', borderTop: '2px solid #333', textAlign: 'center' }}>
                                <tbody style={{ backgroundColor: '#fff' }}>
                                    <tr style={{ backgroundColor: '#E7F5FF' }}>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', fontWeight: 'bold' }}>대지면적</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', backgroundColor: '#fff' }}>{selectedData.architecturalPlan.landArea}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', fontWeight: 'bold' }}>건축면적</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', backgroundColor: '#fff' }}>{selectedData.architecturalPlan.buildingArea}</td>
                                    </tr>
                                    <tr style={{ backgroundColor: '#E7F5FF' }}>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', fontWeight: 'bold' }}>연 면 적</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', backgroundColor: '#fff' }}>{selectedData.architecturalPlan.totalFloorArea}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', fontWeight: 'bold' }}>건 폐 율</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', backgroundColor: '#fff' }}>{selectedData.architecturalPlan.buildingCoverageRatio}</td>
                                    </tr>
                                    <tr style={{ backgroundColor: '#E7F5FF' }}>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', fontWeight: 'bold' }}>동 수</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', backgroundColor: '#fff' }}>{selectedData.architecturalPlan.numberOfBuildings}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', fontWeight: 'bold' }}>용 적 률</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', backgroundColor: '#fff', color: '#1864AB' }}>{selectedData.architecturalPlan.floorAreaRatio}</td>
                                    </tr>
                                    <tr style={{ backgroundColor: '#E7F5FF' }}>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', fontWeight: 'bold' }}>층 수</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', backgroundColor: '#fff' }}>{selectedData.architecturalPlan.floors}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', fontWeight: 'bold' }}>주차대수</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', backgroundColor: '#fff' }}>{selectedData.architecturalPlan.parkingSpaces}</td>
                                    </tr>
                                    <tr>
                                        {/* RowSpanned Cells for "Generations" */}
                                        <td style={{ padding: '0 8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', fontWeight: 'bold', backgroundColor: '#E7F5FF', verticalAlign: 'middle' }} rowSpan={selectedData.architecturalPlan.householdBreakdown.length + 1}>세 대 수</td>
                                        <td style={{ padding: '0 8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', fontWeight: 'bold', color: '#1864AB', verticalAlign: 'middle' }} rowSpan={selectedData.architecturalPlan.householdBreakdown.length + 1}>{selectedData.architecturalPlan.totalHouseholds}</td>
                                        
                                        {/* Nested Header */}
                                        <td style={{ padding: '4px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', backgroundColor: '#E7F5FF', fontWeight: 'bold', fontSize: '11px' }} colSpan={2}>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ flex: 1 }}>구분</div>
                                                <div style={{ flex: 1, borderLeft: '1px solid #DEE2E6' }}>전용</div>
                                                <div style={{ flex: 1, borderLeft: '1px solid #DEE2E6' }}>공급</div>
                                                <div style={{ flex: 1, borderLeft: '1px solid #DEE2E6' }}>조합</div>
                                                <div style={{ flex: 1, borderLeft: '1px solid #DEE2E6' }}>일반</div>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Breakdown Rows */}
                                    {selectedData.architecturalPlan.householdBreakdown.map((row, idx) => (
                                        <tr key={idx}>
                                            <td style={{ padding: '4px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', fontSize: '11px', textAlign: 'center', backgroundColor: '#E7F5FF' }} colSpan={2}>
                                                <div style={{ display: 'flex' }}>
                                                    <div style={{ flex: 1 }}>{row.type}</div>
                                                    <div style={{ flex: 1, borderLeft: '1px solid #DEE2E6', backgroundColor: '#fff' }}>{row.exclusiveArea}</div>
                                                    <div style={{ flex: 1, borderLeft: '1px solid #DEE2E6', backgroundColor: '#fff' }}>{row.supplyArea}</div>
                                                    <div style={{ flex: 1, borderLeft: '1px solid #DEE2E6', backgroundColor: '#fff' }}>{row.combination}</div>
                                                    <div style={{ flex: 1, borderLeft: '1px solid #DEE2E6', backgroundColor: '#fff' }}>{row.general}</div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ marginTop: '8px', fontSize: '11px', color: '#666', lineHeight: 1.4 }}>
                                ※ 건축계획(안)은 추정분담금 산정을 위한 개략 계획(안)으로 향후 사업추진 시 변경될 수 있음.
                            </div>
                        </div>

                        {/* Feasibility Analysis */}
                        <div>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>사업성 분석 검토 결과</h3>
                                <span style={{ fontSize: '11px', color: '#868E96' }}>(단위 : 백만원)</span>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', borderTop: '2px solid #333' }}>
                                <thead style={{ backgroundColor: '#F8F9FA' }}>
                                    <tr>
                                        <th style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', textAlign: 'center', fontWeight: 'normal', color: '#495057' }}>구 분</th>
                                        <th style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', textAlign: 'center', fontWeight: 'normal', color: '#495057', width: '80px' }}>금 액</th>
                                        <th style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', textAlign: 'center', fontWeight: 'normal', color: '#495057' }}>비 고</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', fontWeight: 'bold' }}>종전자산(A)</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', textAlign: 'right' }}>{selectedData.feasibilityAnalysis.preAsset}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', color: '#495057' }}>감정평가사의 가격자문 결과-현금청산분</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', fontWeight: 'bold' }}>종후자산(B)</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', textAlign: 'right' }}>{selectedData.feasibilityAnalysis.postAsset}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', color: '#495057' }}>조합분양가 = 일반주택 분양가</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', fontWeight: 'bold' }}>총 사업비(C)</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', textAlign: 'right' }}>{selectedData.feasibilityAnalysis.totalCost}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', color: '#495057' }} rowSpan={3}>
                                            <div>공사비 : 533만원/3.3㎡ (단순교체 가정 시, 실제 리모델링)</div>
                                            <div style={{ marginTop: '4px' }}>기타비용 : 공사비를 제외한 모든 비용</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', paddingLeft: '16px', color: '#495057' }}>공 사 비</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', textAlign: 'right' }}>{selectedData.feasibilityAnalysis.constructionCost}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', paddingLeft: '16px', color: '#495057' }}>기타비용</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', textAlign: 'right' }}>{selectedData.feasibilityAnalysis.otherCost}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', fontWeight: 'bold' }}>사업수익(D)</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', textAlign: 'right' }}>{selectedData.feasibilityAnalysis.profit}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', color: '#495057' }}>D = B - ( A + C )</td>
                                    </tr>
                                    <tr style={{ backgroundColor: '#F1F3F5' }}>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', fontWeight: 'bold', color: '#1864AB' }}>비 례 율(E)</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', textAlign: 'right', fontWeight: 'bold', color: '#1864AB' }}>{selectedData.feasibilityAnalysis.proportionalityRate}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #DEE2E6', color: '#1864AB' }}>E = [ ( B - C ) / A ] × 100%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Estimated Contribution Comparison */}
                        <div>
                             <div style={{ marginBottom: '12px' }}>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>사업성분석 검토 결과에 따른 세대별 추정 분담금 비교표</h3>
                                <div style={{ fontSize: '11px', color: '#868E96', textAlign: 'right', marginTop: '4px' }}>(단위 : 백만원)</div>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', borderTop: '2px solid #333', textAlign: 'center' }}>
                                <thead style={{ backgroundColor: '#CED4DA', fontWeight: 'bold' }}>
                                    <tr>
                                        <th style={{ padding: '4px', borderBottom: '1px solid #868E96', borderRight: '1px solid #868E96', verticalAlign: 'middle' }} rowSpan={2}>세대별</th>
                                        <th style={{ padding: '4px', borderBottom: '1px solid #868E96', borderRight: '1px solid #868E96', verticalAlign: 'middle', whiteSpace: 'pre-line' }} rowSpan={2}>추 정<br/>종전자산<br/>감 평 가<br/>(백만원)</th>
                                        <th style={{ padding: '4px', borderBottom: '1px solid #868E96', borderRight: '1px solid #868E96' }} colSpan={2}>권리가액[A]</th>
                                        <th style={{ padding: '4px', borderBottom: '1px solid #868E96', borderRight: '1px solid #868E96' }} colSpan={3}>조합원 분양가[B]</th>
                                        <th style={{ padding: '4px', borderBottom: '1px solid #868E96', borderRight: '1px solid #868E96', verticalAlign: 'middle', whiteSpace: 'pre-line' }} rowSpan={2}>분담금<br/>[C=B-A]<br/>(백만원)</th>
                                        <th style={{ padding: '4px', borderBottom: '1px solid #868E96', verticalAlign: 'middle' }} rowSpan={2}>비고</th>
                                    </tr>
                                    <tr>
                                        <th style={{ padding: '4px', borderBottom: '1px solid #868E96', borderRight: '1px solid #868E96' }}>비례율</th>
                                        <th style={{ padding: '4px', borderBottom: '1px solid #868E96', borderRight: '1px solid #868E96' }}>{selectedData.feasibilityAnalysis.proportionalityRate}</th>
                                        
                                        <th style={{ padding: '4px', borderBottom: '1px solid #868E96', borderRight: '1px solid #868E96' }}>타입</th>
                                        <th style={{ padding: '4px', borderBottom: '1px solid #868E96', borderRight: '1px solid #868E96', whiteSpace: 'pre-line' }}>공급<br/>(㎡)</th>
                                        <th style={{ padding: '4px', borderBottom: '1px solid #868E96', borderRight: '1px solid #868E96', whiteSpace: 'pre-line' }}>분양가<br/>(백만원)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedData.contributionComparisons.map((household, hIdx) => (
                                        <Fragment key={hIdx}>
                                            {/* First row of household */}
                                            <tr>
                                                <td style={{ padding: '4px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', backgroundColor: '#fff', whiteSpace: 'pre-line' }} rowSpan={household.variations.length}>{household.householdName}</td>
                                                <td style={{ padding: '4px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', backgroundColor: '#fff' }} rowSpan={household.variations.length}>{household.preAssetEval}</td>
                                                <td style={{ padding: '4px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', backgroundColor: '#fff' }} rowSpan={household.variations.length} colSpan={2}>{household.rightsValue}</td>
                                                
                                                <td style={{ padding: '4px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', backgroundColor: '#fff' }}>{household.variations[0].type}</td>
                                                <td style={{ padding: '4px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', backgroundColor: '#fff' }}>{household.variations[0].supplyArea}</td>
                                                <td style={{ padding: '4px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', backgroundColor: '#fff' }}>{household.variations[0].salePrice}</td>
                                                <td style={{ padding: '4px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', backgroundColor: '#FFD8A8', fontWeight: 'bold' }}>{household.variations[0].contribution}</td>
                                                <td style={{ padding: '4px', borderBottom: '1px solid #DEE2E6', backgroundColor: '#CED4DA' }} rowSpan={household.variations.length}></td>
                                            </tr>
                                            {/* Remaining rows of household */}
                                            {household.variations.slice(1).map((variation, vIdx) => (
                                                <tr key={`${hIdx}-${vIdx}`}>
                                                    <td style={{ padding: '4px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', backgroundColor: '#fff' }}>{variation.type}</td>
                                                    <td style={{ padding: '4px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', backgroundColor: '#fff' }}>{variation.supplyArea}</td>
                                                    <td style={{ padding: '4px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', backgroundColor: '#fff' }}>{variation.salePrice}</td>
                                                    <td style={{ padding: '4px', borderBottom: '1px solid #DEE2E6', borderRight: '1px solid #DEE2E6', backgroundColor: '#FFD8A8', fontWeight: 'bold' }}>{variation.contribution}</td>
                                                </tr>
                                            ))}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                             <div style={{ marginTop: '8px', fontSize: '11px', color: '#666', lineHeight: 1.4 }}>
                                ※ 추정 종전 자산가격 및 분양가(추정 종후 자산가격)는 감정평가사의 가격자문 결과로 추후 감정평가 시점 및 사업계획에 따라 변경될 수 있음
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <KaKaoMapBanJoon 
                height="100%"
                center={mapState.center} 
                level={mapState.level}
                customOverlays={customOverlays}
                polygons={polygons}
                onOverlayClick={handleOverlayClick}
                onCenterChange={(center) => setMapState(prev => ({ ...prev, center }))}
                onZoomChange={(level) => setMapState(prev => ({ ...prev, level }))}
            />
        </div>
    );
}