/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: false }],
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
    '^@/(.*)$': '<rootDir>/$1',
    '^#app$': '<rootDir>/tests/__mocks__/app.js',
    '^#imports$': '<rootDir>/tests/__mocks__/imports.js',
    '^@vue/test-utils$': '<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js',
  },
  testMatch: [
    '**/tests/unit/**/*.test.[jt]s',
    '**/tests/unit/**/*.spec.[jt]s',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  collectCoverageFrom: [
    'components/**/*.{vue,ts}',
    'composables/**/*.ts',
    'pages/**/*.{vue,ts}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  transformIgnorePatterns: [
    'node_modules/(?!(@nuxt|nuxt)/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '.nuxt/', 'dist/'],
}
