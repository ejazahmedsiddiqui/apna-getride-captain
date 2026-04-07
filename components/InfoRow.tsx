import React from "react";
import {AppColors} from "../theme";
import {StyleSheet, Text, View} from "react-native";

interface InfoRowProps  {
    icon: React.ReactNode;
    label: string;
    value: string | undefined;
    colors: AppColors;
}
function InfoRow({
                     icon,
                     label,
                     value,
                     colors,
                 }: InfoRowProps) {
    return (
        <View style={rowStyles.row}>
            <View
                style={[
                    rowStyles.iconWrapper,
                    {backgroundColor: colors.surfaceContainer},
                ]}>
                {icon}
            </View>
            <View style={rowStyles.text}>
                <Text
                    style={[
                        rowStyles.label,
                        {color: colors.onSurfaceVariant, fontFamily: 'Inter'},
                    ]}>
                    {label}
                </Text>
                <Text
                    style={[
                        rowStyles.value,
                        {color: colors.onSurface, fontFamily: 'Manrope'},
                    ]}>
                    {value ?? '—'}
                </Text>
            </View>
        </View>
    );
}

const rowStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {flex: 1},
    label: {fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2},
    value: {fontSize: 15, fontWeight: '600'},
});

export default InfoRow;