export interface UserSession {
    id: number;
    email: string;
    name: string;
    role: 'super_admin' | 'company_admin' | 'agent';
    company_id: number | null;
    iat?: number;
    exp?: number;
}
