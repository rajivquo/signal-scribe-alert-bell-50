
import { useState, useEffect, useRef } from 'react';

export const useAudioManager = () => {
  const [customRingtone, setCustomRingtone] = useState<string | null>(null);
  const [isRingtoneLoaded, setIsRingtoneLoaded] = useState(false);
  const [showStartupDialog, setShowStartupDialog] = useState(true); // Always show on startup
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const initializedRef = useRef(false);

  // Always show startup dialog when component mounts - no localStorage check
  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    console.log('🎵 AudioManager: App opened - showing startup dialog for MP3 selection');
    
    // Always start fresh - no localStorage loading
    setCustomRingtone(null);
    setIsRingtoneLoaded(false);
    setShowStartupDialog(true);
  }, []);

  // Initialize hidden file input once
  useEffect(() => {
    if (fileInputRef.current) {
      return;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'audio/mp3,audio/mpeg';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', handleRingtoneSelect);
    document.body.appendChild(fileInput);
    fileInputRef.current = fileInput;

    return () => {
      if (fileInputRef.current && document.body.contains(fileInputRef.current)) {
        document.body.removeChild(fileInputRef.current);
      }
    };
  }, []);

  const handleRingtoneSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      try {
        console.log('🎵 AudioManager: Processing new ringtone file:', file.name);
        
        // Create blob URL from the selected file (no localStorage saving)
        const url = URL.createObjectURL(file);
        setCustomRingtone(url);
        setIsRingtoneLoaded(true);
        setShowStartupDialog(false);
        
        console.log('✅ AudioManager: MP3 ringtone loaded (session only):', file.name);
      } catch (error) {
        console.error('❌ AudioManager: Failed to process ringtone file:', error);
        setIsRingtoneLoaded(false);
        setCustomRingtone(null);
        setShowStartupDialog(true);
      }
    }
  };

  const triggerRingtoneSelection = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const changeRingtone = () => {
    // When user wants to change ringtone, show dialog again
    setShowStartupDialog(true);
  };

  return {
    customRingtone,
    isRingtoneLoaded,
    showStartupDialog,
    triggerRingtoneSelection,
    changeRingtone,
    setCustomRingtone
  };
};
