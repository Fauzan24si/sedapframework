import { supabase } from './supabaseClient';

// ============================================================
// CUSTOMERS API (Admin only)
// ============================================================
export const customersAPI = {
    async fetchAll() {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },
    async create(customer) {
        const { data, error } = await supabase
            .from('customers')
            .insert([{
                name: customer.name,
                email: customer.email || null,
                phone: customer.phone || null,
                address: customer.address || null,
            }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },
    async update(id, customer) {
        const { data, error } = await supabase
            .from('customers')
            .update({
                name: customer.name,
                email: customer.email || null,
                phone: customer.phone || null,
                address: customer.address || null,
            })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
    async delete(id) {
        const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },
};

// ============================================================
// PRODUCTS API (Admin CRUD, all authenticated SELECT)
// ============================================================
export const productsAPI = {
    async fetchAll() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },
    async fetchById(id) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },
    async create(product) {
        const { data, error } = await supabase
            .from('products')
            .insert([{
                name: product.name,
                description: product.description || null,
                price: product.price,
                stock: product.stock,
            }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },
    async update(id, product) {
        const { data, error } = await supabase
            .from('products')
            .update({
                name: product.name,
                description: product.description || null,
                price: product.price,
                stock: product.stock,
            })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
    async delete(id) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },
    async deductStock(items) {
        // items: [{ product_id, quantity }]
        for (const item of items) {
            const { error } = await supabase.rpc('deduct_stock', {
                p_product_id: item.product_id,
                p_quantity: item.quantity,
            });
            // Fallback if RPC doesn't exist: manual update
            if (error) {
                const { data: product } = await supabase
                    .from('products')
                    .select('stock')
                    .eq('id', item.product_id)
                    .single();
                if (product) {
                    await supabase
                        .from('products')
                        .update({ stock: product.stock - item.quantity })
                        .eq('id', item.product_id);
                }
            }
        }
    },
};

// ============================================================
// ORDERS API
// ============================================================
export const ordersAPI = {
    // Admin: fetch all orders with profile name
    async fetchAll() {
        const { data, error } = await supabase
            .from('orders')
            .select('*, profiles(full_name)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },
    // Member: fetch own orders
    async fetchMine(userId) {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },
    // Member: create order with items
    async create(orderData) {
        // orderData: { user_id, total_amount, discount_percent, final_amount, points_earned, items: [{ product_id, quantity, unit_price, subtotal }] }
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{
                user_id: orderData.user_id,
                total_amount: orderData.total_amount,
                discount_percent: orderData.discount_percent,
                final_amount: orderData.final_amount,
                points_earned: orderData.points_earned,
                status: 'pending',
            }])
            .select()
            .single();
        if (orderError) throw orderError;

        // Insert order items
        const items = orderData.items.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.subtotal,
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(items);
        if (itemsError) throw itemsError;

        // Deduct stock
        await productsAPI.deductStock(orderData.items);

        return order;
    },
    // Admin: update order status
    async updateStatus(orderId, newStatus) {
        const { data, error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
    // Admin: award points when order completed
    async awardPoints(orderId) {
        // Fetch order to get user_id and points_earned
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('user_id, points_earned')
            .eq('id', orderId)
            .single();
        if (fetchError) throw fetchError;

        // Fetch current points
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('points')
            .eq('id', order.user_id)
            .single();
        if (profileError) throw profileError;

        const newPoints = (profile.points || 0) + order.points_earned;
        const newTier = getTierFromPoints(newPoints);

        // Update profile with new points and tier
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ points: newPoints, tier: newTier })
            .eq('id', order.user_id);
        if (updateError) throw updateError;
    },
};

// ============================================================
// PROFILES API
// ============================================================
export const profileAPI = {
    async getProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) throw error;
        return data;
    },
    async updateProfile(userId, updates) {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
};

// ============================================================
// TIER HELPER
// ============================================================
export function getTierFromPoints(points) {
    if (points >= 10000) return 'platinum';
    if (points >= 5000) return 'gold';
    if (points >= 1000) return 'silver';
    return 'bronze';
}

export function getDiscountPercent(tier) {
    const discounts = { bronze: 5, silver: 10, gold: 15, platinum: 20 };
    return discounts[tier] || 0;
}

export function calculatePointsEarned(finalAmount) {
    return Math.floor(finalAmount / 1000);
}
