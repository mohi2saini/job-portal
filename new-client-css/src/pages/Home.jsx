import { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';

function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.VITE_BACKEND_URL}/api/jobs`)
      .then(res => {
        setJobs(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching jobs:', err);
        setJobs([]); // Set to empty array on error to prevent .map() errors
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="content"><p className="loading">Loading...</p></div>;

  return (
    <div className="content">
      <h1 className="page-title">Available Jobs</h1>
      <div className="job-list">
        {jobs.length > 0 ? (
          jobs.map(job => <JobCard key={job._id} job={job} />)
        ) : (
          <p className="no-jobs">No jobs available yet.</p>
        )}
      </div>
    </div>
  );
}

export default Home;