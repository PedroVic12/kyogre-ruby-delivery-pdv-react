import { createBrowserRouter } from "react-router-dom"
import RootLayout from "./pages/RootLayout"
import Home from "./pages/Home"
import ListItems from "./pages/items/ListItems"
import CreateItem from "./pages/items/CreateItem"
import ShowItem from "./pages/items/ShowItem"
import UpdateItem from "./pages/items/UpdateItem"
import ItemsLayout from "./pages/items/ItemsLayout"

const router = createBrowserRouter([{
    path: "/",
    element: <RootLayout />,
    children: [
        { index: true, element: <Home /> },
        {
            path: "items",
            element: <ItemsLayout />,
            children: [
                { index: true, element: <ListItems /> },
                { path: "new", element: <CreateItem /> },
                { path: ":id", element: <ShowItem /> },
                { path: ":id/update", element: <UpdateItem /> }
            ]
        }
    ]
}])

export default router