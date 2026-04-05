import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import AuthGuard from './AuthGuard';

export default function AppLayout() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <Outlet />
        </main>
      </div>
    </AuthGuard>
  );
}
