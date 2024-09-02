'use client';

import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { getData } from '@/utilities/axios';
import Spinner from '@/components/spinner/Spinner';

export default function Dashboard() {
    const [uses, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchApiData = async () => {
        try {
            setLoading(true);

            const data = await getData('/api/v1/uses');

            setUsers(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApiData();
    }, []);

    // Display data
    return loading ? (
        <Spinner />
    ) : (
        <div className="py-4 px-2 grid grid-cols-5 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Served Request</CardTitle>
                    <CardDescription>{uses.use ? uses.use : 0}</CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Successful Request</CardTitle>
                    <CardDescription>{uses.use ? uses.use : 0}</CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Failed Request</CardTitle>
                    <CardDescription>{uses.use ? uses.use : 0}</CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Bad Request</CardTitle>
                    <CardDescription>{uses.use ? uses.use : 0}</CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Server Error</CardTitle>
                    <CardDescription>{uses.use ? uses.use : 0}</CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}
