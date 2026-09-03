import { NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import InfoIcon from '@mui/icons-material/Info';
import BarChartIcon from '@mui/icons-material/BarChart';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';


export function Navbar() {
    return (
        <div className="h-full w-16 bg-white border-r border-gray-200 flex flex-col items-center py-5 shadow-sm">
            <ul className="flex flex-col space-y-5 pt-2 items-center w-full">
                <li title="Home"><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}><HomeIcon /></NavLink></li>
                <li title="Menu"><NavLink to="/menu" className={({ isActive }) => isActive ? 'active' : ''}><MenuIcon /></NavLink></li>
                <li title="Search"><NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}><SearchIcon /></NavLink></li>
                <li title="Chat"><NavLink to="/chat" className={({ isActive }) => isActive ? 'active' : ''}><ChatIcon /></NavLink></li>
                <li title="Info"><NavLink to="/info" className={({ isActive }) => isActive ? 'active' : ''}><InfoIcon /></NavLink></li>
                <li title="Bar Chart"><NavLink to="/bar-chart" className={({ isActive }) => isActive ? 'active' : ''}><BarChartIcon /></NavLink></li>
                <li title="Auto Graph"><NavLink to="/auto-graph" className={({ isActive }) => isActive ? 'active' : ''}><AutoGraphIcon /></NavLink></li>
                <li title="Users"><NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}><GroupIcon /></NavLink></li>
                <li title="Settings"><NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}><SettingsIcon /></NavLink></li>
            </ul>
        </div>
    )
}
