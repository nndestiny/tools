import { AppBar, useTheme } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

import SvgIcon from "@/components/SvgIcon";
import ColorModeContext from "@/contexts/colorModeContext";

export default function Header() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const pathname = usePathname();

  return (
    <AppBar
      color="inherit"
      className="flex h-[70px] flex-row items-center justify-between px-10 bg-[#0F1012] shadow-md"
    >
      <h1 className=" flex items-center gap-2 text-[22px] font-bold">
        <Link href="/">SPM · Tool</Link>
      </h1>

      <div className="">
        <a href="https://t.me/zksyncscription" target="_blank" className="mr-8">
          <SvgIcon
            className="w-23px! h-20px! mr-32px"
            color="#fff"
            name="telegram"
          />
        </a>
        <a href="https://twitter.com/zkscription" target="_blank">
          <SvgIcon className="w-22px! h-18px!" color="#fff" name="twitter" />
        </a>
      </div>
    </AppBar>
  );
}
