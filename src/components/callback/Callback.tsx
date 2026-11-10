/**
 * Callback Component (DEPRECATED)
 * 
 * This component is no longer used with direct Amplify SDK authentication.
 * It was previously needed to handle OAuth2 authorization code exchanges.
 * 
 * With USER_SRP_AUTH flow, authentication happens directly in the React app
 * without any Cognito Hosted UI redirects, so this component is not needed.
 * 
 * This file is kept as a reference but is not imported in AppRoutes.tsx
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Callback component - DEPRECATED
 * If accessed for any reason, redirects to signin
 */
export function Callback(): React.JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    console.warn('Callback: This route should not be accessed with direct SDK auth');
    console.log('Callback: Redirecting to signin...');
    navigate('/signin', { replace: true });
  }, [navigate]);

  return <div />;
}

export default Callback;
