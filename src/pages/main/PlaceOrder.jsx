import { useState, useEffect } from "react";
import { FaShoppingCart, FaPlus, FaMinus, FaTrash, FaCheckCircle } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../contexts/AuthContext";
import { productsAPI, ordersAPI, getDiscountPercent, calculatePointsEarned } from "../../services/api";

export default function PlaceOrder() {
    const { profile, refreshProfile } = useAuth();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]); // [{ product, quantity }]
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await productsAPI.fetchAll();
                setProducts(data.filter(p => p.stock > 0));
            } catch (err) {
                console.error('Error loading products:', err);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const addToCart = (product) => {
        const existing = cart.find(item => item.product.id === product.id);
        if (existing) {
            if (existing.quantity >= product.stock) return;
            setCart(cart.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { product, quantity: 1 }]);
        }
    };

    const updateQuantity = (productId, delta) => {
        setCart(cart.map(item => {
            if (item.product.id === productId) {
                const newQty = item.quantity + delta;
                if (newQty <= 0) return null;
                if (newQty > item.product.stock) return item;
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(Boolean));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.product.id !== productId));
    };

    // Calculate totals
    const totalAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discountPercent = getDiscountPercent(profile?.tier);
    const discountAmount = totalAmount * (discountPercent / 100);
    const finalAmount = totalAmount - discountAmount;
    const pointsEarned = calculatePointsEarned(finalAmount);

    const handleSubmitOrder = async () => {
        if (cart.length === 0) return;

        setSubmitting(true);
        try {
            const orderItems = cart.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity,
                unit_price: item.product.price,
                subtotal: item.product.price * item.quantity,
            }));

            await ordersAPI.create({
                user_id: profile.id,
                total_amount: totalAmount,
                discount_percent: discountPercent,
                final_amount: finalAmount,
                points_earned: pointsEarned,
                items: orderItems,
            });

            setSuccess({
                finalAmount,
                pointsEarned,
                discountPercent,
            });
            setCart([]);
            await refreshProfile();

            // Reload products to reflect stock changes
            const data = await productsAPI.fetchAll();
            setProducts(data.filter(p => p.stock > 0));
        } catch (err) {
            console.error('Error placing order:', err);
            alert('Gagal membuat pesanan: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="space-y-6">
                <PageHeader title="Place Order" breadcrumb={["Home", "Place Order"]} />
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
                    <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Berhasil!</h2>
                    <p className="text-gray-500 mb-6">Terima kasih, pesanan Anda sedang diproses.</p>

                    <div className="max-w-xs mx-auto space-y-3 text-left bg-gray-50 rounded-xl p-5">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Total</span>
                            <span className="font-bold text-gray-800">Rp {success.finalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Diskon ({success.discountPercent}%)</span>
                            <span className="text-green-600 font-semibold">Applied</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-3">
                            <span className="text-gray-500">Poin Didapat</span>
                            <span className="text-blue-600 font-bold">+{success.pointsEarned}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setSuccess(null)}
                        className="mt-6 px-6 py-2.5 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                    >
                        Order Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader title="Place Order" breadcrumb={["Home", "Place Order"]} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Products List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-800">Menu Tersedia</h2>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading...</div>
                        ) : products.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">Tidak ada produk tersedia.</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {products.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                            <p className="text-sm text-gray-400">{product.description || '-'}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-green-600 font-bold">Rp {Number(product.price).toLocaleString()}</span>
                                                <span className="text-xs text-gray-400">Stok: {product.stock}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition flex items-center gap-2"
                                        >
                                            <FaPlus className="text-xs" /> Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Cart Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
                        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                            <FaShoppingCart className="text-green-600" />
                            <h2 className="text-lg font-bold text-gray-800">Keranjang ({cart.length})</h2>
                        </div>

                        {cart.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">Keranjang kosong</div>
                        ) : (
                            <>
                                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div key={item.product.id} className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-800 text-sm">{item.product.name}</h4>
                                                    <p className="text-xs text-gray-400">Rp {Number(item.product.price).toLocaleString()} x {item.quantity}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="text-red-400 hover:text-red-600 transition-colors"
                                                >
                                                    <FaTrash className="text-xs" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, -1)}
                                                        className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                                                    >
                                                        <FaMinus className="text-xs" />
                                                    </button>
                                                    <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, 1)}
                                                        className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                                                    >
                                                        <FaPlus className="text-xs" />
                                                    </button>
                                                </div>
                                                <span className="font-bold text-gray-800 text-sm">
                                                    Rp {(item.product.price * item.quantity).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="p-5 border-t border-gray-100 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-semibold">Rp {totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Diskon ({discountPercent}% - {profile?.tier})</span>
                                        <span className="text-green-600 font-semibold">-Rp {discountAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-base border-t border-gray-100 pt-3">
                                        <span className="font-bold text-gray-800">Total</span>
                                        <span className="font-bold text-green-600">Rp {finalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm bg-blue-50 rounded-lg p-2">
                                        <span className="text-blue-600">Poin Didapat</span>
                                        <span className="font-bold text-blue-700">+{pointsEarned}</span>
                                    </div>

                                    <button
                                        onClick={handleSubmitOrder}
                                        disabled={submitting}
                                        className="w-full py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition disabled:opacity-50 mt-2"
                                    >
                                        {submitting ? 'Memproses...' : 'Pesan Sekarang'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
