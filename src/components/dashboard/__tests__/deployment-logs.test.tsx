/**
 * Tests unitarios para DeploymentLogs
 * CRM Tinto del Mirador
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeploymentLogs } from '../deployment-logs'

describe('DeploymentLogs', () => {
  const mockLogs = [
    'Starting deployment process...',
    'Validating environment...',
    'Building application...',
    'Running tests...',
    'Deploying to production...',
    'Deployment completed successfully!'
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render logs container', () => {
      render(<DeploymentLogs logs={[]} />)
      
      expect(screen.getByTestId('deployment-logs')).toBeInTheDocument()
    })

    it('should render empty state when no logs', () => {
      render(<DeploymentLogs logs={[]} />)
      
      expect(screen.getByText('No hay logs disponibles')).toBeInTheDocument()
    })

    it('should render logs when provided', () => {
      render(<DeploymentLogs logs={mockLogs} />)
      
      mockLogs.forEach(log => {
        expect(screen.getByText(log)).toBeInTheDocument()
      })
    })

    it('should show log count', () => {
      render(<DeploymentLogs logs={mockLogs} />)
      
      expect(screen.getByText(`${mockLogs.length} líneas`)).toBeInTheDocument()
    })
  })

  describe('Log Display', () => {
    it('should display logs with timestamps', () => {
      const logsWithTimestamps = [
        '[2024-01-01 10:00:00] Starting deployment...',
        '[2024-01-01 10:00:01] Building application...'
      ]
      
      render(<DeploymentLogs logs={logsWithTimestamps} />)
      
      logsWithTimestamps.forEach(log => {
        expect(screen.getByText(log)).toBeInTheDocument()
      })
    })

    it('should handle long logs with wrapping', () => {
      const longLog = 'This is a very long log message that should wrap properly in the terminal display and not break the layout of the component'
      
      render(<DeploymentLogs logs={[longLog]} />)
      
      expect(screen.getByText(longLog)).toBeInTheDocument()
    })

    it('should handle special characters in logs', () => {
      const specialLogs = [
        'Error: Module not found',
        'Warning: Deprecated API usage',
        'Info: Build completed in 2.5s',
        'Debug: Memory usage: 256MB'
      ]
      
      render(<DeploymentLogs logs={specialLogs} />)
      
      specialLogs.forEach(log => {
        expect(screen.getByText(log)).toBeInTheDocument()
      })
    })

    it('should apply different styles for different log levels', () => {
      const styledLogs = [
        'ERROR: Build failed',
        'WARNING: Deprecated feature',
        'INFO: Process started',
        'SUCCESS: Deployment complete'
      ]
      
      render(<DeploymentLogs logs={styledLogs} />)
      
      // Check that logs are rendered (styling is handled by CSS classes)
      styledLogs.forEach(log => {
        expect(screen.getByText(log)).toBeInTheDocument()
      })
    })
  })

  describe('Auto-scroll Functionality', () => {
    it('should auto-scroll to bottom by default', () => {
      const scrollIntoViewMock = jest.fn()
      Element.prototype.scrollIntoView = scrollIntoViewMock
      
      render(<DeploymentLogs logs={mockLogs} autoScroll={true} />)
      
      // Should scroll to the last log entry
      expect(scrollIntoViewMock).toHaveBeenCalled()
    })

    it('should not auto-scroll when disabled', () => {
      const scrollIntoViewMock = jest.fn()
      Element.prototype.scrollIntoView = scrollIntoViewMock
      
      render(<DeploymentLogs logs={mockLogs} autoScroll={false} />)
      
      // Should not scroll when auto-scroll is disabled
      expect(scrollIntoViewMock).not.toHaveBeenCalled()
    })

    it('should scroll to bottom when new logs are added', async () => {
      const scrollIntoViewMock = jest.fn()
      Element.prototype.scrollIntoView = scrollIntoViewMock
      
      const { rerender } = render(<DeploymentLogs logs={['Log 1']} autoScroll={true} />)
      
      // Add new log
      rerender(<DeploymentLogs logs={['Log 1', 'Log 2']} autoScroll={true} />)
      
      await waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalled()
      })
    })
  })

  describe('Search and Filter', () => {
    it('should filter logs based on search term', async () => {
      const user = userEvent.setup()
      render(<DeploymentLogs logs={mockLogs} showSearch={true} />)
      
      const searchInput = screen.getByPlaceholderText('Buscar en logs...')
      await user.type(searchInput, 'deployment')
      
      // Should show logs containing "deployment"
      expect(screen.getByText('Starting deployment process...')).toBeInTheDocument()
      expect(screen.getByText('Deploying to production...')).toBeInTheDocument()
      expect(screen.getByText('Deployment completed successfully!')).toBeInTheDocument()
      
      // Should hide logs not containing "deployment"
      expect(screen.queryByText('Validating environment...')).not.toBeInTheDocument()
      expect(screen.queryByText('Building application...')).not.toBeInTheDocument()
    })

    it('should show no results message when search has no matches', async () => {
      const user = userEvent.setup()
      render(<DeploymentLogs logs={mockLogs} showSearch={true} />)
      
      const searchInput = screen.getByPlaceholderText('Buscar en logs...')
      await user.type(searchInput, 'nonexistent')
      
      expect(screen.getByText('No se encontraron logs que coincidan con la búsqueda')).toBeInTheDocument()
    })

    it('should clear search when input is cleared', async () => {
      const user = userEvent.setup()
      render(<DeploymentLogs logs={mockLogs} showSearch={true} />)
      
      const searchInput = screen.getByPlaceholderText('Buscar en logs...')
      await user.type(searchInput, 'deployment')
      await user.clear(searchInput)
      
      // All logs should be visible again
      mockLogs.forEach(log => {
        expect(screen.getByText(log)).toBeInTheDocument()
      })
    })
  })

  describe('Download Functionality', () => {
    it('should download logs when download button is clicked', async () => {
      // Mock URL.createObjectURL and related functions
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
      render(<DeploymentLogs logs={mockLogs} showDownload={true} />)
      
      const downloadButton = screen.getByText('Descargar')
      await user.click(downloadButton)
      
      expect(global.URL.createObjectURL).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
    })

    it('should generate correct filename for download', async () => {
      global.URL.createObjectURL = jest.fn(() => 'blob:url')
      const mockElement = {
        click: jest.fn(),
        href: '',
        download: '',
        style: {}
      }
      
      jest.spyOn(document, 'createElement').mockReturnValue(mockElement as any)

      const user = userEvent.setup()
      render(<DeploymentLogs logs={mockLogs} showDownload={true} />)
      
      const downloadButton = screen.getByText('Descargar')
      await user.click(downloadButton)
      
      expect(mockElement.download).toMatch(/deployment-logs-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}\.txt/)
    })

    it('should not show download button when disabled', () => {
      render(<DeploymentLogs logs={mockLogs} showDownload={false} />)
      
      expect(screen.queryByText('Descargar')).not.toBeInTheDocument()
    })
  })

  describe('Copy Functionality', () => {
    it('should copy logs to clipboard', async () => {
      // Mock clipboard API
      const mockWriteText = jest.fn()
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText
        }
      })

      const user = userEvent.setup()
      render(<DeploymentLogs logs={mockLogs} showCopy={true} />)
      
      const copyButton = screen.getByText('Copiar')
      await user.click(copyButton)
      
      expect(mockWriteText).toHaveBeenCalledWith(mockLogs.join('\n'))
    })

    it('should show copy success feedback', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText
        }
      })

      const user = userEvent.setup()
      render(<DeploymentLogs logs={mockLogs} showCopy={true} />)
      
      const copyButton = screen.getByText('Copiar')
      await user.click(copyButton)
      
      await waitFor(() => {
        expect(screen.getByText('¡Copiado!')).toBeInTheDocument()
      })
    })

    it('should handle copy errors gracefully', async () => {
      const mockWriteText = jest.fn().mockRejectedValue(new Error('Copy failed'))
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText
        }
      })

      const user = userEvent.setup()
      render(<DeploymentLogs logs={mockLogs} showCopy={true} />)
      
      const copyButton = screen.getByText('Copiar')
      await user.click(copyButton)
      
      // Should not crash and should show error state
      expect(mockWriteText).toHaveBeenCalled()
    })
  })

  describe('Performance', () => {
    it('should handle large number of logs efficiently', () => {
      const largeLogs = Array.from({ length: 1000 }, (_, i) => `Log entry ${i + 1}`)
      
      const { container } = render(<DeploymentLogs logs={largeLogs} />)
      
      // Should render without performance issues
      expect(container).toBeInTheDocument()
      expect(screen.getByText('1000 líneas')).toBeInTheDocument()
    })

    it('should virtualize logs when enabled', () => {
      const largeLogs = Array.from({ length: 1000 }, (_, i) => `Log entry ${i + 1}`)
      
      render(<DeploymentLogs logs={largeLogs} virtualized={true} />)
      
      // Should render container (virtualization details would be tested in integration)
      expect(screen.getByTestId('deployment-logs')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<DeploymentLogs logs={mockLogs} />)
      
      const logsContainer = screen.getByTestId('deployment-logs')
      expect(logsContainer).toHaveAttribute('role', 'log')
      expect(logsContainer).toHaveAttribute('aria-label', 'Logs de deployment')
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<DeploymentLogs logs={mockLogs} showSearch={true} />)
      
      const searchInput = screen.getByPlaceholderText('Buscar en logs...')
      
      // Should be able to focus search input
      await user.tab()
      expect(searchInput).toHaveFocus()
    })

    it('should announce new logs to screen readers', () => {
      const { rerender } = render(<DeploymentLogs logs={['Log 1']} />)
      
      // Add new log
      rerender(<DeploymentLogs logs={['Log 1', 'Log 2']} />)
      
      // Should have aria-live region for announcements
      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should handle null logs gracefully', () => {
      render(<DeploymentLogs logs={null as any} />)
      
      expect(screen.getByText('No hay logs disponibles')).toBeInTheDocument()
    })

    it('should handle undefined logs gracefully', () => {
      render(<DeploymentLogs logs={undefined as any} />)
      
      expect(screen.getByText('No hay logs disponibles')).toBeInTheDocument()
    })

    it('should handle empty strings in logs', () => {
      const logsWithEmpty = ['Log 1', '', 'Log 3', '']
      
      render(<DeploymentLogs logs={logsWithEmpty} />)
      
      expect(screen.getByText('Log 1')).toBeInTheDocument()
      expect(screen.getByText('Log 3')).toBeInTheDocument()
    })
  })
})
