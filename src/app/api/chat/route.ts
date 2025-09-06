import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import {
  MOCK_PRODUCTS,
  MOCK_CUSTOMERS,
  MOCK_SALES,
  MOCK_EXPENSES,
  MOCK_SUPPLIERS,
  MOCK_INVENTORY_MOVEMENTS,
  getExpensesStats,
  getSalesStats
} from '@/lib/mock-data'

// Configuración de autenticación simplificada para la API
const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
}

// Las configuraciones de API se inicializarán dentro de la función para asegurar acceso a variables de entorno

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function generateDemoResponse(message: string, userRole: string): string {
  const lowerMessage = message.toLowerCase()

  // Respuestas específicas por rol
  if (userRole === 'ADMIN') {
    if (lowerMessage.includes('margen') || lowerMessage.includes('ganancia')) {
      return `**Análisis de Márgenes - Modo Demo**

📊 **Café Arábica Premium:**
- Costo: $8,500/kg
- Precio venta: $12,000/kg
- Margen bruto: 29.2%

📈 **Tendencia este mes:**
- Ventas: +15% vs mes anterior
- Margen promedio: 28.5%

*Nota: Esta es una respuesta de demostración. Para análisis reales, configura tu API key de Gemini.*`
    }

    if (lowerMessage.includes('puc') || lowerMessage.includes('contable') || lowerMessage.includes('bolsa')) {
      return `**Clasificación Contable PUC 2025 - Modo Demo**

🏷️ **Bolsas de empaque para café:**
- **Cuenta:** 1405 - Inventario de Materias Primas
- **Subcuenta:** 140505 - Materiales de Empaque
- **Justificación:** Se incorporan físicamente al producto final

📋 **Tratamiento contable:**
1. **Compra:** Débito 1405, Crédito 2205 (Proveedores)
2. **Uso:** Se incluye en costo de ventas al momento de la venta
3. **No es gasto** operacional, es parte del inventario

*Respuesta basada en PUC 2025 Colombia - Modo Demo*`
    }

    if (lowerMessage.includes('gasto') || lowerMessage.includes('expense')) {
      return `**Análisis de Gastos - Modo Demo**

💰 **Gastos este mes:**
- Total: $2,450,000
- Vs mes anterior: +8.5%

📊 **Por categoría:**
- Servicios públicos: $850,000 (35%)
- Arriendo: $600,000 (24%)
- Publicidad: $400,000 (16%)
- Otros: $600,000 (25%)

⚠️ **Alertas:** Servicios públicos aumentaron 12% este mes.

*Datos de demostración - Configura Gemini AI para análisis reales*`
    }
  } else {
    // Respuestas para VENDEDOR
    if (lowerMessage.includes('producto') || lowerMessage.includes('disponible')) {
      return `**Productos Disponibles - Modo Demo**

☕ **Stock actual:**
- Café Arábica Premium: 2,500g
- Café Especial Tinto del Mirador: 1,800g
- Café Molido Tradicional: 3,200g
- Café en Grano Orgánico: 1,200g

💰 **Precios por gramo:**
- Arábica Premium: $12/g
- Especial Tinto: $10/g
- Molido Tradicional: $8/g
- Grano Orgánico: $15/g

✅ Todos los productos están disponibles para venta inmediata.

*Información de demostración*`
    }

    if (lowerMessage.includes('cliente') || lowerMessage.includes('compra')) {
      return `**Análisis de Clientes - Modo Demo**

👥 **Clientes activos:**
- Total registrados: 156 clientes
- Compras últimos 30 días: 89 clientes

📉 **Clientes inactivos (>30 días):**
- María González - Última compra: 45 días
- Carlos Rodríguez - Última compra: 38 días
- Ana Martínez - Última compra: 52 días

💡 **Sugerencia:** Contactar clientes inactivos con promoción especial.

*Datos de demostración*`
    }

    if (lowerMessage.includes('precio')) {
      return `**Lista de Precios - Modo Demo**

☕ **Precios actuales:**
- Café Especial Tinto del Mirador: $10/g
- Media libra (227g): $2,270
- Una libra (454g): $4,540

📊 **Comparativa:**
- Competencia promedio: $11/g
- Nuestro precio: $10/g (9% más competitivo)

✨ **Promociones activas:**
- 2x1 en medias libras los viernes
- Descuento 10% por compras >$50,000

*Precios de demostración*`
    }
  }

  // Respuesta genérica
  return `**Asistente IA - Modo Demo**

Hola, soy tu asistente inteligente del CRM Tinto del Mirador.

${userRole === 'ADMIN'
  ? '🔧 **Modo Administrador:** Puedo ayudarte con análisis financieros, clasificación contable PUC 2025, gestión de gastos y reportes avanzados.'
  : '🛒 **Modo Vendedor:** Puedo ayudarte con información de productos, clientes, precios e inventario disponible.'
}

**Tu consulta:** "${message}"

Para obtener respuestas más precisas y análisis detallados basados en tus datos reales, configura tu API key de Google Gemini AI.

**Ejemplos de consultas:**
${userRole === 'ADMIN'
  ? '- "¿Cuál es el margen del Café Arábica?"\n- "¿Cómo clasifico las bolsas según PUC 2025?"\n- "¿Cuáles son los gastos más altos?"'
  : '- "¿Qué productos están disponibles?"\n- "¿Cuál es el precio del café especial?"\n- "¿Qué clientes no han comprado últimamente?"'
}

*Respuesta generada en modo demostración*`
}

