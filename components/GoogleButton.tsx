import { Text, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useOAuth } from '@clerk/clerk-expo'
import Toast from 'react-native-toast-message'
import { useRouter } from 'expo-router'

type Props = {
}

const GoogleButton = (props: Props) => {
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" })
    const router = useRouter()
    const handleGoogleLogin = async () => {
        try {

            const { createdSessionId, setActive } = await startOAuthFlow()
            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId })
                router.replace('/(home)')
            }
        }
        catch (error) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Something went wrong"
            })
            console.log(error)
        }
    }
    return (
        <Pressable className='w-full border border-gray-300 rounded-md py-4 flex flex-row items-center justify-center gap-2 mt-2' onPress={() => handleGoogleLogin()} >
            <Ionicons name='logo-google' size={15} />
            <Text className=' text-center'>Sign in with Google</Text>
        </Pressable>
    )
}

export default GoogleButton