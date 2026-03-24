import { useGetDuoStats } from '../../hooks/useApiEndPoint/useStats.ts';

export const DuoStats = () => {
    const { data: duoStats } = useGetDuoStats();

    return <div>{JSON.stringify(duoStats)}</div>;
};
