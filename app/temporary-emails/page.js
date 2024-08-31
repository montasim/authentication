'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function TemporaryEmailDomainsEditor() {
    const [temporaryEmailDomains, setTemporaryEmailDomains] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFileContent() {
            try {
                const response = await fetch(
                    '/api/v1/dashboard/temporary-emails'
                );
                const data = await response.json();
                setTemporaryEmailDomains(data.data);
            } catch (error) {
                console.error('Error loading the file:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchFileContent();
    }, []);

    const handleSave = async () => {
        try {
            const response = await fetch('/api/v1/dashboard/temporary-emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: temporaryEmailDomains }),
            });

            if (!response.ok) {
                throw new Error('Failed to save the file');
            }

            alert('File saved successfully!');
        } catch (error) {
            console.error('Error saving the file:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Textarea
                className="resize-y h-96"
                value={temporaryEmailDomains}
                onChange={(e) => setTemporaryEmailDomains(e.target.value)}
            />
            <Button onClick={handleSave} className="mt-4">
                Save
            </Button>
        </div>
    );
}
