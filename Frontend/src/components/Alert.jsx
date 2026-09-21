const VARIANT_STYLES = {
    loading: 'border-brandRed/30 bg-brandRed/5 text-brandRed',
    error: 'border-red-500/40 bg-red-500/10 text-red-200',
    success: 'border-green-500/40 bg-green-500/10 text-green-200',

}

const Alert = ({ variant = 'loading', children }) => {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`flex items-center gap-3 rounded border px-4 py-3 font-sans text-sm ${VARIANT_STYLES[variant]}`}
    >
      {variant === 'loading' && (
        <span className="h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-brandRed/50 border-t-brandRed" />
      )}
      {variant === 'error' && <span className="text-lg leading-none">⚠</span>}
      {variant === 'success' && <span className="text-lg leading-none">✓</span>}
      <span>{children}</span>
    </div>
  );
};

export default Alert