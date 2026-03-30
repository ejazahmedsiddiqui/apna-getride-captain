import {createStaticNavigation, StaticParamList} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from "./screens/Home";
import SettingsScreen from "./screens/Settings";
import LoginScreen from "./auth/Login";

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
    },
    groups: {
        // User screens
        User: {
            // if: isUserLoggedIn,
            screenOptions: {
                headerShown: false,
            },
            screens: {
                Home: {
                    screen: HomeScreen,
                    options: {
                        title: 'Overview',
                    },
                },
                Settings: SettingsScreen,
            },
        },
        // Auth screens
        Guest: {
            // if: () => !isUserLoggedIn(),
            screens: {
                Login: LoginScreen,
            },
        },
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