import React, { useState, useEffect, useCallback } from 'react'
import { Bell, Download, MessageCircle, FileText, User, Send, Home, LogOut, Eye, EyeOff, Lock, Mail, RefreshCw, Upload, Users, BarChart3, Settings, X } from 'lucide-react'
import ChangePassword from './components/ChangePassword'
const API_URL = 'http://127.0.0.1:8000/api'  // Changez le port si nécessaire (ex: 8080)

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

  const PatientHomeView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between ">
          <div className="flex items-center space-x-4 ">
            <div className="bg-white/20 rounded-full p-3">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Bonjour, {user?.first_name || user?.username}</h2>
              <p className="text-blue-100">Espace Patient</p>
            </div>
          </div>
          <button onClick={handleLogout} className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">{results.length}</h3>
          <p className="text-sm text-gray-500">Résultats</p>
          {newResultsCount > 0 && (
            <span className="inline-block mt-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
              {newResultsCount} nouveau(x)
            </span>
          )}
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">{messages.length}</h3>
          <p className="text-sm text-gray-500">Messages</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800">Résultats récents</h3>
          <button onClick={loadResults} className="text-blue-600 hover:text-blue-700">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        {results.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Aucun résultat disponible</div>
        ) : (
          <div className="space-y-3">
            {results.slice(0, 3).map(result => (
              <div key={result.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{result.title}</h4>
                      <p className="text-sm text-gray-500">
                        {result.date_examination ? formatDate(result.date_examination) : 'Date inconnue'}
                      </p>
                    </div>
                  </div>
                  {result.status === 'new' && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Nouveau</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const DoctorHomeView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-full p-3">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Dr. {user?.last_name || user?.username}</h2>
              <p className="text-green-100">Espace Médecin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">{patients.length}</h3>
          <p className="text-sm text-gray-500">Patients</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">{results.length}</h3>
          <p className="text-sm text-gray-500">Résultats envoyés</p>
        </div>
      </div>

      <button
        onClick={() => setShowUploadModal(true)}
        className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-4 flex items-center justify-center space-x-2 font-semibold transition-colors shadow-lg"
      >
        <Upload className="w-5 h-5" />
        <span>Uploader un nouveau résultat</span>
      </button>

      <button
        onClick={() => setShowAddPatientModal(true)}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-4 flex items-center justify-center space-x-2 font-semibold transition-colors shadow-lg"
      >
        <User className="w-5 h-5" />
        <span>Ajouter un nouveau patient</span>
      </button>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">Résultats récents</h3>
        {results.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Aucun résultat envoyé</div>
        ) : (
          <div className="space-y-3">
            {results.slice(0, 5).map(result => (
              <div key={result.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">{result.title}</h4>
                    <p className="text-sm text-gray-500">Patient: {result.patient_name || 'Non spécifié'}</p>
                    <p className="text-xs text-gray-400">
                      {result.date_examination ? formatDate(result.date_examination) : 'Date inconnue'}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    result.status === 'new' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
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

  const AdminHomeView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-full p-3">
              <Settings className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Tableau de bord Admin</h2>
              <p className="text-purple-100">Vue d'ensemble du système</p>
            </div>
          </div>
          <button onClick={handleLogout} className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">125</h3>
          <p className="text-sm text-gray-500">Utilisateurs</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">{results.length}</h3>
          <p className="text-sm text-gray-500">Résultats</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">89%</h3>
          <p className="text-sm text-gray-500">Activité</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Actions rapides</h3>
        <div className="space-y-2">
        <button
        onClick={() => setShowAddPatientModal(true)}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-4 flex items-center justify-center space-x-2 font-semibold transition-colors shadow-lg"
      >
        <User className="w-5 h-5" />
        <span>Ajouter un nouveau patient</span>
      </button>
          <button 
            onClick={() => {
              loadAllUsers()
              setShowUsersModal(true)
            }}
            className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-medium transition-colors"
          >
            👥 Gérer les utilisateurs
          </button>
          <button 
            onClick={() => {
              loadAllUsers()
              loadGroups()
              setShowGroupsModal(true)
            }}
            className="w-full text-left px-4 py-3 bg-teal-50 hover:bg-teal-100 rounded-lg text-teal-700 font-medium transition-colors"
          >
            👨‍⚕️ Gérer les groupes médicaux
          </button>
          <button 
            onClick={() => setShowStatsModal(true)}
            className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 font-medium transition-colors"
          >
            📊 Voir les statistiques
          </button>
          <button 
            onClick={() => setShowConfigModal(true)}
            className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 font-medium transition-colors"
          >
            ⚙️ Configuration système
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-5">
        <div className="flex items-start space-x-3">
          <div className="bg-orange-500 rounded-full p-2">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-orange-900 mb-1">Alertes système</h4>
            <p className="text-sm text-orange-700">3 nouveaux utilisateurs en attente de validation</p>
          </div>
        </div>
      </div>
    </div>
  )

  const ResultsView = () => (
    
    <div className="space-y-4">
    
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {user?.role === 'patient' ? 'Mes résultats' : 'Résultats des patients'}
        </h2>
        <button onClick={loadResults} className="text-blue-600 hover:text-blue-700">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      
      {loadingData ? (
        <div className="text-center py-8 text-gray-500">Chargement...</div>
      ) : results.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Aucun résultat disponible</p>
        </div>
      ) : (
        results.map(result => (
          <div key={result.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`rounded-lg p-3 ${result.status === 'new' ? 'bg-blue-500' : 'bg-gray-100'}`}>
                  <FileText className={`w-6 h-6 ${result.status === 'new' ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{result.title}</h3>
                  <p className="text-sm text-gray-500">{result.doctor_name || 'Médecin'}</p>
                  {user?.role !== 'patient' && result.patient_name && (
                    <p className="text-sm text-gray-500">Patient: {result.patient_name}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {result.date_examination ? formatDate(result.date_examination) : 'Date inconnue'}
                  </p>
                  {result.hospital && (
                    <p className="text-xs text-gray-400">{result.hospital}</p>
                  )}
                </div>
              </div>
              {result.status === 'new' && (
                <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">Nouveau</span>
              )}
            </div>
            {result.description && (
              <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg">{result.description}</p>
            )}
            <button
              onClick={() => handleDownloadResult(result)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 flex items-center justify-center space-x-2 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Télécharger le résultat</span>
            </button>
          </div>
        ))
      )}
    </div>
  )

  const NotificationsView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        <button onClick={loadNotifications} className="text-blue-600 hover:text-blue-700">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      
      {loadingData ? (
        <div className="text-center py-8 text-gray-500">Chargement...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Aucune notification</p>
        </div>
      ) : (
        notifications.map(notif => (
          <div
            key={notif.id}
            onClick={() => !notif.read && markNotificationRead(notif.id)}
            className={`rounded-xl p-4 border cursor-pointer transition-all ${
              notif.read ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`rounded-full p-2 ${notif.read ? 'bg-gray-100' : 'bg-blue-500'}`}>
                  <Bell className={`w-4 h-4 ${notif.read ? 'text-gray-600' : 'text-white'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{notif.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {notif.time_ago || (notif.created_at ? formatDate(notif.created_at) : 'Date inconnue')}
                  </p>
                </div>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )

  // ========== VUE CHAT ==========
  const ChatView = () => {
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
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Mes groupes</h2>
            
            {user?.role === 'admin' && (
              <button
                onClick={() => {
                  loadAllUsers()
                  loadGroups()
                  setShowCreateGroupModal(true)
                }}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-xl py-4 flex items-center justify-center space-x-2 font-semibold transition-all shadow-lg mb-4"
              >
                <Users className="w-5 h-5" />
                <span>Créer un nouveau groupe</span>
              </button>
            )}

            {userGroups.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
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
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-teal-100 rounded-full p-3">
                        <Users className="w-6 h-6 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{group.name}</h3>
                        <p className="text-sm text-gray-500">{group.description}</p>
                        <div className="flex items-center space-x-3 mt-1 text-xs text-gray-400">
                          <span>👨‍⚕️ {group.doctors?.length || 0}</span>
                          <span>👤 {group.patients?.length || 0}</span>
                          <span>💬 {group.message_count || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-teal-500">→</div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Chat du groupe sélectionné
          <>
            <div className="bg-white rounded-t-2xl p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ← Retour
                  </button>
                  <div className="bg-teal-100 rounded-full p-2">
                    <Users className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{selectedGroup.name}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedGroup.doctors?.length || 0} médecin(s) · {selectedGroup.patients?.length || 0} patient(s)
                    </p>
                  </div>
                </div>
                <button onClick={loadMessages} className="text-blue-600 hover:text-blue-700">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map(msg => {
                const isMine = msg.sender_id === user?.id || 
                              (user?.role === 'patient' && msg.sender === 'patient') || 
                              (user?.role !== 'patient' && msg.sender === 'doctor')
                
                return (
                  <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                      isMine ? 'bg-teal-500 text-white' : 'bg-white text-gray-800'
                    }`}>
                      {!isMine && msg.sender_name && (
                        <p className="text-xs font-semibold mb-1 opacity-70">{msg.sender_name}</p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${isMine ? 'text-teal-100' : 'text-gray-400'}`}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-white rounded-b-2xl p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Écrivez votre message..."
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-teal-500 hover:bg-teal-600 text-white rounded-full p-3 transition-colors"
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


  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Uploader un résultat</h2>
          <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
            <select
              value={uploadForm.patient_id}
              onChange={(e) => setUploadForm({...uploadForm, patient_id: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
            <input
              type="text"
              value={uploadForm.title}
              onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
              placeholder="Ex: Analyse de sang"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={uploadForm.type}
              onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="blood_test">Analyse de sang</option>
              <option value="xray">Radiographie</option>
              <option value="scan">Scanner</option>
              <option value="mri">IRM</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hôpital</label>
            <input
              type="text"
              value={uploadForm.hospital}
              onChange={(e) => setUploadForm({...uploadForm, hospital: e.target.value})}
              placeholder="Ex: CHU Blida"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={uploadForm.description}
              onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
              placeholder="Détails supplémentaires..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fichier PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {uploadForm.file && (
              <p className="text-sm text-green-600 mt-2">✓ {uploadForm.file.name}</p>
            )}
          </div>

          <button
            onClick={handleUploadResult}
            disabled={!uploadForm.patient_id || !uploadForm.title}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg py-3 font-semibold transition-colors"
          >
            Uploader
          </button>
        </div>
      </div>
    </div>
  )

  // Modal de gestion des groupes
  const GroupsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Gestion des groupes médicaux</h2>
          <button onClick={() => setShowGroupsModal(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <button
          onClick={() => {
            setShowCreateGroupModal(true)
            setShowGroupsModal(false)
          }}
          className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-xl py-3 font-semibold transition-all shadow-lg mb-6 flex items-center justify-center space-x-2"
        >
          <Users className="w-5 h-5" />
          <span>Créer un nouveau groupe</span>
        </button>

        <div className="space-y-4">
          {groups.map(group => (
            <div key={group.id} className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-5 border border-teal-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{group.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
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
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    💬 Chat
                  </button>
                  <button
                    onClick={() => deleteGroup(group.id)}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">👨‍⚕️ MÉDECINS ({group.doctors?.length || 0})</h4>
                  <div className="space-y-1">
                    {group.doctors?.map(doctor => (
                      <div key={doctor.id} className="text-sm text-gray-700">
                        • {doctor.first_name} {doctor.last_name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">👤 PATIENTS ({group.patients?.length || 0})</h4>
                  <div className="space-y-1">
                    {group.patients?.map(patient => (
                      <div key={patient.id} className="text-sm text-gray-700">
                        • {patient.first_name} {patient.last_name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">🔑 ADMINS ({group.admins?.length || 0})</h4>
                  <div className="space-y-1">
                    {group.admins?.map(admin => (
                      <div key={admin.id} className="text-sm text-gray-700">
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
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Aucun groupe créé</p>
            <p className="text-sm mt-2">Créez un groupe pour faciliter la communication entre médecins et patients</p>
          </div>
        )}
      </div>
    </div>
  )

  // Modal de création de groupe
  const CreateGroupModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Créer un groupe médical</h2>
          <button onClick={() => {
            setShowCreateGroupModal(false)
            setShowGroupsModal(true)
          }} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom du groupe *</label>
            <input
              type="text"
              value={groupForm.name}
              onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
              placeholder="Ex: Équipe Cardiologie"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={groupForm.description}
              onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
              placeholder="Description du groupe..."
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <h3 className="font-bold text-green-900 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Sélectionner les médecins * ({groupForm.doctors.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {allUsers.filter(u => u.role === 'doctor').map(doctor => (
                  <label key={doctor.id} className="flex items-center space-x-2 p-2 bg-white rounded-lg cursor-pointer hover:bg-green-100">
                    <input
                      type="checkbox"
                      checked={groupForm.doctors.includes(doctor.id)}
                      onChange={() => toggleUserInGroup(doctor.id, 'doctors')}
                      className="rounded text-green-600"
                    />
                    <span className="text-sm text-gray-700">
                      Dr. {doctor.first_name} {doctor.last_name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Sélectionner les patients * ({groupForm.patients.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {allUsers.filter(u => u.role === 'patient').map(patient => (
                  <label key={patient.id} className="flex items-center space-x-2 p-2 bg-white rounded-lg cursor-pointer hover:bg-blue-100">
                    <input
                      type="checkbox"
                      checked={groupForm.patients.includes(patient.id)}
                      onChange={() => toggleUserInGroup(patient.id, 'patients')}
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm text-gray-700">
                      {patient.first_name} {patient.last_name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <h3 className="font-bold text-purple-900 mb-3 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Ajouter des co-administrateurs (optionnel) ({groupForm.admin_ids.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {allUsers.filter(u => u.role === 'admin' && u.id !== user.id).map(admin => (
                <label key={admin.id} className="flex items-center space-x-2 p-2 bg-white rounded-lg cursor-pointer hover:bg-purple-100">
                  <input
                    type="checkbox"
                    checked={groupForm.admin_ids.includes(admin.id)}
                    onChange={() => toggleUserInGroup(admin.id, 'admin_ids')}
                    className="rounded text-purple-600"
                  />
                  <span className="text-sm text-gray-700">
                    {admin.first_name} {admin.last_name}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-purple-600 mt-2">Vous serez automatiquement ajouté comme administrateur</p>
          </div>

          <button
            onClick={createGroup}
            className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-xl py-3 font-semibold transition-all shadow-lg"
          >
            ✅ Créer le groupe
          </button>
        </div>
      </div>
    </div>
  )

  // Modal d'ajout de patient par le médecin
  
const AddPatientModal = () => {

  /* --------Callbacks mémoïsés (évite re-render) -------- */
  const handleFirstName = useCallback((e) => setPatientForm(p => ({ ...p, first_name: e.target.value })), []);
  const handleLastName  = useCallback((e) => setPatientForm(p => ({ ...p, last_name: e.target.value })), []);
  const handleUsername  = useCallback((e) => setPatientForm(p => ({ ...p, username: e.target.value })), []);
  const handlePhone     = useCallback((e) => setPatientForm(p => ({ ...p, phone: e.target.value })), []);
  const handlePassword  = useCallback((e) => setPatientForm(p => ({ ...p, password: e.target.value })), []);
  const handlePasswordConfirm = useCallback((e) => setPatientForm(p => ({ ...p, password_confirm: e.target.value })), []);

  const onSubmit = (e) => {
    e.preventDefault(); // ← empêche le submit implicite qui pique le focus
    createPatient();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Ajouter un nouveau patient</h2>
          <button onClick={() => setShowAddPatientModal(false)} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Bloc stable : fieldset + key */}
        <form key="patient-form" onSubmit={onSubmit} className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              💡 Créez un compte pour votre patient. Vous devrez lui communiquer ses identifiants de manière sécurisée.
            </p>
          </div>

          {/* Prénom / Nom */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
              <input key="patient-firstname" type="text" value={patientForm.first_name} onChange={handleFirstName} placeholder="Ahmed" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
              <input key="patient-lastname" type="text" value={patientForm.last_name} onChange={handleLastName} placeholder="Benali" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2"><User className="w-4 h-4 inline mr-2" />Nom d'utilisateur *</label>
            <input key="patient-username" type="text" value={patientForm.username} onChange={handleUsername} placeholder="ahmed123" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-gray-500 mt-1">Le patient utilisera ce nom pour se connecter</p>
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <input key="patient-phone" type="tel" value={patientForm.phone} onChange={handlePhone} placeholder="+213 555 123 456" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2"><Lock className="w-4 h-4 inline mr-2" />Mot de passe *</label>
            <input key="patient-password" type="password" value={patientForm.password} onChange={handlePassword} placeholder="Min. 8 caractères" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Confirmation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2"><Lock className="w-4 h-4 inline mr-2" />Confirmer le mot de passe *</label>
            <input key="patient-password-confirm" type="password" value={patientForm.password_confirm} onChange={handlePasswordConfirm} placeholder="Retapez le mot de passe" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Bouton */}
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 font-semibold transition-colors">✅ Créer le patient</button>
        </form>
      </div>
    </div>
  );
}

  // Modal de gestion des utilisateurs
  const UsersModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h2>
          <button onClick={() => setShowUsersModal(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3">
          {allUsers.map(userItem => (
            <div key={userItem.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`rounded-full p-3 ${
                    userItem.role === 'admin' ? 'bg-purple-100' :
                    userItem.role === 'doctor' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <User className={`w-6 h-6 ${
                      userItem.role === 'admin' ? 'text-purple-600' :
                      userItem.role === 'doctor' ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {userItem.username} {userItem.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">{userItem.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        userItem.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        userItem.role === 'doctor' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {userItem.role === 'admin' ? 'Administrateur' :
                         userItem.role === 'doctor' ? 'Médecin' : 'Patient'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        userItem.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {userItem.is_active ? '● Actif' : '● Inactif'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleUserStatus(userItem.id, userItem.is_active)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      userItem.is_active 
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {userItem.is_active ? 'Désactiver' : 'Activer'}
                  </button>
                  {userItem.id !== user.id && (
                    <button
                      onClick={() => deleteUser(userItem.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition-colors"
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
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>
    </div>
  )

  // Modal des statistiques
  const StatsModal = () => {
    const totalPatients = allUsers.filter(u => u.role === 'patient').length || patients.length
    const totalDoctors = allUsers.filter(u => u.role === 'doctor').length || 3
    const totalResults = results.length
    const newResults = results.filter(r => r.status === 'new').length
    const consultedResults = results.filter(r => r.status === 'viewed').length
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Statistiques du système</h2>
            <button onClick={() => setShowStatsModal(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
              <Users className="w-10 h-10 mb-3 opacity-80" />
              <h3 className="text-3xl font-bold mb-1">{totalPatients}</h3>
              <p className="text-blue-100">Patients inscrits</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
              <User className="w-10 h-10 mb-3 opacity-80" />
              <h3 className="text-3xl font-bold mb-1">{totalDoctors}</h3>
              <p className="text-green-100">Médecins actifs</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
              <FileText className="w-10 h-10 mb-3 opacity-80" />
              <h3 className="text-3xl font-bold mb-1">{totalResults}</h3>
              <p className="text-purple-100">Résultats totaux</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
              <BarChart3 className="w-10 h-10 mb-3 opacity-80" />
              <h3 className="text-3xl font-bold mb-1">{newResults}</h3>
              <p className="text-orange-100">Nouveaux résultats</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-3">Résultats par statut</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Nouveaux (non consultés)</span>
                  <span className="font-bold text-red-600">{newResults}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Consultés</span>
                  <span className="font-bold text-green-600">{consultedResults}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-blue-600">{totalResults}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-3">Activité récente</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">📊 Taux de consultation: <span className="font-bold text-green-600">{totalResults > 0 ? Math.round((consultedResults / totalResults) * 100) : 0}%</span></p>
                <p className="text-gray-600">📈 Moyenne par patient: <span className="font-bold text-blue-600">{totalPatients > 0 ? (totalResults / totalPatients).toFixed(1) : 0}</span></p>
                <p className="text-gray-600">👨‍⚕️ Moyenne par médecin: <span className="font-bold text-purple-600">{totalDoctors > 0 ? (totalResults / totalDoctors).toFixed(1) : 0}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Modal de configuration
   
     
     
  
  const ConfigModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Configuration système</h2>
          <button onClick={() => setShowConfigModal(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Paramètres généraux
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Inscriptions ouvertes</span>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium">
                  Activé
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Validation manuelle des comptes</span>
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium">
                  Désactivé
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Notifications par email</span>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium">
                  Activé
                </button>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
            <h3 className="font-bold text-purple-900 mb-3 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Sécurité
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code administrateur
                </label>
                <input
                  type="text"
                  value={ADMIN_SECRET_CODE}
                  disabled
                  className="w-full px-4 py-2 bg-white border border-purple-300 rounded-lg text-gray-500"
                />
                <p className="text-xs text-purple-600 mt-1">
                  Modifiez ce code dans le fichier source pour plus de sécurité
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Authentification à deux facteurs</span>
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium">
                  Bientôt disponible
                </button>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
            <h3 className="font-bold text-green-900 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Gestion des fichiers
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Taille max des fichiers</span>
                <span className="font-bold text-green-700">10 MB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Formats acceptés</span>
                <span className="font-bold text-green-700">PDF, JPEG, PNG</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Stockage utilisé</span>
                <span className="font-bold text-green-700">2.4 GB / 100 GB</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
            <h3 className="font-bold text-orange-900 mb-3 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications système
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Configurez les types de notifications automatiques envoyées aux utilisateurs
            </p>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-700">Nouveau résultat disponible</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-700">Nouveau message reçu</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-700">Rappel de rendez-vous</span>
              </label>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl py-3 font-semibold hover:from-blue-600 hover:to-purple-600 transition-all">
            💾 Sauvegarder les modifications
          </button>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <img src="https://img.freepik.com/vecteurs-premium/logo-du-laboratoire-medical_880781-1942.jpg" alt="Logo" className="w-20 h-20" />

            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">ErraziLab</h1>
            <p className="text-gray-500">Plateforme médicale sécurisée</p>
          </div>

          {!isSignup ? (
            // PAGE DE CONNEXION
            <React.Fragment key="login-form">
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {loginError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Patients: utilisez votre nom d'utilisateur | Médecins/Admins: utilisez votre email
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-lg py-3 font-semibold transition-all shadow-lg"
                >
                  Se connecter
                </button>
                <button
        onClick={() => setShowChangePasswordModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 flex items-center space-x-2 "
      style={{ display: 'none' }}   >
        <Lock className="w-4 h-4" />
        <span>Changer mon mot de passe</span>
      </button>
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
            <ChangePassword onSuccess={() => setShowChangePasswordModal(false)} />
          </div>
        </div>
      )}
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Pas encore de compte ?{' '}
                  <button 
                    onClick={() => setIsSignup(true)}
                    className="text-blue-500 hover:text-blue-600 font-semibold"
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
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {signupError}
                </div>
              )}

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle *
                  </label>
                  <select
                    value={signupForm.role}
                    onChange={(e) => {
                      console.log('Changement de rôle vers:', e.target.value)
                      setSignupForm(prev => ({...prev, role: e.target.value}))
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">---</option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Médecin</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>

                {signupForm.role === 'admin' && (
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lock className="w-5 h-5 text-yellow-600" />
                      <label className="text-sm font-semibold text-yellow-800">
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
                      className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <p className="text-xs text-yellow-700 mt-2">
                      🔐 Code requis pour créer un compte administrateur
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {signupForm.role === 'patient' ? (
                  // PATIENT : Nom d'utilisateur (pas d'email)
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Utilisez ce nom d'utilisateur pour vous connecter
                    </p>
                  </div>
                ) : (
                  // MEDECIN / ADMIN : Email
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={() => {
                    console.log('🔍 État du formulaire avant soumission:', signupForm)
                    handleSignup()
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-lg py-3 font-semibold transition-all shadow-lg"
                >
                  S'inscrire
                </button>
                
                {signupForm.role === 'admin' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                      💡 <strong>Code administrateur actuel:</strong> MEDICLINIC2025
                      <br />
                      <span className="text-blue-600">
                        (Changez la constante ADMIN_SECRET_CODE dans le code pour plus de sécurité)
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
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
                    className="text-blue-500 hover:text-blue-600 font-semibold"
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
                className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 pb-24">
        {view === 'home' && (
          user?.role === 'patient' ? <PatientHomeView /> :
          user?.role === 'doctor' ? <DoctorHomeView /> :
          <AdminHomeView />
        )}
        {view === 'results' && <ResultsView />}
        {view === 'notifications' && <NotificationsView />}
        {view === 'chat' && <ChatView />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-2xl mx-auto flex justify-around py-3">
          <button
            onClick={() => setView('home')}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors ${
              view === 'home' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Accueil</span>
          </button>

          <button
            onClick={() => setView('results')}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors relative ${
              view === 'results' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <FileText className="w-6 h-6" />
            <span className="text-xs font-medium">Résultats</span>
            {newResultsCount > 0 && (
              <span className="absolute top-0 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {newResultsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setView('notifications')}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors relative ${
              view === 'notifications' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <Bell className="w-6 h-6" />
            <span className="text-xs font-medium">Alertes</span>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setView('chat')}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors ${
              view === 'chat' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-medium">Messages</span>
          </button>
        </div>
      </nav>

      {showUploadModal && <UploadModal />}
      {showAddPatientModal && <AddPatientModal />}
      {showUsersModal && <UsersModal />}
      {showGroupsModal && <GroupsModal />}
      {showCreateGroupModal && <CreateGroup />}
      {showChangePasswordModal && <ChangePassword onSuccess={() => setShowChangePasswordModal(false)} />}
      {showStatsModal && <StatsModal />}
      {showConfigModal && <ConfigModal />}

    </div>
  )
}

export default App