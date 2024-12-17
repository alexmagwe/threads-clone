import React, { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { Stack, useRouter } from 'expo-router'

type Props = {}

const AuthLayout = (props: Props) => {
    const router = useRouter()
    const { isLoaded, isSignedIn } = useAuth()
    useEffect(() => {
        if (!isLoaded) return
        if (isSignedIn) {
            router.replace('/(home)')
        }
    }, [isSignedIn])
    return (
        <Stack >
            <Stack.Screen options={{ headerTitle: "Sign In" }} name="sign-in" />
            <Stack.Screen options={{ headerTitle: "Sign Up" }} name="sign-up" />
        </Stack>
    )
}

export default AuthLayout