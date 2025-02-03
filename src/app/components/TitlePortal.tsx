import * as React from "react";
import { Typography, TypographyProps } from "@mui/material";

export const TitlePortal = (props: TypographyProps) => {
  return (
    <Typography
      flex="1"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      overflow="hidden"
      variant="h6"
      color="inherit"
      {...props}
    />
  );
};
