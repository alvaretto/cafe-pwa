/**
 * Tests unitarios para DeploymentPanel
 * CRM Tinto del Mirador
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeploymentPanel, DeploymentPanelCompact } from '../deployment-panel'

// Mock de hooks
jest.mock('@/hooks/use-deployment', () => ({
  useDeployment: jest.fn(() => ({
    state: {
      status: 'idle',
      progress: 0,
      validations: [],
      steps: [],
      logs: [],
      deploymentUrl: null,
      error: null
    },
    deploy: jest.fn(),
    cancelDeployment: jest.fn(),
    reset: jest.fn(),
    isDeploying: false,
    canDeploy: true,
    hasError: false,
    isSuccess: false
  }))
}))

jest.mock('@/hooks/use-deployment-config', () => ({
  useDeploymentConfig: jest.fn(() => ({
    activeConfig: {
      id: 'test-config',
      name: 'Test Config',
      platform: 'vercel',
      isDefault: true
    },
    hasConfigs: true,
    isWizardCompleted: true,
    canDeploy: true
  }))
}))

// Mock del modal
jest.mock('../deployment-modal', () => ({
  DeploymentModal: ({ open, onOpenChange, onDeploy }: any) => (
    <div data-testid="deployment-modal" style={{ display: open ? 'block' : 'none' }}>
      <button onClick={() => onOpenChange(false)}>Close Modal</button>
      <button onClick={() => onDeploy({ id: 'test' })}>Deploy</button>
    </div>
  )
}))

describe('DeploymentPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initial Render', () => {
    it('should render deployment panel with correct title', () => {
      render(<DeploymentPanel />)
      
      expect(screen.getByText('Deployment a Producción')).toBeInTheDocument()
      expect(screen.getByText('Despliega la aplicación a producción de forma segura y automatizada')).toBeInTheDocument()
    })

    it('should show ready status by default', () => {
      render(<DeploymentPanel />)
      
      expect(screen.getByText('Listo')).toBeInTheDocument()
    })

    it('should show active configuration', () => {
      render(<DeploymentPanel />)
      
      expect(screen.getByText('Test Config')).toBeInTheDocument()
      expect(screen.getByText('vercel')).toBeInTheDocument()
    })

    it('should show deploy button', () => {
      render(<DeploymentPanel />)
      
      expect(screen.getByText('Desplegar a Producción')).toBeInTheDocument()
    })
  })

  describe('Deployment States', () => {
    it('should show deploying state', () => {
      const { useDeployment } = require('@/hooks/use-deployment')
      useDeployment.mockReturnValue({
        state: {
          status: 'deploying',
          progress: 50,
          validations: [],
          steps: [],
          logs: ['Deploying...'],
          deploymentUrl: null,
          error: null
        },
        deploy: jest.fn(),
        cancelDeployment: jest.fn(),
        reset: jest.fn(),
        isDeploying: true,
        canDeploy: false,
        hasError: false,
        isSuccess: false
      })

      render(<DeploymentPanel />)
      
      expect(screen.getByText('Desplegando')).toBeInTheDocument()
      expect(screen.getByText('50%')).toBeInTheDocument()
      expect(screen.getByText('Desplegando...')).toBeInTheDocument()
      expect(screen.getByText('Cancelar')).toBeInTheDocument()
    })

    it('should show success state', () => {
      const { useDeployment } = require('@/hooks/use-deployment')
      useDeployment.mockReturnValue({
        state: {
          status: 'success',
          progress: 100,
          validations: [],
          steps: [],
          logs: [],
          deploymentUrl: 'https://test.vercel.app',
          error: null
        },
        deploy: jest.fn(),
        cancelDeployment: jest.fn(),
        reset: jest.fn(),
        isDeploying: false,
        canDeploy: true,
        hasError: false,
        isSuccess: true
      })

      render(<DeploymentPanel />)
      
      expect(screen.getByText('Exitoso')).toBeInTheDocument()
      expect(screen.getByText('Ver sitio')).toBeInTheDocument()
      expect(screen.getByText('Limpiar')).toBeInTheDocument()
    })

    it('should show error state', () => {
      const { useDeployment } = require('@/hooks/use-deployment')
      useDeployment.mockReturnValue({
        state: {
          status: 'error',
          progress: 0,
          validations: [],
          steps: [],
          logs: [],
          deploymentUrl: null,
          error: 'Deployment failed'
        },
        deploy: jest.fn(),
        cancelDeployment: jest.fn(),
        reset: jest.fn(),
        isDeploying: false,
        canDeploy: true,
        hasError: true,
        isSuccess: false
      })

      render(<DeploymentPanel />)
      
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('Error en deployment:')).toBeInTheDocument()
      expect(screen.getByText('Deployment failed')).toBeInTheDocument()
      expect(screen.getByText('Limpiar')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should open modal when deploy button is clicked', async () => {
      const user = userEvent.setup()
      render(<DeploymentPanel />)
      
      const deployButton = screen.getByText('Desplegar a Producción')
      await user.click(deployButton)
      
      expect(screen.getByTestId('deployment-modal')).toBeVisible()
    })

    it('should call cancelDeployment when cancel button is clicked', async () => {
      const mockCancel = jest.fn()
      const { useDeployment } = require('@/hooks/use-deployment')
      useDeployment.mockReturnValue({
        state: {
          status: 'deploying',
          progress: 50,
          validations: [],
          steps: [],
          logs: [],
          deploymentUrl: null,
          error: null
        },
        deploy: jest.fn(),
        cancelDeployment: mockCancel,
        reset: jest.fn(),
        isDeploying: true,
        canDeploy: false,
        hasError: false,
        isSuccess: false
      })

      const user = userEvent.setup()
      render(<DeploymentPanel />)
      
      const cancelButton = screen.getByText('Cancelar')
      await user.click(cancelButton)
      
      expect(mockCancel).toHaveBeenCalled()
    })

    it('should call reset when clean button is clicked', async () => {
      const mockReset = jest.fn()
      const { useDeployment } = require('@/hooks/use-deployment')
      useDeployment.mockReturnValue({
        state: {
          status: 'success',
          progress: 100,
          validations: [],
          steps: [],
          logs: [],
          deploymentUrl: 'https://test.vercel.app',
          error: null
        },
        deploy: jest.fn(),
        cancelDeployment: jest.fn(),
        reset: mockReset,
        isDeploying: false,
        canDeploy: true,
        hasError: false,
        isSuccess: true
      })

      const user = userEvent.setup()
      render(<DeploymentPanel />)
      
      const cleanButton = screen.getByText('Limpiar')
      await user.click(cleanButton)
      
      expect(mockReset).toHaveBeenCalled()
    })

    it('should open deployment URL when view site button is clicked', async () => {
      const { useDeployment } = require('@/hooks/use-deployment')
      useDeployment.mockReturnValue({
        state: {
          status: 'success',
          progress: 100,
          validations: [],
          steps: [],
          logs: [],
          deploymentUrl: 'https://test.vercel.app',
          error: null
        },
        deploy: jest.fn(),
        cancelDeployment: jest.fn(),
        reset: jest.fn(),
        isDeploying: false,
        canDeploy: true,
        hasError: false,
        isSuccess: true
      })

      // Mock window.open
      const mockOpen = jest.fn()
      Object.defineProperty(window, 'open', {
        value: mockOpen,
        writable: true
      })

      const user = userEvent.setup()
      render(<DeploymentPanel />)
      
      const viewSiteButton = screen.getByText('Ver sitio')
      await user.click(viewSiteButton)
      
      expect(mockOpen).toHaveBeenCalledWith('https://test.vercel.app', '_blank')
    })
  })

  describe('Configuration States', () => {
    it('should show configuration warning when wizard not completed', () => {
      const { useDeploymentConfig } = require('@/hooks/use-deployment-config')
      useDeploymentConfig.mockReturnValue({
        activeConfig: null,
        hasConfigs: false,
        isWizardCompleted: false,
        canDeploy: false
      })

      render(<DeploymentPanel />)
      
      expect(screen.getByText('Configuración incompleta')).toBeInTheDocument()
      expect(screen.getByText('Completa la configuración inicial para habilitar el deployment automático.')).toBeInTheDocument()
    })

    it('should show no configs warning when wizard completed but no configs', () => {
      const { useDeploymentConfig } = require('@/hooks/use-deployment-config')
      useDeploymentConfig.mockReturnValue({
        activeConfig: null,
        hasConfigs: false,
        isWizardCompleted: true,
        canDeploy: false
      })

      render(<DeploymentPanel />)
      
      expect(screen.getByText('Sin configuraciones')).toBeInTheDocument()
      expect(screen.getByText('Crea una configuración de deployment para comenzar.')).toBeInTheDocument()
    })

    it('should show configure deployment button when no configs', () => {
      const { useDeploymentConfig } = require('@/hooks/use-deployment-config')
      useDeploymentConfig.mockReturnValue({
        activeConfig: null,
        hasConfigs: false,
        isWizardCompleted: false,
        canDeploy: false
      })

      render(<DeploymentPanel />)
      
      expect(screen.getByText('Configurar Deployment')).toBeInTheDocument()
    })
  })

  describe('Progress Display', () => {
    it('should show progress bar during deployment', () => {
      const { useDeployment } = require('@/hooks/use-deployment')
      useDeployment.mockReturnValue({
        state: {
          status: 'deploying',
          progress: 75,
          validations: [],
          steps: [],
          logs: ['Building application...'],
          deploymentUrl: null,
          error: null
        },
        deploy: jest.fn(),
        cancelDeployment: jest.fn(),
        reset: jest.fn(),
        isDeploying: true,
        canDeploy: false,
        hasError: false,
        isSuccess: false
      })

      render(<DeploymentPanel />)
      
      expect(screen.getByText('75%')).toBeInTheDocument()
      expect(screen.getByText('Building application...')).toBeInTheDocument()
    })
  })
})

describe('DeploymentPanelCompact', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render compact panel', () => {
    render(<DeploymentPanelCompact />)
    
    expect(screen.getByText('Deploy a Producción')).toBeInTheDocument()
  })

  it('should show deploying state in compact mode', () => {
    const { useDeployment } = require('@/hooks/use-deployment')
    useDeployment.mockReturnValue({
      state: { status: 'deploying' },
      isDeploying: true,
      canDeploy: false
    })

    render(<DeploymentPanelCompact />)
    
    expect(screen.getByText('Desplegando...')).toBeInTheDocument()
  })

  it('should open modal when clicked', async () => {
    const user = userEvent.setup()
    render(<DeploymentPanelCompact />)
    
    const button = screen.getByText('Deploy a Producción')
    await user.click(button)
    
    expect(screen.getByTestId('deployment-modal')).toBeVisible()
  })

  it('should be disabled when cannot deploy', () => {
    const { useDeploymentConfig } = require('@/hooks/use-deployment-config')
    useDeploymentConfig.mockReturnValue({
      activeConfig: null,
      canDeploy: false
    })

    render(<DeploymentPanelCompact />)
    
    const button = screen.getByText('Deploy a Producción')
    expect(button).toBeDisabled()
  })
})
