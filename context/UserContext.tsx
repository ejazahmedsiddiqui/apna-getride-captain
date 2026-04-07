import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { createMMKV } from "react-native-mmkv";
import { getUserProfile } from "../api/auth";
import { Alert } from "react-native";

export const storage = createMMKV({ id: "apna-getride-captain" });
export const TOKEN_KEY = "access_token";

export type UserProfile = {
    _id: string;
    fullName: string;
    phoneNumber: string;
    isVerified: boolean;
    accountStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED" | string;
    rating: number;
    totalRides: number;
    acceptanceRate: number;
    createdAt: string;
    updatedAt: string;
    profileImage: string | null;
    vehicle: object | null;
    wallet: object | null;
    documents: object | null;
    location: object | null;
};

type UserContextType = {
    token: string | null;
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoadingProfile: boolean;
    setTokenAndFetchProfile: (token: string) => Promise<void>;
    logout: () => void;
};
const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const initialToken = storage.getString(TOKEN_KEY) ?? null;
    const [token, setToken] = useState<string | null>(initialToken);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(!!initialToken);

    const isAuthenticated = !!token;

    useEffect(() => {
        if (!token && isAuthenticated) {
            logout
        }
    }, [token, isAuthenticated]);
    const fetchProfile = useCallback(async () => {
        setIsLoadingProfile(true);
        if (!token) {
            setIsLoadingProfile(false);
            logout
            return;
        }
        const result = await getUserProfile(token);
        console.log('token: ', token);
        if (result.success && !result.data) {
            console.error('An error occurred - no data was found.');
            Alert.alert('ERROR', 'NO DATA CAME FROM SERVER.')
        }
        if (result.success && result.data) {
            setUser(result.data as UserProfile);
        }

        setIsLoadingProfile(false);
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchProfile();
        }
    }, [token, fetchProfile]);

    const setTokenAndFetchProfile = useCallback(async (newToken: string) => {
        storage.set(TOKEN_KEY, newToken);
        setToken(newToken);
    }, []);

    const logout = useCallback(() => {
        storage.remove(TOKEN_KEY);
        setToken(null);
        setUser(null);
    }, []);

    return (
        <UserContext.Provider
            value={{ isAuthenticated, token, user, isLoadingProfile, setTokenAndFetchProfile, logout }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUserContext must be used inside <UserProvider>");
    return ctx;
}