import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import HomeLayout from './home';
import Breadcrumb from './components/Breadcrumbs/Breadcrumb';
import PrivateRoute from './components/PrivateRoute';
import Employees from './pages/Employee/Employee';
import AddEditEmployees from './pages/Employee/AddEditEmployee';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import ECommerce from './pages/Dashboard/ECommerce';

function LayoutWithHomeLayout({ children, pageTitle }: {
  children: React.ReactNode;
  pageTitle: string
}) {
  return (
    <HomeLayout>
      <Breadcrumb pageName={pageTitle} />
      <div className="flex flex-col gap-10">{children}</div>
    </HomeLayout>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />

      {/* Private route */}
      <Route element={<PrivateRoute />}>

      <Route
          path="/"
          element={
            <>
              <PageTitle title="eCommerce Dashboard" />
              <ECommerce />
            </>
          }
        />

        <Route path="/employees" element={<Employees />} />
        <Route
          path="/employees/addemployee"
          element={
            <LayoutWithHomeLayout pageTitle="Add Employee">
              <AddEditEmployees />
            </LayoutWithHomeLayout>
          }
        />
        <Route
          path="/employees/editemployee"
          element={
            <LayoutWithHomeLayout pageTitle="Edit Employee">
              <AddEditEmployees />
            </LayoutWithHomeLayout>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;