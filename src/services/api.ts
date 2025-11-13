import { supabase } from '../utils/supabase';
import type {
    Product,
    ProductLookupResponse,
    FoodItem,
    ExpiringFoodItem,
    FoodActivity,
    FoodActivitySummary,
    FoodTag,
    FoodTags,
    House,
    UserHouse,
    HouseMemberWithProfile,
    Profile,
    ReceiptUploadResponse,
    CreateProductRequest,
    CreateFoodItemRequest,
    BulkCreateFoodItemsRequest,
    CreateHouseRequest,
    CreateProfileRequest,
    AddHouseMemberRequest,
    CreateFoodTagRequest,
} from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Helper function to get auth headers
async function getAuthHeaders(): Promise<HeadersInit> {
    const { data: { session } } = await supabase.auth.getSession();
    return {
        'Content-Type': 'application/json',
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    };
}

// Helper function for API calls
async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `API call failed: ${response.statusText}`);
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

// ==================== Products API ====================

export const productsApi = {
    getAll: () => apiCall<Product[]>('/products'),

    search: (query: string) => apiCall<Product[]>(`/products/search?query=${encodeURIComponent(query)}`),

    getByBarcode: (barcode: string) => apiCall<Product>(`/products/barcode/${barcode}`),

    lookupBarcode: (barcode: string, data?: Partial<CreateProductRequest>) =>
        apiCall<ProductLookupResponse>(`/products/barcode/${barcode}/lookup`, {
            method: 'POST',
            body: JSON.stringify(data || {}),
        }),

    create: (data: CreateProductRequest) =>
        apiCall<Product>('/products', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<Product>) =>
        apiCall<Product>(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        apiCall<void>(`/products/${id}`, { method: 'DELETE' }),
};

// ==================== Food Items API ====================

export const foodItemsApi = {
    getByHouse: (houseId: string) =>
        apiCall<FoodItem[]>(`/food-items?house_id=${houseId}`),

    getById: (id: string) => apiCall<FoodItem>(`/food-items/${id}`),

    search: (houseId: string, query: string) =>
        apiCall<FoodItem[]>(`/food-items/search?house_id=${houseId}&query=${encodeURIComponent(query)}`),

    getExpiring: (houseId: string, days: number = 7) =>
        apiCall<ExpiringFoodItem[]>(`/food-items/expiring?house_id=${houseId}&days=${days}`),

    getTagged: (houseId: string, userId?: string) => {
        const url = `/food-items/tagged?house_id=${houseId}${userId ? `&user_id=${userId}` : ''}`;
        return apiCall<FoodItem[]>(url);
    },

    getActivity: (houseId: string, limit?: number, actionType?: 'added' | 'removed' | 'updated') => {
        let url = `/food-items/activity?house_id=${houseId}`;
        if (limit) url += `&limit=${limit}`;
        if (actionType) url += `&action_type=${actionType}`;
        return apiCall<FoodActivity[]>(url);
    },

    getActivitySummary: (houseId: string, days?: number) => {
        let url = `/food-items/activity/summary?house_id=${houseId}`;
        if (days) url += `&days=${days}`;
        return apiCall<FoodActivitySummary>(url);
    },

    create: (data: CreateFoodItemRequest) =>
        apiCall<FoodItem>('/food-items', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    bulkCreate: (data: BulkCreateFoodItemsRequest) =>
        apiCall<{ count: number; items: FoodItem[] }>('/food-items/bulk', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<FoodItem>) =>
        apiCall<FoodItem>(`/food-items/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        apiCall<void>(`/food-items/${id}`, { method: 'DELETE' }),

    getHistory: (id: string) =>
        apiCall<FoodActivity[]>(`/food-items/${id}/history`),
};

// ==================== Food Tagging API ====================

export const foodTagsApi = {
    create: (data: CreateFoodTagRequest) =>
        apiCall<FoodTag>('/food-items/tags', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    delete: (foodId: string, userId: string | 'all' | null) =>
        apiCall<void>('/food-items/tags', {
            method: 'DELETE',
            body: JSON.stringify({ food_id: foodId, user_id: userId }),
        }),

    getByFoodItem: (foodId: string) =>
        apiCall<FoodTags>(`/food-items/${foodId}/tags`),

    bulkCreate: (foodIds: string[], userId: string | 'all' | null) =>
        apiCall<{ count: number; tags: FoodTag[] }>('/food-items/tags/bulk', {
            method: 'POST',
            body: JSON.stringify({ food_ids: foodIds, user_id: userId }),
        }),
};

// ==================== Houses API ====================

export const housesApi = {
    getByUser: (userId: string) =>
        apiCall<UserHouse[]>(`/houses?user_id=${userId}`),

    getById: (id: string) => apiCall<House>(`/houses/${id}`),

    getMembers: (id: string) =>
        apiCall<HouseMemberWithProfile[]>(`/houses/${id}/members`),

    create: (data: CreateHouseRequest) =>
        apiCall<House>('/houses', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<House>) =>
        apiCall<House>(`/houses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        apiCall<void>(`/houses/${id}`, { method: 'DELETE' }),

    addMember: (data: AddHouseMemberRequest) =>
        apiCall<{ house_id: string; user_id: string }>('/houses/members', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    removeMember: (houseId: string, userId: string) =>
        apiCall<void>('/houses/members', {
            method: 'DELETE',
            body: JSON.stringify({ house_id: houseId, user_id: userId }),
        }),
};

// ==================== Profiles API ====================

export const profilesApi = {
    create: (data: CreateProfileRequest) =>
        apiCall<Profile>('/profiles', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getById: (id: string) => apiCall<Profile>(`/profiles/${id}`),

    getByUsername: (username: string) =>
        apiCall<Profile>(`/profiles/username/${username}`),

    search: (query: string) =>
        apiCall<Profile[]>(`/profiles/search?query=${encodeURIComponent(query)}`),

    update: (id: string, data: Partial<Profile>) =>
        apiCall<Profile>(`/profiles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        apiCall<void>(`/profiles/${id}`, { method: 'DELETE' }),
};

// ==================== Receipts API ====================

export const receiptsApi = {
    upload: async (file: File): Promise<ReceiptUploadResponse> => {
        const { data: { session } } = await supabase.auth.getSession();
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            headers: {
                ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Upload failed' }));
            throw new Error(error.error || 'Upload failed');
        }

        return response.json();
    },

    getReceipts: () => apiCall<any>('/receipts'),
};
