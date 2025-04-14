// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import Unauthorized from './pages/Unauthorized';

const App = () => {
  const role = 'ADMIN'; // TypeScript에서도 이런 문자열은 그냥 사용 가능

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role={role} allowedRoles={['ADMIN']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
};

export default App;
