import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-4xl mx-auto text-center py-20">
                <h1 className="text-6xl md:text-7xl font-extrabold text-navy mb-6 tracking-tight">FindMyLawyer</h1>

                <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                    Connect with usage verified legal experts or grow your practice.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link
                        to="/register/client"
                        className="inline-block px-12 py-4 bg-navy text-white text-lg font-semibold rounded-2xl shadow-md transform transition duration-200 ease-out hover:scale-105 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200"
                    >
                        Register as Client
                    </Link>

                    <Link
                        to="/register/lawyer"
                        className="inline-block px-12 py-4 bg-copper text-white text-lg font-semibold rounded-2xl shadow-md transform transition duration-200 ease-out hover:scale-105 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200"
                    >
                        Register as Lawyer
                    </Link>
                </div>

                <div className="mt-12 text-center">
                    <span className="text-gray-700 mr-2">Already have an account?</span>
                    <Link to="/login" className="text-navy font-semibold hover:underline underline-offset-2">
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
