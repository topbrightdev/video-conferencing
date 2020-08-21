import React, { DetailedHTMLProps, ButtonHTMLAttributes } from 'react';
import cx from 'classnames';

type ButtonDetailedProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

interface ButtonProps extends ButtonDetailedProps {
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'secondary' | 'danger';
}
const Button: React.FC<ButtonProps> = ({
    size = 'medium',
    color = 'primary',
    className,
    children,
    ...props
}) => {
    return (
        <button
            {...props}
            className={cx(
                'text-white',
                'rounded-sm border-2 ',
                {
                    'bg-green-600 hover:bg-green-500 focus:bg-green-700 border-green-600 hover:border-green-500 focus:border-green-700':
                        color === 'primary',
                    'bg-blue-600 hover:bg-blue-500 focus:bg-blue-700 border-blue-600 hover:border-blue-500 focus:border-blue-700':
                        color === 'secondary',
                    'bg-red-600 hover:bg-red-500 focus:bg-red-700 border-red-600 hover:red-green-500 focus:border-red-700':
                        color === 'danger',
                    'px-2 py-1 text-sm': size === 'small',
                    'px-3 py-2 text-base': size === 'medium',
                    'px-4 py-2 text-md': size === 'large',
                    'opacity-50 cursor-not-allowed': props.disabled,
                },
                className,
            )}
        >
            {children}
        </button>
    );
};

export default Button;
