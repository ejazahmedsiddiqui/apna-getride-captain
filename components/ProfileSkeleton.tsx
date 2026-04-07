import React, {useEffect, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import {useAppTheme} from "../hooks/useAppTheme";
import {AppColors, AppTheme} from "../theme";

type ThemeType = {
    theme: AppTheme,
    colors: AppColors,
    isDark: boolean,
    shadow: {
        ambient: {
            shadowColor: string
            shadowOffset: {
                width: number
                height: number
            }
            shadowOpacity: number
            shadowRadius: number
            elevation: number
        }
    }
}

function SkeletonBox({width, height, borderRadius = 8, style}: {
    width: number | string;
    height: number;
    borderRadius?: number;
    style?: object;
}) {
    const opacity = useSharedValue(1);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.4, {duration: 700}),
                withTiming(1, {duration: 700}),
            ),
            -1,
            false,
        );
    }, []);

    const animStyle = useAnimatedStyle(() => ({opacity: opacity.value}));

    return (
        <Animated.View
            style={[
                {width, height, borderRadius, backgroundColor: '#e0e0e0'},
                animStyle,
                style,
            ]}
        />
    );
}

export default function ProfileSkeleton() {
    const {theme, isDark} = useAppTheme();
    const {colors, shadow} = theme;

    const styles = useMemo(() => createStyles({theme, colors, isDark, shadow}), [theme, colors, isDark]);
    return (
        <SafeAreaView style={styles.safe}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <SkeletonBox width={36} height={36} borderRadius={18}/>
                    <SkeletonBox width={120} height={14} borderRadius={6}/>
                </View>
                <SkeletonBox width={36} height={36} borderRadius={18}/>
            </View>

            <View style={styles.content}>
                {/* Profile Card */}
                <View style={styles.card}>
                    <View style={styles.cardTop}>
                        <View style={{gap: 8}}>
                            <SkeletonBox width={80} height={10} borderRadius={4}/>
                            <SkeletonBox width={160} height={24} borderRadius={6}/>
                            <SkeletonBox width={90} height={12} borderRadius={4}/>
                        </View>
                        <SkeletonBox width={52} height={28} borderRadius={6}/>
                    </View>
                    <View style={styles.statsRow}>
                        <View style={{gap: 6}}>
                            <SkeletonBox width={60} height={24} borderRadius={6}/>
                            <SkeletonBox width={80} height={10} borderRadius={4}/>
                        </View>
                        <View style={styles.divider}/>
                        <View style={{gap: 6}}>
                            <SkeletonBox width={60} height={24} borderRadius={6}/>
                            <SkeletonBox width={80} height={10} borderRadius={4}/>
                        </View>
                    </View>
                </View>

                {/* Banner */}
                <SkeletonBox width='100%' height={180} borderRadius={16}/>

                {/* Menu group 1 */}
                <View style={{gap: 10}}>
                    <SkeletonBox width={130} height={14} borderRadius={4}/>
                    <View style={styles.menuGroup}>
                        {[0, 1, 2].map((i) => (
                            <View key={i}>
                                {i > 0 && <View style={styles.menuDivider}/>}
                                <View style={styles.menuRow}>
                                    <SkeletonBox width={36} height={36} borderRadius={10}/>
                                    <SkeletonBox width={140} height={13} borderRadius={4}/>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Menu group 2 */}
                <View style={{gap: 10}}>
                    <SkeletonBox width={110} height={14} borderRadius={4}/>
                    <View style={styles.menuGroup}>
                        {[0, 1, 2].map((i) => (
                            <View key={i}>
                                {i > 0 && <View style={styles.menuDivider}/>}
                                <View style={styles.menuRow}>
                                    <SkeletonBox width={36} height={36} borderRadius={10}/>
                                    <SkeletonBox width={110} height={13} borderRadius={4}/>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const createStyles = ({theme, colors, shadow}: ThemeType) => StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerLeft: {flexDirection: 'row', alignItems: 'center', gap: 10},
    content: {paddingHorizontal: 16, paddingTop: 18, gap: 16},
    card: {
        backgroundColor: colors.background,
        borderRadius: 16,
        padding: 20,
        boxShadow: '0px 10px 20px rgba(0,0,0,0.07)',
        gap: 20,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24
    },
    divider: {
        width: 1, height: 36,
        backgroundColor: colors.surfaceContainer,
        marginRight: 0
    },
    menuGroup: {
        backgroundColor: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0px 4px 12px rgba(0,0,0,0.06)',
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 15,
        gap: 14,
    },
    menuDivider: {
        height: 1,
        backgroundColor: 'rgba(214,214,214,0.7)',
        marginHorizontal: 28,
    },
});