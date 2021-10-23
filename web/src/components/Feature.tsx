import { Box, Flex, Heading, IconButton, Link, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import NextLink from "next/link";
import {
  RegularPostFragment,
  useDeletePostMutation,
  useMeQuery,
  useVoteMutation,
} from "../generated/graphql";
import router from "next/router";
import { EditDeletePost } from "./EditDeletePost";

interface Props {
  post: RegularPostFragment;
  author?: boolean;
}

export const Feature: React.FC<Props> = ({ post, author = true, ...rest }) => {
  const [, vote] = useVoteMutation();
  const [, deletePost] = useDeletePostMutation();
  const [{ data }] = useMeQuery();
  const [loading, setLoading] = useState<
    "not-loading" | "updoot-loading" | "downdoot-loading"
  >("not-loading");

  return (
    <Flex p={5} shadow="md" borderWidth="1px" {...rest}>
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        mr={4}
      >
        <IconButton
          colorScheme={post.voteStatus === 1 ? "green" : "facebook"}
          icon={<ChevronUpIcon />}
          aria-label="Up Vote Post"
          isLoading={loading === "updoot-loading"}
          mb={2}
          onClick={async () => {
            setLoading("updoot-loading");
            await vote({ value: 1, postId: post.id });
            setLoading("not-loading");
          }}
        />
        {post.points}
        <IconButton
          colorScheme={post.voteStatus === -1 ? "red" : "facebook"}
          icon={<ChevronDownIcon />}
          aria-label="Down Vote Post"
          mt={2}
          isLoading={loading === "downdoot-loading"}
          onClick={async () => {
            setLoading("downdoot-loading");
            await vote({ value: -1, postId: post.id });
            setLoading("not-loading");
          }}
        />
      </Flex>
      <Box flex={1}>
        <NextLink href="/post/[id]" as={"/post/" + post.id}>
          <Heading as={Link} fontSize="xl">
            {post.title}
          </Heading>
        </NextLink>
        <Text mt={4}>{post.description}</Text>
        <Flex>
          {author ? (
            <Text mt={4}>
              By{" "}
              <NextLink href="/user/[id]" as={"/user/" + post.creator.id}>
                <Link>{post.creator.username}</Link>
              </NextLink>
            </Text>
          ) : null}
          <Flex mt={3} ml="auto">
            <EditDeletePost postId={post.id} creatorId={post.creatorId} />
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};
