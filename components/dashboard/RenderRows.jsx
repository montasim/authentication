import React from 'react';

import { TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import RenderDialog from '@/components/dashboard/ActivityDescriptionDialog';
import { GoCheck, GoPencil, GoX } from 'react-icons/go';
import { AiOutlineDelete } from 'react-icons/ai';

export default function RenderRows({
    data,
    editingState,
    handleEditClick,
    handleDeleteClick,
    handleSaveClick,
    handleCancelClick,
    handleInputChange,
}) {
    return data.map((d) => (
        <TableRow key={d.id}>
            <TableCell className="font-medium">{d.name}</TableCell>
            <TableCell>
                {editingState[d.id]?.isEditing ? (
                    <Input
                        className={
                            !editingState[d.id] ? 'pointer-events-none' : ''
                        }
                        type="text"
                        value={editingState[d.id]?.value || d.value}
                        onChange={(e) =>
                            handleInputChange(d.id, e.target.value)
                        }
                        readOnly={!editingState[d.id]?.isEditing}
                    />
                ) : (
                    <p>{d.value}</p>
                )}
            </TableCell>
            <TableCell className="text-right">
                {editingState[d.id]?.isEditing ? (
                    <div className="flex items-center justify-end gap-3">
                        <GoCheck
                            className="cursor-pointer text-xl text-green-500"
                            onClick={() => handleSaveClick(d.id)}
                        />
                        <GoX
                            className="cursor-pointer text-xl text-rose-500"
                            onClick={() => handleCancelClick(d.id)}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-end gap-3">
                        <RenderDialog
                            activity={d}
                            editingState={editingState}
                            title="Are you absolutely sure?"
                        />

                        <GoPencil
                            className="cursor-pointer text-lg text-blue-500"
                            onClick={() => handleEditClick(d.id, d.value)}
                        />

                        <AiOutlineDelete
                            className="cursor-pointer text-lg text-rose-500"
                            onClick={() => handleDeleteClick(d.id)}
                        />
                    </div>
                )}
            </TableCell>
        </TableRow>
    ));
}
