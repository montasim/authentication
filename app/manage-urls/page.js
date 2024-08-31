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

import urlConstants from '@/constants/urls.json';
import { Textarea } from '@/components/ui/textarea';

const renderRows = (
    urls,
    editingState,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleInputChange
) => {
    return urls.map((url) => (
        <TableRow key={url.id}>
            <TableCell className="font-medium">{url.name}</TableCell>
            <TableCell>
                <Input
                    className={
                        !editingState[url.id] ? 'pointer-events-none' : ''
                    }
                    type="text"
                    value={editingState[url.id]?.value || url.value}
                    onChange={(e) => handleInputChange(url.id, e.target.value)}
                    readOnly={!editingState[url.id]?.isEditing}
                />
            </TableCell>
            <TableCell className="text-right">
                {editingState[url.id]?.isEditing ? (
                    <>
                        <Button
                            variant="outline"
                            onClick={() => handleSaveClick(url.id)}
                        >
                            <GoCheck />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleCancelClick(url.id)}
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
                                                editingState[url.id]
                                                    ?.description ||
                                                url.description
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
                            onClick={() => handleEditClick(url.id, url.value)}
                        />
                    </>
                )}
            </TableCell>
        </TableRow>
    ));
};

export default function ManageUrls() {
    const [urls, setUrls] = useState([]);
    const [editingState, setEditingState] = useState({});

    useEffect(() => {
        setUrls(urlConstants);
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
            const response = await fetch('/api/v1/dashboard/manage-urls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, value: newValue }),
            });

            if (response.ok) {
                setUrls((prevUrls) =>
                    prevUrls.map((url) =>
                        url.id === id ? { ...url, value: newValue } : url
                    )
                );
                setEditingState({
                    ...editingState,
                    [id]: { isEditing: false },
                });
            } else {
                console.error('Failed to update url.');
            }
        } catch (error) {
            console.error('Failed to update url:', error);
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
                        urls,
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
