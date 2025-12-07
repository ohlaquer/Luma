import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import OnboardingPage from "./pages/OnboardingPage";
import { useEffect } from "react";

// Layout
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

// Сторінки
import HomePage from "./pages/HomePage";
import GuidePage from "./pages/GuidePage";
import PolicyPage from "./pages/PolicyPage";
import PsychologicalSupportPage from "./pages/PsychologicalSupportPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CabinetPage from "./pages/CabinetPage";
import ResourceSpacePage from "./pages/ResourceSpacePage";

import HomeGuide from "./pages/guide/HomeGuide";
import ChatGuide from "./pages/guide/ChatGuide";
import JournalGuide from "./pages/guide/JournalGuide";
import ResourceGuide from "./pages/guide/ResourceGuide";
import TestsGuide from "./pages/guide/TestsGuide";
import ProfileGuide from "./pages/guide/ProfileGuide";
import OnboardingGuide from "./pages/guide/OnboardingGuide";
import SafetyGuide from "./pages/guide/SafetyGuide";
import AboutGuide from "./pages/guide/About";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import "./assets/styles/theme.css";

// Підсторінки ресурсу
import BodyPage from "./pages/BodyPage";
import BreathPage from "./pages/BreathPage";
import CognitivePage from "./pages/CognitivePage";
import GroundingPage from "./pages/GroundingPage";
import ReflectionPage from "./pages/ReflectionPage";
import SensoryPage from "./pages/SensoryPage";
import ArtPage from "./pages/ArtPage";
import BoundariesPage from "./pages/Boundaries";
import TestsPage from "./pages/TestsPage";
import TestRunner from "./components/TestRunner";
import TestIntro from "./pages/TestIntro";
import JournalPage from "./pages/JournalPage";

import ChatPage from "./pages/ChatPage";

function App() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [transition, setTransition] = useState(null);

    const toggleTheme = (e) => {
        const x = e.clientX;
        const y = e.clientY;
        setTransition({ x, y });
    };

    const handleTransitionComplete = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        setTransition(null);
    };
    useEffect(() => {
        if (navigator.userAgent.includes("Mac")) {
            document.documentElement.classList.add("is-mac");
        }
    }, []);

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Публічні сторінки */}
                    <Route path="/" element={<Layout onToggleTheme={toggleTheme}><HomePage /></Layout>} />
                    <Route path="/guide" element={<Layout onToggleTheme={toggleTheme}><GuidePage /></Layout>} />
                    <Route path="/policy" element={<Layout onToggleTheme={toggleTheme}><PolicyPage /></Layout>} />
                    <Route path="/support" element={<Layout onToggleTheme={toggleTheme}><PsychologicalSupportPage /></Layout>} />
                    <Route path="/register" element={<Layout onToggleTheme={toggleTheme}><RegisterPage /></Layout>} />
                    <Route path="/login" element={<Layout onToggleTheme={toggleTheme}><LoginPage /></Layout>} />
                    <Route path="/forgot-password" element={<Layout onToggleTheme={toggleTheme}><ForgotPasswordPage /></Layout>} />

                    {/* Сторінки довідника */}
                    <Route path="/guide/home" element={<Layout onToggleTheme={toggleTheme}><HomeGuide /></Layout>}/>
                    <Route path="/guide/chat" element={<Layout onToggleTheme={toggleTheme}><ChatGuide /></Layout>}/>
                    <Route path="/guide/journal" element={<Layout onToggleTheme={toggleTheme}><JournalGuide /></Layout>}/>
                    <Route path="/guide/resources" element={<Layout onToggleTheme={toggleTheme}><ResourceGuide /></Layout>}/>
                    <Route path="/guide/tests" element={<Layout onToggleTheme={toggleTheme}><TestsGuide /></Layout>}/>
                    <Route path="/guide/profile" element={<Layout onToggleTheme={toggleTheme}><ProfileGuide /></Layout>}/>
                    <Route path="/guide/onboarding" element={<Layout onToggleTheme={toggleTheme}><OnboardingGuide /></Layout>}/>
                    <Route path="/guide/safety" element={<Layout onToggleTheme={toggleTheme}><SafetyGuide /></Layout>}/>
                    <Route path="/guide/about" element={<Layout onToggleTheme={toggleTheme}><AboutGuide /></Layout>}/>

                    {/* Кабінет тільки для залогінених */}
                    <Route path="/cabinet" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><CabinetPage /></Layout></PrivateRoute>}/>
                    <Route path="/cabinet/chat" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><ChatPage /></Layout></PrivateRoute>}/>
                    <Route path="/cabinet/journal" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><JournalPage /></Layout></PrivateRoute>}/>
                    <Route path="/profile" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><ProfilePage /></Layout></PrivateRoute>}/>
                    <Route path="/settings" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><SettingsPage /></Layout></PrivateRoute>}/>

                    {/* Ресурсний простір */}
                    <Route path="/cabinet/resource" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><ResourceSpacePage /></Layout></PrivateRoute>}/>
                    <Route path="/cabinet/resource/body" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><BodyPage /></Layout></PrivateRoute>}/>
                    <Route path="/cabinet/resource/breath" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><BreathPage /></Layout></PrivateRoute>}/>
                    <Route path="/cabinet/resource/cognitive" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><CognitivePage /></Layout></PrivateRoute>}/>
                    <Route path="/cabinet/resource/grounding" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><GroundingPage /></Layout></PrivateRoute>}/>
                    <Route path="/cabinet/resource/reflection" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><ReflectionPage /></Layout></PrivateRoute>}/>
                    <Route path="/cabinet/resource/sensory" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><SensoryPage /></Layout></PrivateRoute>}/>
                    <Route path="/cabinet/resource/art" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><ArtPage /></Layout></PrivateRoute>}/>
                    <Route path="/cabinet/resource/boundaries" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><BoundariesPage /></Layout></PrivateRoute>}/>

                    {/* Тести */}
                    <Route path="/cabinet/tests" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><TestsPage /></Layout></PrivateRoute>}/>
                    <Route path="/cabinet/tests/:id" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><TestIntro /></Layout></PrivateRoute>}/>
                    <Route path="/cabinet/tests/:id/start" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><TestRunner /></Layout></PrivateRoute>}/>

                    {/* Сторінка онбордингу */}
                    <Route path="/onboarding" element={<PrivateRoute><Layout onToggleTheme={toggleTheme}><OnboardingPage /></Layout></PrivateRoute>}/>

                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
