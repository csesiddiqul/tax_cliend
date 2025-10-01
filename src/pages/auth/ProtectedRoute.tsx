import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState, ReactNode } from 'react';

// Define prop types for the ProtectedRoute component
interface ProtectedRouteProps {
  element: ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredRoles = [],
  requiredPermissions = [],
  // redirectTo = '/',
}) => {
  const { token, roles, permissions } = useSelector((state: any) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // null: loading, true: authorized, false: unauthorized

  useEffect(() => {
    const validateUserRolesAndPermissions = async () => {
      try {
        if (!token) {
          setIsAuthorized(false);
          return;
        }
        // Optionally verify token validity or user roles from server
        // const response = await API.get('/user/validate', {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // const { valid } = response.data;

        const valid = true; // Mock response for demonstration purposes
        if (valid) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error: any) {
        console.log(error);
        setIsAuthorized(false);
      }
    };

    validateUserRolesAndPermissions();
  }, [token]);

  // If still loading authorization status
  if (isAuthorized === null) return null;

  // If no token, redirect to login
  if (!token) return <Navigate to="/auth/sign-in" />;


  // Check if the user has required roles and permissions
  const hasRequiredRole = requiredRoles.length ? requiredRoles.some(role => roles.includes(role)) : true;
  const hasRequiredPermission = requiredPermissions.length ? requiredPermissions.some(perm => permissions.includes(perm)) : true;


  console.log(requiredRoles);

  // If the user lacks required roles or permissions, redirect to unauthorized
  if (!hasRequiredRole || !hasRequiredPermission) {
    return <Navigate to="/unauthorized" />;
  }

  // Return the protected element if authorized
  return <>{element}</>;
};

export default ProtectedRoute;
