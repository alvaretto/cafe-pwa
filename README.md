# Tinto del Mirador CRM

CRM integral especializado para emprendimientos de venta de café por libras, medias libras y gramos. Una aplicación web progresiva (PWA) moderna con capacidades offline y funcionalidades inteligentes impulsadas por IA.

## 🚀 Características Principales

### 📊 Panel de Control Inteligente
- Métricas KPI en tiempo real
- Gráficos interactivos y dinámicos
- Análisis predictivo con IA (Gemini)
- Notificaciones inteligentes categorizadas
- Recordatorios automatizados

### 🛍️ Sistema de Ventas Avanzado
- Interfaz de punto de venta intuitiva
- Soporte para múltiples unidades de medida (gramos, media libra, libra, kilogramo)
- Facturación automática
- Historial completo de ventas
- Integración con métodos de pago digitales

### 👥 Gestión Integral de Clientes
- Base de datos completa de clientes
- Segmentación automática (nuevos, frecuentes, VIP, inactivos)
- Sistema de fidelización con puntos
- Comunicación automatizada (cumpleaños, ofertas)
- Historial de compras y preferencias

### 📦 Control de Inventario Inteligente
- Alertas automáticas de reabastecimiento
- Predicción de demanda con IA
- Control de stock en tiempo real
- Gestión de códigos de barras y QR
- Historial de movimientos

### 💰 Control de Gastos Empresariales
- Categorización detallada de gastos
- Presupuestos por categoría con alertas
- Comprobantes digitales
- Análisis comparativo
- Integración contable

### 📱 Capacidades PWA
- Funcionalidad offline completa
- Instalable en dispositivos móviles
- Notificaciones push
- Sincronización automática
- Experiencia nativa

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** con App Router
- **React 18+** con TypeScript
- **Tailwind CSS** + **Shadcn/ui**
- **PWA** con Workbox
- **Zustand** para state management
- **React Query** para data fetching
- **Recharts** para gráficos

### Backend
- **Next.js API Routes**
- **Prisma ORM** con PostgreSQL
- **NextAuth.js** + Firebase Authentication
- **Google Gemini AI** para funcionalidades inteligentes

### Servicios
- **Firebase** (Authentication, Storage)
- **Vercel** (Hosting y deployment)
- **Resend** (Email notifications)
- **PostgreSQL** (Base de datos)

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm 8+
- PostgreSQL
- Cuenta de Firebase
- API Key de Google Gemini

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/tinto-del-mirador-crm.git
cd tinto-del-mirador-crm
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus configuraciones:

```env
# Base de datos
DATABASE_URL="postgresql://username:password@localhost:5432/tinto_del_mirador"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-aqui"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="tu-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="tu-proyecto-id"
# ... más configuraciones de Firebase

# Google Gemini AI
GEMINI_API_KEY="tu-gemini-api-key"

# Email Service
RESEND_API_KEY="tu-resend-api-key"
```

### 4. Configurar la base de datos
```bash
# Generar cliente de Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Poblar con datos iniciales (opcional)
npm run db:seed
```

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📱 Instalación como PWA

### En dispositivos móviles:
1. Abre la aplicación en tu navegador móvil
2. Busca la opción "Agregar a pantalla de inicio" o "Instalar app"
3. Sigue las instrucciones del navegador

### En escritorio:
1. Abre la aplicación en Chrome, Edge o Firefox
2. Busca el ícono de instalación en la barra de direcciones
3. Haz clic en "Instalar" cuando aparezca el prompt

## 🧪 Testing

### Ejecutar tests unitarios
```bash
npm test
```

### Ejecutar tests con cobertura
```bash
npm run test:coverage
```

### Ejecutar tests E2E
```bash
npm run test:e2e
```

## 🚀 Deployment

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Deploy automático en cada push a main

### Manual
```bash
# Build de producción
npm run build

# Iniciar servidor de producción
npm start
```

## 📚 Documentación

### Estructura del proyecto
```
src/
├── app/                 # App Router de Next.js
├── components/          # Componentes React
│   ├── ui/             # Componentes de UI base
│   ├── auth/           # Componentes de autenticación
│   ├── dashboard/      # Componentes del dashboard
│   └── ...
├── lib/                # Utilidades y configuraciones
├── hooks/              # Custom hooks
├── types/              # Definiciones de TypeScript
├── styles/             # Estilos globales
└── config/             # Configuraciones
```

### API Routes
- `/api/auth/*` - Autenticación con NextAuth.js
- `/api/sales/*` - Gestión de ventas
- `/api/customers/*` - Gestión de clientes
- `/api/products/*` - Gestión de productos
- `/api/inventory/*` - Control de inventario
- `/api/reports/*` - Generación de reportes

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de contribución
- Sigue las convenciones de código establecidas
- Escribe tests para nuevas funcionalidades
- Actualiza la documentación cuando sea necesario
- Usa commits descriptivos siguiendo Conventional Commits

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

- 📧 Email: soporte@tintodel mirador.com
- 💬 Discord: [Servidor de la comunidad](https://discord.gg/tintodel mirador)
- 📖 Documentación: [docs.tintodel mirador.com](https://docs.tintodel mirador.com)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/tinto-del-mirador-crm/issues)

## 🎯 Roadmap

### v1.1 (Q1 2024)
- [ ] Aplicación móvil nativa (iOS/Android)
- [ ] Integración con WhatsApp Business
- [ ] Reportes avanzados con BI
- [ ] API pública para integraciones

### v1.2 (Q2 2024)
- [ ] Módulo de marketing automatizado
- [ ] Integración con redes sociales
- [ ] Sistema de franquicias
- [ ] Análisis de competencia con IA

### v2.0 (Q3 2024)
- [ ] Marketplace de productos
- [ ] Sistema de delivery integrado
- [ ] Inteligencia artificial avanzada
- [ ] Expansión internacional

## 🏆 Reconocimientos

- Desarrollado con ❤️ para la comunidad cafetera
- Inspirado en las necesidades reales de emprendedores colombianos
- Construido con las mejores prácticas de desarrollo moderno

---

**Tinto del Mirador CRM** - Potenciando emprendimientos cafeteros con tecnología de vanguardia ☕️🚀
