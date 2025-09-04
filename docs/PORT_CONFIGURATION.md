# 🔧 Configuración de Puerto - CRM Tinto del Mirador

## 📋 Resumen

La aplicación CRM Tinto del Mirador está configurada para ejecutarse **siempre en el puerto 3001** para evitar inconsistencias y conflictos durante el desarrollo.

## 🎯 Puerto Configurado

- **Puerto fijo**: `3001`
- **URL de desarrollo**: `http://localhost:3001`
- **URL de producción**: Definida por la variable `PORT` del entorno

## ⚙️ Archivos de Configuración

### 1. `package.json`
```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "start": "next start -p 3001"
  }
}
```

### 2. Variables de Entorno (`.env.local`)
```bash
NEXTAUTH_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3001"
CORS_ORIGIN="http://localhost:3001"
```

### 3. `next.config.js`
```javascript
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_PORT: '3001',
  },
  devServer: {
    port: 3001,
  }
}
```

### 4. `src/app/layout.tsx`
```typescript
metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001')
```

## 🛠️ Scripts Disponibles

### Verificación de Puerto
```bash
# Verificar estado del puerto y configuración
npm run port:check

# Mostrar información del puerto configurado
npm run port:info

# Liberar el puerto 3001 (si está ocupado)
npm run port:kill

# Ejecutar desarrollo con verificación previa
npm run dev:safe
```

### Desarrollo Normal
```bash
# Ejecutar en puerto 3001 (configurado)
npm run dev

# Ejecutar en producción en puerto 3001
npm run start
```

## 🔍 Verificación Manual

### Verificar si el puerto está disponible
```bash
# Linux/macOS
lsof -i :3001

# Windows
netstat -ano | findstr :3001
```

### Liberar el puerto manualmente
```bash
# Linux/macOS
kill -9 $(lsof -ti:3001)

# Windows
taskkill /PID <PID> /F
```

## 🚨 Solución de Problemas

### Problema: Puerto 3001 ocupado
**Síntomas:**
- Error al ejecutar `npm run dev`
- Mensaje "Port 3001 is already in use"

**Soluciones:**
1. **Automática**: `npm run port:kill`
2. **Manual**: `kill -9 $(lsof -ti:3001)`
3. **Verificar**: `npm run port:check`

### Problema: Aplicación se ejecuta en puerto diferente
**Síntomas:**
- La aplicación se abre en puerto 3000 o 3002
- URLs en documentación no funcionan

**Soluciones:**
1. Verificar `package.json` tiene `-p 3001`
2. Verificar variables de entorno
3. Ejecutar `npm run port:check`

### Problema: Variables de entorno incorrectas
**Síntomas:**
- Errores de autenticación
- Problemas de CORS
- URLs incorrectas en metadatos

**Soluciones:**
1. Verificar `.env.local` tiene puerto 3001
2. Reiniciar servidor de desarrollo
3. Ejecutar `npm run port:check`

## 📊 URLs de la Aplicación

Con el puerto 3001 configurado, las URLs son:

- **🏠 Página Principal**: `http://localhost:3001`
- **📊 Dashboard**: `http://localhost:3001/dashboard`
- **🛍️ Ventas**: `http://localhost:3001/ventas`
- **👥 Clientes**: `http://localhost:3001/clientes`
- **☕ Productos**: `http://localhost:3001/productos`
- **📦 Inventario**: `http://localhost:3001/inventario`
- **🛒 Compras**: `http://localhost:3001/compras`
- **💰 Gastos**: `http://localhost:3001/gastos`
- **📊 Reportes**: `http://localhost:3001/reportes`
- **⚙️ Configuración**: `http://localhost:3001/configuracion`

## 🔧 Configuración Avanzada

### Cambiar Puerto (No Recomendado)
Si necesitas cambiar el puerto por alguna razón específica:

1. **Actualizar `package.json`**:
   ```json
   "dev": "next dev -p NUEVO_PUERTO"
   ```

2. **Actualizar variables de entorno**:
   ```bash
   NEXTAUTH_URL="http://localhost:NUEVO_PUERTO"
   NEXT_PUBLIC_APP_URL="http://localhost:NUEVO_PUERTO"
   ```

3. **Actualizar `port.config.js`**:
   ```javascript
   const APP_PORT = NUEVO_PUERTO;
   ```

4. **Actualizar documentación y archivos de prueba**

### Configuración para Diferentes Entornos

```javascript
// port.config.js
const PORT_CONFIG = {
  development: 3001,
  production: process.env.PORT || 3001,
  test: 4001,
  staging: 3002
};
```

## ✅ Lista de Verificación

Antes de ejecutar la aplicación, verifica:

- [ ] `package.json` tiene `-p 3001` en scripts `dev` y `start`
- [ ] `.env.local` tiene URLs con puerto 3001
- [ ] Puerto 3001 está disponible (`npm run port:check`)
- [ ] No hay otros procesos usando el puerto 3001
- [ ] Variables de entorno están configuradas correctamente

## 📞 Soporte

Si tienes problemas con la configuración del puerto:

1. Ejecuta `npm run port:check` para diagnóstico automático
2. Revisa esta documentación
3. Verifica que no hay otros servicios usando el puerto 3001
4. Reinicia el servidor de desarrollo

---

**Nota**: Esta configuración garantiza que la aplicación CRM Tinto del Mirador siempre se ejecute en el puerto 3001, evitando confusiones y problemas de acceso durante el desarrollo.
