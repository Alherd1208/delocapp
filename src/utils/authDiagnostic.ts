// Authentication Diagnostic Utility
export interface AuthDiagnosticResult {
    isTelegramAvailable: boolean;
    hasWebApp: boolean;
    hasUserData: boolean;
    userData: any;
    currentUser: any;
    debugMode: boolean;
    recommendations: string[];
}

export function diagnoseAuthentication(currentUser: any): AuthDiagnosticResult {
    const recommendations: string[] = [];

    // Check Telegram availability
    const isTelegramAvailable = typeof window !== 'undefined' && !!window.Telegram;
    const hasWebApp = isTelegramAvailable && !!window.Telegram?.WebApp;
    const userData = hasWebApp ? window.Telegram.WebApp.initDataUnsafe.user : null;
    const hasUserData = !!userData?.id;
    const debugMode = !hasWebApp;

    // Generate recommendations
    if (!isTelegramAvailable) {
        recommendations.push('Telegram object not available. Ensure you\'re running in Telegram environment.');
    } else if (!hasWebApp) {
        recommendations.push('Telegram WebApp not available. Check if Telegram WebApp script is loaded.');
    } else if (!hasUserData) {
        recommendations.push('No user data found in Telegram WebApp. User might not be authenticated.');
    } else if (!currentUser) {
        recommendations.push('User data available but not set in store. Check user initialization logic.');
    }

    if (debugMode) {
        recommendations.push('Running in debug mode. Set up debug user or test in Telegram environment.');
    }

    return {
        isTelegramAvailable,
        hasWebApp,
        hasUserData,
        userData,
        currentUser,
        debugMode,
        recommendations
    };
}

export function logAuthDiagnostic(currentUser: any, context: string = '') {
    const diagnostic = diagnoseAuthentication(currentUser);

    console.log(`=== AUTH DIAGNOSTIC ${context} ===`);
    console.log('Telegram Available:', diagnostic.isTelegramAvailable);
    console.log('Has WebApp:', diagnostic.hasWebApp);
    console.log('Has User Data:', diagnostic.hasUserData);
    console.log('User Data:', diagnostic.userData);
    console.log('Current User:', diagnostic.currentUser);
    console.log('Debug Mode:', diagnostic.debugMode);
    console.log('Recommendations:', diagnostic.recommendations);
    console.log('=== END AUTH DIAGNOSTIC ===');

    return diagnostic;
}
