const ErrorBanner = ({ message }) => (
  <div className="error-banner" role="alert">
    <p>{message || 'Unable to load data. Please try again later.'}</p>
  </div>
);

export default ErrorBanner;
