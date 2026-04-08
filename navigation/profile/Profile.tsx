import React, {useMemo, useState} from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar, Switch, Image,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {
    User,
    CarTaxiFront,
    Star,
    BookCheck,
    TicketPercent,
    ShieldPlus,
    MessageCircleQuestionMark,
    Settings,
    BellRing,
    BellOff, Wifi, WifiOff, Sun, Moon
} from 'lucide-react-native';
import {useUserContext} from "../../context/UserContext";
import LoadCard from "../../components/LoadCard";
import {useNavigation} from "@react-navigation/native";
import {useAppTheme} from "../../hooks/useAppTheme";
import ProfileSkeleton from '../../components/ProfileSkeleton';
import {AppColors, AppTheme} from "../../theme";

type ThemeType = {
    theme: AppTheme;
    colors: AppColors;
    isDark?: boolean;
    shadow?: { boxShadow: string; }
};

type MenuItemProps = {
    Icon: React.ComponentType<{ size?: number; color?: string }>;
    label: string;
    badge?: number;
    colors: AppColors;
    styles: ReturnType<typeof createStyles>;
    onPress?: () => void;
};

const MenuItem = React.memo(({Icon, label, badge, colors, styles, onPress}: MenuItemProps) => {
    return (
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onPress}>
            <View style={styles.menuIconBox}>
                <Icon size={22} color={colors.primary}/>
            </View>
            <Text style={styles.menuLabel}>{label}</Text>
            <View style={styles.menuRight}>
                {badge !== undefined && (
                    <View style={styles.badgeCircle}>
                        <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                )}
                <Text style={styles.chevron}>›</Text>
            </View>
        </TouchableOpacity>
    );
});

