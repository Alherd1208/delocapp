'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { logAuthDiagnostic } from '@/utils/authDiagnostic'
import { RefreshCw, User, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export function AuthDebugger() {
    const { currentUser, setCurrentUser } = useStore()
    const [diagnostic, setDiagnostic] = useState<any>(null)
    const [lastChecked, setLastChecked] = useState<Date | null>(null)

    const runDiagnostic = () => {
        const result = logAuthDiagnostic(currentUser, 'DEBUG COMPONENT')
        setDiagnostic(result)
        setLastChecked(new Date())
    }

    const forceSetDebugUser = () => {
        const debugUser = {
            id: 12345,
            first_name: 'Debug',
            last_name: 'User',
            username: 'debug_user'
        }
        setCurrentUser(debugUser)
        runDiagnostic()
    }

    const tryGetTelegramUser = () => {
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            const telegramUser = window.Telegram.WebApp.initDataUnsafe.user
            setCurrentUser(telegramUser)
            runDiagnostic()
        } else {
            alert('No Telegram user data available')
        }
    }

    useEffect(() => {
        runDiagnostic()
    }, [currentUser])

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'authenticated': return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'error': return <XCircle className="h-4 w-4 text-red-500" />
            default: return <AlertTriangle className="h-4 w-4 text-yellow-500" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'authenticated': return <Badge variant="default" className="bg-green-500">Authenticated</Badge>
            case 'error': return <Badge variant="destructive">Error</Badge>
            default: return <Badge variant="secondary">Unknown</Badge>
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Authentication Debugger
                        </CardTitle>
                        <CardDescription>
                            Diagnose authentication issues and test user setup
                        </CardDescription>
                    </div>
                    <Button onClick={runDiagnostic} variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Current Status */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                        {getStatusIcon(diagnostic?.hasUserData ? 'authenticated' : 'error')}
                        <span className="font-medium">Current Status</span>
                    </div>
                    {getStatusBadge(diagnostic?.hasUserData ? 'authenticated' : 'error')}
                </div>

                {/* Diagnostic Results */}
                {diagnostic && (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Telegram Available:</span>
                                <span className={`ml-2 ${diagnostic.isTelegramAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                    {diagnostic.isTelegramAvailable ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium">WebApp Available:</span>
                                <span className={`ml-2 ${diagnostic.hasWebApp ? 'text-green-600' : 'text-red-600'}`}>
                                    {diagnostic.hasWebApp ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium">User Data:</span>
                                <span className={`ml-2 ${diagnostic.hasUserData ? 'text-green-600' : 'text-red-600'}`}>
                                    {diagnostic.hasUserData ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium">Debug Mode:</span>
                                <span className={`ml-2 ${diagnostic.debugMode ? 'text-yellow-600' : 'text-green-600'}`}>
                                    {diagnostic.debugMode ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>

                        {/* User Data */}
                        <div>
                            <h4 className="font-medium mb-2">User Data:</h4>
                            <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                                {JSON.stringify(diagnostic.userData || diagnostic.currentUser || 'No user data', null, 2)}
                            </pre>
                        </div>

                        {/* Recommendations */}
                        {diagnostic.recommendations.length > 0 && (
                            <div>
                                <h4 className="font-medium mb-2 text-red-600">Recommendations:</h4>
                                <ul className="space-y-1">
                                    {diagnostic.recommendations.map((rec: string, index: number) => (
                                        <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                                            <span className="text-red-500 mt-1">•</span>
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                    <Button onClick={forceSetDebugUser} variant="outline" size="sm">
                        Set Debug User
                    </Button>
                    <Button onClick={tryGetTelegramUser} variant="outline" size="sm">
                        Get Telegram User
                    </Button>
                </div>

                {lastChecked && (
                    <p className="text-xs text-muted-foreground">
                        Last checked: {lastChecked.toLocaleTimeString()}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
