import { Link } from 'react-router-dom';
import '../styles/jobcard.css';

function JobCard({ job }) {
  return (
    <div className="job-card">
      <h2 className="job-title">{job.title}</h2>
      <p className="job-company">Company: {job.company}</p>
      <p className="job-description">{job.description.substring(0, 100)}...</p>
      <Link to={`/job/${job._id}`} className="job-link">View Details</Link>
    </div>
  );
}

export default JobCard;