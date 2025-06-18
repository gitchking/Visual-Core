import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Link as LinkIcon, Globe, Hash, Sparkles } from 'lucide-react';

interface CreateThreadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (thread: { title: string; content: string; tags: string; websiteUrl?: string }) => void;
}

const CreateThreadDialog: React.FC<CreateThreadDialogProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [urlPreview, setUrlPreview] = useState<{ domain: string; favicon: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const extractDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return '';
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return '';
    }
  };

  const handleUrlChange = (url: string) => {
    setWebsiteUrl(url);
    if (url && url.startsWith('http')) {
      const domain = extractDomain(url);
      const favicon = getFaviconUrl(url);
      setUrlPreview({ domain, favicon });
    } else {
      setUrlPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      setIsSubmitting(true);
      try {
        await onSubmit({
          title: title.trim(),
          content: content.trim(),
          tags: tags.trim(),
          websiteUrl: websiteUrl.trim() || undefined
        });
        setTitle('');
        setContent('');
        setTags('');
        setWebsiteUrl('');
        setUrlPreview(null);
      } catch (error) {
        console.error('Failed to create thread:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const suggestedTags = ['workflow', 'automation', 'productivity', 'tools', 'tips', 'tutorial'];

  const addTag = (tag: string) => {
    const currentTags = tags.split(',').map(t => t.trim()).filter(t => t);
    if (!currentTags.includes(tag)) {
      setTags([...currentTags, tag].join(', '));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto neo-card">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=default" />
              <AvatarFallback className="bg-purple-accent text-white text-xs">U</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl text-black">Create New Thread</CardTitle>
              <p className="text-sm text-gray-500">Share your workflow with the community</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="neo-brutal-purple"
          >
            <X size={20} />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Thread Title *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your workflow about?"
                className="neo-brutal text-lg"
                required
                maxLength={100}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {title.length}/100
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Content *
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your workflow, share your experience, or ask for help..."
                className="neo-brutal min-h-[120px] resize-none text-base"
                required
                maxLength={1000}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {content.length}/1000
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Tags
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="workflow, automation, productivity (comma separated)"
                    className="pl-10 neo-brutal"
                  />
                </div>
                
                {suggestedTags.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Suggested tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-purple-accent hover:text-white transition-colors"
                          onClick={() => addTag(tag)}
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Website Link (Optional)
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    value={websiteUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://example.com"
                    className="pl-10 neo-brutal"
                  />
                </div>
                
                {urlPreview && (
                  <div className="p-3 border border-purple-accent bg-purple-accent/10 rounded-lg flex items-center gap-3">
                    <img 
                      src={urlPreview.favicon} 
                      alt="Site icon"
                      className="w-6 h-6"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjOTMzM0VBIi8+Cjwvc3ZnPgo=';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-purple-accent" />
                        <span className="text-sm font-medium text-black">{urlPreview.domain}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 neo-brutal"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!title.trim() || !content.trim() || isSubmitting}
                className="flex-1 neo-brutal-purple bg-purple-accent"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles size={16} className="mr-2 animate-pulse" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="mr-2" />
                    Create Thread
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateThreadDialog;
