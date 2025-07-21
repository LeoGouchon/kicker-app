import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {api} from "../../utils/api.ts";
import type {Pagination} from "../../types/Pagination.type.ts";
import type {Player} from "../../types/Player.type.ts";

export const useGetPlayers = ({page, size}: { page: number, size: number }) => {
    return useQuery({
        queryKey: ['players', page, size],
        queryFn: async (): Promise<Pagination<Player>> => {
            try {
                return await api.get(`/players?page=${page}&size=${size}`).then(res => res.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des joueurs", error);
                throw error;
            }
        },
    });
}

export const useGetUnlinkedPlayers = () => {
    return useQuery({
        queryKey: ['unlinked-players'],
        queryFn: async (): Promise<Player[]> => {
            const res = await api.get('/players/unlinked');
            return res.data;
        }
    })
};

export const useCreatePlayer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (player: Partial<Player>): Promise<Player> => {
            try {
                return await api.post('/players', player).then(res => res.data);
            } catch (error) {
                console.error("Erreur lors de la création du joueur", error);
                throw error;
            }
        },
        onSuccess: (newPlayer: Player) => {
            const queries = queryClient
                .getQueryCache()
                .findAll({queryKey: ['players']})
                .filter(q => {
                    const key = q.queryKey;
                    return Array.isArray(key) && key[1] === 0; // page === 0
                });

            for (const query of queries) {
                const [, page, size] = query.queryKey;

                queryClient.setQueryData(['players', page, size], (oldData: Pagination<Player> | undefined): Pagination<Player> | undefined => {
                    if (!oldData) return;

                    const newContent = [newPlayer, ...oldData.content];
                    if (newContent.length > Number(size)) {
                        newContent.pop();
                    }

                    return {
                        ...oldData,
                        content: newContent,
                        totalElements: oldData.totalElements + 1
                    };
                });
            }
        }
    })
}

export const useDeletePlayer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await api.delete(`/players/${id}`);
        },
        onSuccess: (_, id) => {
            const queries = queryClient
                .getQueryCache()
                .findAll({queryKey: ['players'], exact: false});

            for (const query of queries) {
                const [, page, size] = query.queryKey;

                queryClient.setQueryData(['players', page, size], (oldData: Pagination<Player> | undefined): Pagination<Player> | undefined => {
                    if (!oldData) return;

                    const newContent = oldData.content.filter(player => player.id !== id);
                    return {
                        ...oldData,
                        content: newContent,
                        totalElements: oldData.totalElements - 1
                    };
                });
            }
        }
    })
}