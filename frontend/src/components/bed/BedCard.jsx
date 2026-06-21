import './BedCard.css';

const STATUS_CONFIG = {
  available: { label: 'Available', color: 'green', icon: '🟢' },
  occupied: { label: 'Occupied', color: 'red', icon: '🔴' },
  maintenance: { label: 'Maintenance', color: 'amber', icon: '🟡' },
};

const STATUS_OPTIONS = ['available', 'occupied', 'maintenance'];

export default function BedCard({ bed, onEdit, onDelete, onStatusChange }) {
  const config = STATUS_CONFIG[bed.status] || STATUS_CONFIG.available;

  return (
    <div className={`bed-card bed-card-${config.color}`}>
      <div className="bed-card-header">
        <div className="bed-card-number">
          <span className="bed-icon">{config.icon}</span>
          <span className="bed-number-text">{bed.bed_number}</span>
        </div>
        <div className="bed-card-actions">
          <button className="bed-action-btn" onClick={() => onEdit(bed)} title="Edit bed">
            ✏️
          </button>
          <button className="bed-action-btn bed-action-delete" onClick={() => onDelete(bed)} title="Delete bed">
            🗑️
          </button>
        </div>
      </div>
      <div className="bed-card-status">
        <select
          className={`bed-status-select bed-select-${config.color}`}
          value={bed.status}
          onChange={(e) => onStatusChange(bed.id, e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
