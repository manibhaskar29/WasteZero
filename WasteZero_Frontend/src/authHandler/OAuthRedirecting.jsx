import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthRedirect() {
  const { setAuthenticated } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const API_URL = "http://localhost:5173/api/auth"; // correct endpoint

  useEffect(() => {
    const token = searchParams.get("token");
    console.log(token);
    
    if (!token) {
      navigate("/login");
      return;
    }

    // Save token first
    localStorage.setItem("token", token);


    // Fetch current user
    fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          localStorage.setItem("userId", data.user._id || data.user.id);
          localStorage.setItem("role", data.user.role);
          localStorage.setItem("name", data.user.name);

          // update context state
          setAuthenticated(true);
          
          navigate("/dashboard", { replace: true }); 
        }

        // redirect after login
      })
      .catch(() => navigate("/login", { replace: true }));
  }, [navigate, setAuthenticated, searchParams]);

  return <div>Redirecting...</div>;
}
