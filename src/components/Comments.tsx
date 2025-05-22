import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CommentType } from '../services/templateService';
import { User } from 'lucide-react';
import { format } from 'date-fns';

interface CommentsProps {
  templateId: string;
  onAddComment: (content: string) => Promise<void>;
  comments: CommentType[];
}

const Comments = ({ templateId, onAddComment, comments }: CommentsProps) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    
    try {
      setIsSubmitting(true);
      await onAddComment(newComment);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || !newComment.trim()}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>

      <div className="space-y-4 mt-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{comment.userName}</div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                </div>
              </div>
            </div>
            <p className="text-sm pl-11">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
