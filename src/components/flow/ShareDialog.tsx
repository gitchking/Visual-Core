
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Share, Copy, CheckCircle } from 'lucide-react';
import { threadService } from '@/services/threadService';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  flowName: string;
  flowData: any;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose, flowName, flowData }) => {
  const [title, setTitle] = useState(flowName);
  const [description, setDescription] = useState('Check out my workflow!');
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/flow-editor`;

  const shareToSocialMedia = (platform: string) => {
    const text = `Check out my workflow: ${title}`;
    const url = shareUrl;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToCommunity = async () => {
    setIsSharing(true);
    try {
      await threadService.createThread({
        title,
        content: `${description}\n\nWorkflow: ${JSON.stringify(flowData, null, 2)}`,
        tags: 'workflow,flow-editor'
      });
      onClose();
      // Navigate to community page
      window.location.href = '/community';
    } catch (error) {
      console.error('Failed to share to community:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share size={20} />
            Share Your Workflow
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Workflow title"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your workflow..."
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Share URL</label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Share on Social Media</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => shareToSocialMedia('twitter')}
                variant="outline"
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Twitter
              </Button>
              <Button 
                onClick={() => shareToSocialMedia('facebook')}
                variant="outline"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Facebook
              </Button>
              <Button 
                onClick={() => shareToSocialMedia('linkedin')}
                variant="outline"
                className="bg-blue-700 text-white hover:bg-blue-800"
              >
                LinkedIn
              </Button>
              <Button 
                onClick={() => shareToSocialMedia('whatsapp')}
                variant="outline"
                className="bg-green-500 text-white hover:bg-green-600"
              >
                WhatsApp
              </Button>
            </div>
          </div>

          <div className="pt-2 border-t">
            <Button 
              onClick={shareToCommunity}
              disabled={isSharing}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isSharing ? 'Sharing...' : 'Share to Community'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
