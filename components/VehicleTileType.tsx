import {useAppTheme} from "../hooks/useAppTheme";
import React, {useMemo} from "react";
import {TouchableOpacity, View, StyleSheet, Text} from "react-native";
import ThemeType from "../utils/ThemeType";

type VehicleTypeProps = {
    Icon: React.ComponentType<{ size?: number; color?: string }>;
    label: string;
    selected?: boolean;
    onPress?: () => void;
};

const VehicleTypeTile = ({Icon, label, selected = false, onPress}: VehicleTypeProps) => {
    const {theme, isDark} = useAppTheme();
    const {colors, shadow} = theme;
    const typeTileStyle = useMemo(
        () => createTypeTileStyle({theme, colors, isDark, shadow}),
        [theme, colors, isDark, selected]
    );

    return (
        <View style={typeTileStyle.wrapper}>
            <TouchableOpacity
                style={[typeTileStyle.tile, selected && typeTileStyle.tileSelected]}
                onPress={onPress}
                activeOpacity={0.8}
                accessibilityLabel={`Select ${label}`}
            >
                <View style={typeTileStyle.placeholder}>
                    <View style={[typeTileStyle.iconRing, selected && typeTileStyle.iconRingSelected]}>
                        <Icon size={28} color={selected ? colors.onPrimary : colors.primary}/>
                    </View>
                    <Text style={[typeTileStyle.placeholderTitle, selected && typeTileStyle.placeholderTitleSelected]}>
                        {label}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};
const createTypeTileStyle = ({colors}: ThemeType) => StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    tile: {
        height: 130,
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: colors.outline,
        borderStyle: 'dashed',
    },
    placeholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: 10,
    },
    iconRing: {
        backgroundColor: colors.primaryFixed,
        borderRadius: 50,
        padding: 10,
        marginBottom: 2,
    },
    placeholderTitle: {
        fontFamily: 'Inter',
        fontSize: 11,
        fontWeight: '600',
        color: colors.primary,
        textAlign: 'center',
    },
    tileSelected: {
        backgroundColor: colors.primaryFixed,
        borderColor: colors.primary,
        borderStyle: 'solid',
    },
    iconRingSelected: {
        backgroundColor: colors.primary,
    },
    placeholderTitleSelected: {
        color: colors.onPrimaryContainer,
        fontWeight: '700',
    },
});

export default VehicleTypeTile;