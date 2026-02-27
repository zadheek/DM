// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock fetch API
global.fetch = jest.fn()

// Mock next-auth for testing
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Mock geolocation API
global.navigator.geolocation = {
  getCurrentPosition: jest.fn((success) =>
    success({
      coords: {
        latitude: 6.9271,
        longitude: 79.8612,
      },
    })
  ),
}

// Reset mocks between tests
beforeEach(() => {
  global.fetch.mockClear()
})
