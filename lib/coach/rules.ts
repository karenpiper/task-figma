export type Rubric = {
  intent: number;
  framing: number;
  alignment: number;
  boundaries: number;
  concision: number;
  follow: number;
  tone: number;
};

export function recommend(r: Rubric) {
  const recs: { 
    kind: "EXERCISE" | "READ" | "SCRIPT" | "TASK"; 
    title: string; 
    body: string; 
    rationale?: string 
  }[] = [];
  
  if (r.intent < 3 && r.concision < 3) {
    recs.push({ 
      kind: "EXERCISE", 
      title: "BLUF Sprint", 
      body: "Write your ask in ≤50 words.", 
      rationale: "Intent + concision low" 
    });
  }
  
  if (r.boundaries < 3 && r.framing >= 4) {
    recs.push({ 
      kind: "SCRIPT", 
      title: "Tradeoff Script", 
      body: "Given [constraint], we can hit [goal] by [date] if we drop [scope] or add [resource]. Preference?", 
      rationale: "Boundaries low but framing strong"
    });
  }
  
  if (r.alignment < 3) {
    recs.push({ 
      kind: "TASK", 
      title: "Manager Scoreboard", 
      body: "List top 3 incentives/constraints for this manager.", 
      rationale: "Alignment needs improvement"
    });
  }
  
  if (recs.length === 0) {
    recs.push({ 
      kind: "READ", 
      title: "Executive Summaries 101", 
      body: "BLUF and option framing primer.", 
      rationale: "All scores look good - general improvement"
    });
  }
  
  return recs;
}
