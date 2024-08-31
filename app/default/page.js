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
import defaultConstants from '@/constants/default.constants';

const renderRows = () => {
    const rows = [];

    for (const category in defaultConstants.images) {
        for (const type in defaultConstants.images[category]) {
            rows.push(
                <TableRow key={`${category}-${type}`}>
                    <TableCell className="font-medium">Images</TableCell>
                    <TableCell>{category}</TableCell>
                    <TableCell>{type}</TableCell>
                    <TableCell>
                        {defaultConstants.images[category][type]}
                    </TableCell>
                    <TableCell className="text-right">
                        <GoPencil className="cursor-pointer" />
                    </TableCell>
                </TableRow>
            );
        }
    }

    return rows;
};

export default function Dashboard() {
    return (
        <div>
            <Table>
                <TableCaption>A list of your default values.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Sub caregory</TableHead>
                        <TableHead>value</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>{renderRows()}</TableBody>
            </Table>
        </div>
    );
}
