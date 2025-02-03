import {
  AppBar as DefaultAppBar,
  LocalesMenuButton,
  ToggleThemeButton,
} from "react-admin";
import { SettingsButton } from "./SettingButton";
import { TitlePortal } from "./TitlePortal";

export const AppBar = () => {
  return (
    <DefaultAppBar
      color="default"
      toolbar={
        <>
          <ToggleThemeButton />
          <LocalesMenuButton />
          <SettingsButton />
        </>
      }
    >
      <img
        src="https://e7.pngegg.com/pngimages/996/992/png-clipart-zeronet-peer-to-peer-bittorrent-computer-network-world-wide-web-purple-computer-network.png"
        style={{ height: "40px" }}
      />
      <TitlePortal variant="body1" style={{ padding: "8px" }}>
        {process.env.APP_NAME}
      </TitlePortal>
    </DefaultAppBar>
  );
};
