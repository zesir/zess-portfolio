export const useProjectToast = () => {
  const toastVisible = useState('toast-visible', () => false);
  const toastPrefix = useState('toast-prefix', () => '');
  const toastName = useState('toast-name', () => '');
  const toastSuffix = useState('toast-suffix', () => '');

  const show = (prefix: string, name: string, suffix: string, duration = 800) => {
    toastPrefix.value = prefix;
    toastName.value = name;
    toastSuffix.value = suffix;
    toastVisible.value = true;
    setTimeout(() => {
      toastVisible.value = false;
    }, duration);
  };

  return { toastVisible, toastPrefix, toastName, toastSuffix, show };
};
