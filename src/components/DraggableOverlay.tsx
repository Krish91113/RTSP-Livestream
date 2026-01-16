import { useRef, useState, useCallback } from 'react';
import { motion, useDragControls, PanInfo } from 'framer-motion';
import { Overlay } from '@/types/overlay';
import { Move, X } from 'lucide-react';

interface DraggableOverlayProps {
  overlay: Overlay;
  isSelected: boolean;
  containerRef?: React.RefObject<HTMLDivElement>;
  onSelect: () => void;
  onUpdate: (updates: Partial<Overlay>) => void;
  onDelete: () => void;
}

export function DraggableOverlay({
  overlay,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}: DraggableOverlayProps) {
  const dragControls = useDragControls();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const parent = overlayRef.current?.parentElement;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();
      const deltaXPercent = (info.offset.x / parentRect.width) * 100;
      const deltaYPercent = (info.offset.y / parentRect.height) * 100;

      const newX = Math.max(0, Math.min(100 - overlay.width, overlay.x + deltaXPercent));
      const newY = Math.max(0, Math.min(100 - overlay.height, overlay.y + deltaYPercent));

      onUpdate({ x: newX, y: newY });
      setIsDragging(false);
    },
    [overlay.x, overlay.y, overlay.width, overlay.height, onUpdate]
  );

  return (
    <motion.div
      ref={overlayRef}
      className={`overlay-item group ${isSelected ? 'overlay-selected' : ''}`}
      style={{
        left: `${overlay.x}%`,
        top: `${overlay.y}%`,
        width: `${overlay.width}%`,
        height: `${overlay.height}%`,
        opacity: (overlay.opacity ?? 100) / 100,
        zIndex: overlay.zIndex ?? 1,
      }}
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      whileDrag={{ scale: 1.02 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: (overlay.opacity ?? 100) / 100, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Overlay Content */}
      <div className="w-full h-full flex items-center justify-center">
        {overlay.type === 'text' ? (
          <span
            className="overlay-text whitespace-nowrap"
            style={{
              fontSize: `${overlay.fontSize ?? 16}px`,
              color: overlay.fontColor ?? '#ffffff',
            }}
          >
            {overlay.content}
          </span>
        ) : (
          <img
            src={overlay.content}
            alt="Overlay"
            className="w-full h-full object-contain"
            draggable={false}
          />
        )}
      </div>

      {/* Selection Controls */}
      {isSelected && !isDragging && (
        <>
          {/* Move Handle */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-primary px-2 py-1 rounded-md text-primary-foreground text-xs font-medium shadow-lg">
            <Move className="w-3 h-3" />
            <span>Drag to move</span>
          </div>

          {/* Delete Button */}
          <button
            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground shadow-lg hover:bg-destructive/90 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <X className="w-3 h-3" />
          </button>

          {/* Resize Handles */}
          <div className="resize-handle -bottom-1 -right-1 cursor-se-resize opacity-100" />
          <div className="resize-handle -bottom-1 -left-1 cursor-sw-resize opacity-100" />
          <div className="resize-handle -top-1 -right-1 cursor-ne-resize opacity-100" />
          <div className="resize-handle -top-1 -left-1 cursor-nw-resize opacity-100" />
        </>
      )}
    </motion.div>
  );
}
