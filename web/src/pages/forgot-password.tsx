import { Box, Button, Heading, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import router from "next/router";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";
import login from "./login";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [complete, setComplete] = useState(false);

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ values, handleChange, isSubmitting }) =>
          complete ? (
            <Heading as="h1" size="md">
              if an account with this email exists, we sent you an email
            </Heading>
          ) : (
            <Form>
              <InputField
                name="email"
                label="Email"
                type="email"
                placeholder="email"
              />
              <Button
                mt={3}
                colorScheme="facebook"
                type="submit"
                isLoading={isSubmitting}
              >
                Get Token
              </Button>
            </Form>
          )
        }
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
