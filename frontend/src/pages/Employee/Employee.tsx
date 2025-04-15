import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import HomeLayout from '../../home';
import EmployeesTable from './EmployeeTable';

const Employees = () => {
  return (
    <HomeLayout>
      <Breadcrumb pageName="Employee" />
      <div className="flex flex-col gap-10">
        <EmployeesTable/>
      </div>
    </HomeLayout>
  );
};

export default Employees;
