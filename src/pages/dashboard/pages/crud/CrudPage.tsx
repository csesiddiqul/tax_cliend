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

import { useGetCrudsQuery, useDeleteCrudMutation } from "../../../../redux/api/crudsApi";
import Create from "./Create";
import Edit from "./Edit";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const TblPropUseIdPage = () => {

    // Separate states for Create and Edit modals
    const [showCreateModal, setShowCreateModal] = useState(false);
 
 
   

 

    return (
        <Container fluid className="p-4">

            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Tbl Prop Use Id List</li>
                </ol>
            </nav>

            <Card className="p-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h4>Tbl Prop Types List</h4>
                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                        <Plus size={23} strokeWidth={2} className="" />   Add Tbl Prop Use Id
                    </Button>
                </div>


                {/* Create Modal */}
                <Create show={showCreateModal} handleClose={() => setShowCreateModal(false)} />



            </Card>
        </Container>
    );
};

export default TblPropUseIdPage;
