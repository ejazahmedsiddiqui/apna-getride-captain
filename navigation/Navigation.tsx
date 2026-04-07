import {createStaticNavigation, StaticParamList} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from "./screens/Home";
import SettingsScreen from "./screens/Settings";
import LoginScreen from "./auth/Login";
import ProfileScreen from "./profile/Profile";
import Layout from '../components/Layout';
import ProfileKycScreen from "./profile/ProfileKyc";
import {useUserContext} from '../context/UserContext';
import VehicleInfoScreen from "./profile/VehicleInfo";

function useIsAuthenticated() {
    const {token} = useUserContext();
    return !!token;
}

const RootStack = createNativeStackNavigator({
    groups: {
        User: {
            if: useIsAuthenticated,
            screens: {
                Profile: {
                    screen: (props) => <Layout><ProfileScreen {...props} /></Layout>,
                },
                VehicleInfo: VehicleInfoScreen,
                Settings: {
                    screen: (props) => <Layout><SettingsScreen {...props} /></Layout>,
                },
                Kyc: {
                    screen: (props) => <Layout><ProfileKycScreen {...props} /></Layout>,
                },
            }
        },
        Guest: {
            if: () => !useIsAuthenticated(),
            screens: {
                Login: LoginScreen,
                Home: {
                    screen: (props) => <Layout><HomeScreen {...props} /></Layout>,
                },
            }
        }
    },
    // screens: {
    //     Login: LoginScreen,
    //     Home: {
    //         screen: (props) => <Layout><HomeScreen {...props} /></Layout>,
    //     },
    //     Settings: {
    //         screen: (props) => <Layout><SettingsScreen {...props} /></Layout>,
    //     },
    //     Profile: {
    //         screen: (props) => <Layout><ProfileScreen {...props} /></Layout>,
    //     },
    //     Kyc: ProfileKycScreen,
    // },
    // initialRouteName: 'Login',
    screenOptions: {
        headerShown: false,
        contentStyle: {flex: 1},
    },
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {
        }
    }
}

const Navigation = createStaticNavigation(RootStack);

export default Navigation;