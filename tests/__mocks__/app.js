// Mock for #app (useNuxtApp, useState, useRouter, useCookie, navigateTo, etc.)
const ref = (v) => ({ value: v })
const reactive = (v) => v
const computed = (fn) => ({ get value() { return fn() } })
const readonly = (r) => r

module.exports = {
  useNuxtApp: () => ({
    $db: {},
    $auth: {},
    runWithContext: (fn) => fn(),
  }),
  useState: (key, init) => (typeof init === 'function' ? ref(init()) : ref(init)),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    currentRoute: { value: { path: '/' } },
  }),
  useRoute: () => ({ path: '/', params: {} }),
  useCookie: () => ref(null),
  navigateTo: jest.fn(),
  ref,
  reactive,
  computed,
  readonly,
  defineNuxtComponent: (c) => c,
}
