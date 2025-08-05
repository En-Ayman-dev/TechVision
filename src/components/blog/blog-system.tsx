"use client"

import * as React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { SearchComponent } from "@/components/ui/search"
import { LoadingSpinner, SkeletonList } from "@/components/ui/loading-spinner"
import { useNotifications } from "@/components/ui/notification"
import { Calendar, User, Tag, Eye, Heart, Share2, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  publishedAt: Date
  updatedAt: Date
  tags: string[]
  category: string
  views: number
  likes: number
  featured: boolean
  published: boolean
}

interface BlogSystemProps {
  isAdmin?: boolean
}

// Mock data for demonstration
const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Web Development: Trends to Watch in 2024",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    excerpt: "Explore the latest trends shaping the future of web development, from AI integration to new frameworks.",
    author: "John Doe",
    publishedAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    tags: ["Web Development", "AI", "Trends"],
    category: "Technology",
    views: 1250,
    likes: 45,
    featured: true,
    published: true,
  },
  {
    id: "2",
    title: "Building Scalable Applications with Next.js and Firebase",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    excerpt: "Learn how to build scalable, modern applications using Next.js and Firebase for the backend.",
    author: "Jane Smith",
    publishedAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
    tags: ["Next.js", "Firebase", "Scalability"],
    category: "Development",
    views: 890,
    likes: 32,
    featured: false,
    published: true,
  },
  {
    id: "3",
    title: "UI/UX Design Principles for Modern Web Applications",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    excerpt: "Discover essential UI/UX design principles that make web applications user-friendly and engaging.",
    author: "Mike Johnson",
    publishedAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    tags: ["UI/UX", "Design", "User Experience"],
    category: "Design",
    views: 675,
    likes: 28,
    featured: false,
    published: true,
  },
]

export function BlogSystem({ isAdmin = false }: BlogSystemProps) {
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts)
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(mockPosts)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const { addNotification } = useNotifications()

  const categories = ["all", ...Array.from(new Set(posts.map(post => post.category)))]
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)))

  const searchFilters = allTags.map(tag => ({
    id: tag,
    label: tag,
    value: tag,
    category: "Tags"
  }))

  const handleSearch = (query: string, filters: any[]) => {
    let filtered = posts

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Filter by search query
    if (query) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.author.toLowerCase().includes(query.toLowerCase())
      )
    }

    // Filter by tags
    if (filters.length > 0) {
      filtered = filtered.filter(post =>
        filters.some(filter => post.tags.includes(filter.value))
      )
    }

    setFilteredPosts(filtered)
  }

  const handleLike = async (postId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ))
    setFilteredPosts(prev => prev.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ))
    
    addNotification({
      type: "success",
      title: "Post liked!",
      description: "Thank you for your feedback.",
    })
  }

  const handleShare = async (post: BlogPost) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href + `/blog/${post.id}`,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href + `/blog/${post.id}`)
        addNotification({
          type: "success",
          title: "Link copied!",
          description: "Blog post link copied to clipboard.",
        })
      }
    } else {
      navigator.clipboard.writeText(window.location.href + `/blog/${post.id}`)
      addNotification({
        type: "success",
        title: "Link copied!",
        description: "Blog post link copied to clipboard.",
      })
    }
  }

  const handleDelete = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts(prev => prev.filter(post => post.id !== postId))
      setFilteredPosts(prev => prev.filter(post => post.id !== postId))
      
      addNotification({
        type: "success",
        title: "Post deleted",
        description: "The blog post has been successfully deleted.",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-muted-foreground">
            Insights, tutorials, and updates from our team
          </p>
        </div>
        {isAdmin && (
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            New Post
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchComponent
          placeholder="Search blog posts..."
          onSearch={handleSearch}
          availableFilters={searchFilters}
        />
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(category)
                handleSearch("", [])
              }}
            >
              {category === "all" ? "All Categories" : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog Posts */}
      {isLoading ? (
        <SkeletonList count={3} />
      ) : (
        <div className="grid gap-6">
          {filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No blog posts found.</p>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map(post => (
              <BlogPostCard
                key={post.id}
                post={post}
                isAdmin={isAdmin}
                onLike={handleLike}
                onShare={handleShare}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

interface BlogPostCardProps {
  post: BlogPost
  isAdmin: boolean
  onLike: (postId: string) => void
  onShare: (post: BlogPost) => void
  onDelete: (postId: string) => void
}

function BlogPostCard({ post, isAdmin, onLike, onShare, onDelete }: BlogPostCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {post.featured && (
                <Badge variant="secondary">Featured</Badge>
              )}
              <Badge variant="outline">{post.category}</Badge>
            </div>
            <CardTitle className="text-xl hover:text-primary cursor-pointer">
              {post.title}
            </CardTitle>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(post.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{post.excerpt}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(post.publishedAt, "MMM dd, yyyy")}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.views}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(post.id)}
              className="text-muted-foreground hover:text-red-500"
            >
              <Heart className="w-4 h-4 mr-1" />
              {post.likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(post)}
              className="text-muted-foreground"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

