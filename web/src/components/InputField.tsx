import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";
import {
  Box,
  Textarea,
  Input,
  ComponentWithAs,
  InputProps,
  TextareaProps,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  placeholder: string;
  label?: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
  size: _,
  label,
  textarea,
  ...props
}) => {
  let InputOrTextArea: any = Input;

  if (textarea) {
    InputOrTextArea = Textarea;
  }

  const [field, { error }] = useField(props);
  return (
    <Box mt={5}>
      <FormControl isInvalid={!!error} style={{ marginTop: 6 }}>
        {label ? <FormLabel htmlFor={field.name}>{label}</FormLabel> : null}

        <InputOrTextArea
          {...field}
          {...props}
          id={field.name}
          placeholder={props.placeholder}
        />
        {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
      </FormControl>
    </Box>
  );
};
