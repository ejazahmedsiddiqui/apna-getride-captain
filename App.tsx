import Navigation from "./navigation/Navigation";
import {GestureHandlerRootView,} from 'react-native-gesture-handler';
import UserProvider from "./context/UserContext";
import {useAppTheme} from "./hooks/useAppTheme";

export default function App() {
    const {theme} = useAppTheme();

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <UserProvider>
                <Navigation theme={theme}/>
            </UserProvider>
        </GestureHandlerRootView>
    );
}