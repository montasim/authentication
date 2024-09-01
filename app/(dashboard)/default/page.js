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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GoCheck, GoEye, GoInfo, GoPencil, GoX } from 'react-icons/go';

import patternsConstants from '@/constants/default.json';
import { Textarea } from '@/components/ui/textarea';

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
                    <>
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <GoInfo />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        <Textarea
                                            className="resize-y h-96"
                                            placeholder={
                                                editingState[pattern.id]
                                                    ?.description ||
                                                pattern.description
                                            }
                                        />
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    {/*<AlertDialogAction>Continue</AlertDialogAction>*/}
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <GoPencil
                            className="cursor-pointer"
                            onClick={() =>
                                handleEditClick(pattern.id, pattern.value)
                            }
                        />
                    </>
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
            const response = await fetch('/api/v1/dashboard/default', {
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
                <TableCaption>
                    A list of your used environments variables.
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableCell className="font-medium">Name</TableCell>
                        <TableCell>Value</TableCell>
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
