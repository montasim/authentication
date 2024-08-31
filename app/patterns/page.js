import React from 'react';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { GoPencil } from 'react-icons/go';
import patternsConstants from '@/constants/patterns.constants';

const renderRows = () => {
    const rows = [];

    Object.entries(patternsConstants).map(([key, value]) => {
        return rows.push(
            <TableRow key={key}>
                <TableCell className="font-medium">{key}</TableCell>
                <TableCell>{value.toString()}</TableCell>
                <TableCell className="text-right">
                    <GoPencil className="cursor-pointer" />
                </TableCell>
            </TableRow>
        );
    });

    return rows;
};

export default function Dashboard() {
    return (
        <div>
            <Table>
                <TableCaption>A list of your used patterns.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableCell className="font-medium">
                            Pattern Type
                        </TableCell>
                        <TableCell>Regex Value</TableCell>
                        <TableCell className="text-right">Edit</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>{renderRows()}</TableBody>
            </Table>
        </div>
    );
}
