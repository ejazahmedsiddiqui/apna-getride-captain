import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    StatusBar,
    Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import RenderFormField from '../../components/RenderFormField';
import { COLORS } from '../../utils/COLORS'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    interpolate,
    Extrapolation,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";
import LoadCard from "../../components/LoadCard";


type DocKey = 'aadhaarFront' | 'aadhaarBack' | 'pan' | 'license';
const { height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.2;

interface KYCFormState {
    aadhaarNumber: string;
    panNumber: string;
    licenseNumber: string;
    licenseExpiryDate: string;
}

interface KYCErrors {
    aadhaarNumber: string;
    panNumber: string;
    licenseNumber: string;
    licenseExpiryDate: string;
}

const pickImage = async (fromCamera: boolean): Promise<string | null> => {
    const permFn = fromCamera
        ? ImagePicker.requestCameraPermissionsAsync
        : ImagePicker.requestMediaLibraryPermissionsAsync;

    const { status } = await permFn();
    if (status !== 'granted') {
        Alert.alert(
            'Permission Required',
            `Please allow ${fromCamera ? 'camera' : 'gallery'} access in your device settings.`,
        );
        return null;
    }

    const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.85,
            allowsEditing: true,
            aspect: [4, 3],
        })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.85,
            allowsEditing: true,
            aspect: [4, 3],
        });

    if (!result.canceled && result.assets.length > 0) {
        return result.assets[0].uri;
    }
    return null;
};

interface DocTileProps {
    label: string;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    uri: string | null;
    onPick: (fromCamera: boolean) => void;
    error?: string;
}

