/**
 * Tests unitarios para DeploymentModal
 * CRM Tinto del Mirador
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeploymentModal } from '../deployment-modal'

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
    configs: [{
      id: 'test-config',
      name: 'Test Config',
      platform: 'vercel',
      isDefault: true
    }],
    hasConfigs: true,
    isWizardCompleted: true
  }))
}))

// Mock del componente de logs
jest.mock('../deployment-logs', () => ({
  DeploymentLogs: ({ logs }: any) => (
    <div data-testid="deployment-logs">
      {logs.map((log: string, index: number) => (
        <div key={index}>{log}</div>
      ))}
    </div>
  )
}))

describe('DeploymentModal', () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    onDeploy: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Configuration View', () => {
    it('should render configuration view by default', () => {
      render(<DeploymentModal {...defaultProps} />)
      
      expect(screen.getByText('Configuración de Deployment')).toBeInTheDocument()
      expect(screen.getByText('Selecciona la configuración para desplegar a producción')).toBeInTheDocument()
    })

    it('should show available configurations', () => {
      render(<DeploymentModal {...defaultProps} />)
      
      expect(screen.getByText('Test Config')).toBeInTheDocument()
      expect(screen.getByText('vercel')).toBeInTheDocument()
      expect(screen.getByText('Predeterminada')).toBeInTheDocument()
    })

    it('should allow selecting configuration', async () => {
      const user = userEvent.setup()
      render(<DeploymentModal {...defaultProps} />)
      
      const configOption = screen.getByText('Test Config').closest('div')
      await user.click(configOption!)
      
      // Configuration should be selected (visual feedback)
      expect(configOption).toHaveClass('border-purple-500')
    })

    it('should enable continue button when config is selected', async () => {
      const user = userEvent.setup()
      render(<DeploymentModal {...defaultProps} />)
      
      const configOption = screen.getByText('Test Config').closest('div')
      await user.click(configOption!)
      
      const continueButton = screen.getByText('Continuar')
      expect(continueButton).not.toBeDisabled()
    })

    it('should show no configurations message when none available', () => {
      const { useDeploymentConfig } = require('@/hooks/use-deployment-config')
      useDeploymentConfig.mockReturnValue({
        activeConfig: null,
        configs: [],
        hasConfigs: false,
        isWizardCompleted: true
      })

      render(<DeploymentModal {...defaultProps} />)
      
      expect(screen.getByText('No hay configuraciones de deployment disponibles')).toBeInTheDocument()
      expect(screen.getByText('Crear Configuración')).toBeInTheDocument()
    })
  })

  describe('Confirmation View', () => {
    it('should show confirmation view after clicking continue', async () => {
      const user = userEvent.setup()
      render(<DeploymentModal {...defaultProps} />)
      
      // Select config and continue
      const configOption = screen.getByText('Test Config').closest('div')
      await user.click(configOption!)
      
      const continueButton = screen.getByText('Continuar')
      await user.click(continueButton)
      
      expect(screen.getByText('Confirmar Deployment')).toBeInTheDocument()
      expect(screen.getByText('Estás a punto de desplegar a producción')).toBeInTheDocument()
    })

    it('should show deployment details in confirmation', async () => {
      const user = userEvent.setup()
      render(<DeploymentModal {...defaultProps} />)
      
      // Navigate to confirmation
      const configOption = screen.getByText('Test Config').closest('div')
      await user.click(configOption!)
      const continueButton = screen.getByText('Continuar')
      await user.click(continueButton)
      
      expect(screen.getByText('Detalles del deployment:')).toBeInTheDocument()
      expect(screen.getByText('Test Config')).toBeInTheDocument()
      expect(screen.getByText('vercel')).toBeInTheDocument()
      expect(screen.getByText('main')).toBeInTheDocument()
    })

    it('should require confirmation checkbox', async () => {
      const user = userEvent.setup()
      render(<DeploymentModal {...defaultProps} />)
      
      // Navigate to confirmation
      const configOption = screen.getByText('Test Config').closest('div')
      await user.click(configOption!)
      const continueButton = screen.getByText('Continuar')
      await user.click(continueButton)
      
      const deployButton = screen.getByText('Desplegar a Producción')
      expect(deployButton).toBeDisabled()
      
      // Check confirmation
      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)
      
      expect(deployButton).not.toBeDisabled()
    })

    it('should start deployment when confirmed', async () => {
      const mockDeploy = jest.fn()
      const { useDeployment } = require('@/hooks/use-deployment')
      useDeployment.mockReturnValue({
        state: { status: 'idle' },
        deploy: mockDeploy,
        isDeploying: false,
        canDeploy: true
      })

      const user = userEvent.setup()
      render(<DeploymentModal {...defaultProps} />)
      
      // Navigate to confirmation and confirm
      const configOption = screen.getByText('Test Config').closest('div')
      await user.click(configOption!)
      const continueButton = screen.getByText('Continuar')
      await user.click(continueButton)
      
      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)
      
      const deployButton = screen.getByText('Desplegar a Producción')
      await user.click(deployButton)
      
      expect(mockDeploy).toHaveBeenCalled()
    })
  })

  describe('Deployment View', () => {
    it('should show deployment progress', () => {
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
        isDeploying: true,
        canDeploy: false
      })

      render(<DeploymentModal {...defaultProps} />)
      
      expect(screen.getByText('Deployment en Progreso')).toBeInTheDocument()
      expect(screen.getByText('Por favor espera mientras se despliega la aplicación')).toBeInTheDocument()
    })

    it('should show deployment steps', () => {
      const { useDeployment } = require('@/hooks/use-deployment')
      useDeployment.mockReturnValue({
        state: {
          status: 'building',
          progress: 30,
          validations: [],
          steps: [],
          logs: [],
          deploymentUrl: null,
          error: null
        },
        deploy: jest.fn(),
        isDeploying: true
      })

      render(<DeploymentModal {...defaultProps} />)
      
      expect(screen.getByText('Validaciones')).toBeInTheDocument()
      expect(screen.getByText('Build')).toBeInTheDocument()
      expect(screen.getByText('Tests')).toBeInTheDocument()
      expect(screen.getByText('Deploy')).toBeInTheDocument()
      expect(screen.getByText('Verificación')).toBeInTheDocument()
    })

    it('should show logs during deployment', () => {
      const { useDeployment } = require('@/hooks/use-deployment')
      useDeployment.mockReturnValue({
        state: {
          status: 'deploying',
          progress: 50,
          validations: [],
          steps: [],
          logs: ['Starting deployment...', 'Building application...'],
          deploymentUrl: null,
          error: null
        },
        deploy: jest.fn(),
        isDeploying: true
      })

      render(<DeploymentModal {...defaultProps} />)
      
      expect(screen.getByTestId('deployment-logs')).toBeInTheDocument()
      expect(screen.getByText('Starting deployment...')).toBeInTheDocument()
      expect(screen.getByText('Building application...')).toBeInTheDocument()
    })

    it('should allow canceling deployment', async () => {
      const mockCancel = jest.fn()
      const { useDeployment } = require('@/hooks/use-deployment')
      useDeployment.mockReturnValue({
        state: {
          status: 'deploying',
          progress: 50,
          logs: []
        },
        cancelDeployment: mockCancel,
        isDeploying: true
      })

      const user = userEvent.setup()
      render(<DeploymentModal {...defaultProps} />)
      
      const cancelButton = screen.getByText('Cancelar Deployment')
      await user.click(cancelButton)
      
      expect(mockCancel).toHaveBeenCalled()
    })
  })

  describe('Result View', () => {
    it('should show success result', () => {
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
        isDeploying: false,
        isSuccess: true
      })

      render(<DeploymentModal {...defaultProps} />)
      
      expect(screen.getByText('¡Deployment Exitoso!')).toBeInTheDocument()
      expect(screen.getByText('La aplicación se desplegó correctamente a producción')).toBeInTheDocument()
    })

    it('should show error result', () => {
      const { useDeployment } = require('@/hooks/use-deployment')
      useDeployment.mockReturnValue({
        state: {
          status: 'error',
          progress: 0,
          validations: [],
          steps: [],
          logs: [],
          deploymentUrl: null,
          error: 'Build failed'
        },
        deploy: jest.fn(),
        isDeploying: false,
        hasError: true
      })

      render(<DeploymentModal {...defaultProps} />)
      
      expect(screen.getByText('Deployment Falló')).toBeInTheDocument()
      expect(screen.getByText('Ocurrió un error durante el proceso de deployment')).toBeInTheDocument()
      expect(screen.getByText('Build failed')).toBeInTheDocument()
    })

    it('should show deployment URL on success', () => {
      const { useDeployment } = require('@/hooks/use-deployment')
      useDeployment.mockReturnValue({
        state: {
          status: 'success',
          deploymentUrl: 'https://test.vercel.app'
        },
        isSuccess: true
      })

      render(<DeploymentModal {...defaultProps} />)
      
      expect(screen.getByText('URL de producción:')).toBeInTheDocument()
      expect(screen.getByText('https://test.vercel.app')).toBeInTheDocument()
    })

    it('should allow downloading logs', async () => {
      const { useDeployment } = require('@/hooks/use-deployment')
      useDeployment.mockReturnValue({
        state: {
          status: 'success',
          logs: ['Log 1', 'Log 2']
        },
        isSuccess: true
      })

      // Mock URL.createObjectURL
      global.URL.createObjectURL = jest.fn(() => 'blob:url')
      global.URL.revokeObjectURL = jest.fn()
      const mockClick = jest.fn()

      jest.spyOn(document, 'createElement').mockReturnValue({
        click: mockClick,
        href: '',
        download: '',
        style: {}
      } as any)

      const user = userEvent.setup()
      render(<DeploymentModal {...defaultProps} />)

      const downloadButton = screen.getByText('Descargar Logs')
      await user.click(downloadButton)

      expect(global.URL.createObjectURL).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
    })
  })

  describe('Modal Controls', () => {
    it('should close modal when close button is clicked', async () => {
      const mockOnOpenChange = jest.fn()
      const user = userEvent.setup()
      
      render(<DeploymentModal {...defaultProps} onOpenChange={mockOnOpenChange} />)
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)
      
      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })

    it('should not render when closed', () => {
      render(<DeploymentModal {...defaultProps} open={false} />)
      
      expect(screen.queryByText('Deployment a Producción')).not.toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should allow going back from confirmation to config', async () => {
      const user = userEvent.setup()
      render(<DeploymentModal {...defaultProps} />)
      
      // Navigate to confirmation
      const configOption = screen.getByText('Test Config').closest('div')
      await user.click(configOption!)
      const continueButton = screen.getByText('Continuar')
      await user.click(continueButton)
      
      // Go back
      const backButton = screen.getByText('Atrás')
      await user.click(backButton)
      
      expect(screen.getByText('Configuración de Deployment')).toBeInTheDocument()
    })

    it('should handle view transitions correctly', async () => {
      const user = userEvent.setup()
      render(<DeploymentModal {...defaultProps} />)
      
      // Start with config view
      expect(screen.getByText('Configuración de Deployment')).toBeInTheDocument()
      
      // Navigate through views
      const configOption = screen.getByText('Test Config').closest('div')
      await user.click(configOption!)
      const continueButton = screen.getByText('Continuar')
      await user.click(continueButton)
      
      expect(screen.getByText('Confirmar Deployment')).toBeInTheDocument()
    })
  })
})
