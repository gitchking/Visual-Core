
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ThumbsUp, MessageCircle, Share } from 'lucide-react';
import { threadService } from '@/services/threadService';
import { initDatabase } from '@/lib/database';

const CommunityPage = () => {
  const [threads, setThreads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
      await loadThreads(); // Refresh to show updated upvotes
    } catch (error) {
      console.error('Failed to upvote thread:', error);
    }
  };

  const filteredThreads = threads.filter(thread =>
    thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-lg">Loading community posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-purple mb-4">Community</h1>
          <p className="text-gray-600 mb-6">Discover and share amazing workflows with the community</p>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredThreads.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No workflows shared yet</h3>
                <p className="text-gray-600 mb-4">Be the first to share your workflow with the community!</p>
                <Button 
                  onClick={() => window.location.href = '/flow-editor'}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Create Workflow
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredThreads.map((thread) => (
              <Card key={thread.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{thread.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                        {thread.tags && (
                          <div className="flex gap-1">
                            {thread.tags.split(',').map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
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
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp size={14} />
                      {thread.upvotes || 0}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{thread.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        0 comments
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
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
    </div>
  );
};

export default CommunityPage;
