import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { getUserProfile } from "../api/auth";
import { Alert } from "react-native";
import {storage, TOKEN_KEY} from "../storage/storage";
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
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoadingProfile: boolean;
    setTokenAndFetchProfile: (token: string) => Promise<void>;
    fetchProfile: () => Promise<void>;
    logout: () => void;
};
const UserContext = createContext<UserContextType | null>(null);

function UserProvider({ children }: { children: React.ReactNode }) {
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
    useEffect(() => {
        if(token){
            console.log('Authentication state vs !!token is: ', isAuthenticated, !!token)
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
            console.log('Token is: ',token)
            fetchProfile();
        }
    }, [token, fetchProfile]);

    const setTokenAndFetchProfile = useCallback(async (newToken: string) => {
        storage.set(TOKEN_KEY, newToken);
        storage.encrypt(TOKEN_KEY, 'AES-256');
        setToken(newToken);
    }, []);

    const logout = useCallback(() => {
        storage.remove(TOKEN_KEY);
        setToken(null);
        setUser(null);
    }, []);

    return (
        <UserContext.Provider
            value={{ isAuthenticated, user, isLoadingProfile, setTokenAndFetchProfile, logout, fetchProfile }}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider

export function useUserContext() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUserContext must be used inside <UserProvider>");
    return ctx;
}