/* eslint-disable no-undef */
import axios from "axios";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectEmployee } from "../../../redux/features/auth/authSelectors";

function useAxiosInstance() {

    const employee = useSelector(selectEmployee);


    const axiosInstance = useMemo(() => axios.create({
        baseURL: import.meta.env.VITE_REACT_APP_BACKEND_URL + 'api/employeeApp/protected/',
        headers: {
            'Authorization': 'Bearer ' + employee?.token
        }
    }), [employee?.token])

    return axiosInstance
}

export default useAxiosInstance;