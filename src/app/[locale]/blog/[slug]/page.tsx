// import { getBlogPostBySlugAction } from "@/app/actions";
// import { notFound } from "next/navigation";
// import Image from "next/image";
// import { Badge } from "@/components/ui/badge";
// import { Calendar, User, Clock } from "lucide-react";
// import { Metadata } from "next";

// // This interface defines the props that Next.js will pass to our page
// interface BlogPostPageProps {
//     params: {
//         slug: string;
//         locale: string;
//     };
// }

// // --- SEO Metadata Generation (FIXED) ---
// export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
//     const { slug } = await params;
//     const post = await getBlogPostBySlugAction(slug);

//     if (!post) {
//         return { title: "Post Not Found" };
//     }

//     return {
//         title: post.title,
//         description: post.excerpt,
//         openGraph: {
//             title: post.title,
//             description: post.excerpt,
//             images: [{
//                 url: post.featuredImage || "/image/placeholder.svg",
//                 width: 1200,
//                 height: 630,
//                 alt: post.title,
//             }],
//         },
//     };
// }

// const calculateReadingTime = (content: string) => {
//     const wordsPerMinute = 200;
//     const textLength = content.split(/\s+/).length;
//     return Math.ceil(textLength / wordsPerMinute);
// };

// // --- The Main Page Component (FIXED) ---
// export default async function BlogPostPage({ params }: BlogPostPageProps) {
//     const { slug, locale } = await params; 
//     const post = await getBlogPostBySlugAction(slug);

//     if (!post) {
//         notFound();
//     }

//     const readingTime = calculateReadingTime(post.content);

//     return (
//         <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//             <header className="mb-8">
//                 <div className="mb-4">
//                     <Badge variant="default">{post.category}</Badge>
//                 </div>
//                 <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 font-headline">
//                     {post.title}
//                 </h1>
//                 <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
//                     <div className="flex items-center gap-2"><User className="h-4 w-4" /><span>{post.author}</span></div>
//                     <div className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                         <time dateTime={post.publishedAt}>
//                             {new Date(post.publishedAt).toLocaleDateString(locale, {
//                                 year: 'numeric', month: 'long', day: 'numeric',
//                             })}
//                         </time>
//                     </div>
//                     <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{readingTime} min read</span></div>
//                 </div>
//             </header>

//             {post.featuredImage && (
//                 <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8 shadow-lg">
//                     <Image
//                         src={post.featuredImage}
//                         alt={post.title}
//                         fill
//                         className="object-cover"
//                         priority
//                     />
//                 </div>
//             )}

//             <div
//                 className="prose prose-lg dark:prose-invert max-w-none"
//                 dangerouslySetInnerHTML={{ __html: post.content }}
//             />
//         </article>
//     );
// }


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
