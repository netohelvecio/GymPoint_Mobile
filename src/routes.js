import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import SignIn from '~/pages/SignIn';

import Checkins from '~/pages/Checkins';

export default (signedIn = false) =>
  createAppContainer(
    createSwitchNavigator(
      {
        Sign: createSwitchNavigator({
          SignIn,
        }),
        App: createBottomTabNavigator(
          {
            Checkins,
          },
          {
            resetOnBlur: true,
            tabBarOptions: {
              keyboardHidesTabBar: true,
              activeTintColor: '#ee4d64',
              inactiveBackgroundColor: '#ccc',
              labelStyle: {
                fontSize: 12,
              },
              style: {
                backgroundColor: '#fff',
                borderTopWidth: 0,
                height: 55,
                paddingBottom: 4,
                paddingTop: 6,
              },
            },
          }
        ),
      },
      {
        initialRouteName: signedIn ? 'App' : 'Sign',
      }
    )
  );
