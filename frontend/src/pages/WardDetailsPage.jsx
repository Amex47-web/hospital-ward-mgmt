import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWardDetails } from '../hooks/useBeds';
import { bedApi } from '../api/bedApi';
import BedCard from '../components/bed/BedCard';
import AddBedModal from '../components/bed/AddBedModal';
import EditBedModal from '../components/bed/EditBedModal';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorBanner from '../components/common/ErrorBanner';
import './WardDetailsPage.css';

export default function WardDetailsPage() {
  const { wardId } = useParams();
  const navigate = useNavigate();
  const { ward, beds, loading, error, refetch } = useWardDetails(wardId);
  const [showAddBed, setShowAddBed] = useState(false);
  const [editBed, setEditBed] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleStatusChange = async (bedId, status) => {
    try {
      await bedApi.updateStatus(bedId, status);
      refetch();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update status');
    }
  };

  const handleDeleteBed = async (bed) => {
    try {
      await bedApi.delete(bed.id);
      setDeleteConfirm(null);
      refetch();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete bed');
    }
  };

  if (loading) return <Loader text="Loading ward details..." />;
  if (error) return (
    <div className="ward-details-page">
      <ErrorBanner message={error} />
      <Button variant="secondary" onClick={() => navigate('/dashboard')}>← Back to Dashboard</Button>
    </div>
  );

  const occupied = beds.filter((b) => b.status === 'occupied').length;
  const available = beds.filter((b) => b.status === 'available').length;
  const maintenance = beds.filter((b) => b.status === 'maintenance').length;

  return (
    <div className="ward-details-page">
      <button className="back-btn" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <div className="ward-info-header">
        <div>
          <h1 className="ward-detail-title">{ward?.name}</h1>
          <div className="ward-meta">
            {ward?.floor && <span className="ward-meta-item">📍 Floor {ward.floor}</span>}
            {ward?.capacity != null && <span className="ward-meta-item">📐 Capacity: {ward.capacity}</span>}
          </div>
        </div>
        <Button onClick={() => setShowAddBed(true)}>+ Add Bed</Button>
      </div>

      {/* Bed Stats */}
      <div className="bed-stats-row">
        <div className="bed-stat-pill bed-stat-green">
          <span className="pill-dot green-dot"></span>
          Available: {available}
        </div>
        <div className="bed-stat-pill bed-stat-red">
          <span className="pill-dot red-dot"></span>
          Occupied: {occupied}
        </div>
        <div className="bed-stat-pill bed-stat-amber">
          <span className="pill-dot amber-dot"></span>
          Maintenance: {maintenance}
        </div>
      </div>

      {/* Beds Grid */}
      {beds.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛏️</div>
          <h3>No beds yet</h3>
          <p>Add beds to this ward to start tracking occupancy</p>
          <Button onClick={() => setShowAddBed(true)}>+ Add Bed</Button>
        </div>
      ) : (
        <div className="beds-grid">
          {beds.map((bed) => (
            <BedCard
              key={bed.id}
              bed={bed}
              onEdit={(b) => setEditBed(b)}
              onDelete={(b) => setDeleteConfirm(b)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddBedModal
        isOpen={showAddBed}
        onClose={() => setShowAddBed(false)}
        wardId={parseInt(wardId, 10)}
        onCreated={refetch}
      />

      <EditBedModal
        isOpen={!!editBed}
        onClose={() => setEditBed(null)}
        bed={editBed}
        onUpdated={refetch}
      />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h3 className="confirm-title">Delete Bed</h3>
            <p className="confirm-text">
              Are you sure you want to delete bed <strong>{deleteConfirm.bed_number}</strong>?
            </p>
            <div className="confirm-actions">
              <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => handleDeleteBed(deleteConfirm)}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
