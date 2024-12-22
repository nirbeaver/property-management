import React, { Suspense } from 'react';
import { ChakraProvider, Spinner, Center } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import PrivateRoute from './components/Auth/PrivateRoute';
import theme from './theme';

// Lazy load components
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Properties = React.lazy(() => import('./pages/Properties'));
const PropertyDetails = React.lazy(() => import('./pages/PropertyDetails'));
const Tenants = React.lazy(() => import('./pages/Tenants'));
const TransactionsPage = React.lazy(() => import('./pages/TransactionsPage'));
const ReportsPage = React.lazy(() => import('./pages/ReportsPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const Profile = React.lazy(() => import('./pages/Profile'));

// Loading fallback component
const LoadingFallback = () => (
  <Center h="100vh">
    <Spinner size="xl" color="blue.500" />
  </Center>
);

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Layout />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="properties" element={<Properties />} />
                  <Route path="properties/:id" element={<PropertyDetails />} />
                  <Route path="tenants" element={<Tenants />} />
                  <Route path="transactions" element={<TransactionsPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="profile" element={<Profile />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
