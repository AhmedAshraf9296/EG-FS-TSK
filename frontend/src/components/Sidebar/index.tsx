import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/easygenerator_logo.png';
import { faArrowLeft, faArrowRight, faBars, faCalendarCheck, faCodeBranch, faEdit, faFileAlt, faFileInvoiceDollar, faGraduationCap, faGuitar, faMinusCircle, faPersonChalkboard, faSackDollar, faScroll, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);
  const displayStyle = !sidebarOpen ? { display: "none" } : { display: "" }
  return (
    <>
      <aside
        ref={sidebar}
        style={{...displayStyle}}
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-sec duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <NavLink to="/">
            <img src={Logo} alt="Logo" style={{
              width: '160px',
              // marginBottom: '-10px',
              marginTop:'-10px',
              marginBottom:'-50px',
              height: 'auto',
              marginLeft: '50px'
            }} />
          </NavLink>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            {/* <!-- Menu Group --> */}
            <div>
              <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                  <NavLink
                    to="/employees"
                    style={{borderRadius:'9px'}}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium dark:text-gray-400 duration-300 ease-in-out hover:bg-[#FAEBD7] dark:hover:bg-meta-4 ${pathname.includes('employees') && 'bg-[#E45252] dark:bg-meta-4'
                      }`}
                  >
                    <FontAwesomeIcon icon={faSackDollar} />
                    Employees
                  </NavLink>
                </li>
                {/* <!-- Menu Item Profile --> */}
              </ul>
            </div>
          </nav>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-sec bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
