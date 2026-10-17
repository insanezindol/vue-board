import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

// 모듈 단위 데이터(src/data)를 테스트마다 초기화하기 위해 매번 새로 import
async function mountApp(path = '/') {
  vi.resetModules()
  window.location.hash = ''
  const { default: App } = await import('@/App.vue')
  const { default: router } = await import('@/router')
  router.push(path)
  await router.isReady()
  // jsdom 은 canvas 를 지원하지 않으므로 배경 연출은 stub 처리
  const wrapper = mount(App, { global: { plugins: [router], stubs: { MarketBackground: true } } })
  await flushPromises()
  return { wrapper, router }
}

// [의견, 종목, 제목, 글쓴이]
const rows = wrapper => wrapper.findAll('tbody tr').map(tr => {
  const td = tr.findAll('td')
  return [td[0].text().slice(2), td[1].find('div').text(), td[2].find('div').text(), td[3].text()]
})

const click = async el => {
  await el.trigger('click')
  await flushPromises()
}
const buttonByText = (wrapper, text) => wrapper.findAll('button').find(b => b.text() === text)

describe('vue-board', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('목록에 초기 게시글 3개가 표시된다', async () => {
    const { wrapper } = await mountApp()
    expect(rows(wrapper)).toEqual([
      ['매수', '삼성전자', 'HBM 납품 기대감, 지금이 저점 매수 구간일까요?', '이진형1'],
      ['관망', 'NVIDIA', '실적 발표 앞두고 관망합니다', '이진형2'],
      ['매도', '카카오', '박스권 상단 도달, 일부 차익 실현', '이진형3']
    ])
  })

  it('글쓰기 → 작성 시 목록에 추가된다', async () => {
    const { wrapper, router } = await mountApp()
    await click(buttonByText(wrapper, '✎ 글쓰기'))
    expect(router.currentRoute.value.path).toBe('/create')
    expect(wrapper.find('[data-test="submit"]').text()).toBe('작성')

    await wrapper.find('#stock').setValue('SK하이닉스')
    await wrapper.find('input[type="radio"][value="sell"]').setValue()
    await wrapper.find('#writer').setValue('새글쓴이')
    await wrapper.find('#title').setValue('새제목')
    await wrapper.find('#content').setValue('새내용')
    await click(wrapper.find('[data-test="submit"]'))

    expect(router.currentRoute.value.path).toBe('/')
    expect(rows(wrapper)).toHaveLength(4)
    expect(rows(wrapper)[3]).toEqual(['매도', 'SK하이닉스', '새제목', '새글쓴이'])
  })

  it('목록 클릭 → 상세 → 수정 시 해당 글이 변경된다', async () => {
    const { wrapper, router } = await mountApp()
    await click(wrapper.findAll('tbody tr')[1])
    expect(router.currentRoute.value.path).toBe('/detail/1')
    expect(wrapper.text()).toContain('실적 발표 앞두고 관망합니다')

    await click(buttonByText(wrapper, '수정'))
    expect(router.currentRoute.value.path).toBe('/create/1')
    expect(wrapper.find('#title').element.value).toBe('실적 발표 앞두고 관망합니다')
    expect(wrapper.find('#stock').element.value).toBe('NVIDIA')
    expect(wrapper.find('input[type="radio"][value="hold"]').element.checked).toBe(true)
    expect(wrapper.find('[data-test="submit"]').text()).toBe('수정')

    await wrapper.find('#title').setValue('수정된제목')
    await wrapper.find('input[type="radio"][value="buy"]').setValue()
    await click(wrapper.find('[data-test="submit"]'))

    expect(router.currentRoute.value.path).toBe('/')
    expect(rows(wrapper)).toHaveLength(3)
    expect(rows(wrapper)[1]).toEqual(['매수', 'NVIDIA', '수정된제목', '이진형2'])
  })

  it('상세 → 삭제 시 해당 글이 목록에서 제거된다', async () => {
    const { wrapper, router } = await mountApp('/detail/0')
    expect(wrapper.text()).toContain('HBM 납품 기대감')
    await click(buttonByText(wrapper, '삭제'))

    expect(router.currentRoute.value.path).toBe('/')
    expect(rows(wrapper).map(r => r[1])).toEqual(['NVIDIA', '카카오'])
  })

  it('존재하지 않는 글은 안내 화면을 보여준다', async () => {
    const { wrapper } = await mountApp('/detail/99')
    expect(wrapper.text()).toContain('게시글을 찾을 수 없습니다')
  })
})