function getSystemContext(userRole: string) {
  const baseContext = `
Eres un asistente inteligente especializado en el CRM "Tinto del Mirador", un sistema para negocios de venta de café.

INFORMACIÓN DEL NEGOCIO:
- Negocio: Venta de café por libras, medias libras y gramos
- Sistema: CRM completo con módulos de ventas, inventario, clientes, gastos y reportes
- Contabilidad: Implementa PUC 2025 Colombia para clasificación contable

DATOS ACTUALES DEL SISTEMA:
- Productos: ${MOCK_PRODUCTS.length} productos de café disponibles
- Clientes: ${MOCK_CUSTOMERS.length} clientes registrados  
- Ventas: ${MOCK_SALES.length} ventas registradas
- Proveedores: ${MOCK_SUPPLIERS.length} proveedores activos
- Movimientos de inventario: ${MOCK_INVENTORY_MOVEMENTS.length} movimientos

PRODUCTOS DISPONIBLES:
${MOCK_PRODUCTS.map(p => `- ${p.name}: Stock ${p.stock}g, Precio/g: $${p.pricePerGram}`).join('\n')}

CLIENTES PRINCIPALES:
${MOCK_CUSTOMERS.slice(0, 5).map(c => `- ${c.nombres} ${c.apellidos}: ${c.totalPurchases} compras, $${c.totalSpent.toLocaleString()}`).join('\n')}
`

  if (userRole === 'ADMIN') {
    // Datos simplificados para demo
    const totalExpenses = MOCK_EXPENSES.reduce((sum, exp) => sum + exp.amount, 0)
    const totalSales = MOCK_SALES.reduce((sum, sale) => sum + sale.total, 0)

    return baseContext + `

ROL: ADMINISTRADOR - Acceso completo a todos los datos

DATOS FINANCIEROS (DEMO):
- Gastos registrados: $${totalExpenses.toLocaleString()}
- Ventas registradas: $${totalSales.toLocaleString()}
- Productos en inventario: ${MOCK_PRODUCTS.length} tipos diferentes

GASTOS PRINCIPALES:
- Servicios públicos, arriendo, publicidad, materias primas

CONOCIMIENTO CONTABLE PUC 2025:
- Materiales de empaque (bolsas, etiquetas): Cuenta 1405 - Inventario de Materias Primas
- Café verde: Cuenta 1405 - Inventario de Materias Primas  
- Café procesado: Cuenta 1430 - Productos Terminados
- Gastos administrativos: Grupo 51
- Gastos de ventas: Grupo 52

Puedes responder consultas sobre:
✅ Análisis financiero completo
✅ Configuración del sistema
✅ Clasificación contable PUC 2025
✅ Márgenes y rentabilidad
✅ Gestión de usuarios
✅ Reportes avanzados
✅ Todos los módulos del sistema`
  } else {
    return baseContext + `

ROL: VENDEDOR - Acceso limitado a datos de ventas y productos

RESTRICCIONES:
❌ Sin acceso a datos financieros sensibles (gastos, márgenes detallados)
❌ Sin acceso a configuración del sistema
❌ Sin información sobre costos de productos

Puedes responder consultas sobre:
✅ Productos disponibles y precios de venta
✅ Stock e inventario disponible
✅ Información de clientes y historial de compras
✅ Registro de ventas
✅ Sugerencias de atención al cliente
✅ Recomendaciones de productos`
  }
}

