import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getSearchResultsAction } from "@/app/search/actions"; // تم استيراد الدالة الجديدة
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface SearchPageProps {
    params: {
        locale: string;
    };
    searchParams: {
        q?: string;
        filters?: string;
    };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
    // استخراج القيم مباشرة من searchParams
    const paramsData = await searchParams;
    const query = paramsData.q ?? "";
    const filtersString = paramsData.filters ?? "";

    const filters = filtersString.split(',').filter(f => f);

    // تمرير القيم المستخرجة إلى دالة الإجراء
    const { results } = await getSearchResultsAction(query, filters);
    const t = await getTranslations("Search");

    if (!query && filters.length === 0) {
        return (
            <div className="container mx-auto py-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl font-bold mb-4">
                    {t("title")}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                    {t("noQueryMessage")}
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-24 min-h-[60vh]">
            <h1 className="text-4xl font-bold mb-2">
                {t("resultsFor", { query })}
            </h1>
            <p className="text-lg text-muted-foreground">
                {t("foundResults", { count: results.length })}
            </p>
            <Separator className="my-8" />
            <div className="space-y-8">
                {results.length > 0 ? (
                    results.map((result, index) => (
                        <Card key={index} className="flex flex-col md:flex-row items-start md:items-center p-4">
                            {result.type === "Project" && "image" in result.data && (
                                <div className="relative w-full md:w-48 h-48 md:h-32 flex-shrink-0 mb-4 md:mb-0 md:mr-6 rounded-md overflow-hidden">
                                    <Image
                                        src={result.data.image}
                                        alt={result.data.dataAiHint!}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </div>
                            )}
                            {result.type === "BlogPost" && "image" in result.data && (
                                <div className="relative w-full md:w-48 h-48 md:h-32 flex-shrink-0 mb-4 md:mb-0 md:mr-6 rounded-md overflow-hidden">
                                    <Image
                                        src={result.data.image}
                                        alt={result.data.dataAiHint!}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Badge variant="secondary">{result.type}</Badge>
                                </div>
                                <h2 className="text-2xl font-bold leading-tight">
                                    <Link href={`/${params.locale}/#${result.type.toLowerCase()}`} className="hover:underline">
                                        {result.type === "project" && "title" in result.data && result.data.title}
                                        {result.type === "team" && "name" in result.data && result.data.name}
                                        {result.type === "services" && "title" in result.data && result.data.title}
                                        {result.type === "BlogSystem" && "title" in result.data && result.data.title}
                                    </Link>
                                </h2>
                                <p className="text-muted-foreground mt-1 line-clamp-2">
                                    {result.type === "project" && "description" in result.data && result.data.description}
                                    {result.type === "team" && "role" in result.data && result.data.role}
                                    {result.type === "service" && "description" in result.data && result.data.description}
                                    {result.type === "BlogSystem" && "excerpt" in result.data && result.data.excerpt}
                                </p>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <h2 className="text-2xl font-bold mb-2">{t("noResults")}</h2>
                        <p className="text-muted-foreground">{t("noResultsMessage")}</p>
                    </div>
                )}
            </div>
        </div>
    );
}