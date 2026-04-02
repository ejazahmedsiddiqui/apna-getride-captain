import {View, Text, ViewStyle} from "react-native";
import React from "react";
import {EaseView} from "react-native-ease";
import {SafeAreaView} from "react-native-safe-area-context";

interface FadeCardProps {
    children: React.ReactNode;
    cardStyle?: ViewStyle;
}

function FadeCard({cardStyle, children}: FadeCardProps) {
    return (
        <EaseView
            initialAnimate={{translateY: 100}}
            animate={{translateY: 0}}
            transition={{type: 'timing', duration: 1200}}
            style={[cardStyle, {flex: 1}]}
        >
            {children}
        </EaseView>
    );
}

function SettingsScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <FadeCard cardStyle={{flex: 1}}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: 'black'}}>Setting Screen</Text>
                </View>
            </FadeCard>
        </SafeAreaView>
    );
};

export default SettingsScreen;