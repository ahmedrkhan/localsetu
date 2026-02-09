import axios from "./axios";

// Shops API
export const getAllShops = () => axios.get("/admin/shops"); // this one is fine
export const approveShop = (id) => axios.put(`/admin/shop/${id}/approve`);
export const blockShop = (id) => axios.put(`/admin/shop/${id}/block`);
export const deleteShop = (id) => axios.delete(`/admin/shop/${id}`);
export const unblockShop = (id) => axios.put(`/admin/shop/${id}/unblock`); // <--- add this


// Users API
export const getAllUsers = () => axios.get("/admin/users");
export const deleteUser = (id) => axios.delete(`/admin/users/${id}`);
// users
export const blockUser = (id) => axios.put(`/admin/user/${id}/block`);
export const unblockUser = (id) => axios.put(`/admin/user/${id}/unblock`);
