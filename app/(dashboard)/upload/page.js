'use client';

import { useState, useRef } from 'react';
import { createData } from '@/utilities/axios';

export default function AvatarUploadPage() {
    const inputFileRef = useRef(null);
    const [blob, setBlob] = useState(null);
    return (
        <div>
            <h1>Upload Your Avatar</h1>

            <form
                onSubmit={async (event) => {
                    event.preventDefault();

                    const file = inputFileRef.current.files?.[0];

                    const response = await createData(
                        `/api/v1/avatar/upload?filename=${file.name}`,
                        file
                    );

                    setBlob(response);
                }}
            >
                <input name="file" ref={inputFileRef} type="file" required />
                <button type="submit">Upload</button>
            </form>
            {blob && (
                <div>
                    Blob url: <a href={blob.url}>{blob.url}</a>
                </div>
            )}
        </div>
    );
}
