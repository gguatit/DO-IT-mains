import '../css/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [keepLogin, setKeepLogin] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            alert('아이디와 비밀번호를 입력하세요.');
            return;
        }

        try {
            const resp = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await resp.json();

            if (data.success) {
                login(data.user);
                alert('로그인 성공!');
                navigate('/');
            } else {
                alert(data.message || '로그인 실패');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('서버 요청 중 오류가 발생했습니다.');
        }
    };

    return (
        <>
            <div className="login-page">
                <div className="login-page-content">
                    <h3>로그인</h3>
                    <form onSubmit={handleLogin}>
                        <input 
                            id="userid" 
                            type="text" 
                            placeholder="아이디를 입력하세요"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input 
                            id="password" 
                            type="password" 
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="login_bt">
                            <input 
                                className="keep-login" 
                                type="checkbox"
                                checked={keepLogin}
                                onChange={(e) => setKeepLogin(e.target.checked)}
                            />
                            <p>로그인상태 유지</p>
                        </div>
                        <div className="confirm">
                            <button type="submit">
                                로그인
                            </button>
                            <Link to={"/memberinput"} className='new-user'>회원가입</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
export default Login;