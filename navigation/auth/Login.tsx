import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderFormField from "../../components/RenderFormField";
import { useCallback, useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LucideMail } from "lucide-react-native";
import { useOtpLogin } from "../../hooks/useOtpLogin";
import { COLORS } from "../../utils/COLORS";

function LoginScreen() {
    const [resendTimer, setResendTimer] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const { loading, error, getOtp, verifyOtp } = useOtpLogin();
    const [step, setStep] = useState<1 | 2>(1);

    useEffect(() => {
        if (resendTimer <= 0) return;

        const interval = setInterval(() => {
            setResendTimer((p) => p - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [resendTimer]);

    const disabled = step === 1 ? phoneNumber.length !== 10 : otp.length !== 6;

    const handleLogin = useCallback(async () => {
        if (step === 1) {
            if (phoneNumber.length !== 10) return;
            const sent = await getOtp(phoneNumber);
            if (sent) {
                setStep(2);
                setResendTimer(30);
            }
        } else {
            if (otp.length !== 6) return;
            await verifyOtp(phoneNumber, otp);
        }
    }, [step, phoneNumber, otp, getOtp, verifyOtp]);

    const handleResend = useCallback(async () => {
        if (resendTimer > 0) return;
        const sent = await getOtp(phoneNumber);
        if (sent) setResendTimer(30);
    }, [resendTimer, phoneNumber, getOtp]);

    const buttonLabel = useCallback(() => {
        if (loading) return;
        if (step === 1) return "Get OTP";
        return otp.length !== 6 ? "Enter 6-digit OTP" : "Verify OTP";
    }, [loading, step, otp]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.appName}>Apna Get Ride</Text>

                <View style={styles.headerBlock}>
                    <Text style={styles.welcomeTitle}>Welcome Back</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Please enter your details to continue.
                    </Text>
                </View>

                <View style={styles.socialRow}>
                    <TouchableOpacity
                        style={styles.socialButton}
                        accessible
                        accessibilityLabel="Sign-in with Google"
                        accessibilityRole="button"
                    >
                        <MaterialCommunityIcons name="google" size={20} color="#1a1a2e" />
                        <Text style={styles.socialButtonText}>Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.socialButton}
                        accessible
                        accessibilityLabel="Sign-in with Apple"
                    >
                        <LucideMail size={20} color="#1a1a2e" />
                        <Text style={styles.socialButtonText}>Apple</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                    <View style={styles.dividerLine} />
                </View>

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
                    icon={<LucideMail size={20} color="#1a1a2e" />}
                    style={styles.fieldSpacing}
                    accessibilityLabel="Input your 10-digit phone number here"
                    maxLength={10}
                    inputType="phone"
                    editable={step === 1}
                />

                <View style={styles.passwordBlock}>
                    <View style={styles.passwordLabelRow}>
                        <Text style={styles.passwordLabel}>OTP</Text>
                        <TouchableOpacity
                        accessibilityRole="button">
                            <Text style={styles.forgotText}>FORGOT?</Text>
                        </TouchableOpacity>
                    </View>
                    <RenderFormField
                        value={otp}
                        onChangeText={setOtp}
                        placeholder="••••••"
                        keyboardType="numeric"
                        autoCapitalize="none"
                        secureTextEntry
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
                        accessibilityLabel="Input your 6-digit OTP here"
                        maxLength={6}
                        editable={step === 2}
                    />
                </View>

                {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                )}

                <TouchableOpacity
                accessibilityRole="button"
                    style={[
                        styles.loginButton,
                        (disabled || loading) && { backgroundColor: COLORS.surfaceContainerHighest },
                    ]}
                    onPress={handleLogin}
                    disabled={disabled || loading}
                >
                    {loading ? (
                        <ActivityIndicator size={16} color={COLORS.secondary} />
                    ) : (
                        <Text style={styles.loginButtonText}>{buttonLabel()}</Text>
                    )}
                </TouchableOpacity>

                {step === 2 && (
                    <View style={styles.stepTwoRow}>
                        <TouchableOpacity
                        accessibilityRole="button"
                        onPress={() => { setStep(1); setOtp(""); }}>
                            <Text style={styles.changePhoneText}>Change Phone Number?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        accessibilityRole="button"
                            onPress={handleResend}
                            disabled={resendTimer > 0 || loading}
                        >
                            <Text
                                style={[
                                    styles.resendText,
                                    resendTimer > 0 && styles.resendTextDisabled,
                                ]}
                            >
                                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
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
    errorText: {
        fontSize: 13,
        color: "#DC2626",
        marginBottom: 8,
        textAlign: "center",
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
    stepTwoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    changePhoneText: {
        fontSize: 12,
        color: "#1a1a2e",
        fontWeight: "600",
    },
    resendText: {
        fontSize: 12,
        color: "#1a1a2e",
        fontWeight: "600",
    },
    resendTextDisabled: {
        color: "#9CA3AF",
    },
});