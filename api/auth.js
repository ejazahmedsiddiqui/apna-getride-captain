import { fetch } from "expo/fetch";
import { BASE_URL } from "./index";

export const sendOtp = async (identifier) => {
    console.log("@/api/auth/sendOtp ⟼ accessed.");
    try {
        const response = await fetch(`${BASE_URL}/auth/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, role: "driver" }),
        });
        const data = await response.json();
        console.log(data)
        if (!response.ok) {
            return { success: false, errorMessage: data.message, errorStatus: response.status };
        }
        return { success: true, data: data };
    } catch (error) {
        console.log(error);
        return { success: false, errorMessage: "Network error", errorStatus: 0 };
    }
};

export const verifyPhoneOtp = async (identifier, otp) => {
    console.log("@/api/auth/verifyPhoneOtp ⟼ accessed.");
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
        return { success: true, data: data.data };
    } catch (error) {
        console.log(error);
        return { success: false, errorMessage: "Network error", errorStatus: 0 };
    }
};