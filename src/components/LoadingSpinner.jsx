export default function LoadingSpinner({ text = "Loading..." }) {
    return (
        <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-500">{text}</p>
        </div>
    );
}
