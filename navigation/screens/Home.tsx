import { View, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";

function HomeScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inner}>
                {/* Card */}
                <View style={styles.card}>
                    {/* Car Image */}
                    <Image
                        source={require("../../assets/car-image.png")}
                        style={styles.image}
                        resizeMode="cover"
                        accessibilityLabel="An image of a car in front of an office building"
                    />

                    {/* Dark blue gradient overlay at bottom */}
                    <View style={styles.gradientOverlay} />

                    {/* Frosted glass info box */}
                    <View style={styles.infoBox}>
                        {/* Badge row */}
                        <View style={styles.badgeRow}>
                            <View style={styles.badgeIcon}>
                                <Feather name="check-circle" size={16} color="#ffffff" />
                            </View>
                            <Text style={styles.badgeText}>PREMIUM FLEET</Text>
                        </View>

                        {/* Subtitle */}
                        <Text style={styles.subtitleText}>
                            Top-tier comfort, every single time.
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default HomeScreen;

const CARD_WIDTH = 342;
const CARD_HEIGHT = 460;
const CARD_RADIUS = 42;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f5",
        paddingHorizontal: 24,
    },
    inner: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: CARD_RADIUS,
        overflow: "hidden",
        boxShadow: '0px 10px 10px rgba(0,0,0,0.18)'
    },

    image: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        position: "absolute",
        top: 0,
        left: 0,
    },

    gradientOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: CARD_WIDTH,
        height: CARD_HEIGHT * 0.65,
        experimental_backgroundImage:
            "linear-gradient(to top, rgba(0,6,102,0.92) 0%, rgba(0,6,102,0.0) 100%)",
    },

    // ── Frosted-glass info box ───────────────────────────────────
    infoBox: {
        position: "absolute",
        bottom: 28,
        left: 20,
        right: 20,
        backgroundColor: "rgba(235, 237, 245, 0.75)",
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 18,
        gap: 10,
    },

    // Badge row (icon + "PREMIUM FLEET" label)
    badgeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    badgeIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#1a9e3a",
        alignItems: "center",
        justifyContent: "center",
    },
    badgeText: {
        fontSize: 13,
        fontWeight: "700",
        letterSpacing: 1.2,
        color: "#1e1e1e",
    },

    // Subtitle
    subtitleText: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1a1f5e",
        lineHeight: 30,
    },
});