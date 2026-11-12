/**
 * App Component
 * Main application component with routing and auth provider
 */

import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@routes';
import { AuthProvider } from '@hooks/useAuth';

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
