import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to access the dashboard.');
      navigate('/login');
      return;
    }

    fetchDashboardData(token);
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    try {
      setLoading(true);
      setError('');
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const role = decoded.role;

      if (role === 'student') {
        const res = await axios.get(`${process.env.VITE_BACKEND_URL}/api/applications/my-applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(Array.isArray(res.data) ? res.data : []); // Ensure data is an array
      } else if (role === 'recruiter') {
        const res = await axios.get(`${process.env.VITE_BACKEND_URL}/api/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(Array.isArray(res.data) ? res.data.filter(job => job.postedBy.toString() === decoded.id.toString()) : []);
      }
    } catch (err) {
      console.error('Dashboard error:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to load dashboard. Check your network or server status.');
      console.log('Dashboard error details:', err); // Log instead of alert for better UX
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="content"><p className="loading">Loading...</p></div>;
  if (error) return <div className="content"><p className="no-jobs">{error}</p></div>;

  return (
    <div className="content">
      {JSON.parse(atob(localStorage.getItem('token')?.split('.')[1] || '{}')).role === 'student' ? (
        <>
          <h2 className="section-title">My Applications</h2>
          <div className="job-list">
            {data.length > 0 ? (
              data.map(app => (
                <div key={app._id} className="job-card">
                  <p className="job-title">{app.job.title} - <span className="job-status">{app.status}</span></p>
                  <p className="job-company">Company: {app.job.company}</p>
                  <p className="job-date">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="no-jobs">No applications yet.</p>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="section-title">My Posted Jobs</h2>
          <div className="job-list">
            {data.length > 0 ? (
              data.map(job => (
                <div key={job._id} className="job-card">
                  <p className="job-title">{job.title}</p>
                  <p className="job-company">Company: {job.company}</p>
                  <p className="job-description">{job.description.substring(0, 100)}...</p>
                  <p className="job-detail"><strong>Eligibility:</strong> {job.eligibility}</p>
                </div>
              ))
            ) : (
              <p className="no-jobs">No jobs posted yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;