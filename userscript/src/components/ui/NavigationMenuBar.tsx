
import { House, MagnifyingGlass, Plus, Heart, User } from "phosphor-react";
import { NavLink } from "react-router-dom";


export function NavigationMenuBar() {
  const iconProps = { size: 16 };
  return (
    <nav className="ppm:absolute ppm:bottom-0 ppm:left-0 ppm:w-full ppm:bg-white ppm:border-t ppm:flex ppm:justify-between ppm:items-center ppm:px-4 ppm:py-5 ppm:z-50">
      <NavLink to="/home" className="ppm:flex-1 ppm:flex ppm:justify-center" title="Home">
        {({ isActive }) => <House {...iconProps} color={isActive ? '#000' : '#888'} weight={isActive ? 'fill' : 'regular'} />}
      </NavLink>
      <NavLink to="/find" className="ppm:flex-1 ppm:flex ppm:justify-center" title="Buscar">
        {({ isActive }) => <MagnifyingGlass {...iconProps} color={isActive ? '#000' : '#888'} weight={isActive ? 'fill' : 'regular'} />}
      </NavLink>
      <NavLink to="/add-post" className="ppm:flex-1 ppm:flex ppm:justify-center" title="Adicionar">
        {({ isActive }) => <Plus {...iconProps} color={isActive ? '#000' : '#888'} weight={isActive ? 'fill' : 'regular'} />}
      </NavLink>
      <NavLink to="/favorites" className="ppm:flex-1 ppm:flex ppm:justify-center" title="Favoritos">
        {({ isActive }) => <Heart {...iconProps} color={isActive ? '#000' : '#888'} weight={isActive ? 'fill' : 'regular'} />}
      </NavLink>
      <NavLink to="/profile" className="ppm:flex-1 ppm:flex ppm:justify-center" title="Perfil">
        {({ isActive }) => <User {...iconProps} color={isActive ? '#000' : '#888'} weight={isActive ? 'fill' : 'regular'} />}
      </NavLink>
    </nav>
  );
} 