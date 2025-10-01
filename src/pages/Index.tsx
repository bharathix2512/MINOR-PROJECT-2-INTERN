import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostCard, Post } from "@/components/PostCard";
import { PostForm } from "@/components/PostForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, FileText } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const savedPosts = localStorage.getItem("posts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const handleSavePost = (postData: Omit<Post, "id" | "createdAt">) => {
    if (editingPost) {
      setPosts(posts.map(p => 
        p.id === editingPost.id 
          ? { ...p, ...postData }
          : p
      ));
      toast.success("Post updated successfully!");
    } else {
      const newPost: Post = {
        ...postData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setPosts([newPost, ...posts]);
      toast.success("Post created successfully!");
    }
    setEditingPost(null);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleDeletePost = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setPosts(posts.filter(p => p.id !== deleteId));
      toast.success("Post deleted successfully!");
      setDeleteId(null);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Post Management System</h1>
          </div>
          <p className="text-primary-foreground/90 text-lg">
            Create, edit, and manage your posts effortlessly
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts by title, content, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <Button
            onClick={() => {
              setEditingPost(null);
              setIsFormOpen(true);
            }}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary-glow gap-2 shadow-[var(--shadow-card)]"
          >
            <Plus className="h-5 w-5" />
            Create Post
          </Button>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
              <FileText className="h-8 w-8 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? "No posts found" : "No posts yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? "Try adjusting your search query"
                : "Get started by creating your first post"
              }
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}
      </div>

      <PostForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPost(null);
        }}
        onSave={handleSavePost}
        editingPost={editingPost}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
