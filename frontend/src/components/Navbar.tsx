    import { Link } from 'react-router-dom';

    const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between">
            <Link to="/" className="text-white text-lg font-bold">SIF-FABLAB</Link>
            <div className="flex space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
            <Link to="/about" className="text-gray-300 hover:text-white">About</Link>
            <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
            </div>
        </div>
        </nav>
    );
    };

    export default Navbar;
