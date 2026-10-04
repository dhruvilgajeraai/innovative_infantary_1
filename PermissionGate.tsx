import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AccessDenied } from './AccessDenied';

interface PermissionGateProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  children,
  fallback
}) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return fallback ? <>{fallback}</> : <AccessDenied requiredPermission={permission} />;
  }

  return <>{children}</>;
};
