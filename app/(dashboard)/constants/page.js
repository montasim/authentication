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
import RenderDialog from '@/components/dashboard/ActivityDescriptionDialog';
import { GoCheck, GoPencil, GoX } from 'react-icons/go';
import { AiOutlineDelete } from 'react-icons/ai';
import { deleteData, getData, createData, updateData } from '@/utilities/axios';
import Spinner from '@/components/spinner/Spinner';

export default function Constants() {
    const [constants, setConstants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingState, setEditingState] = useState({});

    const fetchApiData = async () => {
        try {
            setLoading(true);

            const data = await getData('/api/v1/dashboard/constants');

            setConstants(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApiData();
    }, []);

    const handleEditClick = (id, value) => {
        setEditingState({
            ...editingState,
            [id]: { isEditing: true, value },
        });
    };

    const handleDeleteClick = async (id) => {
        await deleteData('/api/v1/dashboard/constants/', id);

        await fetchApiData();
    };

    const handleSaveClick = async (id) => {
        const newValue = editingState[id].value;
        const newName = editingState[id].name; // Assuming you also manage names
        const newDescription = editingState[id].description; // Assuming descriptions are also editable

        await updateData(`/api/v1/dashboard/constants/${id}`, {
            value: newValue,
            name: newName,
            description: newDescription,
        });

        await fetchApiData();
    };

    const handleResetToDefaultClick = async () => {
        await createData(`/api/v1/dashboard/constants`, {});

        await fetchApiData();
    };

    const handleDeleteAllClick = async () => {
        await deleteData(`/api/v1/dashboard/constants`, '');

        setConstants([]);

        await fetchApiData();
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

    return loading ? (
        <Spinner />
    ) : (
        <div>
            {constants ? (
                <Table>
                    <TableCaption>
                        {constants.length
                            ? 'A list of your used constants variables.'
                            : 'No constants data found.'}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableCell className="font-medium">Key</TableCell>
                            <TableCell>Value</TableCell>
                            <TableCell className="text-right">Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <RenderRows
                            constants={constants}
                            editingState={editingState}
                            handleEditClick={handleEditClick}
                            handleDeleteClick={handleDeleteClick}
                            handleSaveClick={handleSaveClick}
                            handleCancelClick={handleCancelClick}
                            handleInputChange={handleInputChange}
                        />
                    </TableBody>
                </Table>
            ) : (
                <p>No data </p>
            )}

            <div className="flex items-center gap-4">
                <Button
                    size="xs"
                    className="text-xs p-1.5 px-2"
                    onClick={() => handleResetToDefaultClick()}
                >
                    Reset to default
                </Button>

                <Button
                    variant="destructive"
                    size="xs"
                    className="text-xs p-1.5 px-2"
                    onClick={() => handleDeleteAllClick()}
                >
                    Delete All
                </Button>
            </div>
        </div>
    );
}

const RenderRows = ({
    constants,
    editingState,
    handleEditClick,
    handleDeleteClick,
    handleSaveClick,
    handleCancelClick,
    handleInputChange,
}) => {
    return constants.map((constant) => (
        <TableRow key={constant.id}>
            <TableCell className="font-medium">{constant.name}</TableCell>
            <TableCell>
                {editingState[constant.id]?.isEditing ? (
                    <Input
                        className={
                            !editingState[constant.id]
                                ? 'pointer-events-none'
                                : ''
                        }
                        type="text"
                        value={
                            editingState[constant.id]?.value || constant.value
                        }
                        onChange={(e) =>
                            handleInputChange(constant.id, e.target.value)
                        }
                        readOnly={!editingState[constant.id]?.isEditing}
                    />
                ) : (
                    <p>{constant.value}</p>
                )}
            </TableCell>
            <TableCell className="text-right">
                {editingState[constant.id]?.isEditing ? (
                    <>
                        <Button
                            variant="outline"
                            onClick={() => handleSaveClick(constant.id)}
                        >
                            <GoCheck />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleCancelClick(constant.id)}
                        >
                            <GoX />
                        </Button>
                    </>
                ) : (
                    <div className="flex items-center justify-evenly">
                        <RenderDialog
                            activity={constant}
                            editingState={editingState}
                            title="Are you absolutely sure?"
                        />

                        <GoPencil
                            className="cursor-pointer text-blue-500"
                            onClick={() =>
                                handleEditClick(constant.id, constant.value)
                            }
                        />

                        <AiOutlineDelete
                            className="cursor-pointer text-destructive"
                            onClick={() => handleDeleteClick(constant.id)}
                        />
                    </div>
                )}
            </TableCell>
        </TableRow>
    ));
};
