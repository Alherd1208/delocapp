declare global {
    interface Window {
        Telegram?: {
            WebApp: {
                ready: () => void
                expand: () => void
                close: () => void
                colorScheme: 'light' | 'dark'
                themeParams: {
                    bg_color: string
                    text_color: string
                    hint_color: string
                    link_color: string
                    button_color: string
                    button_text_color: string
                }
                initData: string
                initDataUnsafe: {
                    user?: {
                        id: number
                        first_name: string
                        last_name?: string
                        username?: string
                        language_code?: string
                    }
                }
                MainButton: {
                    text: string
                    color: string
                    textColor: string
                    isVisible: boolean
                    isActive: boolean
                    show: () => void
                    hide: () => void
                    enable: () => void
                    disable: () => void
                    setText: (text: string) => void
                    onClick: (callback: () => void) => void
                    offClick: (callback: () => void) => void
                }
                BackButton: {
                    isVisible: boolean
                    show: () => void
                    hide: () => void
                    onClick: (callback: () => void) => void
                    offClick: (callback: () => void) => void
                }
                HapticFeedback: {
                    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
                    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
                    selectionChanged: () => void
                }
                showAlert: (message: string, callback?: () => void) => void
                showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
                showPopup: (params: {
                    title?: string
                    message: string
                    buttons?: Array<{
                        id?: string
                        type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
                        text: string
                    }>
                }, callback?: (buttonId: string) => void) => void
            }
        }
    }
}

export { }
