import './Loader.css';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader-container">
      <div className="loader-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="loader-text">{text}</p>
    </div>
  );
}
