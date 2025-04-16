"use client"
import { Button } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import GenericInput from "../../components/Generic/Input";
import Spinner from "../../components/Generic/Spinner";
import mutateData from "../../components/Generic/AJAX/MutateData";
import fetchData from "../../components/Generic/AJAX/FetchData";
import { EmployeesDTO } from "../../DTO/EmployeeDto";

interface EmployeeFormData {
    _id?: string,
    name: string,
    password: string,
    email: string,
    phone: string,
}

const AddEditEmployees = () => {
    const [loading, setLoading] = useState(false);
    const [isEditPage, seIsEditPage] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({
        length: false,
        letter: false,
        number: false,
        specialChar: false,
    });

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editPageSlots: any = searchParams.get('id');

    const [employeesData, setEmployeesData] = useState<EmployeeFormData>({
        _id: "0",
        password: "",
        name: "",
        phone: "",
        email: "",
    });

    const validatePassword = (password: string) => {
        const length = password?.length >= 8;
        const letter = /[a-zA-Z]/.test(password);
        const number = /[0-9]/.test(password);
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        setPasswordErrors({ length, letter, number, specialChar });
        return length && letter && number && specialChar;
    };

    const employeesHandleChange = (event: any) => {
        const { name, value, checked, type } = event.target;
        const updatedValue = type !== "checkbox" ? value : checked;
        setEmployeesData({ ...employeesData, [name]: updatedValue });

        if (name === "password") {
            validatePassword(value);
        }
    };

    const currentEditEmployeeData: any = async () => {
        seIsEditPage(true);
        setLoading(true);
        const req = await fetchData('users', editPageSlots)
        const employee: EmployeesDTO = await req;
        if (employee._id) {
            setEmployeesData({
                ...employeesData,
                _id: employee._id,
                name: employee.name,
                email: employee.email,
                phone: employee.phone.split('+2')[1],
                password: employee.password
            })
            validatePassword(employee.password); // Validate pre-filled password
            setLoading(false);
        }
    }

    useEffect(() => {
        if (editPageSlots?.length > 0) {
            currentEditEmployeeData();
        }
    }, [])

    const onSubmitEmployees = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const { password } = employeesData;
    
        const errors = [];
        if (password?.length < 8) errors.push("At least 8 characters");
        if (!/[a-zA-Z]/.test(password)) errors.push("Includes at least one letter");
        if (!/[0-9]/.test(password)) errors.push("Includes at least one number");
        if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) errors.push("Includes at least one special character");
    
        if (errors?.length > 0) {
            Swal.fire({
                title: "Password Requirements",
                html: `<ul style="text-align: left; font-size: 14px;">
                        ${errors.map(err => `<li>❌ ${err}</li>`).join("")}
                       </ul>`,
                icon: "info",
            });
            return;
        }
    
        try {
            if (!isEditPage) {
                if (employeesData.name?.length) {
                    delete employeesData._id;
                    employeesData.phone = `+2${employeesData.phone}`;
                    const employee = JSON.stringify(employeesData);
                    const employeeRes = await mutateData(employee, 'users', "POST");
                    if (employeeRes._id) {
                        navigate('/employees');
                    }
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Employee data must be provided",
                        icon: "error"
                    });
                }
            } else {
                if (employeesData._id && employeesData._id.length > 0) {
                    employeesData.phone = `+2${employeesData.phone}`;
                    const employee = JSON.stringify(employeesData);
                    const employeeRes = await mutateData(employee, `users/${editPageSlots}`, "PATCH", "users");
                    if (employeeRes._id) {
                        Swal.fire({
                            title: "Success",
                            text: "Employee data updated successfully",
                            icon: 'success'
                        });
                        navigate('/employees');
                    }
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Employee data must be provided",
                        icon: "error"
                    });
                }
            }
        } catch (error: any) {
            console.log('Add employee error', error);
        }
    };
    
    return (
        <>
            <Spinner loading={loading}></Spinner>
            <div className='add-employee'>
                <div className='container'>
                    <div className='row'>
                        <div className='company-card'>
                            <form className='d-flex flex-column gap-15'>
                                <div className="md:grid lg:grid grid-cols-2 gap-2">
                                    <GenericInput
                                        label={"Employee Name"}
                                        name={"name"}
                                        placeholder={"Enter Employee Name"}
                                        value={employeesData.name}
                                        onChange={employeesHandleChange}
                                    />
                                    <div>
                                    <GenericInput
                                        label={"Password"}
                                        name={"password"}
                                        type="password"
                                        placeholder={"Enter Employee Password"}
                                        value={employeesData.password}
                                        onChange={employeesHandleChange}
                                    />
                                    </div>
                                    <GenericInput
                                        label={"Mobile"}
                                        name={"phone"}
                                        placeholder={"Enter Phone"}
                                        value={employeesData.phone}
                                        onChange={employeesHandleChange}
                                    />
                                    <GenericInput
                                        label={"Email"}
                                        name={"email"}
                                        placeholder={"Enter Email"}
                                        value={employeesData.email}
                                        onChange={employeesHandleChange}
                                    />
                                </div>
                                <br />
                                <Button
                                    variant="contained"
                                    className="btn-save"
                                    onClick={(e) => onSubmitEmployees(e)}
                                >
                                    Save
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddEditEmployees;
