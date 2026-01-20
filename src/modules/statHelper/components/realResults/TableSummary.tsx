import { Table } from 'antd';
import React from 'react';

type TableSummaryProps = {
    scoreDiffs: number[];
    totalRow: Record<string, number | string>;
};

export const TableSummary: React.FC<TableSummaryProps> = ({ scoreDiffs, totalRow }) => {
    return (
        <Table.Summary fixed>
            <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                    <strong>Total</strong>
                </Table.Summary.Cell>

                {scoreDiffs.map((score, i) => (
                    <Table.Summary.Cell key={score} index={i + 1} align="center">
                        <strong>{totalRow[score]}</strong>
                    </Table.Summary.Cell>
                ))}

                <Table.Summary.Cell index={scoreDiffs.length + 1} align="center">
                    <strong>{totalRow.total}</strong>
                </Table.Summary.Cell>
            </Table.Summary.Row>
        </Table.Summary>
    );
};
