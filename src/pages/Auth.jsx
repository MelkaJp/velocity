import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useVeloCity } from '../context/VeloCityContext';
import { useTranslation } from '../context/TranslationContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Fuel, Mail, Lock, User, Phone, AlertCircle, Car, Bike, Truck, DollarSign, Building2, X, Sparkles, Home, Loader, Key, ArrowLeft, Download, Printer, QrCode, Users } from 'lucide-react';
import { demoUsers, validateDemoUser, demoAccountsSummary } from '../data/demoUsers';
import './Auth.css';

export default function Login({ initialMode = 'login' }) {
  const { state, dispatch, login: veloLogin, register, registerVehicle, setCurrency, CURRENCY_RATES, ASSOCIATIONS, FUEL_AVAILABILITY, forgotPassword, resetPassword } = useVeloCity();
  const { signIn: supabaseSignIn, signUp: supabaseSignUp, profile } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const urlMode = params.mode;
  const queryMode = new URLSearchParams(window.location.search).get('mode');
  
  const isFromSignup = window.location.pathname.includes('/signup') || window.location.pathname.includes('/register');
  const isFromSignin = window.location.pathname.includes('/signin');
  const effectiveMode = initialMode !== 'login' ? initialMode : (queryMode || urlMode || 'login');
  const [isLogin, setIsLogin] = useState(effectiveMode === 'login');
  const [showForgotPassword, setShowForgotPassword] = useState(effectiveMode === 'forgot');
  const [showResetPassword, setShowResetPassword] = useState(effectiveMode === 'reset');
  const [resetToken, setResetToken] = useState(params.token || '');
  const [resetMessage, setResetMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'driver'
  });
  const [vehicleData, setVehicleData] = useState({
    type: 'bajaj',
    plate: '',
    make: '',
    model: '',
    year: '',
    capacity: '',
    fuel_type: 'petrol',
    association: 'none'
  });
  const [showVehicleReg, setShowVehicleReg] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [registeredVehicle, setRegisteredVehicle] = useState(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (urlMode === 'forgot') {
      setShowForgotPassword(true);
    } else if (urlMode === 'reset') {
      setShowResetPassword(true);
    }
  }, [urlMode]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    if (roleParam) {
      setFormData(prev => ({ ...prev, role: roleParam }));
    }
  }, []);
   
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/app');
    }
  }, [state.isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isLogin) {
      const username = formData.username || formData.email.split('@')[0];
      const password = formData.password;
      
      // First try demo login
      const demoResult = validateDemoUser(username, password);
      if (demoResult.success) {
        dispatch({ type: 'LOGIN', payload: { user: demoResult.user, token: 'demo-token' } });
        navigate(demoResult.user.portal);
        setLoading(false);
        return;
      }
      
      // Fallback to Supabase
      const email = formData.email || formData.username;
      const result = await supabaseSignIn(email, password);
      if (!result.success) {
        setError(result.error || 'Login failed');
        setLoading(false);
        return;
      }
      
      const role = profile?.role || state.user?.role;
      navigate('/app');
    } else {
      if (formData.role === 'driver' || formData.role === 'fleet_owner') {
        setShowVehicleReg(true);
        setLoading(false);
        return;
      }
      
      const email = formData.email || formData.username + '@velocity.com';
      const password = formData.password;
      
      const result = await supabaseSignUp(email, password, {
        fullName: formData.name,
        phone: formData.phone,
        role: formData.role,
      });
      
      if (result.success) {
        setIsLogin(true);
        setError('');
      } else {
        setError(result.error || 'Registration failed');
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResetMessage('');
    
    const result = await forgotPassword(formData.email);
    if (result.success) {
      setResetMessage(result.message || 'Password reset link sent to your email');
    } else {
      setError(result.error || 'Failed to send reset email');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResetMessage('');
    
    const result = await resetPassword(resetToken, formData.password);
    if (result.success) {
      setResetMessage('Password reset successful! Please sign in.');
      setTimeout(() => {
        setShowResetPassword(false);
        setIsLogin(true);
      }, 2000);
    } else {
      setError(result.error || 'Failed to reset password');
    }
    setLoading(false);
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userResult = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        role: formData.role
      });

      if (!userResult.success) {
        setError(userResult.error || userResult.detail || 'Failed to create account');
        setLoading(false);
        return;
      }

      if (userResult.token) {
        localStorage.setItem('velocity_user', JSON.stringify(userResult.user));
        localStorage.setItem('velocity_token', userResult.token);
      }

      const vehicleResult = await registerVehicle({
        ...vehicleData,
        owner_name: formData.name,
        phone: formData.phone
      }, userResult.user?.id, userResult.token);

      if (vehicleResult.success) {
        setRegisteredVehicle(vehicleResult.vehicle);
      } else {
        setError(vehicleResult.error || 'Failed to register vehicle');
      }
    } catch (err) {
      setError('An error occurred during registration');
    }
    
    setLoading(false);
  };

  const roles = [
    { value: 'driver', label: 'Driver' },
    { value: 'fleet_owner', label: 'Fleet Owner' },
  ];

  const vehicleTypes = [
    { value: 'bajaj', label: 'Bajaj (Green)', icon: Bike, maxTank: 50 },
    { value: 'auto', label: 'Automobile (Blue)', icon: Car, maxTank: 150 },
    { value: 'truck', label: 'Truck (Black)', icon: Truck, maxTank: 500 },
  ];

  if (showForgotPassword) {
    return (
      <div className="auth-page">
        <div className="auth-bg"></div>
        <motion.div 
          className="auth-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="auth-header">
            <Key size={40} />
            <h1>Reset Password</h1>
            <p>Enter your email to receive a password reset link</p>
          </div>

          {error && (
            <div className="auth-error">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {resetMessage && (
            <div className="auth-success">
              <Sparkles size={18} />
              {resetMessage}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="auth-form">
            <Link to="/auth" className="back-home-btn">
              <Home size={18} />
              <span>Back to Login</span>
            </Link>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon">
                <Mail size={18} />
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (showResetPassword) {
    return (
      <div className="auth-page">
        <div className="auth-bg"></div>
        <motion.div 
          className="auth-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="auth-header">
            <Lock size={40} />
            <h1>New Password</h1>
            <p>Enter the reset token and your new password</p>
          </div>

          {error && (
            <div className="auth-error">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {resetMessage && (
            <div className="auth-success">
              <Sparkles size={18} />
              {resetMessage}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="auth-form">
            <Link to="/auth" className="back-home-btn">
              <Home size={18} />
              <span>Back to Login</span>
            </Link>

            <div className="form-group">
              <label>Reset Token</label>
              <div className="input-icon">
                <Key size={18} />
                <input 
                  type="text" 
                  placeholder="Enter reset token"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div className="input-icon">
                <Lock size={18} />
                <input 
                  type="password" 
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const downloadQRCode = () => {
    const svg = qrCodeRef.current?.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `VELOCITY_QR_${registeredVehicle.plate}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const printQRCode = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const qrData = JSON.stringify({
      id: registeredVehicle.id,
      plate: registeredVehicle.plate,
      type: registeredVehicle.type,
      owner_name: registeredVehicle.owner_name,
      phone: registeredVehicle.phone,
      qr_code: registeredVehicle.qr_code,
      createdAt: registeredVehicle.createdAt
    });
    
    const svg = qrCodeRef.current?.querySelector('svg');
    const svgData = svg ? new XMLSerializer().serializeToString(svg) : '';
    
    printWindow.document.write(`
      <html>
        <head>
          <title>VELOCITY QR Code - ${registeredVehicle.plate}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
            .qr-container { margin: 20px 0; }
            .info { margin: 20px 0; text-align: left; display: inline-block; }
            .info p { margin: 8px 0; }
            .label { font-weight: bold; color: #333; }
            h1 { color: #06D6A0; margin-bottom: 10px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>VELOCITY Fuel Card</h1>
          <div class="qr-container">${svgData}</div>
          <div class="info">
            <p><span class="label">Plate:</span> ${registeredVehicle.plate}</p>
            <p><span class="label">Type:</span> ${registeredVehicle.type.toUpperCase()}</p>
            <p><span class="label">Owner:</span> ${registeredVehicle.owner_name}</p>
            <p><span class="label">Phone:</span> ${registeredVehicle.phone}</p>
            <p><span class="label">QR Code:</span> ${registeredVehicle.qr_code}</p>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (registeredVehicle) {
    const qrData = JSON.stringify({
      id: registeredVehicle.id,
      plate: registeredVehicle.plate,
      type: registeredVehicle.type,
      owner_name: registeredVehicle.owner_name,
      phone: registeredVehicle.phone,
      qr_code: registeredVehicle.qr_code,
      createdAt: registeredVehicle.createdAt
    });

    return (
      <div className="auth-page">
        <div className="auth-bg"></div>
        <motion.div 
          className="auth-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="auth-header">
            <Fuel size={40} />
            <h1>Registration Complete!</h1>
            <p>Your vehicle has been registered successfully</p>
          </div>

          <div className="qr-display-container" ref={qrCodeRef}>
            <div className="qr-code-wrapper">
              <QRCodeSVG 
                value={qrData}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="registered-vehicle-info">
              <h3>{registeredVehicle.plate}</h3>
              <span className={`vehicle-type-badge ${registeredVehicle.type}`}>
                {registeredVehicle.type.toUpperCase()} QR
              </span>
            </div>
            <div className="qr-code-id">{registeredVehicle.qr_code}</div>
          </div>

          <div className="qr-code-actions">
            <button className="btn-secondary" onClick={downloadQRCode}>
              <Download size={18} />
              <span>Download PNG</span>
            </button>
            <button className="btn-secondary" onClick={printQRCode}>
              <Printer size={18} />
              <span>Print</span>
            </button>
          </div>

          <div className="qr-info">
            <p>Your QR code has been generated. Show it at any VeloCity fuel station to fill up.</p>
            <p className="qr-info-note">Scan to instantly verify your vehicle and fill fuel</p>
          </div>

          <button className="btn-primary" onClick={() => window.location.reload()}>
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  if (showVehicleReg) {
    return (
      <div className="auth-page">
        <div className="auth-bg"></div>
        <motion.div 
          className="auth-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="auth-header">
            <Fuel size={40} />
            <h1>Register Your Vehicle</h1>
            <p>Add your vehicle details to get started</p>
          </div>

          {error && (
            <div className="auth-error">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleVehicleSubmit} className="auth-form">
            <div className="subscription-notice">
              <Fuel size={20} />
              <div>
                <strong>Subscription Fee: 1,000 ETB</strong>
                <p>One-time payment for SMS alerts and fuel tracking access</p>
              </div>
            </div>

            <div className="form-group">
              <label>Vehicle Type</label>
              <div className="vehicle-type-selector">
                {vehicleTypes.map(vt => (
                  <button
                    key={vt.value}
                    type="button"
                    className={`vehicle-type-btn ${vehicleData.type === vt.value ? 'active' : ''} ${vt.value}`}
                    onClick={() => setVehicleData({...vehicleData, type: vt.value, tankCapacity: vt.maxTank / 2})}
                  >
                    <vt.icon size={20} />
                    <span>{vt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>License Plate</label>
              <div className="input-icon">
                <Car size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. RAB 123D"
                  value={vehicleData.plate}
                  onChange={(e) => setVehicleData({...vehicleData, plate: e.target.value.toUpperCase()})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tank Capacity (Liters)</label>
              <div className="input-icon">
                <Fuel size={18} />
                <input 
                  type="number" 
                  placeholder={`Max: ${vehicleTypes.find(v => v.value === vehicleData.type)?.maxTank}L`}
                  value={vehicleData.tankCapacity}
                  onChange={(e) => setVehicleData({...vehicleData, tankCapacity: parseInt(e.target.value) || 0})}
                  max={vehicleTypes.find(v => v.value === vehicleData.type)?.maxTank}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-icon">
                <Phone size={18} />
                <input 
                  type="tel" 
                  placeholder="+251 912 345 678"
                  value={vehicleData.phone}
                  onChange={(e) => setVehicleData({...vehicleData, phone: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Your Photo (for verification)</label>
              <div className="photo-upload">
                {photoPreview ? (
                  <div className="photo-preview">
                    <img src={photoPreview} alt="Preview" />
                    <button type="button" onClick={() => { setVehicleData({...vehicleData, photo: null}); setPhotoPreview(null); }}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setVehicleData({...vehicleData, photo: reader.result});
                          setPhotoPreview(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Driver Association (Optional)</label>
              <select 
                value={vehicleData.association}
                onChange={(e) => setVehicleData({...vehicleData, association: e.target.value})}
              >
                {ASSOCIATIONS.map(assoc => (
                  <option key={assoc.id} value={assoc.id}>
                    {assoc.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>

            <button type="button" className="btn-link" onClick={() => setShowVehicleReg(false)}>
              Back to Account Setup
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-bg"></div>
      
      <motion.div 
        className="auth-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="auth-header">
          <div className="auth-logo">
            <Fuel size={40} />
            <span>VeloCity</span>
          </div>
          <h1>{isLogin ? t('welcomeBack', 'Welcome Back') : t('createAccount', 'Create Account')}</h1>
          <p>{isLogin ? t('signIn', 'Sign in to access your dashboard') : t('register', 'Register to start using VeloCity')}</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <Link to="/" className="back-home-btn">
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Account Type</label>
                <div className="role-selector">
                  {roles.map(role => (
                    <button
                      key={role.value}
                      type="button"
                      className={`role-btn ${formData.role === role.value ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, role: role.value})}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <div className="input-icon">
                  <User size={18} />
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <div className="input-icon">
                  <Mail size={18} />
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-icon">
                  <Phone size={18} />
                  <input 
                    type="tel" 
                    placeholder="+251 912 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {isLogin && (
            <>
              <div className="form-group">
                <label>Username</label>
                <div className="input-icon">
                  <User size={18} />
                  <input 
                    type="text" 
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Password</label>
            <div className="input-icon">
              <Lock size={18} />
              <input 
                type="password" 
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          {isLogin && (
            <button 
              type="button" 
              className="btn-link forgot-password-link"
              onClick={() => { setShowForgotPassword(true); setError(''); setResetMessage(''); }}
            >
              <Key size={16} />
              <span>Forgot Password?</span>
            </button>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <div className="btn-loader"></div>
                <span className="btn-text">Signing in...</span>
              </>
            ) : (
              <span className="btn-text">{isLogin ? 'Sign In' : 'Continue'}</span>
            )}
          </button>

          <div className="auth-switch">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          <div className="currency-selector">
            <span>Currency:</span>
            <select 
              value={state.currency} 
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="ETB">ETB (Br)</option>
            </select>
            <span className="rate-info">
              1 USD = {CURRENCY_RATES.ETB} ETB
            </span>
          </div>
        </form>
      </motion.div>
    </div>
  );
}