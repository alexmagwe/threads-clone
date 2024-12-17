import * as React from 'react'
import { Text, TextInput, Button, View, Pressable, Image } from 'react-native'
import { useOAuth, useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import GoogleButton from '@/components/GoogleButton'
import Toast from 'react-native-toast-message'
import { ClerkAPIError } from '@clerk/types'

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" })
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress,
                password,
            })

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true)
        } catch (err) {
            const clerkError = err as { errors: ClerkAPIError[] }
            Toast.show({
                type: "error",
                text1: clerkError.errors[0].message,
            })
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                Toast.show({
                    type: "error",
                    text1: "Verification failed",
                })
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    if (pendingVerification) {
        return (
            <View className='flex-1 items-center justify-center p-6'>
                <Text className='text-2xl font-bold mb-4'>Verify your email</Text>
                <TextInput
                    className='w-full border border-gray-300  rounded-md py-4 px-2'
                    value={code}
                    placeholder="Enter your verification code"
                    onChangeText={(code) => setCode(code)}
                />
                <Pressable className='w-full bg-blue-500 rounded-md py-4 mt-4 px-2' onPress={onVerifyPress} >
                    <Text className='text-white text-center'>Verify</Text>
                </Pressable>
            </View>
        )
    }

    return (
        <View className='flex-1 py-6'>
            <Image source={require('@/assets/images/threads-logo-black.png')} className='w-40 h-40 object-contain mx-auto' />
            <View className='flex-1 items-center justify-center  p-6'>
                <View className='flex-flex-col w-full gap-4 items-center'>
                    <Text className='text-2xl font-bold'>Sign up</Text>
                    <TextInput
                        className='w-full border border-gray-300  rounded-md py-4 px-2'
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="Enter email"
                        onChangeText={(email) => setEmailAddress(email)}
                    />
                    <TextInput
                        className='w-full border border-gray-300  rounded-md py-4 px-2'
                        value={password}
                        placeholder="Enter password"
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                    />
                    <Pressable className='w-full bg-blue-500 rounded-md py-4 px-2' onPress={onSignUpPress} >
                        <Text className='text-white text-center'>Continue</Text>
                    </Pressable>
                    <GoogleButton />
                </View>
            </View>
        </View>
    )
}