import { reactive } from 'vue'

// opinion: 'buy'(매수) | 'sell'(매도) | 'hold'(관망)
export default reactive([
    {
        writer: '이진형1',
        stock: '삼성전자',
        opinion: 'buy',
        title: 'HBM 납품 기대감, 지금이 저점 매수 구간일까요?',
        content: '외국인 순매수가 3일 연속 들어오고 있습니다. 반도체 업황 바닥 신호로 보고 분할 매수 들어갑니다.'
    },
    {
        writer: '이진형2',
        stock: 'NVIDIA',
        opinion: 'hold',
        title: '실적 발표 앞두고 관망합니다',
        content: '기대치가 너무 높아진 상태라 실적 확인 후 대응하려고 합니다. 변동성 주의하세요.'
    },
    {
        writer: '이진형3',
        stock: '카카오',
        opinion: 'sell',
        title: '박스권 상단 도달, 일부 차익 실현',
        content: '거래량 없이 올라온 반등이라 일부 물량 정리했습니다. 지지선 이탈 시 추가 매도 예정.'
    },
])
