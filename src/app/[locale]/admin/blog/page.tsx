"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, FilePen, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState, useTransition } from "react";
// import type { BlogPost } from "@/components/blog/blog-system";
import type { BlogPost } from "@/lib/types";

import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getBlogPostsAction, deleteBlogPostAction } from "@/app/actions"; // استيراد الوظائف الجديدة
export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isPending, startTransition] = useTransition();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const { toast } = useToast();

    const fetchPosts = () => {
        startTransition(async () => {
            const fetchedPosts = await getBlogPostsAction();
            setPosts(fetchedPosts);
        });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleAddClick = () => {
        setSelectedPost(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (post: BlogPost) => {
        setSelectedPost(post);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        startTransition(async () => {
            const result = await deleteBlogPostAction(id);
            if (result.success) {
                fetchPosts();
                toast({
                    title: "تم حذف المقالة",
                    description: "تم حذف مقالة المدونة بنجاح.",
                });
            } else {
                toast({
                    title: "خطأ",
                    description: result.message,
                    variant: "destructive",
                });
            }
        });
    };

    const onFormSubmit = () => {
        fetchPosts();
        setIsFormOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">إدارة المدونة</h1>
                <Button onClick={handleAddClick}>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    إضافة مقالة جديدة
                </Button>
            </div>

            <BlogPostForm
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                post={selectedPost}
                onSubmit={onFormSubmit}
            />

            <Card>
                <CardHeader>
                    <CardTitle>قائمة المقالات</CardTitle>
                    <CardDescription>
                        هنا جميع المقالات في مدونتك.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>العنوان</TableHead>
                                <TableHead>المؤلف</TableHead>
                                <TableHead>الفئة</TableHead>
                                <TableHead className="text-right">الإجراءات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isPending ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : posts.length > 0 ? (
                                posts.map((post) => (
                                    <TableRow key={post.id}>
                                        <TableCell className="font-medium">{post.title}</TableCell>
                                        <TableCell>{post.author}</TableCell>
                                        <TableCell>{post.category}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">فتح القائمة</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEditClick(post)}>
                                                        <FilePen className="mr-2 h-4 w-4" />
                                                        تعديل
                                                    </DropdownMenuItem>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                حذف
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف المقالة بشكل دائم.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(post.id)}>
                                                                    متابعة
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        لم يتم العثور على مقالات.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

