'use client';

import React, { useState, useEffect } from 'react';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GoCheck, GoPencil, GoX } from 'react-icons/go';

import patternsConstants from '@/constants/patternsArray.json';

const renderRows = (
    patterns,
    editingState,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleInputChange
) => {
    return patterns.map((pattern) => (
        <TableRow key={pattern.id}>
            <TableCell className="font-medium">{pattern.name}</TableCell>
            <TableCell>
                <Input
                    className={
                        !editingState[pattern.id] ? 'pointer-events-none' : ''
                    }
                    type="text"
                    value={editingState[pattern.id]?.value || pattern.value}
                    onChange={(e) =>
                        handleInputChange(pattern.id, e.target.value)
                    }
                    readOnly={!editingState[pattern.id]?.isEditing}
                />
            </TableCell>
            <TableCell className="text-right">
                {editingState[pattern.id]?.isEditing ? (
                    <>
                        <Button
                            variant="outline"
                            onClick={() => handleSaveClick(pattern.id)}
                        >
                            <GoCheck />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleCancelClick(pattern.id)}
                        >
                            <GoX />
                        </Button>
                    </>
                ) : (
                    <GoPencil
                        className="cursor-pointer"
                        onClick={() =>
                            handleEditClick(pattern.id, pattern.value)
                        }
                    />
                )}
            </TableCell>
        </TableRow>
    ));
};

export default function Patterns() {
    const [patterns, setPatterns] = useState([]);
    const [editingState, setEditingState] = useState({});

    useEffect(() => {
        setPatterns(patternsConstants);
    }, []);

    const handleEditClick = (id, value) => {
        setEditingState({
            ...editingState,
            [id]: { isEditing: true, value },
        });
    };

    const handleSaveClick = async (id) => {
        const newValue = editingState[id].value;

        try {
            const response = await fetch('/api/v1/dashboard/patterns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, value: newValue }),
            });

            if (response.ok) {
                setPatterns((prevPatterns) =>
                    prevPatterns.map((pattern) =>
                        pattern.id === id
                            ? { ...pattern, value: newValue }
                            : pattern
                    )
                );
                setEditingState({
                    ...editingState,
                    [id]: { isEditing: false },
                });
            } else {
                console.error('Failed to update pattern.');
            }
        } catch (error) {
            console.error('Failed to update pattern:', error);
        }
    };

    const handleCancelClick = (id) => {
        setEditingState({
            ...editingState,
            [id]: { isEditing: false },
        });
    };

    const handleInputChange = (id, newValue) => {
        setEditingState({
            ...editingState,
            [id]: { ...editingState[id], value: newValue },
        });
    };

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
                <TableBody>
                    {renderRows(
                        patterns,
                        editingState,
                        handleEditClick,
                        handleSaveClick,
                        handleCancelClick,
                        handleInputChange
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
