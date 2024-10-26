"use client";

import { ColumnDef } from "@tanstack/react-table";

import { statuses } from "../data/data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { TSubmissionWithUserAndResults } from "../../../../../types/submission";

export const columns: ColumnDef<TSubmissionWithUserAndResults>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="submission" />
    ),
    cell: ({ row }) => <div className="w-fit">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    accessorFn: (row) => row.user.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "submissionTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="submissionTime (ms)" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("submissionTime")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "executionTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="executionTime (ms)" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("executionTime")}
          </span>
        </div>
      );
    },
  },
];
