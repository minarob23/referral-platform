'use client';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { jobsApi } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobsApi.getJobs();
        setJobs(res.data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
        {loading ? (
          <p>Loading jobs...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white shadow rounded-lg p-6 border flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                  <p className="text-gray-500 mb-4">{job.location}</p>
                  <p className="text-gray-700 mb-6">
                    {job.description?.substring(0, 100)}...
                  </p>
                </div>
                <Link
                  href={`/jobs/${job.id}/refer`}
                  className="bg-blue-600 text-white text-center p-2 rounded hover:bg-blue-700"
                >
                  Refer a Friend &rarr;
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
