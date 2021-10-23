import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import router from "next/router";
import React from "react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface Props {
  postId: number;
  creatorId: number;
}

export const EditDeletePost: React.FC<Props> = ({ postId, creatorId }) => {
  const [{ data }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();

  if ((data.me && creatorId !== data.me.id) || (data && !data.me)) {
    return null;
  }

  return (
    <Box>
      <IconButton
        mr={4}
        icon={<DeleteIcon />}
        colorScheme="red"
        aria-label="Delete Post"
        onClick={() => {
          deletePost({ id: postId });
          if (router.pathname === "/post/[id]") {
            router.push("/");
          }
        }}
      />
      <IconButton
        mr={4}
        icon={<EditIcon />}
        colorScheme="blue"
        aria-label="Delete Post"
        onClick={() => {
          router.push("/edit/" + postId);
        }}
      />
    </Box>
  );
};
