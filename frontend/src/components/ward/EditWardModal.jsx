import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ErrorBanner from '../common/ErrorBanner';
import { wardApi } from '../../api/wardApi';
import './WardForm.css';

export default function EditWardModal({ isOpen, onClose, ward, onUpdated }) {
  const [name, setName] = useState('');
  const [floor, setFloor] = useState('');
  const [capacity, setCapacity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ward) {
      setName(ward.name || '');
      setFloor(ward.floor || '');
      setCapacity(ward.capacity !== null && ward.capacity !== undefined ? String(ward.capacity) : '');
    }
  }, [ward]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await wardApi.update(ward.id, {
        name: name.trim(),
        floor: floor.trim() || null,
        capacity: capacity ? parseInt(capacity, 10) : null,
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update ward');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Ward">
      <ErrorBanner message={error} onDismiss={() => setError('')} />
      <form onSubmit={handleSubmit} className="ward-form">
        <div className="form-group">
          <label htmlFor="edit-ward-name">Ward Name *</label>
          <input
            id="edit-ward-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. General Ward A"
            required
            maxLength={100}
          />
        </div>
        <div className="form-group">
          <label htmlFor="edit-ward-floor">Floor</label>
          <input
            id="edit-ward-floor"
            type="text"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            placeholder="e.g. 3rd Floor"
            maxLength={50}
          />
        </div>
        <div className="form-group">
          <label htmlFor="edit-ward-capacity">Capacity</label>
          <input
            id="edit-ward-capacity"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="e.g. 20"
            min="0"
          />
        </div>
        <div className="form-actions">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}
