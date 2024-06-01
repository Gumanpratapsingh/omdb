import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './index.css'
import {SignUp} from './pages/SignUp';
import {SignIn} from './pages/SignIn';
import {Home} from './pages/Home';
import { List } from './pages/List'; // Import the List component
import { PlaylistMovies } from './pages/PlaylistMovies'; // Import the PlaylistMovies component

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/list" element={<List />} /> {/* Added route for List component */}
        <Route path="/playlist/:name" element={<PlaylistMovies />} /> {/* Added route for PlaylistMovies component */}
      </Routes>
    </Router>
  )
}

export default App

