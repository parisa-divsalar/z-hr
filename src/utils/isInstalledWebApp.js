const isInStandaloneMode = () => {
  return (
    window?.matchMedia('(display-mode: standalone)')?.matches ||
    window?.navigator?.standalone ||
    document?.referrer?.includes('android-app://')
  );
};

if (typeof window !== 'undefined') {
  window.isInstalled = isInStandaloneMode;
}

export default isInStandaloneMode;
