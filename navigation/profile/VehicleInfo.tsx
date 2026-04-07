import {SafeAreaView} from 'react-native-safe-area-context';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView, TouchableOpacity,
} from 'react-native';
import {useAppTheme} from '../../hooks/useAppTheme';
import React, {useMemo} from 'react';
import {AppColors, AppTheme} from '../../theme';
import {useUserContext} from '../../context/UserContext';
import ProfileSkeleton from '../../components/ProfileSkeleton';
import {
    Car,
    Bike,
    Truck,
    CheckCircle2,
    XCircle,
    Hash,
    Palette,
    Settings2,
    ImageOff,
    ArrowLeftFromLine
} from 'lucide-react-native';
import {StackActions, useNavigation} from "@react-navigation/native";
import LoadCard from "../../components/LoadCard";
import InfoRow from "../../components/InfoRow";

const VEHICLE_IMAGE_MAP: Record<string, ReturnType<typeof require>> = {
    // Cars
    swift: require('../../assets/vehicles/swift.webp'),
    'swift dzire': require('../../assets/vehicles/swift-dzire.webp'),
    dzire: require('../../assets/vehicles/swift-dzire.webp'),
    baleno: require('../../assets/vehicles/baleno.webp'),
    wagonr: require('../../assets/vehicles/wagon-r.webp'),
    'wagon r': require('../../assets/vehicles/wagon-r.webp'),
    i20: require('../../assets/vehicles/i20.webp'),
    creta: require('../../assets/vehicles/creta.webp'),
    nexon: require('../../assets/vehicles/nexon.webp'),
    innova: require('../../assets/vehicles/innova.webp'),
    // Bikes
    'pulsar 150': require('../../assets/vehicles/pulsar-150.webp'),
    'pulsar 200': require('../../assets/vehicles/pulsar-200.webp'),
    splendor: require('../../assets/vehicles/splendor.webp'),
    activa: require('../../assets/vehicles/activa.png'),
    auto: require('../../assets/vehicles/auto-rickshaw.png'),
};

function getVehicleImage(model: string | undefined) {
    if (!model) return null;
    return VEHICLE_IMAGE_MAP[model.toLowerCase().trim()] ?? null;
}

type ThemeType = {
    theme: AppTheme;
    colors: AppColors;
    isDark: boolean;
};

type VehicleType = 'CAR' | 'BIKE' | 'AUTO' | string;

function VehicleTypeIcon({
                             type,
                             color,
                             size = 20,
                         }: {
    type: VehicleType;
    color: string;
    size?: number;
}) {
    switch (type) {
        case 'BIKE':
            return <Bike size={size} color={color}/>;
        case 'AUTO':
            return <Truck size={size} color={color}/>;
        default:
            return <Car size={size} color={color}/>;
    }
}

function VehicleImageCard({
                              model,
                              type,
                              photoUrl,
                              colors,
                          }: {
    model: string | undefined;
    type: VehicleType | undefined;
    photoUrl: string | undefined;
    colors: AppColors;
    isDark: boolean;
}) {
    const localImage = getVehicleImage(model);
    const remoteSource = photoUrl ? {uri: photoUrl} : null;
    const imageSource = remoteSource ?? localImage;

    return (
        <View
            style={[
                imageCardStyles.card,
                {backgroundColor: colors.surfaceContainerLow},
            ]}>
            {imageSource ? (
                <Image
                    source={imageSource}
                    style={imageCardStyles.image}
                    resizeMode="contain"
                />
            ) : (
                <View
                    style={[
                        imageCardStyles.placeholder,
                        {backgroundColor: colors.surfaceContainer},
                    ]}>
                    <VehicleTypeIcon
                        type={type ?? 'CAR'}
                        color={colors.onSurfaceVariant}
                        size={64}
                    />
                    <Text
                        style={[
                            imageCardStyles.placeholderText,
                            {
                                color: colors.onSurfaceVariant,
                                fontFamily: 'Inter',
                            },
                        ]}>
                        No vehicle image
                    </Text>
                </View>
            )}
        </View>
    );
}

const imageCardStyles = StyleSheet.create({
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        height: 200,
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    placeholderText: {
        fontSize: 13,
        marginTop: 4,
    },
});

function Divider({color}: { color: string }) {
    return (
        <View
            style={{
                height: 1,
                backgroundColor: color,
                alignSelf: 'center',
                width: '80%'
            }}
        />
    );
}

