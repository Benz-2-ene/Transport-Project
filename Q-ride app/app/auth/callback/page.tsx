'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase-browser';

export default function AuthCallback() {
  const [message, setMessage] = useState('Completing your secure sign-in…');
  useEffect(() => { const code = new URLSearchParams(window.location.search).get('code'); if (!supabase || !code) { setMessage('Sign-in could not be completed. Please return and try again.'); return; } supabase.auth.exchangeCodeForSession(code).then(({ error }) => error ? setMessage('Sign-in could not be completed. Please return and try again.') : window.location.replace('/')); }, []);
  return <main className="auth-callback"><span className="auth-mark">Q</span><p>{message}</p></main>;
}
