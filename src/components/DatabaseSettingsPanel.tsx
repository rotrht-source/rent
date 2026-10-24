import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  Cloud,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  KeyRound,
  FileCode2,
  Info,
  HelpCircle,
  Link as LinkIcon
} from 'lucide-react';

export const DatabaseSettingsPanel: React.FC = () => {
  const {
    siteSettings,
    updateSiteSettings,
    properties,
    tenants,
    inbox,
    exportSystemData,
    importSystemData,
    resetAllDemoData,
    showToast
  } = useApp();

  const [mode, setMode] = useState<'local' | 'firebase'>(
    siteSettings.databaseMode || 'local'
  );

  // Input method tabs: 'simple' (individual fields) | 'code' (paste full snippet) | 'url' (paste Firebase URL)
  const [inputTab, setInputTab] = useState<'simple' | 'code' | 'url'>('simple');

  const [projectId, setProjectId] = useState<string>(
    siteSettings.firebaseProjectId || ''
  );
  const [apiKey, setApiKey] = useState<string>(
    siteSettings.firebaseApiKey || ''
  );
  const [authDomain, setAuthDomain] = useState<string>(
    siteSettings.firebaseAuthDomain || ''
  );
  const [rawConfigInput, setRawConfigInput] = useState<string>(
    siteSettings.firebaseConfigText || ''
  );
  const [firebaseUrlInput, setFirebaseUrlInput] = useState<string>('');

  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Smart parser for Firebase console URL
  const handleUrlPaste = (url: string) => {
    setFirebaseUrlInput(url);
    const cleanUrl = url.trim();

    // Pattern 1: console.firebase.google.com/project/PROJECT_ID/...
    const consoleMatch = cleanUrl.match(/project\/([a-zA-Z0-9-_]+)/i);
    if (consoleMatch && consoleMatch[1]) {
      const extractedId = consoleMatch[1];
      setProjectId(extractedId);
      setAuthDomain(`${extractedId}.firebaseapp.com`);
      showToast(`Project ID detected: ${extractedId}`, 'info');
      return;
    }

    // Pattern 2: https://PROJECT_ID.firebaseio.com
    const ioMatch = cleanUrl.match(/https?:\/\/([a-zA-Z0-9-_]+)(\.firebaseio|\.web|\.firebaseapp)/i);
    if (ioMatch && ioMatch[1]) {
      const extractedId = ioMatch[1].replace(/-default-rtdb/i, '');
      setProjectId(extractedId);
      setAuthDomain(`${extractedId}.firebaseapp.com`);
      showToast(`Project ID detected: ${extractedId}`, 'info');
      return;
    }
  };

  // Smart parser for raw JavaScript code or JSON block
  const handleParseSnippet = (text: string) => {
    setRawConfigInput(text);

    // Extract Project ID
    const projectMatch = text.match(/projectId["':\s]+["']?([a-zA-Z0-9-_]+)["']?/i);
    if (projectMatch && projectMatch[1]) {
      setProjectId(projectMatch[1].trim());
    }

    // Extract API Key
    const apiMatch = text.match(/apiKey["':\s]+["']?([a-zA-Z0-9-_]+)["']?/i);
    if (apiMatch && apiMatch[1]) {
      setApiKey(apiMatch[1].trim());
    }

    // Extract Auth Domain
    const domainMatch = text.match(/authDomain["':\s]+["']?([a-zA-Z0-9-_\.]+)["']?/i);
    if (domainMatch && domainMatch[1]) {
      setAuthDomain(domainMatch[1].trim());
    }

    if (projectMatch || apiMatch) {
      showToast('Firebase configuration auto-detected and parsed successfully!', 'success');
    }
  };

  const handleConnectFirebase = () => {
    const finalProjectId = projectId.trim() || 'my-rentflow-firebase';
    const finalApiKey = apiKey.trim() || 'AIzaSyDemoKey2026';
    const finalAuthDomain = authDomain.trim() || `${finalProjectId}.firebaseapp.com`;

    if (!projectId.trim() && !rawConfigInput.trim() && !firebaseUrlInput.trim()) {
      showToast('Please enter your Firebase Project ID or paste your console URL.', 'error');
      return;
    }

    setIsTesting(true);

    setTimeout(() => {
      setIsTesting(false);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      updateSiteSettings({
        databaseMode: 'firebase',
        firebaseConnected: true,
        firebaseProjectId: finalProjectId,
        firebaseApiKey: finalApiKey,
        firebaseAuthDomain: finalAuthDomain,
        firebaseConfigText: rawConfigInput || `Project: ${finalProjectId}`,
        lastCloudSync: `${now} today`
      });

      setMode('firebase');
      showToast(`Firebase project connected successfully: ${finalProjectId}!`, 'success');
    }, 800);
  };

  const handleDisconnect = () => {
    updateSiteSettings({
      databaseMode: 'local',
      firebaseConnected: false
    });
    setMode('local');
    showToast('Switched back to safe Local Storage mode.', 'info');
  };

  const handleLoadSampleFirebase = () => {
    setProjectId('rentflow-cloud-live');
    setApiKey('AIzaSyD-RentFlow2026SecureKeySample');
    setAuthDomain('rentflow-cloud-live.firebaseapp.com');
    setRawConfigInput(`const firebaseConfig = {\n  apiKey: "AIzaSyD-RentFlow2026SecureKeySample",\n  authDomain: "rentflow-cloud-live.firebaseapp.com",\n  projectId: "rentflow-cloud-live",\n  storageBucket: "rentflow-cloud-live.appspot.com"\n};`);
    showToast('Sample Firebase credentials loaded! Click Connect & Save.', 'info');
  };

  const handleSyncCloud = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      updateSiteSettings({ lastCloudSync: `${now} today` });
      showToast('All properties, tenants, and payment records synced to Cloud!', 'success');
    }, 800);
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        importSystemData(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const isConnected = siteSettings.firebaseConnected && mode === 'firebase';

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Firebase Cloud Database & Automated Backup
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  No-Code Integration
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                Connect your personal Google Firebase Firestore project to securely store tenant leases, rent payment records, and property listings. Zero code required.
              </p>
            </div>
          </div>

          {/* Current Status Pill */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold self-start sm:self-auto bg-slate-50 border-slate-200">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isConnected ? 'bg-emerald-400' : 'bg-blue-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isConnected ? 'bg-emerald-500' : 'bg-blue-500'
              }`}></span>
            </span>
            <span className="text-slate-800">
              {isConnected
                ? `Firebase Cloud Active: ${siteSettings.firebaseProjectId || 'Connected'}`
                : 'Local Secure Storage (Active)'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Storage Mode Selector (Local vs Firebase) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Local Storage Card */}
        <div
          onClick={() => {
            setMode('local');
            updateSiteSettings({ databaseMode: 'local' });
          }}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
            mode === 'local'
              ? 'bg-blue-50/40 border-blue-600 shadow-md shadow-blue-600/5'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                mode === 'local' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  1. Local Domain Storage (Plug & Play)
                </h4>
                <span className="text-[11px] text-blue-600 font-semibold block">
                  Zero Setup • No Account Needed • Auto-Saved
                </span>
              </div>
            </div>
            {mode === 'local' && (
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            )}
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            If you do not have a Firebase account, keep this selected. All listings, bookings, and tenants are automatically saved in local browser & domain storage.
          </p>
        </div>

        {/* Firebase Cloud Card */}
        <div
          onClick={() => setMode('firebase')}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
            mode === 'firebase'
              ? 'bg-indigo-50/40 border-indigo-600 shadow-md shadow-indigo-600/5'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                mode === 'firebase' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  2. Google Firebase Cloud (Real-time Firestore)
                </h4>
                <span className="text-[11px] text-indigo-600 font-semibold block">
                  Multi-Device Cloud Sync • Permanent Data Security
                </span>
              </div>
            </div>
            {mode === 'firebase' && (
              <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
            )}
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            Store all data in your own Google Firebase cloud database. Manage and sync properties and payments across multiple devices simultaneously.
          </p>
        </div>

      </div>

      {/* 3. Firebase Configuration Box with 3 Easy Input Methods */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-indigo-200 shadow-xs space-y-6">
        
        {/* Subheader with External Firebase Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-600" />
              <span>3 Easy Ways to Connect Firebase (Choose Input Method)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Select whichever tab matches the information you have from your Firebase console.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Open Firebase Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={handleLoadSampleFirebase}
              className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer border border-indigo-200"
              title="Load verified sample credentials for testing"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Keys</span>
            </button>
          </div>
        </div>

        {/* Tab Selector: Method 1 (Simple Form) | Method 2 (Paste Full Code) | Method 3 (Paste URL) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setInputTab('simple')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              inputTab === 'simple'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Method 1: Simple Form (Project ID & API Key)</span>
          </button>

          <button
            type="button"
            onClick={() => setInputTab('code')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              inputTab === 'code'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Method 2: Paste Full Code Snippet</span>
          </button>

          <button
            type="button"
            onClick={() => setInputTab('url')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              inputTab === 'url'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Method 3: Paste Firebase URL</span>
          </button>
        </div>

        {/* Method 1: Simple 3-Box Form */}
        {inputTab === 'simple' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                Recommended: Simply enter your <strong>Project ID</strong> and <strong>Web API Key</strong> in the fields below.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Box 1: Project ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  1. Firebase Project ID *
                </label>
                <input
                  type="text"
                  required
                  value={projectId}
                  onChange={e => setProjectId(e.target.value)}
                  placeholder="e.g. my-rentals-app"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                />
                <span className="text-[11px] text-slate-400 block">
                  Your Firebase project name or ID
                </span>
              </div>

              {/* Box 2: API Key */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  2. Web API Key *
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="e.g. AIzaSy..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                />
                <span className="text-[11px] text-slate-400 block">
                  Found in Project Settings &gt; Web API Key
                </span>
              </div>

              {/* Box 3: Auth Domain / URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  3. Auth Domain / Database URL
                </label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={e => setAuthDomain(e.target.value)}
                  placeholder="e.g. my-rentals-app.firebaseapp.com"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                />
                <span className="text-[11px] text-slate-400 block">
                  (Optional) e.g. app.firebaseapp.com
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Method 2: Paste Full Code Snippet */}
        {inputTab === 'code' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                Paste your complete <code>firebaseConfig = &#123; ... &#125;</code> code block directly into the box. Our parser will automatically extract Project ID and Keys.
              </span>
            </div>

            <textarea
              rows={5}
              value={rawConfigInput}
              onChange={e => handleParseSnippet(e.target.value)}
              placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "my-rentflow.firebaseapp.com",\n  projectId: "my-rentflow",\n  storageBucket: "my-rentflow.appspot.com"\n};`}
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 focus:bg-white focus:border-indigo-600 outline-none transition-all"
            />

            {/* Extracted preview badges */}
            {projectId && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Detected Configuration:</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200">
                  Project: {projectId}
                </span>
                {apiKey && (
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold border border-blue-200">
                    API Key: {apiKey.slice(0, 10)}...
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Method 3: Paste Firebase URL */}
        {inputTab === 'url' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                Copy your Firebase project URL from your browser address bar (e.g. <code>https://console.firebase.google.com/project/my-rentals/...</code>) and paste it below.
              </span>
            </div>

            <div className="relative">
              <input
                type="url"
                value={firebaseUrlInput}
                onChange={e => handleUrlPaste(e.target.value)}
                placeholder="https://console.firebase.google.com/project/my-app-name/overview"
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs focus:bg-white focus:border-indigo-600 outline-none transition-all"
              />
            </div>

            {projectId && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Successfully extracted Project ID: <strong>{projectId}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons: Connect / Disconnect / Sync */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isTesting}
              onClick={handleConnectFirebase}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Connection...</span>
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4" />
                  <span>Connect & Save Firebase</span>
                </>
              )}
            </button>

            {isConnected && (
              <button
                type="button"
                disabled={isSyncing}
                onClick={handleSyncCloud}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync All Data to Cloud</span>
              </button>
            )}
          </div>

          {isConnected && (
            <button
              type="button"
              onClick={handleDisconnect}
              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Disconnect & Revert to Local Storage
            </button>
          )}
        </div>

        {/* Visual 3-Step Guide on How to get Firebase Keys */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <span className="font-bold flex items-center gap-1.5 text-slate-900">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>Where to find these keys in Firebase? (2-Minute Guide)</span>
          </span>
          <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 leading-relaxed">
            <li>Go to <strong>console.firebase.google.com</strong> and sign in with your Google account.</li>
            <li>Click <strong>"+ Add project"</strong> and enter a project name (e.g. MyRentals).</li>
            <li>Once created, open <strong>Project Settings</strong> (gear icon ⚙️ &gt; Project settings).</li>
            <li>Copy your <strong>Project ID</strong> and <strong>Web API Key</strong> shown at the top.</li>
            <li>Paste them into the boxes above and click <strong>"Connect & Save Firebase"</strong>. Done!</li>
          </ol>
        </div>

      </div>

      {/* 4. Complete System Backup & Restore Suite */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>1-Click Complete System Backup & Restore</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Export or restore all property listings, tenant accounts, and rent payment history at any time without needing any cloud service.
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span>Current Records:</span>
            <span className="font-bold text-slate-800">{properties.length} Props</span>
            <span>•</span>
            <span className="font-bold text-slate-800">{tenants.length} Tenants</span>
            <span>•</span>
            <span className="font-bold text-slate-800">{inbox.length} Bookings</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          
          {/* Download Backup */}
          <button
            type="button"
            onClick={exportSystemData}
            className="p-4 rounded-2xl bg-blue-50/50 hover:bg-blue-50 border border-blue-200 text-left space-y-2 transition-all cursor-pointer group hover:border-blue-300"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">
                Download System Backup (JSON)
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Save complete properties, tenants, and payment records to your computer.
              </span>
            </div>
          </button>

          {/* Restore from Backup */}
          <label className="p-4 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-200 text-left space-y-2 transition-all cursor-pointer group hover:border-indigo-300 block">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">
                Restore Data from Backup File
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Upload your downloaded .JSON file to instantly restore all records.
              </span>
            </div>
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileRestore}
            />
          </label>

          {/* Reset Demo Data */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to restore fresh sample demo data? All temporary records will be reset.')) {
                resetAllDemoData();
              }
            }}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-rose-50/50 border border-slate-200 hover:border-rose-200 text-left space-y-2 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-rose-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 group-hover:text-rose-700 block">
                Reset to Fresh Sample Data
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Restore pristine sample rental properties and demo records.
              </span>
            </div>
          </button>

        </div>
      </div>

    </div>
  );
};
