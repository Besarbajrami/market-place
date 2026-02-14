import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { ListingsPage } from "../../features/listings/ListingPage-Adaptive";
import { LoginPage } from "../../features/auth/loginPage";
import { RegisterPage } from "../../features/auth/RegisterPage";
import { ProtectedRoute } from "../../auth/ProtectedRoute";
import { InboxPage } from "../../features/chat/InboxPage";
import { MyListingsPage } from "../../features/listings/MyListingsPage";
import { EditListingPage } from "../../features/listings/EditListingPage";
import { ListingDetailsPage } from "../../features/listings/ListingDetailsPage";
import { ConversationPage } from "../../features/chat/ConversationPage";
import { MyFavoritesPage } from "../../features/favorites/MyFavoritesPage";
import { AdminRoute } from "../../auth/AdminRoute";
import { AdminCategoriesPage } from "../../features/categories/AdminCategoriesPage";
import { SellerPage } from "../../features/users/SellerPage";
import { QuickCreateListingPage } from "../../features/listings/CreateListingQuickPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <ListingsPage /> },

      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },

      {
        path: "inbox",
        element: (
          <ProtectedRoute>
            <InboxPage />
          </ProtectedRoute>
        )
      },
      {
        path: "sell",
        element: (
          <ProtectedRoute>
            <QuickCreateListingPage />
          </ProtectedRoute>
        )
      },
      {
        path: "inbox/:id",
        element: (
          <ProtectedRoute>
            <ConversationPage />
          </ProtectedRoute>
        ),
    },
      {
        path: "me/listings",
        element: (
          <ProtectedRoute>
            <MyListingsPage />
          </ProtectedRoute>
        )
      },

      {
        path: "me/listings/:id/edit",
        element: (
          <ProtectedRoute>
            <EditListingPage />
          </ProtectedRoute>
        )
      },
      {
        path: "listings/:id/:slug?",
        element: <ListingDetailsPage />
      },
      {
        path: "me/favorites",
        element: (
            <MyFavoritesPage />
        )
      },
      
      {
        path: "admin/categories",
        element: (
          <AdminRoute>
            <AdminCategoriesPage />
          </AdminRoute>
        )
      },
      {
        path: "seller/:sellerId",
        element: <SellerPage />
      }
      
      
      
    ]
  }
]);
