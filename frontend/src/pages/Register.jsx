import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FormField from '../components/FormField';
import Alert from '../components/Alert';
import { registerUser, extractErrorMessage } from '../api/authApi';
import { validateRegisterForm } from '../utils/validation';

const EMPTY_FORM = { username: '', email: '', password: '', confirmPassword: '' };

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validation = validateRegisterForm(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    setServerError('');
    try {
      await registerUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      // Clear the password out of local state immediately; it never needs
      // to exist in memory once the request has been sent.
      setForm(EMPTY_FORM);
      navigate('/login', {
        state: { successMessage: 'Account created. You can now log in.' },
      });
    } catch (err) {
      setServerError(extractErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="shell">
      <div className="panel">
        <div className="panel-head">
          <span className="eyebrow">Create account</span>
          <h1 className="panel-title">Register</h1>
          <p className="panel-sub">
            Sign up with a username, email, and password to access the dashboard.
          </p>
        </div>

        <Alert type="error">{serverError}</Alert>

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="e.g. levi_b"
            autoComplete="username"
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
          <FormField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Re-enter your password"
            autoComplete="new-password"
          />

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="link-row">
          Already have an account?{' '}
          <Link to="/login">
            <button type="button">Log in</button>
          </Link>
        </div>

        
      </div>
    </div>
  );
}
