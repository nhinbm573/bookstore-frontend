# Frontend Architecture Design

## Introduction

This document outlines the frontend architecture for the e-commerce book system using React with TypeScript. The frontend will provide a responsive, user-friendly interface that consumes the Django REST API while maintaining modern web development best practices.

## Technology Stack

### Core Technologies

**React 18**: The latest version of React with concurrent features and improved performance
**TypeScript**: Provides type safety and enhanced developer experience
**React Router v6**: For client-side routing and navigation
**Axios**: HTTP client for API communication
**React Query (TanStack Query)**: Server state management and caching
**Zustand**: Lightweight state management for client state
**React Hook Form**: Form handling with validation
**Zod**: Schema validation for TypeScript
**Tailwind CSS**: Utility-first CSS framework for styling
**Headless UI**: Unstyled, accessible UI components
**React Hot Toast**: Toast notifications
**React Helmet Async**: Document head management

### Development Tools

**Vite**: Fast build tool and development server
**ESLint**: Code linting and quality enforcement
**Prettier**: Code formatting
**Husky**: Git hooks for pre-commit checks
**lint-staged**: Run linters on staged files
**TypeScript**: Type checking and compilation

## Project Structure

The React frontend will follow a feature-based architecture with clear separation of concerns:

```
bookstore_frontend/
├── app/
│   ├── routes/
│   │   └── _index_/
│   │       ├── route.tsx   # File-based convention
│   │       └── components/ # Manage components by each pages
│   ├── app.css
│   ├── root.tsx
│   └── routes.ts
├── public/
├── hooks/                  # Global hooks
├── .dockerignore
├── .gitignore
├── .prettierignore
├── .prettierrc
├── Dockerfile
├── eslint.config.js
├── package.json
├── react-router-config.ts
├── tsconfig.json
└── README.md
```

## Component Architecture

### UI Components (`src/components/ui/`)

These are reusable, low-level UI components that form the foundation of the design system:

**Button Component**:

```typescript
interface ButtonProps {
  variant: "primary" | "secondary" | "outline" | "ghost";
  size: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Input Component**:

```typescript
interface InputProps {
  type: "text" | "email" | "password" | "number";
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
}
```

**Card Component**: Container for content sections
**Modal Component**: Overlay dialogs and popups
**Loading Component**: Loading states and spinners
**Badge Component**: Status indicators and labels
**Pagination Component**: Page navigation controls
**Rating Component**: Star rating display and input

### Layout Components (`src/components/layout/`)

These components define the overall page structure and navigation:

**Header Component**: Top navigation with logo, search, user menu, and cart icon
**Footer Component**: Bottom page information and links
**Sidebar Component**: Category navigation and filters
**Layout Component**: Main page wrapper with header and footer
**Navigation Component**: Primary navigation menu
**Breadcrumb Component**: Page hierarchy navigation

### Form Components (`src/components/forms/`)

Specialized form components for different use cases:

**LoginForm**: User authentication form
**RegisterForm**: User registration form
**ProfileForm**: User profile editing form
**SearchForm**: Book search functionality
**CheckoutForm**: Order placement form
**CommentForm**: Book rating and comment form

### Common Components (`src/components/common/`)

Shared components used across multiple features:

**BookCard**: Display book information in grid/list views
**BookList**: Container for multiple book cards
**CartItem**: Shopping cart item display
**OrderItem**: Order history item display
**CommentItem**: Individual comment display
**CategoryFilter**: Category selection component
**PriceFilter**: Price range filtering component

## Feature Modules

### Authentication Feature (`src/features/auth/`)

Handles all authentication-related functionality:

**Components**:

- `LoginPage`: User login interface
- `RegisterPage`: User registration interface
- `ForgotPasswordPage`: Password reset request
- `ResetPasswordPage`: Password reset confirmation
- `ActivationPage`: Account activation handling

**Hooks**:

- `useAuth`: Authentication state and actions
- `useLogin`: Login form handling
- `useRegister`: Registration form handling
- `usePasswordReset`: Password reset functionality

**Services**:

- `authService`: API calls for authentication
- `tokenService`: JWT token management

**Types**:

```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  birthday?: string;
  isActive: boolean;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

### Books Feature (`src/features/books/`)

Manages book browsing, searching, and detailed views:

**Components**:

- `BooksPage`: Main book listing page
- `BookDetailPage`: Individual book details
- `BookSearchPage`: Search results page
- `BookGrid`: Grid layout for book cards
- `BookFilters`: Filtering and sorting controls

**Hooks**:

- `useBooks`: Book listing with pagination
- `useBookDetail`: Individual book data
- `useBookSearch`: Search functionality
- `useBookFilters`: Filter and sort state

**Services**:

- `booksService`: Book-related API calls

**Types**:

