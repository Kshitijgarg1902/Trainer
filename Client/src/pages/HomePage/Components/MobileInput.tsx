import { useState, useEffect, useRef } from 'react';
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  FieldValues,
} from 'react-hook-form';

type MobileInputProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  errors: FieldErrors<T>;
};

const getFlagUrl = (iso: string) =>
  `https://flagcdn.com/w40/${iso.toLowerCase()}.png`;

const countries = [
  { name: 'India', code: '+91', iso: 'in' },
  { name: 'United States', code: '+1', iso: 'us' },
  { name: 'United Kingdom', code: '+44', iso: 'gb' },
  { name: 'Canada', code: '+1', iso: 'ca' },
  { name: 'Germany', code: '+49', iso: 'de' },
  { name: 'Australia', code: '+61', iso: 'au' },
  { name: 'France', code: '+33', iso: 'fr' },
  { name: 'Brazil', code: '+55', iso: 'br' },
  { name: 'Russia', code: '+7', iso: 'ru' },
  { name: 'Japan', code: '+81', iso: 'jp' },
  { name: 'China', code: '+86', iso: 'cn' },
  { name: 'South Korea', code: '+82', iso: 'kr' },
  { name: 'Italy', code: '+39', iso: 'it' },
  { name: 'Mexico', code: '+52', iso: 'mx' },
  { name: 'Spain', code: '+34', iso: 'es' },
  { name: 'Netherlands', code: '+31', iso: 'nl' },
  { name: 'Switzerland', code: '+41', iso: 'ch' },
  { name: 'Sweden', code: '+46', iso: 'se' },
  { name: 'Singapore', code: '+65', iso: 'sg' },
  { name: 'South Africa', code: '+27', iso: 'za' },
];

const MobileInput = <T extends FieldValues>({
  register,
  setValue,
  errors,
}: MobileInputProps<T>) => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectCountry = (country: (typeof countries)[0]) => {
    setSelectedCountry(country);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue('countryCode' as any, country.code as any);
    setDropdownOpen(false);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue('countryCode' as any, selectedCountry.code as any);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col relative">
      <label
        htmlFor="mobileNumber"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Mobile Number
      </label>

      <div className="flex flex-row">
        {/* Country Code Selector */}
        <div className="w-20 border border-gray-300 rounded-md rounded-r-none">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex h-full w-full items-center px-3 bg-gray-100 hover:bg-gray-200 focus:outline-none"
          >
            <img
              src={getFlagUrl(selectedCountry.iso)}
              alt={selectedCountry.name}
              className="w-6 h-4 object-cover mr-2"
            />
            <span className="text-sm font-medium">{selectedCountry.code}</span>
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Number Input */}
        <input
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...register('mobileNumber' as any, {
            required: 'Mobile number is required',
            pattern: {
              value: /^[0-9]{10}$/,
              message: 'Enter a valid 10-digit Mobile number',
            },
          })}
          id="mobileNumber"
          type="number"
          inputMode="numeric"
          placeholder="Mobile number"
          className="w-full border border-gray-300 rounded-md rounded-l-none px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Country dropdown */}
      {dropdownOpen && (
        <div
          className="w-52 h-40 absolute top-full mt-1 z-50 bg-white border border-gray-300 rounded-md overflow-y-auto no-scrollbar shadow-lg"
          ref={dropdownRef}
        >
          {countries.map((country) => (
            <div
              key={country.iso}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => selectCountry(country)}
            >
              <img
                src={getFlagUrl(country.iso)}
                alt={country.name}
                className="w-6 h-4 object-cover mr-3"
              />
              <span className="flex-1">{country.name}</span>
              <span className="text-sm text-gray-500">{country.code}</span>
            </div>
          ))}
        </div>
      )}
      <div className="h-5">
        {errors.mobileNumber && (
          <p className="text-sm text-red-600">
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              errors.mobileNumber.message as any
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default MobileInput;
