import { AppState } from 'react-native';
import { ForwardedRef, useRef } from 'react';
import { cleanup, render } from '@testing-library/react-native';
// import { useNavigationContainerRef } from '@react-navigation/native';

import useProvider from './hooks/useProvider';

import { NavRef } from '../src/hooks/useNavigationTracker';
import { ATTRIBUTES } from '../src/utils/spanCreator';
import { expect } from 'chai';
import sinon from 'sinon';
import { NavigationTracker } from '../src';

const mockAddListener = sinon.stub();
const mockGetCurrentRoute = sinon.stub();

sinon.stub(AppState, 'addEventListener');

const AppWithProvider = ({ shouldPassProvider = true }) => {
  const ref = useRef();
  const provider = useProvider();

  return (
    <NavigationTracker
      ref={ref as unknown as ForwardedRef<NavRef>}
      provider={shouldPassProvider ? provider : undefined}
    >
      my app goes here
    </NavigationTracker>
  );
};

describe('NavigationTracker.tsx', () => {
  const mockAddEventListener = sinon.stub(AppState, 'addEventListener');
  const mockConsoleDir = sinon.stub(console, 'dir');

  beforeEach(() => {
    //   sinon.stub(useNavigationContainerRef, 'default').returns({
    //     current: {
    //       getCurrentRoute: mockGetCurrentRoute,
    //       addListener: mockAddListener,
    //       dispatch: sinon.stub(),
    //       navigate: sinon.stub(),
    //       reset: sinon.stub(),
    //       goBack: sinon.stub(),
    //       isReady: sinon.stub(),
    //       canGoBack: sinon.stub(),
    //       setParams: sinon.stub(),
    //       isFocused: sinon.stub(),
    //       getId: sinon.stub(),
    //       getParent: sinon.stub(),
    //       getState: sinon.stub(),
    //     },
    //   });
  });

  afterEach(() => {
    sinon.restore();
    cleanup();
  });

  it('should render a component that implements <NavigationTracker /> without passing a provider', () => {
    const screen = render(<AppWithProvider shouldPassProvider={false} />);

    expect(mockAddListener.calledWith('state', sinon.match.func)).to.be.true;
    const mockNavigationListenerCall = mockAddListener.getCall(0).args[1];

    mockGetCurrentRoute.returns({ name: 'first-view-test' });
    mockNavigationListenerCall();

    mockGetCurrentRoute.returns({ name: 'second-view-test' });
    mockNavigationListenerCall();

    // after render a view and then navigate to a different one the spanEnd should be called and it should register a complete span
    expect(
      mockConsoleDir.calledWith(
        sinon.match({
          name: 'first-view-test',
          traceId: sinon.match.string,
          attributes: {
            [ATTRIBUTES.initialView]: true,
            [ATTRIBUTES.appState]: 'active',
          },
          timestamp: sinon.match.number,
          duration: sinon.match.number,
        }),
        sinon.match({ depth: sinon.match.number })
      )
    ).to.be.true;

    mockGetCurrentRoute.returns({ name: 'second-view-test' });
    mockNavigationListenerCall();

    mockGetCurrentRoute.returns({ name: 'third-view-test' });
    mockNavigationListenerCall();

    // again after render a view and then navigate to a different one (the third) the spanEnd should be called and it should register a complete span
    expect(
      mockConsoleDir.calledWith(
        sinon.match({
          name: 'second-view-test',
          traceId: sinon.match.string,
          attributes: {
            [ATTRIBUTES.initialView]: false,
            [ATTRIBUTES.appState]: 'active',
          },
          timestamp: sinon.match.number,
          duration: sinon.match.number,
        }),
        sinon.match({ depth: sinon.match.number })
      )
    ).to.be.true;

    expect(screen.getByText('my app goes here')).to.exist;
  });

  it('should render a component that implements <NavigationTracker /> passing a custom provider', () => {
    const screen = render(<AppWithProvider shouldPassProvider={true} />);

    expect(mockAddListener.calledWith('state', sinon.match.func)).to.be.true;
    const mockNavigationListenerCall = mockAddListener.getCall(0).args[1];

    mockGetCurrentRoute.returns({ name: 'first-view-test' });
    mockNavigationListenerCall();

    mockGetCurrentRoute.returns({ name: 'second-view-test' });
    mockNavigationListenerCall();

    // after render a view and then navigate to a different one the spanEnd should be called and it should register a complete span
    expect(
      mockConsoleDir.calledWith(
        sinon.match({
          name: 'first-view-test',
          traceId: sinon.match.string,
          attributes: {
            [ATTRIBUTES.initialView]: true,
            [ATTRIBUTES.appState]: 'active',
          },
          timestamp: sinon.match.number,
          duration: sinon.match.number,
        }),
        sinon.match({ depth: sinon.match.number })
      )
    ).to.be.true;

    mockGetCurrentRoute.returns({ name: 'second-view-test' });
    mockNavigationListenerCall();

    mockGetCurrentRoute.returns({ name: 'third-view-test' });
    mockNavigationListenerCall();

    // again after render a view and then navigate to a different one (the third) the spanEnd should be called and it should register a complete span
    expect(
      mockConsoleDir.calledWith(
        sinon.match({
          name: 'second-view-test',
          traceId: sinon.match.string,
          attributes: {
            [ATTRIBUTES.initialView]: false,
            [ATTRIBUTES.appState]: 'active',
          },
          timestamp: sinon.match.number,
          duration: sinon.match.number,
        }),
        sinon.match({ depth: sinon.match.number })
      )
    ).to.be.true;

    expect(screen.getByText('my app goes here')).to.exist;
  });

  it('should start and end spans when the app changes the status between foreground/background', () => {
    // app launches
    const screen = render(<AppWithProvider shouldPassProvider={true} />);
    const mockNavigationListenerCall = mockAddListener.getCall(0).args[1];
    const handleAppStateChange = mockAddEventListener.getCall(0).args[1];

    // app launches, navigation listener is called
    mockGetCurrentRoute.returns({ name: 'initial-view-after-launch' });
    // - start the first span
    mockNavigationListenerCall();

    // app goes to background
    handleAppStateChange('background');

    // - end the first span (without changing the navigation)
    expect(
      mockConsoleDir.calledWith(
        sinon.match({
          name: 'initial-view-after-launch',
          traceId: sinon.match.string,
          attributes: {
            [ATTRIBUTES.initialView]: true,
            [ATTRIBUTES.appState]: 'background',
          },
          timestamp: sinon.match.number,
          duration: sinon.match.number,
        }),
        sinon.match({ depth: sinon.match.number })
      )
    ).to.be.true;

    // app goes back to foreground
    handleAppStateChange('active');

    // - start the second span (same view)

    // app navigates to a different view
    mockGetCurrentRoute.returns({ name: 'next-view' });
    mockNavigationListenerCall();

    // - end the second span
    expect(
      mockConsoleDir.calledWith(
        sinon.match({
          name: 'initial-view-after-launch',
          traceId: sinon.match.string,
          attributes: {
            [ATTRIBUTES.initialView]: false,
            [ATTRIBUTES.appState]: 'active',
          },
          timestamp: sinon.match.number,
          duration: sinon.match.number,
        }),
        sinon.match({ depth: sinon.match.number })
      )
    ).to.be.true;

    // app goes to background
    handleAppStateChange('background');

    // - end the third span
    expect(
      mockConsoleDir.calledWith(
        sinon.match({
          name: 'next-view',
          traceId: sinon.match.string,
          attributes: {
            [ATTRIBUTES.initialView]: false,
            [ATTRIBUTES.appState]: 'background',
          },
          timestamp: sinon.match.number,
          duration: sinon.match.number,
        }),
        sinon.match({ depth: sinon.match.number })
      )
    ).to.be.true;

    handleAppStateChange('active');
    expect(screen.getByText('my app goes here')).to.exist;
  });
});
