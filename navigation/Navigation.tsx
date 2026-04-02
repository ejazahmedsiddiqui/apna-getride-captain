import {createStaticNavigation, StaticParamList} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from "./screens/Home";
import SettingsScreen from "./screens/Settings";
import LoginScreen from "./auth/Login";
import ProfileScreen from "./profile/Profile";
import Layout from '../components/Layout'
import ProfileKycScreen from "./profile/ProfileKyc";
const isUserLoggedIn = () => {
    return false
}

const RootStack = createNativeStackNavigator({
    // screens: {
    //     // Common screens
    // },
    initialRouteName: 'Login',
    screenOptions: {
        headerShown: false,
        contentStyle: { flex: 1 },
    },
    groups: {
        // User screens
        User: {
            screens: {
                Home: {
                    screen: (props) => <Layout><HomeScreen {...props} /></Layout>,
                },
                Settings: (props) => <Layout><SettingsScreen {...props} /></Layout>,
                Profile: (props) => <Layout><ProfileScreen {...props} /></Layout>,
            },
        },
        // Auth screens
        Guest: {
            // if: () => !isUserLoggedIn(),
            screens: {
                Login: LoginScreen,
            },
        },
        Kyc: {
            screens: {
                Kyc: ProfileKycScreen
            }
        }
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