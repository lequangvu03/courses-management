import { Navigate, Outlet, useLocation, useRoutes } from 'react-router-dom'

import { privateAdminRoutes, publicAdminRoutes } from './config/admin.routes'
import { privateUserRoutes, publicUserRoutes } from './config/user.routes'
import useAuth from './hooks/useAuth'
import MainLayout from './layouts/AdminLayout/MainLayout'
import AuthLayout from './layouts/CommonLayout/AuthLayout'
import { isAdminRoute } from './lib/utils'
import Course from './pages/Admin/course'
import Dashboard from './pages/Admin/dashboard'
import Payment from './pages/Admin/payment'
import Report from './pages/Admin/report'
import Settings from './pages/Admin/settings'
import SignIn from './pages/Admin/signIn'
import Student from './pages/Admin/students'
import Home from './pages/home'
import MyCourses from './pages/myCourses'
import SignUp from './pages/signup'
import ResetPassword from './pages/Admin/resetPassword'
import StudentUpsert from './pages/Admin/studentUpsert'

function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const isAdmin = isAdminRoute(location.pathname)

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to={isAdmin ? publicAdminRoutes.signin : publicUserRoutes.signin}
      state={{
        from: location
      }}
      replace
    />
  )
}

function RejectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const isAdmin = isAdminRoute(location.pathname)

  return isAuthenticated ? (
    <Navigate to={isAdmin ? privateAdminRoutes.dashboard : privateUserRoutes.home} />
  ) : (
    <Outlet />
  )
}

function App() {
  const elements = useRoutes([
    //* Admin routes
    {
      path: privateAdminRoutes.dashboard,
      element: <ProtectedRoute />,
      children: [
        {
          path: privateAdminRoutes.dashboard,
          element: (
            <MainLayout>
              <Dashboard />
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
          path: privateAdminRoutes.addStudent,
          element: (
            <MainLayout>
              <StudentUpsert />
            </MainLayout>
          )
        },
        {
          path: privateAdminRoutes.editStudent,
          element: (
            <MainLayout>
              <StudentUpsert />
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
      path: privateAdminRoutes.dashboard,
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
    //* User routes
    {
      path: privateUserRoutes.home,
      element: <ProtectedRoute />,
      children: [
        {
          path: privateUserRoutes.courses,
          element: (
            <AuthLayout>
              <MyCourses />
            </AuthLayout>
          )
        },
        {
          path: privateUserRoutes.home,
          element: (
            <AuthLayout>
              <Home />
            </AuthLayout>
          )
        }
      ]
    },
    {
      path: privateUserRoutes.home,
      element: <RejectedRoute />,
      children: [
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
      ]
    },
    // Reset password
    {
      path: publicUserRoutes.resetPassword,
      element: (
        <AuthLayout>
          <ResetPassword />
        </AuthLayout>
      )
    },
    {
      path: publicAdminRoutes.resetPassword,
      element: (
        <AuthLayout>
          <ResetPassword />
        </AuthLayout>
      )
    }
  ])
  return <div>{elements}</div>
}

export default App
