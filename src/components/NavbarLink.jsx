import { Link, useLocation } from 'react-router-dom';

const NavbarLink = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
<Link
  to={to}
  className={`relative z-10 px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base
    rounded-full transition-colors truncate ${
      isActive
        ? 'bg-[#d6e8fc] text-[#34495E] font-semibold'
        : 'text-[#34495E] hover:bg-[#f0f4f8] dark:text-gray-300 dark:hover:bg-blue-800'
    }`}
>
  {label}
</Link>

  );
};

export default NavbarLink;
