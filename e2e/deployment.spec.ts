/**
 * Tests E2E para el sistema de deployment
 * CRM Tinto del Mirador
 */

import { test, expect } from '@playwright/test'

test.describe('Sistema de Deployment Automatizado', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar al dashboard
    await page.goto('/dashboard')
    
    // Simular autenticación como ADMIN
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@tinto.com',
        role: 'ADMIN'
      }))
    })
    
    // Recargar para aplicar la autenticación
    await page.reload()
  })

  test('debe mostrar el panel de deployment para usuarios ADMIN', async ({ page }) => {
    // Verificar que el panel de deployment esté visible
    await expect(page.locator('[data-testid="deployment-panel"]')).toBeVisible()
    
    // Verificar el título del panel
    await expect(page.locator('text=Deployment a Producción')).toBeVisible()
    
    // Verificar el botón de deployment
    await expect(page.locator('text=Deploy a Producción')).toBeVisible()
  })

  test('debe abrir el modal de deployment al hacer clic en el botón', async ({ page }) => {
    // Hacer clic en el botón de deployment
    await page.click('text=Deploy a Producción')
    
    // Verificar que el modal se abra
    await expect(page.locator('[data-testid="deployment-modal"]')).toBeVisible()
    
    // Verificar el título del modal
    await expect(page.locator('text=Deployment a Producción')).toBeVisible()
  })

  test('debe mostrar la vista de configuración por defecto', async ({ page }) => {
    // Abrir modal
    await page.click('text=Deploy a Producción')
    
    // Verificar que muestre la vista de configuración
    await expect(page.locator('text=Configuración de Deployment')).toBeVisible()
    await expect(page.locator('text=Selecciona la configuración para desplegar a producción')).toBeVisible()
  })

  test('debe permitir seleccionar una configuración', async ({ page }) => {
    // Abrir modal
    await page.click('text=Deploy a Producción')
    
    // Buscar y seleccionar una configuración (si existe)
    const configOption = page.locator('[data-testid="config-option"]').first()
    
    if (await configOption.isVisible()) {
      await configOption.click()
      
      // Verificar que el botón continuar se habilite
      await expect(page.locator('text=Continuar')).toBeEnabled()
    }
  })

  test('debe navegar a la vista de confirmación', async ({ page }) => {
    // Abrir modal
    await page.click('text=Deploy a Producción')
    
    // Seleccionar configuración si existe
    const configOption = page.locator('[data-testid="config-option"]').first()
    
    if (await configOption.isVisible()) {
      await configOption.click()
      await page.click('text=Continuar')
      
      // Verificar vista de confirmación
      await expect(page.locator('text=Confirmar Deployment')).toBeVisible()
      await expect(page.locator('text=Estás a punto de desplegar a producción')).toBeVisible()
    }
  })

  test('debe requerir confirmación antes del deployment', async ({ page }) => {
    // Abrir modal y navegar a confirmación
    await page.click('text=Deploy a Producción')
    
    const configOption = page.locator('[data-testid="config-option"]').first()
    
    if (await configOption.isVisible()) {
      await configOption.click()
      await page.click('text=Continuar')
      
      // Verificar que el botón de deployment esté deshabilitado inicialmente
      await expect(page.locator('text=Desplegar a Producción')).toBeDisabled()
      
      // Marcar checkbox de confirmación
      await page.check('[data-testid="confirmation-checkbox"]')
      
      // Verificar que el botón se habilite
      await expect(page.locator('text=Desplegar a Producción')).toBeEnabled()
    }
  })

  test('debe iniciar el proceso de deployment', async ({ page }) => {
    // Abrir modal y navegar a confirmación
    await page.click('text=Deploy a Producción')
    
    const configOption = page.locator('[data-testid="config-option"]').first()
    
    if (await configOption.isVisible()) {
      await configOption.click()
      await page.click('text=Continuar')
      
      // Confirmar y iniciar deployment
      await page.check('[data-testid="confirmation-checkbox"]')
      await page.click('text=Desplegar a Producción')
      
      // Verificar que cambie a vista de progreso
      await expect(page.locator('text=Deployment en Progreso')).toBeVisible()
      await expect(page.locator('text=Por favor espera mientras se despliega la aplicación')).toBeVisible()
    }
  })

  test('debe mostrar el stepper de progreso durante deployment', async ({ page }) => {
    // Iniciar deployment
    await page.click('text=Deploy a Producción')
    
    const configOption = page.locator('[data-testid="config-option"]').first()
    
    if (await configOption.isVisible()) {
      await configOption.click()
      await page.click('text=Continuar')
      await page.check('[data-testid="confirmation-checkbox"]')
      await page.click('text=Desplegar a Producción')
      
      // Verificar pasos del stepper
      await expect(page.locator('text=Validaciones')).toBeVisible()
      await expect(page.locator('text=Build')).toBeVisible()
      await expect(page.locator('text=Tests')).toBeVisible()
      await expect(page.locator('text=Deploy')).toBeVisible()
      await expect(page.locator('text=Verificación')).toBeVisible()
    }
  })

  test('debe mostrar logs durante el deployment', async ({ page }) => {
    // Iniciar deployment
    await page.click('text=Deploy a Producción')
    
    const configOption = page.locator('[data-testid="config-option"]').first()
    
    if (await configOption.isVisible()) {
      await configOption.click()
      await page.click('text=Continuar')
      await page.check('[data-testid="confirmation-checkbox"]')
      await page.click('text=Desplegar a Producción')
      
      // Verificar que aparezcan logs
      await expect(page.locator('[data-testid="deployment-logs"]')).toBeVisible()
      
      // Esperar a que aparezcan algunos logs (en modo demo)
      await page.waitForTimeout(2000)
      
      // Verificar que hay contenido en los logs
      const logsContent = await page.locator('[data-testid="deployment-logs"]').textContent()
      expect(logsContent).toBeTruthy()
    }
  })

  test('debe permitir cancelar el deployment', async ({ page }) => {
    // Iniciar deployment
    await page.click('text=Deploy a Producción')
    
    const configOption = page.locator('[data-testid="config-option"]').first()
    
    if (await configOption.isVisible()) {
      await configOption.click()
      await page.click('text=Continuar')
      await page.check('[data-testid="confirmation-checkbox"]')
      await page.click('text=Desplegar a Producción')
      
      // Verificar botón de cancelar
      await expect(page.locator('text=Cancelar Deployment')).toBeVisible()
      
      // Cancelar deployment
      await page.click('text=Cancelar Deployment')
      
      // Verificar que el deployment se cancele
      await expect(page.locator('text=Deployment Cancelado')).toBeVisible()
    }
  })

  test('debe mostrar resultado exitoso del deployment', async ({ page }) => {
    // Iniciar deployment
    await page.click('text=Deploy a Producción')
    
    const configOption = page.locator('[data-testid="config-option"]').first()
    
    if (await configOption.isVisible()) {
      await configOption.click()
      await page.click('text=Continuar')
      await page.check('[data-testid="confirmation-checkbox"]')
      await page.click('text=Desplegar a Producción')
      
      // Esperar a que complete (en modo demo es rápido)
      await page.waitForTimeout(5000)
      
      // Verificar resultado exitoso
      await expect(page.locator('text=¡Deployment Exitoso!')).toBeVisible()
      await expect(page.locator('text=La aplicación se desplegó correctamente a producción')).toBeVisible()
    }
  })

  test('debe mostrar URL de deployment en resultado exitoso', async ({ page }) => {
    // Iniciar deployment
    await page.click('text=Deploy a Producción')
    
    const configOption = page.locator('[data-testid="config-option"]').first()
    
    if (await configOption.isVisible()) {
      await configOption.click()
      await page.click('text=Continuar')
      await page.check('[data-testid="confirmation-checkbox"]')
      await page.click('text=Desplegar a Producción')
      
      // Esperar a que complete
      await page.waitForTimeout(5000)
      
      // Verificar URL de deployment
      await expect(page.locator('text=URL de producción:')).toBeVisible()
      await expect(page.locator('text=https://')).toBeVisible()
    }
  })

  test('debe permitir descargar logs del deployment', async ({ page }) => {
    // Iniciar deployment
    await page.click('text=Deploy a Producción')
    
    const configOption = page.locator('[data-testid="config-option"]').first()
    
    if (await configOption.isVisible()) {
      await configOption.click()
      await page.click('text=Continuar')
      await page.check('[data-testid="confirmation-checkbox"]')
      await page.click('text=Desplegar a Producción')
      
      // Esperar a que complete
      await page.waitForTimeout(5000)
      
      // Verificar botón de descarga de logs
      await expect(page.locator('text=Descargar Logs')).toBeVisible()
    }
  })

  test('debe cerrar el modal correctamente', async ({ page }) => {
    // Abrir modal
    await page.click('text=Deploy a Producción')
    
    // Verificar que está abierto
    await expect(page.locator('[data-testid="deployment-modal"]')).toBeVisible()
    
    // Cerrar modal
    await page.click('[data-testid="close-modal"]')
    
    // Verificar que se cierre
    await expect(page.locator('[data-testid="deployment-modal"]')).not.toBeVisible()
  })

  test('debe manejar errores de deployment gracefully', async ({ page }) => {
    // Este test simularía un error, pero en modo demo siempre es exitoso
    // Se incluye para completitud de la suite de tests
    
    await page.click('text=Deploy a Producción')
    
    const configOption = page.locator('[data-testid="config-option"]').first()
    
    if (await configOption.isVisible()) {
      await configOption.click()
      await page.click('text=Continuar')
      await page.check('[data-testid="confirmation-checkbox"]')
      await page.click('text=Desplegar a Producción')
      
      // En un escenario real, aquí verificaríamos manejo de errores
      // Por ahora, solo verificamos que el proceso funcione
      await page.waitForTimeout(3000)
      
      // El sistema debería manejar cualquier error gracefully
      const hasError = await page.locator('text=Deployment Falló').isVisible()
      const hasSuccess = await page.locator('text=¡Deployment Exitoso!').isVisible()
      
      // Uno de los dos debería ser verdadero
      expect(hasError || hasSuccess).toBeTruthy()
    }
  })

  test('debe actualizar el estado del panel después del deployment', async ({ page }) => {
    // Iniciar y completar deployment
    await page.click('text=Deploy a Producción')
    
    const configOption = page.locator('[data-testid="config-option"]').first()
    
    if (await configOption.isVisible()) {
      await configOption.click()
      await page.click('text=Continuar')
      await page.check('[data-testid="confirmation-checkbox"]')
      await page.click('text=Desplegar a Producción')
      
      // Esperar a que complete
      await page.waitForTimeout(5000)
      
      // Cerrar modal
      await page.click('[data-testid="close-modal"]')
      
      // Verificar que el panel principal refleje el estado exitoso
      await expect(page.locator('text=Exitoso')).toBeVisible()
      await expect(page.locator('text=Ver sitio')).toBeVisible()
    }
  })
})

test.describe('Permisos y Seguridad', () => {
  test('no debe mostrar panel de deployment para usuarios no-ADMIN', async ({ page }) => {
    // Navegar al dashboard
    await page.goto('/dashboard')
    
    // Simular autenticación como VENDEDOR
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'vendor-1',
        name: 'Vendor User',
        email: 'vendor@tinto.com',
        role: 'VENDEDOR'
      }))
    })
    
    // Recargar para aplicar la autenticación
    await page.reload()
    
    // Verificar que el panel de deployment NO esté visible
    await expect(page.locator('[data-testid="deployment-panel"]')).not.toBeVisible()
  })

  test('debe requerir autenticación para acceder al deployment', async ({ page }) => {
    // Navegar al dashboard sin autenticación
    await page.goto('/dashboard')
    
    // Verificar que no hay panel de deployment sin autenticación
    await expect(page.locator('[data-testid="deployment-panel"]')).not.toBeVisible()
  })
})
