import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import Container from "../../components/Container";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notesAPI } from "../../services/notesAPI";
import AlertBox from "../../components/AlertBox";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingList, setLoadingList] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [dataForm, setDataForm] = useState({
        title: "",
        content: "",
        status: ""
    });

    // Handle perubahan nilai input form
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({
            ...dataForm,
            [name]: value,
        });
    };

    // Handle form submission for creating notes
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");
            
            await notesAPI.createNote(dataForm);

            setSuccess("Catatan berhasil ditambahkan!");

            // Kosongkan form setelah success
            setDataForm({ title: "", content: "", status: "" });

            // Hilangkan pesan success setelah 3 detik
            setTimeout(() => setSuccess(""), 3000);

            // Panggil ulang loadNotes untuk refresh data
            loadNotes();

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Terjadi kesalahan';
            setError(`Terjadi kesalahan: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    // Load data saat pertama di-render
    useEffect(() => {
        loadNotes();
    }, []);

    // Memanggil fetchNotes beserta error/loading handling
    const loadNotes = async () => {
        try {
            setLoadingList(true);
            setError("");
            const data = await notesAPI.fetchNotes();
            setNotes(data);
        } catch (err) {
            setError("Gagal memuat catatan");
        } finally {
            setLoadingList(false);
        }
    };

    // Handle untuk aksi hapus data
    const handleDelete = async (id) => {
        const konfirmasi = confirm("Yakin ingin menghapus catatan ini?");
        if (!konfirmasi) return;

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await notesAPI.deleteNote(id);

            // Refresh data
            loadNotes();

        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <PageHeader
                title="Notes"
                breadcrumb="Dashboard / Notes"
            />

            <div className="mt-6 flex items-center justify-between">
                <p className="text-gray-600">
                    Kelola catatan dan ide kamu disini
                </p>
            </div>

            {/* Form Tambah Catatan */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Tambah Catatan Baru</CardTitle>
                    <CardDescription>
                        Isi form di bawah untuk menambahkan catatan baru
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <CardContent>
                        {error && <AlertBox type="error">{error}</AlertBox>}
                        {success && <AlertBox type="success">{success}</AlertBox>}
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Judul catatan
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={dataForm.title}
                                    onChange={handleChange}
                                    placeholder="Judul catatan"
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                    Isi catatan
                                </label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={dataForm.content}
                                    onChange={handleChange}
                                    placeholder="Isi catatan"
                                    rows="4"
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <input
                                    type="text"
                                    id="status"
                                    name="status"
                                    value={dataForm.status}
                                    onChange={handleChange}
                                    placeholder="Status (Work, Personal, Ideas, dll)"
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {loading ? "Mohon Tunggu..." : "Tambah Data"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {/* Notes Table */}
            <div className="mt-10 bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Daftar Catatan ({notes.length})
                    </h3>
                </div>

                {loadingList && (
                    <div className="p-12">
                        <LoadingSpinner text="Memuat catatan..." />
                    </div>
                )}

                {!loadingList && notes.length === 0 && !error && (
                    <div className="p-12">
                        <EmptyState text="Belum ada catatan. Tambah catatan pertama!" />
                    </div>
                )}

                {!loadingList && notes.length === 0 && error && (
                    <div className="p-12">
                        <EmptyState text="Terjadi kesalahan. Coba lagi nanti." />
                    </div>
                )}

                {!loadingList && notes.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-green-600 to-green-500 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold w-16">No</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Judul</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Isi Catatan</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold w-32">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold w-40">Tanggal</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold w-48">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {notes.map((note, index) => (
                                    <tr key={note.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-700 font-medium text-center">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 line-clamp-2">
                                                {note.title}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600 line-clamp-2 max-w-md">
                                                {note.content}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {note.status ? (
                                                <Badge variant="secondary" className="text-xs">
                                                    {note.status}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {note.created_at ? new Date(note.created_at).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            }) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button size="sm" variant="outline" className="h-8 px-3">
                                                    Edit
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="destructive" 
                                                    className="h-8 px-3"
                                                    onClick={() => handleDelete(note.id)}
                                                    disabled={loading}
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Catatan Penting
                </h3>
                <p className="text-gray-600 text-sm">
                    Gunakan halaman Notes untuk menyimpan ide, todo list, meeting notes, dan catatan penting lainnya. 
                    Kamu bisa kategorikan notes dan mengelolanya dengan mudah.
                </p>
            </div>
        </Container>
    );
}
