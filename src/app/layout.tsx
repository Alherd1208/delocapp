import type { Metadata } from 'next'
import './globals.css'
import { TelegramProvider } from '@/components/TelegramProvider'

export const metadata: Metadata = {
    title: 'Cargo TMA',
    description: 'Telegram Mini App for cargo delivery',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <TelegramProvider>
                    {children}
                </TelegramProvider>
            </body>
        </html>
    )
}
