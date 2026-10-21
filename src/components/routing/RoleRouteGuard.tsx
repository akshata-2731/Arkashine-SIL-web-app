import React from 'react';
import { Navigate } from 'react-router-dom';
import { Role } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const ROLE_DEFAULT_ROUTES: Record<Role, string> = {
  arkashine: '/arkashine/overview',
  partner: '/partner/overview',
  principal: '/principal/overview',
  faculty: '/faculty/today',
  student: '/student/journey'
};

interface RoleRouteGuardProps {
  allowedRole: Role;
  children: React.ReactNode;
}

export const RoleRouteGuard: React.FC<RoleRouteGuardProps> = ({ allowedRole, children }) => {
  const { currentRole } = useAuth();

  if (currentRole !== allowedRole) {
    const defaultRoute = ROLE_DEFAULT_ROUTES[currentRole] || '/arkashine/overview';
    return <Navigate to={defaultRoute} replace />;
  }

  return <>{children}</>;
};
