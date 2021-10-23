import { Request, Response } from "express";
import { Redis } from "ioredis";
import { InputType, Field, ObjectType } from "type-graphql";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { createUpdootLoader } from "./utils/createUpdootLoader";
import { createUserLoader } from "./utils/createUserLoader";

export type MyContext = {
  req: Request;
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  updootLoader: ReturnType<typeof createUpdootLoader>;
};

@InputType()
export class PostInput {
  @Field()
  title: string;

  @Field()
  text: string;
}

@ObjectType()
export class PaginatedPost {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: boolean;
}

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
