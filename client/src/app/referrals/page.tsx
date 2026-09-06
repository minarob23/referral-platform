'use client';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { referralsApi } from '@/lib/api';

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const res = await referralsApi.getReferrals();
        setReferrals(res.data);
      } catch (err) {
        console.error('Failed to fetch referrals', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic update
    setReferrals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    try {
      await referralsApi.updateStatus(id, newStatus);
    } catch (err) {
      console.error('Failed to update status', err);
      // Revert on failure
      const res = await referralsApi.getReferrals();
      setReferrals(res.data);
    }
  };

  const statuses = [
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'INTERVIEWED', label: 'Interviewed' },
    { value: 'HIRED', label: 'Hired' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Referrals</h1>
        {loading ? (
          <p>Loading...</p>
        ) : referrals.length === 0 ? (
          <p className="text-gray-500">You haven't referred anyone yet.</p>
        ) : (
          <div className="bg-white shadow rounded-lg border overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-4 font-medium text-gray-600">Friend's Name</th>
                  <th className="p-4 font-medium text-gray-600">Email</th>
                  <th className="p-4 font-medium text-gray-600">Job Title</th>
                  <th className="p-4 font-medium text-gray-600">Note</th>
                  <th className="p-4 font-medium text-gray-600">AI Fit Summary</th>
                  <th className="p-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r) => (
                  <tr key={r.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="p-4">{r.friendName}</td>
                    <td className="p-4">{r.friendEmail}</td>
                    <td className="p-4">{r.job?.title || 'Unknown Job'}</td>
                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={r.note}>{r.note || '-'}</td>
                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={r.fitSummary}>{r.fitSummary || '-'}</td>
                    <td className="p-4">
                      <select
                        value={r.status || 'SUBMITTED'}
                        onChange={(e) => handleStatusChange(r.id, e.target.value)}
                        className="border rounded p-1 text-sm bg-white"
                      >
                        {statuses.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
