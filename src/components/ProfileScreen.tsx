'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, User, Package, Truck, Edit, Save, X, Bug, Settings } from 'lucide-react'

export function ProfileScreen() {
    const {
        setScreen,
        currentUser,
        updateCurrentUser,
        getUserOrders,
        getUserAcceptedOrders,
        loadOrders,
        loadDrivers,
        getDriverByUserId,
        userType
    } = useStore()

    const [isEditing, setIsEditing] = useState(false)
    const [editedUser, setEditedUser] = useState({
        first_name: currentUser?.first_name || '',
        last_name: currentUser?.last_name || '',
        username: currentUser?.username || ''
    })

    const [isClient, setIsClient] = useState(false)
    const [isDebugMode, setIsDebugMode] = useState(false)
    const [debugUser, setDebugUser] = useState({
        id: 12345,
        first_name: 'Debug',
        last_name: 'User',
        username: 'debug_user'
    })

    // Load data when component mounts
    useEffect(() => {
        setIsClient(true)

        // Check if we're in debug mode (not in Telegram environment)
        const debugMode = typeof window === 'undefined' || !window.Telegram?.WebApp
        setIsDebugMode(debugMode)

        loadOrders()
        loadDrivers()

        // If in debug mode and no current user, set debug user
        if (debugMode && !currentUser) {
            updateCurrentUser(debugUser)
        }
    }, [loadOrders, loadDrivers, currentUser, updateCurrentUser, debugUser])

    const userOrders = getUserOrders()
    const acceptedOrders = getUserAcceptedOrders()
    const isDriver = userType === 'driver'
    const driverProfile = isDriver ? getDriverByUserId(currentUser?.id?.toString() || '') : null

    const handleSaveProfile = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        }

        // Update the user data
        updateCurrentUser({
            ...currentUser,
            ...editedUser
        })
        setIsEditing(false)

        // Show success feedback
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
        }
    }

    const handleCancelEdit = () => {
        setEditedUser({
            first_name: currentUser?.first_name || '',
            last_name: currentUser?.last_name || '',
            username: currentUser?.username || ''
        })
        setIsEditing(false)
    }

    const goBack = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        }
        setScreen('start')
    }

    const handleDebugUserChange = (field: string, value: string | number) => {
        const newDebugUser = { ...debugUser, [field]: value }
        setDebugUser(newDebugUser)
        updateCurrentUser(newDebugUser)
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date))
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500'
            case 'assigned': return 'bg-blue-500'
            case 'in_progress': return 'bg-orange-500'
            case 'completed': return 'bg-green-500'
            default: return 'bg-gray-500'
        }
    }

    return (
        <div className="min-h-screen bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={goBack}
                    className="text-[var(--tg-theme-link-color)]"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-xl font-bold">Profile</h1>
                <div className="w-16" /> {/* Spacer */}
            </div>

            {/* User Profile Card */}
            <Card className="mb-6 bg-[var(--tg-theme-secondary-bg-color)] border-[var(--tg-theme-section-separator-color)]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <CardTitle className="text-lg">Personal Information</CardTitle>
                    </div>
                    {!isEditing ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="text-[var(--tg-theme-link-color)]"
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                    ) : (
                        <div className="flex space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSaveProfile}
                                className="text-green-600"
                            >
                                <Save className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelEdit}
                                className="text-red-600"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            {isEditing ? (
                                <Input
                                    id="firstName"
                                    value={editedUser.first_name}
                                    onChange={(e) => setEditedUser(prev => ({ ...prev, first_name: e.target.value }))}
                                    className="mt-1"
                                />
                            ) : (
                                <p className="mt-1 text-sm text-[var(--tg-theme-hint-color)]">
                                    {currentUser?.first_name || 'Not set'}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            {isEditing ? (
                                <Input
                                    id="lastName"
                                    value={editedUser.last_name}
                                    onChange={(e) => setEditedUser(prev => ({ ...prev, last_name: e.target.value }))}
                                    className="mt-1"
                                />
                            ) : (
                                <p className="mt-1 text-sm text-[var(--tg-theme-hint-color)]">
                                    {currentUser?.last_name || 'Not set'}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="username">Username</Label>
                            {isEditing ? (
                                <Input
                                    id="username"
                                    value={editedUser.username}
                                    onChange={(e) => setEditedUser(prev => ({ ...prev, username: e.target.value }))}
                                    className="mt-1"
                                    placeholder="@username"
                                />
                            ) : (
                                <p className="mt-1 text-sm text-[var(--tg-theme-hint-color)]">
                                    {currentUser?.username ? `@${currentUser.username}` : 'Not set'}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>User ID</Label>
                            <p className="mt-1 text-sm text-[var(--tg-theme-hint-color)]">
                                {currentUser?.id || 'Anonymous'}
                            </p>
                        </div>
                        <div>
                            <Label>Account Type</Label>
                            <div className="mt-1">
                                <Badge variant="outline" className="text-xs">
                                    {isDriver ? 'Driver' : 'Customer'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Debug Controls (only in debug mode) */}
            {isClient && isDebugMode && (
                <Card className="mb-6 bg-orange-50 border-orange-200">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Bug className="w-5 h-5 text-orange-600" />
                            <CardTitle className="text-lg text-orange-800">Debug Mode</CardTitle>
                            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                                Testing Environment
                            </Badge>
                        </div>
                        <CardDescription className="text-orange-700">
                            You're running outside of Telegram. Use these controls to simulate user data.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Label htmlFor="debugUserId">User ID</Label>
                                <Input
                                    id="debugUserId"
                                    type="number"
                                    value={debugUser.id}
                                    onChange={(e) => handleDebugUserChange('id', parseInt(e.target.value) || 12345)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="debugFirstName">First Name</Label>
                                <Input
                                    id="debugFirstName"
                                    value={debugUser.first_name}
                                    onChange={(e) => handleDebugUserChange('first_name', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="debugLastName">Last Name</Label>
                                <Input
                                    id="debugLastName"
                                    value={debugUser.last_name}
                                    onChange={(e) => handleDebugUserChange('last_name', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="debugUsername">Username</Label>
                                <Input
                                    id="debugUsername"
                                    value={debugUser.username}
                                    onChange={(e) => handleDebugUserChange('username', e.target.value)}
                                    className="mt-1"
                                    placeholder="debug_user"
                                />
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-2 text-sm text-orange-700">
                            <Settings className="w-4 h-4" />
                            <span>Changes are applied automatically for testing</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Driver Profile Info (if driver) */}
            {isDriver && driverProfile && (
                <Card className="mb-6 bg-[var(--tg-theme-secondary-bg-color)] border-[var(--tg-theme-section-separator-color)]">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Truck className="w-5 h-5" />
                            <CardTitle className="text-lg">Driver Profile</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Priority Directions</Label>
                            <div className="mt-2 space-y-1">
                                {driverProfile.priorityDirections.length > 0 ? (
                                    driverProfile.priorityDirections.map((direction, index) => (
                                        <Badge key={index} variant="secondary" className="mr-2 mb-1">
                                            {direction.from} → {direction.to}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-[var(--tg-theme-hint-color)]">None set</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <Label>Cargo Volumes</Label>
                            <div className="mt-2 space-y-1">
                                {driverProfile.cargoVolumes.length > 0 ? (
                                    driverProfile.cargoVolumes.map((volume, index) => (
                                        <Badge key={index} variant="outline" className="mr-2 mb-1">
                                            {volume.length}×{volume.width}×{volume.height} cm
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-[var(--tg-theme-hint-color)]">None set</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Created Orders */}
            <Card className="mb-6 bg-[var(--tg-theme-secondary-bg-color)] border-[var(--tg-theme-section-separator-color)]">
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <Package className="w-5 h-5" />
                        <CardTitle className="text-lg">Created Orders</CardTitle>
                        <Badge variant="secondary">{userOrders.length}</Badge>
                    </div>
                    <CardDescription>Orders you have created</CardDescription>
                </CardHeader>
                <CardContent>
                    {userOrders.length > 0 ? (
                        <div className="space-y-4">
                            {userOrders.map((order) => (
                                <div key={order.id} className="border rounded-lg p-4 bg-[var(--tg-theme-bg-color)]">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm">
                                                {order.from} → {order.to}
                                            </h4>
                                            <p className="text-xs text-[var(--tg-theme-hint-color)] mt-1">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <span className="text-[var(--tg-theme-hint-color)]">Dimensions:</span>
                                            <p>{order.dimensions.length}×{order.dimensions.width}×{order.dimensions.height} cm</p>
                                        </div>
                                        <div>
                                            <span className="text-[var(--tg-theme-hint-color)]">Payment:</span>
                                            <p className="font-medium">${order.paymentAmount}</p>
                                        </div>
                                    </div>
                                    {order.assignedDriver && (
                                        <div className="mt-2 pt-2 border-t">
                                            <p className="text-xs text-[var(--tg-theme-hint-color)]">
                                                Assigned to driver: {order.assignedDriver}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[var(--tg-theme-hint-color)] text-center py-8">
                            You haven't created any orders yet
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Accepted Orders (for drivers) */}
            {isDriver && (
                <Card className="mb-6 bg-[var(--tg-theme-secondary-bg-color)] border-[var(--tg-theme-section-separator-color)]">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Truck className="w-5 h-5" />
                            <CardTitle className="text-lg">Accepted Orders</CardTitle>
                            <Badge variant="secondary">{acceptedOrders.length}</Badge>
                        </div>
                        <CardDescription>Orders you have accepted as a driver</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {acceptedOrders.length > 0 ? (
                            <div className="space-y-4">
                                {acceptedOrders.map((order) => (
                                    <div key={order.id} className="border rounded-lg p-4 bg-[var(--tg-theme-bg-color)]">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm">
                                                    {order.from} → {order.to}
                                                </h4>
                                                <p className="text-xs text-[var(--tg-theme-hint-color)] mt-1">
                                                    Created: {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                            <Badge className={`${getStatusColor(order.status)} text-white`}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                            <div>
                                                <span className="text-[var(--tg-theme-hint-color)]">Dimensions:</span>
                                                <p>{order.dimensions.length}×{order.dimensions.width}×{order.dimensions.height} cm</p>
                                            </div>
                                            <div>
                                                <span className="text-[var(--tg-theme-hint-color)]">Payment:</span>
                                                <p className="font-medium">${order.paymentAmount}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2 pt-2 border-t">
                                            <p className="text-xs text-[var(--tg-theme-hint-color)]">
                                                Created by: {order.createdBy}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[var(--tg-theme-hint-color)] text-center py-8">
                                You haven't accepted any orders yet
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
