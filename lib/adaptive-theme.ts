export type EmotionalState = 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust' | 'trust' | 'anticipation' | 'neutral';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface UserContext {
  mood: EmotionalState;
  energyLevel: number; // 0-100
  timeOfDay: TimeOfDay;
  userPreferences: {
    prefersDarkMode: boolean;
    contrastLevel: 'normal' | 'high';
    reducedMotion: boolean;
  };
}

export interface Theme {
  background: string;
  surface: string;
  text: string;
  accent: string;
}

export class AdaptiveThemeEngine {
  private currentMood: EmotionalState = 'neutral';
  private timeOfDay: TimeOfDay = 'morning';

  private baseColors = {
    morning: 'hsl(200, 50%, 98%)',
    afternoon: 'hsl(45, 50%, 97%)',
    evening: 'hsl(25, 40%, 96%)',
    night: 'hsl(230, 20%, 8%)'
  };

  private emotionalColors = {
    joy: 'hsl(45, 80%, 85%)',
    sadness: 'hsl(210, 60%, 85%)',
    anger: 'hsl(0, 50%, 85%)',
    fear: 'hsl(270, 40%, 85%)',
    surprise: 'hsl(120, 50%, 85%)',
    disgust: 'hsl(30, 50%, 85%)',
    trust: 'hsl(220, 50%, 85%)',
    anticipation: 'hsl(320, 40%, 85%)',
    neutral: 'hsl(200, 20%, 90%)'
  };

  private surfaceColor = 'hsl(0, 0%, 100%)';
  private textColor = 'hsl(220, 13%, 13%)';

  updateTheme(context: UserContext): void {
    const theme = this.calculateTheme(context);
    
    // Apply CSS custom properties with smooth transitions
    const root = document.documentElement;
    root.style.setProperty('--bg-adaptive', theme.background);
    root.style.setProperty('--surface-adaptive', theme.surface);
    root.style.setProperty('--text-adaptive', theme.text);
    root.style.setProperty('--accent-adaptive', theme.accent);
    
    // Smooth transitions
    root.style.setProperty('--theme-transition', '300ms ease');
    
    // Update current state
    this.currentMood = context.mood;
    this.timeOfDay = context.timeOfDay;
  }

  private calculateTheme(context: UserContext): Theme {
    return {
      background: this.blendColors(
        this.baseColors[context.timeOfDay],
        this.emotionalColors[context.mood],
        0.2
      ),
      surface: this.adjustBrightness(this.surfaceColor, context.energyLevel),
      text: this.ensureContrast(this.textColor, this.baseColors[context.timeOfDay]),
      accent: this.emotionalColors[context.mood]
    };
  }

  private blendColors(color1: string, color2: string, ratio: number): string {
    // Simple color blending - in a real implementation, you'd use a color library
    return color1; // Placeholder - would implement actual color blending
  }

  private adjustBrightness(color: string, energyLevel: number): string {
    // Adjust brightness based on energy level
    return color; // Placeholder - would implement brightness adjustment
  }

  private ensureContrast(textColor: string, backgroundColor: string): string {
    // Ensure WCAG contrast ratios are met
    return textColor; // Placeholder - would implement contrast checking
  }

  getCurrentMood(): EmotionalState {
    return this.currentMood;
  }

  getTimeOfDay(): TimeOfDay {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }
}

// Export singleton instance
export const adaptiveTheme = new AdaptiveThemeEngine();