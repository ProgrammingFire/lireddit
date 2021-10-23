import { Button } from "@chakra-ui/button";
import { Stack, Flex, Box, Divider, Heading, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Feature } from "../../components/Feature";
import { Layout } from "../../components/Layout";
import { LoadingBar } from "../../components/LoadingBar";
import { useUserQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

const User: React.FC<{}> = ({}) => {
  const router = useRouter();
  const userId = router.query.id;

  const [{ data, fetching }] = useUserQuery({
    variables: { id: parseInt(userId as string) },
  });

  if (fetching) {
    return (
      <Layout>
        <LoadingBar />
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <Box>could not find the user</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Flex>
        <Heading as="h2" size="lg">
          {data.user.username} -{" "}
          {data.user.bio ? data.user.bio : <>doesn't have bio</>}
        </Heading>
      </Flex>
      <Divider color="white" my={6} />
      {data.user.posts.map((post) =>
        !post ? null : <Feature post={post} author={false} key={post.id} />
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(User);
