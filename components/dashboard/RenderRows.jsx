import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { GoCheck, GoPencil, GoX } from 'react-icons/go';
import { AiOutlineDelete } from 'react-icons/ai';
import RenderDialog from '@/components/dashboard/ActivityDescriptionDialog';

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
                    <div className="flex items-center justify-end gap-3">
                        <GoCheck
                            className="cursor-pointer text-xl text-green-500"
                            onClick={() => handleSaveClick(constant.id)}
                        />
                        <GoX
                            className="cursor-pointer text-xl text-rose-500"
                            onClick={() => handleCancelClick(constant.id)}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-end gap-3">
                        <RenderDialog
                            activity={constant}
                            editingState={editingState}
                            title="Are you absolutely sure?"
                        />

                        <GoPencil
                            className="cursor-pointer text-lg text-blue-500"
                            onClick={() =>
                                handleEditClick(constant.id, constant.value)
                            }
                        />

                        <AiOutlineDelete
                            className="cursor-pointer text-lg text-rose-500"
                            onClick={() => handleDeleteClick(constant.id)}
                        />
                    </div>
                )}
            </TableCell>
        </TableRow>
    ));
}
