import React, {useMemo} from "react";
import {StyleSheet, Text, View} from "react-native";
import ThemeType from "../utils/ThemeType";
import {useAppTheme} from "../hooks/useAppTheme";

interface SectionHeaderProps {
    step: string;
    title: string;
    subtitle: string;
    sectionStyles?: ReturnType<typeof createSectionStyles>;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({step, title, subtitle}) => {
    const {theme, isDark} = useAppTheme();
    const {colors, shadow} = theme;
    const sectionStyles = useMemo(() => createSectionStyles({theme, colors, isDark, shadow}), [theme, colors, isDark]);
    return (
    <View style={sectionStyles.row}>
        <View style={sectionStyles.stepBadge}>
            <Text style={sectionStyles.stepText}>{step}</Text>
        </View>
        <View style={{flex: 1}}>
            <Text style={sectionStyles.title}>{title}</Text>
            <Text style={sectionStyles.subtitle}>{subtitle}</Text>
        </View>
    </View>
)};

export default SectionHeader
const createSectionStyles = ({colors}: ThemeType) => StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
    },
    stepBadge: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingHorizontal: 9,
        paddingVertical: 5,
        marginTop: 2,
    },
    stepText: {
        fontFamily: 'Manrope',
        fontSize: 11,
        fontWeight: '800',
        color: colors.secondaryContainer,
        letterSpacing: 1,
    },
    title: {
        fontFamily: 'Manrope',
        fontSize: 17,
        fontWeight: '800',
        color: colors.primary,
        letterSpacing: -0.2,
        marginBottom: 3,
    },
    subtitle: {
        fontFamily: 'Inter',
        fontSize: 12,
        color: colors.onSurfaceVariant,
        lineHeight: 17,
    },
});