import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import NavBar from '~/components/NavBar.vue'

const mockLogout = jest.fn()
jest.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    user: ref({ name: 'Test User', role: 'admin' }),
    logout: mockLogout,
    isAdmin: ref(true),
  }),
}))

describe('NavBar', () => {
  it('renders Shift Scheduler brand link', () => {
    const wrapper = mount(NavBar, {
      global: {
        stubs: { NuxtLink: { template: '<a><slot /></a>', props: ['to'] } },
      },
    })
    expect(wrapper.text()).toContain('Shift Scheduler')
  })

  it('shows Manage Shifts and Manage Users when user is admin', () => {
    const wrapper = mount(NavBar, {
      global: {
        stubs: { NuxtLink: { template: '<a><slot /></a>', props: ['to'] } },
      },
    })
    expect(wrapper.text()).toContain('Manage Shifts')
    expect(wrapper.text()).toContain('Manage Users')
  })

  it('shows user name and Logout button', () => {
    const wrapper = mount(NavBar, {
      global: {
        stubs: { NuxtLink: { template: '<a><slot /></a>', props: ['to'] } },
      },
    })
    expect(wrapper.text()).toContain('Test User')
    expect(wrapper.text()).toContain('admin')
    const logoutBtn = wrapper.find('button')
    expect(logoutBtn.text()).toBe('Logout')
    logoutBtn.trigger('click')
    expect(mockLogout).toHaveBeenCalled()
  })
})
