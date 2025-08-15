import { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Skeleton } from '../components/ui/skeleton';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import { isUnauthorizedError } from '../lib/authUtils';
import { apiRequest } from '../lib/queryClient';
import { Star, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function BlogPost() {
  const params = useParams();
  const postId = params.id;
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ['/api/blog/posts', postId],
  });

  const { data: comments, isLoading: isCommentsLoading } = useQuery({
    queryKey: ['/api/blog/posts', postId, 'comments'],
  });

  const ratingMutation = useMutation({
    mutationFn: async (ratingValue: number) => {
      await apiRequest('POST', `/api/blog/posts/${postId}/rate`, { rating: ratingValue });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Rating submitted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts', postId] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You need to log in to rate posts. Redirecting to login...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest('POST', `/api/blog/posts/${postId}/comment`, { content });
    },
    onSuccess: () => {
      setComment('');
      toast({
        title: "Success",
        description: "Comment added successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts', postId, 'comments'] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You need to log in to comment. Redirecting to login...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRating = (ratingValue: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to rate this post.",
        variant: "destructive",
      });
      return;
    }
    setRating(ratingValue);
    ratingMutation.mutate(ratingValue);
  };

  const handleComment = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to comment on this post.",
        variant: "destructive",
      });
      return;
    }
    if (comment.trim()) {
      commentMutation.mutate(comment);
    }
  };

  if (isPostLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-32 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!post || typeof post !== 'object' || !('title' in post)) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Post not found
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Post Content */}
      <article className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {(post as any).title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Published {formatDistanceToNow(new Date((post as any).createdAt), { addSuffix: true })}
        </p>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {(post as any).content}
          </p>
        </div>
      </article>

      {/* Rating Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Rate this post</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isAuthenticated ? "Click on a star to rate" : "Login required to rate"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                disabled={ratingMutation.isPending}
                className={`p-1 transition-colors ${
                  !isAuthenticated ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }`}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                You rated: {rating}/5
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Comments</CardTitle>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            <div className="mb-6">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment here..."
                className="mb-4"
                rows={3}
              />
              <Button
                onClick={handleComment}
                disabled={commentMutation.isPending || !comment.trim()}
                className="bg-gradient-to-r from-blue-500 to-pink-500 text-white"
              >
                {commentMutation.isPending ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Please log in to leave a comment
              </p>
              <Button
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-blue-500 to-pink-500 text-white"
              >
                Login to Comment
              </Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {isCommentsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-l-4 border-blue-500 pl-4">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))
            ) : Array.isArray(comments) && comments.length > 0 ? (
              comments.map((comment: any) => (
                <div key={comment.id} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      {comment.user?.firstName || 'Anonymous User'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-gray-600 dark:text-gray-400">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
