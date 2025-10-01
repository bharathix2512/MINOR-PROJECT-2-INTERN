import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar, User } from "lucide-react";
import { format } from "date-fns";

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

export const PostCard = ({ post, onEdit, onDelete }: PostCardProps) => {
  return (
    <Card className="group hover:shadow-[var(--shadow-card-hover)] transition-[var(--transition-smooth)] border-border/50 bg-gradient-to-b from-card to-card/95">
      <CardHeader className="space-y-2 pb-3">
        <h3 className="text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-muted-foreground line-clamp-3 leading-relaxed">
          {post.content}
        </p>
      </CardContent>
      <CardFooter className="gap-2 pt-3 border-t border-border/50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(post)}
          className="flex-1 gap-2 hover:bg-accent hover:text-accent-foreground"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(post.id)}
          className="flex-1 gap-2 hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
