import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-gray-800 text-white p-4">
            <ul className="flex gap-6">
                <li>
                    <Link to="/" className="hover:underline">
                        Lagerhäuser
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
