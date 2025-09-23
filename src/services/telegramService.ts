// Telegram Mini App service - client-side implementation

export interface TelegramUser {
    id: number
    first_name: string
    last_name?: string
    username?: string
}

export interface ChatCreationResult {
    success: boolean
    chatId?: string
    inviteLink?: string
    error?: string
}

class TelegramService {
    constructor() {
        // Client-side Telegram Mini App service
        if (typeof window !== 'undefined') {
            console.log('TelegramService initialized for Mini App')
        }
    }

    /**
     * For Telegram Mini Apps, we'll use the Web App APIs to facilitate communication
     * Since we can't create groups directly, we'll:
     * 1. Show contact information to both users
     * 2. Use Telegram Web App APIs to send notifications
     * 3. Create deep links for direct contact
     */
    async createChatBetweenUsers(
        clientUser: TelegramUser,
        driverUser: TelegramUser,
        orderInfo: {
            id: string
            from: string
            to: string
            paymentAmount: number
        }
    ): Promise<ChatCreationResult> {
        try {
            // Use Telegram Web App APIs to facilitate contact
            return this.createContactFallback(clientUser, driverUser, orderInfo)
        } catch (error) {
            console.error('Error creating chat:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            }
        }
    }


    private createContactFallback(
        clientUser: TelegramUser,
        driverUser: TelegramUser,
        orderInfo: {
            id: string
            from: string
            to: string
            paymentAmount: number
        }
    ): ChatCreationResult {
        // Create deep links for users to contact each other
        const driverLink = driverUser.username
            ? `https://t.me/${driverUser.username}`
            : `tg://user?id=${driverUser.id}`

        const clientLink = clientUser.username
            ? `https://t.me/${clientUser.username}`
            : `tg://user?id=${clientUser.id}`

        // Store contact information in localStorage for later retrieval
        if (typeof window !== 'undefined') {
            const contactInfo = {
                orderId: orderInfo.id,
                client: clientUser,
                driver: driverUser,
                clientLink,
                driverLink,
                orderDetails: orderInfo,
                createdAt: new Date().toISOString()
            }

            localStorage.setItem(`order_contact_${orderInfo.id}`, JSON.stringify(contactInfo))
        }

        return {
            success: true,
            chatId: `contact_${orderInfo.id}`,
            inviteLink: driverLink,
        }
    }

    /**
     * Send a notification when an order is accepted
     * This can be used even without a bot token by using Telegram Web App APIs
     */
    async notifyOrderAccepted(
        orderId: string,
        clientUserId: string,
        driverUserId: string,
        orderInfo: {
            from: string
            to: string
            paymentAmount: number
        }
    ): Promise<boolean> {
        try {
            // If we're in a Telegram Web App, we can use the Web App APIs
            if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
                // Show success message
                window.Telegram.WebApp.showAlert(
                    `Order accepted! The client and driver will be connected for further communication.`
                )

                // Trigger haptic feedback
                if (window.Telegram.WebApp.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
                }

                return true
            }

            return false
        } catch (error) {
            console.error('Error sending notification:', error)
            return false
        }
    }
}

// Export a lazy-loaded singleton instance
let telegramServiceInstance: TelegramService | null = null

export const telegramService = {
    get instance() {
        if (!telegramServiceInstance) {
            telegramServiceInstance = new TelegramService()
        }
        return telegramServiceInstance
    }
}
