import React, { useState} from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar, ActivityIndicator,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {
    User,
    CreditCard,
    RefreshCcw,
    Star,
    TicketPercent,
    ShieldPlus,
    MessageCircleQuestionMark,
    Settings,
    BellRing,
} from 'lucide-react-native';
import Animated, {
    withTiming,
    useSharedValue,
    useAnimatedStyle,
    interpolateColor,
    Easing,
} from "react-native-reanimated";
import {COLORS} from '../../utils/COLORS';
import {useUserContext} from "../../context/UserContext";
import LoadCard from "../../components/LoadCard";
import {useNavigation} from "@react-navigation/native";
import {useAppTheme} from "../../hooks/useAppTheme";

type MenuItemProps = {
    Icon: React.ComponentType<{ size?: number; color?: string }>;
    label: string;
    badge?: number;
};

function ProfileScreen() {
    const {user, logout, isLoadingProfile} = useUserContext();
    const navigation = useNavigation();
    const [isOnline, setIsOnline] = useState<boolean>(true);
    const progress = useSharedValue(user?.accountStatus ? 1 : 0);
    const rotation = useSharedValue(0);
    const {theme, toggle, isDark} = useAppTheme();
    const { colors, radius, spacing } = theme;

    const handleToggle = () => {
        const next = !isOnline;
        setIsOnline(next);
        progress.value = withTiming(next ? 1 : 0, {
            duration: 400,
            easing: Easing.out(Easing.cubic),
        });
        rotation.value = withTiming(rotation.value - 180, {
            duration: 800,
            easing: Easing.inOut(Easing.cubic),
        });
    };

    const animatedBannerStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            [COLORS.primaryContainer, COLORS.secondary],
        ),
    }));

    const animatedBtnStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            [COLORS.secondary, COLORS.error],
        ),
    }));

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [{rotate: `${rotation.value}deg`}],
    }));

    if (isLoadingProfile) {
        return (
            <SafeAreaView style={[styles.safe,
                {
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 12
                }]}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff"/>
                <View style={{
                    backgroundColor: colors.surfaceContainerLow,
                    borderRadius: radius.md,
                    padding: spacing.gutterMobile,
                }}>
                    <TouchableOpacity onPress={toggle}>
                        <Text style={{ color: colors.onSurface }}>
                            {isDark ? '☀️ Light' : '🌙 Dark'}
                        </Text>
                    </TouchableOpacity>
                </View>
                    <ActivityIndicator size={24} color={COLORS.primary}/>
                    <Text style={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 16
                    }}>Loading Profile...</Text>
            </SafeAreaView>
        )
    }
    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff"/>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.avatarCircle}>
                        <User size={22} color={COLORS.primary}/>
                    </View>
                    <Text style={styles.brandName}>Fluid Authority</Text>
                </View>
                <TouchableOpacity style={styles.bellBtn}>
                    <BellRing size={22} color={COLORS.primary}/>
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
                    {/* Switch to Driver Banner */}
                    <Animated.View style={[styles.driverBanner, animatedBannerStyle]}>
                        <View style={styles.switchIconCircle}>
                            <TouchableOpacity onPress={handleToggle}>
                                <Animated.View style={animatedIconStyle}>
                                    <RefreshCcw size={22} color={'#fff'}/>
                                </Animated.View>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.switchTitle}>Switch to {isOnline ? 'Offline' : 'Online'}</Text>
                        <Text
                            style={styles.switchSubtitle}>{isOnline ? 'You will not receive rides after going offline' : 'Go online to start earning'}</Text>
                        <TouchableOpacity activeOpacity={0.85} onPress={handleToggle}>
                            <Animated.View style={[styles.goOnlineBtn, animatedBtnStyle]}>
                                <Text style={styles.goOnlineText}>GO {isOnline ? 'OFFLINE' : 'ONLINE'}</Text>
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>
                    {/* Account Settings */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Account Settings</Text>
                        <View style={styles.menuGroup}>
                            <MenuItem Icon={User} label="Personal Information"/>
                            <View style={styles.menuDivider}/>
                            <MenuItem Icon={CreditCard} label="Payment Methods"/>
                            <View style={styles.menuDivider}/>
                            <MenuItem Icon={TicketPercent} label="Promotions"
                                      badge={2}/>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Security &amp; Help</Text>
                        <View style={styles.menuGroup}>
                            <MenuItem Icon={ShieldPlus} label="Safety Center"/>
                            <View style={styles.menuDivider}/>
                            <MenuItem Icon={MessageCircleQuestionMark}
                                      label="Support"/>
                            <View style={styles.menuDivider}/>
                            <MenuItem Icon={Settings} label="Settings"/>
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
                        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Check KYC"
                                          onPress={() => navigation.navigate('Kyc')}>
                            <Text style={styles.footerLink}>check your KYC here</Text>
                        </TouchableOpacity>
                        <View style={{
                            backgroundColor: colors.surfaceContainerLow,
                            borderRadius: radius.md,
                            padding: spacing.gutterMobile,
                        }}>
                            <TouchableOpacity onPress={toggle}>
                                <Text style={{ color: colors.onSurface }}>
                                    {isDark ? '☀️ Light' : '🌙 Dark'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </LoadCard>
        </SafeAreaView>
    )
        ;
}

