"use client";
import { ReactNode } from "react";

import {
  LiveblocksProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

import { getClerkUsers, getDocumentUsers } from "@/lib/actions/user.actions";

import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";

const Provider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser } = useUser();
  return (
    <LiveblocksProvider
      authEndpoint={"/api/liveblocks-auth"}
      resolveUsers={async ({ userIds }) => {
        const users = await getClerkUsers({ userIds });
        return users;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const roomUsers = await getDocumentUsers({
          roomId,
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          currentUser: clerkUser?.emailAddresses[0].emailAddress!,
          text,
        });
        return roomUsers;
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;
