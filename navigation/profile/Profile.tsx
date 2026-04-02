import React, {useState} from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
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
    BellRing
} from 'lucide-react-native';
import Animated, {
    withTiming,
    useSharedValue,
    useAnimatedStyle,
    interpolateColor,
    Easing,
} from "react-native-reanimated";
import {EaseView} from 'react-native-ease';
import {COLORS} from '../../utils/COLORS'


const GREEN = "#006E1C";
const RED = "#FF0000";

const userProfile = {
    name: 'Champ Champaign Mohandas Karaganda Gandhi',
    tier: 'elite',
    membershipStatus: 'gold',
    rating: 4.98,
    totalTrips: 1284,
    yearsActive: 3.2,
    onlineStatus: true,
};

interface FadeCardProps {
    children: React.ReactNode;
}

function FadeCard({children}: FadeCardProps) {
    return (
        <EaseView
            initialAnimate={{opacity: 0, translateY: 50}}
            animate={{opacity: 1, translateY: 0}}
            transition={{type: 'timing', duration: 800}}
            style={{flex: 1}}
        >
            {children}
        </EaseView>
    );
}

function ProfileScreen() {
    const name = userProfile.name.length > 15 ? userProfile.name.slice(0, 15) + '...' : userProfile.name;
    const [isOnline, setIsOnline] = useState<boolean>(userProfile?.onlineStatus ?? false);
    const progress = useSharedValue(userProfile?.onlineStatus ? 1 : 0);
    const rotation = useSharedValue(0);

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
            [ COLORS.primaryContainer,COLORS.secondary],
        ),
    }));

    const animatedBtnStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            [GREEN, COLORS.error ],
        ),
    }));

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [{rotate: `${rotation.value}deg`}],
    }));

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
            <FadeCard>

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
                                    {userProfile.tier.toUpperCase()} MEMBER
                                </Text>

                                <Text style={styles.userName}>
                                    {name}
                                </Text>

                                <View style={styles.ratingRow}>
                                    <Star size={16} fill={'gold'} color={'gold'}/>
                                    <Text style={styles.ratingText}>
                                        {userProfile.rating} Rating
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.goldBadge}>
                                <Text style={styles.goldText}>
                                    {userProfile.membershipStatus.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    {userProfile.totalTrips.toLocaleString()}
                                </Text>
                                <Text style={styles.statLabel}>TOTAL TRIPS</Text>
                            </View>

                            <View style={styles.statDivider}/>

                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    {userProfile.yearsActive}
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
                            <MenuItem icon={<User size={22} color={COLORS.primary}/>} label="Personal Information"/>
                            <View style={styles.menuDivider}/>
                            <MenuItem icon={<CreditCard size={22} color={COLORS.primary}/>} label="Payment Methods"/>
                            <View style={styles.menuDivider}/>
                            <MenuItem icon={<TicketPercent size={22} color={COLORS.primary}/>} label="Promotions" badge={2}/>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Security &amp; Help</Text>
                        <View style={styles.menuGroup}>
                            <MenuItem icon={<ShieldPlus size={22} color={COLORS.primary}/>} label="Safety Center"/>
                            <View style={styles.menuDivider}/>
                            <MenuItem icon={<MessageCircleQuestionMark size={22} color={COLORS.primary}/>} label="Support"/>
                            <View style={styles.menuDivider}/>
                            <MenuItem icon={<Settings size={22} color={COLORS.primary}/>} label="Settings"/>
                        </View>
                    </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.7}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            {/* Footer Info */}
            <View style={styles.footerInfo}>
                <Text style={styles.footerApp}>APNA GETRIDE APP</Text>
                <Text style={styles.footerVersion}>Version 0.22.0 (Build 02)</Text>
                <View style={styles.footerLinks}>
                    <TouchableOpacity>
                        <Text style={styles.footerLink}>Privacy Policy</Text>
                    </TouchableOpacity>
                    <Text style={styles.footerSep}> </Text>
                    <TouchableOpacity>
                        <Text style={styles.footerLink}>Terms of Service</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
            </FadeCard>
</SafeAreaView>
)
    ;
}

function MenuItem({
                      icon,
                      label,
                      badge,
                  }: {
    icon: React.ReactNode;
    label: string;
    badge?: number;
}) {
    return (
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuIconBox}>
                {icon}
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
}

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