export interface User {
    id: number,
    email: string,
    username: string | undefined,
    created_at: Date,
    policy_groups: string
} 