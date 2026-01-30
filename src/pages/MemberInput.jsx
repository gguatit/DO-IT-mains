import '../css/MemberInput.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MemberInput() {
    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const checkUserId = async () => {
        if (!username.trim()) {
            alert('아이디를 입력하세요.');
            return;
        }

        try {
            // 간단하게 확인용 API 호출 (실패 시 사용 가능)
            const resp = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ username, password: 'temp', email: 'temp@temp.com' })
            });
            const data = await resp.json();
            
            if (resp.status === 409) {
                alert('이미 사용 중인 아이디입니다.');
            } else {
                alert('사용 가능한 아이디입니다.');
            }
        } catch (error) {
            alert('사용 가능한 아이디입니다.');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        // 입력 검증
        if (!username.trim() || !nickname.trim() || !password1 || !email.trim()) {
            alert('모든 필드를 입력하세요.');
            return;
        }

        if (password1 !== password2) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (password1.length < 4) {
            alert('비밀번호는 4자 이상이어야 합니다.');
            return;
        }

        // 회원가입 처리
        try {
            const resp = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    username,
                    nickname,
                    password: password1,
                    email
                })
            });

            const data = await resp.json();

            if (data.success) {
                alert('회원가입이 완료되었습니다!');
                navigate('/login');
            } else {
                alert(data.message || '회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('서버 요청 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="member-input-page">
            <div className="member-input-bg">
                <h3>회원가입</h3>
                <form onSubmit={handleSignup}>
                    <div className="member-input-content">
                        <div className="username">
                            <div className="userid">
                                <p>아이디</p>
                                <div className="userid-label">
                                    <input 
                                        id="userid" 
                                        type="text" 
                                        placeholder="아이디를 입력하세요"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    <button 
                                        className="userid-check" 
                                        type="button"
                                        onClick={checkUserId}
                                    >
                                        아이디 확인
                                    </button>
                                </div>
                            </div>
                            <div className="nickname">
                                <p>닉네임</p>
                                <input 
                                    id="nickname" 
                                    type="text" 
                                    placeholder="닉네임을 입력하세요"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                />
                            </div>
                        </div>
                        <p>비밀번호</p>
                        <input 
                            id="password1" 
                            type="password" 
                            placeholder="비밀번호를 입력하세요"
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                        />
                        <p>비밀번호 확인</p>
                        <input 
                            id="password2" 
                            type="password" 
                            placeholder="비밀번호를 입력하세요"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                        />
                        <p>이메일</p>
                        <input 
                            id="email" 
                            type="email" 
                            placeholder="이메일을 입력하세요"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="confirm">
                        <button type="submit">
                            회원가입
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default MemberInput;