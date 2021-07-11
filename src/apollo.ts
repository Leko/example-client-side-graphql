import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";
import { mergeSchemas } from "@graphql-tools/merge";
import {
  introspectSchema,
  makeRemoteExecutableSchema,
} from "@graphql-tools/wrap";
import { print } from "graphql";
import { AsyncExecutor } from "@graphql-tools/utils";
import { localSchema } from "./localSchema";

async function getSpaceXSchema() {
  const executor: AsyncExecutor = async ({ document, variables }) => {
    const query = print(document);
    return fetch("https://api.spacex.land/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    }).then((res) => res.json());
  };

  const spaceXIntrospectSchema = await introspectSchema(
    // @ts-expect-error
    () => import("./spacex.introspection.json")
  );
  return makeRemoteExecutableSchema({
    schema: spaceXIntrospectSchema,
    executor,
  });
}

export const getClient = async () => {
  const schema = mergeSchemas({
    schemas: [localSchema, await getSpaceXSchema()],
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([new SchemaLink({ schema })]),
  });
};
