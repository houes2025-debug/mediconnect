import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
const API_URL = 'https://mediconnect-0gxf.onrender.com/api'  // Changez le port si nécessaire (ex: 8080)

export default function ChangePassword({ onSuccess }) {
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage({ text: '', type: '' });
  };

  const toggleShow = (field) => {
    setShow({ ...show, [field]: !show[field] });
  };

  const validate = () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      return 'Tous les champs sont obligatoires.';
    }
    if (form.newPassword.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères.';
    }
    if (form.newPassword !== form.confirmPassword) {
      return 'Les mots de passe ne correspondent pas.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setMessage({ text: error, type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://shakespeare-termination-disposal-anonymous.trycloudflare.com/api/auth/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // ou ton token
        },
        body: JSON.stringify({
          old_password: form.oldPassword,
          new_password: form.newPassword,
          new_password_confirm: form.confirmPassword,
        }),
      });
      const data = await response.json();
console.log(data);
      if (!response.ok) {
        throw new Error(data.error || 'Erreur inconnue');
      }

      setMessage({ text: data.message || 'Mot de passe changé avec succès', type: 'success' });
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      onSuccess?.(); // callback parent (fermer, rafraîchir, etc.)
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 flex items-center">
        <Lock className="w-5 h-5 mr-2 text-blue-600" />
        Changer le mot de passe
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ancien mot de passe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ancien mot de passe</label>
          <div className="relative">
            <input
              type={show.old ? 'text' : 'password'}
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <button
              type="button"
              onClick={() => toggleShow('old')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {show.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Nouveau mot de passe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
          <div className="relative">
            <input
              type={show.new ? 'text' : 'password'}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <button
              type="button"
              onClick={() => toggleShow('new')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {show.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirmation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
          <div className="relative">
            <input
              type={show.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <button
              type="button"
              onClick={() => toggleShow('confirm')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Bouton submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg py-3 font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              <span>Changement...</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>Changer le mot de passe</span>
            </>
          )}
        </button>

        {/* Message */}
        {message.text && (
          <div className={`text-sm p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}