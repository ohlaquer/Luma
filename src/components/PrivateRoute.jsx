import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();
    const [checkingProfile, setCheckingProfile] = useState(true);
    const [onboarded, setOnboarded] = useState(null);

    useEffect(() => {
        const checkProfile = async () => {
            if (!user) return;
            try {
                const ref = doc(db, "users", user.uid, "config", "profile");
                const snap = await getDoc(ref);

                if (snap.exists()) {
                    const data = snap.data();
                    setOnboarded(data.onboarded || false);
                } else {
                    setOnboarded(false);
                }
            } catch (err) {
                console.error("Помилка завантаження профілю:", err);
                setOnboarded(false);
            } finally {
                setCheckingProfile(false);
            }
        };

        if (user) checkProfile();
        else setCheckingProfile(false);
    }, [user]);

    if (loading || checkingProfile) {
        return <div className="text-center p-10">Завантаження...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // якщо користувач є, але ще не пройшов анкету
    if (onboarded === false && location.pathname !== "/onboarding") {
        return <Navigate to="/onboarding" replace />;
    }

    // якщо користувач уже пройшов анкету, не даємо йому повертатись туди
    if (onboarded === true && location.pathname === "/onboarding") {
        return <Navigate to="/cabinet" replace />;
    }

    return children;
}
