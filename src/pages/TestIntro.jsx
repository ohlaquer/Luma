// 📁 src/pages/TestIntro.jsx

import { useNavigate, useParams } from "react-router-dom";
import tests from "../tests";
import BackLink from "../components/BackLink";
import { Clock, ListOrdered } from "lucide-react";

import W_aaq_ii from "../assets/images/tests/W_aaq-ii.png";
import W_assinger from "../assets/images/tests/W_assinger.png";
import W_beck_anxiety from "../assets/images/tests/W_beck-anxiety.png";
import W_beck_depression from "../assets/images/tests/W_beck-depression.png";
import W_emotional_intelligence from "../assets/images/tests/W_emotional-intelligence.png";
import W_eysenck from "../assets/images/tests/W_eysenck.png";
import W_geometric_delinger from "../assets/images/tests/W_geometric-delinger.png";
import W_luscher from "../assets/images/tests/W_luscher.png";
import W_maslach_burnout from "../assets/images/tests/W_maslach-burnout.png";
import W_personal_orientation from "../assets/images/tests/W_personal-orientation.png";
import W_personality from "../assets/images/tests/W_personality.png";
import W_ptsd_scale from "../assets/images/tests/W_ptsd-scale.png";
import W_rosenberg from "../assets/images/tests/W_rosenberg.png";
import W_spiellberger_khanin from "../assets/images/tests/W_spiellberger-khanin.png";
import W_stress_scale from "../assets/images/tests/W_stress-scale.png";

export default function TestIntro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const test = tests[id];
    // 🧩 Словник
    const testImages = {
        "aaq-ii": W_aaq_ii,
        "assinger": W_assinger,
        "beck-anxiety": W_beck_anxiety,
        "beck-depression": W_beck_depression,
        "emotional-intelligence": W_emotional_intelligence,
        "eysenck": W_eysenck,
        "geometric-delinger": W_geometric_delinger,
        "luscher": W_luscher,
        "maslach-burnout": W_maslach_burnout,
        "personal-orientation": W_personal_orientation,
        "personality": W_personality,
        "ptsd-scale": W_ptsd_scale,
        "rosenberg": W_rosenberg,
        "spiellberger-khanin": W_spiellberger_khanin,
        "stress-scale": W_stress_scale,
    };

  if (!test) {
    return (
      <div className="text-center mt-10 text-red-600">
        Тест не знайдено 😢
      </div>
    );
  }

  return (
    <div
      className="max-w-[880px] mx-auto px-4 md:px-8 py-10"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="flex justify-center mb-6">
        <BackLink to="/cabinet/tests" />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
        {test.title}
      </h1>

      <div className="bg-[var(--card-bg)] text-[var(--card-text)] rounded-2xl shadow-md px-6 py-8 flex flex-col items-center">
          <img
              src={testImages[id]}
              alt={test.title}
              className="w-full h-40 rounded-xl mb-6 object-cover"
          />


          <p className="text-base text-center mb-4 max-w-2xl">
          {test.description}
        </p>

        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{test.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <ListOrdered size={16} />
            <span>{test.questions.length} питань</span>
          </div>
        </div>

          <button
              onClick={() => navigate(`/cabinet/tests/${id}/start`)}
              className="px-6 py-3 bg-[#6FCAFF] hover:bg-[#5DB8F0] active:bg-[#4BA6E0] text-white font-medium rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
          >
              Почати тест
          </button>

      </div>
    </div>
  );
}
