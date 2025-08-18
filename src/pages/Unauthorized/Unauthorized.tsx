import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { Button } from "../../components/ui/Button";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
            {/* Icon */}
            <FaLock className="text-red-500 text-7xl mb-6" />

            {/* Title */}
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
                Unauthorized
            </h1>

            {/* Message */}
            <p className="text-lg text-gray-600 mb-8">
                You don’t have permission to access this page.
            </p>

            {/* Actions */}
            <div className="flex gap-4">
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </Button>

                <Button
                    className="cursor-pointer text-white bg-gray-400 outline-neutral-900"
                    variant="destructive"
                    size={'default'}
                    onClick={() => navigate("/login")}
                >
                    Login
                </Button>
            </div>
        </div>
    );
};

export default Unauthorized;
