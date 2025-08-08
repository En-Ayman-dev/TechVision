
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Briefcase, MessageSquare, Users } from "lucide-react";
import { getMessagesAction, getProjectsAction, getTeamAction } from "@/app/actions";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { getTranslations } from "next-intl/server";

async function Stats() {
  const messages = await getMessagesAction();
  const projects = await getProjectsAction();
  const team = await getTeamAction();
  const t = await getTranslations("Admin.dashboardPage");
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("messagesTitle")}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-muted-foreground">
              {t("messagesDesc")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("projectsTitle")}</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {t("projectsDesc")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("teamTitle")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.length}</div>
            <p className="text-xs text-muted-foreground">
              {t("teamDesc")}
            </p>
          </CardContent>
        </Card>
      </div>
  )
}

function StatsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-7 w-10 mb-1" />
                        <Skeleton className="h-4 w-24" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default async function Dashboard() {
  const t = await getTranslations("Admin.dashboardPage");
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>
    </div>
  );
}
