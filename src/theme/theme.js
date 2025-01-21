import { theme } from 'ant-design-vue/lib';
import convertLegacyToken from 'ant-design-vue/lib/theme/convertLegacyToken';

const { defaultAlgorithm, defaultSeed } = theme;

const dark = {
    sideColor: '#001529',
}

const light = {
    sideColor: '#FFFFFF',
}

export const themeMode = {
    dark,
    light,
};
