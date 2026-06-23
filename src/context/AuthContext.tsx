// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config

// ** Types
import { AuthValuesType, UserDataType, LoginParams } from './types'
//import { CognitoIdentityServiceProvider } from 'aws-sdk'
import crypto from 'crypto'
import { toast } from 'react-toastify'
import auth from '@/configs/auth'

//import crypto from 'crypto';

// Replace these values with your Cognito User Pool details
const CLIENT_ID = '2if2nj26og5j95248oj8h2oj2u' // Replace with your Cognito App Client ID
const CLIENT_SECRET = 'ko78b7een9nc9smr7prqplqr0s77s4tbvodk2b4qh4rdlt3vkt6' // Replace with your Cognito App Client Secret
//const AWS_REGION = 'ap-south-1'; // Replace with your AWS region

//const cognito = new CognitoIdentityServiceProvider({ region: 'ap-south-1' })

// AWS.config.update({
//   region: AWS_REGION,
// });

const generateSecretHash = (username: string, clientId: string, clientSecret: string): string => {
  return crypto
    .createHmac('SHA256', clientSecret)
    .update(username + clientId)
    .digest('base64')
}

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

 // const [groupData, setGroupData] = useState<any>([])

  // ** Hooks
  const router = useRouter()

   const fetchDataFromApi = async () => {
    try {
      const fetchedData = await fetchDataFromApi();

      // setGroupData(fetchedData);

      // setUsergroupName(fetchedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(auth.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        try {
          const response = await axios.get(auth.meEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          setLoading(false)
          setUser({ ...response.data.userData })
        } catch (error) {
          console.error('Error fetching user data:', error)
          localStorage.removeItem(auth.storageTokenKeyName)
          localStorage.removeItem('userData')
          setUser(null)
          setLoading(false)
          if (auth.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
            router.replace('/login')
          }
        }
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (params: LoginParams) => {

    const secretHash = generateSecretHash(params.email, CLIENT_ID, CLIENT_SECRET)

    try {
      // const response = await cognito
      //   .initiateAuth({
      //     AuthFlow: 'USER_PASSWORD_AUTH',
      //     AuthParameters: {
      //       USERNAME: params.email,
      //       PASSWORD: params.password,
      //       SECRET_HASH: secretHash
      //     },
      //     ClientId: '2if2nj26og5j95248oj8h2oj2u' // Replace with your actual Cognito User Pool Client ID
      //   })
      //   .promise()


      // if (params.email === groupData.email) {
      //   window.localStorage.setItem('userData', JSON.stringify(groupData));
      // }

      const userResponseData = {
        email: params.email,
        password: params.password
      }

      params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(userResponseData)) : null
      setUser(userResponseData)
      toast.success('Login successful')
      router.replace('/dashboards/analytics')
      const returnUrl = router.query.returnUrl || '/'
      const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
      setLoading(false)
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(auth.storageTokenKeyName)
    router.push('/login')
  }

  const values: AuthValuesType = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
