import {useState} from 'react';
import {sendOtp, verifyPhoneOtp} from "../api/auth";
type dataType = {
    success?: boolean;
    otp: string,
    identifier : string,
    access_token: string,
    user : string,
    id: string,
    role : string,
    message? : string,

}
type errorType = {
    message: string,
    status: string,
}

export const useOtpLogin = () => {
    const [data, setData] = useState <dataType | null>(null);
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<errorType |null>(null);
    const getOtp = async (identifier: string) => {
        console.log('useOtpLogin → Identifier ', identifier);
        setLoading(true);
        setError(null);
        try {
            const result: any = await sendOtp(identifier);
            if (result.success) {
                setIdentifier(identifier);
                setData(result);
            } else {
                setError({ message: result?.errorMessage || 'Unexpected error', status: result?.errorStatus || 0 });
            }
            return result.success;
        } catch (err: any) {
            setError({ message: err?.errorMessage || 'Unexpected error', status: err?.status || 0 });
            return false;
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (otp: string | number) => {
        setLoading(true);
        setError(null);
        try {
            const result: any = await verifyPhoneOtp(identifier, otp);
            if (result.success) {
                setData(result.data);
            } else {
                setError(result.error);
            }
        } catch (err: any) {
            setError({ message: err?.message || 'Unexpected error', status: err?.status || 0 });
        } finally {
            setLoading(false);
        }
    };
    return {data, getOtp, verifyOtp, loading, error}
}