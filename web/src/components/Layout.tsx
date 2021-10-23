import React from "react";
import Navbar from "./Navbar";
import { Wrapper, WrapperVariants } from "./Wrapper";

interface Props {
  variant?: WrapperVariants;
}

export const Layout: React.FC<Props> = ({ variant, children }) => {
  return (
    <>
      <Navbar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
