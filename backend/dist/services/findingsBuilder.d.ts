export interface Finding {
    id: string;
    type: 'cross_team' | 'hot_topic' | 'connector' | 'launch_alignment' | 'bottleneck' | 'insight';
    title: string;
    description: string;
}
/**
 * Compute org-wide findings from the unified store — connections and patterns
 * a user wouldn't easily see by scanning individual activities.
 */
export declare function buildFindings(): Finding[];
