import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);

  // Assuming `role` is stored in currentUser and admin is the role
  return currentUser && currentUser.role === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to='/' />
  );
}
