import React from "react";

import { Formik, Form } from "formik";
import { Layout } from "../components/Layout";
import { InputField } from "../components/InputField";
import { Button } from "@chakra-ui/react";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Register: React.FC = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            router.push("/");
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="Username"
              placeholder="username"
            />
            <InputField name="email" label="Email" placeholder="email" />
            <InputField
              name="password"
              label="Password"
              type="password"
              placeholder="password"
            />
            <Button
              mt={6}
              colorScheme="facebook"
              type="submit"
              isLoading={isSubmitting}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Register);
