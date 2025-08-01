// src/App.jsx
import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Home          = lazy(() => import('./pages/Home'))
const SubmitIssue   = lazy(() => import('./pages/SubmitIssue'))
const BloodRequest  = lazy(() => import('./pages/BloodRequest'))   //  ←  EXACT case
const Fundraiser    = lazy(() => import('./pages/Fundraiser'))
const SOS           = lazy(() => import('./pages/SOS'))
const AdminDashboard= lazy(() => import('./pages/admin/AdminDashboard'))

function App() {
  return (
    <Layout>
      <Suspense fallback={<div className="p-8">Loading…</div>}>
        <Routes>
          <Route path="/"               element={<Home />}          />
          <Route path="/submit-issue"   element={<SubmitIssue />}   />
          <Route path="/blood-request"  element={<BloodRequest />}  /> {/* <- this */}
          <Route path="/fundraiser"     element={<Fundraiser />}    />
          <Route path="/sos"            element={<SOS />}           />
          <Route path="/admin"          element={<AdminDashboard/>} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
export default App
