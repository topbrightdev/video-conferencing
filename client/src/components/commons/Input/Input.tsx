import React, { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import cx from 'classnames';

type InputDetailProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

interface InputProps extends Omit<InputDetailProps, 'size'> {
    size?: 'small' | 'medium' | 'large';
}
const Input: React.FC<InputProps> = ({ size = 'medium', className, ...props }) => {
    return (
        <input
            {...props}
            className={cx(
                'rounded-md w-full outline-none',
                'hover:border-green-500 focus:border-green-600',
                {
                    'px-2 py-1 text-base border': size === 'small',
                    'px-4 py-2 text-lg border-2': size === 'medium',
                    'px-4 py-4 text-xl border-2': size === 'large',
                },
                className,
            )}
        />
    );
};

export default Input;
