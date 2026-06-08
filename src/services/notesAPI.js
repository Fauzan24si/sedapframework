import axios from 'axios';

const API_URL = "https://ufvzoptlqaejzkegyumt.supabase.co/rest/v1/note";
const API_KEY = "sb_publishable_5aqEwmeupGAnQIbu9u1vHw_m16DMdsN";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
};

export const notesAPI = {
    async fetchNotes() {
        try {
            const response = await axios.get(API_URL, { headers });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async createNote(data) {
        try {
            const payload = {
                title: data.title || "",
                content: data.content || "",
                status: data.status || ""
            };
            
            const response = await axios.post(API_URL, payload, { headers });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async deleteNote(id) {
        try {
            const response = await axios.delete(`${API_URL}?id=eq.${id}`, { headers });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
