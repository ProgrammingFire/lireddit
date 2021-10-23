import { Flex, Spinner } from "@chakra-ui/react";
import React from "react";
import { Layout } from "./Layout";

export const LoadingBar: React.FC<{}> = ({}) => {
  return (
    <Flex justify="center" align="center" h="74vh">
      <Spinner colorScheme="facebook" size="xl"></Spinner>
    </Flex>
  );
};
