'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function BlockedEmailDomainsEditor() {
    const [blockedEmailDomains, setBlockedEmailDomains] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFileContent() {
            try {
                const response = await fetch(
                    '/api/v1/dashboard/blocked-emails'
                );
                const data = await response.json();
                setBlockedEmailDomains(data.data);
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
            const response = await fetch('/api/v1/dashboard/blocked-emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: blockedEmailDomains }),
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
                value={blockedEmailDomains}
                onChange={(e) => setBlockedEmailDomains(e.target.value)}
            />
            <Button onClick={handleSave} className="mt-4">
                Save
            </Button>
        </div>
    );
}
