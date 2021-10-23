import {
  Heading,
  Spinner,
  Text,
  Divider,
  Box,
  Flex,
  Link,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { EditDeletePost } from "../../components/EditDeletePost";
import { Layout } from "../../components/Layout";
import { LoadingBar } from "../../components/LoadingBar";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import NextLink from "next/link";

const Post: React.FC<{}> = ({}) => {
  const router = useRouter();
  console.log(router);
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (fetching) {
    return <LoadingBar />;
  }

  if (!data.post) {
    return (
      <Layout>
        <Box>could not find the post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Flex>
        <Heading as="h2" size="lg">
          {data.post.title} By{" "}
          <NextLink href="/user/[id]" as={"/user/" + data.post.creator.id}>
            <Link>{data.post.creator.username}</Link>
          </NextLink>
        </Heading>
        <Box ml="auto">
          <EditDeletePost
            postId={data.post.id}
            creatorId={data.post.creatorId}
          />
        </Box>
      </Flex>
      <Divider color="white" my={6} />
      <Text as="p" fontSize="lg">
        {data.post.text}
      </Text>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
