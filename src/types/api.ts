export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
  details: unknown;
  timestamp: string;
  path: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ResetPasswordDTO {
  email: string;
  token: string;
  newPassword: string;
}

export interface AddCartItemDTO {
  menuItemId: string;
  quantity: number;
  variants?: {
    groupName: string;
    selectedOption: string;
    additionalPrice: number;
  }[];
  notes?: string;
  cartId?: string; // For guest users
}

export interface CreateOrderDTO {
  deliveryType: "delivery" | "collection";
  deliveryAddress?: {
    street: string;
    street2?: string;
    zipCode: string;
    state?: string;
    city?: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  guestEmail?: string;
  guestPhone?: string;
  guestName?: string;
  specialInstructions?: string;
  paymentMethod: "cash" | "stripe";
  tipAmount?: number;
  userId?: string;
  cartId?: string;
}

export interface MenuQueryParams {
  category?: string;
  search?: string;
  dietary?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  isCatering?: boolean;
}

export interface UpdateProfileDTO {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePhoto?: string;
}

export interface AddressDTO {
  label: string;
  street: string;
  street2?: string;
  zipCode: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export interface CreateReviewDTO {
  orderId: string;
  menuItemId?: string;
  rating: number;
  comment: string;
  images?: string[];
}

export interface InitPaymentDTO {
  orderId: string;
  amount: number;
  email: string;
  paymentMethod: "cash" | "stripe";
}

export interface NotificationPrefsDTO {
  email: {
    orderConfirmation: boolean;
    orderStatus: boolean;
    promotions: boolean;
    reviews: boolean;
  };
  sms: boolean;
  push: boolean;
  inApp: {
    orderConfirmation: boolean;
    orderStatus: boolean;
    promotions: boolean;
    reviews: boolean;
  };
}

export interface DeliveryValidationResponse {
  available: boolean;
  zoneId?: string;
  zoneName?: string;
  deliveryFee?: number;
  minimumOrder?: number;
  estimatedDeliveryTimeMin?: number;
  estimatedDeliveryTimeMax?: number;
}
export interface checkDeliveryParams {
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}
export interface LocationData {
  zipCode: string;
  zoneName?: string;
  latitude?: number;
  longitude?: number;
  isValidated: boolean;
  deliveryInfo?: DeliveryValidationResponse;
  selectedAddressId?: string;
  selectedAddress?: AddressDTO;
  method: "delivery" | "collection";
}

export interface DeliveryZone {
  _id: string;
  name: string;
  deliveryFee: number;
  minimumOrder: number;
  estimatedDeliveryTimeMin: number;
  estimatedDeliveryTimeMax: number;
  active: boolean;
}

// ── DELIVERY ADDRESS FOR ORDERS ────────────────────────────────────────────
export interface DeliveryAddress {
  street: string;
  street2?: string;
  zipCode: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface ISeoPageMetadata {
  title: string; // max 60 chars
  description: string; // max 160 chars
  ogImage?: string; // Cloudinary URL
  canonical?: string;
}

export interface ISeoGlobal {
  siteTitle: string;
  metaDescription: string;
  ogImageUrl?: string;
  googleAnalyticsId?: string;
  googleSearchConsoleCode?: string;
}

export interface ILocalSeo {
  name: string;
  address: string;
  phone: string;
  googleBusinessUrl?: string;
  yelpUrl?: string;
  tripadvisorUrl?: string;
  serviceArea?: string;
  cuisineType?: string[];
}

export interface IStructuredDataSettings {
  enableRestaurantSchema: boolean;
  enableMenuSchema: boolean;
  enableBreadcrumbs: boolean;
}

export interface IRedirect {
  _id?: string;
  from: string;
  to: string;
  statusCode: number;
}

export interface ISeoSettings {
  _id: string;

  // Global SEO
  globalSeo: ISeoGlobal;

  // Per-page SEO
  pagesSeo: {
    home?: ISeoPageMetadata;
    menu?: ISeoPageMetadata;
    about?: ISeoPageMetadata;
    contact?: ISeoPageMetadata;
    catering?: ISeoPageMetadata;
  };

  // Local SEO
  localSeo: ILocalSeo;

  // Structured Data
  structuredData: IStructuredDataSettings;

  // Robots.txt
  robotsTxt?: string;

  // Redirects
  redirects: IRedirect[];

  createdAt: Date;
  updatedAt: Date;
}

// ===== Page Content Types =====
export interface IAboutContent {
  heroHeading: string;
  heroSubheading: string;
  storyText: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
  values: Array<{
    title: string;
    description: string;
    icon: string; // lucide-react icon name or emoji
  }>;
  team: Array<{
    name: string;
    role: string;
    bio?: string;
    image: string; // Cloudinary URL
  }>;
}

export interface IContactContent {
  heroHeading: string;
  heroText: string;
}

export interface ICateringContent {
  heroHeading: string;
  heroText: string;
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

export type PageSlug = "home" | "about" | "contact" | "catering";

export interface IPageContent {
  _id: string;
  pageSlug: PageSlug;

  // Page-specific content
  about?: IAboutContent;
  contact?: IContactContent;
  catering?: ICateringContent;

  createdAt: Date;
  updatedAt: Date;
}

// ===== Extended MenuItem SEO =====
export interface IMenuItemSeo {
  seoTitle?: string; // Page title for /menu/:id
  seoDescription?: string; // Meta description
  seoKeywords?: string[];
}

// Add to existing IMenuItem:
// seo?: IMenuItemSeo;

// ===== Homepage SEO Schema Response =====
export interface IHomepageSeoData {
  title: string;
  description: string;
  ogImage?: string;
  canonical: string;
  restaurantSchema: Record<string, any>; // JSON-LD
  breadcrumbSchema: Record<string, any>; // JSON-LD
}

// ===== API Response DTOs =====
export interface CreateOrUpdateSeoGlobalDTO {
  siteTitle: string;
  metaDescription: string;
  ogImageUrl?: string;
  googleAnalyticsId?: string;
  googleSearchConsoleCode?: string;
}

// export interface CreateOrUpdatePageSeoDTO extends ISeoPageMetadata {}

// export interface CreateOrUpdateLocalSeoDTO extends ILocalSeo {}

// export interface CreateOrUpdateStructuredDataDTO extends IStructuredDataSettings {}

export interface CreateRedirectDTO {
  from: string;
  to: string;
  statusCode?: number;
}

export interface UpdateRobotsTxtDTO {
  robotsTxt: string;
}

export interface CreateOrUpdatePageContentDTO {
  pageSlug: PageSlug;
  about?: IAboutContent;
  contact?: IContactContent;
  catering?: ICateringContent;
}

export interface IAboutStat {
  value: string;
  label: string;
}

export interface IAboutValue {
  title: string;
  description: string;
  icon: string;
}

export interface IAboutTeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface IAboutSeoData {
  title: string;
  description: string;
  ogImage?: string;
  canonical: string;
  organizationSchema?: any;
  personSchemas?: any[];
  breadcrumbSchema?: any;
}
