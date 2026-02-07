import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectEmployee } from '../redux/features/auth/authSelectors';


const AuthRedirect = () => {
  const employee = useSelector(selectEmployee);
  console.log(employee, 'employee');
  const navigate = useNavigate();

  useEffect(() => {
    if (employee) {
      if (employee.isRegistered) {
        navigate('/');
      } else {
        navigate('/sign-in');
      }
    } else {
      navigate('/sign-in');
    }
  }, [employee, navigate]);

  return null;
};

export default AuthRedirect;
