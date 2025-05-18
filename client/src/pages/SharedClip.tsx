import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import VideoPlayer from '@/components/VideoPlayer';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Share2, Link as LinkIcon } from 'lucide-react';
import { formatTime } from '@/lib/utils';

export default function SharedClip() {
  const [, params] = useRoute('/share/:shareId');
  const { toast } = useToast();
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoTitle, setVideoTitle] = useState('');

  // Get share ID from route params
  const shareId = params?.shareId;

  // Fetch clip data
  const {
    data: clip,
    isLoading,
    error
  } = useQuery({
    queryKey: ['/api/clips/share', shareId],
    queryFn: async () => {
      if (!shareId) return null;
      const response = await apiRequest('GET', `/api/clips/share/${shareId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch clip');
      }
      return response.json();
    },
    enabled: !!shareId
  });

  // Copy share link to clipboard
  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied',
      description: 'The link has been copied to your clipboard.',
    });
  };
  
  // Native mobile share
  const nativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: clip.clipTitle,
          text: `Check out this clip: ${clip.clipTitle}`,
          url: window.location.href,
        });
      } else {
        // Fallback to clipboard if native sharing not available
        copyShareLink();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: 'Sharing failed',
        description: 'Could not share the clip. The link has been copied instead.',
        variant: 'destructive',
      });
      // Fallback to clipboard
      copyShareLink();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading clip...</p>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  if (error || !clip) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 pb-6 flex flex-col items-center space-y-4">
              <h2 className="text-xl font-semibold">Clip Not Found</h2>
              <p className="text-muted-foreground text-center">
                Sorry, the clip you're looking for doesn't exist or has been removed.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Go to Homepage
              </Button>
            </CardContent>
          </Card>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 flex flex-col items-center p-4 max-w-4xl mx-auto w-full gap-6">
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-2">{clip.clipTitle}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-muted-foreground">From: {videoTitle || clip.videoTitle}</span>
            <span className="text-muted-foreground">
              {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
            </span>
          </div>
          
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-lg">
            <VideoPlayer
              videoId={clip.videoId}
              startTime={clip.startTime}
              endTime={clip.endTime}
              loopClip={true}
              onVideoTitleChange={setVideoTitle}
              onVideoDurationChange={setVideoDuration}
            />
          </div>
        </div>
        
        <div className="flex justify-end w-full mt-4 gap-2">
          <Button 
            variant="outline" 
            className="flex items-center space-x-2"
            onClick={copyShareLink}
          >
            <LinkIcon className="h-4 w-4" />
            <span>Copy Link</span>
          </Button>
          
          <Button 
            variant="default" 
            className="flex items-center space-x-2 bg-primary text-white hover:bg-primary/90"
            onClick={nativeShare}
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}