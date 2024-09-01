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
import { AiOutlineDelete } from 'react-icons/ai';
import { deleteData, getData, createData, updateData } from '@/utilities/axios';
import Spinner from '@/components/spinner/Spinner';
import RenderDialog from '@/components/dashboard/ActivityDescriptionDialog';

export default function ContentTypes() {
    const [contentTypes, setContentTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingState, setEditingState] = useState({});

    const fetchApiData = async () => {
        try {
            setLoading(true);

            const data = await getData('/api/v1/dashboard/content-types');

            setContentTypes(data);
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
        await deleteData('/api/v1/dashboard/content-types/', id);

        await fetchApiData();
    };

    const handleSaveClick = async (id) => {
        const newValue = editingState[id].value;
        const newName = editingState[id].name; // Assuming you also manage names
        const newDescription = editingState[id].description; // Assuming descriptions are also editable

        await updateData(`/api/v1/dashboard/content-types/${id}`, {
            value: newValue,
            name: newName,
            description: newDescription,
        });

        await fetchApiData();
    };

    const handleResetToDefaultClick = async () => {
        await createData(`/api/v1/dashboard/content-types`, {});

        await fetchApiData();
    };

    const handleDeleteAllClick = async () => {
        await deleteData(`/api/v1/dashboard/content-types`, '');

        setContentTypes([]);

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
            {contentTypes ? (
                <Table>
                    <TableCaption>
                        {contentTypes.length
                            ? 'A list of your used content types variables.'
                            : 'No content types data found.'}
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
                            contentTypes={contentTypes}
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
    contentTypes,
    editingState,
    handleEditClick,
    handleDeleteClick,
    handleSaveClick,
    handleCancelClick,
    handleInputChange,
}) => {
    return contentTypes.map((content) => (
        <TableRow key={content.id}>
            <TableCell className="font-medium">{content.name}</TableCell>
            <TableCell>
                {editingState[content.id]?.isEditing ? (
                    <Input
                        className={
                            !editingState[content.id]
                                ? 'pointer-events-none'
                                : ''
                        }
                        type="text"
                        value={editingState[content.id]?.value || content.value}
                        onChange={(e) =>
                            handleInputChange(content.id, e.target.value)
                        }
                        readOnly={!editingState[content.id]?.isEditing}
                    />
                ) : (
                    <p>{content.value}</p>
                )}
            </TableCell>
            <TableCell className="text-right">
                {editingState[content.id]?.isEditing ? (
                    <>
                        <Button
                            variant="outline"
                            onClick={() => handleSaveClick(content.id)}
                        >
                            <GoCheck />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleCancelClick(content.id)}
                        >
                            <GoX />
                        </Button>
                    </>
                ) : (
                    <div className="flex items-center justify-evenly">
                        <RenderDialog
                            content={content}
                            editingState={editingState}
                            title="Are you absolutely sure?"
                        />

                        <GoPencil
                            className="cursor-pointer text-blue-500"
                            onClick={() =>
                                handleEditClick(content.id, content.value)
                            }
                        />

                        <AiOutlineDelete
                            className="cursor-pointer text-destructive"
                            onClick={() => handleDeleteClick(content.id)}
                        />
                    </div>
                )}
            </TableCell>
        </TableRow>
    ));
};