function NumberPlateSection({
                                numberPlateUrl,
                                colors,
                            }: {
    numberPlateUrl: string | undefined;
    colors: AppColors;
    isDark: boolean;
}) {
    return (
        <View style={{marginTop: 24}}>
            <Text
                style={[
                    sectionStyles.heading,
                    {
                        color: colors.onSurfaceVariant,
                        fontFamily: 'Manrope',
                        marginBottom: 12,
                    },
                ]}>
                NUMBER PLATE PHOTO
            </Text>
            <View
                style={[
                    sectionStyles.plateCard,
                    {backgroundColor: colors.surfaceContainerLow},
                ]}>
                {numberPlateUrl ? (
                    <Image
                        source={{uri: numberPlateUrl}}
                        style={sectionStyles.plateImage}
                        resizeMode='contain'
                    />
                ) : (
                    <View
                        style={[
                            sectionStyles.platePlaceholder,
                            {backgroundColor: colors.surfaceContainer},
                        ]}>
                        <ImageOff size={28} color={colors.onSurfaceVariant}/>
                        <Text
                            style={[
                                sectionStyles.placeholderText,
                                {
                                    color: colors.onSurfaceVariant,
                                    fontFamily: 'Inter',
                                },
                            ]}>
                            Not uploaded
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const sectionStyles = StyleSheet.create({
    heading: {
        fontSize: 11,
        letterSpacing: 1,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    plateCard: {
        borderRadius: 12,
        overflow: 'hidden',
        height: 400,
        width: '100%',
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
    },
    plateImage: {
        width: '100%',
        height: '100%',
    },
    platePlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    placeholderText: {
        fontSize: 13,
    },
});

function VerificationBadge({
                               verified,
                               colors,
                           }: {
    verified: boolean;
    colors: AppColors;
}) {
    const bg = verified ? colors.secondaryContainer : colors.errorContainer;
    const fg = verified ? colors.onSecondaryContainer : colors.error;

    return (
        <View
            style={[
                badgeStyles.badge,
                {backgroundColor: bg},
            ]}>
            {verified ? (
                <CheckCircle2 size={14} color={fg}/>
            ) : (
                <XCircle size={14} color={fg}/>
            )}
            <Text
                style={[
                    badgeStyles.label,
                    {color: fg, fontFamily: 'Manrope'},
                ]}>
                {verified ? 'Verified' : 'Unverified'}
            </Text>
        </View>
    );
}

const badgeStyles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        alignSelf: 'flex-start',
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
    },
});
const VehicleInfoScreen = () => {
    const {theme, isDark} = useAppTheme();
    const navigation = useNavigation();
    const {colors} = theme;
    const styles = useMemo(
        () => createStyles({theme, colors, isDark}),
        [theme, colors, isDark],
    );
    const {user, isLoadingProfile} = useUserContext();
    const handleGoBack = () => {
        if (navigation.canGoBack()) navigation.goBack();
        else
            navigation.dispatch(StackActions.replace('Profile'))
    }

    if (isLoadingProfile) {
        return <ProfileSkeleton/>;
    }

    const vehicle: any = user?.vehicle;

    return (
        <SafeAreaView style={styles.container}>
            <LoadCard>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleGoBack}>
                        <ArrowLeftFromLine size={22} color={colors.onSurface}/>
                    </TouchableOpacity>
                    <Text style={styles.modelText}>Vehicle Info</Text>
                </View>
                <Divider color={colors.outlineVariant}/>
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}>

                    {/* Vehicle image (future: from API; current: local default or placeholder) */}
                    <VehicleImageCard
                        model={vehicle?.model}
                        type={vehicle?.type}
                        photoUrl={undefined} // swap to vehicle?.photo?.url when API sends it
                        colors={colors}
                        isDark={isDark}
                    />

                    {/* Header row */}
                    <View style={styles.headerRow}>
                        <View style={{flex: 1}}>
                            <Text style={styles.modelText}>
                                {vehicle?.model ?? 'Unknown Model'}
                            </Text>
                            <Text style={[styles.typeText, {color: colors.onSurfaceVariant}]}>
                                {vehicle?.type ?? '—'}
                            </Text>
                        </View>
                        <VerificationBadge
                            verified={vehicle?.isNumberPlateVerified ?? false}
                            colors={colors}
                        />
                    </View>

                    {/* Info card */}
                    <View
                        style={[
                            styles.card,
                            {backgroundColor: colors.surfaceContainerLow},
                        ]}>
                        <InfoRow
                            icon={<Hash size={18} color={colors.primary}/>}
                            label="Registration Number"
                            value={vehicle?.number}
                            colors={colors}
                        />
                        <Divider color={colors.outlineVariant}/>
                        <InfoRow
                            icon={<Palette size={18} color={colors.primary}/>}
                            label="Color"
                            value={vehicle?.color}
                            colors={colors}
                        />
                        <Divider color={colors.outlineVariant}/>
                        <InfoRow
                            icon={
                                <VehicleTypeIcon
                                    type={vehicle?.type ?? 'CAR'}
                                    color={colors.primary}
                                    size={18}
                                />
                            }
                            label="Vehicle Type"
                            value={vehicle?.type}
                            colors={colors}
                        />
                        <Divider color={colors.outlineVariant}/>
                        <InfoRow
                            icon={<Settings2 size={18} color={colors.primary}/>}
                            label="Status"
                            value={vehicle?.isActive ? 'Active' : 'Inactive'}
                            colors={colors}
                        />
                    </View>

                    {/* Number plate photo */}
                    <NumberPlateSection
                        numberPlateUrl={vehicle?.numberPlatePhoto?.url}
                        colors={colors}
                        isDark={isDark}
                    />
                </ScrollView>
            </LoadCard>
        </SafeAreaView>
    );
};

export default VehicleInfoScreen;

const createStyles = ({colors}: ThemeType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'flex-start',
            backgroundColor: colors.background,
        },
        header: {
            width: '100%',
            paddingHorizontal: 20,
            paddingVertical: 12,
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        scroll: {
            padding: 16,
            paddingBottom: 40,
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 16,
            gap: 12,
        },
        modelText: {
            fontSize: 22,
            fontWeight: '700',
            fontFamily: 'Manrope',
            color: colors.onSurface
        },
        typeText: {
            fontSize: 13,
            fontFamily: 'Inter',
            marginTop: 2,
        },
        card: {
            borderRadius: 16,
            paddingHorizontal: 16,
            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
        },
    });