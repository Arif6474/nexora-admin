

export const saveEmployeeDataToLocalStorage = (employee) => {
  localStorage.setItem('employee', JSON.stringify(employee));

};

export const loadEmployeeDataToLocalStorage = () => {
  const data = localStorage.getItem('employee');
  return data ? JSON.parse(data) : null;
};

export const removeEmployeeDataFromLocalStorage = () => {
  localStorage.removeItem('employee');
};