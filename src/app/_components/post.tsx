"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import {
  Form,
  Input,
  Button,
  SpaceBetween,
  Container,
  Box,
} from "@cloudscape-design/components";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
    },
  });

  return (
    <Container>
      <SpaceBetween size="m">
        <Box variant="p">
          {latestPost ? (
            <>Your most recent post: {latestPost.name}</>
          ) : (
            <>You have no posts yet.</>
          )}
        </Box>

        <Form
          actions={
            <Button
              variant="primary"
              formAction="submit"
              disabled={createPost.isPending}
              onClick={() => createPost.mutate({ name })}
            >
              {createPost.isPending ? "Submitting..." : "Submit"}
            </Button>
          }
        >
          <Input
            value={name}
            onChange={({ detail }: { detail: { value: string } }) => setName(detail.value)}
            placeholder="Title"
          />
        </Form>
      </SpaceBetween>
    </Container>
  );
}
