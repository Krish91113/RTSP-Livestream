import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  Image,
  Trash2,
  Edit3,
  Link,
  Plus,
  ChevronDown,
  Layers,
  Settings2,
  Radio,
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Overlay, OverlayType, StreamConfig } from '@/types/overlay';

interface OverlaySidebarProps {
  overlays: Overlay[];
  selectedOverlay: Overlay | null;
  streamConfig: StreamConfig;
  onAddOverlay: (type: OverlayType, content: string) => void;
  onUpdateOverlay: (id: string, updates: Partial<Overlay>) => void;
  onDeleteOverlay: (id: string) => void;
  onSelectOverlay: (id: string | null) => void;
  onUpdateStreamUrl: (url: string) => void;
  onToggleLive: () => void;
}

export function OverlaySidebar({
  overlays,
  selectedOverlay,
  streamConfig,
  onAddOverlay,
  onUpdateOverlay,
  onDeleteOverlay,
  onSelectOverlay,
  onUpdateStreamUrl,
  onToggleLive,
}: OverlaySidebarProps) {
  const [newOverlayType, setNewOverlayType] = useState<OverlayType>('text');
  const [newOverlayContent, setNewOverlayContent] = useState('');
  const [streamUrl, setStreamUrl] = useState(streamConfig.url);
  const [isStreamOpen, setIsStreamOpen] = useState(true);
  const [isOverlaysOpen, setIsOverlaysOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);
  const { toast } = useToast();

  const handleAddOverlay = () => {
    if (!newOverlayContent.trim()) return;
    onAddOverlay(newOverlayType, newOverlayContent);
    setNewOverlayContent('');
  };

  const handleUpdateStream = () => {
    if (streamUrl.startsWith('rtsp://') || streamUrl.startsWith('udp://')) {
      toast({
        title: "Protocol Warning",
        description: "Browsers cannot directly play RTSP/UDP. Ensure you have a backend transcoder or use HLS (.m3u8).",
      });
    }
    onUpdateStreamUrl(streamUrl);
  };

  return (
    <aside className="w-[340px] h-full bg-sidebar border-l border-sidebar-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-lg font-semibold text-sidebar-foreground flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          Overlay Manager
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Drag overlays on the video to reposition
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Stream Configuration */}
        <Collapsible open={isStreamOpen} onOpenChange={setIsStreamOpen}>
          <CollapsibleTrigger className="sidebar-section w-full flex items-center justify-between hover:bg-sidebar-accent/50 transition-colors">
            <div className="flex items-center gap-2">
              <Link className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Stream Source</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${isStreamOpen ? 'rotate-180' : ''
                }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  RTSP / HLS Stream URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={streamUrl}
                    onChange={(e) => setStreamUrl(e.target.value)}
                    placeholder="rtsp://... or https://..."
                    className="input-dark text-xs font-mono"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleUpdateStream}
                  >
                    Apply
                  </Button>
                </div>
              </div>
              <Button
                variant={streamConfig.isLive ? 'destructive' : 'default'}
                className="w-full"
                onClick={onToggleLive}
              >
                <Radio className="w-4 h-4 mr-2" />
                {streamConfig.isLive ? 'Stop Stream' : 'Start Stream'}
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Add New Overlay */}
        <Collapsible open={isOverlaysOpen} onOpenChange={setIsOverlaysOpen}>
          <CollapsibleTrigger className="sidebar-section w-full flex items-center justify-between hover:bg-sidebar-accent/50 transition-colors">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Add Overlay</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${isOverlaysOpen ? 'rotate-180' : ''
                }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Type</Label>
                <Select
                  value={newOverlayType}
                  onValueChange={(v) => setNewOverlayType(v as OverlayType)}
                >
                  <SelectTrigger className="input-dark">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">
                      <div className="flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        <span>Text</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="image">
                      <div className="flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        <span>Image</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  {newOverlayType === 'text' ? 'Text Content' : 'Image URL'}
                </Label>
                <Input
                  value={newOverlayContent}
                  onChange={(e) => setNewOverlayContent(e.target.value)}
                  placeholder={
                    newOverlayType === 'text'
                      ? 'Enter text...'
                      : 'https://example.com/image.png'
                  }
                  className="input-dark text-sm"
                />
              </div>
              <Button className="w-full" onClick={handleAddOverlay}>
                <Plus className="w-4 h-4 mr-2" />
                Add Overlay
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Active Overlays List */}
        <div className="sidebar-section">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-sm">
              Active Overlays ({overlays.length})
            </span>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {overlays.map((overlay) => (
                <motion.div
                  key={overlay.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`glass-panel p-3 cursor-pointer transition-all ${selectedOverlay?.id === overlay.id
                    ? 'ring-2 ring-primary'
                    : 'hover:bg-card/90'
                    }`}
                  onClick={() => onSelectOverlay(overlay.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      {overlay.type === 'text' ? (
                        <Type className="w-4 h-4 text-primary flex-shrink-0" />
                      ) : (
                        <Image className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                      <span className="text-sm truncate">
                        {overlay.type === 'text'
                          ? overlay.content
                          : 'Image Overlay'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-7 h-7 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteOverlay(overlay.id);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 text-xs text-muted-foreground font-mono">
                    <span>x: {overlay.x.toFixed(1)}%</span>
                    <span>y: {overlay.y.toFixed(1)}%</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {overlays.length === 0 && (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No overlays yet. Add one above!
              </div>
            )}
          </div>
        </div>

        {/* Selected Overlay Properties */}
        {selectedOverlay && (
          <Collapsible
            open={isPropertiesOpen}
            onOpenChange={setIsPropertiesOpen}
          >
            <CollapsibleTrigger className="sidebar-section w-full flex items-center justify-between hover:bg-sidebar-accent/50 transition-colors">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Properties</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${isPropertiesOpen ? 'rotate-180' : ''
                  }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 space-y-4">
                {selectedOverlay.type === 'text' && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Content
                      </Label>
                      <Input
                        value={selectedOverlay.content}
                        onChange={(e) =>
                          onUpdateOverlay(selectedOverlay.id, {
                            content: e.target.value,
                          })
                        }
                        className="input-dark text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Font Size: {selectedOverlay.fontSize}px
                      </Label>
                      <Slider
                        value={[selectedOverlay.fontSize ?? 16]}
                        min={10}
                        max={72}
                        step={1}
                        onValueChange={([v]) =>
                          onUpdateOverlay(selectedOverlay.id, { fontSize: v })
                        }
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Color
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={selectedOverlay.fontColor ?? '#ffffff'}
                          onChange={(e) =>
                            onUpdateOverlay(selectedOverlay.id, {
                              fontColor: e.target.value,
                            })
                          }
                          className="w-12 h-9 p-1 bg-transparent border-border cursor-pointer"
                        />
                        <Input
                          value={selectedOverlay.fontColor ?? '#ffffff'}
                          onChange={(e) =>
                            onUpdateOverlay(selectedOverlay.id, {
                              fontColor: e.target.value,
                            })
                          }
                          className="input-dark text-sm font-mono flex-1"
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Opacity: {selectedOverlay.opacity ?? 100}%
                  </Label>
                  <Slider
                    value={[selectedOverlay.opacity ?? 100]}
                    min={10}
                    max={100}
                    step={5}
                    onValueChange={([v]) =>
                      onUpdateOverlay(selectedOverlay.id, { opacity: v })
                    }
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">X (%)</Label>
                    <Input
                      type="number"
                      value={selectedOverlay.x.toFixed(1)}
                      onChange={(e) =>
                        onUpdateOverlay(selectedOverlay.id, {
                          x: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="input-dark text-sm font-mono"
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Y (%)</Label>
                    <Input
                      type="number"
                      value={selectedOverlay.y.toFixed(1)}
                      onChange={(e) =>
                        onUpdateOverlay(selectedOverlay.id, {
                          y: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="input-dark text-sm font-mono"
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border bg-sidebar-accent/30">
        <p className="text-xs text-muted-foreground text-center">
          API: <code className="font-mono text-primary">/api/overlays</code>
        </p>
      </div>
    </aside>
  );
}
