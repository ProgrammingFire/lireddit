import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";

import NextLink from "next/link";
import { useRouter } from "next/router";

import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isServer } from "../utils/isServer";
import { Wrapper } from "./Wrapper";

interface Props {}

const Navbar: React.FC<Props> = ({}) => {
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <Button mr={3} colorScheme="blue" onClick={() => router.push("/login")}>
          Login
        </Button>
        <Button
          mr={3}
          colorScheme="whatsapp"
          onClick={() => router.push("/register")}
        >
          Register
        </Button>
      </>
    );
  } else {
    body = (
      <Flex align="center">
        <Button
          mr={3}
          colorScheme="blue"
          onClick={() => router.push("/profile")}
        >
          {data.me.username}
        </Button>
        <Button
          mr={3}
          colorScheme="whatsapp"
          onClick={() => router.push("/create-post")}
        >
          Create Post
        </Button>
        <Button
          colorScheme="red"
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
          color="white"
          fontWeight="normal"
          mr={2}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      bg="gray.900"
      color="white"
      p={4}
      position="sticky"
      top={0}
      zIndex={10}
      justify="center"
    >
      <Flex flex={1} maxW={"800px"}>
        <Heading fontStyle="normal" fontWeight="normal" size="md">
          <NextLink href="/">
            <Link>
              <Heading>LiReddit</Heading>
            </Link>
          </NextLink>
        </Heading>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};
export default Navbar;
