import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(null);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    setErrors({});
    setLoading(true);
    /* // Replace with real API call
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setBanner({ type: 'success', msg: 'Login successful! Redirecting...' })
    setTimeout(() => navigate('/'), 1500) */

    axios.post(
      "http://localhost:3000/api/auth/login",
      {
        email: form.email,
        password: form.password,
      },
      {
        withCredentials: true,
      },
    ).then((res) => {
      console.log(res);
      navigate("/");
    }).catch((err) => {
      console.log(err); 
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="page">
      <button
        className="theme-toggle"
        onClick={toggle}
        aria-label="Toggle theme"
      >
        {dark ? "☀️" : "🌙"}
      </button>

      <div className="card">
        <h2 className="card-title">Welcome Back</h2>
        <p className="card-subtitle">Sign in to continue to EchoMind.</p>

        {banner && <div className={`banner ${banner.type}`}>{banner.msg}</div>}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="input-wrap">
            <label>Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={set("email")}
              className={errors.email ? "error" : ""}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="input-wrap">
            <label>Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={set("password")}
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="form-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
