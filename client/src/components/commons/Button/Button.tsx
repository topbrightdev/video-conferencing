import React, { DetailedHTMLProps, ButtonHTMLAttributes } from 'react';
import cx from 'classnames';

type ButtonDetailedProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

interface ButtonProps extends ButtonDetailedProps {
    size?: 'small' | 'medium' | 'large';
}
const Button: React.FC<ButtonProps> = ({ size = 'medium', className, children, ...props }) => {
    return (
        <button
            {...props}
            className={cx(
                'bg-green-600 hover:bg-green-500 focus:bg-green-700',
                'text-white',
                'rounded-sm border-2 border-green-600 hover:border-green-500 focus:border-green-700',
                {
                    'px-2 py-1 text-base': size === 'small',
                    'px-3 py-2 text-lg': size === 'medium',
                    'px-4 py-2 text-xl': size === 'large',
                },
            )}
        >
            {children}
        </button>
    );
};

export default Button;
