import { useState } from 'react';
import { Smile } from 'lucide-react';
import { Button } from '@components/ui/button.tsx';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const emojiGroups = {
    cats: ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🐱', '🐈', '🐈‍⬛'],
    hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💕', '💖', '💗', '💓', '💞', '💝'],
    actions: ['🐾', '🎾', '🏃', '💤', '🛁', '🍽️', '🥛', '🐟', '🧶', '📦', '🏠', '🪟'],
    emotions: ['✨', '⭐', '🌟', '💫', '🎉', '🎊', '👍', '👎', '✅', '❌', '⚠️', '💯'],
  };
  
  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Smile className="w-4 h-4" />
        Emojid
      </Button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Emoji panel */}
          <div className="absolute left-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg p-4 z-50 w-80">
            <div className="space-y-4">
              {/* Cats */}
              <div>
                <h4 className="text-xs font-semibold text-gray-600 mb-2">Kassid</h4>
                <div className="grid grid-cols-8 gap-1">
                  {emojiGroups.cats.map((emoji, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        onSelect(emoji);
                        setIsOpen(false);
                      }}
                      className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Hearts */}
              <div>
                <h4 className="text-xs font-semibold text-gray-600 mb-2">Südamed</h4>
                <div className="grid grid-cols-8 gap-1">
                  {emojiGroups.hearts.map((emoji, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        onSelect(emoji);
                        setIsOpen(false);
                      }}
                      className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Actions & Objects */}
              <div>
                <h4 className="text-xs font-semibold text-gray-600 mb-2">Tegevused</h4>
                <div className="grid grid-cols-8 gap-1">
                  {emojiGroups.actions.map((emoji, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        onSelect(emoji);
                        setIsOpen(false);
                      }}
                      className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Emotions & Symbols */}
              <div>
                <h4 className="text-xs font-semibold text-gray-600 mb-2">Sümbolid</h4>
                <div className="grid grid-cols-8 gap-1">
                  {emojiGroups.emotions.map((emoji, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        onSelect(emoji);
                        setIsOpen(false);
                      }}
                      className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