const DocTile: React.FC<DocTileProps> = ({ label, icon, uri, onPick, error }) => {
    const showPickerOptions = () => {
        Alert.alert(label, 'Choose image source', [
            { text: 'Camera', onPress: () => onPick(true) },
            { text: 'Gallery', onPress: () => onPick(false) },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    return (
        <View style={docStyles.wrapper}>
            <Text style={docStyles.metaLabel}>{label.toUpperCase()}</Text>

            <TouchableOpacity
                style={[docStyles.tile, error ? docStyles.tileError : null]}
                onPress={showPickerOptions}
                activeOpacity={0.8}
                accessibilityLabel={`Upload ${label}`}
            >
                {uri ? (
                    <>
                        <Image source={{ uri }} style={docStyles.preview} resizeMode="cover" />
                        <View style={docStyles.reuploadOverlay}>
                            <MaterialCommunityIcons name="camera-retake-outline" size={22} color="#fff" />
                            <Text style={docStyles.reuploadText}>Replace</Text>
                        </View>
                    </>
                ) : (
                    <View style={docStyles.placeholder}>
                        <View style={docStyles.iconRing}>
                            <MaterialCommunityIcons
                                name={icon}
                                size={28}
                                color={COLORS.primary}
                            />
                        </View>
                        <Text style={docStyles.placeholderTitle}>Upload Document</Text>
                        <Text style={docStyles.placeholderSub}>Camera · JPG · JPEG</Text>
                    </View>
                )}
            </TouchableOpacity>
            {error ? <Text style={docStyles.errorText}>{error}</Text> : null}
        </View>
    );
};

const SectionHeader: React.FC<{ step: string; title: string; subtitle: string }> = ({
    step,
    title,
    subtitle,
}) => (
    <View style={sectionStyles.row}>
        <View style={sectionStyles.stepBadge}>
            <Text style={sectionStyles.stepText}>{step}</Text>
        </View>
        <View style={{ flex: 1 }}>
            <Text style={sectionStyles.title}>{title}</Text>
            <Text style={sectionStyles.subtitle}>{subtitle}</Text>
        </View>
    </View>
);

const KYCScreen = () => {
    const [form, setForm] = useState<KYCFormState>({
        aadhaarNumber: '',
        panNumber: '',
        licenseNumber: '',
        licenseExpiryDate: '',
    });

    const [errors, setErrors] = useState<KYCErrors>({
        aadhaarNumber: '',
        panNumber: '',
        licenseNumber: '',
        licenseExpiryDate: '',
    });
    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const animatedHeaderHeight = useAnimatedStyle(() => ({
        height: interpolate(scrollY.value, [0, 150], [HEADER_HEIGHT, HEADER_HEIGHT * 0.4], Extrapolation.CLAMP),
    }));

    // Title: shrinks + shifts up into the compact bar position
    const animatedTitle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: interpolate(scrollY.value, [0, 100], [0, -4], Extrapolation.CLAMP),
            },
            {
                translateX: withTiming(scrollY.value > 80 ? -40 : 0)
            },
            {
                scale: interpolate(scrollY.value, [0, 100], [1, 0.62], Extrapolation.CLAMP),
            }
        ],
    }));

    const animatedEyebrow = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [0, 50], [1, 0], Extrapolation.CLAMP),
        transform: [
            {
                translateY: interpolate(scrollY.value, [0, 50], [0, -80], Extrapolation.CLAMP),
            },
        ],
    }));

    const animatedSubtitle = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [0, 70], [1, 0], Extrapolation.CLAMP),
        transform: [
            {
                translateY: interpolate(scrollY.value, [0, 70], [0, -12], Extrapolation.CLAMP),
            },
        ],
        maxHeight: interpolate(scrollY.value, [40, 80], [60, 0], Extrapolation.CLAMP),
        marginBottom: interpolate(scrollY.value, [40, 80], [20, 0], Extrapolation.CLAMP),
    }));

    const animatedShield = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [0, 60], [1, 0], Extrapolation.CLAMP),
        transform: [
            {
                scale: interpolate(scrollY.value, [0, 60], [1, 0.6], Extrapolation.CLAMP),
            },
        ],
    }));

    const [docErrors, setDocErrors] = useState<Partial<Record<DocKey, string>>>({});

    const [images, setImages] = useState<Record<DocKey, string | null>>({
        aadhaarFront: null,
        aadhaarBack: null,
        pan: null,
        license: null,
    });

    const setField = (key: keyof KYCFormState) => (value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
    };

    const handleImagePick = (docKey: DocKey) => async (fromCamera: boolean) => {
        const uri = await pickImage(fromCamera);
        if (uri) {
            setImages(prev => ({ ...prev, [docKey]: uri }));
            setDocErrors(prev => ({ ...prev, [docKey]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: KYCErrors = { aadhaarNumber: '', panNumber: '', licenseNumber: '', licenseExpiryDate: '' };
        const newDocErrors: Partial<Record<DocKey, string>> = {};
        let valid = true;

        if (form.aadhaarNumber.length !== 12) {
            newErrors.aadhaarNumber = 'Aadhaar must be exactly 12 digits.';
            valid = false;
        }
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(form.panNumber.toUpperCase())) {
            newErrors.panNumber = 'Enter a valid PAN (e.g. ABCDE1234F).';
            valid = false;
        }
        if (form.licenseNumber.trim().length < 5) {
            newErrors.licenseNumber = 'Enter a valid driving license number.';
            valid = false;
        }
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(form.licenseExpiryDate)) {
            newErrors.licenseExpiryDate = 'Enter date in DD/MM/YYYY format.';
            valid = false;
        }

        (['aadhaarFront', 'aadhaarBack', 'pan', 'license'] as DocKey[]).forEach(key => {
            if (!images[key]) {
                newDocErrors[key] = 'Document image is required.';
                valid = false;
            }
        });

        setErrors(newErrors);
        setDocErrors(newDocErrors);
        return valid;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        Alert.alert('KYC Submitted', "Your documents are under review. We'll notify you within 24 hours.", [
            { text: 'Got it' },
        ]);
    };

    const handleDateChange = (text: string) => {
        let cleaned = text.replace(/[^0-9]/g, '');
        if (cleaned.length > 2) cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
        if (cleaned.length > 5) cleaned = cleaned.slice(0, 5) + '/' + cleaned.slice(5);
        cleaned = cleaned.slice(0, 10);
        setField('licenseExpiryDate')(cleaned);
    };

    return (
        <SafeAreaView style={styles.container}>
            <LoadCard>
                <View style={styles.root}>
                    <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

                    <Animated.View
                        style={[styles.header, animatedHeaderHeight]}
                    >
                        <View style={styles.headerInner}>
                            <View style={{ flex: 1 }}>
                                <Animated.Text style={[styles.headerEyebrow, animatedEyebrow]}>
                                    DRIVER ONBOARDING
                                </Animated.Text>
                                <Animated.Text style={[styles.headerTitle, animatedTitle]}>
                                    Identity Verification
                                </Animated.Text>
                            </View>
                            <Animated.View style={[styles.shieldBadge, animatedShield]}>
                                <MaterialCommunityIcons name="shield-check-outline" size={36}
                                    color={COLORS.secondaryContainer} />
                            </Animated.View>
                        </View>
                        <Animated.Text style={[styles.headerSubtitle, animatedSubtitle]}>
                            Your documents are encrypted and reviewed by our compliance team within 24 hrs.
                        </Animated.Text>
                    </Animated.View>

                    <Animated.ScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                    >

                        <View style={styles.card}>
                            <SectionHeader
                                step="01"
                                title="Identity Numbers"
                                subtitle="Enter your government-issued ID numbers exactly as printed."
                            />

                            <View style={styles.fieldGroup}>
                                <RenderFormField
                                    label="Aadhaar Number"
                                    value={form.aadhaarNumber}
                                    onChangeText={setField('aadhaarNumber')}
                                    placeholder="12-digit Aadhaar"
                                    inputType="aadhaar"
                                    maxLength={12}
                                    labelColor={COLORS.primaryContainer}
                                    labelColorActive={COLORS.primary}
                                    borderColorInactive={COLORS.surfaceContainerHighest}
                                    borderColorActive={COLORS.primary}
                                    textColor={COLORS.onSurface}
                                    placeholderTextColor={COLORS.onSurfaceVariant}
                                    error={errors.aadhaarNumber}
                                    style={styles.fieldStyle}
                                    inputStyle={styles.inputStyle}
                                    icon={
                                        <MaterialCommunityIcons
                                            name="card-account-details-outline"
                                            size={20}
                                            color={COLORS.onSurfaceVariant}
                                        />
                                    }
                                    accessibilityLabel="Aadhaar Number input"
                                />

                                <RenderFormField
                                    label="PAN Number"
                                    value={form.panNumber}
                                    onChangeText={(t) => setField('panNumber')(t.toUpperCase())}
                                    placeholder="ABCDE1234F"
                                    inputType="alphanumeric"
                                    maxLength={10}
                                    autoCapitalize="characters"
                                    labelColor={COLORS.primaryContainer}
                                    labelColorActive={COLORS.primary}
                                    borderColorInactive={COLORS.surfaceContainerHighest}
                                    borderColorActive={COLORS.primary}
                                    textColor={COLORS.onSurface}
                                    placeholderTextColor={COLORS.onSurfaceVariant}
                                    error={errors.panNumber}
                                    style={styles.fieldStyle}
                                    inputStyle={styles.inputStyle}
                                    icon={
                                        <MaterialCommunityIcons
                                            name="identifier"
                                            size={20}
                                            color={COLORS.onSurfaceVariant}
                                        />
                                    }
                                    accessibilityLabel="PAN Number input"
                                />
                            </View>
                        </View>

                        <View style={styles.card}>
                            <SectionHeader
                                step="02"
                                title="Driving License"
                                subtitle="Must be a valid, non-expired commercial driving license."
                            />

                            <View style={styles.fieldGroup}>
                                <RenderFormField
                                    label="License Number"
                                    value={form.licenseNumber}
                                    onChangeText={(t) => setField('licenseNumber')(t.toUpperCase())}
                                    placeholder="e.g. DL-0420110012345"
                                    inputType="alphanumeric"
                                    autoCapitalize="characters"
                                    labelColor={COLORS.primaryContainer}
                                    labelColorActive={COLORS.primary}
                                    borderColorInactive={COLORS.surfaceContainerHighest}
                                    borderColorActive={COLORS.primary}
                                    textColor={COLORS.onSurface}
                                    placeholderTextColor={COLORS.onSurfaceVariant}
                                    error={errors.licenseNumber}
                                    style={styles.fieldStyle}
                                    inputStyle={styles.inputStyle}
                                    icon={
                                        <MaterialCommunityIcons
                                            name="card-bulleted-outline"
                                            size={20}
                                            color={COLORS.onSurfaceVariant}
                                        />
                                    }
                                    accessibilityLabel="Driving License Number input"
                                />

                                <RenderFormField
                                    label="License Expiry Date"
                                    value={form.licenseExpiryDate}
                                    onChangeText={handleDateChange}
                                    placeholder="DD/MM/YYYY"
                                    keyboardType="number-pad"
                                    maxLength={10}
                                    labelColor={COLORS.primaryContainer}
                                    labelColorActive={COLORS.primary}
                                    borderColorInactive={COLORS.surfaceContainerHighest}
                                    borderColorActive={COLORS.primary}
                                    textColor={COLORS.onSurface}
                                    placeholderTextColor={COLORS.onSurfaceVariant}
                                    error={errors.licenseExpiryDate}
                                    style={styles.fieldStyle}
                                    inputStyle={styles.inputStyle}
                                    icon={
                                        <MaterialCommunityIcons
                                            name="calendar-month-outline"
                                            size={20}
                                            color={COLORS.onSurfaceVariant}
                                        />
                                    }
                                    accessibilityLabel="License Expiry Date input"
                                />
                            </View>
                        </View>

                        <View style={styles.card}>
                            <SectionHeader
                                step="03"
                                title="Aadhaar Card Photos"
                                subtitle="Upload clear photos of both sides. Avoid glare and blur."
                            />
                            <View style={styles.docRow}>
                                <DocTile
                                    label="Aadhaar Front"
                                    icon="card-account-details-outline"
                                    uri={images.aadhaarFront}
                                    onPick={handleImagePick('aadhaarFront')}
                                    error={docErrors.aadhaarFront}
                                />
                                <DocTile
                                    label="Aadhaar Back"
                                    icon="card-account-details-star-outline"
                                    uri={images.aadhaarBack}
                                    onPick={handleImagePick('aadhaarBack')}
                                    error={docErrors.aadhaarBack}
                                />
                            </View>
                        </View>

                        <View style={styles.card}>
                            <SectionHeader
                                step="04"
                                title="PAN & License Photos"
                                subtitle="All four corners must be visible. JPG or JPEG only."
                            />
                            <View style={styles.docRow}>
                                <DocTile
                                    label="PAN Card"
                                    icon="identifier"
                                    uri={images.pan}
                                    onPick={handleImagePick('pan')}
                                    error={docErrors.pan}
                                />
                                <DocTile
                                    label="Driving License"
                                    icon="card-bulleted-outline"
                                    uri={images.license}
                                    onPick={handleImagePick('license')}
                                    error={docErrors.license}
                                />
                            </View>
                        </View>

                        <View style={styles.disclaimer}>
                            <MaterialCommunityIcons name="lock-outline" size={14} color={COLORS.onSurfaceVariant} />
                            <Text style={styles.disclaimerText}>
                                Your data is encrypted with AES-256 and is only used for compliance verification. We never
                                share it with third parties.
                            </Text>
                        </View>
                        <TouchableOpacity onPress={handleSubmit} activeOpacity={0.88} style={styles.ctaWrapper}>
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.primaryContainer]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.ctaGradient}
                            >
                                <MaterialCommunityIcons name="shield-check" size={20} color="#fff" />
                                <Text style={styles.ctaText}>Submit for Verification</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={{ height: 40 }} />
                    </Animated.ScrollView>
                </View>
            </LoadCard>
        </SafeAreaView>
    );
};

