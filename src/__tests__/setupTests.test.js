// src/__tests__/setupTests.test.js
import { describe, it, expect } from 'vitest'

describe('Test Setup', () => {
  it('should be able to run tests', () => {
    expect(true).toBe(true)
  })

  it('should have Chrome API mocked', () => {
    expect(chrome).toBeDefined()
    expect(chrome.runtime).toBeDefined()
    expect(chrome.storage).toBeDefined()
  })

  it('should have testing library globals available', () => {
    expect(vi).toBeDefined() // Vitest's vi global
  })
})