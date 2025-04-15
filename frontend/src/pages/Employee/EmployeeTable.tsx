"use client"

import { useEffect, useState } from 'react';
import MUIDataTable, {
    MUIDataTableColumnDef,
    MUIDataTableMeta,
    MUIDataTableOptions
} from "mui-datatables";
import { IconButton, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faMinusCircle, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import { Add } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import handleDelete from '../../components/Generic/AJAX/Delete';
import Spinner from '../../components/Generic/Spinner';
import Swal from 'sweetalert2';
import fetchData from '../../components/Generic/AJAX/FetchData';
import { EmployeesDTO } from '../../DTO/EmployeeDto';

const EmployeesTable = (props:any) => {
    const navigate = useNavigate()
    const [addClicked, setAddClicked] = useState(true);
    const [employees, setEmployees] = useState<EmployeesDTO[]>([]);
    const [isDeleteChanged, setIsDeleteChanged] = useState(0);
    const [loading, setLoading] = useState(false);

    // const [companyChanged,setCompanyChanged] = useState(false);
    const fetchEmployees = async () => {
        setLoading(true);
        const res = await fetchData('users')
        setLoading(false);
        return await res;
    }
    // useEffect(() => {
    //     // Disable pointer events on the overlay to prevent clicks from closing the modal
    //     const modalOverlay : any = document.querySelector('.modal-overlay');
    //     if (modalOverlay) {
    //         modalOverlay.style.pointerEvents = 'none';
    //     }

    //     // Cleanup function
    //     return () => {
    //         if (modalOverlay) {
    //             modalOverlay.style.pointerEvents = 'auto'; // Re-enable pointer events when the component unmounts
    //         }
    //     };
    // }, []);
    useEffect(() => {
        fetchEmployees()
            .then(data => {
                setEmployees(data.items);
                // setCompanyChanged(false);
            });
    }, [isDeleteChanged]);

    const HeaderElements = () => (
        <>
            <span>
                <Tooltip title="Add Employees" aria-label="Apply default filters">
                    <IconButton onClick={() => {
                        navigate('/employees/addemployee')
                    }}>
                        <Add />
                    </IconButton>
                </Tooltip>
            </span>
        </>
    );

    const options: MUIDataTableOptions = {
        elevation: 0,
        filter: true,
        filterType: 'multiselect',
        responsive: 'standard',
        expandableRows: false,
        expandableRowsHeader: false,
        expandableRowsOnClick: false,
        selectableRowsHeader: true,
        selectableRows: 'multiple',
        selectableRowsHideCheckboxes: true,
        selectToolbarPlacement: 'above',
        enableNestedDataAccess: '.',
        downloadOptions: {
            filename: 'users.csv',
            separator: ',',
            filterOptions: {
                useDisplayedColumnsOnly: true,
                useDisplayedRowsOnly: true
            }
        },
        setRowProps: (row, dataIndex, rowIndex) => {
            return {
                style: {
                    backgroundColor: rowIndex % 2 === 0 ? '#d3d3d347' : '#fff',
                },
            };
        },

        customToolbar: () => (
            <HeaderElements />
        ),
    };


    const columns: MUIDataTableColumnDef[] = [
        {
            label: "id",
            name: "_d",
            options: {
                display:false,
                filter: true,
            }
        },
        {
            label: "Name",
            name: "name",
            options: {
                filter: true,
            }
        },
        {
            label: "Email",
            name: "email",
            options: {
                filter: true,
            }
        },
        {
            label: "Phone",
            name: "phone",
            options: {
                filter: true,
            }
        },
        {
            label: "Created At",
            name: "createdAt",
            options: {
                filter: true,
                customBodyRender: (value) => {
                    return new Date(value).toLocaleDateString() + " " + new Date(value).toLocaleTimeString();
                }
            }
        },
        {
            name: "",
            options: {
                filter: false,
                customBodyRender: (value, tableMeta: MUIDataTableMeta, updateValue) => (
                    <div className="flex-row space-x-4">
                        <Tooltip title="Edit Slot">
                          <button onClick={() => {
                                const employeeId = employees[tableMeta.rowIndex]._id;
                                navigate(`/employees/editemployee?id=${employeeId}`)
                          }
                          }>
                              <FontAwesomeIcon icon={faEdit}
                              /></button>
                      </Tooltip>
                      <Tooltip title="Delete Course Detail">
                        <button onClick={async () => {
                            const empId = employees[tableMeta.rowIndex]._id;
                            await handleDelete(empId, employees[tableMeta.rowIndex]._id, `users`, () => {
                                setIsDeleteChanged(isDeleteChanged + 1);
                            },employees[tableMeta.rowIndex].name);
                        }}>
                            <FontAwesomeIcon icon={faMinusCircle} style={{ color: "#de6363" }} />
                        </button>
                    </Tooltip>
                    </div>
                )
            }
        },
    ];


    return (
        <div style={{paddingLeft:'5px'}}>
            <Spinner loading={loading}></Spinner>
            <MUIDataTable
                title={``}
                data={employees}
                columns={columns}
                options={options}
            />
        </div>
    );
};

export default EmployeesTable;
