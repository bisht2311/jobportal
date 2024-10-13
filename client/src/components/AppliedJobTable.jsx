import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  //   console.log(lenght);
  //   console.log(allAppliedJobs);
  //   const allAppliedJobs = [1, 2, 3, 4];
  return (
    <div>
      <Table>
        <TableCaption>A list of your applied jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.length <= 0 ? (
            <TableRow>
              <TableCell>You haven't applied any job yet.</TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob, index) => (
              <TableRow key={index}>
                <TableCell>
                  {appliedJob?.createdAt?.split("T")[0] || "17-07-2024"}
                </TableCell>
                <TableCell>{appliedJob.job?.title || "Aryanshi"}</TableCell>
                <TableCell>{appliedJob.job?.company?.name || "Love"}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`${
                      appliedJob?.status === "rejected"
                        ? "bg-red-400"
                        : appliedJob.status === "pending"
                        ? "bg-gray-400"
                        : "bg-green-400"
                    }`}
                  >
                    {appliedJob.status.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
