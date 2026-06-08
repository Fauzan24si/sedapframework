import { BsDatabaseExclamation } from "react-icons/bs";

export default function EmptyState({ text = "Belum ada data" }) {
    return (
        <div className="p-8 text-center text-gray-500">
            <div className="flex justify-center mb-4">
                <BsDatabaseExclamation className="text-6xl text-gray-400" />
            </div>
            <p className="text-sm">{text}</p>
        </div>
    );
}
