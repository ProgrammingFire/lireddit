import { UsernamePasswordInput } from "./UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "length must me greater than 2",
      },
    ];
  }

  if (options.username.includes("@") || options.username.includes(".")) {
    return [
      {
        field: "username",
        message: "enter a valid username",
      },
    ];
  }

  if (!options.email.includes("@") || !options.email.includes(".")) {
    return [
      {
        field: "email",
        message: "enter a valid email",
      },
    ];
  }

  if (options.password.length <= 5) {
    return [
      {
        field: "password",
        message: "length must me greater than 5",
      },
    ];
  }

  return null;
};
