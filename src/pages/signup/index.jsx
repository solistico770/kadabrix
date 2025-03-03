import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import kdb from '../../kadabrix/kadabrix';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    const { user, error } = await kdb.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setSuccessDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setSuccessDialogOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl" dir="rtl">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 bg-blue-600 p-3 rounded-full shadow-lg">
            <LockOutlinedIcon className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">הרשמה למערכת</h1>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">כתובת אימייל</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="example@mail.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">סיסמה</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">אשר סיסמה</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              dir="ltr"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            הרשמה למערכת
          </button>

          <div className="text-center mt-6">
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm"
            >
              כבר יש לך חשבון? התחבר עכשיו
            </a>
          </div>
        </form>

        {/* Success Dialog */}
        {successDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" dir="rtl">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">ברוכים הבאים למערכת קדבריקס</h3>
              <p className="text-gray-600 mb-6">
                נרשמת בהצלחה. עליך לאשר את המייל שנשלח אליך.
                <br />
                אנחנו כבר יודעים שנרשמת ונאשר אותך בהקדם.
              </p>
              <button
                onClick={handleDialogClose}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                סגור
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;