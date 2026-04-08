import { BASE_URL } from "./index";

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