export default KYCScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: 40,
    },
    root: {
        flex: 1,
        backgroundColor: COLORS.surfaceContainerLowest,
    },
    header: {
        paddingTop: 32,
        paddingBottom: 16,
        paddingHorizontal: 24,
        overflow: 'hidden',
        justifyContent: 'flex-end',
        experimental_backgroundImage: "linear-gradient(to top, rgba(0,6,102,0.92) 0%, rgba(0,6,102,0.5) 100%)",
    },
    headerInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerEyebrow: {
        fontFamily: 'Inter',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 2.5,
        color: 'rgba(255,255,255,0.55)',
        marginBottom: 6,
    },
    headerTitle: {
        fontFamily: 'Manrope',
        fontSize: 34,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 44,
        letterSpacing: -0.5,
        // backgroundColor: 'red'
    },
    shieldBadge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 14,
    },
    headerSubtitle: {
        fontFamily: 'Inter',
        fontSize: 13,
        color: 'rgba(255,255,255,0.65)',
        lineHeight: 19,
        marginBottom: 20,
        maxWidth: '85%',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        gap: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: 'rgba(26,28,46,0.08)',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 1,
        shadowRadius: 32,
        elevation: 3,
    },
    fieldGroup: {
        marginTop: 20,
        gap: 16,
    },
    fieldStyle: {
        backgroundColor: COLORS.surfaceContainerLow,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    inputStyle: {
        backgroundColor: 'transparent',
        fontSize: 15,
    },
    docRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    disclaimer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: COLORS.surfaceContainerLow,
        borderRadius: 10,
        padding: 14,
    },
    disclaimerText: {
        flex: 1,
        fontFamily: 'Inter',
        fontSize: 11.5,
        color: COLORS.onSurfaceVariant,
        lineHeight: 17,
    },
    ctaWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    ctaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    ctaText: {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.3,
    },
});

const docStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    metaLabel: {
        fontFamily: 'Inter',
        fontSize: 9.5,
        fontWeight: '700',
        letterSpacing: 1.8,
        color: COLORS.onSurfaceVariant,
        marginBottom: 6,
    },
    tile: {
        height: 130,
        backgroundColor: COLORS.surfaceContainerLow,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: COLORS.outline,
        borderStyle: 'dashed',
    },
    tileError: {
        borderColor: '#DC2626',
        backgroundColor: '#FEF2F2',
    },
    preview: {
        width: '100%',
        height: '100%',
    },
    reuploadOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,6,102,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    reuploadText: {
        fontFamily: 'Inter',
        fontSize: 11,
        fontWeight: '600',
        color: '#fff',
    },
    placeholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: 10,
    },
    iconRing: {
        backgroundColor: 'rgba(0,6,102,0.08)',
        borderRadius: 50,
        padding: 10,
        marginBottom: 2,
    },
    placeholderTitle: {
        fontFamily: 'Inter',
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.primary,
        textAlign: 'center',
    },
    placeholderSub: {
        fontFamily: 'Inter',
        fontSize: 9.5,
        color: COLORS.onSurfaceVariant,
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    errorText: {
        fontFamily: 'Inter',
        fontSize: 11,
        fontWeight: '500',
        color: '#DC2626',
        marginTop: 5,
        paddingHorizontal: 2,
    },
});

const sectionStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
    },
    stepBadge: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingHorizontal: 9,
        paddingVertical: 5,
        marginTop: 2,
    },
    stepText: {
        fontFamily: 'Manrope',
        fontSize: 11,
        fontWeight: '800',
        color: COLORS.secondaryContainer,
        letterSpacing: 1,
    },
    title: {
        fontFamily: 'Manrope',
        fontSize: 17,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.2,
        marginBottom: 3,
    },
    subtitle: {
        fontFamily: 'Inter',
        fontSize: 12,
        color: COLORS.onSurfaceVariant,
        lineHeight: 17,
    },
});