export async function POST(request: NextRequest) {
  try {
    // Inicializar clientes de IA dentro de la función
    // Cargar configuración local si existe (solo en desarrollo)
    try {
      if (process.env.NODE_ENV === 'development') {
        require('../../../local-config')
      }
    } catch (e) {
      // Archivo de configuración local no existe, usar variables de entorno
    }

    // Usar la API key de Anthropic Claude desde variables de entorno
    const finalAnthropicKey = process.env.ANTHROPIC_API_KEY

    const anthropic = finalAnthropicKey && finalAnthropicKey.includes('sk-ant-')
      ? new Anthropic({
          apiKey: finalAnthropicKey,
        })
      : null

    const genAI = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'tu-gemini-api-key-aqui'
      ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
      : null

    // Simplificar autenticación para demo - en producción usar getServerSession
    const { message, userRole, conversationHistory } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 })
    }

    // Validar rol
    if (!userRole || !['ADMIN', 'VENDEDOR'].includes(userRole)) {
      return NextResponse.json({ error: 'Rol inválido' }, { status: 400 })
    }

    // Validaciones adicionales para vendedores
    if (userRole === 'VENDEDOR') {
      const restrictedKeywords = [
        'gasto', 'costo', 'margen', 'ganancia', 'configuración', 
        'usuario', 'admin', 'contraseña', 'financiero', 'rentabilidad'
      ]
      
      const hasRestrictedContent = restrictedKeywords.some(keyword => 
        message.toLowerCase().includes(keyword)
      )
      
      if (hasRestrictedContent) {
        return NextResponse.json({
          response: "Lo siento, como vendedor no tengo acceso a información financiera sensible o de configuración del sistema. Puedo ayudarte con consultas sobre productos, clientes, inventario y ventas. ¿En qué más puedo asistirte?"
        })
      }
    }

    // Intentar usar Anthropic Claude primero
    if (anthropic) {
      try {
        const systemContext = getSystemContext(userRole)

        // Construir el historial de conversación para contexto
        const conversationContext = conversationHistory
          ?.slice(-3) // Últimos 3 mensajes
          ?.map((msg: ChatMessage) => `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`)
          ?.join('\n') || ''

        const systemPrompt = `${systemContext}

${conversationContext ? `CONTEXTO DE CONVERSACIÓN PREVIA:\n${conversationContext}\n` : ''}

INSTRUCCIONES:
- Responde de manera profesional y útil
- Usa los datos reales del sistema cuando sea relevante
- Para consultas contables, referencia el PUC 2025
- Mantén las restricciones de rol (${userRole})
- Usa formato markdown para mejor legibilidad
- Si no tienes información específica, sugiere alternativas
- Sé conciso pero completo en tus respuestas
- Responde siempre en español`

        const claudeResponse = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1000,
          temperature: 0.7,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: message
            }
          ]
        })

        const firstContent = claudeResponse.content?.[0]
        const responseText = firstContent && firstContent.type === 'text'
          ? firstContent.text
          : 'Error procesando respuesta de Claude'

        return NextResponse.json({ response: responseText })
      } catch (claudeError) {
        console.error('Error con Claude API, intentando Gemini:', claudeError)

        // Si falla Claude, intentar con Gemini como respaldo
        if (genAI) {
          try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
            const systemContext = getSystemContext(userRole)

            const conversationContext = conversationHistory
              ?.slice(-3)
              ?.map((msg: ChatMessage) => `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`)
              ?.join('\n') || ''

            const prompt = `${systemContext}

${conversationContext ? `CONTEXTO DE CONVERSACIÓN PREVIA:\n${conversationContext}\n` : ''}

CONSULTA ACTUAL: ${message}

INSTRUCCIONES:
- Responde de manera profesional y útil
- Usa los datos reales del sistema cuando sea relevante
- Para consultas contables, referencia el PUC 2025
- Mantén las restricciones de rol (${userRole})
- Usa formato markdown para mejor legibilidad
- Si no tienes información específica, sugiere alternativas
- Sé conciso pero completo en tus respuestas

Respuesta:`

            const result = await model.generateContent(prompt)
            const response = result.response
            const text = response.text()

            return NextResponse.json({ response: text + '\n\n*🔄 Respuesta generada con Gemini AI (respaldo)*' })
          } catch (geminiError) {
            console.error('Error con ambas APIs, usando respuesta de demostración:', geminiError)
          }
        }
      }
    }

    // Si no hay APIs disponibles, devolver error
    return NextResponse.json({
      response: '❌ **Error de configuración**\n\nNo se pudo conectar con los servicios de IA. Verifique la configuración de las API keys de Anthropic Claude o Google Gemini.',
      error: 'API_NOT_CONFIGURED'
    }, { status: 500 })

  } catch (error) {
    console.error('Error en chat API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}
