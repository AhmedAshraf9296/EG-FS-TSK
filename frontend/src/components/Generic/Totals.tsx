"use client"
import { Button } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import GenericInput from "./Input";
import Spinner from "./Spinner";
import mutateData from "./AJAX/MutateData";
import fetchData from "./AJAX/FetchData";
import GenericDropdown from "./Dropdown";

interface TotalsData {
    noOfSessions?: number,
    CoursePrice: number,
    TotalPaid:number,
    OutstandingAmount:number,
}

const Totals = (props:TotalsData) => {
    const [totals, setTotals] = useState<TotalsData>({
        noOfSessions: 0,
        CoursePrice: 0,
        TotalPaid:0,
        OutstandingAmount:0
    });


    const totalsHandleChange = (event: any) => {
        const { name, value, checked, type } = event.target;
        setTotals({ ...totals, [name]: type != "checkbox" ? value : checked });
    };
 
    return (
        <>
        <div style={{marginTop:"-20px"}}></div>
            <div className='add-group'>
                <div className='container'>
                    <div className='row'>
                        <div className='company-card'>
                            <form className='d-flex flex-column gap-15'>
                                <div className="md:grid lg:grid grid-cols-4 gap-2">
                                    <GenericInput
                                        label={"Total No Of Sessions"}
                                        name={"noOfSessions"}
                                        placeholder={""}
                                        disabled={true}
                                        value={props.noOfSessions}
                                        onChange={totalsHandleChange}
                                    />
                                    <GenericInput
                                        label={"Total Course Price"}
                                        name={"CoursePrice"}
                                        placeholder={""}
                                        disabled={true}
                                        value={props.CoursePrice}
                                        onChange={totalsHandleChange}
                                    />
                                    <GenericInput
                                        label={"Total Paid"}
                                        name={"TotalPaid"}
                                        placeholder={""}
                                        disabled={true}
                                        value={props.TotalPaid}
                                        onChange={totalsHandleChange}
                                    />
                                    <GenericInput
                                        label={"Total Outstanding Amount"}
                                        name={"OutstandingAmount"}
                                        placeholder={""}
                                        disabled={true}
                                        value={props.OutstandingAmount}
                                        onChange={totalsHandleChange}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        <div style={{height:"20px"}}></div>

        </>
    );
};

export default Totals;
