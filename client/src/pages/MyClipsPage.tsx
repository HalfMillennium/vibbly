import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Clock, Share2, ExternalLink, Trash2 } from "lucide-react";
import { formatTime, formatDate } from "@/lib/utils";
import CreatePageLayout from "@/components/layouts/CreatePage";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Clip {
  id: number;
  shareId: string;
  clipTitle: string;
  videoTitle: string;
  videoId: string;
  startTime: number;
  endTime: number;
  includeSubtitles: boolean;
  createdByUserId: string;
  createdAt: string;
}

export default function MyClipsPage() {
  const { toast } = useToast();
  
  const { data: clips, isLoading } = useQuery<Clip[]>({
    queryKey: ["/api/clips"],
  });

  const deleteClipMutation = useMutation({
    mutationFn: async (clipId: number) => {
      return await apiRequest("DELETE", `/api/clips/${clipId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clips"] });
      toast({
        title: "Clip deleted",
        description: "Your clip has been successfully deleted",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete clip. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteClip = (clipId: number, clipTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${clipTitle}"? This action cannot be undone.`)) {
      deleteClipMutation.mutate(clipId);
    }
  };

  if (isLoading) {
    return (
      <CreatePageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="glass-card animate-pulse">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CreatePageLayout>
    );
  }

  return (
    <CreatePageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">My Clips</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your saved YouTube clips
          </p>
        </div>

        {!clips || clips.length === 0 ? (
          <div className="text-center py-16">
            <div className="glass-card p-12 max-w-md mx-auto">
              <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No clips yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start creating clips from your favorite YouTube videos
              </p>
              <Button asChild className="rounded-2xl">
                <a href="/create">Create your first clip</a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex flex-col flex-1">
            {clips.map((clip) => (
              <Card
                key={clip.id}
                className="glass-card group hover:shadow-lg transition-all duration-200 flex flex-col flex-1"
              >
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={`https://img.youtube.com/vi/${clip.videoId}/maxresdefault.jpg`}
                    alt={clip.clipTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Link href={`/view/${clip.shareId}`}>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(clip.endTime - clip.startTime)}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 flex flex-col flex-1 justify-between">
                  <div className="flex flex-col flex-1 justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {clip.clipTitle}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span>{formatDate(clip.createdAt)}</span>
                      <span>{"•"}</span>
                      <span>
                        {formatTime(clip.startTime)} -{" "}
                        {formatTime(clip.endTime)}
                      </span>
                      {clip.includeSubtitles && (
                        <Badge variant="outline" className="text-xs">
                          CC
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={() =>
                        window.open(
                          `https://youtube.com/watch?v=${clip.videoId}&t=${clip.startTime}s`,
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Watch
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-xl"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${window.location.origin}/view/${clip.shareId}`,
                        )
                      }
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      onClick={() => handleDeleteClip(clip.id, clip.clipTitle)}
                      disabled={deleteClipMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CreatePageLayout>
  );
}
