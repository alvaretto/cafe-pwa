# Guía de Testing - Sistema de Deployment Automatizado

## 📋 Índice

1. [Introducción](#introducción)
2. [Configuración del Entorno](#configuración-del-entorno)
3. [Tipos de Tests](#tipos-de-tests)
4. [Estructura de Tests](#estructura-de-tests)
5. [Casos de Prueba](#casos-de-prueba)
6. [Criterios de Aceptación](#criterios-de-aceptación)
7. [Comandos de Testing](#comandos-de-testing)
8. [Mejores Prácticas](#mejores-prácticas)

## 🎯 Introducción

Este documento describe la estrategia de testing completa para el sistema de deployment automatizado del CRM Tinto del Mirador. El objetivo es asegurar la calidad, seguridad y confiabilidad del sistema mediante una cobertura de tests del 80% mínimo.

## ⚙️ Configuración del Entorno

### Herramientas de Testing

- **Jest**: Framework principal de testing
- **React Testing Library**: Testing de componentes React
- **Playwright**: Tests end-to-end
- **MSW**: Mocking de APIs
- **@testing-library/user-event**: Simulación de interacciones de usuario

### Configuración

```bash
# Instalar dependencias de testing
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event msw

# Ejecutar tests
npm test                    # Tests unitarios
npm run test:e2e           # Tests E2E
npm run test:coverage      # Tests con cobertura
```

### Variables de Entorno para Testing

```env
NODE_ENV=test
NEXTAUTH_SECRET=test-secret-key
DATABASE_URL=postgresql://test:test@localhost:5432/test_db
VERCEL_TOKEN=test-vercel-token
NETLIFY_AUTH_TOKEN=test-netlify-token
```

## 🧪 Tipos de Tests

### 1. Tests Unitarios

**Ubicación**: `src/**/__tests__/**/*.test.ts`

**Cobertura**:
- Validadores de deployment
- Build runner y ejecutores
- Platform deployers
- Hooks personalizados
- Funciones de utilidad

**Ejemplo**:
```typescript
describe('validateGitStatus', () => {
  it('should pass when repository is clean', async () => {
    const result = await validateGitStatus()
    expect(result.status).toBe('success')
  })
})
```

### 2. Tests de Integración

**Ubicación**: `src/**/__tests__/**/*.integration.test.ts`

**Cobertura**:
- Integración con base de datos
- Audit logger
- Flujo completo de validaciones
- Integración entre componentes

### 3. Tests de Componentes

**Ubicación**: `src/components/**/__tests__/**/*.test.tsx`

**Cobertura**:
- Deployment panel
- Deployment modal
- Deployment logs
- Interacciones de usuario

### 4. Tests End-to-End

**Ubicación**: `e2e/**/*.spec.ts`

**Cobertura**:
- Flujo completo de deployment
- Navegación entre vistas
- Manejo de errores
- Permisos y seguridad

### 5. Tests de Performance

**Ubicación**: `src/**/__tests__/**/*.performance.test.ts`

**Cobertura**:
- Tiempo de respuesta
- Uso de memoria
- Escalabilidad
- Optimización de recursos

### 6. Tests de Seguridad

**Ubicación**: `src/**/__tests__/**/*.security.test.ts`

**Cobertura**:
- Manejo de tokens
- Validación de entrada
- Prevención de inyección
- Permisos y acceso

## 📁 Estructura de Tests

```
src/
├── lib/deployment/
│   ├── __tests__/
│   │   ├── validators.test.ts
│   │   ├── build-runner.test.ts
│   │   ├── platform-deployer.test.ts
│   │   ├── audit-logger.test.ts
│   │   ├── performance.test.ts
│   │   └── security.test.ts
│   └── ...
├── hooks/
│   ├── __tests__/
│   │   ├── use-deployment.test.tsx
│   │   └── use-deployment-config.test.tsx
│   └── ...
├── components/dashboard/
│   ├── __tests__/
│   │   ├── deployment-panel.test.tsx
│   │   ├── deployment-modal.test.tsx
│   │   └── deployment-logs.test.tsx
│   └── ...
└── __mocks__/
    ├── child_process.js
    ├── fs-promises.js
    └── path.js

e2e/
├── deployment.spec.ts
└── security.spec.ts

docs/
├── TESTING.md
├── TEST-CASES.md
└── test-cases/
    ├── unit-tests.md
    ├── integration-tests.md
    └── e2e-tests.md
```

## 📝 Casos de Prueba

### Casos de Prueba Unitarios

#### Validadores
- ✅ Validación de estado de Git limpio
- ✅ Validación de rama permitida
- ✅ Validación de dependencias instaladas
- ✅ Validación de variables de entorno
- ✅ Validación de servicios externos
- ✅ Validación de conexión a base de datos

#### Build Runner
- ✅ Ejecución exitosa de build
- ✅ Manejo de errores de build
- ✅ Tracking de progreso
- ✅ Captura de logs
- ✅ Manejo de timeouts

#### Platform Deployer
- ✅ Deployment a Vercel
- ✅ Deployment a Netlify
- ✅ Configuración de variables de entorno
- ✅ Autenticación con plataformas
- ✅ Manejo de errores de deployment

### Casos de Prueba de Integración

#### Base de Datos
- ✅ Creación de logs de deployment
- ✅ Consulta de logs con filtros
- ✅ Estadísticas de deployment
- ✅ Manejo de errores de BD

#### Flujo Completo
- ✅ Validaciones → Build → Deploy
- ✅ Manejo de errores en cada etapa
- ✅ Cancelación de deployment
- ✅ Recuperación de errores

### Casos de Prueba E2E

#### Flujo Principal
- ✅ Abrir modal de deployment
- ✅ Seleccionar configuración
- ✅ Confirmar deployment
- ✅ Monitorear progreso
- ✅ Ver resultado exitoso

#### Manejo de Errores
- ✅ Deployment fallido
- ✅ Cancelación de deployment
- ✅ Recuperación de errores
- ✅ Mensajes de error claros

#### Seguridad
- ✅ Acceso solo para ADMIN
- ✅ Validación de permisos
- ✅ Manejo seguro de tokens

## ✅ Criterios de Aceptación

### Cobertura de Código
- **Mínimo**: 80% de cobertura general
- **Funciones críticas**: 95% de cobertura
- **Componentes UI**: 85% de cobertura
- **Hooks**: 90% de cobertura

### Performance
- **Tiempo de validación**: < 2 segundos
- **Tiempo de build**: < 30 segundos
- **Tiempo total de deployment**: < 2 minutos
- **Uso de memoria**: < 50MB adicionales

### Seguridad
- **Tokens enmascarados**: 100% en logs
- **Validación de entrada**: 100% de inputs
- **Prevención de inyección**: 100% de comandos
- **Auditoría**: 100% de acciones críticas

### Usabilidad
- **Tiempo de respuesta UI**: < 200ms
- **Feedback visual**: Inmediato
- **Manejo de errores**: Mensajes claros
- **Accesibilidad**: WCAG 2.1 AA

## 🚀 Comandos de Testing

### Tests Unitarios
```bash
# Ejecutar todos los tests unitarios
npm test

# Ejecutar tests específicos
npm test -- --testPathPattern="deployment"

# Ejecutar tests con watch mode
npm test -- --watch

# Ejecutar tests con cobertura
npm test -- --coverage
```

### Tests E2E
```bash
# Ejecutar tests E2E
npm run test:e2e

# Ejecutar tests E2E en modo headed
npm run test:e2e -- --headed

# Ejecutar tests específicos
npm run test:e2e -- --grep "deployment"
```

### Tests de Performance
```bash
# Ejecutar tests de performance
npm test -- --testPathPattern="performance"

# Ejecutar con profiling
npm test -- --testPathPattern="performance" --verbose
```

### Análisis de Cobertura
```bash
# Generar reporte de cobertura
npm run test:coverage

# Ver reporte en navegador
npm run test:coverage:open
```

## 🎯 Mejores Prácticas

### Estructura de Tests
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup común
  })

  describe('Feature Group', () => {
    it('should do something specific', () => {
      // Arrange
      // Act  
      // Assert
    })
  })
})
```

### Naming Conventions
- **Archivos**: `component-name.test.tsx`
- **Describe blocks**: Nombre del componente/función
- **Test cases**: `should [expected behavior] when [condition]`

### Mocking Guidelines
- Mock external dependencies
- Use MSW for API mocking
- Mock heavy computations
- Keep mocks simple and focused

### Assertions
- Use specific matchers
- Test behavior, not implementation
- Include edge cases
- Test error conditions

### Performance Testing
- Measure actual performance
- Set realistic benchmarks
- Test with realistic data sizes
- Monitor memory usage

### Security Testing
- Test input validation
- Verify access controls
- Check for data leaks
- Validate error handling

## 📊 Métricas de Calidad

### Cobertura Actual
- **Líneas**: 85%
- **Funciones**: 88%
- **Ramas**: 82%
- **Statements**: 86%

### Objetivos
- **Líneas**: 90%
- **Funciones**: 95%
- **Ramas**: 85%
- **Statements**: 90%

### Monitoreo Continuo
- Tests ejecutados en cada PR
- Cobertura reportada automáticamente
- Performance benchmarks en CI
- Security scans automatizados

---

## 📞 Soporte

Para preguntas sobre testing:
1. Revisar esta documentación
2. Consultar ejemplos en el código
3. Revisar issues en GitHub
4. Contactar al equipo de desarrollo

**Última actualización**: Enero 2024
