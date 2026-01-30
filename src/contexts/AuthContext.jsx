import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // localStorage에서 로그인 정보 복원
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const signup = (userData) => {
    // 간단한 회원가입 처리 (실제로는 서버에 저장해야 함)
    const newUser = {
      user_id: Date.now(), // 임시 ID
      username: userData.username,
      email: userData.email,
    };
    
    // 기존 사용자 목록 가져오기
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    // 아이디 중복 체크
    if (users.some(u => u.username === userData.username)) {
      return { success: false, message: "이미 존재하는 아이디입니다." };
    }
    
    // 사용자 추가
    users.push({ ...newUser, password: userData.password });
    localStorage.setItem("users", JSON.stringify(users));
    
    return { success: true, user: newUser };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
