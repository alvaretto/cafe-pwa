/**
 * Configuración de Puerto para CRM Tinto del Mirador
 * 
 * Este archivo define el puerto fijo para la aplicación.
 * Evita conflictos y asegura consistencia en el desarrollo.
 */

// Puerto fijo configurado para la aplicación
const APP_PORT = 3001;

// Configuración de puertos para diferentes entornos
const PORT_CONFIG = {
  development: APP_PORT,
  production: process.env.PORT || APP_PORT,
  test: APP_PORT + 1000, // Puerto 4001 para testing
};

// Función para obtener el puerto según el entorno
function getPort(env = process.env.NODE_ENV || 'development') {
  return PORT_CONFIG[env] || APP_PORT;
}

// Función para verificar si el puerto está disponible
async function checkPortAvailability(port) {
  const net = require('net');
  
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true); // Puerto disponible
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false); // Puerto ocupado
    });
  });
}

// Función para obtener información del puerto
function getPortInfo() {
  const currentPort = getPort();
  return {
    port: currentPort,
    url: `http://localhost:${currentPort}`,
    environment: process.env.NODE_ENV || 'development',
    isFixed: true,
    description: 'Puerto fijo configurado para CRM Tinto del Mirador'
  };
}

// Exportar configuración
module.exports = {
  APP_PORT,
  PORT_CONFIG,
  getPort,
  checkPortAvailability,
  getPortInfo
};

// Si se ejecuta directamente, mostrar información del puerto
if (require.main === module) {
  const info = getPortInfo();
  console.log('🔧 Configuración de Puerto - CRM Tinto del Mirador');
  console.log('================================================');
  console.log(`Puerto configurado: ${info.port}`);
  console.log(`URL de desarrollo: ${info.url}`);
  console.log(`Entorno: ${info.environment}`);
  console.log(`Puerto fijo: ${info.isFixed ? 'Sí' : 'No'}`);
  console.log(`Descripción: ${info.description}`);
  
  // Verificar disponibilidad del puerto
  checkPortAvailability(info.port).then(available => {
    console.log(`Estado del puerto: ${available ? '✅ Disponible' : '❌ Ocupado'}`);
    
    if (!available) {
      console.log('\n⚠️  ADVERTENCIA: El puerto configurado está ocupado.');
      console.log('   Considera detener otros procesos o cambiar la configuración.');
    }
  });
}
