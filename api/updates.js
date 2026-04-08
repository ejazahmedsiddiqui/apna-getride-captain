import {BASE_URL} from "./index";
import {storage, TOKEN_KEY} from "../storage/storage";
import {existsMMKV} from "react-native-mmkv";

export const updateVehicle = async (vehicle, image) => {
    const hasStorage = existsMMKV("apna-getride-captain")
    if (!hasStorage) {
        return {success: false, errorMessage: "Authentication token data is required", errorStatus: 404};
    }
    const token = storage.getString(TOKEN_KEY);
    console.log("@/api/auth/updateVehicle ⟼ accessed. vehicle Data is: ", image);
    const formData = new FormData();
    if (!vehicle || !image) {
        return {success: false, errorMessage: "vehicle data is required", errorStatus: 404};
    }
    if (image) formData.append("file", {
        uri: image,
        name: "numberplate.jpg",
        type: "image/jpeg",
    });
    ;
    if (vehicle.type) formData.append("type", vehicle.type);
    if (vehicle.number) formData.append("number", vehicle.number);
    if (vehicle.model) formData.append("model", vehicle.model);
    if (vehicle.color) formData.append("color", vehicle.color);
    console.log('FormData is: ', formData);
    try {
        const response = await fetch(`${BASE_URL}/captain/vehicle`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            return {success: false, errorMessage: data.message || data?.error?.message, errorStatus: response.status};
        }
        return {success: true, data};
    } catch (error) {
        console.log(error);
        return {success: false, errorMessage: "Network error", errorStatus: 0};
    }
}