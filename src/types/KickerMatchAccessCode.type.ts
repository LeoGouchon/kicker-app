export type KickerMatchAccessCodeStatus = 'ACTIVE' | 'REVOKED';

export type KickerMatchAccessCode = {
    id: string;
    code: string;
    status: KickerMatchAccessCodeStatus;
    createdAt: number;
    expiresAt: number | null;
    lastUsedAt: number | null;
    usageCount: number;
    revokedAt: number | null;
    revokedReason: string | null;
    createdByUserId: string;
};

export type CreateKickerMatchAccessCodePayload = {
    code?: string;
    length?: number;
    expiresAt?: number;
};
