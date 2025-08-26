import { getRelatedPostsAction } from "@/app/actions";
import { BlogPost } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface RelatedPostsProps {
    category: string;
    currentPostId: string;
    locale: string;
}

export async function RelatedPosts({ category, currentPostId, locale }: RelatedPostsProps) {
    const relatedPosts = await getRelatedPostsAction(category, currentPostId);

    if (relatedPosts.length === 0) {
        return null; // Don't render the section if there are no related posts
    }

    return (
        <div className="mt-16 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6 font-headline">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                    <Link href={`/${locale}/blog/${post.slug}`} key={post.id} className="block group">
                        <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            <div className="relative h-40 w-full">
                                <Image
                                    src={post.featuredImage || "/image/placeholder.svg"}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                                    {post.title}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
