import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ErrorBanner from '../common/ErrorBanner';
import { bedApi } from '../../api/bedApi';
import '../ward/WardForm.css';

export default function AddBedModal({ isOpen, onClose, wardId, onCreated }) {
  const [bedNumber, setBedNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await bedApi.create(wardId, { bed_number: bedNumber.trim() });
      setBedNumber('');
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create bed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Bed">
      <ErrorBanner message={error} onDismiss={() => setError('')} />
      <form onSubmit={handleSubmit} className="ward-form">
        <div className="form-group">
          <label htmlFor="bed-number">Bed Number *</label>
          <input
            id="bed-number"
            type="text"
            value={bedNumber}
            onChange={(e) => setBedNumber(e.target.value)}
            placeholder="e.g. B-101"
            required
            maxLength={50}
          />
        </div>
        <div className="form-actions">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Add Bed</Button>
        </div>
      </form>
    </Modal>
  );
}
