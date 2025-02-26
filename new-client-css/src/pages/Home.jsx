import { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';

function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get('${process.env.VITE_BACKEND_URL}/api/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  }, []);

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