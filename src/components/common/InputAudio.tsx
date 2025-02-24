import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
import { useAudioStore } from "@/store/store";
import styles from "./styles/InputAudio.module.scss";

export interface InputAudioRef {
  clearAudio: () => void;
  getFile: () => File | null;
}

interface InputAudioProps {
  soundUrl?: string; // URL del audio externo
  onChange?: (url: string | null) => void; // Notificar cambios al padre
}

const InputAudio = forwardRef<InputAudioRef, InputAudioProps>(({ soundUrl, onChange }, ref) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { audio, setAudio } = useAudioStore();
  const [localAudioUrl, setLocalAudioUrl] = useState<string | null>(soundUrl || null);

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    const audioElement = new Audio(tempUrl);

    audioElement.onloadedmetadata = () => {
      if (audioElement.duration > 20) {
        alert("El audio no puede durar más de 20 segundos.");
        URL.revokeObjectURL(tempUrl);
        setAudio(null);
        if (inputRef.current) inputRef.current.value = "";
      } else {
        setAudio(file);
        setLocalAudioUrl(tempUrl);
        onChange?.(tempUrl); // Notificar al padre
      }
    };
  };

  useEffect(() => {
    if (soundUrl !== localAudioUrl) {
      setLocalAudioUrl(soundUrl || null);
    }
  }, [soundUrl]);

  useEffect(() => {
    return () => {
      if (localAudioUrl && localAudioUrl.startsWith("blob:")) {
        URL.revokeObjectURL(localAudioUrl);
      }
    };
  }, [localAudioUrl]);

  useImperativeHandle(ref, () => ({
    clearAudio: () => {
      setAudio(null);
      setLocalAudioUrl(null);
      onChange?.(null); // Notificar al padre
      if (inputRef.current) inputRef.current.value = "";
    },
    getFile: () => audio.audioFile,
  }));

  return (
    <div className={styles.container}>
      {!localAudioUrl && (
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          onChange={handleAudioUpload}
          className={styles.container__input}
        />
      )}

      {localAudioUrl && (
        <div className={styles.audioContainer}>
          <audio controls className={styles.audioPlayer}>
            <source src={localAudioUrl} type="audio/mpeg" />
            Tu navegador no soporta el elemento de audio.
          </audio>
        </div>
      )}
    </div>
  );
});

export default InputAudio;
