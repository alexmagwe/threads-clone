import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, Button, View, Pressable, Image } from 'react-native'
import React from 'react'
import GoogleButton from '@/components/GoogleButton'
import Toast from 'react-native-toast-message'
import { Ionicons } from '@expo/vector-icons'

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()
    const [showPassword, setShowPassword] = React.useState(false)
    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')

    // Handle the submission of the sign-in form
    const onSignInPress = React.useCallback(async () => {
        if (!isLoaded) return
        if (!emailAddress || !password) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please fill in all fields'
            })
            return
        }

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/(home)')
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err: unknown) {
            Toast.show({
                type: 'error',
                text1: err instanceof Error ? err.message : 'An error occurred',
                text2: 'Please check your email and password'
            })
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }, [isLoaded, emailAddress, password])

    return (
        <View className='flex-1 py-6'>
            <Image source={require('@/assets/images/threads-logo-black.png')} className='w-40 h-40 object-contain mx-auto' />
            <View className='flex-1 items-center justify-center gap-6 p-6'>
                <Text className='text-2xl font-bold mt-4'>Sign in</Text>
                <View className=' w-full items-center justify-center gap-4'>
                    <TextInput
                        className='w-full border border-gray-300  rounded-md py-4 px-2'
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="Enter email"
                        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                    />
                    <View className='w-full relative'>
                        <TextInput
                            className='w-full border border-gray-300  rounded-md py-4 px-2'
                            value={password}
                            placeholder="Enter password"
                            secureTextEntry={!showPassword}
                            onChangeText={(password) => setPassword(password)}
                        />
                        <Ionicons className='absolute right-3 top-4 text-gray-400' color={'gray'} size={20} onPress={() => setShowPassword(!showPassword)} name={showPassword ? "eye-off" : "eye"} />
                    </View>
                </View>
                <View className='w-full items-center justify-center gap-2'>
                    <Pressable className='w-full bg-blue-500 rounded-md py-4 px-2' onPress={onSignInPress} >
                        <Text className='text-white text-center'>Sign in</Text>
                    </Pressable>
                    <GoogleButton />
                </View>
                <View className='flex-row items-center justify-center gap-2'>
                    <Text>Don't have an account?</Text>
                    <Link className='text-blue-500' href="/sign-up">
                        <Text>Sign up</Text>
                    </Link>
                </View>
            </View>
        </View>
    )
}