import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectEmployee } from '../redux/features/auth/authSelectors';
import AppShell from '@/components/appShell'; // Ensure AppShell is imported here

const ProtectedRoute = ({ children }) => {
  const employee = useSelector(selectEmployee);

  if (!employee || !employee.isRegistered) {
    return <Navigate to="/sign-in" replace />;
  }

  return <AppShell>{children}</AppShell>;
};

export default ProtectedRoute;
