/**
 * Tests unitarios para hook use-deployment-config
 * CRM Tinto del Mirador
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useDeploymentConfig } from '../use-deployment-config'
import { DeploymentConfig, HostingPlatform } from '@/types/deployment'

// Mock del hook de toast
jest.mock('../use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}))

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock de la función de demo config
jest.mock('@/lib/deployment/demo-deployment', () => ({
  createDemoConfig: jest.fn(() => ({
    id: 'demo-config',
    name: 'Demo Config',
    platform: 'vercel',
    isDefault: true,
    settings: {
      vercel: {
        token: 'demo-token'
      },
      environmentVariables: {}
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }))
}))

describe('useDeploymentConfig Hook', () => {
  const mockConfig: DeploymentConfig = {
    id: 'test-config',
    name: 'Test Config',
    platform: 'vercel',
    isDefault: true,
    settings: {
      vercel: {
        token: 'test-token',
        projectId: 'test-project'
      },
      environmentVariables: {
        NODE_ENV: 'production'
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('Initial State', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useDeploymentConfig())

      expect(result.current.wizard.currentStep).toBe(0)
      expect(result.current.wizard.totalSteps).toBe(5)
      expect(result.current.wizard.completed).toBe(false)
      expect(result.current.configs).toEqual([])
      expect(result.current.activeConfig).toBeNull()
      expect(result.current.loading).toBe(false)
      expect(result.current.hasConfigs).toBe(false)
      expect(result.current.isWizardCompleted).toBe(false)
      expect(result.current.canDeploy).toBe(false)
    })

    it('should load configs from localStorage', async () => {
      const savedConfigs = [mockConfig]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedConfigs))

      const { result } = renderHook(() => useDeploymentConfig())

      await waitFor(() => {
        expect(result.current.configs).toEqual(savedConfigs)
        expect(result.current.activeConfig).toEqual(mockConfig)
        expect(result.current.hasConfigs).toBe(true)
      })
    })

    it('should create demo config when no configs exist', async () => {
      const { createDemoConfig } = require('@/lib/deployment/demo-deployment')
      
      const { result } = renderHook(() => useDeploymentConfig())

      await waitFor(() => {
        expect(createDemoConfig).toHaveBeenCalled()
        expect(result.current.configs).toHaveLength(1)
        expect(result.current.activeConfig).not.toBeNull()
      })
    })
  })

  describe('Configuration Management', () => {
    it('should create new configuration', async () => {
      const { result } = renderHook(() => useDeploymentConfig())

      await act(async () => {
        const newConfig = result.current.createConfig(
          'New Config',
          'netlify',
          {
            netlify: {
              token: 'netlify-token',
              siteId: 'site-id'
            },
            environmentVariables: {}
          }
        )

        expect(newConfig.name).toBe('New Config')
        expect(newConfig.platform).toBe('netlify')
        expect(newConfig.isDefault).toBe(true) // First config is default
      })

      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('should update existing configuration', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockConfig]))
      
      const { result } = renderHook(() => useDeploymentConfig())

      await waitFor(() => {
        expect(result.current.configs).toHaveLength(1)
      })

      await act(async () => {
        result.current.updateConfig(mockConfig.id, {
          name: 'Updated Config'
        })
      })

      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('should delete configuration', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockConfig]))
      
      const { result } = renderHook(() => useDeploymentConfig())

      await waitFor(() => {
        expect(result.current.configs).toHaveLength(1)
      })

      await act(async () => {
        result.current.deleteConfig(mockConfig.id)
      })

      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('should set default configuration', async () => {
      const config2 = { ...mockConfig, id: 'config-2', isDefault: false }
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockConfig, config2]))
      
      const { result } = renderHook(() => useDeploymentConfig())

      await waitFor(() => {
        expect(result.current.configs).toHaveLength(2)
      })

      await act(async () => {
        result.current.setDefaultConfig('config-2')
      })

      expect(localStorageMock.setItem).toHaveBeenCalled()
    })
  })

  describe('Wizard Management', () => {
    it('should navigate wizard steps', async () => {
      const { result } = renderHook(() => useDeploymentConfig())

      // Next step
      await act(async () => {
        result.current.nextWizardStep()
      })

      expect(result.current.wizard.currentStep).toBe(1)

      // Previous step
      await act(async () => {
        result.current.previousWizardStep()
      })

      expect(result.current.wizard.currentStep).toBe(0)
    })

    it('should not go beyond wizard bounds', async () => {
      const { result } = renderHook(() => useDeploymentConfig())

      // Try to go before first step
      await act(async () => {
        result.current.previousWizardStep()
      })

      expect(result.current.wizard.currentStep).toBe(0)

      // Go to last step
      for (let i = 0; i < 5; i++) {
        await act(async () => {
          result.current.nextWizardStep()
        })
      }

      expect(result.current.wizard.currentStep).toBe(4) // Last step
    })

    it('should update wizard step', async () => {
      const { result } = renderHook(() => useDeploymentConfig())

      await act(async () => {
        result.current.updateWizardStep('platform', {
          completed: true
        })
      })

      expect(result.current.wizard.steps.platform.completed).toBe(true)
    })

    it('should complete wizard', async () => {
      const { result } = renderHook(() => useDeploymentConfig())

      await act(async () => {
        result.current.completeWizard()
      })

      expect(result.current.wizard.completed).toBe(true)
      expect(result.current.isWizardCompleted).toBe(true)
    })

    it('should reset wizard', async () => {
      const { result } = renderHook(() => useDeploymentConfig())

      // Complete wizard first
      await act(async () => {
        result.current.completeWizard()
      })

      expect(result.current.wizard.completed).toBe(true)

      // Reset wizard
      await act(async () => {
        result.current.resetWizard()
      })

      expect(result.current.wizard.completed).toBe(false)
      expect(result.current.wizard.currentStep).toBe(0)
    })
  })

  describe('Platform Detection', () => {
    it('should detect platform', async () => {
      const { result } = renderHook(() => useDeploymentConfig())

      await act(async () => {
        const platform = await result.current.detectPlatform()
        expect(['vercel', 'netlify', null]).toContain(platform)
      })
    })

    it('should check CLI availability', async () => {
      const { result } = renderHook(() => useDeploymentConfig())

      await act(async () => {
        const isAvailable = await result.current.checkCLI('vercel')
        expect(typeof isAvailable).toBe('boolean')
      })
    })

    it('should validate token', async () => {
      const { result } = renderHook(() => useDeploymentConfig())

      await act(async () => {
        const isValid = await result.current.validateToken('vercel', 'test-token')
        expect(typeof isValid).toBe('boolean')
      })
    })
  })

  describe('Environment Variables', () => {
    const originalEnv = process.env

    beforeEach(() => {
      process.env = { ...originalEnv }
    })

    afterEach(() => {
      process.env = originalEnv
    })

    it('should check environment variables', () => {
      process.env.TEST_VAR = 'test-value'
      process.env.ANOTHER_VAR = 'another-value'

      const { result } = renderHook(() => useDeploymentConfig())

      const envCheck = result.current.checkEnvironmentVariables()
      
      expect(typeof envCheck.configured).toBe('boolean')
      expect(Array.isArray(envCheck.missing)).toBe(true)
    })

    it('should detect missing environment variables', () => {
      delete process.env.DATABASE_URL
      delete process.env.NEXTAUTH_SECRET

      const { result } = renderHook(() => useDeploymentConfig())

      const envCheck = result.current.checkEnvironmentVariables()
      
      expect(envCheck.configured).toBe(false)
      expect(envCheck.missing.length).toBeGreaterThan(0)
    })
  })

  describe('Computed Properties', () => {
    it('should calculate hasConfigs correctly', async () => {
      const { result } = renderHook(() => useDeploymentConfig())

      expect(result.current.hasConfigs).toBe(false)

      await act(async () => {
        result.current.createConfig('Test Config', 'vercel', {})
      })

      expect(result.current.hasConfigs).toBe(true)
    })

    it('should calculate canDeploy correctly', async () => {
      const { result } = renderHook(() => useDeploymentConfig())

      expect(result.current.canDeploy).toBe(false)

      // Complete wizard and add config
      await act(async () => {
        result.current.completeWizard()
        result.current.createConfig('Test Config', 'vercel', {})
      })

      expect(result.current.canDeploy).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      const { result } = renderHook(() => useDeploymentConfig())

      expect(() => {
        act(() => {
          result.current.createConfig('Test Config', 'vercel', {})
        })
      }).not.toThrow()
    })

    it('should handle invalid stored data', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json')

      const { result } = renderHook(() => useDeploymentConfig())

      expect(result.current.configs).toEqual([])
    })

    it('should handle network errors in platform detection', async () => {
      const { result } = renderHook(() => useDeploymentConfig())

      await act(async () => {
        const platform = await result.current.detectPlatform()
        // Should not throw and return a valid result
        expect(typeof platform === 'string' || platform === null).toBe(true)
      })
    })
  })

  describe('Loading States', () => {
    it('should manage loading state during platform detection', async () => {
      const { result } = renderHook(() => useDeploymentConfig())

      expect(result.current.loading).toBe(false)

      const detectionPromise = act(async () => {
        return result.current.detectPlatform()
      })

      // Loading should be true during detection
      expect(result.current.loading).toBe(true)

      await detectionPromise

      // Loading should be false after detection
      expect(result.current.loading).toBe(false)
    })
  })

  describe('Memory Management', () => {
    it('should cleanup on unmount', () => {
      const { result, unmount } = renderHook(() => useDeploymentConfig())

      // Create some state
      act(() => {
        result.current.createConfig('Test Config', 'vercel', {})
      })

      // Unmount should not cause errors
      expect(() => unmount()).not.toThrow()
    })
  })
})
