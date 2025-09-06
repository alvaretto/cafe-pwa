import { Metadata } from 'next'
import { ChatPageClient } from '@/components/chat/chat-page-client'

export const metadata: Metadata = {
  title: 'Chat con IA | Tinto del Mirador CRM',
  description: 'Asistente inteligente para consultas sobre el negocio, inventario, ventas y análisis contable',
  keywords: 'chat, IA, asistente, consultas, análisis, PUC 2025, inventario, ventas'
}

export default function ChatPage() {
  return <ChatPageClient />
}
