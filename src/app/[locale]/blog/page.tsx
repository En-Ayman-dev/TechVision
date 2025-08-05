import { BlogSystem } from "@/components/blog/blog-system"
import { FadeIn } from "@/components/ui/animations"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <FadeIn>
          <BlogSystem />
        </FadeIn>
      </div>
    </div>
  )
}

