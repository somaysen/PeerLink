import ChatComponent from '../components/chatComponents'
import VideoCall from '../components/videoCall/videoCall'
import { Routes, Route } from 'react-router'

function AppRouter() {
  return (
    <div>
          <Routes>
            <Route path="/" element={<ChatComponent />} />
            <Route path="/video-call" element={<VideoCall />} />
          </Routes>
    </div>
  )
}

export default AppRouter