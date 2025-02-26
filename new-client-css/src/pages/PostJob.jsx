import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostJob() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [role, setRole] = useState('job');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in as a recruiter to post a job.');
      navigate('/login');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/jobs', 
        { title, company, description, eligibility, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Job posted successfully!');
      navigate('/'); 
    } catch (err) {
      console.error('Job posting error:', err.response?.data || err.message);
      alert('Failed to post job. ' + (err.response?.data?.msg || 'Check your credentials or server status.'));
    }
  };

  return (
    <div className="content">
      <h1 className="page-title">Post a Job</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Job Title"
          className="input"
          required
          maxLength={100}
        />
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company"
          className="input"
          required
          maxLength={100}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Job Description"
          className="input"
          rows="4"
          required
          maxLength={1000}
        />
        <input
          type="text"
          value={eligibility}
          onChange={(e) => setEligibility(e.target.value)}
          placeholder="Eligibility (e.g., B.Tech, 2+ years)"
          className="input"
          required
          maxLength={500}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="input"
        >
          <option value="job">Job</option>
          <option value="internship">Internship</option>
        </select>
        <button type="submit" className="button">Post Job</button>
      </form>
    </div>
  );
}

export default PostJob;