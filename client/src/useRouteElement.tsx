/* eslint-disable react-refresh/only-export-components */
import { useContext } from 'react'
import { AppContext } from './Contexts/app.context'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from './constants/path'
import RegisterLayout from './layout/RegisterLayout'
import Login from './pages/User/Login'
import Register from './pages/User/Register'
import MainLayout from './layout/MainLayout'
import UserLayout from './layout/UserLayout'
import Profile from './pages/User/Profile'
import ChangePassword from './pages/User/ChangePassword'
import VerifyEmail from './pages/User/VerifyEmail'
import ForgotPassword from './pages/User/ForgotPassword'
import VerifyForgotToken from './pages/User/VerifyForgotToken'
import ResetPassword from './pages/User/ResetPassword'
import Chat from './pages/User/ChatUser'
import Home from './components/Home'
import OAuthCallback from './components/Customs/OAuthCallback'
import Story from './pages/User/Story'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />
}

export default function useRouteElement() {
  const routeElements = useRoutes([
    {
      path: path.asHome,
      element: <Navigate to={path.home} />
    },
    {
      path: path.home,
      element: <Home />
    },
    {
      path: path.auth,
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: path.user,
      element: <ProtectedRoute />,
      children: [
        {
          path: path.no,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: <Profile />
            },
            {
              path: path.changePassword,
              element: <ChangePassword />
            },

            {
              path: path.verifyEmail,
              element: <VerifyEmail />
            }
          ]
        },
        {
          path: path.chat,
          element: <Chat />
        },
        {
          path: path.story, 
          element: <Story />
        },
      ]
    },
    {
      path: path.forgotPassword,
      element: <ForgotPassword />
    },
    {
      path: path.verifyForgotPassword,
      element: <VerifyForgotToken />
    },
    {
      path: path.resetPassword,
      element: <ResetPassword />
    },
    {
      path: path.googleLogin,
      element: <OAuthCallback />
    },
    {
      path: path.any,
      element: <Navigate to={path.home} />
    }
  ])
  return routeElements
}
