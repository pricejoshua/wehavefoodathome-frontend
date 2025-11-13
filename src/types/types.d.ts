// Product types
export interface Product {
    id: string;
    name: string;
    description?: string;
    category?: string;
    metadata?: {
        barcode?: string;
        [key: string]: any;
    };
    created_at: string;
}

export interface ProductLookupResponse {
    product: Product;
    source: 'openfoodfacts' | 'database' | 'manual';
    created: boolean;
    message?: string;
}

// Food Item types
export interface FoodItem {
    id: string;
    product_id: string;
    house_id: string;
    user_id: string;
    quantity: number;
    unit: string;
    best_by_date?: string;
    expiration_date?: string;
    created_at: string;
    products?: Product;
}

export interface ExpiringFoodItem {
    id: string;
    product_id: string;
    best_by_date?: string;
    days_until_expiration: number;
    is_expired: boolean;
    products?: Product;
}

export interface FoodActivity {
    id: string;
    food_id: string;
    house_id: string;
    user_id: string;
    action_type: 'added' | 'removed' | 'updated';
    quantity?: number;
    timestamp: string;
    notes?: string;
    food_item?: FoodItem;
    profiles?: Profile;
}

export interface FoodActivitySummary {
    house_id: string;
    period_days: number;
    total_actions: number;
    by_action_type: {
        added: number;
        removed: number;
        updated: number;
    };
}

export interface FoodTag {
    food_id: string;
    user_id: string | 'all' | null;
    created_at: string;
}

export interface FoodTags {
    food_id: string;
    available_for_all: boolean;
    tagged_users: string[];
}

// House types
export interface House {
    id: string;
    name: string;
    description?: string;
    created_at: string;
}

export interface HouseMember {
    house_id: string;
    user_id: string;
    created_at: string;
}

export interface HouseMemberWithProfile extends HouseMember {
    profiles?: Profile;
}

export interface UserHouse {
    house_id: string;
    created_at: string;
    houses: House;
}

// Profile types
export interface Profile {
    id: string;
    username: string;
    full_name?: string;
    avatar_url?: string;
    birthday?: string;
    website?: string;
    created_at: string;
}

// Receipt types
export interface ReceiptUploadResponse {
    path: string;
}

// API Request types
export interface CreateProductRequest {
    name: string;
    description?: string;
    category?: string;
    metadata?: {
        barcode?: string;
        [key: string]: any;
    };
}

export interface CreateFoodItemRequest {
    house_id: string;
    product_id: string;
    user_id: string;
    quantity: number;
    unit: string;
    best_by_date?: string;
    expiration_date?: string;
}

export interface BulkCreateFoodItemsRequest {
    items: CreateFoodItemRequest[];
}

export interface CreateHouseRequest {
    name: string;
    description?: string;
}

export interface CreateProfileRequest {
    id: string;
    username: string;
    full_name?: string;
    avatar_url?: string;
    birthday?: string;
    website?: string;
}

export interface AddHouseMemberRequest {
    house_id: string;
    user_id: string;
}

export interface CreateFoodTagRequest {
    food_id: string;
    user_id: string | 'all' | null;
}

// API Response types
export interface ApiError {
    error: string;
}

// Legacy type (keeping for compatibility)
type Food = {
    name: string;
    image: string;
    price: number;
    description: string;
    expiration: string;
    upc: string;
    date: Date;
}
