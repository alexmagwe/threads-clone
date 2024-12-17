import { Link } from 'expo-router'
import React from 'react'
import { Image, Text, View } from 'react-native'
type Props = {}

export default function WelcomePage({ }: Props) {
    return (
        <View className='flex-1 items-center justify-center '>
            <Image source={require('@/assets/images/login.png')} className='w-full h-96 object-cover' />
            <View className='flex-1 w-full items-center mt-6 justify-center p-6 gap-4'>
                <Text className='text-2xl font-bold'>
                    Threads
                </Text>
                <Text className='text-center text-gray-500'>
                    Connect with your friends and family
                </Text>
                <View className='flex-1 w-full flex-col items-center justify-center gap-4'>
                    <Link className='w-full p-6 rounded-md border border-gray-300' href="/(auth)/sign-in">
                        <Text className=' text-center'>
                            Sign in
                        </Text>
                    </Link>
                    <Link className='w-full p-6 rounded-md bg-blue-500 text-white' href="/(auth)/sign-up">
                        <Text className=' text-center'>
                            Sign up
                        </Text>
                    </Link>
                </View>
            </View>
        </View>
    )
}