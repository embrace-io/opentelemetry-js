import { EventsRegistry, Navigation } from 'react-native-navigation';
import { AppState } from 'react-native';
import { useRef } from 'react';
import { cleanup, render } from '@testing-library/react-native';

import { ATTRIBUTES } from '../src/utils/spanCreator';
import { expect } from 'chai';
import sinon from 'sinon';
import { NativeNavigationTracker } from '../src';
import useProvider from './hooks/useProvider';

const mockDidAppearListener = sinon.stub();
const mockDidDisappearListener = sinon.stub();

const AppWithProvider = ({ shouldPassProvider = true }) => {
  const provider = useProvider();
  const ref = useRef(Navigation.events());

  return (
    <NativeNavigationTracker
      ref={ref}
      provider={shouldPassProvider ? provider : undefined}
    >
      my app goes here
    </NativeNavigationTracker>
  );
};

describe('NativeNavigationTracker.tsx', () => {
  const mockConsoleDir = sinon.stub(AppState, 'addEventListener');
  // const mockAddEventListener = sinon.stub(console, 'dir');

  beforeEach(() => {
    sinon.stub(Navigation, 'events').returns({
      registerAppLaunchedListener: sinon.stub(),
      registerComponentDidAppearListener: mockDidAppearListener,
      registerComponentDidDisappearListener: mockDidDisappearListener,
    } as unknown as EventsRegistry);
  });

  afterEach(() => {
    sinon.restore();
    cleanup();
  });

  it('should render a component that implements <NavigationTracker /> without passing a provider', () => {
    const screen = render(<AppWithProvider shouldPassProvider={false} />);

    expect(mockDidAppearListener.calledOnce).to.be.true;
    expect(mockDidAppearListener.calledWith(sinon.match.func)).to.be.true;

    const mockDidAppearListenerCall = mockDidAppearListener.getCall(0).args[0];

    mockDidAppearListenerCall({ componentName: 'initial-test-view' });
    expect(mockDidDisappearListener.calledOnce).to.be.true;
    expect(mockDidDisappearListener.calledWith(sinon.match.func)).to.be.true;

    const mockDidDisappearListenerCall =
      mockDidDisappearListener.getCall(0).args[0];

    mockDidDisappearListenerCall({ componentName: 'initial-test-view' });

    expect(
      mockConsoleDir.calledWith(
        sinon.match({
          name: 'initial-test-view',
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

    mockDidAppearListenerCall({ componentName: 'second-test-view' });
    mockDidDisappearListenerCall({ componentName: 'second-test-view' });

    expect(
      mockConsoleDir.calledWith(
        sinon.match({
          name: 'second-test-view',
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

    expect(mockDidAppearListener.calledOnce).to.be.true;
    expect(mockDidAppearListener.calledWith(sinon.match.func)).to.be.true;

    const mockDidAppearListenerCall = mockDidAppearListener.getCall(0).args[0];

    mockDidAppearListenerCall({ componentName: 'initial-test-view' });
    expect(mockDidDisappearListener.calledOnce).to.be.true;
    expect(mockDidDisappearListener.calledWith(sinon.match.func)).to.be.true;

    const mockDidDisappearListenerCall =
      mockDidDisappearListener.getCall(0).args[0];

    mockDidDisappearListenerCall({ componentName: 'initial-test-view' });

    expect(
      mockConsoleDir.calledWith(
        sinon.match({
          name: 'initial-test-view',
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

    mockDidAppearListenerCall({ componentName: 'second-test-view' });
    mockDidDisappearListenerCall({ componentName: 'second-test-view' });

    expect(
      mockConsoleDir.calledWith(
        sinon.match({
          name: 'second-test-view',
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
    const screen = render(<AppWithProvider shouldPassProvider={true} />);
    const mockDidAppearListenerCall = mockDidAppearListener.getCall(0).args[0];
    const mockDidDisappearListenerCall =
      mockDidDisappearListener.getCall(0).args[0];
    // const handleAppStateChange = mockAddEventListener.getCall(0).args[1];

    mockDidAppearListenerCall({ componentName: 'initial-view-after-launch' });

    // handleAppStateChange('background');

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

    // handleAppStateChange('active');

    mockDidDisappearListenerCall({
      componentName: 'initial-view-after-launch',
    });

    mockDidAppearListenerCall({ componentName: 'next-view' });

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

    // handleAppStateChange('background');

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

    // handleAppStateChange('active');
    expect(screen.getByText('my app goes here')).to.exist;
  });
});
