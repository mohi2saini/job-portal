import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.VITE_BACKEND_URL}/api/jobs/${id}`)
      .then(res => setJob(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const apply = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in to apply');
    try {
      await axios.post(`${process.env.VITE_BACKEND_URL}/api/applications/apply`, { jobId: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Application submitted successfully!');
    } catch (err) {
      console.log(err.response.data);
      alert('Failed to apply. Try again.');
    }
  };

  if (!job) return <div className="content"><p className="loading">Loading...</p></div>;

  return (
    <div className="content">
      <h1 className="page-title">{job.title}</h1>
      <div className="job-details">
        <p className="job-detail"><strong>Company:</strong> {job.company}</p>
        <p className="job-detail"><strong>Description:</strong> {job.description}</p>
        <p className="job-detail"><strong>Eligibility:</strong> {job.eligibility}</p>
        <p className="job-detail"><strong>Posted by:</strong> {job.postedBy.name}</p>
        <button onClick={apply} className="button">Apply Now</button>
      </div>
    </div>
  );
}

export default JobDetails;