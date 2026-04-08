import { BASE_URL } from "./index";
import {storage, TOKEN_KEY} from "../storage/storage";

export const userSendOtp = async (identifier) => {
    console.log("@/api/auth/sendOtp ⟼ accessed. Identifier is: ", identifier);
    try {
        const response = await fetch(`${BASE_URL}/auth/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, role: "driver" }),
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            return { success: false, errorMessage: data.message, errorStatus: response.status };
        }
        return { success: true, data };
    } catch (error) {
        console.log(error);
        return { success: false, errorMessage: "Network error", errorStatus: 0 };
    }
};

export const userVerifyOtp = async (identifier, otp) => {
    console.log("@/api/auth/verifyPhoneOtp ⟼ accessed. Identifier is: ", identifier, "OTP is: ", otp);
    try {
        const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, role: "driver", otp }),
        });
        const data = await response.json();
        if (!response.ok) {
            return { success: false, errorMessage: data.message, errorStatus: response.status };
        }
        return { success: true, data: data };
    } catch (error) {
        console.log(error);
        return { success: false, errorMessage: "Network error", errorStatus: 0 };
    }
};

export const getUserProfile = async (token) => {
    console.log("@/api/auth/getUserProfile ⟼ accessed.");
    try {
        const response = await fetch(`${BASE_URL}/captain/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (!response.ok) {
            return { success: false, errorMessage: data.message, errorStatus: response.status };
        }
        return { success: true, data: data };
    } catch (error) {
        console.log(error);
        return { success: false, errorMessage: "Network error", errorStatus: 0 };
    }
};

export const updateUserProfile = async (userData, image) => {
    const hasStorage = storage.contains(TOKEN_KEY)
    if (!hasStorage) {
        return {success: false, errorMessage: "Authentication token data is required", errorStatus: 404};
    }
    const token = storage.getString(TOKEN_KEY);
    console.log("@/api/auth/updateVehicle ⟼ accessed. vehicle Data is: ", image);
    const formData = new FormData();
    if (!userData || !image) {
        return {success: false, errorMessage: "User data is required", errorStatus: 404};
    }
    if (image) formData.append("file", {
        uri: image,
        name: "numberplate.jpg",
        type: "image/jpeg",
    });

    console.log('FormData is: ', formData);
    try {
        const response = await fetch(`${BASE_URL}/captain/kyc`, {
            method: "PATCH",
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