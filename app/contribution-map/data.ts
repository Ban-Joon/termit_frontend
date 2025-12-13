export interface Transaction {
    date: string;
    area: number;
    price: string;
    floor: string;
    note?: string;
}

export interface ArchitecturalPlan {
    landArea: string;
    buildingArea: string;
    totalFloorArea: string;
    buildingCoverageRatio: string;
    numberOfBuildings: string;
    floorAreaRatio: string;
    floors: string;
    parkingSpaces: string;
    totalHouseholds: string;
    householdBreakdown: {
        type: string;
        exclusiveArea: string;
        supplyArea: string;
        combination: string;
        general: string;
    }[];
}

export interface FeasibilityAnalysis {
    preAsset: string; // 종전자산(A)
    postAsset: string; // 종후자산(B)
    totalCost: string; // 총 사업비(C)
    constructionCost: string; // 공사비
    otherCost: string; // 기타비용
    profit: string; // 사업수익(D)
    proportionalityRate: string; // 비례율(E)
}

export interface ContributionComparison {
    householdName: string;
    preAssetEval: string; // 추정 종전자산 감 평가
    rightsValue: string; // 권리가액[A]
    variations: {
        type: string;
        supplyArea: string;
        salePrice: string; // 분양가[B]
        contribution: string; // 분담금[C=B-A]
    }[];
}

export interface SidebarData {
    id: string;
    title: string;
    subTitle: string; // e.g. "339세대 | 2000년 4월(26년차)"
    priceSection: {
        averageLabel: string; // "최근 실거래 기준 1개월 평균"
        options: { unit: string; price: string }[];
    };
    recentTransactions: Transaction[];
    additionalTransactions?: Transaction[];
    architecturalPlan: ArchitecturalPlan;
    feasibilityAnalysis: FeasibilityAnalysis;
    contributionComparisons: ContributionComparison[];
}

