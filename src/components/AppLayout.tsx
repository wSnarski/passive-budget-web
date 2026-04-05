import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import AuthGuard from './AuthGuard';

export default function AppLayout() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </AuthGuard>
  );
}
