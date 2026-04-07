import { useCallback, useState } from "react";
import { userSendOtp, userVerifyOtp } from "../api/auth";
import { useUserContext } from "../context/UserContext";

type OtpError = { message: string };

type UseOtpLoginReturn = {
    loading: boolean;
    error: OtpError | null;
    getOtp: (phoneNumber: string) => Promise<boolean>;
    verifyOtp: (phoneNumber: string, otp: string) => Promise<boolean>;
};

export function useOtpLogin(): UseOtpLoginReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<OtpError | null>(null);
    const { setTokenAndFetchProfile } = useUserContext();

    const getOtp = useCallback(async (phoneNumber: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        const result = await userSendOtp(phoneNumber);
        setLoading(false);
        if (!result.success) {
            setError({ message: result.errorMessage ?? "Failed to send OTP" });
            return false;
        }
        return true;
    }, []);

    const verifyOtp = useCallback(
        async (phoneNumber: string, otp: string): Promise<boolean> => {
            setLoading(true);
            setError(null);
            const result = await userVerifyOtp(phoneNumber, otp);
            if (!result.success) {
                setLoading(false);
                setError({ message: result.errorMessage ?? "OTP verification failed" });
                return false;
            }
            if (!result.data?.access_token) {
                setError({ message: "Invalid server response" });
                setLoading(false);
                return false;
            }
            const { access_token } = result.data as { access_token: string };
            try {
                await setTokenAndFetchProfile(access_token);
            } catch (error: any) {
                setError(error)
            } finally {
                setLoading(false);
            }
            return true;
        },
        [setTokenAndFetchProfile]
    );

    return { loading, error, getOtp, verifyOtp };
}