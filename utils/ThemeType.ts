import {AppColors, AppTheme} from "../theme";

type ThemeType = {
    theme: AppTheme;
    colors: AppColors;
    isDark: boolean;
    shadow:  {
        boxShadow: string;
    }
};

export default ThemeType;