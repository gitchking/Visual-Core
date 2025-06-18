import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, ThumbsUp, MessageCircle, Share, Plus, ExternalLink, Globe, Heart, Bookmark, MoreHorizontal } from 'lucide-react';
import { threadService } from '@/services/threadService';
import { useAuth } from '@/contexts/AuthContext';
import CreateThreadDialog from '@/components/CreateThreadDialog';
import AuthDialog from '@/components/auth/AuthDialog';

const CommunityPage = () => {
  const [threads, setThreads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  
  const { user, profile } = useAuth();

  const loadThreads = async () => {
    try {
      console.log('Loading threads...');
      const threadData = await threadService.getAllThreads();
      console.log('Loaded threads:', threadData);
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
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }
    
    try {
      await threadService.upvoteThread(threadId);
      await loadThreads();
    } catch (error) {
      console.error('Failed to upvote thread:', error);
    }
  };

  const handleCreateThread = async (thread: { title: string; content: string; tags: string; websiteUrl?: string }) => {
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }
    
    try {
      console.log('Creating thread:', thread);
      await threadService.createThread(thread);
      console.log('Thread created successfully');
      setIsCreateDialogOpen(false);
      await loadThreads();
    } catch (error) {
      console.error('Failed to create thread:', error);
    }
  };

  const handleCreateClick = () => {
    if (!user) {
      setIsAuthDialogOpen(true);
    } else {
      setIsCreateDialogOpen(true);
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

  const getInitials = (username: string) => {
    return username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const sortedThreads = threads.sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return (b.upvotes || 0) - (a.upvotes || 0);
    }
  });

  const filteredThreads = sortedThreads.filter(thread =>
    thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (thread.tags && thread.tags.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-black">Loading community posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">Community</h1>
              <p className="text-gray-600">Share and discover amazing workflows with the community</p>
            </div>
            <Button 
              onClick={handleCreateClick}
              className="neo-brutal-purple bg-purple-accent"
            >
              <Plus size={16} className="mr-2" />
              Create Thread
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search threads, tags, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 neo-brutal"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'latest' ? 'default' : 'outline'}
                onClick={() => setSortBy('latest')}
                className="neo-brutal"
              >
                Latest
              </Button>
              <Button
                variant={sortBy === 'popular' ? 'default' : 'outline'}
                onClick={() => setSortBy('popular')}
                className="neo-brutal"
              >
                Popular
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredThreads.length === 0 ? (
            <Card className="neo-card">
              <CardContent className="p-6 md:p-8 text-center">
                <h3 className="text-lg font-semibold mb-2 text-black">No threads found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Be the first to share your workflow with the community!'}
                </p>
                <Button 
                  onClick={handleCreateClick}
                  className="neo-brutal-purple bg-purple-accent"
                >
                  Create Thread
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredThreads.map((thread) => {
              const threadUser = thread.profiles || {};
              const displayName = threadUser.full_name || threadUser.username || `User ${thread.user_id}`;
              
              return (
                <Card key={thread.id} className="neo-card hover-lift transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={threadUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${thread.user_id}`} />
                        <AvatarFallback className="bg-purple-accent text-white text-sm">
                          {getInitials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-black">{displayName}</span>
                          <span className="text-gray-500 text-sm">•</span>
                          <span className="text-gray-500 text-sm">{formatTimeAgo(thread.created_at)}</span>
                        </div>
                        <CardTitle className="text-lg md:text-xl mb-2 text-black">{thread.title}</CardTitle>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 mb-4 leading-relaxed">{thread.content}</p>
                    
                    {thread.website_url && (
                      <div className="mb-4 p-3 border border-purple-accent bg-purple-accent/5 rounded-lg flex items-center gap-3">
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
                    
                    {thread.tags && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {thread.tags.split(',').map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs border border-black bg-gray-100">
                            #{tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-6">
                        <Button
                          onClick={() => upvoteThread(thread.id)}
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 text-gray-600 hover:text-purple-accent"
                        >
                          <ThumbsUp size={16} />
                          <span>{thread.upvotes || 0}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 text-gray-600 hover:text-purple-accent"
                        >
                          <MessageCircle size={16} />
                          <span>0</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 text-gray-600 hover:text-purple-accent"
                        >
                          <Heart size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 text-gray-600 hover:text-purple-accent"
                        >
                          <Bookmark size={16} />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-purple-accent"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/community#thread-${thread.id}`);
                        }}
                      >
                        <Share size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <CreateThreadDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateThread}
      />

      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
        defaultMode="signin"
      />
    </div>
  );
};

export default CommunityPage;
