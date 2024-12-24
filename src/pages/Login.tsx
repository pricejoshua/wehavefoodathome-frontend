import React, { useState } from 'react';
import supabase from '../utils/supabase';
// initialize supabase client
// const supabaseUrl = process.env.SUPABASE_URL as string;
// const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
// console.log(supabaseUrl, supabaseKey)
// const supabase = createClient(supabaseUrl, supabaseKey);

function Login() {
    console.log("login")
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('Login successful!');
        }

        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    margin: '10px 0',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    margin: '10px 0',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                }}
            />
            <button
                onClick={handleLogin}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '10px',
                    margin: '10px 0',
                    borderRadius: '4px',
                    backgroundColor: '#007BFF',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    border: 'none',
                }}
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Login;
