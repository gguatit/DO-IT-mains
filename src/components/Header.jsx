import '../css/Header.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      navigate('/');
    }
  };

  return (
    <header className='project-header'>
      <div className='header-inner'>
        <div className='logo'>
          <Link to={'/'}>
            <img src='/images/logo.png' alt='로고'/>
          </Link>
        </div>
        <nav>
          <ul>
            <li>멘토/멘티</li>
            <Link to={'/post'}><li>커뮤니티</li></Link>
            <li>캘린더</li>
            <li>마이페이지</li>
          </ul>
        </nav>
        <div className='user'>
          {user ? (
            <>
              <span style={{ marginRight: '10px', fontWeight: 'bold' }}>
                {user.username}님
              </span>
              <button 
                onClick={handleLogout}
                className='login'
                style={{ cursor: 'pointer' }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to={"/Login"} className='login'>로그인</Link>
              <Link to={"/memberinput"} className='new-user'>회원가입</Link>
            </>
          )}
        </div>
        </div>
    </header>
    );
}

export default Header;