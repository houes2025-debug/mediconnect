import React, { useState, useEffect, useCallback } from 'react'
import { Bell, Download, MessageCircle, FileText, User, Send, Home, LogOut, Eye, EyeOff, Lock, Mail, RefreshCw, Upload, Users, BarChart3, Settings, X, ShieldCheck, Activity, ChevronRight, Stethoscope } from 'lucide-react'
import ChangePassword from './components/ChangePassword'
const API_URL = 'https://mediconnect-0gxf.onrender.com/api'  // Changez le port si nécessaire (ex: 8080)

/* ============================================================
   DESIGN SYSTEM — ErraziLab
   Palette: clinique, sobre, rassurante.
   - ink       #10241F  (texte principal)
   - ink-soft  #5C6F6C  (texte secondaire)
   - app bg    #F4F7F6
   - surface   #FFFFFF
   - primary   #0E7C66  (teal médical — actions, médecin)
   - primary-d #0A5C4C
   - primary-s #E4F3EF
   - patient   #2D6CDF  (bleu clinique)
   - patient-s #E8EFFD
   - admin     #6D4AFF  (violet — autorité système)
   - admin-s   #EFEAFF
   - amber     #F2A93B  (nouveauté / attention douce)
   - amber-s   #FDF1DD
   - danger    #E0473F
   - danger-s  #FBEAE9
   - border    #E3EAE8
   Display font: 'Space Grotesk' — Body font: 'Inter'
   Signature: le tracé "battement" (pulse line) qui traverse les bannières.

   ⚠️ IMPORTANT (fix perte de focus) : tous les composants de vue et
   de modale sont déclarés ICI, en dehors de App(). Si on les
   déclare à l'intérieur de App(), chaque re-render (ex: chaque
   frappe clavier) recrée la fonction du composant → React le
   traite comme un nouveau type de composant → démontage/remontage
   → l'input perd le focus. En les gardant au niveau module et en
   leur passant l'état/les handlers via props, leur identité reste
   stable entre les renders et le focus est conservé.
   ============================================================ */

const displayFont = { fontFamily: "'Space Grotesk', 'Inter', sans-serif" }