export const MOCK_SIDEBAR_DATA: SidebarData[] = [
    {
        id: 'samsung-lotte',
        title: '서울특별시 강남구 삼성동 17',
        subTitle: '339세대 | 2000년 4월(26년차)',
        priceSection: {
            averageLabel: '최근 실거래 기준 1개월 평균',
            options: [
                { unit: '37평', price: '28억 7,000' },
                { unit: '24평', price: '20억 5,000' }
            ]
        },
        recentTransactions: [
            {
                date: '25.07.16',
                area: 122,
                price: '28억 7,000',
                floor: '101동/19층'
            },
            {
                date: '25.06.24',
                area: 122,
                price: '27억 5,850',
                floor: '경매'
            }
        ],
        additionalTransactions: [
            {
                date: '25.05.05',
                area: 122,
                price: '26억 5,000',
                floor: '102동/5층'
            },
            {
                date: '25.04.10',
                area: 122,
                price: '27억 3,000',
                floor: '103동/11층'
            }
        ],
        architecturalPlan: {
            landArea: '5,263.80㎡',
            buildingArea: '2,075.46㎡',
            totalFloorArea: '16,316.68㎡',
            buildingCoverageRatio: '39.43%',
            numberOfBuildings: '아파트 2동',
            floorAreaRatio: '190.19%',
            floors: '지하2/지상7층',
            parkingSpaces: '118대',
            totalHouseholds: '106세대',
            householdBreakdown: [
                { type: '25.8평형', exclusiveArea: '67.10', supplyArea: '85.25', combination: '', general: '20' },
                { type: '26.9평형', exclusiveArea: '70.10', supplyArea: '89.07', combination: '54', general: '' },
                { type: '30평형', exclusiveArea: '79.15', supplyArea: '99.77', combination: '6', general: '' },
                { type: '32.3평형A', exclusiveArea: '84.92', supplyArea: '106.68', combination: '', general: '19' },
                { type: '32.3평형B', exclusiveArea: '84.96', supplyArea: '106.77', combination: '', general: '7' }
            ]
        },
        feasibilityAnalysis: {
            preAsset: '27,079',
            postAsset: '60,351',
            totalCost: '32,498',
            constructionCost: '26,328',
            otherCost: '6,170',
            profit: '774',
            proportionalityRate: '102.86%'
        },
        contributionComparisons: [
            {
                householdName: '54번지\n1동',
                preAssetEval: '453',
                rightsValue: '465,679,000',
                variations: [
                    { type: '25.8평형', supplyArea: '85.25', salePrice: '531', contribution: '65' },
                    { type: '26.9평형', supplyArea: '89.07', salePrice: '554', contribution: '88' },
                    { type: '30평형', supplyArea: '99.77', salePrice: '595', contribution: '129' },
                    { type: '32.3 A형', supplyArea: '106.68', salePrice: '625', contribution: '159' },
                    { type: '32.3 B형', supplyArea: '106.77', salePrice: '625', contribution: '159' }
                ]
            },
            {
                householdName: '54-3번지\n2동',
                preAssetEval: '448',
                rightsValue: '461,262,000',
                variations: [
                    { type: '25.8평형', supplyArea: '85.25', salePrice: '531', contribution: '70' },
                    { type: '26.9평형', supplyArea: '89.07', salePrice: '554', contribution: '93' },
                    { type: '30평형', supplyArea: '99.77', salePrice: '595', contribution: '134' },
                    { type: '32.3 A형', supplyArea: '106.68', salePrice: '625', contribution: '164' },
                    { type: '32.3 B형', supplyArea: '106.77', salePrice: '625', contribution: '164' }
                ]
            },
            {
                householdName: '54-4번지\n3동',
                preAssetEval: '445',
                rightsValue: '457,898,000',
                variations: [
                    { type: '25.8평형', supplyArea: '85.25', salePrice: '531', contribution: '73' },
                    { type: '26.9평형', supplyArea: '89.07', salePrice: '554', contribution: '96' },
                    { type: '30평형', supplyArea: '99.77', salePrice: '595', contribution: '137' },
                    { type: '32.3 A형', supplyArea: '106.68', salePrice: '625', contribution: '167' },
                    { type: '32.3 B형', supplyArea: '106.77', salePrice: '625', contribution: '167' }
                ]
            },
            {
                householdName: '54-5번지\n4동',
                preAssetEval: '463',
                rightsValue: '476,730,000',
                variations: [
                    { type: '25.8평형', supplyArea: '85.25', salePrice: '531', contribution: '54' },
                    { type: '26.9평형', supplyArea: '89.07', salePrice: '554', contribution: '77' },
                    { type: '30평형', supplyArea: '99.77', salePrice: '595', contribution: '118' },
                    { type: '32.3 A형', supplyArea: '106.68', salePrice: '625', contribution: '148' },
                    { type: '32.3 B형', supplyArea: '106.77', salePrice: '625', contribution: '148' }
                ]
            }
        ]
    },
    {
        id: 'nonhyeon-paragon',
        title: '서울특별시 강남구 논현동 246',
        subTitle: '203세대 | 2004년 08월(22년차)',
        priceSection: {
            averageLabel: '최근 실거래 기준 1개월 평균',
            options: [
                { unit: '56평', price: '35억 0,000' }
            ]
        },
        recentTransactions: [
            {
                date: '25.07.01',
                area: 185,
                price: '35억 0,000',
                floor: '101동/10층'
            },
            {
                date: '25.05.20',
                area: 185,
                price: '34억 5,000',
                floor: '101동/5층'
            }
        ],
        architecturalPlan: {
            landArea: '8,000.00㎡',
            buildingArea: '3,000.00㎡',
            totalFloorArea: '25,000.00㎡',
            buildingCoverageRatio: '40.00%',
            numberOfBuildings: '아파트 4동',
            floorAreaRatio: '250.00%',
            floors: '지하2/지상15층',
            parkingSpaces: '300대',
            totalHouseholds: '203세대',
            householdBreakdown: [
                { type: '56평형', exclusiveArea: '145.00', supplyArea: '185.00', combination: '100', general: '0' },
                { type: '60평형', exclusiveArea: '160.00', supplyArea: '200.00', combination: '103', general: '0' }
            ]
        },
        feasibilityAnalysis: {
            preAsset: '30,000',
            postAsset: '70,000',
            totalCost: '40,000',
            constructionCost: '30,000',
            otherCost: '10,000',
            profit: '0',
            proportionalityRate: '100.00%'
        },
        contributionComparisons: [
            {
                householdName: '101동\n101호',
                preAssetEval: '500',
                rightsValue: '500,000,000',
                variations: [
                    { type: '56평형', supplyArea: '185.00', salePrice: '600', contribution: '100' }
                ]
            }
        ]
    },
    {
        id: 'hongjewon-hyundai',
        title: '서울특별시 서대문구 홍제동 453',
        subTitle: '339세대 | 1999년 10월(26년차)',
        priceSection: {
            averageLabel: '최근 실거래 기준 1개월 평균',
            options: [
                { unit: '34평', price: '9억 5,000' }
            ]
        },
        recentTransactions: [
            {
                date: '25.06.15',
                area: 114,
                price: '9억 5,000',
                floor: '105동/12층'
            },
            {
                date: '25.04.10',
                area: 114,
                price: '9억 2,000',
                floor: '105동/8층'
            }
        ],
        architecturalPlan: {
            landArea: '12,000.00㎡',
            buildingArea: '4,500.00㎡',
            totalFloorArea: '35,000.00㎡',
            buildingCoverageRatio: '38.00%',
            numberOfBuildings: '아파트 6동',
            floorAreaRatio: '230.00%',
            floors: '지하2/지상18층',
            parkingSpaces: '400대',
            totalHouseholds: '339세대',
            householdBreakdown: [
                { type: '34평형', exclusiveArea: '84.00', supplyArea: '114.00', combination: '200', general: '0' },
                { type: '42평형', exclusiveArea: '102.00', supplyArea: '138.00', combination: '139', general: '0' }
            ]
        },
        feasibilityAnalysis: {
            preAsset: '20,000',
            postAsset: '50,000',
            totalCost: '25,000',
            constructionCost: '18,000',
            otherCost: '7,000',
            profit: '0',
            proportionalityRate: '105.00%'
        },
        contributionComparisons: [
            {
                householdName: '105동\n1201호',
                preAssetEval: '450',
                rightsValue: '472,500,000',
                variations: [
                    { type: '34평형', supplyArea: '114.00', salePrice: '550', contribution: '77' }
                ]
            }
        ]
    }
];
