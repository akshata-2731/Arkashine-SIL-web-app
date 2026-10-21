/**
 * Browser SpeechSynthesis helper for Student Portal lesson cards.
 * Speaks English or Hindi with fallback and cancellation support.
 */

class StudentSpeechService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onStateChangeListeners: Set<(isSpeaking: boolean) => void> = new Set();

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }

  public subscribe(listener: (isSpeaking: boolean) => void): () => void {
    this.onStateChangeListeners.add(listener);
    return () => this.onStateChangeListeners.delete(listener);
  }

  private notify(isSpeaking: boolean) {
    this.onStateChangeListeners.forEach(fn => fn(isSpeaking));
  }

  public speak(text: string, lang: 'en' | 'hi' = 'en'): void {
    if (!this.isSupported()) return;

    this.stop();

    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // Friendly, clear pacing for students
    utterance.pitch = 1.05;

    // Pick a matching voice if available
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => (lang === 'hi' ? v.lang.startsWith('hi') : v.lang.startsWith('en')));
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      this.currentUtterance = utterance;
      this.notify(true);
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      this.notify(false);
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      this.notify(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  public stop(): void {
    if (!this.isSupported()) return;
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    this.notify(false);
  }

  public isSpeaking(): boolean {
    if (!this.isSupported()) return false;
    return window.speechSynthesis.speaking;
  }
}

export const studentSpeech = new StudentSpeechService();
