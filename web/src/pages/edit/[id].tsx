import {
  Heading,
  Spinner,
  Text,
  Divider,
  Box,
  Button,
  Link,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../components/InputField";
import { Layout } from "../../components/Layout";
import { usePostQuery, useUpdatePostMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

import NextLink from "next/link";
import { LoadingBar } from "../../components/LoadingBar";

const EditPost: React.FC<{}> = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [, updatePost] = useUpdatePostMutation();
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
      <Heading as="h3" size="lg">
        Editing Post{" "}
        <NextLink href="/post/[id]" as={"/post/" + data.post.id}>
          <Link>"{data.post.title}"</Link>
        </NextLink>
      </Heading>
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          updatePost({
            id: intId,
            title: values.title,
            text: values.text,
          });

          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" label="Title" placeholder="title" />
            <InputField
              textarea
              height={300}
              name="text"
              label="Text"
              placeholder="text..."
            />
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
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(EditPost);
