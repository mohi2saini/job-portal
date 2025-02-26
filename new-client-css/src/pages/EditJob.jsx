import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/global.css';

function EditJob() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [job, setJob] = useState(location.state?.job || {});
  const [title, setTitle] = useState(job.title || '');
  const [company, setCompany] = useState(job.company || '');
  const [description, setDescription] = useState(job.description || '');
  const [eligibility, setEligibility] = useState(job.eligibility || '');
  const [role, setRole] = useState(job.role || 'job');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!job._id) {
      fetchJob();
    } else {
      setLoading(false);
    }
  }, [id, job._id]);

  const fetchJob = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in as a recruiter to edit jobs.');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setJob(res.data);
      setTitle(res.data.title);
      setCompany(res.data.company);
      setDescription(res.data.description);
      setEligibility(res.data.eligibility);
      setRole(res.data.role);
      setError('');
    } catch (err) {
      console.error('Error fetching job:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to load job. Check your network or server status.');
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in as a recruiter to edit jobs.');
      navigate('/login');
      return;
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/jobs/${id}`, 
        { title, company, description, eligibility, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Job updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Edit job error:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to update job. Try again.');
      alert(error);
    }
  };

  if (loading) return <div className="content"><p className="loading">Loading...</p></div>;
  if (error) return <div className="content"><p className="no-jobs">{error}</p></div>;

  return (
    <div className="content">
      <h1 className="page-title">Edit Job</h1>
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
        <button type="submit" className="button">Update Job</button>
      </form>
    </div>
  );
}

export default EditJob;