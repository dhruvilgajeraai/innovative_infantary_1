import React, { useState, useEffect } from 'react';
import { ClubProvider, useClub } from './context/ClubContext';
import { LeftNavbar } from './components/common/LeftNavbar';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { DigitalPassModal } from './components/pass/DigitalPassModal';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { OwnerDashboard } from './components/dashboard/OwnerDashboard';
import { MemberDashboard } from './components/dashboard/MemberDashboard';
import { StaffDashboard } from './components/dashboard/StaffDashboard';
import { CourtScheduler } from './components/courts/CourtScheduler';
import { ShopInventory } from './components/shop/ShopInventory';
import { PointOfSale } from './components/pos/PointOfSale';
import { CRMManagement } from './components/crm/CRMManagement';
import { StaffManagement } from './components/staff/StaffManagement';
import { MaintenanceView } from './components/maintenance/MaintenanceView';
import { PaymentsLedger } from './components/payments/PaymentsLedger';
import { ActivitiesWorksLedger } from './components/activities/ActivitiesWorksLedger';
import { MembershipPlansView } from './components/members/MembershipPlansView';

const MainAppContent: React.FC = () => {
  const { members, activeMemberId, currentUser } = useClub();

  // Start on 'login' page by default when opening website
  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedUser = localStorage.getItem('cc_auth_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        return u.type === 'staff' ? 'staff_dashboard' : 'member_dashboard';
      } catch (_) {}
    }
    return 'login';
  });

  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [digitalPassOpen, setDigitalPassOpen] = useState(false);
  const [passMemberId, setPassMemberId] = useState<string>(activeMemberId || 'm1');

  const selectedMemberForPass = members.find(m => m.id === passMemberId) || members[0];

  const handleOpenDigitalPass = (memberId?: string) => {
    if (memberId) setPassMemberId(memberId);
    setDigitalPassOpen(true);
  };

  // If user logs out, ensure view resets to login
  useEffect(() => {
    if (!currentUser && activeTab !== 'landing' && activeTab !== 'login') {
      setActiveTab('login');
    }
  }, [currentUser, activeTab]);

  // 1. PUBLIC MARKETING WEBSITE VIEW
  if (activeTab === 'landing') {
    return (
      <div className="relative min-h-screen bg-[#f8fafc] text-slate-900">
        <LandingPage
          onEnterDashboard={() => {
            if (currentUser) {
              setActiveTab(currentUser.type === 'staff' ? 'staff_dashboard' : 'member_dashboard');
            } else {
              setActiveTab('login');
            }
          }}
          onOpenLogin={() => setActiveTab('login')}
          onOpenBooking={() => {
            if (currentUser) setActiveTab('courts');
            else setActiveTab('login');
          }}
          onOpenShop={() => {
            if (currentUser) setActiveTab('shop');
            else setActiveTab('login');
          }}
          onOpenMemberships={() => {
            setActiveTab('login');
          }}
        />
        <NotificationDrawer
          isOpen={notificationDrawerOpen}
          onClose={() => setNotificationDrawerOpen(false)}
          onNavigate={(route) => setActiveTab(route)}
        />
        <DigitalPassModal
          isOpen={digitalPassOpen}
          onClose={() => setDigitalPassOpen(false)}
          member={selectedMemberForPass}
        />
      </div>
    );
  }

  // 2. GATEWAY AUTHENTICATION VIEW: 2 Separate Cards for Staff and Member (Log In + Create Account)
  if (!currentUser || activeTab === 'login') {
    return (
      <div className="relative min-h-screen bg-[#f8fafc] text-slate-900">
        <LoginPage
          onLoginSuccess={(targetTab) => setActiveTab(targetTab)}
          onBackToWebsite={() => setActiveTab('landing')}
          onOpenTrialModal={() => setActiveTab('landing')}
        />
        <DigitalPassModal
          isOpen={digitalPassOpen}
          onClose={() => setDigitalPassOpen(false)}
          member={selectedMemberForPass}
        />
      </div>
    );
  }

  // 3. MAIN DASHBOARD: Operated 100% from the SINGLE Left Navigation Bar
  const isMember = currentUser?.type === 'member';
  const isStaff = currentUser?.type === 'staff';

  return (
    <div
      className={`min-h-screen text-slate-950 flex selection:bg-emerald-500 selection:text-white relative ${
        isMember
          ? "bg-gradient-to-br from-sky-50 via-blue-50/90 to-indigo-100/80"
          : "bg-gradient-to-br from-emerald-50 via-green-50/90 to-teal-100/80"
      }`}
    >
      {/* Dynamic ambient glowing mesh based on role */}
      {isMember ? (
        /* Blue Theme Ambient Mesh for User Dashboard */
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-sky-200/50 rounded-full blur-3xl" />
          <div className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] bg-blue-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[15%] w-[700px] h-[500px] bg-indigo-200/45 rounded-full blur-3xl" />
        </div>
      ) : (
        /* Green Theme Ambient Mesh for Staff Dashboard */
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-200/50 rounded-full blur-3xl" />
          <div className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] bg-teal-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[15%] w-[700px] h-[500px] bg-green-200/50 rounded-full blur-3xl" />
        </div>
      )}

      {/* SINGLE UNIFIED LEFT NAVIGATION BAR (FLOATING ROUNDED CARD) */}
      <LeftNavbar
        onOpenNotifications={() => setNotificationDrawerOpen(true)}
        onOpenDigitalCard={() => handleOpenDigitalPass()}
        currentTab={activeTab}
        setCurrentTab={(tab: string) => setActiveTab(tab)}
      />

      {/* Main Workspace (Offset by Floating Rounded Left Navigation Bar on large screens) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen overflow-x-hidden relative z-10">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* SEPARATE ROLE-SPECIFIC DASHBOARDS */}
          {activeTab === 'staff_dashboard' && (
            <StaffDashboard
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenDigitalPass={(id) => handleOpenDigitalPass(id)}
            />
          )}

          {activeTab === 'member_dashboard' && (
            <MemberDashboard
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenDigitalPass={(id) => handleOpenDigitalPass(id)}
            />
          )}

          {activeTab === 'dashboard' && (
            <OwnerDashboard
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {/* INTEGRATED BUSINESS MODULES */}
          {activeTab === 'courts' && <CourtScheduler />}
          {activeTab === 'membership_plans' && (
            <MembershipPlansView
              onOpenDigitalPass={(id) => handleOpenDigitalPass(id)}
            />
          )}
          {activeTab === 'shop' && <ShopInventory />}
          {activeTab === 'pos' && <PointOfSale />}
          {activeTab === 'activities' && <ActivitiesWorksLedger />}
          {activeTab === 'crm' && <CRMManagement />}
          {activeTab === 'payments' && <PaymentsLedger />}
          {activeTab === 'staff' && <StaffManagement />}
          {activeTab === 'maintenance' && <MaintenanceView />}
        </main>
      </div>

      {/* Slide-out Activity Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        onNavigate={(route) => setActiveTab(route)}
      />

      {/* 3D Holographic Member Pass Modal */}
      <DigitalPassModal
        isOpen={digitalPassOpen}
        onClose={() => setDigitalPassOpen(false)}
        member={selectedMemberForPass}
      />
    </div>
  );
};

export function App() {
  return (
    <ClubProvider>
      <MainAppContent />
    </ClubProvider>
  );
}

export default App;
