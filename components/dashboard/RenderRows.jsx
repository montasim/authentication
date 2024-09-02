import { TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GoCheck, GoPencil, GoX } from 'react-icons/go';
import RenderDialog from '@/components/dashboard/ActivityDescriptionDialog';
import { AiOutlineDelete } from 'react-icons/ai';
import React from 'react';

export default function RenderRows({
    constants,
    editingState,
    handleEditClick,
    handleDeleteClick,
    handleSaveClick,
    handleCancelClick,
    handleInputChange,
}) {
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
}
