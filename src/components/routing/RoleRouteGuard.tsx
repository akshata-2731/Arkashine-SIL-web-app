import React, { useEffect } from 'react';
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
  const { currentRole, switchRole } = useAuth();

  useEffect(() => {
    if (currentRole !== allowedRole) {
      switchRole(allowedRole);
    }
  }, [allowedRole, currentRole, switchRole]);

  return <>{children}</>;
};
