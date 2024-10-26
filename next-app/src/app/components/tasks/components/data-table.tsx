"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TperTestResults } from "@/schema/submissionResult";
import _ from "lodash";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const [openRows, setOpenRows] = React.useState<string[]>([]);
  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table className="overflow-x-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <Collapsible
                    key={row.id}
                    onOpenChange={(value) => {
                      if (value) {
                        setOpenRows((prev) => {
                          return [...prev, row.id];
                        });
                      } else {
                        setOpenRows((prev) => {
                          const updatedRows = [...prev];
                          const indexNumber = updatedRows.findIndex((item) => {
                            return item == row.id;
                          });
                          if (indexNumber != -1) {
                            updatedRows.splice(indexNumber, 1);
                          }
                          return updatedRows;
                        });
                      }
                    }}
                    asChild
                  >
                    <>
                      <TableRow>
                        {row.getVisibleCells().map((cell, index) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                        <TableCell
                          hidden={
                            //@ts-ignore
                            _.isEmpty(data[row.id].results)
                          }
                        >
                          <CollapsibleTrigger asChild>
                            <div>
                              <div className="flex justify-center items-center">
                                <div>
                                  {
                                    //@ts-ignore
                                    data[row.id].results.reduce((a, c) => {
                                      return c.status == "passed" ? a + 1 : a;
                                    }, 0)
                                  }
                                </div>
                                /
                                <div>
                                  {
                                    //@ts-ignore
                                    data[row.id].results.length
                                  }
                                </div>
                              </div>
                              <div
                                className={cn(
                                  `hover:cursor-pointer text-center transform transition-transform duration-300 ${
                                    openRows.includes(row.id)
                                      ? "rotate-90"
                                      : "rotate-0"
                                  }`,
                                )}
                              >
                                ▶
                              </div>
                            </div>
                          </CollapsibleTrigger>
                        </TableCell>
                      </TableRow>
                      <CollapsibleContent asChild>
                        <TableRow>
                          <TableCell
                            colSpan={row.getVisibleCells().length}
                            className="p-4"
                          >
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-center">
                                    Title
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Status
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Duration
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {
                                  //@ts-ignore
                                  data[row.id].results
                                    ? //@ts-ignore
                                      data[row.id].results.map(
                                        (d: TperTestResults, index: number) => {
                                          return (
                                            <TableRow key={index}>
                                              <TableCell className="font-medium">
                                                {d.title}
                                              </TableCell>

                                              <TableCell className="font-medium text-center">
                                                {d.status}
                                              </TableCell>

                                              <TableCell className="font-medium text-center">
                                                {d.duration}
                                              </TableCell>
                                            </TableRow>
                                          );
                                        },
                                      )
                                    : "Running Tests..."
                                }
                              </TableBody>
                            </Table>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
