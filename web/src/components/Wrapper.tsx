import React from "react";
import { Box } from "@chakra-ui/react";

export type WrapperVariants = "small" | "regular" | "full";

interface Props {
  variant?: WrapperVariants;
}

export const Wrapper: React.FC<Props> = ({ children, variant = "regular" }) => {
  return (
    <Box mt={8} mx="auto" maxW={"800px"} w="100%">
      {children}
    </Box>
  );
};
