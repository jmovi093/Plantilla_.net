import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import MainLayout from './layouts/MainLayout';
import './App.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </Router>
  );
}

export default App;