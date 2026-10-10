import { Route, Routes } from 'react-router-dom'
import './App.css'
import Register from './pages/auth/Register'
import NotFound from './pages/NotFound'
import BrowseTasks from './pages/public/BrowseTasks'
import Landing from './pages/public/Landing'
import TaskDetails from './pages/public/TaskDetails'
import ApplyTask from './pages/freelancer/ApplyTask'
import PostTask from './pages/client/PostTask'
import PublicLayout from './layouts/PublicLayout'
import ForgotPassword from './pages/auth/ForgotPassword'
import EmailVerification from './pages/auth/EmailVerification'
import DashboardLayout from './components/layout/DashboardLayout'
import ClientDashboard from './pages/client/ClientDashboard'
import FreelancerLayout from './components/layout/FreelancerLayout'
import FreelancerDashboard from './components/dashboard/FreelancerDashboard'
import MyApplications from './pages/freelancer/MyApplications'
import ActiveWork from './pages/freelancer/ActiveWork'
import SubmitWork from './pages/freelancer/SubmitWork'
import Earnings from './pages/freelancer/Earnings'
import FreelancerProfile from './pages/freelancer/FreelancerProfile'
import ClientApplications from './pages/client/ClientApplications'
import ClientActiveWork from './pages/client/ClientActiveWork'
import ClientReviews from './pages/client/ClientReviews'
import ClientPayments from './pages/client/ClientPayments'
import Notifications from './pages/shared/Notifications'
import Messages from './pages/shared/Messages'
import Settings from './pages/shared/Settings'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTasks from './pages/admin/AdminTasks'
import AdminDisputes from './pages/admin/AdminDisputes'
import AdminSettings from './pages/admin/AdminSettings'
import ClientWorkProgress from './pages/client/ClientWorkProgress'
import ClientSubmissionReview from './pages/client/ClientSubmissionReview'
import MySubmissions from './pages/freelancer/MySubmissions'
import Login from './pages/auth/ Login'
import ClientTasks from './pages/client/ClienTasks'
function App() {

  return (

    <Routes>
      <Route element={<PublicLayout />} >
        <Route path='/' element={<Landing />} />
        <Route path="/browse" element={<BrowseTasks />} />
        <Route path="/tasks/:taskId" element={<TaskDetails />} />
        <Route path="/tasks/:taskId/apply" element={<ApplyTask />} />
        <Route path="/post-task" element={<PostTask />} />
      </Route>

      <Route path='/client' element={<DashboardLayout />}>
        <Route path='dashboard' element={<ClientDashboard />} />
        <Route path='tasks' element={<ClientTasks />} />
        <Route path='applications' element={<ClientApplications />} />
        <Route path='active-work' element={<ClientActiveWork />} />
        <Route path='reviews' element={<ClientReviews />} />
        <Route path='payments' element={<ClientPayments />} />
        <Route path='notifications' element={<Notifications />} />
        <Route path='messages' element={<Messages />} />
        <Route path='settings' element={<Settings />} />
        <Route path='progress' element={<ClientWorkProgress />} />
        <Route path='submissions' element={<ClientSubmissionReview />} />

      </Route>

      <Route path='/freelancer' element={<FreelancerLayout />}>
        <Route path='dashboard' element={<FreelancerDashboard />} />
        <Route path='applications' element={<MyApplications />} />
        <Route path='active-work' element={<ActiveWork />} />
        <Route path='tasks/:taskId/submit' element={<SubmitWork />} />
        <Route path='earnings' element={<Earnings />} />
        <Route path='profile' element={<FreelancerProfile />} />
        <Route path='notifications' element={<Notifications />} />
        <Route path='messages' element={<Messages />} />
        <Route path='settings' element={<Settings />} />
        <Route path='submissions' element={<MySubmissions />} />

      </Route>

      <Route path='/admin' element={<AdminLayout />}>
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='users' element={<AdminUsers />} />
        <Route path='tasks' element={<AdminTasks />} />
        <Route path='disputes' element={<AdminDisputes />} />
        <Route path='settings' element={<AdminSettings />} />

      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route path="*" element={<NotFound />} />
    </Routes>

  )
}

export default App
