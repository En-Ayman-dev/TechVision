import { getBlogPostBySlugAction } from "@/app/actions";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BlogPostClientWrapper } from "@/components/blog/BlogPostClientWrapper";
import { RelatedPosts } from "@/components/blog/RelatedPosts";

interface BlogPostPageProps {
    params: {
        slug: string;
        locale: string;
    };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPostBySlugAction(slug);
    if (!post) return { title: "Post Not Found" };
    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [{ url: post.featuredImage || "/image/placeholder.svg" }],
        },
    };
}

const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textLength = content.split(/\s+/).length;
    return Math.ceil(textLength / wordsPerMinute);
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug, locale } = await params;
    const post = await getBlogPostBySlugAction(slug);


    if (!post) {
        notFound();
    }

    const readingTime = calculateReadingTime(post.content);

    return (
        <BlogPostClientWrapper post={post} locale={locale} readingTime={readingTime}>
            {/* The main content and related posts are passed as children */}

            {/* Main Content */}
            <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Related Posts Section */}
            <RelatedPosts
                category={post.category}
                currentPostId={post.id}
                locale={locale}
            />

        </BlogPostClientWrapper>
    );
}
