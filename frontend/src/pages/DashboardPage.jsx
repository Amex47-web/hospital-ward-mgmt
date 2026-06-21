import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';
import { useWards } from '../hooks/useWards';
import StatCard from '../components/dashboard/StatCard';
import AddWardModal from '../components/ward/AddWardModal';
import EditWardModal from '../components/ward/EditWardModal';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorBanner from '../components/common/ErrorBanner';
import { wardApi } from '../api/wardApi';
import './DashboardPage.css';

const COLORS = ['#10b981', '#f59e0b']; // Green (Available), Orange (Occupied)

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const { wards, loading: wardsLoading, error: wardsError, refetch: refetchWards } = useWards();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editWard, setEditWard] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchStats = async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const res = await dashboardApi.getStats();
      setStats(res.data);
    } catch (err) {
      setStatsError(err.response?.data?.detail || 'Failed to load stats');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleWardCreated = () => {
    refetchWards();
    fetchStats();
  };

  const handleWardUpdated = () => {
    refetchWards();
    fetchStats();
  };

  const handleDeleteWard = async (ward) => {
    try {
      await wardApi.delete(ward.id);
      setDeleteConfirm(null);
      refetchWards();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete ward');
    }
  };

  // Prepare data for Doughnut Chart
  const pieData = stats ? [
    { name: 'Available Beds', value: stats.available_beds },
    { name: 'Occupied Beds', value: stats.occupied_beds }
  ] : [];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Overview of your hospital wards</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>+ Add Ward</Button>
      </div>

      {/* Stats Section */}
      {statsError && <ErrorBanner message={statsError} onDismiss={() => setStatsError(null)} />}
      {statsLoading ? (
        <Loader text="Loading statistics..." />
      ) : stats ? (
        <div className="stats-grid">
          <StatCard title="Total Wards" value={stats.total_wards} icon="🏥" color="purple" />
          <StatCard title="Total Beds" value={stats.total_beds} icon="🛏️" color="blue" />
          <StatCard title="Occupied Beds" value={stats.occupied_beds} icon="👤" color="amber" />
          <StatCard title="Available Beds" value={stats.available_beds} icon="🟢" color="green" />
        </div>
      ) : null}

      {/* Charts Section */}
      {!wardsLoading && wards.length > 0 && stats && (
        <div className="charts-container">
          {/* Doughnut Chart */}
          <div className="chart-card">
            <h3>Bed Occupancy Distribution</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart: Beds Per Ward */}
          <div className="chart-card">
            <h3>Beds Per Ward</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wards} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="bed_count" name="Total Beds" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stacked Bar Chart: Occupancy Comparison */}
          <div className="chart-card">
            <h3>Ward Occupancy Comparison</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wards} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Legend />
                  <Bar dataKey="occupied_beds" stackId="a" name="Occupied Beds" fill="#f59e0b" />
                  <Bar dataKey="available_beds" stackId="a" name="Available Beds" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Wards Capacity Cards Section */}
      <div className="wards-section">
        <h2 className="section-title">Ward Capacity Details</h2>
        {wardsError && <ErrorBanner message={wardsError} />}
        {wardsLoading ? (
          <Loader text="Loading wards..." />
        ) : wards.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏥</div>
            <h3>No wards yet</h3>
            <p>Create your first ward to start managing beds</p>
            <Button onClick={() => setShowAddModal(true)}>+ Create Ward</Button>
          </div>
        ) : (
          <div className="capacity-grid">
            {wards.map((ward) => {
              const capacity = ward.capacity || ward.bed_count || 1; // Prevent div by zero if capacity not set
              const percentage = Math.round((ward.occupied_beds / ward.bed_count) * 100) || 0;

              let progressColor = 'progress-green';
              if (percentage > 50 && percentage <= 80) progressColor = 'progress-orange';
              if (percentage > 80) progressColor = 'progress-red';

              return (
                <div key={ward.id} className="capacity-card">
                  <div className="capacity-header">
                    <h4>{ward.name}</h4>
                    <div className="capacity-actions">
                      <button className="action-btn" onClick={() => setEditWard(ward)}>✏️</button>
                      <button className="action-btn action-delete" onClick={() => setDeleteConfirm(ward)}>🗑️</button>
                    </div>
                  </div>

                  <div className="capacity-stats">
                    <div className="cap-stat">
                      <span className="cap-label">Total</span>
                      <span className="cap-value">{ward.bed_count}</span>
                    </div>
                    <div className="cap-stat">
                      <span className="cap-label">Occupied</span>
                      <span className="cap-value">{ward.occupied_beds}</span>
                    </div>
                    <div className="cap-stat">
                      <span className="cap-label">Available</span>
                      <span className="cap-value">{ward.available_beds}</span>
                    </div>
                  </div>

                  <div className="progress-section">
                    <div className="progress-text">
                      <span>{ward.occupied_beds} / {ward.bed_count} Beds</span>
                      <strong>{percentage}%</strong>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className={`progress-bar-fill ${progressColor}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="capacity-footer" style={{ marginTop: '1.5rem' }}>
                    <Link to={`/wards/${ward.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                      Manage Beds & Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddWardModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreated={handleWardCreated}
      />

      <EditWardModal
        isOpen={!!editWard}
        onClose={() => setEditWard(null)}
        ward={editWard}
        onUpdated={handleWardUpdated}
      />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h3 className="confirm-title">Delete Ward</h3>
            <p className="confirm-text">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
              {deleteConfirm.bed_count > 0 && (
                <> This will also delete <strong>{deleteConfirm.bed_count} bed{deleteConfirm.bed_count !== 1 ? 's' : ''}</strong>.</>
              )}
            </p>
            <div className="confirm-actions">
              <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => handleDeleteWard(deleteConfirm)}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