```typescript
interface Book {
  id: string;
  title: string;
  description: string;
  authorName: string;
  publisherName: string;
  publishedDate: string;
  unitPrice: number;
  photoPath: string;
  averageRating: number;
  totalRatingCount: number;
  categories: Category[];
}
```

### Categories Feature (`src/features/categories/`)

Handles book category management and navigation:

**Components**:

- `CategoryList`: Display all categories
- `CategoryPage`: Books within a specific category
- `CategoryFilter`: Category selection component

**Hooks**:

- `useCategories`: Category data fetching
- `useCategoryBooks`: Books within a category

**Services**:

- `categoriesService`: Category-related API calls

### Shopping Cart Feature (`src/features/cart/`)

Manages shopping cart functionality:

**Components**:

- `CartPage`: Shopping cart overview
- `CartSidebar`: Quick cart access
- `CartItem`: Individual cart item
- `CartSummary`: Cart totals and checkout button

**Hooks**:

- `useCart`: Cart state and operations
- `useAddToCart`: Add items to cart
- `useUpdateCartItem`: Update item quantities
- `useRemoveFromCart`: Remove items from cart

**Services**:

- `cartService`: Cart-related API calls

**Types**:

```typescript
interface CartItem {
  id: string;
  book: Book;
  quantity: number;
  unitPrice: number;
}

interface Cart {
  id: string;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}
```

### Orders Feature (`src/features/orders/`)

Handles order placement and history:

**Components**:

- `CheckoutPage`: Order placement interface
- `OrdersPage`: Order history listing
- `OrderDetailPage`: Individual order details
- `OrderSummary`: Order totals and information

**Hooks**:

- `useCreateOrder`: Order placement
- `useOrders`: Order history fetching
- `useOrderDetail`: Individual order data

**Services**:

- `ordersService`: Order-related API calls

### Profile Feature (`src/features/profile/`)

User profile management:

**Components**:

- `ProfilePage`: User profile overview
- `EditProfilePage`: Profile editing interface
- `ChangePasswordPage`: Password change form
- `OrderHistoryPage`: User's order history

**Hooks**:

- `useProfile`: Profile data and updates
- `useChangePassword`: Password change functionality

### Admin Feature (`src/features/admin/`)

Administrative functionality for book management:

**Components**:

- `AdminDashboard`: Admin overview page
- `BookManagementPage`: Book CRUD operations
- `AddBookPage`: New book creation
- `EditBookPage`: Book editing interface
- `OrderManagementPage`: Order administration

**Hooks**:

- `useAdminBooks`: Admin book operations
- `useAdminOrders`: Admin order management

## State Management

### Global State with Zustand

The application uses Zustand for lightweight global state management:

**Auth Store**:

```typescript
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (profileData: ProfileData) => Promise<void>;
}
```

**Cart Store**:

```typescript
interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (bookId: string, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}
```

**UI Store**:

```typescript
interface UIStore {
  sidebarOpen: boolean;
  cartSidebarOpen: boolean;
  theme: "light" | "dark";
  toggleSidebar: () => void;
  toggleCartSidebar: () => void;
  setTheme: (theme: "light" | "dark") => void;
}
```

### Server State with React Query

React Query manages server state, caching, and synchronization:

**Query Keys**:

```typescript
export const queryKeys = {
  books: ["books"] as const,
  book: (id: string) => ["books", id] as const,
  categories: ["categories"] as const,
  cart: ["cart"] as const,
  orders: ["orders"] as const,
  order: (id: string) => ["orders", id] as const,
  profile: ["profile"] as const,
};
```

**Custom Hooks**:

```typescript
export const useBooks = (filters: BookFilters) => {
  return useQuery({
    queryKey: [...queryKeys.books, filters],
    queryFn: () => booksService.getBooks(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
};
```

## Routing Architecture

### Route Structure

The application uses React Router v6 with nested routing:

```typescript
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "books", element: <BooksPage /> },
      { path: "books/:id", element: <BookDetailPage /> },
      { path: "categories/:id", element: <CategoryPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      {
        path: "profile",
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <ProfilePage /> },
          { path: "edit", element: <EditProfilePage /> },
          { path: "orders", element: <OrdersPage /> },
          { path: "orders/:id", element: <OrderDetailPage /> },
        ],
      },
      {
        path: "admin",
        element: <AdminRoute />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "books", element: <BookManagementPage /> },
          { path: "books/new", element: <AddBookPage /> },
          { path: "books/:id/edit", element: <EditBookPage /> },
          { path: "orders", element: <OrderManagementPage /> },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      { path: "activate/:token", element: <ActivationPage /> },
    ],
  },
]);
```

### Route Guards

**Protected Route**: Requires authentication

```typescript
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  return <Outlet />;
};
```

**Admin Route**: Requires admin privileges

```typescript
const AdminRoute = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
```

## API Integration

### HTTP Client Configuration

Axios is configured with interceptors for authentication and error handling:

