import {View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Easing, ScrollView} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {SafeAreaView} from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import {StepForward} from "lucide-react-native";
import Carousel from "react-native-reanimated-carousel";
import {useState} from "react";
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';

const {width} = Dimensions.get("window");


function PaginationDot({isActive}: { isActive: boolean }) {

    const animatedStyle = useAnimatedStyle(() => ({
        width: withTiming(isActive ? 40 : 7, {duration: 400}),
        backgroundColor: isActive ? '#000066' : '#ccc',
    }));

    return (
        <Animated.View
            style={[
                {height: 7, borderRadius: 20, marginHorizontal: 2},
                animatedStyle,
            ]}
        />
    );
}

function HomeScreen() {
    const navigation = useNavigation();
    const [activeIndex, setActiveIndex] = useState(0);
    const tabText = [
        {
            id: 1,
            title1: 'Ride smarter,',
            title2: 'arrive faster',
            subtitle: 'Instant bookings with real-time tracking and upfront pricing. Travel with confidence every time.'
        },
        {
            id: 2,
            title1: 'Comfort meets',
            title2: 'Class',
            subtitle: 'Choose from top-tier vehicles designed for smooth, stylish, and stress-free journeys.'
        },
        {
            id: 3,
            title1: 'Your journey,',
            title2: 'your control',
            subtitle: 'Customize pickups, routes, and preferences. Travel exactly the way you want.'
        },
        {
            id: 4,
            title1: 'Reliable rides,',
            title2: 'anytime you need',
            subtitle: 'Early morning or late night, count on consistent service with trusted drivers.'
        },
        {
            id: 5,
            title1: 'Seamless booking,',
            title2: 'zero hassle',
            subtitle: 'From tap to destination in seconds. No friction, no confusion—just smooth travel.'
        }
    ]
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{
                    flex: 1,
                    alignItems: 'center',
                }}
            >
                <View style={styles.inner}>
                    <View style={styles.card}>
                        <Image
                            source={require("../../assets/car-image.png")}
                            style={styles.image}
                            resizeMode="cover"
                            accessibilityLabel="An image of a car in front of an office building"
                        />

                        <View style={styles.gradientOverlay}/>

                        {/* Frosted glass info box */}
                        <View style={styles.infoBox}>
                            {/* Badge row */}
                            <View style={styles.badgeRow}>
                                <View style={styles.badgeIcon}>
                                    <Feather name="check-circle" size={16} color="#ffffff"/>
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
                {/*Bottom Tab Information.*/}
                <View style={styles.bottomTab}>
                    <Carousel
                        data={tabText}
                        width={width - 48}
                        height={160}
                        loop={true}
                        scrollAnimationDuration={400}
                        onSnapToItem={(index) => setActiveIndex(index)}
                        renderItem={({item}) => (
                            <View style={styles.bottomTabTextBox}>
                                <View style={{marginBottom: 16}}>
                                    <Text style={styles.bottomTabTextBoxTitle}>{item.title1}</Text>
                                    <Text style={styles.bottomTabTextBoxTitle}>{item.title2}</Text>
                                </View>
                                <Text style={styles.bottomTabTextBoxSubTitle}>{item.subtitle}</Text>
                            </View>
                        )}
                        autoPlay={true}
                        autoPlayInterval={6000}
                    />

                    {/* Pagination + Next button — outside the carousel */}
                    <View style={styles.bottomTabNav}>
                        <View style={styles.bottomTabNavBars}>
                            {tabText.map((_, index) => (
                                <PaginationDot key={index} isActive={index === activeIndex}/>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <Text style={styles.nextButtonText}>Next</Text>
                            <StepForward size={20} color={'#ffffff'}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
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
        alignItems: "center",
        justifyContent: "center",
    },
    inner: {
        alignItems: "center",
        marginVertical: 20,
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: CARD_RADIUS,
        overflow: "hidden",
        boxShadow: '0px 10px 10px rgba(0,0,0,0.18)',
    },
    image: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0
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
    subtitleText: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1a1f5e",
        lineHeight: 30,
    },
    bottomTab: {
        justifyContent: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderRadius: 20,
        width: '100%',
        height: 'auto',
        marginBottom: 40,
    },
    bottomTabTextBox: {
        justifyContent: 'space-evenly',
    },
    bottomTabTextBoxTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000666',
        lineHeight: 32,
    },
    bottomTabTextBoxSubTitle: {
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 1,
        fontWeight: 400
    },
    bottomTabNav: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
    },
    bottomTabNavBars: {
        flexDirection: 'row',
        gap: 4
    },
    bar: {
        width: 40,
        height: 7,
        marginHorizontal: 2,
    },
    nextButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#000666',
        flexDirection: 'row',
        gap: 8,
        borderRadius: 8,
        boxShadow: '0px 10px 10px rgba(0,0,0,0.18)'
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: '#f1f1f1',
    }
});