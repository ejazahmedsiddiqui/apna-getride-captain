import {StyleSheet, Text, TouchableOpacity, View, Platform} from "react-native";
import React, {useMemo} from "react";
import {useNavigation, useNavigationState, useTheme} from "@react-navigation/native";
import {Home, Settings, User, UserCheck, UserPlusIcon} from "lucide-react-native";
import {BlurView} from "expo-blur";
import {LucideIcon} from "lucide-react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useUserContext} from "../context/UserContext";

type RouteName = keyof RootParamList;
type RootParamList = {
    Home: undefined;
    Settings: undefined;
    Profile: undefined;
    Login: undefined;
    Kyc: undefined;
};

interface NavLink {
    id: string;
    icon: LucideIcon;
    label: string;
    route: RouteName;  // was: string
}

type FooterProps = {
    blurTargetRef: React.RefObject<View | null>;
};

interface ThemeColors {
    text: string;
    background: string;
    card: string;
    border: string;
    notification: string;
    primary: string;
}

const links: NavLink[] = [
    {id: 'home', icon: Home, label: 'Home', route: 'Home'},
    {id: 'settings', icon: Settings, label: 'Settings', route: 'Settings'},
    {id: 'profile', icon: User, label: 'Profile', route: 'Profile'},
    {id: 'login', icon: UserPlusIcon, label: 'Login', route: 'Login'},
    {id: 'kyc', icon: UserCheck, label: 'KYC', route: "Kyc"},
];

const Footer = ({blurTargetRef}: FooterProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
    const {dark, colors} = useTheme();
    const styles = useMemo(() => createStyles(colors as ThemeColors, dark), [colors, dark]);
    const { isAuthenticated} = useUserContext();

    const ActiveLinks = isAuthenticated
        ? links.filter(link => link.id !== 'login')
        : links.filter(link => link.id !== 'profile');

const currentRoute = useNavigationState(
    (state) => state?.routes[state.index]?.name
);

const isActive = (route: RouteName): boolean => currentRoute === route;
const handleNavigation = (route: RouteName): void => {
    navigation.navigate(route);
};

return (
    <View style={styles.wrapper}>
        <BlurView
            style={styles.blurContainer}
            blurTarget={blurTargetRef}
            intensity={dark ? 50 : 80}
            tint={dark ? "dark" : "light"}
            blurMethod="dimezisBlurViewSdk31Plus"
        >
            <View style={styles.tintOverlay} pointerEvents="none"/>
            <View style={styles.topBorder} pointerEvents="none"/>

            {ActiveLinks.map((item: NavLink) => {
                const active = isActive(item.route);
                const IconComp = item.icon;
                return (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => handleNavigation(item.route)}
                        activeOpacity={0.7}
                        style={styles.item}
                    >
                        <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                            <IconComp
                                size={20}
                                color={active ? colors.text : colors.text + '80'}
                                strokeWidth={active ? 2.5 : 1.8}
                            />
                        </View>

                        <Text style={[styles.label, active && styles.labelActive]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </BlurView>
    </View>
);
}
;

const createStyles = (colors: ThemeColors, dark: boolean) => StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    blurContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 0,
        paddingTop: 10,
        paddingBottom: Platform.OS === 'android' ? 20 : 24,
        overflow: 'hidden',
        borderTopWidth: 0,
        borderTopColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.6)',
    },
    tintOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: dark
            ? 'rgba(10, 10, 10, 0.6)'
            : 'rgba(255, 255, 255, 0.7)',
    },
    topBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: dark
            ? 'rgba(255,255,255,0.12)'
            : 'rgba(255,255,255,0.6)',
    },
    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingVertical: 4,
        position: 'relative',
    },
    iconWrap: {
        width: 40,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapActive: {
        backgroundColor: dark
            ? 'rgba(255,255,255,0.22)'
            : 'rgba(0,0,0,0.17)',
        borderRadius: 12,
    },
    label: {
        fontSize: 10,
        fontWeight: '500',
        color: colors.text + '80',
        letterSpacing: 0.2,
    },
    labelActive: {
        color: colors.text,
        fontWeight: '700',
    },
});

export default Footer;