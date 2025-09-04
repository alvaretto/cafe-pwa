import { GoogleGenerativeAI } from '@google/generative-ai'

// Inicializar Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Configuración del modelo
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
})

/**
 * Analiza datos de ventas y genera insights
 */
export async function analyzeSalesData(salesData: any[]) {
  try {
    const prompt = `
    Analiza los siguientes datos de ventas de una tienda de café y proporciona insights útiles:
    
    Datos de ventas: ${JSON.stringify(salesData, null, 2)}
    
    Por favor proporciona:
    1. Tendencias principales de ventas
    2. Productos más vendidos
    3. Patrones de comportamiento de clientes
    4. Recomendaciones para mejorar las ventas
    5. Predicciones para el próximo período
    
    Responde en español y de manera concisa pero informativa.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    return {
      success: true,
      insights: response.text(),
    }
  } catch (error) {
    console.error('Error analyzing sales data:', error)
    return {
      success: false,
      error: 'Error al analizar los datos de ventas',
    }
  }
}

/**
 * Genera recomendaciones de productos basadas en historial de compras
 */
export async function generateProductRecommendations(customerData: any, purchaseHistory: any[]) {
  try {
    const prompt = `
    Basándote en el siguiente perfil de cliente y su historial de compras, genera recomendaciones de productos de café:
    
    Cliente: ${JSON.stringify(customerData, null, 2)}
    Historial de compras: ${JSON.stringify(purchaseHistory, null, 2)}
    
    Proporciona:
    1. 3-5 productos recomendados con justificación
    2. Momento ideal para la recomendación
    3. Estrategia de comunicación sugerida
    
    Responde en español y enfócate en productos de café (granos, molido, mezclas especiales).
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    return {
      success: true,
      recommendations: response.text(),
    }
  } catch (error) {
    console.error('Error generating product recommendations:', error)
    return {
      success: false,
      error: 'Error al generar recomendaciones de productos',
    }
  }
}

/**
 * Optimiza precios basado en datos de mercado y competencia
 */
export async function optimizePricing(productData: any, marketData?: any) {
  try {
    const prompt = `
    Analiza el siguiente producto de café y sugiere optimizaciones de precio:
    
    Producto: ${JSON.stringify(productData, null, 2)}
    ${marketData ? `Datos de mercado: ${JSON.stringify(marketData, null, 2)}` : ''}
    
    Considera:
    1. Costos de producción
    2. Margen de ganancia actual
    3. Competencia en el mercado colombiano de café
    4. Elasticidad de la demanda
    5. Estrategias de precios por volumen (gramo, media libra, libra, kilogramo)
    
    Proporciona:
    1. Precio óptimo sugerido para cada unidad de medida
    2. Justificación de los cambios
    3. Impacto esperado en las ventas
    4. Estrategia de implementación
    
    Responde en español con precios en pesos colombianos (COP).
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    return {
      success: true,
      optimization: response.text(),
    }
  } catch (error) {
    console.error('Error optimizing pricing:', error)
    return {
      success: false,
      error: 'Error al optimizar precios',
    }
  }
}

/**
 * Predice demanda de inventario
 */
export async function predictInventoryDemand(inventoryData: any[], salesHistory: any[]) {
  try {
    const prompt = `
    Analiza el inventario actual y el historial de ventas para predecir la demanda futura:
    
    Inventario actual: ${JSON.stringify(inventoryData, null, 2)}
    Historial de ventas: ${JSON.stringify(salesHistory, null, 2)}
    
    Proporciona:
    1. Predicción de demanda para los próximos 30 días
    2. Productos que necesitan reabastecimiento urgente
    3. Cantidad sugerida de reorden para cada producto
    4. Productos con riesgo de sobrestock
    5. Estacionalidad y tendencias identificadas
    
    Responde en español con cantidades en gramos.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    return {
      success: true,
      prediction: response.text(),
    }
  } catch (error) {
    console.error('Error predicting inventory demand:', error)
    return {
      success: false,
      error: 'Error al predecir demanda de inventario',
    }
  }
}

/**
 * Genera estrategias de marketing personalizadas
 */
export async function generateMarketingStrategy(customerSegments: any[], salesData: any[]) {
  try {
    const prompt = `
    Basándote en los segmentos de clientes y datos de ventas, genera estrategias de marketing personalizadas:
    
    Segmentos de clientes: ${JSON.stringify(customerSegments, null, 2)}
    Datos de ventas: ${JSON.stringify(salesData, null, 2)}
    
    Para cada segmento (NUEVO, OCASIONAL, FRECUENTE, VIP, INACTIVO), proporciona:
    1. Estrategia de comunicación específica
    2. Ofertas y promociones recomendadas
    3. Canales de marketing más efectivos
    4. Frecuencia de contacto sugerida
    5. Métricas de éxito a medir
    
    Enfócate en el mercado colombiano de café y responde en español.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    return {
      success: true,
      strategy: response.text(),
    }
  } catch (error) {
    console.error('Error generating marketing strategy:', error)
    return {
      success: false,
      error: 'Error al generar estrategia de marketing',
    }
  }
}

/**
 * Detecta anomalías en ventas y gastos
 */
export async function detectAnomalies(salesData: any[], expenseData: any[]) {
  try {
    const prompt = `
    Analiza los siguientes datos de ventas y gastos para detectar anomalías o patrones inusuales:
    
    Datos de ventas: ${JSON.stringify(salesData, null, 2)}
    Datos de gastos: ${JSON.stringify(expenseData, null, 2)}
    
    Identifica:
    1. Anomalías en patrones de ventas
    2. Gastos inusuales o fuera de lo normal
    3. Discrepancias entre ventas y gastos
    4. Posibles problemas operativos
    5. Oportunidades de optimización
    
    Para cada anomalía detectada, proporciona:
    - Descripción del problema
    - Posibles causas
    - Recomendaciones de acción
    - Nivel de prioridad (Alto, Medio, Bajo)
    
    Responde en español.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    return {
      success: true,
      anomalies: response.text(),
    }
  } catch (error) {
    console.error('Error detecting anomalies:', error)
    return {
      success: false,
      error: 'Error al detectar anomalías',
    }
  }
}

/**
 * Genera resumen ejecutivo inteligente
 */
export async function generateExecutiveSummary(dashboardData: any) {
  try {
    const prompt = `
    Genera un resumen ejecutivo inteligente basado en los siguientes datos del dashboard:
    
    ${JSON.stringify(dashboardData, null, 2)}
    
    El resumen debe incluir:
    1. Estado general del negocio (2-3 líneas)
    2. Métricas clave más importantes
    3. Tendencias principales identificadas
    4. Alertas o áreas que requieren atención
    5. Recomendaciones prioritarias (máximo 3)
    6. Perspectivas para el próximo período
    
    Mantén un tono profesional pero accesible, en español, y limita la respuesta a 200 palabras.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    return {
      success: true,
      summary: response.text(),
    }
  } catch (error) {
    console.error('Error generating executive summary:', error)
    return {
      success: false,
      error: 'Error al generar resumen ejecutivo',
    }
  }
}

/**
 * Función de utilidad para validar la configuración de Gemini
 */
export function validateGeminiConfig(): boolean {
  return !!process.env.GEMINI_API_KEY
}
