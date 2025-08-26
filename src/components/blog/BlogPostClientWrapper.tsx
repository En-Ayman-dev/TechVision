"use client";

import { BlogPost } from "@/lib/types";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, Share2, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface BlogPostClientWrapperProps {
    post: BlogPost;
    locale: string;
    readingTime: number;
    children: React.ReactNode; // To pass the main content and related posts
}

export function BlogPostClientWrapper({ post, locale, readingTime, children }: BlogPostClientWrapperProps) {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = post.title;

    return (
        <>
            {/* 1. Reading Progress Bar */}
            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary origin-[0%] z-50" style={{ scaleX }} />

            <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <header className="mb-8 text-center">
                    <div className="mb-4">
                        <Badge variant="default">{post.category}</Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 font-headline">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2"><User className="h-4 w-4" /><span>{post.author}</span></div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={post.publishedAt}>
                                {new Date(post.publishedAt).toLocaleDateString(locale, {
                                    year: 'numeric', month: 'long', day: 'numeric',
                                })}
                            </time>
                        </div>
                        <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{readingTime} min read</span></div>
                    </div>
                </header>

                {/* 2. Parallax Hero Image */}
                {post.featuredImage && (
                    <motion.div
                        className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8 shadow-lg"
                        style={{ y: useTransform(scrollYProgress, [0, 0.5], ["0%", "-20%"]) }}
                    >
                        <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* 3. Floating Sidebar */}
                    <aside className="lg:w-1/4 lg:sticky top-24 self-start hidden lg:block">
                        <h3 className="font-semibold mb-2">Share this post</h3>
                        <div className="flex flex-col gap-2">
                            <Button variant="outline" asChild>
                                <Link href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} target="_blank">
                                    <Twitter className="mr-2 h-4 w-4" /> Twitter
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`} target="_blank">
                                    <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                                </Link>
                            </Button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="lg:w-3/4">
                        {children}
                    </main>
                </div>
            </article>
        </>
    );
}
