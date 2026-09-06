'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ProtectedRoute from '@/components/ProtectedRoute';
import { aiApi, referralsApi, jobsApi } from '@/lib/api';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ReferPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id as string;
  const { register, handleSubmit, setValue, watch } = useForm();
  const [job, setJob] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState('');

  const friendName = watch('friendName');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobsApi.getJobs();
        const found = res.data.find((j: any) => j.id === id || j.id === Number(id));
        setJob(found);
      } catch (err) {
        console.error('Failed to fetch job', err);
      }
    };
    fetchJob();
  }, [id]);

  const onSuggestNote = async () => {
    if (!friendName) {
      setError("Please enter your friend's name first");
      return;
    }
    setLoadingAi(true);
    setError('');
    try {
      const res = await aiApi.suggestNote({ jobId: id, friendName });
      setValue('note', res.data.note);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to suggest note');
    } finally {
      setLoadingAi(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await referralsApi.createReferral({ ...data, jobId: id });
      setSuccess(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit referral');
    } finally {
      setSubmitting(false);
    }
  };

  if (!job) return <div className="p-6">Loading job details...</div>;

  if (success) {
    return (
      <ProtectedRoute>
        <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow rounded">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Referral Submitted!</h2>
          <div className="mb-6 p-4 bg-gray-50 border rounded">
            <h3 className="font-semibold mb-2">AI Fit Summary:</h3>
            <p>{success.fitSummary || 'N/A'}</p>
          </div>
          <Link href="/referrals" className="text-blue-600 hover:underline">
            View My Referrals &rarr;
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto p-6 mt-10">
        <div className="bg-white shadow rounded-lg p-6 border mb-6">
          <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
          <p className="text-gray-700">{job.description}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Refer {friendName || 'a Friend'}</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1">Friend's Name <span className="text-red-500">*</span></label>
              <input type="text" {...register('friendName')} className="w-full border p-2 rounded" required />
            </div>
            <div>
              <label className="block mb-1">Friend's Email <span className="text-red-500">*</span></label>
              <input type="email" {...register('friendEmail')} className="w-full border p-2 rounded" required />
            </div>
            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block">Note (optional)</label>
                <button
                  type="button"
                  onClick={onSuggestNote}
                  disabled={loadingAi}
                  className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 disabled:opacity-50"
                >
                  {loadingAi ? 'Generating...' : '✨ Suggest a Note'}
                </button>
              </div>
              <textarea {...register('note')} className="w-full border p-2 rounded h-32" />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Referral'}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
