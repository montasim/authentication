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

import activityTypesConstants from '@/constants/activityTypes.json';
import { Textarea } from '@/components/ui/textarea';

const renderRows = (
    activityTypes,
    editingState,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleInputChange
) => {
    return activityTypes.map((activity) => (
        <TableRow key={activity.id}>
            <TableCell className="font-medium">{activity.name}</TableCell>
            <TableCell>
                <Input
                    className={
                        !editingState[activity.id] ? 'pointer-events-none' : ''
                    }
                    type="text"
                    value={editingState[activity.id]?.value || activity.value}
                    onChange={(e) =>
                        handleInputChange(activity.id, e.target.value)
                    }
                    readOnly={!editingState[activity.id]?.isEditing}
                />
            </TableCell>
            <TableCell className="text-right">
                {editingState[activity.id]?.isEditing ? (
                    <>
                        <Button
                            variant="outline"
                            onClick={() => handleSaveClick(activity.id)}
                        >
                            <GoCheck />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleCancelClick(activity.id)}
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
                                                editingState[activity.id]
                                                    ?.description ||
                                                activity.description
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
                                handleEditClick(activity.id, activity.value)
                            }
                        />
                    </>
                )}
            </TableCell>
        </TableRow>
    ));
};

export default function Patterns() {
    const [activityTypes, setActivityTypes] = useState([]);
    const [editingState, setEditingState] = useState({});

    useEffect(() => {
        setActivityTypes(activityTypesConstants);
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
            const response = await fetch('/api/v1/dashboard/activity-types', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, value: newValue }),
            });

            if (response.ok) {
                setActivityTypes((prevActivityTypes) =>
                    prevActivityTypes.map((activity) =>
                        activity.id === id
                            ? { ...activity, value: newValue }
                            : activity
                    )
                );
                setEditingState({
                    ...editingState,
                    [id]: { isEditing: false },
                });
            } else {
                console.error('Failed to update activity.');
            }
        } catch (error) {
            console.error('Failed to update activity:', error);
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
                    A list of your used activity types variables.
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
                        activityTypes,
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
