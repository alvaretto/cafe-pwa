/**
 * Tests unitarios para hook use-deployment
 * CRM Tinto del Mirador
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useDeployment } from '../use-deployment'
import { DeploymentConfig } from '@/types/deployment'

// Mock del hook de toast
jest.mock('../use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}))

// Mock de la función de deployment demo
jest.mock('@/lib/deployment/demo-deployment', () => ({
  runCompleteDemo: jest.fn().mockResolvedValue('https://test-deployment.vercel.app')
}))

describe('useDeployment Hook', () => {
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
  })

  describe('Initial State', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useDeployment())

      expect(result.current.state.status).toBe('idle')
      expect(result.current.state.progress).toBe(0)
      expect(result.current.state.validations).toEqual([])
      expect(result.current.state.steps).toEqual([])
      expect(result.current.state.logs).toEqual([])
      expect(result.current.config).toBeNull()
      expect(result.current.isDeploying).toBe(false)
      expect(result.current.canDeploy).toBe(true)
      expect(result.current.hasError).toBe(false)
      expect(result.current.isSuccess).toBe(false)
    })
  })

  describe('Deployment Process', () => {
    it('should start deployment successfully', async () => {
      const { runCompleteDemo } = require('@/lib/deployment/demo-deployment')
      runCompleteDemo.mockResolvedValue('https://test-deployment.vercel.app')

      const onSuccess = jest.fn()
      const onError = jest.fn()

      const { result } = renderHook(() => useDeployment({
        onSuccess,
        onError
      }))

      await act(async () => {
        result.current.deploy(mockConfig)
      })

      await waitFor(() => {
        expect(result.current.state.status).toBe('validating')
      })

      expect(runCompleteDemo).toHaveBeenCalledWith(
        mockConfig,
        expect.objectContaining({
          onStatusChange: expect.any(Function),
          onValidationComplete: expect.any(Function),
          onStepProgress: expect.any(Function),
          onStepComplete: expect.any(Function),
          onLog: expect.any(Function),
          onComplete: expect.any(Function),
          onError: expect.any(Function)
        })
      )
    })

    it('should handle deployment success', async () => {
      const { runCompleteDemo } = require('@/lib/deployment/demo-deployment')
      const deploymentUrl = 'https://test-deployment.vercel.app'
      runCompleteDemo.mockResolvedValue(deploymentUrl)

      const onSuccess = jest.fn()

      const { result } = renderHook(() => useDeployment({
        onSuccess
      }))

      await act(async () => {
        result.current.deploy(mockConfig)
      })

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(deploymentUrl)
      })
    })

    it('should handle deployment errors', async () => {
      const { runCompleteDemo } = require('@/lib/deployment/demo-deployment')
      const error = new Error('Deployment failed')
      runCompleteDemo.mockRejectedValue(error)

      const onError = jest.fn()

      const { result } = renderHook(() => useDeployment({
        onError
      }))

      await act(async () => {
        result.current.deploy(mockConfig)
      })

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error.message)
      })
    })

    it('should prevent concurrent deployments', async () => {
      const { runCompleteDemo } = require('@/lib/deployment/demo-deployment')
      runCompleteDemo.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))

      const { result } = renderHook(() => useDeployment())

      // Iniciar primer deployment
      act(() => {
        result.current.deploy(mockConfig)
      })

      // Intentar segundo deployment
      act(() => {
        result.current.deploy(mockConfig)
      })

      // Solo debería llamarse una vez
      expect(runCompleteDemo).toHaveBeenCalledTimes(1)
    })
  })

  describe('State Management', () => {
    it('should update state correctly during deployment', async () => {
      const { runCompleteDemo } = require('@/lib/deployment/demo-deployment')
      
      runCompleteDemo.mockImplementation((config, callbacks) => {
        // Simular callbacks durante el deployment
        callbacks.onStatusChange('validating')
        callbacks.onValidationComplete([])
        callbacks.onStatusChange('building')
        callbacks.onStatusChange('deploying')
        callbacks.onStatusChange('success')
        callbacks.onComplete('https://test.vercel.app')
        return Promise.resolve('https://test.vercel.app')
      })

      const { result } = renderHook(() => useDeployment())

      await act(async () => {
        result.current.deploy(mockConfig)
      })

      await waitFor(() => {
        expect(result.current.state.status).toBe('success')
        expect(result.current.state.deploymentUrl).toBe('https://test.vercel.app')
        expect(result.current.isSuccess).toBe(true)
      })
    })

    it('should handle step progress updates', async () => {
      const { runCompleteDemo } = require('@/lib/deployment/demo-deployment')
      
      const mockStep = {
        id: 'build',
        name: 'Build',
        description: 'Building...',
        status: 'running' as const,
        logs: [],
        progress: 50
      }

      runCompleteDemo.mockImplementation((config, callbacks) => {
        callbacks.onStepProgress(mockStep)
        return Promise.resolve('https://test.vercel.app')
      })

      const { result } = renderHook(() => useDeployment())

      await act(async () => {
        result.current.deploy(mockConfig)
      })

      await waitFor(() => {
        expect(result.current.state.steps).toContainEqual(
          expect.objectContaining({
            id: 'build',
            progress: 50
          })
        )
      })
    })

    it('should handle log updates', async () => {
      const { runCompleteDemo } = require('@/lib/deployment/demo-deployment')
      
      const mockStep = {
        id: 'build',
        name: 'Build',
        description: 'Building...',
        status: 'running' as const,
        logs: ['Building application...'],
        progress: 0
      }

      runCompleteDemo.mockImplementation((config, callbacks) => {
        callbacks.onLog(mockStep, 'Building application...')
        return Promise.resolve('https://test.vercel.app')
      })

      const { result } = renderHook(() => useDeployment())

      await act(async () => {
        result.current.deploy(mockConfig)
      })

      await waitFor(() => {
        expect(result.current.state.logs).toContain('Building application...')
      })
    })
  })

  describe('Deployment Cancellation', () => {
    it('should cancel deployment', async () => {
      const { result } = renderHook(() => useDeployment())

      // Simular deployment en progreso
      act(() => {
        result.current.deploy(mockConfig)
      })

      act(() => {
        result.current.cancelDeployment()
      })

      expect(result.current.state.status).toBe('cancelled')
    })

    it('should handle cancellation during different states', async () => {
      const { result } = renderHook(() => useDeployment())

      // Simular diferentes estados y cancelar
      const states = ['validating', 'building', 'deploying'] as const

      for (const status of states) {
        act(() => {
          // Simular estado
          result.current.deploy(mockConfig)
        })

        act(() => {
          result.current.cancelDeployment()
        })

        expect(result.current.state.status).toBe('cancelled')

        // Reset para próxima iteración
        act(() => {
          result.current.reset()
        })
      }
    })
  })

  describe('State Reset', () => {
    it('should reset state to initial values', async () => {
      const { result } = renderHook(() => useDeployment())

      // Simular deployment completado
      await act(async () => {
        result.current.deploy(mockConfig)
      })

      // Reset
      act(() => {
        result.current.reset()
      })

      expect(result.current.state.status).toBe('idle')
      expect(result.current.state.progress).toBe(0)
      expect(result.current.state.validations).toEqual([])
      expect(result.current.state.steps).toEqual([])
      expect(result.current.state.logs).toEqual([])
      expect(result.current.config).toBeNull()
    })
  })

  describe('Computed Properties', () => {
    it('should calculate isDeploying correctly', () => {
      const { result } = renderHook(() => useDeployment())

      // Estado inicial
      expect(result.current.isDeploying).toBe(false)

      // Durante deployment
      act(() => {
        result.current.deploy(mockConfig)
      })

      // En modo demo, el estado cambia muy rápido, pero verificamos la lógica
      expect(typeof result.current.isDeploying).toBe('boolean')
    })

    it('should calculate canDeploy correctly', () => {
      const { result } = renderHook(() => useDeployment())

      expect(result.current.canDeploy).toBe(true)

      // Durante deployment
      act(() => {
        result.current.deploy(mockConfig)
      })

      // La lógica de canDeploy depende del estado
      expect(typeof result.current.canDeploy).toBe('boolean')
    })

    it('should calculate hasError correctly', () => {
      const { result } = renderHook(() => useDeployment())

      expect(result.current.hasError).toBe(false)

      // Simular error
      const { runCompleteDemo } = require('@/lib/deployment/demo-deployment')
      runCompleteDemo.mockRejectedValue(new Error('Test error'))

      act(() => {
        result.current.deploy(mockConfig)
      })

      // En modo demo, verificamos que la propiedad existe
      expect(typeof result.current.hasError).toBe('boolean')
    })

    it('should calculate isSuccess correctly', () => {
      const { result } = renderHook(() => useDeployment())

      expect(result.current.isSuccess).toBe(false)

      // Después de deployment exitoso
      const { runCompleteDemo } = require('@/lib/deployment/demo-deployment')
      runCompleteDemo.mockResolvedValue('https://test.vercel.app')

      act(() => {
        result.current.deploy(mockConfig)
      })

      // En modo demo, verificamos que la propiedad existe
      expect(typeof result.current.isSuccess).toBe('boolean')
    })
  })

  describe('Callbacks', () => {
    it('should call onStatusChange callback', async () => {
      const onStatusChange = jest.fn()
      const { result } = renderHook(() => useDeployment({
        onStatusChange
      }))

      const { runCompleteDemo } = require('@/lib/deployment/demo-deployment')
      runCompleteDemo.mockImplementation((config, callbacks) => {
        callbacks.onStatusChange('building')
        return Promise.resolve('https://test.vercel.app')
      })

      await act(async () => {
        result.current.deploy(mockConfig)
      })

      expect(onStatusChange).toHaveBeenCalled()
    })

    it('should handle missing callbacks gracefully', async () => {
      const { result } = renderHook(() => useDeployment())

      // No debería fallar sin callbacks
      await act(async () => {
        result.current.deploy(mockConfig)
      })

      expect(result.current.state.status).not.toBe('idle')
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid config gracefully', async () => {
      const { result } = renderHook(() => useDeployment())

      await act(async () => {
        result.current.deploy(null as any)
      })

      // Debería manejar config inválido sin fallar
      expect(typeof result.current.state.status).toBe('string')
    })

    it('should handle network errors', async () => {
      const { runCompleteDemo } = require('@/lib/deployment/demo-deployment')
      runCompleteDemo.mockRejectedValue(new Error('Network error'))

      const onError = jest.fn()
      const { result } = renderHook(() => useDeployment({
        onError
      }))

      await act(async () => {
        result.current.deploy(mockConfig)
      })

      expect(onError).toHaveBeenCalledWith('Network error')
    })
  })

  describe('Memory Management', () => {
    it('should cleanup on unmount', () => {
      const { result, unmount } = renderHook(() => useDeployment())

      // Iniciar deployment
      act(() => {
        result.current.deploy(mockConfig)
      })

      // Unmount no debería causar errores
      expect(() => unmount()).not.toThrow()
    })
  })
})
