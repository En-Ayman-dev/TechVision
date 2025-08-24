import { BlogSystem } from "@/components/blog/blog-system"
import { FadeIn } from "@/components/ui/animations"
import { getBlogPostsAction } from "@/app/actions";
import CtaSection from "@/components/landing/CtaSection";


export default async function BlogPage() {
  const posts = await getBlogPostsAction();
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <FadeIn>
          <BlogSystem posts={posts} />
        </FadeIn>
      </div>
        <CtaSection />
    </div>
  )
}

