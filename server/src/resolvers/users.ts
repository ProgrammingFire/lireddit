import argon2 from "argon2";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { getConnection } from "typeorm";
import { v4 } from "uuid";
import { cookie_name, forget_password_prefix } from "../constants";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { MyContext, UserResponse } from "../types";
import { sendEmail } from "../utils/sendEmail";
import { UsernamePasswordInput } from "../utils/UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    if (req.session.userId == user.id) {
      return user.email;
    }

    return "";
  }

  @FieldResolver(() => [Post])
  async posts(@Root() user: User) {
    return await Post.find({ where: { creatorId: user.id } });
  }

  @Query(() => User)
  async user(@Arg("id") id: number) {
    return await User.findOne(id);
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ): Promise<boolean> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }

    const token = v4();

    await redis.set(
      forget_password_prefix + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3 // 3 Days
    );

    sendEmail(
      email,
      `<a href="http://localhost:3000/change-password?token=${token}">Reset password</a>`
    );

    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 5) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must me greater than 5",
          },
        ],
      };
    }

    const userId = await redis.get(forget_password_prefix + token);

    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token is expired or invalid",
          },
        ],
      };
    }

    const userIdNum = parseInt(userId);

    const user = await User.findOne(userIdNum);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    await User.update(
      { id: userIdNum },
      { password: await argon2.hash(newPassword) }
    );

    return { user };
  }
  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg("bio") bio: string,
    @Arg("username") username: string,
    @Ctx() { req }: MyContext
  ): Promise<User | null> {
    const user = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ bio, username })
      .where("id = :userId", {
        userId: req.session.userId,
      })
      .returning("*")
      .execute();
    return user.raw[0];
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | undefined | null> {
    if (!req.session.userId) {
      return null;
    }

    const user = await User.findOne(req.session.userId);
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const hashedPassword = await argon2.hash(options.password);
    let user;

    const errors = validateRegister(options);

    if (errors) {
      return { errors };
    }

    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          email: options.email,
          password: hashedPassword,
        })
        .returning("*")
        .execute();

      user = result.raw[0];
      console.log(user);
    } catch (err) {
      //|| err.detail.includes("already exists")) {
      // duplicate username error
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "that username or email doesn't exists",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(cookie_name);
        if (err) {
          console.error(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}
