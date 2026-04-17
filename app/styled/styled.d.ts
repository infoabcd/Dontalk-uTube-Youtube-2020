import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    barBg: string;
    mainBg: string;
    channelBg: string;
    modalBg: string;
    primaryColor: string;
    secondaryColor: string;
    accent: string;
    toggle: string;
    itemHover: string;
    itemActive: string;
    divider: string;
    disableBg: string;
  }
}
