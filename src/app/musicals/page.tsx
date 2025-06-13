import { MusicalsPageContent } from "~/app/_components/musicals/musicals-page-content";
import { auth } from "~/server/auth";

export const metadata = {
  title: "Musicals | Musical Database",
  description: "Browse and discover musicals",
};

export default async function MusicalsPage() {
  const session = await auth();
  return <MusicalsPageContent session={session} />;
}
