import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";

const initial = { firstName: "", lastName: "", email: "", password: "" };

export default function Register() {
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(null);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";
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
    /*  // Replace with real API call
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setBanner({ type: 'success', msg: 'Account created! Redirecting...' })
    setTimeout(() => navigate('/login'), 1500)
  */
    axios
      .post(
        "https://echomind-x5n4.onrender.com//api/auth/register",
        {
          email: form.email,
          fullName: {
            firstName: form.firstName,
            lastName: form.lastName,
          },
          password: form.password,
        },
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        console.log(res);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        alert("Registration failed. Please try again.");
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
        <h2 className="card-title">Create Account</h2>
        <p className="card-subtitle">Join EchoMind today — it's free.</p>

        {banner && <div className={`banner ${banner.type}`}>{banner.msg}</div>}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="input-wrap">
              <label>First Name</label>
              <input
                type="text"
                placeholder="John"
                value={form.firstName}
                onChange={set("firstName")}
                className={errors.firstName ? "error" : ""}
              />
              {errors.firstName && (
                <span className="field-error">{errors.firstName}</span>
              )}
            </div>
            <div className="input-wrap">
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                value={form.lastName}
                onChange={set("lastName")}
                className={errors.lastName ? "error" : ""}
              />
              {errors.lastName && (
                <span className="field-error">{errors.lastName}</span>
              )}
            </div>
          </div>

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
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={set("password")}
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating account…" : "Register"}
          </button>
        </form>

        <p className="form-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
