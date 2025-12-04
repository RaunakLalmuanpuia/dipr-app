import { Routes, Route } from 'react-router-dom';

import AppLayout from "./layout/AppLayout.jsx"
import AuthLayout from "./layout/AuthLayout.jsx"
import MainLayout from "./layout/MainLayout/index"
import Register from '../src/pages/frontend/auth/Register'
import Login from '../src/pages/frontend/auth/Login'
import RequireAuth from "../src/components/RequireAuth"
import PersistLogin from "../src/components/PersistLogin"
import Admin from "../src/pages/backend/Admin"
import Editor from "../src/pages/backend/Editor"
import Dashboard from "../src/pages/backend/Dashboard"
import Home from "../src/components/Home"
import LinkPage from "../src/components/LinkPage"
import Lounge from "../src/pages/backend/Lounge"
import Missing from "../src/components/Missing"
import Unauthorized from "../src/components/Unauthorized"

import SamplePage from "../src/pages/backend/SamplePage"


const ROLES = {
    'User': 2001,
    'Editor': 1984,
    'Admin': 5150
}


function App() {


  return (
      <Routes>

          {/* ---------------- APP LAYOUT ---------------- */}
          <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

          </Route>

          {/* ---------------- AUTH LAYOUT (PROTECTED) ---------------- */}
          <Route element={<MainLayout />}>
              <Route path="unauthorized" element={<Unauthorized />} />

              <Route element={<PersistLogin />}>

                  <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]} />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                  </Route>


                  <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]} />}>
                      <Route path="/sample-page" element={<SamplePage />} />
                  </Route>

                  <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
                      <Route path="editor" element={<Editor />} />
                  </Route>

                  <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                      <Route path="admin" element={<Admin />} />
                  </Route>



                  <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
                      <Route path="lounge" element={<Lounge />} />
                  </Route>

              </Route>



          </Route>

          {/* catch all */}
          <Route path="*" element={<Missing />} />
      </Routes>
  )
}

export default App
