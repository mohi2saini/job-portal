import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('${process.env.VITE_BACKEND_URL}/api/auth/register', { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.log(err.response.data);
      alert('Registration failed. Try a different email.');
    }
  };

  return (
    <div className="content">
      <h1 className="page-title">Register</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          className="input"
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="input"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="input"
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="input"
        >
          <option value="student">Student</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button type="submit" className="button">Register</button>
      </form>
    </div>
  );
}

export default Register;