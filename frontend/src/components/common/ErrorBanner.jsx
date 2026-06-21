import './ErrorBanner.css';

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-banner">
      <div className="error-banner-content">
        <span className="error-icon">⚠</span>
        <p className="error-message">{message}</p>
      </div>
      {onDismiss && (
        <button className="error-dismiss" onClick={onDismiss} aria-label="Dismiss error">
          ✕
        </button>
      )}
    </div>
  );
}
