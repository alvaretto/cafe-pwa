import { Metadata } from 'next'
import { LandingPageSimple } from '@/components/landing/landing-page-simple'

export const metadata: Metadata = {
  title: 'Tinto del Mirador CRM',
  description: 'CRM integral para emprendimiento de venta de café por libras, medias libras y gramos',
}

export default function HomePage() {
  return <LandingPageSimple />
}
