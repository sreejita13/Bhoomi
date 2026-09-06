import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { VerifyPage } from './pages/VerifyPage';
import { CentralDashboard } from './pages/CentralDashboard';
import { StateDashboard } from './pages/StateDashboard';
import { StateApprovals } from './pages/StateApprovals';
import { SellerDashboard } from './pages/SellerDashboard';
import { SellerListProperty } from './pages/SellerListProperty';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { PropertyDetail } from './pages/PropertyDetail';
import { UserRole } from './types';

const MainContent: React.FC = () => {
  const { session } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('BH-MH-10245');

  // Handle URL change
  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.history.pushState({}, '', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Parse Role query parameter if on login page
  const queryParams = new URLSearchParams(window.location.search);
  const roleParam = queryParams.get('role') as UserRole | null;
  const propertyParam = queryParams.get('property');

  useEffect(() => {
    if (propertyParam) {
      setSelectedPropertyId(propertyParam);
    }
  }, [propertyParam]);

  // Render current view
  const renderView = () => {
    // 1. Verification Page
    if (currentPage.startsWith('/verify')) {
      return <VerifyPage propertyId={selectedPropertyId} onNavigate={navigateTo} />;
    }

    // 2. Login Page
    if (currentPage.startsWith('/login')) {
      return <LoginPage onNavigate={navigateTo} initialRole={roleParam || undefined} />;
    }

    // 3. Central Govt Portal
    if (currentPage.startsWith('/central')) {
      if (!session || session.role !== 'central') {
        return <LoginPage onNavigate={navigateTo} initialRole="central" />;
      }
      return <CentralDashboard onNavigate={navigateTo} />;
    }

    // 4. State Govt Portal
    if (currentPage === '/state/approvals') {
      if (!session || session.role !== 'state') {
        return <LoginPage onNavigate={navigateTo} initialRole="state" />;
      }
      return <StateApprovals onNavigate={navigateTo} />;
    }

    if (currentPage.startsWith('/state')) {
      if (!session || session.role !== 'state') {
        return <LoginPage onNavigate={navigateTo} initialRole="state" />;
      }
      return <StateDashboard onNavigate={navigateTo} />;
    }

    // 5. Seller / Owner Portal
    if (currentPage === '/seller/properties/new') {
      if (!session || session.role !== 'seller') {
        return <LoginPage onNavigate={navigateTo} initialRole="seller" />;
      }
      return <SellerListProperty onNavigate={navigateTo} />;
    }

    if (currentPage.startsWith('/seller')) {
      if (!session || session.role !== 'seller') {
        return <LoginPage onNavigate={navigateTo} initialRole="seller" />;
      }
      return <SellerDashboard onNavigate={navigateTo} />;
    }

    // 6. Buyer Portal & Property Detail View
    if (currentPage.startsWith('/property/')) {
      const propId = currentPage.replace('/property/', '');
      return <PropertyDetail propertyId={propId || selectedPropertyId} onNavigate={navigateTo} />;
    }

    if (currentPage.startsWith('/buyer')) {
      if (!session || session.role !== 'buyer') {
        return <LoginPage onNavigate={navigateTo} initialRole="buyer" />;
      }
      return (
        <BuyerDashboard
          onNavigate={navigateTo}
          onSelectProperty={(id) => {
            setSelectedPropertyId(id);
            navigateTo(`/property/${id}`);
          }}
        />
      );
    }

    // Default: Landing Page
    return (
      <LandingPage
        onNavigate={navigateTo}
        onSelectProperty={(id) => {
          setSelectedPropertyId(id);
        }}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar onNavigate={navigateTo} currentPage={currentPage} />
      <main className="flex-1">{renderView()}</main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
};

export default App;
