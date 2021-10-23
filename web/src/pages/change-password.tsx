import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useChangePasswordMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import login from "./login";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";

const ChangePassword: React.FC<{}> = () => {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const [tokenError, setTokenError] = useState("");
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token: router.query.token ? router.query.token.toString() : "",
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/login");
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              label="New Password"
              type="password"
              placeholder="new password"
            />
            {tokenError ? (
              <Flex>
                <Box mr={2} color="red.500">
                  {tokenError}
                </Box>
                <NextLink href="/forgot-password">
                  <Link>get another token</Link>
                </NextLink>
              </Flex>
            ) : null}
            <Button
              mt={3}
              colorScheme="facebook"
              type="submit"
              isLoading={isSubmitting}
            >
              Change
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
