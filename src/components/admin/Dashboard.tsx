
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Briefcase, MessageSquare, Users, PlusCircle, MoreHorizontal, FilePen, Trash2 } from "lucide-react";
import { getMessagesAction, getProjectsAction, getTeamAction } from "@/app/actions";
import { useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { useTranslations } from "next-intl"; // Correct import for client components

// A separate async function to fetch data
async function fetchDashboardData() {
  const messagesResult = await getMessagesAction(5); // Fetching 5 messages for the dashboard preview
  const projects = await getProjectsAction();
  const team = await getTeamAction();

  return {
    messagesCount: messagesResult.messages.length,
    projectsCount: projects.length,
    teamCount: team.length
  };
}

function Stats() {
  const [data, setData] = useState({
    messagesCount: 0,
    projectsCount: 0,
    teamCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("Admin.dashboardPage"); // Correct hook for client components

  useEffect(() => {
    fetchDashboardData().then(result => {
      setData(result);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <StatsSkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("messagesTitle")}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.messagesCount}</div>
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
            <div className="text-2xl font-bold">{data.projectsCount}</div>
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
            <div className="text-2xl font-bold">{data.teamCount}</div>
            <p className="text-xs text-muted-foreground">
              {t("teamDesc")}
            </p>
          </CardContent>
        </Card>
      </div>
  )
}

function StatsSkeleton() {
    // This is a client component, but since it doesn't use hooks, it could be a server component
    // We'll keep it here for simplicity.
    const t = useTranslations("Admin.dashboardPage");
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

export default function Dashboard() {
  const t = useTranslations("Admin.dashboardPage");
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <Stats />
    </div>
  );
}
