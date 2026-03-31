import { useRef } from "react";
import { View } from "react-native";
import { BlurTargetView } from "expo-blur";
import Footer from "./Footer";

const Layout = ({ children }: any) => {
    const blurTargetRef = useRef<View>(null);

    return (
        <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
            {children}
            <Footer blurTargetRef={blurTargetRef} />
        </BlurTargetView>
    );
};

export default Layout;