export interface LeaderboardEntry {
    id: string;
    team_name: string;
    year: 'FY' | 'SY' | 'TY' | 'BTech';
    department: string;
    time_taken: number; // in seconds
    score?: number;
    rank?: number;
}

export const DEPARTMENTS = [
    'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI&DS', 'Other'
];

export const YEARS = ['FY', 'SY', 'TY', 'BTech'] as const;
