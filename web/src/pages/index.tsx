import { Button } from "@chakra-ui/button";
import { Flex, Heading, Spinner, Stack } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { Feature } from "../components/Feature";
import { Layout } from "../components/Layout";
import { LoadingBar } from "../components/LoadingBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index: React.FC = ({}) => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, stale, error, fetching }] = usePostsQuery({ variables });
  if (!data && !fetching) {
    return (
      <Flex
        justifyContent="center"
        direction="column"
        alignItems="center"
        height="100vh"
      >
        <Heading as="h1" mb={3} size="xl">
          Query Failed
        </Heading>
        <Heading as="h1" color="red.500" size="xl">
          {error?.message}
        </Heading>
      </Flex>
    );
  }

  return (
    <Layout variant="regular">
      <Stack spacing={8}>
        {!data && fetching ? (
          <LoadingBar />
        ) : (
          data?.posts.posts.map((post) =>
            !post ? null : <Feature post={post} key={post.id} />
          )
        )}
      </Stack>

      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            m="auto"
            p={2}
            variant="link"
            color="white"
            fontSize="lg"
            isLoading={stale}
            onClick={() =>
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              })
            }
            my={5}
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
