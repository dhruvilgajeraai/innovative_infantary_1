import React, { useState } from 'react';
import { 
  Globe, 
  Image, 
  Bell, 
  FileText, 
  CheckCircle2, 
  Plus, 
  Settings, 
  Sparkles,
  Palette,
  Eye,
  Sliders,
  ShieldAlert,
  Search,
  Check,
  ExternalLink,
  HelpCircle,
  TrendingUp,
  FolderOpen
} from 'lucide-react';

interface ManagedPage {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  lastEdited: string;
  views: number;
  seoScore: number;
}

interface Announcement {
  id: string;
  title: string;
  category: 'Tournament Notice' | 'Facility Maintenance' | 'Special Event';
  date: string;
  published: boolean;
  priority: 'normal' | 'urgent';
}

interface MediaAsset {
  id: string;
  name: string;
  tag: string;
  dimensions: string;
  size: string;
  url: string;
}

const SEED_PAGES: ManagedPage[] = [
  { id: 'page-1', title: 'ArenaFlow Global Landing (Slide 01)', slug: '/', status: 'published', lastEdited: '2026-10-02 18:30', views: 24100, seoScore: 98 },
  { id: 'page-2', title: 'Football Stadium Arena (Slide 02)', slug: '/sports/football', status: 'published', lastEdited: '2026-10-01 14:15', views: 6420, seoScore: 96 },
  { id: 'page-3', title: 'Tennis Center & Clay Courts (Slide 03)', slug: '/sports/tennis', status: 'published', lastEdited: '2026-10-01 15:40', views: 5890, seoScore: 97 },
  { id: 'page-4', title: 'Cricket Oval & Indoor Nets (Slide 04)', slug: '/sports/cricket', status: 'published', lastEdited: '2026-09-29 11:20', views: 4210, seoScore: 95 },
  { id: 'page-5', title: 'Badminton Hall 12-Court (Slide 05)', slug: '/sports/badminton', status: 'published', lastEdited: '2026-09-30 09:10', views: 3670, seoScore: 94 },
  { id: 'page-6', title: 'Padel Glass Courts (Slide 06)', slug: '/sports/padel', status: 'published', lastEdited: '2026-10-02 16:50', views: 7850, seoScore: 99 },
  { id: 'page-7', title: 'Athletics & Running Track (Slide 07)', slug: '/sports/running', status: 'published', lastEdited: '2026-09-28 17:05', views: 2150, seoScore: 93 },
  { id: 'page-8', title: 'The Champions Club Member Portal', slug: '/portal', status: 'published', lastEdited: '2026-10-03 08:00', views: 18450, seoScore: 100 },
  { id: 'page-9', title: 'Spring Padel Masters Tournament Bracket', slug: '/events/spring-padel-2027', status: 'draft', lastEdited: '2026-10-03 10:20', views: 0, seoScore: 88 },
  { id: 'page-10', title: 'Junior Summer Sports Academy 2027', slug: '/programs/junior-academy', status: 'draft', lastEdited: '2026-10-02 12:00', views: 0, seoScore: 82 }
];

const SEED_ANNOUNCEMENTS: Announcement[] = [
  { id: 'ann-1', title: 'Centre Clay Court Laser-Leveling Completed for Weekend Matchplay', category: 'Facility Maintenance', date: '2026-10-02', published: true, priority: 'urgent' },
  { id: 'ann-2', title: 'Friday Night Social Play doubles registration is now live on Portal', category: 'Special Event', date: '2026-10-01', published: true, priority: 'normal' },
  { id: 'ann-3', title: 'Autumn Open Padel Championship Draw Released', category: 'Tournament Notice', date: '2026-09-30', published: true, priority: 'normal' }
];

