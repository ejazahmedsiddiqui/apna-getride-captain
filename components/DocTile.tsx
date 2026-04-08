import React, {useMemo} from "react";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useAppTheme} from "../theme";
import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ThemeType from "../utils/ThemeType";

interface DocTileProps {
    label: string;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    uri: string | null;
    onPick: (fromCamera: boolean) => void;
    error?: string;
}

const DocTile: React.FC<DocTileProps> = ({label, icon, uri, onPick, error}) => {
    const {theme, isDark} = useAppTheme();
    const {colors, shadow} = theme;
    const docStyles = useMemo(() => createDocStyles({theme, colors, isDark, shadow}), [theme, colors, isDark]);

    const showPickerOptions = () => {
        Alert.alert(label, 'Choose image source', [
            {text: 'Camera', onPress: () => onPick(true)},
            {text: 'Gallery', onPress: () => onPick(false)},
            {text: 'Cancel', style: 'cancel'},
        ]);
    };

    return (
        <View style={docStyles.wrapper}>
            <Text style={docStyles.metaLabel}>{label.toUpperCase()}</Text>
            <TouchableOpacity
                style={[docStyles.tile, error ? docStyles.tileError : null]}
                onPress={showPickerOptions}
                activeOpacity={0.8}
                accessibilityLabel={`Upload ${label}`}
            >
                {uri ? (
                    <>
                        <Image source={{uri}} style={docStyles.preview} resizeMode="cover"/>
                        <View style={docStyles.reuploadOverlay}>
                            <MaterialCommunityIcons name="camera-retake-outline" size={22} color="#fff"/>
                            <Text style={docStyles.reuploadText}>Replace</Text>
                        </View>
                    </>
                ) : (
                    <View style={docStyles.placeholder}>
                        <View style={docStyles.iconRing}>
                            <MaterialCommunityIcons name={icon} size={28} color={colors.primary}/>
                        </View>
                        <Text style={docStyles.placeholderTitle}>Upload Document</Text>
                        <Text style={docStyles.placeholderSub}>Camera · JPG · JPEG</Text>
                    </View>
                )}
            </TouchableOpacity>
            {error ? <Text style={docStyles.errorText}>{error}</Text> : null}
        </View>
    );
};

export default DocTile;

const createDocStyles = ({ colors }: ThemeType) => StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    metaLabel: {
        fontFamily: 'Inter',
        fontSize: 9.5,
        fontWeight: '700',
        letterSpacing: 1.8,
        color: colors.onSurfaceVariant,
        marginBottom: 6,
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
    tileError: {
        borderColor: colors.error,
        backgroundColor: colors.errorContainer,
    },
    preview: {
        width: '100%',
        height: '100%',
    },
    reuploadOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,6,102,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    reuploadText: {
        fontFamily: 'Inter',
        fontSize: 11,
        fontWeight: '600',
        color: colors.onPrimary,
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
    placeholderSub: {
        fontFamily: 'Inter',
        fontSize: 9.5,
        color: colors.onSurfaceVariant,
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    errorText: {
        fontFamily: 'Inter',
        fontSize: 11,
        fontWeight: '500',
        color: colors.error,
        marginTop: 5,
        paddingHorizontal: 2,
    },
});