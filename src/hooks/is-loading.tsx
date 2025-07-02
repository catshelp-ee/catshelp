export async function isLoadingWrapper<T>(
  callback: () => Promise<T>,
  setter: (isLoading: boolean) => void
): Promise<T> {
  try {
    setter(true);
    const result = await callback();
    return result;
  } finally {
    setter(false);
  }
}
