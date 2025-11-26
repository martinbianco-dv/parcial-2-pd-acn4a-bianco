function Snackbar({ open, type = "info", children }) {
  if (!open) return null;

  return (
    <div className={`snackbar snackbar-${type}`}>
      {children}
    </div>
  );
}

export default Snackbar;
