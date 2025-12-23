import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
            <div className="max-w-4xl w-full p-8 text-center">
                <h1 className="text-5xl font-bold text-navy mb-6">FindMyLawyer</h1>
                <p className="text-xl text-gray-600 mb-10">
                    Connect with usage verified legal experts or grow your practice.
                </p>

                <div className="flex flex-col md:flex-row gap-6 justify-center">
                    <Link
                        to="/register/client"
                        className="px-8 py-4 bg-navy text-white text-lg font-semibold rounded-lg hover:bg-opacity-90 transition shadow-lg"
                    >
                        Register as Client
                    </Link>
                    <Link
                        to="/register/lawyer"
                        className="px-8 py-4 bg-copper text-white text-lg font-semibold rounded-lg hover:bg-opacity-90 transition shadow-lg"
                    >
                        Register as Lawyer
                    </Link>
                </div>

                <div className="mt-12">
                    <Link to="/login" className="text-navy font-semibold hover:underline">
                        Already have an account? Login here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