function ProfileScreen() {
    const {user, logout, isLoadingProfile, fetchProfile} = useUserContext();
    const navigation = useNavigation();

    const [enabled, setEnabled] = useState(false);

    const [getNotification, setGetNotification] = useState<boolean>(true);

    const {theme, toggle: toggleTheme, isDark} = useAppTheme();
    const {colors, shadow} = theme;
    const styles = useMemo(() => createStyles({theme, colors, isDark, shadow}), [theme, colors, isDark])
    console.log('@/nav/profile/Profile - User Details is: ', user);
    if (isLoadingProfile) {
        return <ProfileSkeleton/>;
    }

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.surfaceContainerLow}
            />
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.avatarCircle}>
                        {!user?.profileImage
                            ? <User size={22} color={colors.primary}/>
                            : <Image
                                source={{uri: user.profileImage}} resizeMethod={'resize'}
                                height={40}
                                width={40}
                                borderRadius={15}
                            />
                        }
                    </View>
                    <Text style={styles.brandName}>Captain's Domain</Text>
                </View>
                <TouchableOpacity
                    style={styles.bellBtn}
                    onPress={() => setGetNotification(!getNotification)}
                >
                    {getNotification
                        ? <BellRing size={22} color={colors.primary}/>
                        : <BellOff size={22} color={colors.primaryContainer}/>}
                </TouchableOpacity>
            </View>
            <LoadCard>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Profile Card */}
                    <View style={styles.profileCard}>
                        <View style={styles.profileCardTop}>
                            <View>
                                <Text style={styles.eliteLabel}>
                                    {'gold'.toUpperCase()} MEMBER
                                </Text>
                                <Text style={styles.userName}>
                                    {user?.fullName || 'Apna GetRide Captain'}
                                </Text>
                                <View style={styles.ratingRow}>
                                    <Star size={16} fill={'gold'} color={'gold'}/>
                                    <Text style={styles.ratingText}>
                                        {user?.rating} Rating
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.goldBadge}>
                                <Text style={styles.goldText}>
                                    {'gold'.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    {user?.totalRides?.toLocaleString()}
                                </Text>
                                <Text style={styles.statLabel}>TOTAL TRIPS</Text>
                            </View>
                            <View style={styles.statDivider}/>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    {user?.rating}
                                </Text>
                                <Text style={styles.statLabel}>YEARS ACTIVE</Text>
                            </View>
                        </View>
                    </View>

                    {/* Account Settings */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Account Settings</Text>
                        <View style={styles.menuGroup}>
                            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                                <View style={styles.menuIconBox}>
                                    {enabled
                                        ? <Wifi size={22} color={colors.primary}/>
                                        : <WifiOff size={22} color={colors.primary}/>}
                                </View>
                                <Text style={styles.menuLabel}>{enabled ? 'Online' : 'Offline'}</Text>
                                <View style={styles.menuRight}>
                                    <Switch
                                        accessible={true}
                                        accessibilityLabel={enabled ? 'Press to Go offline' : 'Press to Go Online'}
                                        value={enabled}
                                        onValueChange={setEnabled}
                                        trackColor={{
                                            false: colors.tertiary ?? 'red',
                                            true: colors.secondary ?? 'green'
                                        }}
                                        thumbColor={enabled ? 'green' : colors.tertiary ?? 'red'}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.menuDivider}/>
                            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                                <View style={styles.menuIconBox}>
                                    {!isDark
                                        ? <Sun size={22} color={colors.primary}/>
                                        : <Moon size={22} color={colors.primary}/>}
                                </View>
                                <Text
                                    style={styles.menuLabel}>{!isDark ? 'Turn on Dark Mode' : 'Turn on Light Mode'}</Text>
                                <View style={styles.menuRight}>
                                    <Switch
                                        accessible={true}
                                        accessibilityLabel={!isDark ? 'Turn on Dark Mode' : 'Turn on Light Mode'}
                                        value={isDark}
                                        onValueChange={toggleTheme}
                                        trackColor={{
                                            false: 'grey',
                                            true: 'white'
                                        }}
                                        thumbColor={isDark ? colors.tertiary : 'grey'}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.menuDivider}/>
                            {user?.vehicle &&
                                <MenuItem
                                    Icon={CarTaxiFront}
                                    label="Vehicle Information"
                                    colors={colors}
                                    styles={styles}
                                    onPress={() => navigation.navigate('VehicleInfo')}
                                />}
                            <View style={styles.menuDivider}/>
                            {!user?.vehicle && <MenuItem
                                Icon={BookCheck}
                                label="Complete Vehicle KYC"
                                colors={colors} styles={styles}
                                onPress={() => navigation.navigate('VehicleKYC')}
                            />}
                            <View style={styles.menuDivider}/>
                            <MenuItem Icon={TicketPercent} label="Promotions" badge={2} colors={colors}
                                      styles={styles}/>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Security &amp; Help</Text>
                        <View style={styles.menuGroup}>
                            <MenuItem Icon={ShieldPlus} label="Safety Center" colors={colors} styles={styles}/>
                            <View style={styles.menuDivider}/>
                            <MenuItem Icon={MessageCircleQuestionMark} label="Support" colors={colors} styles={styles}/>
                            <View style={styles.menuDivider}/>
                            <MenuItem Icon={Settings} label="Settings" colors={colors} styles={styles}/>
                        </View>
                    </View>

                    {/* Logout */}
                    <TouchableOpacity
                        style={styles.logoutBtn}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="Logout Button"
                        onPress={logout}
                    >
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.logoutBtn}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="Logout Button"
                        onPress={fetchProfile}
                    >
                        <Text style={[styles.logoutText, {color: colors.text}]}>Re-login</Text>
                    </TouchableOpacity>

                    {/* Footer Info */}
                    <View style={styles.footerInfo}>
                        <Text style={styles.footerApp}>APNA GETRIDE APP</Text>
                        <Text style={styles.footerVersion}>Version 0.22.0 (Build 02)</Text>
                        <View style={styles.footerLinks}>
                            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Privacy Policy">
                                <Text style={styles.footerLink}>Privacy Policy</Text>
                            </TouchableOpacity>
                            <Text style={styles.footerSep}> </Text>
                            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Terms of Service">
                                <Text style={styles.footerLink}>Terms of Service</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel="Check KYC"
                            onPress={() => navigation.navigate('Kyc')}
                        >
                            <Text style={styles.footerLink}>check your KYC here</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LoadCard>
        </SafeAreaView>
    );
}

