export interface INavigationContainer {
  addListener: (
    event: 'state',
    callback: (args: { name: string }) => void
  ) => void;
  getCurrentRoute: () => { name: string };
}

export interface INativeNavigationContainer {
  registerComponentDidAppearListener: (
    cb: (args: { componentName: string }) => void
  ) => void;
  registerComponentDidDisappearListener: (
    cb: (args: { componentName: string }) => void
  ) => void;
}