const SEED_MEDIA: MediaAsset[] = [
  { id: 'med-1', name: 'stadium-floodlights-night.jpg', tag: '#stadium', dimensions: '3840x2160', size: '2.4 MB', url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80' },
  { id: 'med-2', name: 'tennis-serve-clay-court.jpg', tag: '#tennis', dimensions: '2560x1440', size: '1.8 MB', url: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80' },
  { id: 'med-3', name: 'padel-glass-smash.jpg', tag: '#padel', dimensions: '3840x2160', size: '3.1 MB', url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80' },
  { id: 'med-4', name: 'cricket-stadium-dusk.jpg', tag: '#cricket', dimensions: '2560x1440', size: '1.9 MB', url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80' }
];

export const ContentDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'pages' | 'branding' | 'content' | 'media' | 'announcements' | 'website_settings'>('dashboard');
  
  const [pages, setPages] = useState<ManagedPage[]>(SEED_PAGES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(SEED_ANNOUNCEMENTS);
  const [media, setMedia] = useState<MediaAsset[]>(SEED_MEDIA);

  // Marquee Banner & Hero Headlines
  const [bannerTitle, setBannerTitle] = useState('Welcome to The Champions Club — ArenaFlow Operating System Live &bull; Court Bookings Open 24/7');
  const [heroTagline, setHeroTagline] = useState('One Arena. Every Sport.');
  const [heroHeadline, setHeroHeadline] = useState('Next-Generation Multi-Sport Club Operating System');
  const [clubBrandColor, setClubBrandColor] = useState('#06b6d4'); // Cyan default
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // New Announcement Modal
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnCategory, setNewAnnCategory] = useState<'Tournament Notice' | 'Facility Maintenance' | 'Special Event'>('Special Event');
  const [newAnnPriority, setNewAnnPriority] = useState<'normal' | 'urgent'>('normal');

  // Core Metrics (Rule 32)
  const publishedPages = pages.filter(p => p.status === 'published').length;
  const draftPages = pages.filter(p => p.status === 'draft').length;
  const mediaCount = 124; // Total assets in CDN
  const activeAnnouncements = announcements.filter(a => a.published).length;
  const bannersCount = 1;
  const faqsCount = 14;
  const totalWebsiteViews = pages.reduce((s, p) => s + p.views, 0) + 12450;

  const triggerSaveNotification = (msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(null), 3500);
  };

  const togglePageStatus = (id: string) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : p));
    triggerSaveNotification('Page publication state updated on live CDN routing.');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim()) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now().toString().slice(-4)}`,
      title: newAnnTitle,
      category: newAnnCategory,
      date: '2026-10-03',
      published: true,
      priority: newAnnPriority
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    setShowAnnModal(false);
    setNewAnnTitle('');
    triggerSaveNotification('New club announcement published across member portal.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* Top Glowing Laser Telemetry Strip */}
      <div 
        className="h-1 rounded-full w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400"
        style={{ boxShadow: '0 0 14px rgba(168, 85, 247, 0.6)' }}
      />

      {/* Header Banner & Rule 32 Security Isolation Notice */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold tracking-widest text-purple-400 uppercase">
              CONTENT-001 &bull; Portal CMS &amp; Digital Brand Authority
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
              EDGE CDN SYNCED
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            Club Content &amp; Media Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global sports slides editor, public marquees, club brand styling, high-res media library, and SEO settings.
          </p>
        </div>

        {/* Rule 32 Isolation Notice */}
        <div className="flex items-center space-x-2 bg-slate-950/80 px-3.5 py-2 rounded-2xl border border-slate-800 text-[11px] text-slate-400">
          <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
          <span>Rule 32: Content Authority isolated from Finance, Sales &amp; Staff records.</span>
        </div>
      </div>

      {saveMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveMsg}</span>
        </div>
      )}

      {/* Rule 55 Contextual Guidance Bar */}
      <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between text-xs text-purple-200">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            <strong>Content Standard:</strong> All sport slides 02–07 must maintain cinematic stadium imagery, 4K floodlight atmospheres, and consistent club branding.
          </span>
        </div>
        <button 
          onClick={() => setShowAnnModal(true)}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-glow-violet shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Announcement</span>
        </button>
      </div>

      {/* Rule 32 Seven Mandatory Menu Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-2 scrollbar-none">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'pages', label: `Pages (${pages.length})` },
          { id: 'branding', label: 'Branding' },
          { id: 'content', label: 'Content' },
          { id: 'media', label: `Media (${media.length})` },
          { id: 'announcements', label: `Announcements (${announcements.length})` },
          { id: 'website_settings', label: 'Website Settings' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeMenu === item.id 
                ? 'bg-purple-600 text-white shadow-glow-violet' 
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* TAB: DASHBOARD */}
      {activeMenu === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Rule 32 Metrics: 7 Core Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Published Pages</div>
              <div className="text-2xl font-bold font-mono text-emerald-400">{publishedPages}</div>
              <div className="text-[10px] text-emerald-300">Live on edge CDN</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Draft Pages</div>
              <div className="text-2xl font-bold font-mono text-amber-400">{draftPages}</div>
              <div className="text-[10px] text-amber-300">In authoring</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Media Library</div>
              <div className="text-2xl font-bold font-mono text-purple-400">{mediaCount}</div>
              <div className="text-[10px] text-purple-300">4K Stadium assets</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Active Notices</div>
              <div className="text-2xl font-bold font-mono text-cyan-400">{activeAnnouncements}</div>
              <div className="text-[10px] text-cyan-300">Portal &amp; App</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Active Banners</div>
              <div className="text-2xl font-bold font-mono text-white">{bannersCount}</div>
              <div className="text-[10px] text-slate-500">Public top marquee</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Verified FAQs</div>
              <div className="text-2xl font-bold font-mono text-sky-400">{faqsCount}</div>
              <div className="text-[10px] text-sky-300">Member helpdesk</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Monthly Views</div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {(totalWebsiteViews / 1000).toFixed(1)}k
              </div>
              <div className="text-[10px] text-emerald-300 font-semibold">+24% vs last mo</div>
            </div>
          </div>

          {/* Quick Dual Columns: Hero Marquee Editor & Published Notices */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Banner Marquee Control */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Live Public Header Marquee Announcement</span>
              </h4>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                <span className="truncate">{bannerTitle}</span>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">Edit Marquee Text</label>
                <textarea
                  rows={3}
                  value={bannerTitle}
                  onChange={e => setBannerTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                onClick={() => triggerSaveNotification('Live marquee updated across all user and visitor viewports.')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-glow-violet transition-all"
              >
                Update Live Marquee
              </button>
            </div>

            {/* Published Member Notices */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-purple-400" />
                  <span>Club Broadcast Notices</span>
                </h4>
                <button onClick={() => setActiveMenu('announcements')} className="text-xs text-purple-400 hover:underline">
                  Manage &rarr;
                </button>
              </div>

              <div className="space-y-2.5">
                {announcements.map(ann => (
                  <div key={ann.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{ann.title}</span>
                        {ann.priority === 'urgent' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 uppercase">
                            URGENT
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{ann.category} &bull; {ann.date}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      LIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB: PAGES */}
      {activeMenu === 'pages' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Public &amp; Member Routing Directory</h3>
              <p className="text-xs text-slate-400">Manage visibility, publish states, and SEO metrics for every platform slide.</p>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
              {publishedPages} Published / {pages.length} Total
            </span>
          </div>

          <div className="space-y-2.5">
            {pages.map(page => (
              <div key={page.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{page.title}</span>
                    <span className="font-mono text-[11px] text-slate-500">{page.slug}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                    <span>Views: <strong className="text-cyan-400 font-mono">{page.views.toLocaleString()}</strong></span>
                    <span>SEO Score: <strong className="text-emerald-400 font-mono">{page.seoScore}/100</strong></span>
                    <span>Last edited: {page.lastEdited}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => togglePageStatus(page.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                      page.status === 'published'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {page.status === 'published' ? '✓ Published' : '○ Draft'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: BRANDING */}
      {activeMenu === 'branding' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Club Visual Identity &amp; Design System Controls</h3>
            <p className="text-xs text-slate-400">Configure global stadium colors, tagline typography, and high-tech UI accents.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Color Palette */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-400" />
                <span>Primary Laser Accent Color</span>
              </h4>
              <p className="text-xs text-slate-400">Affects HUD glowing borders, telemetry pill accents, and button highlights.</p>
              
              <div className="flex items-center gap-3">
                {[
                  { name: 'Cyan Stadium', hex: '#06b6d4' },
                  { name: 'Neon Emerald', hex: '#10b981' },
                  { name: 'Electric Violet', hex: '#8b5cf6' },
                  { name: 'Amber Sunset', hex: '#f59e0b' },
                  { name: 'Crimson Laser', hex: '#f43f5e' }
                ].map(c => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      setClubBrandColor(c.hex);
                      triggerSaveNotification(`Club accent color updated to ${c.name}`);
                    }}
                    className={`w-9 h-9 rounded-xl transition-all border-2 ${
                      clubBrandColor === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Tagline & Identity */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white">Official Tagline (Rule 01 &amp; 03)</h4>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Tagline String</label>
                <input
                  type="text"
                  value={heroTagline}
                  onChange={e => setHeroTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500 font-semibold"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => triggerSaveNotification('Brand tagline saved.')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-glow-violet"
                >
                  Save Identity
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB: CONTENT */}
      {activeMenu === 'content' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Slide 01 Hero &amp; Sports Showcase Copywriter</h3>
            <p className="text-xs text-slate-400">Directly adjust primary marketing headlines displayed on public and visitor pages.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Hero Main Title (Slide 01)</label>
              <input
                type="text"
                value="ArenaFlow"
                disabled
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Hero Secondary Headline</label>
              <input
                type="text"
                value={heroHeadline}
                onChange={e => setHeroHeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => triggerSaveNotification('Hero marketing copy updated across Slide 01.')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-glow-violet"
              >
                Publish Headline Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: MEDIA */}
      {activeMenu === 'media' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Stadium Media Library (Rule 04–09 Visuals)</h3>
              <p className="text-xs text-slate-400">Cinematic photography, player hero cuts, and court surface textures.</p>
            </div>
            <button
              onClick={() => triggerSaveNotification('Media asset browser initialized. Upload simulation ready.')}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow-violet flex items-center gap-1.5"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Upload 4K Media</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {media.map(m => (
              <div key={m.id} className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden group">
                <div className="h-36 overflow-hidden relative">
                  <img src={m.url} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950/80 text-cyan-300 backdrop-blur-md">
                    {m.tag}
                  </span>
                </div>
                <div className="p-3 text-xs space-y-1">
                  <div className="font-bold text-white truncate">{m.name}</div>
                  <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>{m.dimensions}</span>
                    <span>{m.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: ANNOUNCEMENTS */}
      {activeMenu === 'announcements' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Club Announcements Board</h3>
              <p className="text-xs text-slate-400">Publish urgent notices, tournament draws, and court maintenance alerts.</p>
            </div>
            <button
              onClick={() => setShowAnnModal(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow-violet flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Announcement</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map(ann => (
              <div key={ann.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{ann.title}</span>
                    {ann.priority === 'urgent' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 uppercase">
                        Urgent
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Category: <strong className="text-purple-300">{ann.category}</strong> &bull; Date: {ann.date}
                  </div>
                </div>

                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Live on Portal
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: WEBSITE SETTINGS */}
      {activeMenu === 'website_settings' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Global Website &amp; SEO Engine Configuration</h3>
            <p className="text-xs text-slate-400">Manage search engine indexing, OpenGraph preview cards, and emergency maintenance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white">SEO Title &amp; Meta Description</h4>
              <div>
                <label className="block text-slate-400 mb-1">Page Title Tag</label>
                <input
                  type="text"
                  defaultValue="ArenaFlow — One Arena. Every Sport."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  defaultValue="ArenaFlow is the unified multi-sport club operating system with court bookings, tournaments, CRM, shared pro shop, and cafeteria POS."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white">Emergency Maintenance Mode</h4>
              <p className="text-slate-400">
                When enabled, visitors see a scheduled maintenance notice while authorized staff retain login capabilities.
              </p>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-white">Maintenance Status</span>
                <button
                  onClick={() => {
                    setMaintenanceMode(!maintenanceMode);
                    triggerSaveNotification(maintenanceMode ? 'Maintenance mode disabled.' : 'Maintenance mode ENABLED.');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    maintenanceMode ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {maintenanceMode ? 'ACTIVE (Offline)' : 'INACTIVE (Live)'}
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => triggerSaveNotification('Website technical settings saved.')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-glow-violet"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Announcement Modal */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create Broadcast Announcement</h3>
              <button onClick={() => setShowAnnModal(false)} className="text-slate-400 hover:text-white text-xs">
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3 pt-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Announcement Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Padel League registrations now open"
                  value={newAnnTitle}
                  onChange={e => setNewAnnTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={newAnnCategory}
                    onChange={e => setNewAnnCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Special Event">Special Event</option>
                    <option value="Tournament Notice">Tournament Notice</option>
                    <option value="Facility Maintenance">Facility Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Priority</label>
                  <select
                    value={newAnnPriority}
                    onChange={e => setNewAnnPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-glow-violet"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
