import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {SafeAreaView} from "react-native-safe-area-context";
import RenderFormField from "../../components/RenderFormField";
import {useCallback, useState} from "react";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {LucideMail} from 'lucide-react-native';

function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = useCallback(() => {
        if (!email || !password) return
        navigation.navigate("Home")
    }, [email, password]);
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
                    value={email}
                    onChangeText={setEmail}
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
                        value={password}
                        onChangeText={setPassword}
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
                    />
                </View>

                {/* Login Button */}
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                >
                    <Text style={styles.loginButtonText}>Log In</Text>
                </TouchableOpacity>
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
        marginBottom: 16,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
        letterSpacing: 0.3,
    },
});