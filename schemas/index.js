const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar DateTime
  type Query {
    # Auth
    refreshAccessToken: TokenResponse!
    logoutUser: Boolean!

    # User
    getMe: UserResponse!
  }

  type Mutation {
    # Auth
    loginUser(input: LoginInput!): TokenResponse!
    signupUser(input: SignUpInput!): UserResponse!
    forgetPassword(input: ForgotPasswordInput!): ForgotPasswordResponse!
    resetPassword(input: ResetPasswordInput!): ResetPasswordResponse!
    updatePassword(input: UpdatePasswordInput!): UpdatePasswordResponse!
    updateMe(input: UpdateMeInput!): UserResponse!
  }

  input SignUpInput {
    name: String!
    email: String!
    password: String!
    passwordConfirm: String!
    photo: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ForgotPasswordInput {
    email: String!
  }

  input ResetPasswordInput {
    password: String!
    passwordConfirm: String!
    token: String!
  }

  type ResetPasswordResponse {
    status: String!
  }

  input UpdatePasswordInput {
    oldPassword: String!
    password: String!
    passwordConfirm: String!
  }

  type UpdatePasswordResponse {
    status: String!
    access_token: String!
  }

  input UpdateMeInput {
    name: String!
  }

  type TokenResponse {
    status: String!
    access_token: String!
  }

  type ForgotPasswordResponse {
    status: String!
    resetToken: String!
  }

  type UserResponse {
    status: String!
    user: UserData!
  }

  type UserData {
    id: ID!
    name: String!
    email: String!
    photo: String!
    role: String!
    createdAt: DateTime
    updatedAt: DateTime
  }
`;

module.exports = typeDefs;
