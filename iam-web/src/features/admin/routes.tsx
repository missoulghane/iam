import { lazy } from 'react'
import { Route } from 'react-router'

const UsersListPage = lazy(() => import('./pages/UsersListPage'))
const CreateUserPage = lazy(() => import('./pages/CreateUserPage'))
const UserDetailPage = lazy(() => import('./pages/UserDetailPage'))
const EditUserPage = lazy(() => import('./pages/EditUserPage'))

export const adminProtectedRoutes = (
  <>
    <Route path="/admin/users" element={<UsersListPage />} />
    <Route path="/admin/users/new" element={<CreateUserPage />} />
    <Route path="/admin/users/:id" element={<UserDetailPage />} />
    <Route path="/admin/users/:id/edit" element={<EditUserPage />} />
  </>
)
