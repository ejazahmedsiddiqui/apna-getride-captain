import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: "apna-getride-captain" });
export const TOKEN_KEY = "access_token";