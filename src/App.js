import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import TaskList from './components/views/TaskList';
import Login from './components/views/Login';
import Logout from './components/views/Logout';
import 'antd/dist/antd.css';
import './App.css';
import Register from './components/views/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<TaskList />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