const PulseLine = ({ className = '', opacity = 0.35 }) => (
  <svg
    viewBox="0 0 300 40"
    preserveAspectRatio="none"
    className={className}
    style={{ opacity }}
  >
    <path
      d="M0 22 H90 L100 8 L112 34 L124 4 L134 28 L144 22 H300"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ModalHeader = ({ icon: Icon, iconBg = 'bg-[#E4F3EF]', iconColor = 'text-[#0E7C66]', title, onClose }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className={`rounded-xl p-2.5 ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      )}
      <h2 className="text-xl font-bold text-[#10241F]" style={displayFont}>{title}</h2>
    </div>
    <button onClick={onClose} className="text-[#8B9997] hover:text-[#10241F] hover:bg-[#F4F7F6] rounded-full p-1.5 transition-colors">
      <X className="w-5 h-5" />
    </button>
  </div>
)

/* ---------------------------------------------------------
   VUES — uniquement présentation. Aucune fonction/handler
   n'est modifié : mêmes props, mêmes onClick/onChange,
   mêmes conditions. Seul l'habillage visuel change.
--------------------------------------------------------- */

const PatientHomeView = ({ user, results, messages, newResultsCount, loadResults, handleLogout, formatDate, setShowChangePasswordModal }) => (
  <div className="space-y-6">
    <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lg shadow-[#2D6CDF]/20 bg-gradient-to-br from-[#2D6CDF] to-[#1B4FB0]">
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white/15 border border-white/20 rounded-2xl p-3 backdrop-blur-sm">
            <User className="w-7 h-7" />
          </div>
          <div>
            <p className="text-white/70 text-xs font-semibold tracking-wide uppercase">Espace patient</p>
            <h2 className="text-2xl font-bold" style={displayFont}>Bonjour, {user?.first_name || user?.username}</h2>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setShowChangePasswordModal(true)} title="Changer mon mot de passe" className="bg-white/15 hover:bg-white/25 border border-white/20 rounded-full p-2.5 transition-colors">
            <Lock className="w-5 h-5" />
          </button>
          <button onClick={handleLogout} className="bg-white/15 hover:bg-white/25 border border-white/20 rounded-full p-2.5 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
      <PulseLine className="absolute bottom-0 left-0 w-full h-10 text-white" opacity={0.25} />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E3EAE8]">
        <div className="bg-[#E4F3EF] rounded-xl w-11 h-11 flex items-center justify-center mb-3">
          <FileText className="w-5 h-5 text-[#0E7C66]" />
        </div>
        <h3 className="text-2xl font-bold text-[#10241F]" style={displayFont}>{results.length}</h3>
        <p className="text-sm text-[#5C6F6C]">Résultats</p>
        {newResultsCount > 0 && (
          <span className="inline-block mt-2 bg-[#FDF1DD] text-[#B5720B] text-xs font-semibold px-2.5 py-1 rounded-full">
            {newResultsCount} nouveau(x)
          </span>
        )}
      </div>
      
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E3EAE8]">
        <div className="bg-[#E8EFFD] rounded-xl w-11 h-11 flex items-center justify-center mb-3">
          <MessageCircle className="w-5 h-5 text-[#2D6CDF]" />
        </div>
        <h3 className="text-2xl font-bold text-[#10241F]" style={displayFont}>{messages.length}</h3>
        <p className="text-sm text-[#5C6F6C]">Messages</p>
      </div>
    </div>

    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-[#10241F]" style={displayFont}>Résultats récents</h3>
        <button onClick={loadResults} className="text-[#2D6CDF] hover:text-[#1B4FB0] transition-colors">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      {results.length === 0 ? (
        <div className="text-center py-10 text-[#5C6F6C] bg-white rounded-2xl border border-dashed border-[#E3EAE8]">
          <FileText className="w-10 h-10 mx-auto mb-2 text-[#C7D3D1]" />
          Aucun résultat disponible
        </div>
      ) : (
        <div className="space-y-3">
          {results.slice(0, 3).map(result => (
            <div key={result.id} className="bg-white rounded-2xl p-4 shadow-sm border border-[#E3EAE8] hover:border-[#2D6CDF]/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#E8EFFD] rounded-xl p-2.5">
                    <FileText className="w-5 h-5 text-[#2D6CDF]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#10241F]">{result.title}</h4>
                    <p className="text-sm text-[#5C6F6C]">
                      {result.date_examination ? formatDate(result.date_examination) : 'Date inconnue'}
                    </p>
                  </div>
                </div>
                {result.status === 'new' && (
                  <span className="bg-[#E0473F] text-white text-xs font-semibold px-2.5 py-1 rounded-full">Nouveau</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)

const DoctorHomeView = ({ user, patients, results, handleLogout, setShowUploadModal, setShowAddPatientModal, formatDate, setShowChangePasswordModal }) => (
  <div className="space-y-6">
    <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lg shadow-[#0E7C66]/20 bg-gradient-to-br from-[#0E7C66] to-[#0A5C4C]">
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white/15 border border-white/20 rounded-2xl p-3 backdrop-blur-sm">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <p className="text-white/70 text-xs font-semibold tracking-wide uppercase">Espace médecin</p>
            <h2 className="text-2xl font-bold" style={displayFont}>Dr. {user?.last_name || user?.username}</h2>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setShowChangePasswordModal(true)} title="Changer mon mot de passe" className="bg-white/15 hover:bg-white/25 border border-white/20 rounded-full p-2.5 transition-colors">
            <Lock className="w-5 h-5" />
          </button>
          <button onClick={handleLogout} className="bg-white/15 hover:bg-white/25 border border-white/20 rounded-full p-2.5 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
      <PulseLine className="absolute bottom-0 left-0 w-full h-10 text-white" opacity={0.25} />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E3EAE8]">
        <div className="bg-[#EFEAFF] rounded-xl w-11 h-11 flex items-center justify-center mb-3">
          <Users className="w-5 h-5 text-[#6D4AFF]" />
        </div>
        <h3 className="text-2xl font-bold text-[#10241F]" style={displayFont}>{patients.length}</h3>
        <p className="text-sm text-[#5C6F6C]">Patients</p>
      </div>
      
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E3EAE8]">
        <div className="bg-[#E4F3EF] rounded-xl w-11 h-11 flex items-center justify-center mb-3">
          <FileText className="w-5 h-5 text-[#0E7C66]" />
        </div>
        <h3 className="text-2xl font-bold text-[#10241F]" style={displayFont}>{results.length}</h3>
        <p className="text-sm text-[#5C6F6C]">Résultats envoyés</p>
      </div>
    </div>

    <button
      onClick={() => setShowUploadModal(true)}
      className="w-full bg-[#0E7C66] hover:bg-[#0A5C4C] text-white rounded-2xl py-4 flex items-center justify-center space-x-2 font-semibold transition-colors shadow-md shadow-[#0E7C66]/20"
    >
      <Upload className="w-5 h-5" />
      <span>Uploader un nouveau résultat</span>
    </button>

    <button
      onClick={() => setShowAddPatientModal(true)}
      className="w-full bg-white hover:bg-[#F4F7F6] text-[#10241F] border border-[#E3EAE8] rounded-2xl py-4 flex items-center justify-center space-x-2 font-semibold transition-colors"
    >
      <User className="w-5 h-5 text-[#2D6CDF]" />
      <span>Ajouter un nouveau patient</span>
    </button>

    <div>
      <h3 className="text-lg font-bold text-[#10241F] mb-3" style={displayFont}>Résultats récents</h3>
      {results.length === 0 ? (
        <div className="text-center py-10 text-[#5C6F6C] bg-white rounded-2xl border border-dashed border-[#E3EAE8]">
          Aucun résultat envoyé
        </div>
      ) : (
        <div className="space-y-3">
          {results.slice(0, 5).map(result => (
            <div key={result.id} className="bg-white rounded-2xl p-4 shadow-sm border border-[#E3EAE8]">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-[#10241F]">{result.title}</h4>
                  <p className="text-sm text-[#5C6F6C]">Patient: {result.patient_name || 'Non spécifié'}</p>
                  <p className="text-xs text-[#8B9997]">
                    {result.date_examination ? formatDate(result.date_examination) : 'Date inconnue'}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  result.status === 'new' ? 'bg-[#FBEAE9] text-[#E0473F]' : 'bg-[#E4F3EF] text-[#0E7C66]'
                }`}>
                  {result.status === 'new' ? 'Non vu' : 'Consulté'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)

const AdminHomeView = ({ results, handleLogout, setShowAddPatientModal, loadAllUsers, setShowUsersModal, loadGroups, setShowGroupsModal, setShowStatsModal, setShowConfigModal, setShowChangePasswordModal }) => (
  <div className="space-y-6">
    <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lg shadow-[#6D4AFF]/20 bg-gradient-to-br from-[#6D4AFF] to-[#4B2FCF]">
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white/15 border border-white/20 rounded-2xl p-3 backdrop-blur-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <p className="text-white/70 text-xs font-semibold tracking-wide uppercase">Administration</p>
            <h2 className="text-2xl font-bold" style={displayFont}>Tableau de bord</h2>
          </div>
        </div>
        <div className="flex items-center space-x-2">
        <button onClick={() => setShowChangePasswordModal(true)} title="Changer mon mot de passe" className="bg-white/15 hover:bg-white/25 border border-white/20 rounded-full p-2.5 transition-colors">
          <Lock className="w-5 h-5" />
        </button>
        <button onClick={handleLogout} className="bg-white/15 hover:bg-white/25 border border-white/20 rounded-full p-2.5 transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
        </div>
      </div>
      <PulseLine className="absolute bottom-0 left-0 w-full h-10 text-white" opacity={0.25} />
    </div>

    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E3EAE8]">
        <div className="bg-[#E8EFFD] rounded-xl w-11 h-11 flex items-center justify-center mb-3">
          <Users className="w-5 h-5 text-[#2D6CDF]" />
        </div>
        <h3 className="text-2xl font-bold text-[#10241F]" style={displayFont}>125</h3>
        <p className="text-sm text-[#5C6F6C]">Utilisateurs</p>
      </div>
      
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E3EAE8]">
        <div className="bg-[#E4F3EF] rounded-xl w-11 h-11 flex items-center justify-center mb-3">
          <FileText className="w-5 h-5 text-[#0E7C66]" />
        </div>
        <h3 className="text-2xl font-bold text-[#10241F]" style={displayFont}>{results.length}</h3>
        <p className="text-sm text-[#5C6F6C]">Résultats</p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E3EAE8]">
        <div className="bg-[#EFEAFF] rounded-xl w-11 h-11 flex items-center justify-center mb-3">
          <BarChart3 className="w-5 h-5 text-[#6D4AFF]" />
        </div>
        <h3 className="text-2xl font-bold text-[#10241F]" style={displayFont}>89%</h3>
        <p className="text-sm text-[#5C6F6C]">Activité</p>
      </div>
    </div>

    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E3EAE8]">
      <h3 className="text-lg font-bold text-[#10241F] mb-4" style={displayFont}>Actions rapides</h3>
      <div className="space-y-2">
      <button
      onClick={() => setShowAddPatientModal(true)}
      className="w-full bg-[#2D6CDF] hover:bg-[#1B4FB0] text-white rounded-xl py-3.5 flex items-center justify-center space-x-2 font-semibold transition-colors shadow-sm mb-1"
    >
      <User className="w-5 h-5" />
      <span>Ajouter un nouveau patient</span>
    </button>
        <button 
          onClick={() => {
            loadAllUsers()
            setShowUsersModal(true)
          }}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#F4F7F6] hover:bg-[#E8EFFD] rounded-xl text-[#10241F] font-medium transition-colors group"
        >
          <span className="flex items-center gap-2"><Users className="w-4 h-4 text-[#2D6CDF]" /> Gérer les utilisateurs</span>
          <ChevronRight className="w-4 h-4 text-[#8B9997] group-hover:translate-x-0.5 transition-transform" />
        </button>
        <button 
          onClick={() => {
            loadAllUsers()
            loadGroups()
            setShowGroupsModal(true)
          }}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#F4F7F6] hover:bg-[#E4F3EF] rounded-xl text-[#10241F] font-medium transition-colors group"
        >
          <span className="flex items-center gap-2"><Stethoscope className="w-4 h-4 text-[#0E7C66]" /> Gérer les groupes médicaux</span>
          <ChevronRight className="w-4 h-4 text-[#8B9997] group-hover:translate-x-0.5 transition-transform" />
        </button>
        <button 
          onClick={() => setShowStatsModal(true)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#F4F7F6] hover:bg-[#FDF1DD] rounded-xl text-[#10241F] font-medium transition-colors group"
        >
          <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-[#B5720B]" /> Voir les statistiques</span>
          <ChevronRight className="w-4 h-4 text-[#8B9997] group-hover:translate-x-0.5 transition-transform" />
        </button>
        <button 
          onClick={() => setShowConfigModal(true)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#F4F7F6] hover:bg-[#EFEAFF] rounded-xl text-[#10241F] font-medium transition-colors group"
        >
          <span className="flex items-center gap-2"><Settings className="w-4 h-4 text-[#6D4AFF]" /> Configuration système</span>
          <ChevronRight className="w-4 h-4 text-[#8B9997] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>

    <div className="bg-[#FDF1DD] border border-[#F2A93B]/30 rounded-2xl p-5">
      <div className="flex items-start space-x-3">
        <div className="bg-[#F2A93B] rounded-full p-2 shrink-0">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-[#7A4F0C] mb-1">Alertes système</h4>
          <p className="text-sm text-[#8A6420]">3 nouveaux utilisateurs en attente de validation</p>
        </div>
      </div>
    </div>
  </div>
)

const ResultsView = ({ user, results, loadingData, loadResults, formatDate, handleDownloadResult }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-[#10241F]" style={displayFont}>
        {user?.role === 'patient' ? 'Mes résultats' : 'Résultats des patients'}
      </h2>
      <button onClick={loadResults} className="text-[#2D6CDF] hover:text-[#1B4FB0] transition-colors">
        <RefreshCw className="w-5 h-5" />
      </button>
    </div>
    
    {loadingData ? (
      <div className="text-center py-8 text-[#5C6F6C]">Chargement...</div>
    ) : results.length === 0 ? (
      <div className="text-center py-14 text-[#5C6F6C] bg-white rounded-2xl border border-dashed border-[#E3EAE8]">
        <FileText className="w-14 h-14 mx-auto mb-4 text-[#C7D3D1]" />
        <p>Aucun résultat disponible</p>
      </div>
    ) : (
      results.map(result => (
        <div key={result.id} className="bg-white rounded-2xl p-5 shadow-sm border border-[#E3EAE8]">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`rounded-xl p-3 ${result.status === 'new' ? 'bg-[#2D6CDF]' : 'bg-[#F4F7F6]'}`}>
                <FileText className={`w-6 h-6 ${result.status === 'new' ? 'text-white' : 'text-[#5C6F6C]'}`} />
              </div>
              <div>
                <h3 className="font-bold text-[#10241F]">{result.title}</h3>
                <p className="text-sm text-[#5C6F6C]">{result.doctor_name || 'Médecin'}</p>
                {user?.role !== 'patient' && result.patient_name && (
                  <p className="text-sm text-[#5C6F6C]">Patient: {result.patient_name}</p>
                )}
                <p className="text-xs text-[#8B9997] mt-1">
                  {result.date_examination ? formatDate(result.date_examination) : 'Date inconnue'}
                </p>
                {result.hospital && (
                  <p className="text-xs text-[#8B9997]">{result.hospital}</p>
                )}
              </div>
            </div>
            {result.status === 'new' && (
              <span className="bg-[#E0473F] text-white text-xs px-3 py-1 rounded-full font-semibold">Nouveau</span>
            )}
          </div>
          {result.description && (
            <p className="text-sm text-[#4A5A58] mb-3 bg-[#F4F7F6] p-3 rounded-xl">{result.description}</p>
          )}
          <button
            onClick={() => handleDownloadResult(result)}
            className="w-full bg-[#2D6CDF] hover:bg-[#1B4FB0] text-white rounded-xl py-3 flex items-center justify-center space-x-2 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span className="font-medium">Télécharger le résultat</span>
          </button>
        </div>
      ))
    )}
  </div>
)

const NotificationsView = ({ notifications, loadingData, loadNotifications, markNotificationRead, formatDate }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-[#10241F]" style={displayFont}>Notifications</h2>
      <button onClick={loadNotifications} className="text-[#2D6CDF] hover:text-[#1B4FB0] transition-colors">
        <RefreshCw className="w-5 h-5" />
      </button>
    </div>
    
    {loadingData ? (
      <div className="text-center py-8 text-[#5C6F6C]">Chargement...</div>
    ) : notifications.length === 0 ? (
      <div className="text-center py-14 text-[#5C6F6C] bg-white rounded-2xl border border-dashed border-[#E3EAE8]">
        <Bell className="w-14 h-14 mx-auto mb-4 text-[#C7D3D1]" />
        <p>Aucune notification</p>
      </div>
    ) : (
      notifications.map(notif => (
        <div
          key={notif.id}
          onClick={() => !notif.read && markNotificationRead(notif.id)}
          className={`rounded-2xl p-4 border cursor-pointer transition-all ${
            notif.read ? 'bg-white border-[#E3EAE8]' : 'bg-[#E8EFFD] border-[#2D6CDF]/25'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className={`rounded-full p-2 ${notif.read ? 'bg-[#F4F7F6]' : 'bg-[#2D6CDF]'}`}>
                <Bell className={`w-4 h-4 ${notif.read ? 'text-[#5C6F6C]' : 'text-white'}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#10241F]">{notif.title}</h3>
                <p className="text-sm text-[#5C6F6C] mt-1">{notif.message}</p>
                <p className="text-xs text-[#8B9997] mt-2">
                  {notif.time_ago || (notif.created_at ? formatDate(notif.created_at) : 'Date inconnue')}
                </p>
              </div>
            </div>
            {!notif.read && (
              <div className="w-2 h-2 bg-[#2D6CDF] rounded-full mt-1.5"></div>
            )}
          </div>
        </div>
      ))
    )}
  </div>
)

// ========== VUE CHAT ==========
const ChatView = ({ groups, user, selectedGroup, setSelectedGroup, loadAllUsers, loadGroups, setShowCreateGroupModal, messages, loadMessages, newMessage, setNewMessage, sendMessage, formatTime }) => {
  // Charger les groupes de l'utilisateur
  const userGroups = groups.filter(g => {
    if (user?.role === 'admin') return true
    if (user?.role === 'doctor') return g.doctors?.some(d => d.id === user.id)
    if (user?.role === 'patient') return g.patients?.some(p => p.id === user.id)
    return false
  })

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {!selectedGroup ? (
        // Liste des groupes disponibles
        <div className="flex-1 overflow-y-auto p-1 space-y-3">
          <h2 className="text-2xl font-bold text-[#10241F] mb-4" style={displayFont}>Mes groupes</h2>
          
          {user?.role === 'admin' && (
            <button
              onClick={() => {
                loadAllUsers()
                loadGroups()
                setShowCreateGroupModal(true)
              }}
              className="w-full bg-gradient-to-r from-[#0E7C66] to-[#2D6CDF] hover:opacity-90 text-white rounded-2xl py-4 flex items-center justify-center space-x-2 font-semibold transition-all shadow-md mb-4"
            >
              <Users className="w-5 h-5" />
              <span>Créer un nouveau groupe</span>
            </button>
          )}

          {userGroups.length === 0 ? (
            <div className="text-center py-14 text-[#5C6F6C] bg-white rounded-2xl border border-dashed border-[#E3EAE8]">
              <MessageCircle className="w-14 h-14 mx-auto mb-4 text-[#C7D3D1]" />
              <p>Aucun groupe disponible</p>
              {user?.role !== 'admin' && (
                <p className="text-sm mt-2">Demandez à votre administrateur de vous ajouter à un groupe</p>
              )}
            </div>
          ) : (
            userGroups.map(group => (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-[#E3EAE8] cursor-pointer hover:border-[#0E7C66]/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#E4F3EF] rounded-full p-3">
                      <Users className="w-6 h-6 text-[#0E7C66]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#10241F]">{group.name}</h3>
                      <p className="text-sm text-[#5C6F6C]">{group.description}</p>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-[#8B9997]">
                        <span>👨‍⚕️ {group.doctors?.length || 0}</span>
                        <span>👤 {group.patients?.length || 0}</span>
                        <span>💬 {group.message_count || 0}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#0E7C66]" />
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        // Chat du groupe sélectionné
        <>
          <div className="bg-white rounded-t-2xl p-4 border border-b-0 border-[#E3EAE8]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="text-[#8B9997] hover:text-[#10241F] transition-colors"
                >
                  ← Retour
                </button>
                <div className="bg-[#E4F3EF] rounded-full p-2">
                  <Users className="w-5 h-5 text-[#0E7C66]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#10241F]">{selectedGroup.name}</h3>
                  <p className="text-xs text-[#5C6F6C]">
                    {selectedGroup.doctors?.length || 0} médecin(s) · {selectedGroup.patients?.length || 0} patient(s)
                  </p>
                </div>
              </div>
              <button onClick={loadMessages} className="text-[#2D6CDF] hover:text-[#1B4FB0]">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F4F7F6] border-x border-[#E3EAE8]">
            {messages.map(msg => {
              const isMine = msg.sender_id === user?.id || 
                            (user?.role === 'patient' && msg.sender === 'patient') || 
                            (user?.role !== 'patient' && msg.sender === 'doctor')
              
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-3 rounded-2xl shadow-sm ${
                    isMine ? 'bg-[#0E7C66] text-white rounded-br-md' : 'bg-white text-[#10241F] rounded-bl-md border border-[#E3EAE8]'
                  }`}>
                    {!isMine && msg.sender_name && (
                      <p className="text-xs font-semibold mb-1 text-[#0E7C66]">{msg.sender_name}</p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMine ? 'text-white/70' : 'text-[#8B9997]'}`}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-white rounded-b-2xl p-4 border border-t-0 border-[#E3EAE8]">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Écrivez votre message..."
                className="flex-1 px-4 py-3 bg-[#F4F7F6] border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/40 focus:border-[#0E7C66]/30"
              />
              <button
                onClick={sendMessage}
                className="bg-[#0E7C66] hover:bg-[#0A5C4C] text-white rounded-full p-3 transition-colors shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ---------------------------------------------------------
   MODALS
--------------------------------------------------------- */

const UploadModal = ({ uploadForm, setUploadForm, patients, handleUploadResult, setShowUploadModal }) => (
  <div className="fixed inset-0 bg-[#10241F]/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <ModalHeader icon={Upload} title="Uploader un résultat" onClose={() => setShowUploadModal(false)} />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#4A5A58] mb-2">Patient</label>
          <select
            value={uploadForm.patient_id}
            onChange={(e) => setUploadForm({...uploadForm, patient_id: e.target.value})}
            className="w-full px-4 py-2.5 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 focus:border-[#0E7C66]"
          >
            <option value="">Sélectionner un patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.first_name} {patient.last_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4A5A58] mb-2">Titre</label>
          <input
            type="text"
            value={uploadForm.title}
            onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
            placeholder=""
            className="w-full px-4 py-2.5 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 focus:border-[#0E7C66]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4A5A58] mb-2">Type</label>
          <select
            value={uploadForm.type}
            onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
            className="w-full px-4 py-2.5 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 focus:border-[#0E7C66]"
          >
            <option value="blood_test">Analyse de sang</option>
            <option value="xray">Groupage</option>
            
            <option value="other">Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4A5A58] mb-2">Laboratoire</label>
          <input
            type="text"
            value='Errazi Lab'
            onChange={(e) => setUploadForm({...uploadForm, hospital: e.target.value})}
            placeholder="Ex: CHU Blida"
            className="w-full px-4 py-2.5 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 focus:border-[#0E7C66]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4A5A58] mb-2">Description</label>
          <textarea
            value=''
            onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
            placeholder="Détails supplémentaires..."
            rows={3}
            className="w-full px-4 py-2.5 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 focus:border-[#0E7C66]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4A5A58] mb-2">Fichier PDF</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
            className="w-full px-4 py-2.5 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#E4F3EF] file:text-[#0E7C66] file:font-medium"
          />
          {uploadForm.file && (
            <p className="text-sm text-[#0E7C66] mt-2">✓ {uploadForm.file.name}</p>
          )}
        </div>

        <button
          onClick={handleUploadResult}
          disabled={!uploadForm.patient_id || !uploadForm.title}
          className="w-full bg-[#0E7C66] hover:bg-[#0A5C4C] disabled:bg-[#C7D3D1] text-white rounded-xl py-3 font-semibold transition-colors"
        >
          Uploader
        </button>
      </div>
    </div>
  </div>
)

// Modal de gestion des groupes
const GroupsModal = ({ groups, setShowGroupsModal, setShowCreateGroupModal, setSelectedGroup, setView, deleteGroup, formatDate }) => (
  <div className="fixed inset-0 bg-[#10241F]/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <ModalHeader icon={Stethoscope} title="Gestion des groupes médicaux" onClose={() => setShowGroupsModal(false)} />

      <button
        onClick={() => {
          setShowCreateGroupModal(true)
          setShowGroupsModal(false)
        }}
        className="w-full bg-gradient-to-r from-[#0E7C66] to-[#2D6CDF] hover:opacity-90 text-white rounded-2xl py-3 font-semibold transition-all shadow-md mb-6 flex items-center justify-center space-x-2"
      >
        <Users className="w-5 h-5" />
        <span>Créer un nouveau groupe</span>
      </button>

      <div className="space-y-4">
        {groups.map(group => (
          <div key={group.id} className="bg-[#F4F7F6] rounded-2xl p-5 border border-[#E3EAE8]">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#10241F] mb-1" style={displayFont}>{group.name}</h3>
                <p className="text-sm text-[#5C6F6C] mb-3">{group.description}</p>
                <div className="flex items-center space-x-4 text-xs text-[#8B9997]">
                  <span>📅 {formatDate(group.created_at)}</span>
                  <span>💬 {group.message_count || 0} messages</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedGroup(group)
                    setView('chat')
                    setShowGroupsModal(false)
                  }}
                  className="px-4 py-2 bg-[#2D6CDF] hover:bg-[#1B4FB0] text-white rounded-xl font-medium transition-colors"
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => deleteGroup(group.id)}
                  className="px-4 py-2 bg-[#FBEAE9] hover:bg-[#F6D5D3] text-[#E0473F] rounded-xl font-medium transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-3 border border-[#E3EAE8]">
                <h4 className="text-xs font-semibold text-[#8B9997] mb-2">👨‍⚕️ MÉDECINS ({group.doctors?.length || 0})</h4>
                <div className="space-y-1">
                  {group.doctors?.map(doctor => (
                    <div key={doctor.id} className="text-sm text-[#4A5A58]">
                      • {doctor.first_name} {doctor.last_name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-[#E3EAE8]">
                <h4 className="text-xs font-semibold text-[#8B9997] mb-2">👤 PATIENTS ({group.patients?.length || 0})</h4>
                <div className="space-y-1">
                  {group.patients?.map(patient => (
                    <div key={patient.id} className="text-sm text-[#4A5A58]">
                      • {patient.first_name} {patient.last_name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-[#E3EAE8]">
                <h4 className="text-xs font-semibold text-[#8B9997] mb-2">🔑 ADMINS ({group.admins?.length || 0})</h4>
                <div className="space-y-1">
                  {group.admins?.map(admin => (
                    <div key={admin.id} className="text-sm text-[#4A5A58]">
                      • {admin.first_name} {admin.last_name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-14 text-[#5C6F6C]">
          <Users className="w-14 h-14 mx-auto mb-4 text-[#C7D3D1]" />
          <p>Aucun groupe créé</p>
          <p className="text-sm mt-2">Créez un groupe pour faciliter la communication entre médecins et patients</p>
        </div>
      )}
    </div>
  </div>
)

// Modal de création de groupe
const CreateGroupModal = ({ groupForm, setGroupForm, allUsers, user, toggleUserInGroup, createGroup, setShowCreateGroupModal, setShowGroupsModal }) => (
  <div className="fixed inset-0 bg-[#10241F]/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <ModalHeader icon={Users} title="Créer un groupe médical" onClose={() => {
        setShowCreateGroupModal(false)
        setShowGroupsModal(true)
      }} />

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#4A5A58] mb-2">Nom du groupe *</label>
          <input
            type="text"
            value={groupForm.name}
            onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
            placeholder="Ex: Équipe Cardiologie"
            className="w-full px-4 py-3 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 focus:border-[#0E7C66]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4A5A58] mb-2">Description</label>
          <textarea
            value={groupForm.description}
            onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
            placeholder="Description du groupe..."
            rows={2}
            className="w-full px-4 py-3 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 focus:border-[#0E7C66]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#E4F3EF] rounded-2xl p-4 border border-[#0E7C66]/20">
            <h3 className="font-bold text-[#0A5C4C] mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Sélectionner les médecins * ({groupForm.doctors.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {allUsers.filter(u => u.role === 'doctor').map(doctor => (
                <label key={doctor.id} className="flex items-center space-x-2 p-2 bg-white rounded-lg cursor-pointer hover:bg-[#DDEFE9] border border-transparent hover:border-[#0E7C66]/20 transition-colors">
                  <input
                    type="checkbox"
                    checked={groupForm.doctors.includes(doctor.id)}
                    onChange={() => toggleUserInGroup(doctor.id, 'doctors')}
                    className="rounded text-[#0E7C66]"
                  />
                  <span className="text-sm text-[#4A5A58]">
                    Dr. {doctor.first_name} {doctor.last_name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-[#E8EFFD] rounded-2xl p-4 border border-[#2D6CDF]/20">
            <h3 className="font-bold text-[#1B4FB0] mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Sélectionner les patients * ({groupForm.patients.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {allUsers.filter(u => u.role === 'patient').map(patient => (
                <label key={patient.id} className="flex items-center space-x-2 p-2 bg-white rounded-lg cursor-pointer hover:bg-[#DCE7FB] border border-transparent hover:border-[#2D6CDF]/20 transition-colors">
                  <input
                    type="checkbox"
                    checked={groupForm.patients.includes(patient.id)}
                    onChange={() => toggleUserInGroup(patient.id, 'patients')}
                    className="rounded text-[#2D6CDF]"
                  />
                  <span className="text-sm text-[#4A5A58]">
                    {patient.first_name} {patient.last_name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#EFEAFF] rounded-2xl p-4 border border-[#6D4AFF]/20">
          <h3 className="font-bold text-[#4B2FCF] mb-3 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Ajouter des co-administrateurs (optionnel) ({groupForm.admin_ids.length})
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {allUsers.filter(u => u.role === 'admin' && u.id !== user.id).map(admin => (
              <label key={admin.id} className="flex items-center space-x-2 p-2 bg-white rounded-lg cursor-pointer hover:bg-[#E3DBFC] border border-transparent hover:border-[#6D4AFF]/20 transition-colors">
                <input
                  type="checkbox"
                  checked={groupForm.admin_ids.includes(admin.id)}
                  onChange={() => toggleUserInGroup(admin.id, 'admin_ids')}
                  className="rounded text-[#6D4AFF]"
                />
                <span className="text-sm text-[#4A5A58]">
                  {admin.first_name} {admin.last_name}
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-[#6D4AFF] mt-2">Vous serez automatiquement ajouté comme administrateur</p>
        </div>

        <button
          onClick={createGroup}
          className="w-full bg-gradient-to-r from-[#0E7C66] to-[#2D6CDF] hover:opacity-90 text-white rounded-2xl py-3 font-semibold transition-all shadow-md"
        >
          ✅ Créer le groupe
        </button>
      </div>
    </div>
  </div>
)

// Modal d'ajout de patient par le médecin
const AddPatientModal = ({ patientForm, setPatientForm, createPatient, setShowAddPatientModal }) => {

  /* --------Callbacks mémoïsés (évite re-render) -------- */
  const handleFirstName = useCallback((e) => setPatientForm(p => ({ ...p, first_name: e.target.value })), [setPatientForm]);
  const handleLastName  = useCallback((e) => setPatientForm(p => ({ ...p, last_name: e.target.value })), [setPatientForm]);
  const handleUsername  = useCallback((e) => setPatientForm(p => ({ ...p, username: e.target.value })), [setPatientForm]);
  const handlePhone     = useCallback((e) => setPatientForm(p => ({ ...p, phone: e.target.value })), [setPatientForm]);
  const handlePassword  = useCallback((e) => setPatientForm(p => ({ ...p, password: e.target.value })), [setPatientForm]);
  const handlePasswordConfirm = useCallback((e) => setPatientForm(p => ({ ...p, password_confirm: e.target.value })), [setPatientForm]);

  const onSubmit = (e) => {
    e.preventDefault(); // ← empêche le submit implicite qui pique le focus
    createPatient();
  };

  return (
    <div className="fixed inset-0 bg-[#10241F]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* En-tête */}
        <ModalHeader icon={User} iconBg="bg-[#E8EFFD]" iconColor="text-[#2D6CDF]" title="Ajouter un nouveau patient" onClose={() => setShowAddPatientModal(false)} />

        {/* Bloc stable : fieldset + key */}
        <form key="patient-form" onSubmit={onSubmit} className="space-y-4">
          <div className="bg-[#E8EFFD] border border-[#2D6CDF]/20 rounded-xl p-3">
            <p className="text-sm text-[#1B4FB0]">
              💡 Créez un compte pour votre patient. Vous devrez lui communiquer ses identifiants de manière sécurisée.
            </p>
          </div>

          {/* Prénom / Nom */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#4A5A58] mb-2">Prénom *</label>
              <input key="patient-firstname" type="text" value={patientForm.first_name} onChange={handleFirstName} placeholder="Ahmed" className="w-full px-4 py-2.5 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/30 focus:border-[#2D6CDF]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A5A58] mb-2">Nom *</label>
              <input key="patient-lastname" type="text" value={patientForm.last_name} onChange={handleLastName} placeholder="Benali" className="w-full px-4 py-2.5 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/30 focus:border-[#2D6CDF]" />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-[#4A5A58] mb-2"><User className="w-4 h-4 inline mr-2" />Nom d'utilisateur *</label>
            <input key="patient-username" type="text" value={patientForm.username} onChange={handleUsername} placeholder="ahmed123" className="w-full px-4 py-2.5 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/30 focus:border-[#2D6CDF]" />
            <p className="text-xs text-[#8B9997] mt-1">Le patient utilisera ce nom pour se connecter</p>
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-[#4A5A58] mb-2">Téléphone</label>
            <input key="patient-phone" type="tel" value={patientForm.phone} onChange={handlePhone} placeholder="+213 555 123 456" className="w-full px-4 py-2.5 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/30 focus:border-[#2D6CDF]" />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-[#4A5A58] mb-2"><Lock className="w-4 h-4 inline mr-2" />Mot de passe *</label>
            <input key="patient-password" type="password" value={patientForm.password} onChange={handlePassword} placeholder="Min. 8 caractères" className="w-full px-4 py-2.5 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/30 focus:border-[#2D6CDF]" />
          </div>

          {/* Confirmation */}
          <div>
            <label className="block text-sm font-medium text-[#4A5A58] mb-2"><Lock className="w-4 h-4 inline mr-2" />Confirmer le mot de passe *</label>
            <input key="patient-password-confirm" type="password" value={patientForm.password_confirm} onChange={handlePasswordConfirm} placeholder="Retapez le mot de passe" className="w-full px-4 py-2.5 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/30 focus:border-[#2D6CDF]" />
          </div>

          {/* Bouton */}
          <button type="submit" className="w-full bg-[#2D6CDF] hover:bg-[#1B4FB0] text-white rounded-xl py-3 font-semibold transition-colors">✅ Créer le patient</button>
        </form>
      </div>
    </div>
  );
}

// Modal de gestion des utilisateurs
const UsersModal = ({ allUsers, user, toggleUserStatus, deleteUser, setShowUsersModal }) => (
  <div className="fixed inset-0 bg-[#10241F]/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <ModalHeader icon={Users} title="Gestion des utilisateurs" onClose={() => setShowUsersModal(false)} />

      <div className="space-y-3">
        {allUsers.map(userItem => (
          <div key={userItem.id} className="bg-[#F4F7F6] rounded-2xl p-4 border border-[#E3EAE8]">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center space-x-4">
                <div className={`rounded-full p-3 ${
                  userItem.role === 'admin' ? 'bg-[#EFEAFF]' :
                  userItem.role === 'doctor' ? 'bg-[#E4F3EF]' : 'bg-[#E8EFFD]'
                }`}>
                  <User className={`w-6 h-6 ${
                    userItem.role === 'admin' ? 'text-[#6D4AFF]' :
                    userItem.role === 'doctor' ? 'text-[#0E7C66]' : 'text-[#2D6CDF]'
                  }`} />
                </div>
                <div>
                  <h3 className="font-bold text-[#10241F]">
                    {userItem.username} {userItem.last_name}
                  </h3>
                  <p className="text-sm text-[#5C6F6C]">{userItem.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      userItem.role === 'admin' ? 'bg-[#EFEAFF] text-[#6D4AFF]' :
                      userItem.role === 'doctor' ? 'bg-[#E4F3EF] text-[#0E7C66]' :
                      'bg-[#E8EFFD] text-[#2D6CDF]'
                    }`}>
                      {userItem.role === 'admin' ? 'Administrateur' :
                       userItem.role === 'doctor' ? 'Médecin' : 'Patient'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      userItem.is_active ? 'bg-[#E4F3EF] text-[#0E7C66]' : 'bg-[#FBEAE9] text-[#E0473F]'
                    }`}>
                      {userItem.is_active ? '● Actif' : '● Inactif'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleUserStatus(userItem.id, userItem.is_active)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    userItem.is_active 
                      ? 'bg-[#FDF1DD] text-[#B5720B] hover:bg-[#FBE6C2]' 
                      : 'bg-[#E4F3EF] text-[#0E7C66] hover:bg-[#D5ECE6]'
                  }`}
                >
                  {userItem.is_active ? 'Désactiver' : 'Activer'}
                </button>
                {userItem.id !== user.id && (
                  <button
                    onClick={() => deleteUser(userItem.id)}
                    className="px-4 py-2 bg-[#FBEAE9] text-[#E0473F] hover:bg-[#F6D5D3] rounded-xl font-medium transition-colors"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {allUsers.length === 0 && (
        <div className="text-center py-14 text-[#5C6F6C]">
          <Users className="w-14 h-14 mx-auto mb-4 text-[#C7D3D1]" />
          <p>Aucun utilisateur trouvé</p>
        </div>
      )}
    </div>
  </div>
)

// Modal des statistiques
const StatsModal = ({ allUsers, patients, results, setShowStatsModal }) => {
  const totalPatients = allUsers.filter(u => u.role === 'patient').length || patients.length
  const totalDoctors = allUsers.filter(u => u.role === 'doctor').length || 3
  const totalResults = results.length
  const newResults = results.filter(r => r.status === 'new').length
  const consultedResults = results.filter(r => r.status === 'viewed').length
  
  return (
    <div className="fixed inset-0 bg-[#10241F]/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <ModalHeader icon={BarChart3} iconBg="bg-[#FDF1DD]" iconColor="text-[#B5720B]" title="Statistiques du système" onClose={() => setShowStatsModal(false)} />

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-[#2D6CDF] to-[#1B4FB0]">
            <Users className="w-9 h-9 mb-3 opacity-80" />
            <h3 className="text-3xl font-bold mb-1" style={displayFont}>{totalPatients}</h3>
            <p className="text-white/80 text-sm">Patients inscrits</p>
          </div>

          <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-[#0E7C66] to-[#0A5C4C]">
            <Stethoscope className="w-9 h-9 mb-3 opacity-80" />
            <h3 className="text-3xl font-bold mb-1" style={displayFont}>{totalDoctors}</h3>
            <p className="text-white/80 text-sm">Médecins actifs</p>
          </div>

          <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-[#6D4AFF] to-[#4B2FCF]">
            <FileText className="w-9 h-9 mb-3 opacity-80" />
            <h3 className="text-3xl font-bold mb-1" style={displayFont}>{totalResults}</h3>
            <p className="text-white/80 text-sm">Résultats totaux</p>
          </div>

          <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-[#F2A93B] to-[#C87F0F]">
            <Activity className="w-9 h-9 mb-3 opacity-80" />
            <h3 className="text-3xl font-bold mb-1" style={displayFont}>{newResults}</h3>
            <p className="text-white/80 text-sm">Nouveaux résultats</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#F4F7F6] rounded-2xl p-4 border border-[#E3EAE8]">
            <h3 className="font-bold text-[#10241F] mb-3">Résultats par statut</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#5C6F6C]">Nouveaux (non consultés)</span>
                <span className="font-bold text-[#E0473F]">{newResults}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C6F6C]">Consultés</span>
                <span className="font-bold text-[#0E7C66]">{consultedResults}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C6F6C]">Total</span>
                <span className="font-bold text-[#2D6CDF]">{totalResults}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F4F7F6] rounded-2xl p-4 border border-[#E3EAE8]">
            <h3 className="font-bold text-[#10241F] mb-3">Activité récente</h3>
            <div className="space-y-2 text-sm">
              <p className="text-[#5C6F6C]">📊 Taux de consultation: <span className="font-bold text-[#0E7C66]">{totalResults > 0 ? Math.round((consultedResults / totalResults) * 100) : 0}%</span></p>
              <p className="text-[#5C6F6C]">📈 Moyenne par patient: <span className="font-bold text-[#2D6CDF]">{totalPatients > 0 ? (totalResults / totalPatients).toFixed(1) : 0}</span></p>
              <p className="text-[#5C6F6C]">👨‍⚕️ Moyenne par médecin: <span className="font-bold text-[#6D4AFF]">{totalDoctors > 0 ? (totalResults / totalDoctors).toFixed(1) : 0}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modal de configuration
const ConfigModal = ({ ADMIN_SECRET_CODE, setShowConfigModal }) => (
  <div className="fixed inset-0 bg-[#10241F]/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <ModalHeader icon={Settings} iconBg="bg-[#EFEAFF]" iconColor="text-[#6D4AFF]" title="Configuration système" onClose={() => setShowConfigModal(false)} />

      <div className="space-y-4">
        <div className="bg-[#E8EFFD] rounded-2xl p-5 border border-[#2D6CDF]/20">
          <h3 className="font-bold text-[#1B4FB0] mb-3 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Paramètres généraux
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#4A5A58]">Inscriptions ouvertes</span>
              <button className="bg-[#0E7C66] text-white px-4 py-2 rounded-lg font-medium">
                Activé
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#4A5A58]">Validation manuelle des comptes</span>
              <button className="bg-[#E3EAE8] text-[#5C6F6C] px-4 py-2 rounded-lg font-medium">
                Désactivé
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#4A5A58]">Notifications par email</span>
              <button className="bg-[#0E7C66] text-white px-4 py-2 rounded-lg font-medium">
                Activé
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#EFEAFF] rounded-2xl p-5 border border-[#6D4AFF]/20">
          <h3 className="font-bold text-[#4B2FCF] mb-3 flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Sécurité
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-[#4A5A58] mb-2">
                Code administrateur
              </label>
              <input
                type="text"
                value={ADMIN_SECRET_CODE}
                disabled
                className="w-full px-4 py-2.5 bg-white border border-[#6D4AFF]/30 rounded-xl text-[#8B9997]"
              />
              <p className="text-xs text-[#6D4AFF] mt-1">
                Modifiez ce code dans le fichier source pour plus de sécurité
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#4A5A58]">Authentification à deux facteurs</span>
              <button className="bg-[#E3EAE8] text-[#5C6F6C] px-4 py-2 rounded-lg font-medium">
                Bientôt disponible
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#E4F3EF] rounded-2xl p-5 border border-[#0E7C66]/20">
          <h3 className="font-bold text-[#0A5C4C] mb-3 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Gestion des fichiers
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#4A5A58]">Taille max des fichiers</span>
              <span className="font-bold text-[#0E7C66]">10 MB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#4A5A58]">Formats acceptés</span>
              <span className="font-bold text-[#0E7C66]">PDF, JPEG, PNG</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#4A5A58]">Stockage utilisé</span>
              <span className="font-bold text-[#0E7C66]">2.4 GB / 100 GB</span>
            </div>
          </div>
        </div>

        <div className="bg-[#FDF1DD] rounded-2xl p-5 border border-[#F2A93B]/30">
          <h3 className="font-bold text-[#7A4F0C] mb-3 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications système
          </h3>
          <p className="text-sm text-[#8A6420] mb-3">
            Configurez les types de notifications automatiques envoyées aux utilisateurs
          </p>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded text-[#F2A93B]" />
              <span className="text-[#4A5A58]">Nouveau résultat disponible</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded text-[#F2A93B]" />
              <span className="text-[#4A5A58]">Nouveau message reçu</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-[#F2A93B]" />
              <span className="text-[#4A5A58]">Rappel de rendez-vous</span>
            </label>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-[#2D6CDF] to-[#6D4AFF] text-white rounded-2xl py-3 font-semibold hover:opacity-90 transition-all">
          💾 Sauvegarder les modifications
        </button>
      </div>
    </div>
  </div>
)

/* ============================================================
   APP — état, effets et logique métier (inchangés). Le rendu
   n'assemble plus que des composants stables (voir plus haut).
   ============================================================ */

function App() {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [signupForm, setSignupForm] = useState({
    email: '',
    username: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    role: '',
    phone: '',
    admin_code: ''
  })
  const [signupError, setSignupError] = useState('')

  const ADMIN_SECRET_CODE = 'MEDICLINIC2025'  // Changez ce code selon vos besoins
  
  const [view, setView] = useState('home')
  const [results, setResults] = useState([])
  const [notifications, setNotifications] = useState([])
  const [messages, setMessages] = useState([])
  const [patients, setPatients] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loadingData, setLoadingData] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const [showUsersModal, setShowUsersModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [showGroupsModal, setShowGroupsModal] = useState(false)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [showAddPatientModal, setShowAddPatientModal] = useState(false)
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    doctors: [],
    patients: [],
    admin_ids: []
  })
  const [patientForm, setPatientForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    password_confirm: ''
  })
  
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    patient_id: '',
    title: '',
    type: 'blood_test',
    description: '',
    hospital: '',
    file: null
  })

  useEffect(() => {
    checkAuth()
  }, [])

  // Charge les polices d'affichage (n'affecte aucune logique métier)
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap'
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      loadAllData()
    }
  }, [isLoggedIn])

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        const response = await fetch(`${API_URL}/auth/profile/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setIsLoggedIn(true)
        } else if (response.status === 401) {
          console.log('⚠️ Token expiré, déconnexion')
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        } else {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
    }
    setLoading(false)
  }

  const loadAllData = async () => {
    setLoadingData(true)
    await Promise.all([
      loadResults(),
      loadNotifications(),
      loadMessages(),
      user?.role !== 'patient' && loadPatients()
    ])
    setLoadingData(false)
  }

  const loadResults = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_URL}/results/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setResults(data.results || data)
      }
    } catch (error) {
      console.error('Error loading results:', error)
    }
  }

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_URL}/notifications/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.results || data)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_URL}/chat/messages/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setMessages(data.results || data)
      } else {
        console.log('⚠️ Endpoint messages non disponible, utilisation de données de test')
        setMessages([
          { id: 1, sender: user?.role === 'patient' ? 'doctor' : 'patient', content: 'Bonjour, comment puis-je vous aider ?', created_at: '2024-12-30T10:30:00Z' },
          { id: 2, sender: user?.role === 'patient' ? 'patient' : 'doctor', content: 'Bonjour, j\'ai une question concernant mes résultats.', created_at: '2024-12-30T10:35:00Z' }
        ])
      }
    } catch (error) {
      console.log('⚠️ Erreur chargement messages, utilisation de données de test')
      setMessages([
        { id: 1, sender: user?.role === 'patient' ? 'doctor' : 'patient', content: 'Bonjour, comment puis-je vous aider ?', created_at: '2024-12-30T10:30:00Z' },
        { id: 2, sender: user?.role === 'patient' ? 'patient' : 'doctor', content: 'Bonjour, j\'ai une question concernant mes résultats.', created_at: '2024-12-30T10:35:00Z' }
      ])
    }
  }

  const loadPatients = async () => {
    console.log('=== DÉBOGAGE 401 ===');
  console.log('1. User:', user);
  console.log('2. User role:', user?.role);
  
  const token = localStorage.getItem('access_token');
  console.log('3. Token présent:', !!token);
  console.log('4. Token (début):', token ? token.substring(0, 50) + '...' : 'AUCUN');
  
  if (!token) {
    console.error('❌ PAS DE TOKEN - Redirection vers login nécessaire');
    return;
  }
  
  // Décoder le token pour voir son contenu (sans vérifier la signature)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('5. Token payload:', payload);
    console.log('6. Token exp:', new Date(payload.exp * 1000).toLocaleString());
    console.log('7. Maintenant:', new Date().toLocaleString());
    console.log('8. Expiré?', payload.exp * 1000 < Date.now());
  } catch (e) {
    console.error('Token invalide (pas JWT):', e);
  }
  

    try {
      const token = localStorage.getItem('access_token')
      
      // Essayer plusieurs endpoints possibles
      const endpoints = [
        `${API_URL}/auth/patients/`,
        //`${API_URL}/patients/`,
        //`${API_URL}/auth/users/?role=patient`
      ]
      
      for (const endpoint of endpoints) {
                   try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',  // 3. Header souvent requis
          }
          })
          
          if (response.ok) {
            const data = await response.json()
            setPatients(data.results || data)
            console.log('✅ Patients chargés depuis:', endpoint)
            return
          }
        } catch (e) {
          continue
        }
      }
      
      // Si aucun endpoint ne fonctionne, utiliser des données de test
      console.log('⚠️ Aucun endpoint patients disponible, utilisation de données de test')
      setPatients([
        { id: 1, first_name: 'Ahmed', last_name: 'Benali', email: 'ahmed@example.com' },
        { id: 2, first_name: 'Fatima', last_name: 'Khelif', email: 'fatima@example.com' },
        { id: 3, first_name: 'Karim', last_name: 'Zidane', email: 'karim@example.com' }
      ])
    } catch (error) {
      console.error('Error loading patients:', error)
      setPatients([
        { id: 1, first_name: 'Ahmed', last_name: 'Benali', email: 'ahmed@example.com' },
        { id: 2, first_name: 'Fatima', last_name: 'Khelif', email: 'fatima@example.com' },
        { id: 3, first_name: 'Karim', last_name: 'Zidane', email: 'karim@example.com' }
      ])
    }
  }

  const loadAllUsers = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_URL}/auth/users/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setAllUsers(data.results || data)
      } else {
        // Données de test
        setAllUsers([
          { id: 1, username: 'ahmed@example.com', first_name: 'Ahmed', last_name: 'Benali', role: 'patient', email: 'ahmed@example.com', is_active: true },
          { id: 2, username: 'fatima@example.com', first_name: 'Fatima', last_name: 'Khelif', role: 'patient', email: 'fatima@example.com', is_active: true },
          { id: 3, username: 'doctor@example.com', first_name: 'Dr. Karim', last_name: 'Mansouri', role: 'doctor', email: 'doctor@example.com', is_active: true },
          { id: 4, username: 'admin@example.com', first_name: 'Admin', last_name: 'System', role: 'admin', email: 'admin@example.com', is_active: true }
        ])
      }
    } catch (error) {
      console.error('Error loading users:', error)
      setAllUsers([
        { id: 1, username: 'ahmed@example.com', first_name: 'Ahmed', last_name: 'Benali', role: 'patient', email: 'ahmed@example.com', is_active: true },
        { id: 2, username: 'fatima@example.com', first_name: 'Fatima', last_name: 'Khelif', role: 'patient', email: 'fatima@example.com', is_active: true },
        { id: 3, username: 'doctor@example.com', first_name: 'Dr. Karim', last_name: 'Mansouri', role: 'doctor', email: 'doctor@example.com', is_active: true }
      ])
    }
  }

  const loadGroups = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_URL}/chat/groups/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setGroups(data.results || data)
      } else {
        // Données de test
        setGroups([
          {
            id: 1,
            name: 'Équipe Cardiologie',
            description: 'Suivi des patients cardiaques',
            doctors: [{ id: 3, first_name: 'Dr. Karim', last_name: 'Mansouri' }],
            patients: [
              { id: 1, first_name: 'Ahmed', last_name: 'Benali' },
              { id: 2, first_name: 'Fatima', last_name: 'Khelif' }
            ],
            admins: [{ id: 4, first_name: 'Admin', last_name: 'System' }],
            created_at: '2024-12-01T10:00:00Z',
            message_count: 12
          }
        ])
      }
    } catch (error) {
      console.error('Error loading groups:', error)
      setGroups([
        {
          id: 1,
          name: 'Équipe Cardiologie',
          description: 'Suivi des patients cardiaques',
          doctors: [{ id: 3, first_name: 'Dr. Karim', last_name: 'Mansouri' }],
          patients: [
            { id: 1, first_name: 'Ahmed', last_name: 'Benali' },
            { id: 2, first_name: 'Fatima', last_name: 'Khelif' }
          ],
          admins: [{ id: 4, first_name: 'Admin', last_name: 'System' }],
          created_at: '2024-12-01T10:00:00Z',
          message_count: 12
        }
      ])
    }
  }

  const createGroup = async () => {
    if (!groupForm.name || groupForm.doctors.length === 0 || groupForm.patients.length === 0) {
      alert('⚠️ Veuillez remplir tous les champs et sélectionner au moins un médecin et un patient')
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_URL}/chat/groups/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: groupForm.name,
          description: groupForm.description,
          doctor_ids: groupForm.doctors,
          patient_ids: groupForm.patients,
          admin_ids: [user.id, ...groupForm.admin_ids]
        })
      })

      if (response.ok) {
        alert('✅ Groupe créé avec succès!')
        setShowCreateGroupModal(false)
        setGroupForm({ name: '', description: '', doctors: [], patients: [], admin_ids: [] })
        await loadGroups()
      } else {
        // Simulation locale
        const newGroup = {
          id: Date.now(),
          name: groupForm.name,
          description: groupForm.description,
          doctors: allUsers.filter(u => groupForm.doctors.includes(u.id)),
          patients: allUsers.filter(u => groupForm.patients.includes(u.id)),
          admins: allUsers.filter(u => u.id === user.id || groupForm.admin_ids.includes(u.id)),
          created_at: new Date().toISOString(),
          message_count: 0
        }
        setGroups([...groups, newGroup])
        alert('✅ Groupe créé avec succès! (simulation)')
        setShowCreateGroupModal(false)
        setGroupForm({ name: '', description: '', doctors: [], patients: [], admin_ids: [] })
      }
    } catch (error) {
      console.error('Error creating group:', error)
      alert('❌ Erreur lors de la création du groupe')
    }
  }

  const deleteGroup = async (groupId) => {
    if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer ce groupe ?')) return

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_URL}/chat/groups/${groupId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        await loadGroups()
        alert('✅ Groupe supprimé')
      } else {
        setGroups(groups.filter(g => g.id !== groupId))
        alert('✅ Groupe supprimé (simulation)')
      }
    } catch (error) {
      console.error('Error deleting group:', error)
    }
  }

  const toggleUserInGroup = (userId, arrayName) => {
    const array = groupForm[arrayName]
    if (array.includes(userId)) {
      setGroupForm({ ...groupForm, [arrayName]: array.filter(id => id !== userId) })
    } else {
      setGroupForm({ ...groupForm, [arrayName]: [...array, userId] })
    }
  }

const createPatient = async () => {
    if (!patientForm.username || !patientForm.first_name || !patientForm.last_name || !patientForm.password) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires')
      return
    }

    if (patientForm.password !== patientForm.password_confirm) {
      alert('⚠️ Les mots de passe ne correspondent pas')
      return
    }

    if (patientForm.password.length < 8) {
      alert('⚠️ Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      const payload = {
        username: patientForm.username,
        password: patientForm.password,
        password2: patientForm.password_confirm,
        first_name: patientForm.first_name,
        last_name: patientForm.last_name,
        role: 'patient',
        phone: patientForm.phone || ''
      }

      console.log('📤 Création patient par médecin:', payload)

      const response = await fetch(`${API_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        alert(`✅ Patient créé avec succès!\n\nIdentifiants:\nUsername: ${patientForm.username}\nMot de passe: ${patientForm.password}\n\n⚠️ Communiquez ces identifiants au patient de manière sécurisée.`)
        setShowAddPatientModal(false)
        setPatientForm({
          username: '',
          first_name: '',
          last_name: '',
          phone: '',
          password: '',
          password_confirm: ''
        })
        await loadPatients()
      } else {
        let errorMessage = 'Erreur lors de la création du patient'
        if (data.username) {
          errorMessage = `Username: ${Array.isArray(data.username) ? data.username.join(', ') : data.username}`
        }
        alert(`❌ ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error creating patient:', error)
      alert('❌ Erreur de connexion au serveur')
    }
  }

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_URL}/auth/users/${userId}/toggle_status/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        await loadAllUsers()
        alert(`✅ Statut de l'utilisateur ${currentStatus ? 'désactivé' : 'activé'}`)
      } else {
        // Simulation locale
        setAllUsers(allUsers.map(u => 
          u.id === userId ? {...u, is_active: !currentStatus} : u
        ))
        alert(`✅ Statut de l'utilisateur ${currentStatus ? 'désactivé' : 'activé'} (simulation)`)
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
    }
  }

  const deleteUser = async (userId) => {
    if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return
    
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_URL}/auth/users/${userId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        await loadAllUsers()
        alert('✅ Utilisateur supprimé')
      } else {
        // Simulation locale
        setAllUsers(allUsers.filter(u => u.id !== userId))
        alert('✅ Utilisateur supprimé (simulation)')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleLogin = async () => {
    setLoginError('')
    
    // Validation
    if ((!email && !username) || !password) {
      setLoginError('Veuillez remplir tous les champs')
      return
    }
    
    try {
      // Déterminer si c'est un email ou un username
      const identifier = email || username
      const isEmail = identifier.includes('@')
      
      const payload = {
        username: isEmail ? '' : identifier,  // Username uniquement si pas un email
        email: isEmail ? identifier : '',      // Email uniquement si c'est un email
        password
      }
      
      console.log('🔑 Tentative de connexion:', { identifier, isEmail, payload })
      
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      const data = await response.json()
      console.log('📥 Réponse login:', data)
      
      if (response.ok) {
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)
        setUser(data.user)
        setIsLoggedIn(true)
        setEmail('')
        setUsername('')
        setPassword('')
      } else {
        setLoginError(data.error || 'Identifiant ou mot de passe incorrect')
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error)
      setLoginError('Erreur de connexion au serveur')
    }
  }

  const handleSignup = async () => {
    setSignupError('')
    
    // Validation
    if ( !signupForm.role || !signupForm.password || !signupForm.first_name || !signupForm.last_name) {
      setSignupError('Veuillez remplir tous les champs obligatoires')
      return
    }
    
    if (signupForm.password !== signupForm.password_confirm) {
      setSignupError('Les mots de passe ne correspondent pas')
      return
    }
    
    if (signupForm.password.length < 8) {
      setSignupError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
    
    // Vérification du code admin
    if (signupForm.role === 'admin') {
      if (!signupForm.admin_code) {
        setSignupError('Le code administrateur est requis pour ce rôle')
        return
      }
      if (signupForm.admin_code !== ADMIN_SECRET_CODE) {
        setSignupError('❌ Code administrateur incorrect')
        return
      }
    }
    
    try {
      const payload = {
        username: signupForm.username || signupForm.email,
        email: signupForm.email,
        password: signupForm.password,
        password2: signupForm.password_confirm,
        first_name: signupForm.first_name,
        last_name: signupForm.last_name,
        role: signupForm.role,
        phone: signupForm.phone || ''
      }
      
      console.log('📤 Envoi des données d\'inscription:', payload)
      
      const response = await fetch(`${API_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      const data = await response.json()
      console.log('📥 Réponse du serveur:', data)
      
      if (response.ok) {
        alert('✅ Inscription réussie ! Vous pouvez maintenant vous connecter.')
        setIsSignup(false)
        setEmail(signupForm.email)
        setSignupForm({
          email: '',
          password: '',
          password_confirm: '',
          first_name: '',
          last_name: '',
          role: '',
          phone: '',
          admin_code: ''
        })
      } else {
        let errorMessage = 'Erreur lors de l\'inscription:'
        if (data.error) {
          errorMessage = data.error
        } else if (data.username) {
          errorMessage = `Username: ${Array.isArray(data.username) ? data.username.join(', ') : data.username}`
        } else if (data.email) {
          errorMessage = `Email: ${Array.isArray(data.email) ? data.email.join(', ') : data.email}`
        } else if (data.password) {
          errorMessage = `Mot de passe: ${Array.isArray(data.password) ? data.password.join(', ') : data.password}`
        } else if (data.password2) {
          errorMessage = `Confirmation: ${Array.isArray(data.password2) ? data.password2.join(', ') : data.password2}`
        } else {
          errorMessage = JSON.stringify(data)
        }
        setSignupError(errorMessage)
        console.error('❌ Erreur d\'inscription:', data)
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error)
      setSignupError('Erreur de connexion au serveur')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setIsLoggedIn(false)
    setUser(null)
    setView('home')
    setResults([])
    setNotifications([])
    setMessages([])
    setPatients([])
  }

  const handleUploadResult = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const formData = new FormData()
      formData.append('patient', uploadForm.patient_id)
      formData.append('doctor', user.id)
      formData.append('title', uploadForm.title)
      formData.append('type', uploadForm.type)
      formData.append('description', uploadForm.description)
      formData.append('hospital', uploadForm.hospital)
      formData.append('date_examination', new Date().toISOString().split('T')[0])
      if (uploadForm.file) {
       formData.append('file', uploadForm.file)
      }

      const response = await fetch(`${API_URL}/results/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        alert('✅ Résultat uploadé avec succès!')
        setShowUploadModal(false)
        setUploadForm({
          patient_id: '',
          title: '',
          type: 'blood_test',
          description: '',
          hospital: '',
          file: null
        })
        await loadResults()
      } else {
        alert('❌ Erreur lors de l\'upload')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('❌ Erreur lors de l\'upload')
    }
  }

  const handleDownloadResult = async (result) => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_URL}/results/${result.id}/download/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = result.file || `resultat_${result.id}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        await loadResults()
      }
    } catch (error) {
      alert('Erreur lors du téléchargement')
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return
    
    try {
      const token = localStorage.getItem('access_token')
      
      // Préparer le payload
      const payload = {
        content: newMessage,
        group_id: selectedGroup?.id || null
      }
      
      console.log('📤 Envoi du message:', payload)
      
      const response = await fetch(`${API_URL}/chat/messages/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Message envoyé:', data)
        
        // Ajouter le message à l'affichage
        const newMsg = {
          id: data.id || Date.now(),
          sender: user?.role === 'patient' ? 'patient' : 'doctor',
          sender_id: user?.id,
          sender_name: `${user?.first_name} ${user?.last_name}`,
          content: newMessage,
          created_at: data.created_at || new Date().toISOString()
        }
        
        setMessages([...messages, newMsg])
        setNewMessage('')
        
        // Recharger les messages pour être sûr
        await loadMessages()
      } else {
        console.error('❌ Erreur envoi message:', await response.json())
        
        // En cas d'erreur, ajouter quand même localement pour le développement
        const newMsg = {
          id: Date.now(),
          sender: user?.role === 'patient' ? 'patient' : 'doctor',
          sender_id: user?.id,
          sender_name: `${user?.first_name} ${user?.last_name}`,
          content: newMessage,
          created_at: new Date().toISOString()
        }
        setMessages([...messages, newMsg])
        setNewMessage('')
      }
    } catch (error) {
      console.error('❌ Erreur sendMessage:', error)
      
      // Fallback : ajouter localement en cas d'erreur réseau
      const newMsg = {
        id: Date.now(),
        sender: user?.role === 'patient' ? 'patient' : 'doctor',
        sender_id: user?.id,
        sender_name: `${user?.first_name} ${user?.last_name}`,
        content: newMessage,
        created_at: new Date().toISOString()
      }
      setMessages([...messages, newMsg])
      setNewMessage('')
    }
  }

  const markNotificationRead = async (notifId) => {
    try {
      const token = localStorage.getItem('access_token')
      await fetch(`${API_URL}/notifications/${notifId}/mark_read/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      await loadNotifications()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const newResultsCount = results.filter(r => r.status === 'new').length

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7F6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#0E7C66] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#5C6F6C]">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F4F7F6] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#0E7C66]/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#2D6CDF]/10 blur-3xl" />

        <div className="bg-white rounded-3xl shadow-xl shadow-[#10241F]/5 border border-[#E3EAE8] p-8 w-full max-w-md relative z-10">
          <div className="text-center mb-6">
            <div className="relative bg-gradient-to-br from-[#0E7C66] to-[#2D6CDF] rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#0E7C66]/25 overflow-hidden">
                            <img src="https://img.freepik.com/vecteurs-premium/logo-du-laboratoire-medical_880781-1942.jpg" alt="Logo" className="w-20 h-20 object-cover" />

            </div>
            <h1 className="text-3xl font-bold text-[#10241F]" style={displayFont}>ErraziLab</h1>
            <p className="text-[#5C6F6C] mt-1 flex items-center justify-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-[#0E7C66]" /> Plateforme médicale sécurisée
            </p>
          </div>

          {!isSignup ? (
            // PAGE DE CONNEXION
            <React.Fragment key="login-form">
              {loginError && (
                <div className="bg-[#FBEAE9] border border-[#E0473F]/30 text-[#E0473F] px-4 py-3 rounded-xl mb-4 text-sm">
                  {loginError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#4A5A58] mb-2">
                    <Mail className="w-4 h-4 inline mr-2 text-[#0E7C66]" />
                    Email ou Nom d'utilisateur
                  </label>
                  <input
                    type="text"
                    value={email || username}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val.includes('@')) {
                        setEmail(val)
                        setUsername('')
                      } else {
                        setUsername(val)
                        setEmail('')
                      }
                    }}
                    placeholder="votre.email@exemple.com ou username"
                    className="w-full px-4 py-3 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 focus:border-[#0E7C66] transition-colors"
                  />
                  <p className="text-xs text-[#8B9997] mt-1">
                    Patients: utilisez votre nom d'utilisateur | Médecins/Admins: utilisez votre email
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4A5A58] mb-2">
                    <Lock className="w-4 h-4 inline mr-2 text-[#0E7C66]" />
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 focus:border-[#0E7C66] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B9997] hover:text-[#10241F]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-[#0E7C66] to-[#2D6CDF] hover:opacity-90 text-white rounded-xl py-3 font-semibold transition-all shadow-md shadow-[#0E7C66]/20"
                >
                  Se connecter
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-[#5C6F6C] text-sm">
                  Pas encore de compte ?{' '}
                  <button 
                    onClick={() => setIsSignup(true)}
                    className="text-[#0E7C66] hover:text-[#0A5C4C] font-semibold"
                  >
                    S'inscrire
                  </button>
                </p>
              </div>

              
            </React.Fragment>
          ) : (
            // PAGE D'INSCRIPTION
            <React.Fragment key="signup-form">
              {signupError && (
                <div className="bg-[#FBEAE9] border border-[#E0473F]/30 text-[#E0473F] px-4 py-3 rounded-xl mb-4 text-sm">
                  {signupError}
                </div>
              )}

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <label className="block text-sm font-medium text-[#4A5A58] mb-2">
                    Rôle *
                  </label>
                  <select
                    value={signupForm.role}
                    onChange={(e) => {
                      console.log('Changement de rôle vers:', e.target.value)
                      setSignupForm(prev => ({...prev, role: e.target.value}))
                    }}
                    className="w-full px-4 py-3 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 focus:border-[#0E7C66]"
                  >
                    <option value="">---</option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Médecin</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>

                {signupForm.role === 'admin' && (
                  <div className="bg-[#FDF1DD] border-2 border-[#F2A93B]/40 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lock className="w-5 h-5 text-[#B5720B]" />
                      <label className="text-sm font-semibold text-[#7A4F0C]">
                        Code Administrateur *
                      </label>
                    </div>
                    <input
                      type="password"
                      value={signupForm.admin_code}
                      onChange={(e) => {
                        console.log('Code admin changé')
                        setSignupForm(prev => ({...prev, admin_code: e.target.value}))
                      }}
                      placeholder="Entrez le code secret admin"
                      className="w-full px-4 py-3 border border-[#F2A93B]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F2A93B]/40"
                    />
                    <p className="text-xs text-[#8A6420] mt-2">
                      🔐 Code requis pour créer un compte administrateur
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#4A5A58] mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      value={signupForm.first_name}
                      onChange={(e) => {
                        console.log('Prénom:', e.target.value)
                        setSignupForm(prev => ({...prev, first_name: e.target.value}))
                      }}
                      placeholder="Ahmed"
                      className="w-full px-4 py-3 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 focus:border-[#0E7C66]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4A5A58] mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={signupForm.last_name}
                      onChange={(e) => {
                        console.log('Nom:', e.target.value)
                        setSignupForm(prev => ({...prev, last_name: e.target.value}))
                      }}
                      placeholder="Benali"
                      className="w-full px-4 py-3 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 focus:border-[#0E7C66]"
                    />
                  </div>
                </div>

                {signupForm.role === 'patient' ? (
                  // PATIENT : Nom d'utilisateur (pas d'email)
                  <div>
                    <label className="block text-sm font-medium text-[#4A5A58] mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Nom d'utilisateur *
                    </label>
                    <input
                      type="text"
                      value={signupForm.username}
                      onChange={(e) => {
                        console.log('Username patient:', e.target.value)
                        setSignupForm(prev => ({...prev, username: e.target.value}))
                      }}
                      placeholder="ahmed123"
                      className="w-full px-4 py-3 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 focus:border-[#0E7C66]"
                    />
                    <p className="text-xs text-[#8B9997] mt-1">
                      Utilisez ce nom d'utilisateur pour vous connecter
                    </p>
                  </div>
                ) : (
                  // MEDECIN / ADMIN : Email
                  <div>
                    <label className="block text-sm font-medium text-[#4A5A58] mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email professionnel *
                    </label>
                    <input
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => {
                        console.log('Email médecin/admin:', e.target.value)
                        setSignupForm(prev => ({...prev, email: e.target.value}))
                      }}
                      placeholder="votre.email@hopital.com"
                      className="w-full px-4 py-3 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 focus:border-[#0E7C66]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#4A5A58] mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={signupForm.phone}
                    onChange={(e) => {
                      console.log('Téléphone:', e.target.value)
                      setSignupForm(prev => ({...prev, phone: e.target.value}))
                    }}
                    placeholder="+213 555 123 456"
                    className="w-full px-4 py-3 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 focus:border-[#0E7C66]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4A5A58] mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Mot de passe *
                  </label>
                  <input
                    type="password"
                    value={signupForm.password}
                    onChange={(e) => {
                      console.log('Mot de passe saisi')
                      setSignupForm(prev => ({...prev, password: e.target.value}))
                    }}
                    placeholder="Min. 8 caractères"
                    className="w-full px-4 py-3 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 focus:border-[#0E7C66]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4A5A58] mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Confirmer le mot de passe *
                  </label>
                  <input
                    type="password"
                    value={signupForm.password_confirm}
                    onChange={(e) => {
                      console.log('Confirmation mot de passe saisi')
                      setSignupForm(prev => ({...prev, password_confirm: e.target.value}))
                    }}
                    placeholder="Retapez votre mot de passe"
                    className="w-full px-4 py-3 border border-[#E3EAE8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7C66]/30 focus:border-[#0E7C66]"
                  />
                </div>

                <button
                  onClick={() => {
                    console.log('🔍 État du formulaire avant soumission:', signupForm)
                    handleSignup()
                  }}
                  className="w-full bg-gradient-to-r from-[#0E7C66] to-[#2D6CDF] hover:opacity-90 text-white rounded-xl py-3 font-semibold transition-all shadow-md shadow-[#0E7C66]/20"
                >
                  S'inscrire
                </button>
                
                {signupForm.role === 'admin' && (
                  <div className="bg-[#E8EFFD] border border-[#2D6CDF]/20 rounded-xl p-3">
                    <p className="text-xs text-[#1B4FB0]">
                      💡 <strong>Code administrateur actuel:</strong> MEDICLINIC2025
                      <br />
                      <span className="text-[#2D6CDF]">
                        (Changez la constante ADMIN_SECRET_CODE dans le code pour plus de sécurité)
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <p className="text-[#5C6F6C] text-sm">
                  Déjà un compte ?{' '}
                  <button 
                    onClick={() => {
                      setIsSignup(false)
                      setSignupError('')
                      setSignupForm({
                        email: '',
                        username: '',
                        password: '',
                        password_confirm: '',
                        first_name: '',
                        last_name: '',
                        role: 'patient',
                        phone: '',
                        admin_code: ''
                      })
                    }}
                    className="text-[#0E7C66] hover:text-[#0A5C4C] font-semibold"
                  >
                    Se connecter
                  </button>
                </p>
              </div>
              
              <button
                onClick={() => {
                  console.log('🔄 Réinitialisation du formulaire')
                  setSignupForm({
                    email: '',
                    username: '',
                    password: '',
                    password_confirm: '',
                    first_name: '',
                    last_name: '',
                    role: 'patient',
                    phone: '',
                    admin_code: ''
                  })
                  setSignupError('')
                }}
                className="w-full mt-4 text-sm text-[#8B9997] hover:text-[#5C6F6C]"
              >
                🔄 Réinitialiser le formulaire
              </button>
            </React.Fragment>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F7F6]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-2xl mx-auto p-4 pb-24">
        {view === 'home' && (
          user?.role === 'patient' ? (
            <PatientHomeView user={user} results={results} messages={messages} newResultsCount={newResultsCount} loadResults={loadResults} handleLogout={handleLogout} formatDate={formatDate} setShowChangePasswordModal={setShowChangePasswordModal} />
          ) : user?.role === 'doctor' ? (
            <DoctorHomeView user={user} patients={patients} results={results} handleLogout={handleLogout} setShowUploadModal={setShowUploadModal} setShowAddPatientModal={setShowAddPatientModal} formatDate={formatDate} setShowChangePasswordModal={setShowChangePasswordModal} />
          ) : (
            <AdminHomeView results={results} handleLogout={handleLogout} setShowAddPatientModal={setShowAddPatientModal} loadAllUsers={loadAllUsers} setShowUsersModal={setShowUsersModal} loadGroups={loadGroups} setShowGroupsModal={setShowGroupsModal} setShowStatsModal={setShowStatsModal} setShowConfigModal={setShowConfigModal} setShowChangePasswordModal={setShowChangePasswordModal} />
          )
        )}
        {view === 'results' && (
          <ResultsView user={user} results={results} loadingData={loadingData} loadResults={loadResults} formatDate={formatDate} handleDownloadResult={handleDownloadResult} />
        )}
        {view === 'notifications' && (
          <NotificationsView notifications={notifications} loadingData={loadingData} loadNotifications={loadNotifications} markNotificationRead={markNotificationRead} formatDate={formatDate} />
        )}
        {view === 'chat' && (
          <ChatView
            groups={groups}
            user={user}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            loadAllUsers={loadAllUsers}
            loadGroups={loadGroups}
            setShowCreateGroupModal={setShowCreateGroupModal}
            messages={messages}
            loadMessages={loadMessages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
            formatTime={formatTime}
          />
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[#E3EAE8] shadow-[0_-4px_20px_rgba(16,36,31,0.06)]">
        <div className="max-w-2xl mx-auto flex justify-around py-2.5">
          <button
            onClick={() => setView('home')}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-colors ${
              view === 'home' ? 'text-[#0E7C66] bg-[#E4F3EF]' : 'text-[#8B9997]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Accueil</span>
          </button>

          <button
            onClick={() => setView('results')}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-colors relative ${
              view === 'results' ? 'text-[#0E7C66] bg-[#E4F3EF]' : 'text-[#8B9997]'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs font-medium">Résultats</span>
            {newResultsCount > 0 && (
              <span className="absolute top-0 right-1.5 bg-[#E0473F] text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center">
                {newResultsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setView('notifications')}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-colors relative ${
              view === 'notifications' ? 'text-[#0E7C66] bg-[#E4F3EF]' : 'text-[#8B9997]'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="text-xs font-medium">Alertes</span>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-1.5 bg-[#E0473F] text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setView('chat')}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-colors ${
              view === 'chat' ? 'text-[#0E7C66] bg-[#E4F3EF]' : 'text-[#8B9997]'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs font-medium">Messages</span>
          </button>
        </div>
      </nav>

      {showUploadModal && (
        <UploadModal uploadForm={uploadForm} setUploadForm={setUploadForm} patients={patients} handleUploadResult={handleUploadResult} setShowUploadModal={setShowUploadModal} />
      )}
      {showAddPatientModal && (
        <AddPatientModal patientForm={patientForm} setPatientForm={setPatientForm} createPatient={createPatient} setShowAddPatientModal={setShowAddPatientModal} />
      )}
      {showUsersModal && (
        <UsersModal allUsers={allUsers} user={user} toggleUserStatus={toggleUserStatus} deleteUser={deleteUser} setShowUsersModal={setShowUsersModal} />
      )}
      {showGroupsModal && (
        <GroupsModal groups={groups} setShowGroupsModal={setShowGroupsModal} setShowCreateGroupModal={setShowCreateGroupModal} setSelectedGroup={setSelectedGroup} setView={setView} deleteGroup={deleteGroup} formatDate={formatDate} />
      )}
      {showCreateGroupModal && (
        <CreateGroupModal groupForm={groupForm} setGroupForm={setGroupForm} allUsers={allUsers} user={user} toggleUserInGroup={toggleUserInGroup} createGroup={createGroup} setShowCreateGroupModal={setShowCreateGroupModal} setShowGroupsModal={setShowGroupsModal} />
      )}
      {showChangePasswordModal && (
        <div
          className="fixed inset-0 bg-[#10241F]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowChangePasswordModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader
              icon={Lock}
              title="Changer mon mot de passe"
              onClose={() => setShowChangePasswordModal(false)}
            />
            <ChangePassword onSuccess={() => setShowChangePasswordModal(false)} />
          </div>
        </div>
      )}
      {showStatsModal && (
        <StatsModal allUsers={allUsers} patients={patients} results={results} setShowStatsModal={setShowStatsModal} />
      )}
      {showConfigModal && (
        <ConfigModal ADMIN_SECRET_CODE={ADMIN_SECRET_CODE} setShowConfigModal={setShowConfigModal} />
      )}

    </div>
  )
}

export default App