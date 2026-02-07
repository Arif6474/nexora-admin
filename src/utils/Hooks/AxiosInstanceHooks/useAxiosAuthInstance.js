import axios from "axios";
import { useMemo } from "react";

function useAxiosAuthInstance() {

    const axiosAuthInstance = useMemo(() => axios.create({

        baseURL: import.meta.env.VITE_REACT_APP_BACKEND_URL + 'api/employeeApp/public/auth/',

    }), [])

    return axiosAuthInstance;
}

export default useAxiosAuthInstance;