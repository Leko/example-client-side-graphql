import { gql } from "@apollo/client";
import { makeExecutableSchema } from "@graphql-tools/schema";

const typeDefs = gql`
  type Query {
    greeting: Greeting!
  }
  type Mutation {
    setGreeting(message: String!): Greeting!
  }
  type Greeting {
    message: String!
  }
`;

function getGreeting() {
  return (
    (localStorage.getItem("greeting") &&
      JSON.parse(localStorage.getItem("greeting")!)) ?? { message: "Hello" }
  );
}

const resolvers = {
  Query: {
    greeting: () => getGreeting(),
  },
  Mutation: {
    setGreeting(_p: never, args: { message: string }) {
      localStorage.setItem("greeting", JSON.stringify(args));
      return getGreeting();
    },
  },
};

export const localSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
