
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ThumbsUp, MessageCircle, Share, Plus, ExternalLink, Globe } from 'lucide-react';
import { threadService } from '@/services/threadService';
import { initDatabase } from '@/lib/database';
import CreateThreadDialog from '@/components/CreateThreadDialog';

const CommunityPage = () => {
  const [threads, setThreads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const loadThreads = async () => {
    try {
      await initDatabase();
      const threadData = await threadService.getAllThreads();
      setThreads(threadData);
    } catch (error) {
      console.error('Failed to load threads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  const upvoteThread = async (threadId: number) => {
    try {
      await threadService.upvoteThread(threadId);
      await loadThreads();
    } catch (error) {
      console.error('Failed to upvote thread:', error);
    }
  };

  const handleCreateThread = async (thread: { title: string; content: string; tags: string; websiteUrl?: string }) => {
    try {
      await threadService.createThread(thread);
      await loadThreads();
    } catch (error) {
      console.error('Failed to create thread:', error);
    }
  };

  const extractDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=24`;
    } catch {
      return '';
    }
  };

  const filteredThreads = threads.filter(thread =>
    thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-black">Loading community posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">Community</h1>
              <p className="text-gray-600">Discover and share amazing workflows with the community</p>
            </div>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="neo-brutal-purple bg-purple-accent w-full sm:w-auto"
            >
              <Plus size={16} className="mr-2" />
              Create Thread
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 neo-brutal"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredThreads.length === 0 ? (
            <Card className="neo-card">
              <CardContent className="p-6 md:p-8 text-center">
                <h3 className="text-lg font-semibold mb-2 text-black">No workflows shared yet</h3>
                <p className="text-gray-600 mb-4">Be the first to share your workflow with the community!</p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="neo-brutal-purple bg-purple-accent"
                >
                  Create Thread
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredThreads.map((thread) => (
              <Card key={thread.id} className="neo-card hover-lift">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg md:text-xl mb-2 text-black">{thread.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                        {thread.tags && (
                          <div className="flex flex-wrap gap-1">
                            {thread.tags.split(',').map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs border border-black">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => upvoteThread(thread.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 neo-brutal w-full sm:w-auto"
                    >
                      <ThumbsUp size={14} />
                      {thread.upvotes || 0}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{thread.content}</p>
                  
                  {thread.website_url && (
                    <div className="mb-4 p-3 border border-purple-accent bg-purple-accent/5 flex items-center gap-3">
                      <img 
                        src={getFaviconUrl(thread.website_url)} 
                        alt="Site icon"
                        className="w-6 h-6"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjOTMzM0VBIi8+Cjwvc3ZnPgo=';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Globe size={14} className="text-purple-accent flex-shrink-0" />
                          <span className="text-sm font-medium text-black truncate">{extractDomain(thread.website_url)}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0"
                        onClick={() => window.open(thread.website_url, '_blank')}
                      >
                        <ExternalLink size={14} />
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        0 comments
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="neo-brutal w-full sm:w-auto"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/community#thread-${thread.id}`);
                      }}
                    >
                      <Share size={14} className="mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <CreateThreadDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateThread}
      />
    </div>
  );
};

export default CommunityPage;
