import { useState } from 'react';
import { useVeloCity } from '../context/VeloCityContext';
import { useTranslation } from '../context/TranslationContext';
import Button from '../components/Button';
import ConfettiFireworks from '../components/ConfettiFireworks';
import { motion, AnimatePresence } from 'framer-motion';
import { Fuel, Mail, Lock, User, Phone, AlertCircle, Car, Bike, Truck, DollarSign, Building2, X, Sparkles } from 'lucide-react';
import './Auth.css';

export default function Login({ initialMode = 'login', onClose }) {
  const { state, login, register, registerVehicle, setCurrency, CURRENCY_RATES, ASSOCIATIONS, FUEL_AVAILABILITY } = useVeloCity();
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(initialMode === 'register' ? false : true);
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
    tankCapacity: 35,
    owner_name: '',
    phone: '',
    photo: null,
    association: 'none'
  });
  const [showVehicleReg, setShowVehicleReg] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [registeredVehicle, setRegisteredVehicle] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isLogin) {
      const result = await login(formData.username, formData.password);
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
    } else {
      if (formData.role === 'driver' || formData.role === 'fleet_owner') {
        setShowVehicleReg(true);
        setLoading(false);
        return;
      }
      
      const result = await register(formData);
      if (result.success) {
        setShowConfetti(true);
        setIsLogin(true);
        setError('');
      } else {
        setError(result.detail || 'Registration failed');
      }
    }
    setLoading(false);
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const userResult = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phone: formData.phone,
      role: formData.role
    });

    if (userResult.success || userResult.user) {
      const vehicleResult = await registerVehicle({
        ...vehicleData,
        owner_name: formData.name,
        phone: formData.phone
      }, userResult.user?.id);

      if (vehicleResult.success) {
        setShowConfetti(true);
        setRegisteredVehicle(vehicleResult.vehicle);
      }
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

  if (registeredVehicle) {
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

          <div className="registered-vehicle-info">
            <h3>{registeredVehicle.plate}</h3>
            <span className={`vehicle-type-badge ${registeredVehicle.type}`}>
              {registeredVehicle.type.toUpperCase()} QR
            </span>
          </div>

          <div className="qr-info">
            <p>Your QR code has been generated. Show it at any VeloCity fuel station to fill up.</p>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={() => window.location.reload()}>
            Go to Login
          </Button>
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
      <ConfettiFireworks trigger={showConfetti} />
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
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Sign in to access your dashboard' : 'Register to start using VeloCity'}</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>

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