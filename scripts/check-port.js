#!/usr/bin/env node

/**
 * Script de Verificación de Puerto
 * CRM Tinto del Mirador
 * 
 * Este script verifica el estado del puerto configurado y
 * proporciona información útil para el desarrollo.
 */

const net = require('net');
const { execSync } = require('child_process');
const portConfig = require('../port.config.js');

const APP_PORT = 3001;
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

function checkPortAvailability(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.listen(port, '127.0.0.1', () => {
      server.once('close', () => {
        resolve({ available: true, port });
      });
      server.close();
    });

    server.on('error', (err) => {
      resolve({ available: false, port, error: err.message });
    });
  });
}

function getProcessUsingPort(port) {
  try {
    // Intentar obtener el proceso que usa el puerto
    const result = execSync(`lsof -ti:${port}`, { encoding: 'utf8' }).trim();
    if (result) {
      const pid = result.split('\n')[0];
      const processInfo = execSync(`ps -p ${pid} -o comm=`, { encoding: 'utf8' }).trim();
      return { pid, process: processInfo };
    }
  } catch (error) {
    // Si no se puede obtener la información, no es crítico
  }
  return null;
}

async function checkAlternativePorts() {
  const alternatives = [3000, 3002, 3003, 8000, 8080];
  const results = [];
  
  for (const port of alternatives) {
    const result = await checkPortAvailability(port);
    results.push(result);
  }
  
  return results;
}

async function main() {
  console.log(colorize('\n🔧 Verificación de Puerto - CRM Tinto del Mirador', 'cyan'));
  console.log(colorize('=' .repeat(55), 'cyan'));
  
  // Información básica
  const portInfo = portConfig.getPortInfo();
  console.log(`\n${colorize('📋 Información de Configuración:', 'blue')}`);
  console.log(`   Puerto configurado: ${colorize(portInfo.port, 'bright')}`);
  console.log(`   URL de desarrollo: ${colorize(portInfo.url, 'bright')}`);
  console.log(`   Entorno: ${colorize(portInfo.environment, 'bright')}`);
  
  // Verificar disponibilidad del puerto principal
  console.log(`\n${colorize('🔍 Verificando Puerto Principal:', 'blue')}`);
  const mainPortResult = await checkPortAvailability(APP_PORT);
  
  if (mainPortResult.available) {
    console.log(`   ${colorize('✅ Puerto 3001 disponible', 'green')}`);
  } else {
    console.log(`   ${colorize('❌ Puerto 3001 ocupado', 'red')}`);
    
    // Intentar obtener información del proceso
    const processInfo = getProcessUsingPort(APP_PORT);
    if (processInfo) {
      console.log(`   ${colorize('📋 Proceso:', 'yellow')} PID ${processInfo.pid} (${processInfo.process})`);
    }
    
    console.log(`\n${colorize('💡 Soluciones sugeridas:', 'yellow')}`);
    console.log(`   1. Detener el proceso que usa el puerto 3001`);
    console.log(`   2. Usar: ${colorize('kill -9 $(lsof -ti:3001)', 'bright')}`);
    console.log(`   3. Reiniciar el servidor de desarrollo`);
  }
  
  // Verificar puertos alternativos
  console.log(`\n${colorize('🔍 Verificando Puertos Alternativos:', 'blue')}`);
  const alternativeResults = await checkAlternativePorts();
  
  alternativeResults.forEach(result => {
    const status = result.available 
      ? colorize('✅ Disponible', 'green')
      : colorize('❌ Ocupado', 'red');
    console.log(`   Puerto ${result.port}: ${status}`);
  });
  
  // Verificar configuración de Next.js
  console.log(`\n${colorize('⚙️ Verificando Configuración:', 'blue')}`);
  
  try {
    const packageJson = require('../package.json');
    const devScript = packageJson.scripts.dev;
    
    if (devScript.includes('-p 3001')) {
      console.log(`   ${colorize('✅ package.json configurado correctamente', 'green')}`);
    } else {
      console.log(`   ${colorize('⚠️  package.json no especifica puerto 3001', 'yellow')}`);
    }
  } catch (error) {
    console.log(`   ${colorize('❌ Error leyendo package.json', 'red')}`);
  }
  
  // Verificar variables de entorno
  const envVars = [
    'NEXTAUTH_URL',
    'NEXT_PUBLIC_APP_URL',
    'CORS_ORIGIN'
  ];
  
  console.log(`\n${colorize('🌍 Variables de Entorno:', 'blue')}`);
  envVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      const isCorrect = value.includes('3001');
      const status = isCorrect 
        ? colorize('✅ Correcto', 'green')
        : colorize('⚠️  Revisar', 'yellow');
      console.log(`   ${varName}: ${status} (${value})`);
    } else {
      console.log(`   ${varName}: ${colorize('❌ No definida', 'red')}`);
    }
  });
  
  // Recomendaciones finales
  console.log(`\n${colorize('📝 Recomendaciones:', 'magenta')}`);
  
  if (mainPortResult.available) {
    console.log(`   ${colorize('✅ Todo configurado correctamente', 'green')}`);
    console.log(`   ${colorize('🚀 Puedes ejecutar:', 'blue')} npm run dev`);
  } else {
    console.log(`   ${colorize('⚠️  Libera el puerto 3001 antes de continuar', 'yellow')}`);
    console.log(`   ${colorize('🔧 Comando sugerido:', 'blue')} kill -9 $(lsof -ti:3001)`);
  }
  
  console.log(`\n${colorize('=' .repeat(55), 'cyan')}`);
  console.log(colorize('Verificación completada\n', 'cyan'));
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(error => {
    console.error(colorize(`\n❌ Error durante la verificación: ${error.message}`, 'red'));
    process.exit(1);
  });
}

module.exports = {
  checkPortAvailability,
  getProcessUsingPort,
  checkAlternativePorts,
  main
};
