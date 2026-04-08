import * as ImagePicker from "expo-image-picker";
import {Alert} from "react-native";

const pickImage = async (fromCamera: boolean): Promise<string | null> => {
    const permFn = fromCamera
        ? ImagePicker.requestCameraPermissionsAsync
        : ImagePicker.requestMediaLibraryPermissionsAsync;

    const {status} = await permFn();
    if (status !== 'granted') {
        Alert.alert(
            'Permission Required',
            `Please allow ${fromCamera ? 'camera' : 'gallery'} access in your device settings.`,
        );
        return null;
    }

    const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.85,
            allowsEditing: true,
            aspect: [4, 3],
        })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.85,
            allowsEditing: true,
            aspect: [4, 3],
        });

    if (!result.canceled && result.assets.length > 0) {
        return result.assets[0].uri;
    }
    return null;
};

export default pickImage;