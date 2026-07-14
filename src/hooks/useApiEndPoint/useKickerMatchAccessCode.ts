import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
    CreateKickerMatchAccessCodePayload,
    KickerMatchAccessCode,
} from '../../types/KickerMatchAccessCode.type.ts';
import { api } from '../../utils/api.ts';

const queryKey = ['admin', 'kicker-match-codes'];

export const useGetKickerMatchAccessCodes = () =>
    useQuery<KickerMatchAccessCode[]>({
        queryKey,
        queryFn: async () => {
            const response = await api.get('/admin/kicker-match-codes');
            return response.data;
        },
    });

export const useCreateKickerMatchAccessCode = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateKickerMatchAccessCodePayload): Promise<KickerMatchAccessCode> => {
            const response = await api.post('/admin/kicker-match-codes', payload);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    });
};

export const useRevokeKickerMatchAccessCode = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string): Promise<KickerMatchAccessCode> => {
            const response = await api.patch(`/admin/kicker-match-codes/${id}/revoke`);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    });
};
