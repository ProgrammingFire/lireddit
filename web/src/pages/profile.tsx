import { Button } from "@chakra-ui/button";
import { Box, Heading } from "@chakra-ui/layout";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Feature } from "../components/Feature";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { LoadingBar } from "../components/LoadingBar";
import { useMeQuery, useUpdateUserMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

interface Props {}

const Profile: React.FC<Props> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  const [, updateUser] = useUpdateUserMutation();

  const router = useRouter();

  useIsAuth();

  if (fetching) {
    return (
      <Layout>
        <LoadingBar />
      </Layout>
    );
  }

  if (!data) {
    return null;
  }

  if (!data.me) {
    return null;
  }

  return (
    <Layout>
      <Flex>
        <Heading as="h2" size="lg">
          {data?.me?.username} -{" "}
          {data?.me?.bio ? data.me.bio : <>doesn't have bio</>}
        </Heading>
      </Flex>
      <Divider color="white" my={6} />
      <Tabs isFitted>
        <TabList mb="1em">
          <Tab>Update</Tab>
          <Tab>Posts</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Formik
              initialValues={{
                username: data?.me?.username,
                bio: data?.me?.bio,
              }}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                updateUser({
                  username: values.username,
                  bio: values.bio,
                });
                setSubmitting(false);
                router.push("/");
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <InputField name="username" placeholder="username" />
                  <InputField textarea name="bio" placeholder="bio..." />
                  <Button
                    mt={6}
                    mb={5}
                    colorScheme="facebook"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Update
                  </Button>
                </Form>
              )}
            </Formik>
          </TabPanel>
          <TabPanel>
            {data.me.posts.map((post) =>
              !post ? null : (
                <Feature post={post} author={false} key={post.id} />
              )
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Profile);
