import { EaseView } from "react-native-ease";

interface LoadCardProps {
    children: React.ReactNode;
}

function LoadCard({ children }: LoadCardProps) {
    return (
        <EaseView
            initialAnimate={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 8, stiffness: 200, mass: 1 }}
            style={{ flex: 1 }}
        >
            {children}
        </EaseView>
    );
}
export default LoadCard