```typescript
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// Request interceptor for authentication
apiClient.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await tokenService.refreshToken();
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  },
);
```

### Service Layer

Each feature has a dedicated service for API communication:

```typescript
export const booksService = {
  getBooks: async (filters: BookFilters): Promise<PaginatedResponse<Book>> => {
    const response = await apiClient.get("/books/", { params: filters });
    return response.data;
  },

  getBook: async (id: string): Promise<Book> => {
    const response = await apiClient.get(`/books/${id}/`);
    return response.data;
  },

  searchBooks: async (
    query: string,
    filters?: BookFilters,
  ): Promise<PaginatedResponse<Book>> => {
    const response = await apiClient.get("/books/search/", {
      params: { search: query, ...filters },
    });
    return response.data;
  },
};
```

## Form Handling

### React Hook Form Integration

Forms use React Hook Form with Zod validation:

```typescript
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLoginMutation();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("email")}
        type="email"
        placeholder="Email"
        error={errors.email?.message}
      />
      <Input
        {...register("password")}
        type="password"
        placeholder="Password"
        error={errors.password?.message}
      />
      <Button type="submit" loading={loginMutation.isLoading}>
        Login
      </Button>
    </form>
  );
};
```

## Responsive Design

### Mobile-First Approach

The application follows a mobile-first design approach using Tailwind CSS:

**Breakpoints**:

- `sm`: 640px and up (tablets)
- `md`: 768px and up (small laptops)
- `lg`: 1024px and up (desktops)
- `xl`: 1280px and up (large desktops)

**Layout Adaptations**:

- Mobile: Single column layout, hamburger menu, bottom navigation
- Tablet: Two-column layout, sidebar navigation
- Desktop: Multi-column layout, full navigation, sidebar filters

### Touch-Friendly Interface

Mobile interactions are optimized for touch:

- Minimum touch target size of 44px
- Swipe gestures for image galleries
- Pull-to-refresh functionality
- Touch-friendly form controls

## Performance Optimization

### Code Splitting

The application implements route-based code splitting:

```typescript
const BooksPage = lazy(() => import("../features/books/BooksPage"));
const BookDetailPage = lazy(() => import("../features/books/BookDetailPage"));
const CartPage = lazy(() => import("../features/cart/CartPage"));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/books" element={<BooksPage />} />
    <Route path="/books/:id" element={<BookDetailPage />} />
    <Route path="/cart" element={<CartPage />} />
  </Routes>
</Suspense>;
```

### Image Optimization

Images are optimized for performance:

- Lazy loading for book cover images
- WebP format with fallbacks
- Responsive image sizes
- Image compression and optimization

### Caching Strategy

React Query provides intelligent caching:

- Stale-while-revalidate for book data
- Background refetching for user data
- Optimistic updates for cart operations
- Cache invalidation on mutations

## Accessibility

### WCAG 2.1 Compliance

The application follows WCAG 2.1 AA guidelines:

- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

### Accessibility Features

**Keyboard Navigation**: All interactive elements are keyboard accessible
**Focus Management**: Proper focus handling in modals and forms
**ARIA Labels**: Descriptive labels for screen readers
**Skip Links**: Navigation shortcuts for keyboard users
**Error Announcements**: Screen reader announcements for form errors

## Testing Strategy

### Unit Testing

Components are tested using React Testing Library:

```typescript
describe("BookCard", () => {
  it("displays book information correctly", () => {
    const book = mockBook();
    render(<BookCard book={book} />);

    expect(screen.getByText(book.title)).toBeInTheDocument();
    expect(screen.getByText(book.authorName)).toBeInTheDocument();
    expect(screen.getByText(`$${book.unitPrice}`)).toBeInTheDocument();
  });

  it("handles add to cart action", async () => {
    const book = mockBook();
    const onAddToCart = jest.fn();

    render(<BookCard book={book} onAddToCart={onAddToCart} />);

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(onAddToCart).toHaveBeenCalledWith(book.id);
  });
});
```

### Integration Testing

API integration is tested with MSW (Mock Service Worker):

```typescript
const server = setupServer(
  rest.get("/api/books/", (req, res, ctx) => {
    return res(ctx.json(mockBooksResponse()));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### End-to-End Testing

Critical user flows are tested with Playwright:

- User registration and login
- Book browsing and searching
- Shopping cart operations
- Order placement process

## Build and Deployment

### Build Configuration

Vite is configured for optimal production builds:

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["@headlessui/react"],
        },
      },
    },
  },
});
```

### Environment Configuration

Different configurations for different environments:

```typescript
// .env.development
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development

// .env.production
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENVIRONMENT=production
```

### Deployment Strategy

The frontend is deployed as a static site:

- Build artifacts are generated with `npm run build`
- Static files are served from a CDN
- Environment variables are injected at build time
- Automatic deployment on successful CI/CD pipeline
