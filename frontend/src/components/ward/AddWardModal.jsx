import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ErrorBanner from '../common/ErrorBanner';
import { wardApi } from '../../api/wardApi';
import './WardForm.css';

export default function AddWardModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [floor, setFloor] = useState('');
  const [capacity, setCapacity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await wardApi.create({
        name: name.trim(),
        floor: floor.trim() || null,
        capacity: capacity ? parseInt(capacity, 10) : null,
      });
      setName('');
      setFloor('');
      setCapacity('');
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create ward');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Ward">
      <ErrorBanner message={error} onDismiss={() => setError('')} />
      <form onSubmit={handleSubmit} className="ward-form">
        <div className="form-group">
          <label htmlFor="ward-name">Ward Name *</label>
          <input
            id="ward-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. General Ward A"
            required
            maxLength={100}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ward-floor">Floor</label>
          <input
            id="ward-floor"
            type="text"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            placeholder="e.g. 3rd Floor"
            maxLength={50}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ward-capacity">Capacity</label>
          <input
            id="ward-capacity"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="e.g. 20"
            min="0"
          />
        </div>
        <div className="form-actions">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Create Ward</Button>
        </div>
      </form>
    </Modal>
  );
}
