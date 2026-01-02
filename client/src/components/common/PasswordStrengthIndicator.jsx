import React from 'react';
import '../../styles/PasswordStrengthIndicator.css';

const PasswordStrengthIndicator = ({ password, showRequirements = true, theme = 'light' }) => {
    const requirements = [
        { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
        { label: 'Contains uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
        { label: 'Contains lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
        { label: 'Contains number', test: (pwd) => /[0-9]/.test(pwd) },
        { label: 'Contains special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
    ];

    const metRequirements = requirements.filter(req => req.test(password)).length;
    const strength = metRequirements === 0 ? 0 : metRequirements <= 2 ? 1 : metRequirements <= 4 ? 2 : 3;
    const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];
    const strengthColors = ['#E5E7EB', '#EF4444', '#F59E0B', '#10B981'];

    return (
        <div className={`password-strength-indicator ${theme}`}>
            {password && (
                <>
                    <div className="strength-bar-container">
                        <div
                            className="strength-bar"
                            style={{
                                width: `${(strength / 3) * 100}%`,
                                backgroundColor: strengthColors[strength]
                            }}
                        />
                    </div>
                    <p className="strength-label" style={{ color: strengthColors[strength] }}>
                        {strengthLabels[strength]}
                    </p>
                </>
            )}

            {showRequirements && password && (
                <ul className="requirements-list">
                    {requirements.map((req, index) => (
                        <li
                            key={index}
                            className={req.test(password) ? 'met' : 'unmet'}
                        >
                            <span className="requirement-icon">
                                {req.test(password) ? '✓' : '○'}
                            </span>
                            {req.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PasswordStrengthIndicator;
