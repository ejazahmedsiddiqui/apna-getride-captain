import React, {useMemo, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    StatusBar, ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import RenderFormField from '../../components/RenderFormField';
import LoadCard from '../../components/LoadCard';
import SectionHeader from "../../components/SectionHeader";
import DocTile from "../../components/DocTile";
import VehicleTypeTile from "../../components/VehicleTileType";
import {useAppTheme} from '../../hooks/useAppTheme';
import {Bandage, Bike, CarTaxiFront, Palette, Truck} from "lucide-react-native";
import ThemeType from "../../utils/ThemeType";
import pickImage from "../../utils/pickImage";
import {updateVehicle} from '../../api/updates';
import {useNavigation} from "@react-navigation/native";

type DocKey = 'numberPlate';
type VehicleType = 'BIKE' | 'CAR' | 'AUTO'

interface KYCFormState {
    number: string;
    type: VehicleType;
    model: string;
    color: string;
}

interface KYCErrors {
    number: string;
    type: string;
    model: string;
    color: string;
}

const VehicleKYCScreen = () => {
    const {theme, isDark} = useAppTheme();
    const {colors, shadow} = theme;

    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const vehicleTypes = [
        {icon: Bike, label: 'BIKE', id: 1},
        {icon: CarTaxiFront, label: 'CAR', id: 2},
        {icon: Truck, label: 'AUTO', id: 3},
    ]
    const styles = useMemo(() => createStyles({theme, colors, isDark, shadow}), [theme, colors, isDark]);

    const [form, setForm] = useState<KYCFormState>({
        number: '',
        type: 'BIKE',
        model: '',
        color: '',
    });

    const [errors, setErrors] = useState<KYCErrors>({
        number: '',
        type: '',
        model: '',
        color: '',
    });

    const [docErrors, setDocErrors] = useState<Partial<Record<DocKey, string>>>({});

    const [images, setImages] = useState<Record<DocKey, string | null>>({
        numberPlate: null
    });

    const setField = (key: keyof KYCFormState) => (value: string) => {
        setForm(prev => ({...prev, [key]: value}));
        if (errors[key]) setErrors(prev => ({...prev, [key]: ''}));
    };

    const handleImagePick = (docKey: DocKey) => async (fromCamera: boolean) => {
        const uri = await pickImage(fromCamera);
        if (uri) {
            setImages(prev => ({...prev, [docKey]: uri}));
            setDocErrors(prev => ({...prev, [docKey]: ''}));
        }
    };

    const validate = (): boolean => {
        const newErrors: KYCErrors = {number: '', type: '', model: '', color: ''};
        const newDocErrors: Partial<Record<DocKey, string>> = {};
        let valid = true;

        if (form.number.length !== 10 && form.number.length !== 11) {
            newErrors.number = 'Car Registration number must be 10 (11 for Delhi) characters long.';
            valid = false;
        }
        const numberPlateRegex = /^[A-Z]{2}[- ]?[0-9]{2}[- ]?[A-Z]{1,3}[- ]?[0-9]{4}$|^[0-9]{2}BH[0-9]{4}[A-Z]{1,2}$/;
        if (!numberPlateRegex.test(form.number.toUpperCase())) {
            newErrors.number = 'Enter a valid Registration Number (e.g. ABCDE1234F).';
            valid = false;
        }

        (['numberPlate'] as DocKey[]).forEach(key => {
            if (!images[key]) {
                newDocErrors[key] = 'Document image is required.';
                valid = false;
            }
        });

        setErrors(newErrors);
        setDocErrors(newDocErrors);
        return valid;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true)
        const result = await updateVehicle(form, images.numberPlate);
        setLoading(false);
        if (!result.success) {
            Alert.alert('Submission Failed', result.errorMessage ?? 'Something went wrong.');
            return;
        }
        Alert.alert('KYC Submitted', "Your documents are under review. We'll notify you within 24 hours.", [
            {text: 'Got it'}, {
                onPress: () => {
                    navigation.navigate('Profile');
                }
            }
        ]);
    };
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.surfaceContainerLow}
            />
            <LoadCard>
                <View style={styles.root}>
                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.header}>
                            <View style={styles.headerInner}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.headerEyebrow}>
                                        VEHICLE IDENTIFICATION
                                    </Text>
                                    <Text style={styles.headerTitle}>
                                        Complete Vehicle KYC
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.headerSubtitle}>
                                Your documents are encrypted and reviewed by our compliance team within 24 hrs.
                            </Text>
                        </View>
                        <View style={styles.card}>
                            <SectionHeader
                                step="01"
                                title="Vehicle Number"
                                subtitle="Enter your RTO issued Vehicle Number"
                            />
                            <View style={styles.fieldGroup}>
                                <RenderFormField
                                    label="Vehicle Number"
                                    value={form.number}
                                    onChangeText={setField('number')}
                                    placeholder="DL01AX9876 (No Space)"
                                    inputType="alphanumeric"
                                    maxLength={10}
                                    labelColor={colors.surfaceTint}
                                    labelColorActive={colors.primary}
                                    borderColorInactive={colors.surfaceTint}
                                    borderColorActive={colors.primary}
                                    textColor={colors.onSurface}
                                    placeholderTextColor={colors.outlineVariant}
                                    error={errors.number}
                                    style={styles.fieldStyle}
                                    inputStyle={styles.inputStyle}
                                    icon={
                                        <Bandage
                                            size={20}
                                        />
                                    }
                                    accessibilityLabel="Aadhaar Number input"
                                />
                            </View>
                        </View>

                        <View style={styles.card}>
                            <SectionHeader
                                step="02"
                                title="Vehicle Type"
                                subtitle="Select your Vehicle Type"
                            />
                            <View style={[styles.fieldGroup, {flexDirection: 'row'}]}>
                                {vehicleTypes.map((item, index) => (
                                    <VehicleTypeTile
                                        key={index}
                                        Icon={item.icon}
                                        label={item.label}
                                        selected={form.type === item.label}
                                        onPress={() => setField('type')(item.label as VehicleType)}
                                    />
                                ))}
                            </View>
                        </View>
                        <View style={styles.card}>
                            <SectionHeader
                                step="03"
                                title="Vehicle Color"
                                subtitle="Enter the color of your Vehicle"
                            />
                            <View style={styles.fieldGroup}>
                                <RenderFormField
                                    label="Vehicle Color"
                                    value={form.color}
                                    onChangeText={setField('color')}
                                    placeholder="White"
                                    inputType="alphabetic"
                                    labelColor={colors.surfaceTint}
                                    labelColorActive={colors.primary}
                                    borderColorInactive={colors.surfaceTint}
                                    borderColorActive={colors.primary}
                                    textColor={colors.onSurface}
                                    placeholderTextColor={colors.outlineVariant}
                                    error={errors.number}
                                    style={styles.fieldStyle}
                                    inputStyle={styles.inputStyle}
                                    icon={
                                        <Palette
                                            size={20}
                                        />
                                    }
                                    accessibilityLabel="Vehicle Color - white, grey, red, etc"
                                />
                            </View>
                        </View>
                        <View style={styles.card}>
                            <SectionHeader
                                step="04"
                                title="Vehicle Model"
                                subtitle="Enter the full model name of your vehicle."
                            />
                            <View style={styles.fieldGroup}>
                                <RenderFormField
                                    label="Vehicle Model"
                                    value={form.model}
                                    onChangeText={setField('model')}
                                    placeholder="Hero Honda Splendor XTEC"
                                    inputType="alphanumeric"
                                    maxLength={20}
                                    labelColor={colors.surfaceTint}
                                    labelColorActive={colors.primary}
                                    borderColorInactive={colors.surfaceTint}
                                    borderColorActive={colors.primary}
                                    textColor={colors.onSurface}
                                    placeholderTextColor={colors.outlineVariant}
                                    error={errors.number}
                                    style={styles.fieldStyle}
                                    inputStyle={styles.inputStyle}
                                    icon={
                                        <Bike
                                            size={20}
                                            color={colors.onSurfaceVariant}
                                        />
                                    }
                                    accessibilityLabel="Vehicle Model"
                                />
                            </View>
                        </View>

                        <View style={styles.card}>
                            <SectionHeader
                                step="03"
                                title="Aadhaar Card Photos"
                                subtitle="Upload clear photos of front Number plate. Avoid glare and blur."
                            />
                            <View style={styles.docRow}>
                                <DocTile
                                    label="License Photo"
                                    icon="card-account-details-outline"
                                    uri={images.numberPlate}
                                    onPick={handleImagePick('numberPlate')}
                                    error={docErrors.numberPlate}
                                />
                            </View>
                        </View>

                        <View style={styles.disclaimer}>
                            <MaterialCommunityIcons name="lock-outline" size={14} color={colors.onSurfaceVariant}/>
                            <Text style={styles.disclaimerText}>
                                Your data is encrypted with AES-256 and is only used for compliance verification. We
                                never share it with third parties.
                            </Text>
                        </View>

                        <TouchableOpacity onPress={handleSubmit} activeOpacity={0.88} style={styles.ctaWrapper}
                        disabled={loading}>
                            <LinearGradient
                                colors={[colors.primary, colors.surfaceTint]}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                style={styles.ctaGradient}

                            >
                                <MaterialCommunityIcons name="shield-check" size={20} color="#fff"/>
                                <Text style={styles.ctaText}>{loading ? 'Loading...' : 'Submit for Verification'}</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={{height: 40}}/>
                    </ScrollView>
                </View>
            </LoadCard>
        </SafeAreaView>
    );
};

export default VehicleKYCScreen;

const createStyles = ({colors, shadow}: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    root: {
        flex: 1,
        backgroundColor: colors.surfaceContainerLowest,
    },
    header: {
        paddingTop: 12,
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
        fontSize: 28,
        fontWeight: '800',
        color: colors.primary,
        lineHeight: 44,
        letterSpacing: -0.5,
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
        paddingTop: 20,
        gap: 16,
    },
    card: {
        backgroundColor: colors.surfaceContainerLow,
        marginHorizontal: 12,
        borderRadius: 12,
        padding: 20,
        boxShadow: shadow.boxShadow
    },
    fieldGroup: {
        marginTop: 20,
        gap: 16,
    },
    fieldStyle: {
        backgroundColor: colors.surfaceContainer,
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
        marginHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: 10,
        padding: 14,
    },
    disclaimerText: {
        flex: 1,
        fontFamily: 'Inter',
        fontSize: 11.5,
        color: colors.onSurfaceVariant,
        lineHeight: 17,
    },
    ctaWrapper: {
        marginHorizontal: 12,
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
        color: colors.onPrimary,
        letterSpacing: 0.3,
    },
});
