import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NotFoundPage from './pages/NotFoundPage';
import ShipperList from './components/ShipperList';
import ShipperDetails from './pages/ShipperDetails';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/shippers" element={<ShipperList />} />
      <Route path="/shippers/details/:id" element={<ShipperDetails />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;