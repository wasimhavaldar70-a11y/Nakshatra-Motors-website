import React, { useState } from 'react';
import {
  LayoutDashboard,
  Bike,
  Users,
  Settings,
  HelpCircle,
  Database,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  MessageSquare,
  LogOut,
  ExternalLink,
  Save,
  RotateCcw,
  Copy,
  Check,
  Battery,
  Phone,
  Calendar,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { formatInr, formatScooterPrice, generateWhatsAppLink } from '../../utils/evCalculations';
import { Enquiry, EnquiryStatus, FAQItem, ScooterModel, SiteSettings, Testimonial } from '../../types';
import {
  getSupabaseCredentials,
  setSupabaseCredentials,
  isSupabaseConfigured,
} from '../../lib/supabaseClient';

export const AVAILABLE_BIKE_IMAGES = [
  {
    name: 'Hestur Dyno',
    url: '/assets/aistudio/image_3fa52802.png',
    tag: 'Dyno',
  },
  {
    name: 'Hestur Werewolf',
    url: '/assets/scooters/hestur-werewolf.webp',
    tag: 'Werewolf',
  },
  {
    name: 'Hestur Werewolf+ (Side)',
    url: '/assets/scooters/hestur-werewolf-plus.jpg',
    tag: 'Werewolf+',
  },
  {
    name: 'Hestur Werewolf+ (Front)',
    url: '/assets/scooters/hestur-werewolf-plus-front.jpg',
    tag: 'Werewolf+ Front',
  },
  {
    name: 'Yellow Flagship (1920x1080)',
    url: '/assets/aistudio/1920x1080_2_89056914.jpg',
    tag: 'Flagship Edition',
  },
  {
    name: 'Red Terrain (1920x1080)',
    url: '/assets/aistudio/1920x1080_3_545056cd.jpg',
    tag: 'Mountain Road',
  },
  {
    name: 'Werewolf+ Red (1920x1080)',
    url: '/assets/aistudio/1920x1080_bfe514b2.jpg',
    tag: 'Werewolf+ Banner',
  },
];

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onNavigateHome }) => {
  const store = useStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const scooters = store.getScooters();
  const enquiries = store.getEnquiries();
  const testimonials = store.getTestimonials();
  const faqs = store.getFaqs();
  const settings = store.getSettings();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'scooters' | 'leads' | 'battery' | 'trust_faqs' | 'settings' | 'supabase'
  >('overview');

  // Supabase credentials state
  const creds = getSupabaseCredentials();
  const [sbUrl, setSbUrl] = useState(creds.url);
  const [sbKey, setSbKey] = useState(creds.anonKey);
  const [sbSaveMessage, setSbSaveMessage] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  // Settings edit state
  const [editingSettings, setEditingSettings] = useState<SiteSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Scooter Modal Edit State
  const [editingScooter, setEditingScooter] = useState<ScooterModel | null>(null);
  const [isAddingScooter, setIsAddingScooter] = useState(false);

  // FAQ Modal Edit State
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);

  // Testimonial Modal Edit State
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Lead status filter
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');

  const pendingTestRides = enquiries.filter(
    (e) => e.enquiryType === 'Test Ride' && e.status !== 'Closed' && e.status !== 'Converted'
  ).length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.saveSettings(editingSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleSaveSupabaseCreds = (e: React.FormEvent) => {
    e.preventDefault();
    setSupabaseCredentials(sbUrl, sbKey);
    setSbSaveMessage('Supabase credentials saved successfully.');
    setTimeout(() => setSbSaveMessage(''), 3000);
  };

  const handleCopySchema = () => {
    const sql = `-- Nakshatra Motors Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.scooters (...);
CREATE TABLE IF NOT EXISTS public.enquiries (...);
CREATE TABLE IF NOT EXISTS public.testimonials (...);
CREATE TABLE IF NOT EXISTS public.faqs (...);
CREATE TABLE IF NOT EXISTS public.site_settings (...);
-- Complete file is available in /supabase/schema.sql in this project root.`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleReplyWhatsApp = (enquiry: Enquiry) => {
    const text = `Hello ${enquiry.fullName}, this is from ${settings.dealerName}. Regarding your ${enquiry.enquiryType} for the ${enquiry.scooterModel}: we are happy to assist you! When would be a convenient time to discuss?`;
    const link = generateWhatsAppLink(enquiry.mobile, text);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#07090D] text-slate-100 flex flex-col">
      {/* CMS Top Header */}
      <header className="bg-[#0B0F17] border-b border-slate-800 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white text-base">
            N
          </div>
          <div>
            <span className="text-sm font-extrabold uppercase tracking-tight text-white block">
              {settings.dealerName} CMS
            </span>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span>Authorized Hestur Dealer Admin</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSupabaseConfigured() ? 'bg-emerald-400' : 'bg-blue-400'
                  }`}
                />
                {isSupabaseConfigured() ? 'Supabase Connected' : 'Local Persistent Storage'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onLogout}
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main CMS Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#0A0D14] border-r border-slate-800 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'overview'
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview & Stats
          </button>

          <button
            onClick={() => setActiveTab('scooters')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'scooters'
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Bike className="w-4 h-4" />
            Scooter Models ({scooters.length})
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
              activeTab === 'leads'
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Enquiries & Leads</span>
            </div>
            {enquiries.filter((e) => e.status === 'New').length > 0 && (
              <span className="text-[10px] bg-white text-red-600 font-bold px-1.5 py-0.2 rounded-full">
                {enquiries.filter((e) => e.status === 'New').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('battery')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'battery'
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Battery className="w-4 h-4" />
            Battery & Tech Content
          </button>

          <button
            onClick={() => setActiveTab('trust_faqs')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'trust_faqs'
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Trust & FAQs Manager
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'settings'
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            Dealership Settings
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'supabase'
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            Supabase DB Sync
          </button>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Dealership Overview</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Live metrics, customer enquiries, and vehicle inventory.
                </p>
              </div>

              {/* 4 Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0E131C] border border-slate-800 p-5 rounded-2xl">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">
                    Total Enquiries
                  </span>
                  <span className="text-3xl font-extrabold text-white font-mono mt-1 block">
                    {enquiries.length}
                  </span>
                  <span className="text-[11px] text-emerald-400 mt-1 block">
                    {enquiries.filter((e) => e.status === 'New').length} new unaddressed
                  </span>
                </div>

                <div className="bg-[#0E131C] border border-slate-800 p-5 rounded-2xl">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">
                    Test Rides Active
                  </span>
                  <span className="text-3xl font-extrabold text-red-500 font-mono mt-1 block">
                    {pendingTestRides}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">Bookings to coordinate</span>
                </div>

                <div className="bg-[#0E131C] border border-slate-800 p-5 rounded-2xl">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">
                    Scooter Models
                  </span>
                  <span className="text-3xl font-extrabold text-cyan-400 font-mono mt-1 block">
                    {scooters.length}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">Active in catalogue</span>
                </div>

                <div className="bg-[#0E131C] border border-slate-800 p-5 rounded-2xl">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">
                    Happy Customers
                  </span>
                  <span className="text-3xl font-extrabold text-amber-400 font-mono mt-1 block">
                    {settings.happyCustomersCount}+
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">Public trust display</span>
                </div>
              </div>

              {/* Recent Enquiries Table */}
              <div className="bg-[#0E131C] border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">Recent Customer Leads</h3>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold"
                  >
                    View All ({enquiries.length}) &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Mobile</th>
                        <th className="pb-3">Model</th>
                        <th className="pb-3">Type</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {enquiries.slice(0, 5).map((enq) => (
                        <tr key={enq.id} className="hover:bg-slate-900/40">
                          <td className="py-3 font-medium text-white">{enq.fullName}</td>
                          <td className="py-3 font-mono text-slate-300">{enq.mobile}</td>
                          <td className="py-3 text-slate-300">{enq.scooterModel}</td>
                          <td className="py-3">
                            <span className="text-[11px] text-slate-300">{enq.enquiryType}</span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                enq.status === 'New'
                                  ? 'bg-red-950/80 text-red-400 border border-red-500/30'
                                  : enq.status === 'Test Ride Scheduled'
                                  ? 'bg-blue-950/80 text-blue-400 border border-blue-500/30'
                                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {enq.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleReplyWhatsApp(enq)}
                              className="px-2.5 py-1 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded text-[11px] font-medium"
                            >
                              WhatsApp
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCOOTER MODELS CMS */}
          {activeTab === 'scooters' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Manage Scooter Models
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Edit prices, specifications, certified ranges, colors, and imagery.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newModel: ScooterModel = {
                      id: 'hestur-model-' + Date.now().toString(36),
                      slug: 'hestur-new-' + Math.floor(Math.random() * 900 + 100),
                      name: 'Hestur V',
                      series: 'Urban Performance Series',
                      tagline: 'High-Efficiency Electric Mobility',
                      description: 'Brand new Hestur electric scooter model.',
                      price: 99999,
                      certifiedRange: 110,
                      topSpeed: 65,
                      batteryCapacity: '2.5 kWh',
                      chargingTime: '3.0 hrs',
                      batteryChemistry: 'Automotive Grade LFP',
                      motorPower: '3.0 kW Peak',
                      torque: '70 Nm',
                      acceleration: '0-40 km/h in 3.5s',
                      brakes: 'Front & Rear Disc with CBS',
                      suspension: 'Telescopic Front Fork',
                      curbWeight: '92 kg',
                      bootSpace: '28 Litres',
                      warranty: {
                        vehicle: '3 Years / 40,000 km',
                        battery: '3 Years Comprehensive',
                      },
                      features: ['Smart Digital Display', 'Reverse Assist'],
                      colors: [{ name: 'Crimson Red', hex: '#DC2626' }],
                      image: '/assets/scooters/hestur-werewolf-plus.jpg',
                      gallery: ['/assets/scooters/hestur-werewolf-plus.jpg'],
                      featured: false,
                      displayOrder: scooters.length + 1,
                      status: 'available',
                    };
                    setEditingScooter(newModel);
                    setIsAddingScooter(true);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-red-600/20"
                >
                  <Plus className="w-4 h-4" />
                  Add New Scooter
                </button>
              </div>

              {/* Scooters Cards / Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scooters.map((model) => (
                  <div
                    key={model.id}
                    className="bg-[#0E131C] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-slate-900 rounded-xl p-2 shrink-0 flex items-center justify-center border border-slate-800">
                        <img
                          src={model.image}
                          alt={model.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block">
                          {model.series}
                        </span>
                        <h3 className="text-base font-bold text-white">{model.name}</h3>
                        <p className="text-xs text-slate-400 font-mono">
                          Price: {formatScooterPrice(model.price)}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                          <span>Range: {model.certifiedRange} km</span>
                          <span>·</span>
                          <span>Speed: {model.topSpeed} km/h</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800 text-xs">
                      <span className="text-slate-500 font-mono">Slug: /{model.slug}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingScooter(model);
                            setIsAddingScooter(false);
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-red-400" />
                          Edit Specs & Picture
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${model.name}?`)) {
                              store.deleteScooter(model.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800"
                          title="Delete model"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scooter Modal Editor */}
              {editingScooter && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-[#0E131C] border border-slate-700 max-w-2xl w-full rounded-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <h2 className="text-xl font-bold text-white">
                        {isAddingScooter ? 'Add New Scooter Model' : `Edit ${editingScooter.name}`}
                      </h2>
                      <span className="text-xs text-slate-400 font-mono">ID: {editingScooter.id}</span>
                    </div>

                    {/* BIKE PICTURE & IMAGE MANAGEMENT */}
                    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-red-500" />
                          <span>Bike Picture / Main Image</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-sm shadow-red-600/30"
                        >
                          <Upload className="w-3 h-3" />
                          Upload Picture from Computer
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && editingScooter) {
                              const reader = new FileReader();
                              reader.onload = (uploadEvent) => {
                                const dataUrl = uploadEvent.target?.result as string;
                                if (dataUrl) {
                                  setEditingScooter({ ...editingScooter, image: dataUrl });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>

                      {/* Current Image Preview & Path Input */}
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-20 bg-slate-950 rounded-lg p-1.5 border border-slate-800 shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={editingScooter.image}
                            alt={editingScooter.name}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] text-slate-400 block font-medium">Image URL or Local File Path:</label>
                          <input
                            type="text"
                            value={editingScooter.image}
                            onChange={(e) => setEditingScooter({ ...editingScooter, image: e.target.value })}
                            placeholder="/public/assets/... or https://..."
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Quick Preset Selector */}
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
                          Or Select Any Uploaded Dealership Picture:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {AVAILABLE_BIKE_IMAGES.map((img) => (
                            <button
                              key={img.url}
                              type="button"
                              onClick={() => setEditingScooter({ ...editingScooter, image: img.url })}
                              className={`p-1.5 rounded-lg border text-left transition-all flex flex-col items-center gap-1 group ${
                                editingScooter.image === img.url
                                  ? 'border-red-500 bg-red-950/30 ring-1 ring-red-500'
                                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                              }`}
                            >
                              <div className="w-full h-12 rounded bg-black/40 overflow-hidden flex items-center justify-center p-0.5">
                                <img
                                  src={img.url}
                                  alt={img.name}
                                  className="w-full h-full object-cover rounded"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <span className="text-[10px] text-slate-300 font-medium truncate w-full text-center">
                                {img.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-slate-300 block mb-1">Model Name</label>
                        <input
                          type="text"
                          value={editingScooter.name}
                          onChange={(e) =>
                            setEditingScooter({ ...editingScooter, name: e.target.value })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1">URL Slug</label>
                        <input
                          type="text"
                          value={editingScooter.slug}
                          onChange={(e) =>
                            setEditingScooter({ ...editingScooter, slug: e.target.value })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1">Ex-Showroom Price (INR)</label>
                        <input
                          type="number"
                          value={editingScooter.price}
                          onChange={(e) =>
                            setEditingScooter({ ...editingScooter, price: Number(e.target.value) })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1">Certified Range (km)</label>
                        <input
                          type="number"
                          value={editingScooter.certifiedRange}
                          onChange={(e) =>
                            setEditingScooter({
                              ...editingScooter,
                              certifiedRange: Number(e.target.value),
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1">Top Speed (km/h)</label>
                        <input
                          type="number"
                          value={editingScooter.topSpeed}
                          onChange={(e) =>
                            setEditingScooter({
                              ...editingScooter,
                              topSpeed: Number(e.target.value),
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1">Battery Capacity</label>
                        <input
                          type="text"
                          value={editingScooter.batteryCapacity}
                          onChange={(e) =>
                            setEditingScooter({
                              ...editingScooter,
                              batteryCapacity: e.target.value,
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1">Charging Time</label>
                        <input
                          type="text"
                          value={editingScooter.chargingTime}
                          onChange={(e) =>
                            setEditingScooter({ ...editingScooter, chargingTime: e.target.value })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1">Motor Power</label>
                        <input
                          type="text"
                          value={editingScooter.motorPower}
                          onChange={(e) =>
                            setEditingScooter({ ...editingScooter, motorPower: e.target.value })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-slate-300 block mb-1">Tagline</label>
                        <input
                          type="text"
                          value={editingScooter.tagline}
                          onChange={(e) =>
                            setEditingScooter({ ...editingScooter, tagline: e.target.value })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-slate-300 block mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={editingScooter.description}
                          onChange={(e) =>
                            setEditingScooter({ ...editingScooter, description: e.target.value })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                      <button
                        onClick={() => setEditingScooter(null)}
                        className="px-4 py-2 bg-slate-800 text-white rounded text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          store.saveScooter(editingScooter);
                          setEditingScooter(null);
                        }}
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CUSTOMER ENQUIRIES & TEST RIDES */}
          {activeTab === 'leads' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Customer Leads</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage enquiries, test ride schedules, and WhatsApp follow-ups.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-xs text-white rounded-lg px-3 py-2"
                  >
                    <option value="all">All Statuses ({enquiries.length})</option>
                    <option value="New">New Leads</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Test Ride Scheduled">Test Ride Scheduled</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="bg-[#0E131C] border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                        <th className="p-4">Customer</th>
                        <th className="p-4">Model & Type</th>
                        <th className="p-4">Preferred Date</th>
                        <th className="p-4">Message / Notes</th>
                        <th className="p-4">Lead Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {enquiries
                        .filter((e) => leadStatusFilter === 'all' || e.status === leadStatusFilter)
                        .map((enq) => (
                          <tr key={enq.id} className="hover:bg-slate-900/30">
                            <td className="p-4">
                              <div className="font-bold text-white">{enq.fullName}</div>
                              <div className="text-slate-400 font-mono">{enq.mobile}</div>
                              {enq.email && <div className="text-slate-500">{enq.email}</div>}
                            </td>

                            <td className="p-4">
                              <div className="font-semibold text-white">{enq.scooterModel}</div>
                              <div className="text-red-400 text-[11px] font-medium">
                                {enq.enquiryType}
                              </div>
                            </td>

                            <td className="p-4 text-slate-300">
                              {enq.preferredDate || <span className="text-slate-600">—</span>}
                            </td>

                            <td className="p-4 max-w-xs text-slate-300 truncate" title={enq.message}>
                              {enq.message}
                              {enq.notes && (
                                <div className="text-emerald-400 text-[10px] mt-0.5">
                                  Note: {enq.notes}
                                </div>
                              )}
                            </td>

                            <td className="p-4">
                              <select
                                value={enq.status}
                                onChange={(e) =>
                                  store.updateEnquiry(enq.id, {
                                    status: e.target.value as EnquiryStatus,
                                  })
                                }
                                className="bg-slate-900 border border-slate-700 text-[11px] text-white rounded px-2 py-1"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Test Ride Scheduled">Test Ride Scheduled</option>
                                <option value="Converted">Converted</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>

                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => handleReplyWhatsApp(enq)}
                                className="px-3 py-1 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded text-xs font-semibold inline-flex items-center gap-1"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                WhatsApp
                              </button>
                              <button
                                onClick={() => store.deleteEnquiry(enq.id)}
                                className="p-1 text-slate-500 hover:text-red-400"
                                title="Delete enquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BATTERY & TECHNOLOGY CONTENT */}
          {activeTab === 'battery' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Battery & Powertrain CMS
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Update battery chemistry descriptions, BMS points, and warranty claims.
                </p>
              </div>

              <div className="bg-[#0E131C] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">
                    Battery Chemistry Highlight Headline
                  </label>
                  <input
                    type="text"
                    value={editingSettings.batteryChemistryHighlight}
                    onChange={(e) =>
                      setEditingSettings({
                        ...editingSettings,
                        batteryChemistryHighlight: e.target.value,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">
                    Battery Warranty Highlight
                  </label>
                  <input
                    type="text"
                    value={editingSettings.batteryWarrantyHighlight}
                    onChange={(e) =>
                      setEditingSettings({
                        ...editingSettings,
                        batteryWarrantyHighlight: e.target.value,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSaveSettings}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Battery Content
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TRUST & FAQS MANAGER */}
          {activeTab === 'trust_faqs' && (
            <div className="space-y-8 max-w-5xl">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Customer Trust & FAQs
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Manage satisfied customer counter, testimonials, and FAQ accordion.
                </p>
              </div>

              {/* Happy customer counter */}
              <div className="bg-[#0E131C] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Happy Customers Public Counter</h3>
                  <p className="text-xs text-slate-400">
                    Controls the number shown on the trust banner (e.g. &ldquo;128+ Customers. One
                    Trusted Destination.&rdquo;)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={editingSettings.happyCustomersCount}
                    onChange={(e) =>
                      setEditingSettings({
                        ...editingSettings,
                        happyCustomersCount: Number(e.target.value),
                      })
                    }
                    className="w-24 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-center font-bold"
                  />
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Update
                  </button>
                </div>
              </div>

              {/* FAQs list & manager */}
              <div className="bg-[#0E131C] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Frequently Asked Questions</h3>
                  <button
                    onClick={() => {
                      const newFaq: FAQItem = {
                        id: 'faq-' + Date.now(),
                        question: 'New Question?',
                        answer: 'Answer to the question goes here.',
                        category: 'general' as any,
                        displayOrder: faqs.length + 1,
                      };
                      store.saveFaq(newFaq);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add FAQ
                  </button>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => store.saveFaq({ ...faq, question: e.target.value })}
                          className="w-full bg-transparent border-b border-slate-700 font-semibold text-sm text-white focus:outline-none focus:border-red-500 pb-1"
                        />
                        <button
                          onClick={() => store.deleteFaq(faq.id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => store.saveFaq({ ...faq, answer: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS & WHATSAPP */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Dealership Settings</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Configure phone numbers, WhatsApp, showroom address and hero texts.
                </p>
              </div>

              {settingsSaved && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Settings updated and persisted successfully.</span>
                </div>
              )}

              <form
                onSubmit={handleSaveSettings}
                className="bg-[#0E131C] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Dealership Name</label>
                    <input
                      type="text"
                      value={editingSettings.dealerName}
                      onChange={(e) =>
                        setEditingSettings({ ...editingSettings, dealerName: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Brand Affiliation</label>
                    <input
                      type="text"
                      value={editingSettings.brandAffiliation}
                      onChange={(e) =>
                        setEditingSettings({
                          ...editingSettings,
                          brandAffiliation: e.target.value,
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">
                      Official WhatsApp Number (With Country Code)
                    </label>
                    <input
                      type="text"
                      value={editingSettings.whatsappNumber}
                      onChange={(e) =>
                        setEditingSettings({
                          ...editingSettings,
                          whatsappNumber: e.target.value,
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Showroom Phone</label>
                    <input
                      type="text"
                      value={editingSettings.phone}
                      onChange={(e) =>
                        setEditingSettings({ ...editingSettings, phone: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-300 block mb-1 font-semibold">Showroom Address</label>
                    <input
                      type="text"
                      value={editingSettings.address}
                      onChange={(e) =>
                        setEditingSettings({ ...editingSettings, address: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">City</label>
                    <input
                      type="text"
                      value={editingSettings.city}
                      onChange={(e) =>
                        setEditingSettings({ ...editingSettings, city: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Operating Hours</label>
                    <input
                      type="text"
                      value={editingSettings.operatingHours}
                      onChange={(e) =>
                        setEditingSettings({ ...editingSettings, operatingHours: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-300 block mb-1 font-semibold">Hero Headline</label>
                    <input
                      type="text"
                      value={editingSettings.heroHeadline}
                      onChange={(e) =>
                        setEditingSettings({ ...editingSettings, heroHeadline: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-300 block mb-1 font-semibold">
                      Hero Supporting Description
                    </label>
                    <textarea
                      rows={2}
                      value={editingSettings.heroSupportingText}
                      onChange={(e) =>
                        setEditingSettings({
                          ...editingSettings,
                          heroSupportingText: e.target.value,
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save All Dealership Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 7: SUPABASE POSTGRESQL INTEGRATION */}
          {activeTab === 'supabase' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Supabase Cloud PostgreSQL Database
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Connect your live Supabase project for persistent cloud storage across multiple devices.
                </p>
              </div>

              {/* Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isSupabaseConfigured()
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                    : 'bg-blue-950/20 border-blue-500/30 text-blue-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {isSupabaseConfigured()
                        ? 'Supabase Integration Active'
                        : 'Local In-Memory / Browser Storage Mode'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {isSupabaseConfigured()
                        ? 'Connected to your Supabase project. Changes auto-sync to cloud PostgreSQL.'
                        : 'The applet is currently using persistent local storage with pre-seeded Hestur data. Connect Supabase below to sync to cloud.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Config Form */}
              <form
                onSubmit={handleSaveSupabaseCreds}
                className="bg-[#0E131C] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4"
              >
                <h3 className="text-sm font-bold text-white">Supabase Connection Keys</h3>

                {sbSaveMessage && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{sbSaveMessage}</span>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">
                      Project URL (e.g. https://xyzcompany.supabase.co)
                    </label>
                    <input
                      type="url"
                      placeholder="https://your-project.supabase.co"
                      value={sbUrl}
                      onChange={(e) => setSbUrl(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Anon Public Key</label>
                    <input
                      type="password"
                      placeholder="eyJh..."
                      value={sbKey}
                      onChange={(e) => setSbKey(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Save & Reconnect
                  </button>

                  {isSupabaseConfigured() && (
                    <button
                      type="button"
                      onClick={() => {
                        setSupabaseCredentials('', '');
                        setSbUrl('');
                        setSbKey('');
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                    >
                      Disconnect Supabase
                    </button>
                  )}
                </div>
              </form>

              {/* PostgreSQL Schema SQL copy card */}
              <div className="bg-[#0E131C] border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">PostgreSQL Schema & RLS Policies</h3>
                    <p className="text-xs text-slate-400">
                      Copy or inspect the exact SQL script located at <code>/supabase/schema.sql</code>
                    </p>
                  </div>
                  <button
                    onClick={handleCopySchema}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSql ? 'Copied SQL' : 'Copy SQL Script'}
                  </button>
                </div>
                <div className="p-3 bg-black/60 rounded-xl font-mono text-[11px] text-slate-400 overflow-x-auto max-h-36">
                  {`CREATE TABLE public.scooters (id TEXT PRIMARY KEY, slug TEXT UNIQUE, name TEXT...);
CREATE TABLE public.enquiries (id UUID PRIMARY KEY, full_name TEXT, mobile TEXT...);
CREATE TABLE public.testimonials (...);
CREATE TABLE public.faqs (...);
CREATE TABLE public.site_settings (...);
-- Complete RLS and indexes are pre-configured in /supabase/schema.sql`}
                </div>
              </div>

              {/* Reset to factory defaults */}
              <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-300 font-semibold block">Reset Factory Seed Data</span>
                  <span className="text-slate-500">
                    Restore original Hestur Dyno, Werewolf, Werewolf+, specifications and FAQs.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset all scooters, FAQs, and site settings to default seed values?')) {
                      store.resetDefaults();
                      setEditingSettings(store.getSettings());
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-400 rounded-lg transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
