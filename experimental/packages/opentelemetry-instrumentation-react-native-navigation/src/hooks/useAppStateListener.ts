import { AppState, AppStateStatus } from 'react-native';
import { useEffect } from 'react';

// import pkg from 'react-native';
// const { AppState } = pkg;

// import react from 'react';
// const { useEffect } = react;

type CallbackFn = (currentState: AppStateStatus) => void;

const useAppStateListener = (callback?: CallbackFn) => {
  useEffect(() => {
    const handleAppStateChange = (currentState: AppStateStatus) => {
      callback?.(currentState);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [callback]);
};

export default useAppStateListener;
