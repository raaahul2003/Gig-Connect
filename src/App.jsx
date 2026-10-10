import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/auth/ Login'
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
import ClientTasks from './pages/freelancer/ClientTasks'







function App() {

  return (

    <Routes>
      <Route element={<PublicLayout />} >
        <Route path='/' element={<Landing />} />
        <Route path="/browse" element={<BrowseTasks />} />
        <Route path="/tasks/:tasksId" element={<TaskDetails />} />
        <Route path="/tasks/:tasksId/apply" element={<ApplyTask />} />
        <Route path="/post-task" element={<PostTask />} />
      </Route>

      <Route path='/client' element={<DashboardLayout />}>
        <Route path='dashboard' element={<ClientDashboard />} />
        <Route path='tasks' element={<ClientTasks />} />
      </Route>

      <Route path='/freelancer' element={<FreelancerLayout />}>
        <Route path='dashboard' element={<FreelancerDashboard />} />
        <Route path='applications' element={<MyApplications />} />
        <Route path='active-work' element={<ActiveWork />} />
        <Route path='tasks/:taskId/submit' element={<SubmitWork />} />
        <Route path='earnings' element={<Earnings />} />
        <Route path='profile' element={<FreelancerProfile />} />

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
