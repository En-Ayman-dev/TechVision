import { getTeamAction } from "@/app/actions";
import TeamSection from "@/components/landing/TeamSection";

export default async function TeamPage() {
  const team = await getTeamAction();

  return (
    <>
      <TeamSection teams={team} />
    </>
  );
}