import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import FormField from '../components/FormField';
import Alert from '../components/Alert';
import { loginUser, extractErrorMessage } from '../api/authApi';
import { validateLoginForm } from '../utils/validation';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Carries the "account created" message over from the Register page,
  // shown once and then cleared so a refresh doesn't repeat it.
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ''
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validation = validateLoginForm(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    setServerError('');
    setSuccessMessage('');
    try {
      const user = await loginUser({
        username: form.username.trim(),
        password: form.password,
      });
      login(user);
      setForm({ username: '', password: '' });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(extractErrorMessage(err, 'Login failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="shell">
      <div className="panel">
        <div className="panel-head">
          <span className="eyebrow">Welcome back</span>
          <h1 className="panel-title">Log in</h1>
          <p className="panel-sub">Enter your credentials to access your dashboard.</p>
        </div>

        <Alert type="success">{successMessage}</Alert>
        <Alert type="error">{serverError}</Alert>

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="Your username"
            autoComplete="username"
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Your password"
            autoComplete="current-password"
          />

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <div className="link-row">
          Don&apos;t have an account?{' '}
          <Link to="/register">
            <button type="button">Register</button>
          </Link>
        </div>

        
      </div>
    </div>
  );
}
