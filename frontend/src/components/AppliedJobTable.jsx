import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge';
import { useSelector } from 'react-redux';

export const AppliedJobTable = () => {
    const appliedJobs = [1, 2, 3];
    const { allAppliedJobs } = useSelector(store => store.job);
    return (
        <div>
            <Table>
                <TableCaption>
                    List of your applied jobs
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                       allAppliedJobs.length <= 0 ? <span>You have not applied for a job</span> :  allAppliedJobs.map((appliedJob) => (

                            <TableRow key={appliedJob._id}>
                                <TableCell>{appliedJob?.job?.createdAt.split("T")[0]}</TableCell>
                                <TableCell>{appliedJob?.job?.title}</TableCell>
                                <TableCell>{appliedJob?.job?.company?.name}</TableCell>
                                <TableCell className="text-right uppercase"><Badge className={`${appliedJob?.status == "rejected" ? "bg-red-800" : appliedJob?.status == "pending" ? "bg-gray-500" : "bg-green-600"}`}>{appliedJob?.status}</Badge></TableCell>

                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}
