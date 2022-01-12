import Home from "../pages/home/Home";
import CreatePayment from "../pages/payments/createPayment/CreatePayment";
import Payments from "../pages/payments/Payments";
import { UserContextProvider } from "../pages/users/UserContext";
import UserList from "../pages/users/UsersList";

export const MENU = [
  {
    id: "home",
    icon: "home",
    title: "Home",
    data: [
      {
        id: "home",
        title: "Home",
        items: [
          {
            id: "dashboard",
            title: "Dashboard",
            icon: "dashboard-fill",
            component: Home,
          },
        ],
      },
    ],
  },
  {
    id: "users",
    icon: "users",
    title: "Users",
    data: [
      {
        id: "users",
        title: "Users",
        items: [
          {
            id: "users",
            title: "Users",
            icon: "user",
            component: UserList,
            render: () => (
              <UserContextProvider>
                <UserList />
              </UserContextProvider>
            ),
          },
        ],
      },
    ],
  },
  {
    id: "payment",
    icon: "money",
    title: "Payment",
    data: [
      {
        id: "payment",
        title: "Payment",
        items: [
          {
            id: "payments",
            title: "Payments",
            icon: "money",
            component: Payments,
          },
          {
            id: "create-payment",
            title: "Create Payment",
            icon: "money",
            component: CreatePayment,
          },
        ],
      },
    ],
  },
];
