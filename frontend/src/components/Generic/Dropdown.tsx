import React, { useEffect, useRef, useState } from 'react';
import GenericInput from './Input';

interface DropdownInputProps {
    id: string;
    label: string;
    name: string;
    placeholder: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: (e: React.ChangeEvent<HTMLInputElement>) => void | undefined;
    searchResults: Array<any>;
    onSelect: (id: string, description: string) => void;
    width?:any;
    disabled?:boolean;
}

const GenericDropdown: React.FC<DropdownInputProps> = ({
    id,
    label,
    name,
    placeholder,
    width,
    value,
    disabled,
    onChange,
    onClick,
    searchResults,
    onSelect
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: any) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);
    return (
        <div className="dropdown-container" ref={containerRef}>
            <GenericInput
                id={id}
                label={label || ''}
                name={name}
                disabled={disabled}
                placeholder={placeholder}
                value={value}
                onChange={(e)=>{
                    onChange(e);
                    setIsOpen(true);
                    
                }}
                onClick={(e)=>{
                    setIsOpen(true);
                    onClick && onClick(e);
                }} 
                width={width}
            />
            {isOpen && searchResults.length > 0 ? (
                <ul className="dropdown-list" style={{ maxHeight: '300px', overflow: 'auto' }}>
                    {searchResults.map(result => (
                        <li
                            key={result.Id}
                            className="dropdown-item"
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            style={{
                                cursor: 'pointer',
                                padding: '5px',
                                marginBottom: '5px',
                                transition: 'background-color 0.3s ease'
                            }}
                            onClick={() => {
                                onSelect(result.Id, result.Description);
                                setIsOpen(false);
                            }}
                        >
                            {result.Description}
                        </li>
                    ))}
                </ul>
            ):""}
        </div>
    );
};


export default GenericDropdown;