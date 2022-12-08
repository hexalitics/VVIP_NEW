import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {navigationRef} from '../helper/helpers';
import {MyTabBar} from './CustomNavigation/BottomTabNavigation';

//Splash
import Splash from '../screen/splash/splash';

//Auth
import Initial from '../screen/auth/initial';
import Login from '../screen/auth/login';
import SignUp from '../screen/auth/signUp';
import Verification from '../screen/auth/verification';
import UserName from '../screen/auth/userName';

//Customer
import Home from '../screen/customer/home';
import MyVvips from '../screen/customer/MyVvips';
import Venues from '../screen/customer/Venues';
import VenuesInvite from '../screen/customer/venues/VenuesInvite';
import ContinueAddedContacts from '../screen/customer/venues/ContinueAddedContacts';
import Invite from '../screen/customer/venues/Invite';
import CheckIn from '../screen/customer/checkIn/CheckIn';
import ProfileMenu from '../screen/customer/profile/ProfileMenu';
import AboutUs from '../screen/customer/profile/AboutUs';
import TermsConditions from '../screen/customer/profile/TermsConditions';
import ContactUs from '../screen/customer/profile/ContactUs';
import EditInvite from '../screen/customer/venues/EditInvite';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Customertabnavigation() {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{headerShown: false}}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="MyVvips" component={MyVvips} />
      <Tab.Screen name="Venues" component={Venues} />
    </Tab.Navigator>
  );
}

function CustomerScreens() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Customertabnavigation"
        component={Customertabnavigation}
      />
      <Stack.Screen name="CheckIn" component={CheckIn} />
      <Stack.Screen name="ProfileMenu" component={ProfileMenu} />
      <Stack.Screen name="VenuesInvite" component={VenuesInvite} />
      <Stack.Screen name="Invite" component={Invite} />
      <Stack.Screen name="EditInvite" component={EditInvite} />
      <Stack.Screen
        name="ContinueAddedContacts"
        component={ContinueAddedContacts}
      />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="TermsConditions" component={TermsConditions} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
    </Stack.Navigator>
  );
}
const MyTheme = {
  dark: false,
  colors: {},
};

function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef} theme={MyTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Initial" component={Initial} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Verification" component={Verification} />
        <Stack.Screen name="UserName" component={UserName} />
        <Stack.Screen name="CustomerScreens" component={CustomerScreens} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
