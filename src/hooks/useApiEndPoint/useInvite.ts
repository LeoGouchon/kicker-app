import { useMutation } from '@tanstack/react-query';

import { api } from '../../utils/api.ts';

type InvitationResponse = {
    token: string;
    clientId: string;
    applicationName: string;
    invitationUrl: string;
};

export const useInvite = () => {
    return useMutation({
        mutationFn: async (playerId: string): Promise<InvitationResponse> => {
            const response = await api.post('/admin/invitation', { playerId });
            return response.data;
        },
    });
};