const MenuItem = React.memo(({ Icon, label, badge }: MenuItemProps)=> {
    return (
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuIconBox}>
                <Icon size={22} color={COLORS.primary} />
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
})

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff",
        paddingBottom: 40,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    avatarCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#eee',
        alignItems: "center",
        justifyContent: "center",
    },
    brandName: {
        fontSize: 17,
        fontWeight: "700",
        color: COLORS.primary,
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
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        boxShadow: '0px 10px 20px rgba(0,0,0,0.2)'
    },
    profileCardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    eliteLabel: {
        fontSize: 11,
        color: "#999",
        fontWeight: "600",
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    userName: {
        fontSize: 26,
        fontWeight: "800",
        color: "#111",
        marginBottom: 6,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        color: "#444",
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
        color: "#111",
    },
    statLabel: {
        fontSize: 11,
        color: "#999",
        fontWeight: "600",
        letterSpacing: 0.8,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 36,
        backgroundColor: "#e5e5e5",
        marginRight: 24,
    },

    // Driver Banner
    driverBanner: {

        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        boxShadow: '0px 10px 20px rgba(0,0,0,0.3)'
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
        color: "#fff",
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
        color: "#fff",
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
        color: COLORS.primary,
        marginLeft: 2,
    },
    menuGroup: {
        backgroundColor: "#fff",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: '0px 10px 20px rgba(0,0,0,0.1)'
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
        backgroundColor: "rgba(214,214,214,0.7)",
        marginHorizontal: 56 / 2,
    },
    menuIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#f0f0f5",
        alignItems: "center",
        justifyContent: "center",
    },
    menuLabel: {
        flex: 1,
        fontSize: 15,
        color: "#222",
        fontWeight: "500",
    },
    menuRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    badgeCircle: {
        backgroundColor: "#e53935",
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "700",
    },
    chevron: {
        fontSize: 22,
        color: "#bbb",
        marginTop: -1,
    },

    // Logout
    logoutBtn: {
        backgroundColor: "#fafafa",
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
        boxShadow: '0px 10px 20px rgba(0,0,0,0.1)'
    },
    logoutText: {
        color: "#e53935",
        fontWeight: "700",
        fontSize: 15,
        letterSpacing: 1.2
    },

    // Footer
    footerInfo: {
        alignItems: "center",
        gap: 4,
        marginTop: 4,
    },
    footerApp: {
        fontSize: 11,
        color: "#aaa",
        fontWeight: "600",
        letterSpacing: 1,
    },
    footerVersion: {
        fontSize: 12,
        color: "#aaa",
        letterSpacing: 1.1
    },
    footerLinks: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    footerLink: {
        fontSize: 12,
        color: COLORS.primary,
        textDecorationLine: "underline",
        fontWeight: "500",
    },
    footerSep: {
        fontSize: 12,
        color: "#ccc",
    },
});

export default ProfileScreen;