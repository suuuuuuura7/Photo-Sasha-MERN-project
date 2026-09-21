import { CalendarCog, Images, LogOut, SidebarOpen, Star, Users, X } from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import Logo from '../components/Logo'

const navItems = [
    { label: 'Users', to: '/admin/users', icon: Users },
    { label: 'Bookings', to: '/admin/bookings', icon: CalendarCog },
    { label: 'Gallery', to: '/admin/gallery', icon: Images },
    { label: 'Reviews', to: '/admin/reviews', icon: Star },
];

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className='min-h-screen bg-darkBase flex relative'>
            {/* Mobile Overlay bg */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-darkSurface border-r border-gray-800 flex flex-col shrink-0 transition-transform duration-300 md:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:w-20 lg:w-64'}
            `}>
                <div className="flex items-center justify-between md:justify-center lg:justify-start h-20 p-4 border-b border-gray-800 shrink-0">
                    <Link to="/" className={`flex items-center gap-2 ${!isMobileMenuOpen ? 'md:hidden lg:flex' : 'flex'}`}>
                            <div>
                                <Logo size={20} />
                            </div>
                        <span className='text-white font-serif font-bold text-xl '>
                            
                            Photo<span className="text-brandRed">Sasha</span>
                        </span>
                    </Link>
                    
                    {/* Collapsed logo for tablet */}
                    <Link to="/" className={`hidden ${!isMobileMenuOpen ? 'md:flex lg:hidden' : 'hidden'} items-center justify-center`}>
                        
                        <Logo size={20} />
                    </Link>

                    {/* Close button for mobile */}
                    <button
                        className="md:hidden text-gray-400 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className='flex-1 overflow-y-auto py-4 px-2 md:px-3 lg:px-4 space-y-2'>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.to);
                        return (
                            <Link
                                key={item.label}
                                to={item.to}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg font-serif text-sm transition-colors ${isActive
                                    ? 'bg-brandRed/10 text-brandRed'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                    } ${!isMobileMenuOpen ? 'md:justify-center lg:justify-start' : 'justify-start'}`}
                                title={item.label}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span className={`font-medium ${!isMobileMenuOpen ? 'md:hidden lg:block' : 'block'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800 shrink-0">
                    <div className={`mb-4 flex-col gap-1 ${!isMobileMenuOpen ? 'md:hidden lg:flex' : 'flex'}`}>
                        <span className="text-white text-sm font-serif font-semibold truncate">{user?.name || "Admin"}</span>
                        <span className="text-gray-500 text-xs truncate">{user?.email || "admin@example.com"}</span>
                    </div>
                    <button
                        onClick={logout}
                        className={`flex items-center gap-3 text-brandRed hover:text-red-400 transition-colors w-full px-3 py-2 rounded-lg hover:bg-red-500/10 ${!isMobileMenuOpen ? 'md:justify-center lg:justify-start' : 'justify-start'}`}
                        title="Logout"
                    >
                        <LogOut className='w-5 h-5 shrink-0' />
                        <span className={`font-medium ${!isMobileMenuOpen ? 'md:hidden lg:inline-block' : 'inline-block'}`}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            {/* Page content rendered here */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between h-16 px-4 bg-darkSurface border-b border-gray-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="text-gray-400 hover:text-white focus:outline-none"
                        >
                            <SidebarOpen className="w-4 h-4" />
                        </button>
                        <span className='text-white font-serif font-bold text-lg'>
                            Admin<span className="text-brandRed">Panel</span>
                        </span>
                    </div>
                    <button onClick={logout} className="text-brandRed">
                        <LogOut className="w-5 h-5" />
                    </button>
                </header>

                <div className="flex-1 overflow-auto bg-darkBase p-4 md:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;


