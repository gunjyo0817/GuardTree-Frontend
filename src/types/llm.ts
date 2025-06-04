export interface Summary {
  summary: string;
  strengths: string;
  concerns: string;
  priority_item: string;
}

export interface Suggestions {
  strategy: string;
}

export interface AnalysisResult {
  summary: Summary;
  suggestions: Suggestions;
}
