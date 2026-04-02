import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity, ActivityIndicator, Alert,
} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {SafeAreaView} from "react-native-safe-area-context";
import RenderFormField from "../../components/RenderFormField";
import {useCallback, useEffect, useState} from "react";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {LucideMail} from 'lucide-react-native';
import {useOtpLogin} from "../../hooks/useSendOtp";
import {COLORS} from "../../utils/COLORS";
import {Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";

const useCardFlip = () => {
    const flip1 = useSharedValue(0);
    const flip2 = useSharedValue(0);

    const flipTo = (page: 0 | 1 | 2) => {
        const cfg = {duration: 700, easing: Easing.bezier(0.4, 0, 0.2, 1)};
        if (page === 0) {
            flip1.value = withTiming(0, cfg);
            flip2.value = withTiming(0, cfg);
        } else if (page === 1) {
            flip1.value = withTiming(1, cfg);
            flip2.value = withTiming(0, cfg);
        } else {
            flip1.value = withTiming(1, cfg);
            flip2.value = withTiming(1, cfg);
        }
    };

    return {flip1, flip2, flipTo};
};

function LoginScreen() {
    const navigation = useNavigation();
    const [resendTimer, setResendTimer] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const {data, loading, error, getOtp, verifyOtp} = useOtpLogin();
    const [step, setStep] = useState(1);
    const progress = useSharedValue(0);

    const {flip1, flip2, flipTo} = useCardFlip();

    useEffect(() => {
        let interval: any = 0;
        if (resendTimer > 0) {
            interval = setInterval(() => setResendTimer((p) => p - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleLogin = useCallback(async () => {
        step === 1
            ? await getOtp(phoneNumber)
                .then(() => {
                    if (data?.success) {
                        console.log('Data fetched is: ', data)
                        setStep(2);
                        progress.value = withTiming(1, {
                            duration: 400,
                            easing: Easing.bezier(0.4, 0, 0.2, 1),
                        });
                    } else {
                        console.log('Data fetched is Error: ', data?.success)
                        setStep(1);
                        Alert.alert('Error', error?.message || data?.message || 'An Error occurred.');
                        progress.value = withTiming(progress.value === 1 ? 0 : 0, {
                            duration: 400,
                            easing: Easing.bezier(0.4, 0, 0.2, 1),
                        });
                    }
                })
            : verifyOtp(otp)
                .then(() => {
                    console.log('OTP verification called.');
                    navigation.navigate("Home")
                })
    }, [phoneNumber, otp, step]);

    const handleLoginButtonPress = async () => {
        switch (step) {
            case 0:
                if (phoneNumber.length !== 10) return;
                await getOtp(phoneNumber)
                    .then(() => {
                        if (data?.success) {
                            setStep(2);
                            flipTo(1)
                        } else {
                            console.log('Data fetched is Error: ', data?.success)
                            setStep(1);
                            flipTo(0)
                            Alert.alert('Error', error?.message || data?.message || 'An Error occurred.');
                        }
                    })
                break;
            case 1:
                if (otp.length !== 6) return;
                flipTo(2);
                await verifyOtp(otp)
                    .then(() => {
                        if (!data?.success) {
                            Alert.alert('Error', error?.message || 'An error occurred: ' + error?.message);
                            flipTo(1);
                            setStep(1);
                        } else {
                            navigation.navigate('Home');
                        }
                    })
                break;

            default:
                setStep(0);
                flipTo(0);
                break;
        }
    };

    const disabled = (step === 1 ? phoneNumber.length !== 10 : otp.length !== 6)
    const phoneStyle = useAnimatedStyle(() => ({
        transform: [
            {perspective: 900},
            {rotateX: `${interpolate(flip1.value, [0, 1], [0, 180])}deg`},
        ],
        pointerEvents: flip1.value > 0.5 ? 'none' : 'auto',
    }));

    const otpStyle = useAnimatedStyle(() => ({
        transform: [
            {perspective: 900},
            {
                rotateX: `${
                    interpolate(flip1.value, [0, 1], [180, 360]) +
                    interpolate(flip2.value, [0, 1], [0, 180])
                }deg`,
            },
        ],
        pointerEvents: flip1.value < 0.5 || flip2.value > 0.5 ? 'none' : 'auto',
    }));
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inner}>

                {/* App Name */}
                <Text style={styles.appName}>Apna Get Ride</Text>

                {/* Header */}
                <View style={styles.headerBlock}>
                    <Text style={styles.welcomeTitle}>Welcome Back</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Please enter your details to continue.
                    </Text>
                </View>

                {/* Social Buttons */}
                <View style={styles.socialRow}>
                    <TouchableOpacity
                        style={styles.socialButton}
                        accessible={true}
                        accessibilityLabel={'Sign-in with Google'}
                    >
                        <MaterialCommunityIcons name="google" size={20} color="#1a1a2e"/>
                        <Text style={styles.socialButtonText}>Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.socialButton}
                        accessible={true}
                        accessibilityLabel={'Sign-in with Apple'}
                    >
                        <LucideMail size={20} color="#1a1a2e"/>
                        <Text style={styles.socialButtonText}>Apple</Text>
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine}/>
                    <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                    <View style={styles.dividerLine}/>
                </View>

                {/* Email Field */}
                <RenderFormField
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    label="PHONE"
                    placeholder="Your 10-digit phone number"
                    keyboardType="numeric"
                    autoCapitalize="none"
                    labelColor="#6B7280"
                    labelColorActive="#1a1a2e"
                    borderColorInactive="#E5E7EB"
                    borderColorActive="#1a1a2e"
                    textColor="#111827"
                    placeholderTextColor="#9CA3AF"
                    icon={
                        <LucideMail
                            size={20}
                            color="#1a1a2e"
                        />
                    }
                    style={styles.fieldSpacing}
                    accessibilityLabel={'Input your 10-digit phone number here'}
                    maxLength={10}
                    inputType={'phone'}
                    editable={step === 1}
                />

                {/* Password Field with Forgot label */}
                <View style={styles.passwordBlock}>
                    <View style={styles.passwordLabelRow}>
                        <Text style={styles.passwordLabel}>OTP</Text>
                        <TouchableOpacity>
                            <Text style={styles.forgotText}>FORGOT?</Text>
                        </TouchableOpacity>
                    </View>
                    <RenderFormField
                        value={otp}
                        onChangeText={setOtp}
                        placeholder="••••••••"
                        keyboardType="numeric"
                        autoCapitalize="none"
                        secureTextEntry={true}
                        borderColorInactive="#E5E7EB"
                        borderColorActive="#1a1a2e"
                        textColor="#111827"
                        placeholderTextColor="#9CA3AF"
                        icon={
                            <MaterialCommunityIcons
                                name="lock-outline"
                                size={20}
                                color="#9CA3AF"
                            />
                        }
                        accessibilityLabel={'Input your 6-digit OTP78 here'}
                        maxLength={6}
                        editable={step === 2}
                    />
                </View>

                {/* Login Button */}
                <TouchableOpacity
                    style={[styles.loginButton,
                        (disabled || loading) && {backgroundColor: COLORS.surfaceContainerHighest}]}
                    onPress={handleLogin}
                    disabled={disabled || loading}
                >
                    <Text style={styles.loginButtonText}>
                        {error ? error.message : loading
                            ? <ActivityIndicator size={16} color={COLORS.secondary}/>
                            : step === 1
                                ? 'Get OTP'
                                : `${otp.length !== 6
                                    ? 'Enter 6-digit OTP'
                                    : 'Verify OTP'}`
                        }
                    </Text>
                </TouchableOpacity>
                {step === 2 && <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <TouchableOpacity onPress={() => setStep(1)}>
                        <Text style={{
                            fontSize: 12,
                            color: 'blue'
                        }}>Change Phone Number?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text>Resend OTP</Text>
                    </TouchableOpacity>

                </View>}
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.loginButtonText}>Go To Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Text style={styles.loginButtonText}>Go To Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.navigate('Kyc')}
                >
                    <Text style={styles.loginButtonText}>Go To KYC page</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    inner: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 24,
        justifyContent: "center",
    },
    appName: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1a1a2e",
        textAlign: "center",
        marginBottom: 32,
        letterSpacing: 0.3,
    },
    headerBlock: {
        marginBottom: 28,
    },
    welcomeTitle: {
        fontSize: 34,
        fontWeight: "800",
        color: "#1a1a2e",
        marginBottom: 6,
    },
    welcomeSubtitle: {
        fontSize: 15,
        color: "#6B7280",
        fontWeight: "400",
    },
    socialRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 24,
    },
    socialButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#EBEBEB",
        borderRadius: 12,
        paddingVertical: 14,
    },
    socialButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1a1a2e",
    },
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
        gap: 10,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#D1D5DB",
    },
    dividerText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#9CA3AF",
        letterSpacing: 1,
    },
    fieldSpacing: {
        marginBottom: 20,
    },
    passwordBlock: {
        width: "100%",
        marginBottom: 28,
    },
    passwordLabelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    passwordLabel: {
        fontSize: 12,
        fontWeight: "800",
        color: "#6B7280",
        letterSpacing: 0.5,
    },
    forgotText: {
        fontSize: 12,
        fontWeight: "800",
        color: "#1a1a2e",
        letterSpacing: 0.5,
    },
    loginButton: {
        backgroundColor: "#1a1a2e",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginVertical: 4,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
        letterSpacing: 0.3,
    },
});