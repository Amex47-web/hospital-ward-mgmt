import { useNavigate } from 'react-router-dom';
import './WardCard.css';

export default function WardCard({ ward, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="ward-card" onClick={() => navigate(`/wards/${ward.id}`)}>
      <div className="ward-card-header">
        <div className="ward-card-title-group">
          <h3 className="ward-card-name">{ward.name}</h3>
          {ward.floor && <span className="ward-card-floor">Floor {ward.floor}</span>}
        </div>
        <div className="ward-card-actions" onClick={(e) => e.stopPropagation()}>
          <button className="ward-action-btn" onClick={() => onEdit(ward)} title="Edit ward">
            ✏️
          </button>
          <button className="ward-action-btn ward-action-delete" onClick={() => onDelete(ward)} title="Delete ward">
            🗑️
          </button>
        </div>
      </div>
      <div className="ward-card-stats">
        <div className="ward-stat">
          <span className="ward-stat-value">{ward.bed_count}</span>
          <span className="ward-stat-label">Beds</span>
        </div>
        {ward.capacity !== null && ward.capacity !== undefined && (
          <div className="ward-stat">
            <span className="ward-stat-value">{ward.capacity}</span>
            <span className="ward-stat-label">Capacity</span>
          </div>
        )}
      </div>
      <div className="ward-card-footer">
        <span className="ward-card-view">View details →</span>
      </div>
    </div>
  );
}
