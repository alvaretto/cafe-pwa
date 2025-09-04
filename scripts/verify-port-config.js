#!/usr/bin/env node

/**
 * Script de Verificación de Configuración de Puerto
 * CRM Tinto del Mirador
 * 
 * Este script verifica que el puerto 3001 esté configurado
 * correctamente en todos los archivos de la aplicación.
 */

const fs = require('fs');
const path = require('path');

const EXPECTED_PORT = '3001';
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

function checkFile(filePath, patterns, description) {
  if (!fs.existsSync(filePath)) {
    console.log(`  ${colorize('⚠️', 'yellow')} ${description}: ${colorize('Archivo no encontrado', 'yellow')}`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  let allPassed = true;

  patterns.forEach(pattern => {
    const regex = new RegExp(pattern.regex, 'g');
    const matches = content.match(regex);
    
    if (pattern.shouldExist) {
      if (matches && matches.length > 0) {
        console.log(`  ${colorize('✅', 'green')} ${description}: ${pattern.description}`);
      } else {
        console.log(`  ${colorize('❌', 'red')} ${description}: ${pattern.description} - NO ENCONTRADO`);
        allPassed = false;
      }
    } else {
      if (!matches || matches.length === 0) {
        console.log(`  ${colorize('✅', 'green')} ${description}: ${pattern.description}`);
      } else {
        console.log(`  ${colorize('❌', 'red')} ${description}: ${pattern.description} - ENCONTRADO (no debería estar)`);
        allPassed = false;
      }
    }
  });

  return allPassed;
}

function main() {
  console.log(colorize('\n🔧 VERIFICACIÓN DE CONFIGURACIÓN DE PUERTO FIJO 3001', 'bright'));
  console.log(colorize('=' .repeat(60), 'cyan'));

  const checks = [
    {
      file: 'package.json',
      patterns: [
        { regex: '"dev":\\s*"next dev -p 3001"', shouldExist: true, description: 'Script dev con puerto 3001' },
        { regex: '"start":\\s*"next start -p 3001"', shouldExist: true, description: 'Script start con puerto 3001' },
        { regex: 'PORT=30[02]', shouldExist: false, description: 'Sin referencias a puertos dinámicos' }
      ],
      description: 'package.json'
    },
    {
      file: '.env.local',
      patterns: [
        { regex: 'NEXTAUTH_URL="http://localhost:3001"', shouldExist: true, description: 'NEXTAUTH_URL con puerto 3001' },
        { regex: 'NEXT_PUBLIC_APP_URL="http://localhost:3001"', shouldExist: true, description: 'NEXT_PUBLIC_APP_URL con puerto 3001' },
        { regex: 'localhost:30[02](?!1)', shouldExist: false, description: 'Sin referencias a otros puertos' }
      ],
      description: '.env.local'
    },
    {
      file: '.env.example',
      patterns: [
        { regex: 'NEXTAUTH_URL="http://localhost:3001"', shouldExist: true, description: 'NEXTAUTH_URL con puerto 3001' },
        { regex: 'NEXT_PUBLIC_APP_URL="http://localhost:3001"', shouldExist: true, description: 'NEXT_PUBLIC_APP_URL con puerto 3001' }
      ],
      description: '.env.example'
    },
    {
      file: 'next.config.js',
      patterns: [
        { regex: 'NEXT_PUBLIC_APP_PORT.*3001', shouldExist: true, description: 'Puerto 3001 en configuración' }
      ],
      description: 'next.config.js'
    },
    {
      file: 'port.config.js',
      patterns: [
        { regex: 'APP_PORT = 3001', shouldExist: true, description: 'APP_PORT configurado a 3001' }
      ],
      description: 'port.config.js'
    },
    {
      file: 'README.md',
      patterns: [
        { regex: 'http://localhost:3001', shouldExist: true, description: 'URLs con puerto 3001' },
        { regex: 'PORT=30[02]', shouldExist: false, description: 'Sin referencias a puertos dinámicos' }
      ],
      description: 'README.md'
    },
    {
      file: 'README.html',
      patterns: [
        { regex: 'http://localhost:3001', shouldExist: true, description: 'URLs con puerto 3001' },
        { regex: 'PORT=30[02]', shouldExist: false, description: 'Sin referencias a puertos dinámicos' }
      ],
      description: 'README.html'
    },
    {
      file: 'jest.setup.js',
      patterns: [
        { regex: 'NEXTAUTH_URL.*http://localhost:3001', shouldExist: true, description: 'NEXTAUTH_URL en tests con puerto 3001' }
      ],
      description: 'jest.setup.js'
    },
    {
      file: 'jest.env.js',
      patterns: [
        { regex: 'NEXTAUTH_URL.*http://localhost:3001', shouldExist: true, description: 'NEXTAUTH_URL en env de tests con puerto 3001' }
      ],
      description: 'jest.env.js'
    }
  ];

  let allPassed = true;

  checks.forEach(check => {
    const passed = checkFile(check.file, check.patterns, check.description);
    if (!passed) allPassed = false;
  });

  console.log(colorize('\n' + '=' .repeat(60), 'cyan'));
  
  if (allPassed) {
    console.log(colorize('🎉 CONFIGURACIÓN CORRECTA: Puerto 3001 configurado permanentemente', 'green'));
    console.log(colorize('✅ Todos los archivos tienen la configuración correcta', 'green'));
    console.log(colorize('🔒 No se encontraron referencias a puertos dinámicos', 'green'));
  } else {
    console.log(colorize('❌ CONFIGURACIÓN INCORRECTA: Se encontraron problemas', 'red'));
    console.log(colorize('⚠️  Revisa los archivos marcados con errores', 'yellow'));
  }

  console.log(colorize('\n📋 RESUMEN:', 'bright'));
  console.log(`  Puerto configurado: ${colorize(EXPECTED_PORT, 'cyan')}`);
  console.log(`  URL de desarrollo: ${colorize('http://localhost:' + EXPECTED_PORT, 'cyan')}`);
  console.log(`  Estado: ${allPassed ? colorize('FIJO Y PERMANENTE', 'green') : colorize('REQUIERE CORRECCIÓN', 'red')}`);
}

if (require.main === module) {
  main();
}

module.exports = { main };
