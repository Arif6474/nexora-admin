export const lazyLoad = (importFunc) => {
    return async () => ({
      Component: (await importFunc()).default,
    });
  };
  