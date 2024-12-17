import { Slot, Stack, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { tokenCache } from '@/cache'
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'
import "../global.css"
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import Toast from 'react-native-toast-message'
import 'expo-dev-client'
type Props = {}
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

const InitialLayout = (props: Props) => {
    const { isLoaded, isSignedIn } = useAuth()
    const router = useRouter()
    useEffect(() => {
        if (!isLoaded) return
        if (isSignedIn) {
            router.replace('/(home)')
        }
    }, [isSignedIn])
    return <Slot />
}
const _layout = (props: Props) => {
    const theme = useColorScheme()
    return (
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
            <ThemeProvider value={theme == 'dark' ? DarkTheme : DefaultTheme}>
                <SafeAreaProvider>
                    <ClerkLoaded>
                        <InitialLayout />
                        <Toast />
                    </ClerkLoaded>
                </SafeAreaProvider>
            </ThemeProvider>
        </ClerkProvider>
    )
}

export default _layout