const createStyles = ({colors, shadow}: ThemeType) => StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.background,
        paddingBottom: 40,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.surfaceContainerLow,
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.outlineVariant,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    avatarCircle: {
        backgroundColor: colors.surfaceContainerHigh,
        alignItems: "center",
        justifyContent: "center",
    },
    brandName: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.primary,
        letterSpacing: 0.2,
    },
    bellBtn: {
        padding: 4,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 18,
        paddingBottom: 32,
        gap: 16,
    },

    // Profile Card
    profileCard: {
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: 16,
        padding: 20,
        boxShadow: shadow?.boxShadow
    },
    profileCardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    eliteLabel: {
        fontSize: 11,
        color: colors.onSurfaceVariant,
        fontWeight: "600",
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    userName: {
        fontSize: 26,
        fontWeight: "800",
        color: colors.onSurface,
        marginBottom: 6,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        color: colors.onSurfaceVariant,
        fontWeight: "600",
    },
    goldBadge: {
        borderWidth: 1.5,
        borderColor: "#c8a020",
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    goldText: {
        color: "#c8a020",
        fontWeight: "700",
        fontSize: 12,
        letterSpacing: 1,
    },
    statsRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    statItem: {
        flex: 1,
    },
    statValue: {
        fontSize: 26,
        fontWeight: "800",
        color: colors.onSurface,
    },
    statLabel: {
        fontSize: 11,
        color: colors.onSurfaceVariant,
        fontWeight: "600",
        letterSpacing: 0.8,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 36,
        backgroundColor: colors.outlineVariant,
        marginRight: 24,
    },

    // Driver Banner
    driverBanner: {
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        boxShadow: '0px 10px 20px rgba(0,0,0,0.3)',
    },
    switchIconCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "rgba(255,255,255,0.15)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },
    switchTitle: {
        color: colors.onPrimary,
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 4,
    },
    switchSubtitle: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 13,
        marginBottom: 20,
    },
    goOnlineBtn: {
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 32,
        width: "100%",
        alignItems: "center",
    },
    goOnlineText: {
        color: colors.onPrimary,
        fontWeight: "800",
        fontSize: 15,
        letterSpacing: 1.2,
    },

    // Sections
    section: {
        gap: 10,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.primary,
        marginLeft: 2,
    },
    menuGroup: {
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: '0px 10px 20px rgba(0,0,0,0.1)',
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 15,
        gap: 14,
    },
    menuDivider: {
        height: 1,
        backgroundColor: colors.outlineVariant,
        marginHorizontal: 56 / 2,
    },
    menuIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: colors.surfaceContainerHigh,
        alignItems: "center",
        justifyContent: "center",
    },
    menuLabel: {
        flex: 1,
        fontSize: 15,
        color: colors.onSurface,
        fontWeight: "500",
    },
    menuRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    badgeCircle: {
        backgroundColor: colors.error,
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeText: {
        color: colors.onError,
        fontSize: 11,
        fontWeight: "700",
    },
    chevron: {
        fontSize: 22,
        color: colors.outline,
        marginTop: -1,
    },

    // Logout
    logoutBtn: {
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
        boxShadow: '0px 10px 20px rgba(0,0,0,0.1)',
    },
    logoutText: {
        color: colors.error,
        fontWeight: "700",
        fontSize: 15,
        letterSpacing: 1.2,
    },

    // Footer
    footerInfo: {
        alignItems: "center",
        gap: 4,
        marginTop: 4,
    },
    footerApp: {
        fontSize: 11,
        color: colors.onSurfaceVariant,
        fontWeight: "600",
        letterSpacing: 1,
    },
    footerVersion: {
        fontSize: 12,
        color: colors.onSurfaceVariant,
        letterSpacing: 1.1,
    },
    footerLinks: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    footerLink: {
        fontSize: 12,
        color: colors.primary,
        textDecorationLine: "underline",
        fontWeight: "500",
    },
    footerSep: {
        fontSize: 12,
        color: colors.outlineVariant,
    },
});

export default ProfileScreen;