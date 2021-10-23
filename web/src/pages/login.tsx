import React from "react";

import { Formik, Form, FormikErrors } from "formik";
import { Layout } from "../components/Layout";
import { InputField } from "../components/InputField";
import { Button, Link } from "@chakra-ui/react";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";

const Login: React.FC = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (router.query.next) {
              router.push(router.query.next.toString());
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              label="Username or Email"
              placeholder="username or email"
            />
            <InputField
              name="password"
              label="Password"
              type="password"
              placeholder="password"
            />
            <Button
              mt={6}
              mb={5}
              colorScheme="facebook"
              type="submit"
              isLoading={isSubmitting}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
      <NextLink href="/forgot-password">
        <Link>forgot password</Link>
      </NextLink>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Login);
