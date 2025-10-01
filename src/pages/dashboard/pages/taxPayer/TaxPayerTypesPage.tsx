import React, { useState, useMemo } from "react";
import { Container, Card, Button, Form, Spinner } from "react-bootstrap";
import { Plus } from "react-feather";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
} from "@tanstack/react-table";

import { useGetTaxPayerTypesQuery, useDeleteTaxPayerTypeMutation } from "../../../../redux/api/taxpayerTypeApi";
import Create from "./TaxPayerCreate";
import Edit from "./Edit";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const TaxPayerTypesPage = () => {
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    // Separate states for Create and Edit modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingTaxpayerType, setEditingTaxpayerType] = useState<any>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [deleteTaxpayerType] = useDeleteTaxPayerTypeMutation();
    const { data, isLoading, error, refetch } = useGetTaxPayerTypesQuery({
        perPage,
        page: currentPage,
        search,
    });
    const tblPropUseId: any = data?.data || [];
    const meta = data?.meta;
    const columns = useMemo(
        () => [
            {
                accessorKey: "SL",
                header: () => <span style={{ fontSize: "16px", fontWeight: "bold" }}>SL</span>,
                cell: ({ row }: any) => row.index + 1,
            },
            {
                accessorKey: "TaxpayerTypeID",
                header: () => <span style={{ fontSize: "16px", fontWeight: "bold" }}>TaxpayerTypeID</span>,

            },
            {
                accessorKey: "TaxpayerType",
                header: () => <span style={{ fontSize: "16px", fontWeight: "bold" }}>TaxpayerType</span>,
                cell: (info: any) => <span className="fw-bold">{info.getValue()}</span>,
            },

            {
                id: "actions",
                header: () => <span className="fw-bold">Actions</span>,
                cell: ({ row }: any) => (
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => setEditingTaxpayerType(row.original)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(row.original)}
                        >
                            Delete
                        </Button>
                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: tblPropUseId,
        columns,
        state: { sorting, columnFilters, columnVisibility },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        initialState: { pagination: { pageIndex: 0, pageSize: perPage } },
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handleDelete = async (tbl_PropType: any) => {
        if (!tbl_PropType) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Do you want to delete "${tbl_PropType.PropertyUse}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                await deleteTaxpayerType(tbl_PropType.TaxpayerTypeID).unwrap();
                Swal.fire({
                    icon: "success",
                    title: "Deleted",
                    text: `data has been deleted.`,
                });
            } catch (err: any) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to delete the tbl_PropType.",
                });
            }
        }
    };

    if (isLoading)
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status" size="sm" />
                <span className="m-1"> Loading...</span>
            </div>
        );

    if (error) return <div>Error fetching data!</div>;

    return (
        <Container fluid className="p-4">

            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Tax Payer Type List</li>
                </ol>
            </nav>

            <Card className="p-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h4>Tax Payer Type List</h4>
                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                        <Plus size={23} strokeWidth={2} className="" />   Add Tax Payer Type
                    </Button>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <Form.Select value={perPage} onChange={handlePerPageChange} style={{ width: 150 }}>
                        {[5, 10, 25].map((n) => (
                            <option key={n} value={n}>
                                Show {n}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Control
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={handleSearchChange}
                        style={{ width: 250 }}
                    />
                </div>

                {/* Edit Modal */}
                {editingTaxpayerType && (
                    <Edit
                        show={!!editingTaxpayerType}
                        handleClose={() => setEditingTaxpayerType(null)}
                        TaxpayerType={editingTaxpayerType}
                        refetch={refetch}
                    />
                )}

                {/* Create Modal */}
                <Create show={showCreateModal} handleClose={() => setShowCreateModal(false)} />

                <div className="table-responsive">
                    <table className="table align-middle table-hover">
                        <thead className="table-light">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="text-center">
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
                    {/* Showing entries */}
                    <div className="text-muted tex-sm mb-2 mb-md-0 ">
                        Showing {meta?.from} to {meta?.to} of {meta?.total} entries
                    </div>

                    {/* Pagination buttons */}
                    <div className="d-flex flex-wrap justify-content-center gap-2" role="group" aria-label="Pagination">
                        {meta?.links.map((link, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`btn btn-sm ${link.active ? "btn-primary" : "btn-outline-secondary"}`}
                                onClick={() => {
                                    if (link.url) {
                                        const page = new URL(link.url).searchParams.get("page");
                                        handlePageChange(Number(page));
                                    }
                                }}
                                disabled={!link.url}
                            >
                                {link.label
                                    .replace(/&laquo;/g, "<<")
                                    .replace(/&raquo;/g, ">>")
                                    .trim()}
                            </button>
                        ))}
                    </div>

                </div>


            </Card>
        </Container>
    );
};

export default TaxPayerTypesPage;
