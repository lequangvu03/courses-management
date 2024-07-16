import { Navigate, Outlet, useLocation, useRoutes } from 'react-router-dom'

import { privateAdminRoutes, publicAdminRoutes } from './config/admin.routes'
import { publicUserRoutes } from './config/user.routes'
import useAuth from './hooks/useAuth'
import MainLayout from './layouts/AdminLayout/MainLayout'
import AuthLayout from './layouts/CommonLayout/AuthLayout'
import Course from './pages/Admin/Course'
import Home from './pages/Admin/Home'
import Payment from './pages/Admin/Payment'
import Report from './pages/Admin/Report'
import Settings from './pages/Admin/Settings'
import SignIn from './pages/Admin/SignIn'
import SignUp from './pages/SignUp'
import Student from './pages/Admin/Students'

function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to={publicAdminRoutes.signin}
      state={{
        from: location
      }}
      replace
    />
  )
}

function RejectedRoute() {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <Navigate to={privateAdminRoutes.home} /> : <Outlet />
}

function App() {
  const elements = useRoutes([
    {
      path: privateAdminRoutes.home,
      element: <ProtectedRoute />,
      children: [
        {
          path: privateAdminRoutes.home,
          element: (
            <MainLayout>
              <Home />
            </MainLayout>
          )
        },
        {
          path: privateAdminRoutes.course,
          element: (
            <MainLayout>
              <Course />
            </MainLayout>
          )
        },
        {
          path: privateAdminRoutes.students,
          element: (
            <MainLayout>
              <Student />
            </MainLayout>
          )
        },
        {
          path: privateAdminRoutes.payment,
          element: (
            <MainLayout>
              <Payment />
            </MainLayout>
          )
        },
        {
          path: privateAdminRoutes.settings,
          element: (
            <MainLayout>
              <Settings />
            </MainLayout>
          )
        },
        {
          path: privateAdminRoutes.report,
          element: (
            <MainLayout>
              <Report />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: privateAdminRoutes.home,
      element: <RejectedRoute />,
      children: [
        {
          path: publicAdminRoutes.signin,
          element: (
            <AuthLayout>
              <SignIn />
            </AuthLayout>
          )
        }
      ]
    },
    {
      path: publicUserRoutes.signin,
      element: (
        <AuthLayout>
          <SignIn />
        </AuthLayout>
      )
    },
    {
      path: publicUserRoutes.signup,
      element: (
        <AuthLayout>
          <SignUp />
        </AuthLayout>
      )
    }
  ])
  return <div>{elements}</div>
}

export default App
