import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ErrorBanner from '../common/ErrorBanner';
import { bedApi } from '../../api/bedApi';
import '../ward/WardForm.css';

export default function EditBedModal({ isOpen, onClose, bed, onUpdated }) {
  const [bedNumber, setBedNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bed) {
      setBedNumber(bed.bed_number || '');
    }
  }, [bed]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await bedApi.update(bed.id, { bed_number: bedNumber.trim() });
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update bed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Bed">
      <ErrorBanner message={error} onDismiss={() => setError('')} />
      <form onSubmit={handleSubmit} className="ward-form">
        <div className="form-group">
          <label htmlFor="edit-bed-number">Bed Number *</label>
          <input
            id="edit-bed-number"
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
          <Button type="submit" loading={loading}>Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}
