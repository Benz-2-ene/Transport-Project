'use client';

import { useEffect, useState } from 'react';
import { LoaderCircle, ShieldCheck, X } from 'lucide-react';
import { supabase } from '../lib/supabase-browser';

export function AuthDialog({ open, onClose, onAuthenticated }: { open: boolean; onClose: () => void; onAuthenticated: (name: string) => void }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (!open) setMessage(''); }, [open]);
  if (!open) return null;

  async function continueWithGoogle() {
    if (!supabase) { setMessage('Google sign-in needs Supabase settings in .env.local.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { setMessage(error.message); setLoading(false); }
  }
  useEffect(() => {
    if (!open || !supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) { onAuthenticated(data.user.user_metadata.full_name || data.user.email || 'Rider'); onClose(); }
    });
  }, [open, onAuthenticated, onClose]);

  return <div className="auth-backdrop" role="dialog" aria-modal="true" aria-labelledby="auth-title"><section className="auth-dialog"><button className="dialog-close" aria-label="Close" onClick={onClose}><X size={20}/></button><span className="auth-mark">Q</span><p className="eyebrow">WELCOME TO Q-RIDE</p><h2 id="auth-title">Your next ride starts here.</h2><p>Continue with Google to create your account or return securely on this device.</p><button className="google-button" onClick={continueWithGoogle} disabled={loading}>{loading ? <LoaderCircle className="spin"/> : <span className="google-g">G</span>} Continue with Google</button><div className="auth-note"><ShieldCheck size={17}/><span>Your session stays securely signed in on this device. A new phone or browser needs a fresh Google sign-in.</span></div>{message && <p className="auth-error">{message}</p>}</section></div>;
}
