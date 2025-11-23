import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function VoiceAssistant({ onTranscript }: { onTranscript?: (text: string) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info('Processing audio...');
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        const base64Data = base64Audio.split(',')[1];

        // Send to speech-to-text function
        const { data, error } = await supabase.functions.invoke('voice-to-text', {
          body: { audio: base64Data }
        });

        if (error) throw error;

        if (data?.text) {
          onTranscript?.(data.text);
          toast.success('Voice recognized!');
        }
      };
    } catch (error: any) {
      console.error('Error processing audio:', error);
      toast.error('Failed to process voice input');
    }
  };

  const speak = async (text: string) => {
    setIsSpeaking(true);
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: 'nova' }
      });

      if (error) throw error;

      if (data?.audioContent) {
        // Convert base64 to audio and play
        const audioData = atob(data.audioContent);
        const audioArray = new Uint8Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) {
          audioArray[i] = audioData.charCodeAt(i);
        }
        const audioBlob = new Blob([audioArray], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.play();
      }
    } catch (error: any) {
      console.error('Error with text-to-speech:', error);
      toast.error('Failed to generate speech');
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex gap-2">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant={isRecording ? "destructive" : "outline"}
          size="icon"
          onClick={isRecording ? stopRecording : startRecording}
          className={isRecording ? "animate-pulse" : ""}
        >
          {isRecording ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </Button>
      </motion.div>
      
      {isSpeaking && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-primary"
        >
          <Volume2 className="w-4 h-4 animate-pulse" />
          <span className="text-sm">Speaking...</span>
        </motion.div>
      )}
    </div>
  );
}

// Export speak function for use in other components
export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = async (text: string) => {
    setIsSpeaking(true);
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: 'nova' }
      });

      if (error) throw error;

      if (data?.audioContent) {
        const audioData = atob(data.audioContent);
        const audioArray = new Uint8Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) {
          audioArray[i] = audioData.charCodeAt(i);
        }
        const audioBlob = new Blob([audioArray], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.play();
      }
    } catch (error: any) {
      console.error('Error with text-to-speech:', error);
      setIsSpeaking(false);
    }
  };

  return { speak, isSpeaking };
};