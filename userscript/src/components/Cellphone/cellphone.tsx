
import { StatusBar } from "./StatusBar";
import { CloseButton } from "./CloseButton";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginScreen } from "@/components/Screens/LoginScreen";
import { RegisterScreen } from "@/components/Screens/RegisterScreen";
import { UserProfileScreen } from "@/components/Screens/UserProfileScreen";
import { EditProfileScreen } from "@/components/Screens/EditProfileScreen";
import { MainScreen } from "../Screens/MainScreen";
import { AjudaScreen } from "../Screens/AjudaScreen";
import { ProtectedRoute } from "../Screens/ProtectedRoute";
import { AuthenticatedLayout } from "../Screens/AuthenticatedLayout";
import { HomeScreen } from "../Screens/HomeScreen";
import { FindScreen } from "../Screens/FindScreen";
import { AddPostScreen } from "../Screens/AddPostScreen";
import { FavoritesScreen } from "../Screens/FavoritesScreen";

interface CellphoneProps {
    isOpen: boolean;
    onClose: () => void;
}





export function Cellphone({ isOpen, onClose }: CellphoneProps) {
    if (!isOpen) return null;

    return (
        <div className="ppm:fixed ppm:inset-0 ppm:bg-black/50 ppm:flex ppm:items-center ppm:justify-center ppm:z-50">
            <div className="ppm:relative ppm:w-[300px] ppm:h-[600px] ppm:bg-gray-900 ppm:rounded-[3rem] ppm:p-2 ppm:shadow-2xl">
                <CloseButton onClose={onClose} />
                <div className="ppm:w-full ppm:h-full ppm:bg-white ppm:rounded-[2.5rem] ppm:overflow-hidden ppm:relative">
                    <div className="ppm:absolute ppm:top-0 ppm:left-1/2 ppm:transform ppm:-translate-x-1/2 ppm:w-32 ppm:h-6 ppm:bg-black ppm:rounded-b-2xl ppm:z-10"></div>
                    <StatusBar />
                    <MemoryRouter initialEntries={["/login"]}>
                        <div className="ppm:flex-1">
                            <Routes>
                                {/* Rotas públicas */}
                                <Route path="/login" element={<LoginScreen />} />
                                <Route path="/register" element={<RegisterScreen />} />
                                <Route path="/ajuda" element={<AjudaScreen />} />

                                {/* Rotas autenticadas com layout */}
                                <Route element={<ProtectedRoute><AuthenticatedLayout /></ProtectedRoute>}>
                                    <Route path="/home" element={<HomeScreen />} />
                                    <Route path="/find" element={<FindScreen />} />
                                    <Route path="/add-post" element={<AddPostScreen />} />
                                    <Route path="/favorites" element={<FavoritesScreen />} />
                                    <Route path="/profile" element={<UserProfileScreen />} />
                                    <Route path="/profile/:username" element={<UserProfileScreen />} />
                                    <Route path="/edit-profile" element={<EditProfileScreen />} />
                                </Route>

                                <Route path="*" element={<Navigate to="/home" replace />} />
                            </Routes>
                        </div>
                    </MemoryRouter>
                    <div className="ppm:absolute ppm:bottom-2 ppm:left-1/2 ppm:transform ppm:-translate-x-1/2 ppm:w-32 ppm:h-1 ppm:bg-gray-400 ppm:rounded-full"></div>
                </div>
            </div>
        </div>
    );
}