import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') {
      navigate('/admin/dashboard');
    } else if (userRole === 'user') {
      navigate('/user/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return null;
}
